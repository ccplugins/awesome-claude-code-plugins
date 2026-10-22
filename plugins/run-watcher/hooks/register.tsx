import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Run, RunStatus, SlurmJob } from '../types'

const PANE = 'runs'
const FORGET_MS = 7 * 24 * 3_600_000
const TAIL_BYTES = 262_144

// Set from the plugin's options in register.
let POLL_MS = 15_000
let REMOTE_POLL_MS = 60_000
let STALL_MS = 10 * 60_000
let NOTIFY = true
let SHARE_SSH = true

const runs = atom({ plugin: 'run-watcher', key: 'runs' } as const, [] as Run[])
const checkedAt = atom({ plugin: 'run-watcher', key: 'checkedAt' } as const, 0)

// Training loss only. The first lookbehind skips `val_loss` and `eval/loss`; the second skips the
// same words written apart, as in `eval loss` or `Validation Loss:`.
const LOSS =
  /(?<![\w/])(?<!\b(?:val|valid|validation|eval|evaluation|test|dev)[\s_/-]?)(?:train(?:ing)?[_/ ]?)?loss\b["']?\s*[:=]?\s*["']?(?:tensor\()?(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?|nan|-?inf(?:inity)?)/i
const STEP = /(?<![\w/])(?:global_)?(?:step|iter(?:ation)?)\b["']?\s*[:=]?\s*["']?(\d+)/i
const CRASH =
  /Traceback \(most recent call last\)|CUDA out of memory|OutOfMemoryError|Segmentation fault|core dumped|^Killed\b|NCCL error|slurmstepd: error|oom[-_]kill/m
// How common trainers end: plain words, Hugging Face's Trainer, Lightning, and wandb's closing summary.
const DONE =
  /\b(training (?:is )?(?:complete|completed|finished|done)|(?:finished|done) training|training ended)\b|`Trainer\.fit` stopped|wandb: (?:Run summary|Synced)/i
// A training script run by something that runs it (not `cat train.py`), a distributed launcher, or sbatch.
const LAUNCH =
  /\b(?:python[\d.]*|uv run|nohup|srun)\b[^;&|]*?\b(?:train|finetune|pretrain|sweep)\w*\.py\b|\bpython[\d.]*\s+-m\s+\S*train|\btorchrun\b|\baccelerate launch\b|\bdeepspeed\b|\bsbatch\b/
const ALERTS: RunStatus[] = ['nan', 'spike', 'crashed', 'stalled']

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)] ?? 0
}

const parseLoss = (v: string) =>
  /nan/i.test(v) ? NaN : /inf/i.test(v) ? (v.startsWith('-') ? -Infinity : Infinity) : Number(v)

// A spike is two of the last three losses well above the median of the twenty before them: further than
// six median absolute deviations, and more than 10% of the median, so a single noisy step or a flat
// loss with a near-zero spread does not count.
export const isSpike = (finite: number[]) => {
  const prev = finite.slice(-23, -3)
  if (prev.length < 10) return false
  const med = median(prev)
  const mad = median(prev.map(x => Math.abs(x - med)))
  const limit = Math.max(6 * mad, 0.1 * Math.abs(med))
  return limit > 0 && finite.slice(-3).filter(x => x - med > limit).length >= 2
}

export const analyze = (text: string, mtimeMs: number, now: number, stallMs = STALL_MS) => {
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean)
  const losses: number[] = []
  let step: number | undefined
  let lastLossLine = -1
  let lastCrashLine = -1
  lines.forEach((line, i) => {
    const l = LOSS.exec(line)?.[1]
    if (l !== undefined) {
      losses.push(parseLoss(l))
      lastLossLine = i
    }
    const s = STEP.exec(line)?.[1]
    if (s !== undefined) step = Number(s)
    if (CRASH.test(line)) lastCrashLine = i
  })
  const finite = losses.filter(Number.isFinite)
  const last = losses.at(-1)
  // A traceback that training carried on past (a caught exception, a warning) is not a crash.
  const isCrashed = lastCrashLine >= 0 && lastCrashLine >= lines.length - 60 && lastCrashLine > lastLossLine

  const status: RunStatus =
    last !== undefined && !Number.isFinite(last) ? 'nan'
    : isCrashed ? 'crashed'
    : DONE.test(lines.slice(-20).join('\n')) ? 'done'
    : isSpike(finite) ? 'spike'
    : stallMs > 0 && now - mtimeMs > stallMs ? 'stalled'
    : 'running'

  return { status, step, losses: losses.slice(-200), lastLine: (lines.at(-1) ?? '').slice(0, 300) }
}

// `host:/path` or `host:~/path`, as scp writes it. Anything else is a local path.
export const parseTarget = (spec: string): { host?: string; path: string } => {
  const m = spec.match(/^((?:[\w.-]+@)?[\w.-]+):((?:\/|~\/).*)$/)
  return m?.[1] !== undefined && m[2] !== undefined ? { host: m[1], path: m[2] } : { path: spec }
}

// `hpc:job/4242`: a Slurm job on a host, watched through the log Slurm says it writes.
export const parseJob = (spec: string): SlurmJob | undefined => {
  const m = spec.match(/^((?:[\w.-]+@)?[\w.-]+):job\/(\d+)$/)
  return m?.[1] !== undefined && m[2] !== undefined ? { host: m[1], id: m[2] } : undefined
}

const sq = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`
// One ssh round trip per read: for a Slurm job, `JOB` and its state first (sacct's, which outlives the job,
// else squeue's, for clusters without accounting; nothing once Slurm has forgotten it); then MISSING, or the
// mtime in seconds then the log's tail.
export const remoteScript = (path: string, job?: string) => {
  const f = path.startsWith('~/') ? `"$HOME"/${sq(path.slice(2))}` : sq(path)
  const state =
    job === undefined ? ''
    : `s=$(sacct -j ${job} -X -n -P -o State 2>/dev/null | head -n 1); [ -n "$s" ] || s=$(squeue -h -j ${job} -o %T 2>/dev/null | head -n 1); echo "JOB $s"; `
  return `${state}f=${f}; if [ ! -e "$f" ]; then echo MISSING; exit 0; fi; stat -c %Y "$f" 2>/dev/null || stat -f %m "$f"; tail -c ${TAIL_BYTES} "$f"`
}

// Where a job writes its output: scontrol says while slurmctld holds the job (until minutes after it ends),
// sacct after that, on Slurm versions that record it.
export const jobLogScript = (id: string) =>
  `scontrol show job ${id} 2>/dev/null || sacct -j ${id} -X -n -P -o WorkDir,StdOut 2>/dev/null; exit 0`

// The log path in scontrol's `StdOut=` (made whole with `WorkDir=`) or sacct's `workdir|stdout`, with the job id
// filled in; nothing when Slurm gave none or left a pattern only it can fill (%x, %N).
export const parseJobLog = (text: string, id: string) => {
  const isScontrol = /\bJobId=/.test(text)
  const field = (key: string) => text.match(new RegExp(`^\\s*${key}=(.*)$`, 'm'))?.[1]
  const acct = isScontrol ? undefined : text.split('\n').find(l => l.includes('|'))?.split('|')
  const dir = (isScontrol ? field('WorkDir') : acct?.[0])?.trim() ?? ''
  const out = ((isScontrol ? field('StdOut') : acct?.[1]) ?? '').trim().replace(/%[jA]/g, id)
  if (out === '' || out === '(null)' || out.includes('%')) return undefined
  return out.startsWith('/') ? out : dir.startsWith('/') ? `${dir.replace(/\/$/, '')}/${out}` : undefined
}

// The state word sacct or squeue printed (`CANCELLED by 1234` is CANCELLED); nothing when they knew no such job.
export const slurmState = (text: string) => text.trim().match(/^[A-Z][A-Z_]*/)?.[0]

const QUEUED = /^(?:PENDING|CONFIGURING|REQUEUED|REQUEUE_HOLD|REQUEUE_FED|RESV_DEL_HOLD)$/
const FAILED = /^(?:FAILED|NODE_FAIL|BOOT_FAIL|OUT_OF_MEMORY|TIMEOUT)$/

// Slurm decides whether a job is waiting, finished, failed or cancelled. While it runs (or in a state with no
// verdict, or once Slurm has forgotten it) the log decides, so a NaN or a spike still counts.
export const jobStatus = (state: string | undefined, fromLog: RunStatus): RunStatus =>
  state === undefined ? fromLog
  : QUEUED.test(state) ? 'pending'
  : state === 'COMPLETED' ? 'done'
  : FAILED.test(state) ? 'crashed'
  : state === 'CANCELLED' ? 'cancelled'
  : fromLog

const hasEnded = (state: string | undefined) => ['done', 'crashed', 'cancelled'].includes(jobStatus(state, 'running'))

// Reads reuse one connection per host for two minutes. The socket's path stays short, as macOS allows about
// 104 characters: %C is ssh's hash of the local host, host, port and user.
export const sshArgv = (host: string, script: string, isShared = SHARE_SSH) => [
  'ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=8',
  ...(isShared ? ['-o', 'ControlMaster=auto', '-o', 'ControlPersist=120', '-o', 'ControlPath=~/.ssh/cm-rw-%C'] : []),
  host, script,
]

// ssh's options that take a value, so the host is the first word after them
const SSH_ARG_OPTS = new Set(['-b', '-c', '-D', '-E', '-e', '-F', '-I', '-i', '-J', '-L', '-l', '-m', '-O', '-o', '-p', '-Q', '-R', '-S', '-W', '-w'])

const unquote = (s: string) => s.replace(/^(["'])([\s\S]*)\1$/, '$2')

// `ssh [options] host 'remote command'`: the host and the command it runs, when the whole command is one.
export const splitSsh = (command: string): { host: string; remote: string } | undefined => {
  const m = command.trim().match(/^ssh\s+([\s\S]*)$/)
  if (!m?.[1]) return undefined
  const words = m[1].match(/"[^"]*"|'[^']*'|\S+/g) ?? []
  let i = 0
  while (i < words.length && words[i]?.startsWith('-')) i += SSH_ARG_OPTS.has(words[i] ?? '') ? 2 : 1
  const host = words[i]
  if (host === undefined || i + 1 >= words.length) return undefined
  return { host, remote: unquote(words.slice(i + 1).join(' ')) }
}

// `job`: the id of the Slurm job that writes the log
export type FoundLog = { path: string; isGuess: boolean; job?: string }

// The logs a training launch writes: shell redirects, tee, a Slurm job's output file, or the output
// file of a command run in the background. Relative paths are resolved against the last `cd` before
// the launch, else `base` (the session's directory, or ~ on a remote host).
export const findLogs = (command: string, output: string | undefined, isBackground: boolean, home: string, base: string): FoundLog[] => {
  const ssh = splitSsh(command)
  const cmd = ssh?.remote ?? command
  const vars: Record<string, string> = { HOME: ssh ? '~' : home }
  for (const m of cmd.matchAll(/(?:^|[;&\s])([A-Za-z_]\w*)=("[^"]*"|'[^']*'|[^\s;&|]+)/g)) {
    if (m[1] !== undefined && m[2] !== undefined) vars[m[1]] = unquote(m[2])
  }
  const expand = (s: string) =>
    s.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (all, name: string) => vars[name] ?? all).replace(/^~(?=\/|$)/, ssh ? '~' : home)
  const launchAt = cmd.search(LAUNCH)
  const cds = [...cmd.slice(0, launchAt < 0 ? undefined : launchAt).matchAll(/(?:^|[;&|]\s*)cd\s+("[^"]+"|'[^']+'|[^\s;&|]+)/g)]
  const cd = cds.at(-1)?.[1]
  const dir = cd !== undefined ? expand(unquote(cd)) : ssh ? '~' : base
  const resolve = (p: string) => {
    const e = expand(p)
    if (e.startsWith('/') || e.startsWith('~/')) return e
    const d = dir.startsWith('/') || dir.startsWith('~') ? dir : `${ssh ? '~' : base}/${dir}`
    return `${d.replace(/\/$/, '')}/${e.replace(/^\.\//, '')}`
  }
  const groups = (text: string, re: RegExp) => [...text.matchAll(re)].flatMap(m => (m[1] === undefined ? [] : [m[1]]))

  const found: FoundLog[] = [
    ...groups(cmd, /(?:\d?>>?|&>>?)\s*["']?([^\s"'&|;<>]+)/g),
    ...groups(cmd, /\btee\s+(?:-a\s+)?["']?([^\s"'&|;<>]+)/g),
  ]
    .filter(p => !p.startsWith('/dev/') && !/^&?\d$/.test(p))
    .map(p => ({ path: resolve(p), isGuess: false }))

  // sbatch prints the job id; the log is --output with %j filled in, or Slurm's default slurm-<id>.out,
  // which an #SBATCH line in the script may override, hence a guess. A pattern left in (%x, the job name)
  // is Slurm's to fill, so that is a guess too; scontrol replaces either where it can.
  const job = /\bsbatch\b/.test(cmd) ? output?.match(/Submitted batch job (\d+)/)?.[1] : undefined
  if (job !== undefined) {
    const flag = cmd.match(/\bsbatch\b[^;&|]*?(?:--output[= ]|-o\s*)["']?([^\s"';&|]+)/)?.[1]
    const path = flag === undefined ? `slurm-${job}.out` : flag.replace(/%[jA]/g, job)
    found.push({ path: resolve(path), isGuess: flag === undefined || path.includes('%'), job })
  }
  if (isBackground && !ssh && output !== undefined) {
    found.push(...groups(output, /(\/[^\s"'`]+\.(?:output|out|log|txt))\b/g).map(path => ({ path, isGuess: false })))
  }

  const unique = new Map<string, FoundLog>()
  for (const f of found) {
    const path = ssh ? `${ssh.host}:${f.path}` : f.path
    if (!unique.has(path)) unique.set(path, { ...f, path })
  }
  return [...unique.values()]
}

export const isLaunch = (command: string, isBackground: boolean) => {
  const cmd = splitSsh(command)?.remote ?? command
  return LAUNCH.test(cmd) || (isBackground && /\b(python3?|uv run)\b/.test(cmd))
}

type Saved = Pick<Run, 'path' | 'label' | 'addedAt' | 'job'>

// A run's job is kept too, so a run picked up again in a later session still reads Slurm's state.
const remember = ($: EngineInterface, list: Run[]) =>
  $.store.set('runs', list.map(({ path, label, addedAt, job }): Saved => (job === undefined ? { path, label, addedAt } : { path, label, addedAt, job })))

const fresh = (path: string, label: string, addedAt: number, isGuess = false, job?: SlurmJob): Run => ({
  path, label, addedAt, isGuess, job, mtimeMs: 0, polledAt: 0, isSeen: false, status: 'running', losses: [], lastLine: '',
})

const watch = async ($: EngineInterface, spec: string, label?: string, isGuess = false, job?: SlurmJob) => {
  const { host, path } = parseTarget(spec)
  let key: string
  if (host !== undefined) {
    key = `${host}:${path}`
  } else {
    const real = (await $.fs.stat(path, { resolve: true }).catch(() => undefined))?.realPath
    if (real === undefined) return undefined
    key = real
  }
  const name = label ?? `${host !== undefined ? `${host}:` : ''}${path.split('/').slice(-2).join('/')}`
  const now = await $.clock.now()
  const list = await update($, runs, list =>
    list.some(r => r.path === key)
      ? list.map(r => (r.path === key && r.job === undefined && job !== undefined ? { ...r, job } : r))
      : [...list, fresh(key, name, now, isGuess, job)],
  )
  await remember($, list)
  void poll($)
  void $.ui.open({ id: PANE, title: 'Runs' })

  return key
}

// Where a job on a host writes its output, as Slurm says; `path` is unset when Slurm can't say.
const jobLog = async ($: EngineInterface, job: SlurmJob) => {
  const r = await $.process.run(sshArgv(job.host, jobLogScript(job.id)), { timeoutMs: 30_000 }).catch(() => undefined)
  if (r === undefined || r.exitCode !== 0) return { isReachable: false }
  return { isReachable: true, path: parseJobLog(r.stdout, job.id) }
}

// `/x/runs/demo_run2.log` -> `demo_run2`; a label the user gave is kept as is.
const shortName = (run: Run) =>
  run.label.includes('/') ? (run.path.split('/').at(-1) ?? run.path).replace(/\.(log|out|output|txt)$/, '') : run.label

const fmtLoss = (x: number | undefined) => (x === undefined ? '' : Number.isFinite(x) ? x.toPrecision(3) : String(x))

const ago = (ms: number, now: number) => {
  const s = Math.max(0, Math.round((now - ms) / 1000))
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.round(s / 60)}m` : `${Math.round(s / 3600)}h`
}

// Slurm's reason for a failed job, where it says more than that it failed.
const CAUSE: Record<string, string> = { OUT_OF_MEMORY: 'out of memory', TIMEOUT: 'time limit' }
const crashWord = (run: Run) => {
  const cause = CAUSE[run.jobState ?? '']
  return cause === undefined ? 'crashed' : `crashed (${cause})`
}

const describe = (run: Run, now: number) => {
  const at = run.step !== undefined ? ` at step ${run.step}` : ''
  switch (run.status) {
    case 'nan': return `loss went NaN${at}`
    case 'spike': return `loss spiked to ${fmtLoss(run.losses.at(-1))}${at}`
    case 'crashed': return `${crashWord(run)}${at}`
    case 'stalled': return `no new output for ${ago(run.mtimeMs, now)}`
    case 'missing': return 'log file gone'
    case 'unreachable': return run.sshError ?? `can't reach ${parseTarget(run.path).host ?? 'host'}`
    case 'pending': return 'waiting in the queue'
    case 'cancelled': return 'cancelled'
    case 'done': return 'finished'
    case 'running': return [run.step !== undefined ? `step ${run.step}` : '', run.losses.length > 0 ? `loss ${fmtLoss(run.losses.at(-1))}` : ''].filter(Boolean).join(', ') || 'running'
  }
}

// Problems first and in words; otherwise one healthy run in detail, or a count, and how many jobs wait.
const statusLine = (list: Run[], now: number) => {
  const bad = list.filter(r => ALERTS.includes(r.status))
  if (bad.length > 0) {
    const shown = bad.slice(0, 2).map(r => `${shortName(r)} ${describe(r, now)}`).join(' · ')
    return bad.length > 2 ? `${shown} · +${bad.length - 2} more` : shown
  }
  const live = list.filter(r => r.status === 'running')
  const queued = list.filter(r => r.status === 'pending').length
  const ok = live.length === 1 && live[0] !== undefined ? `${shortName(live[0])} ok: ${describe(live[0], now)}` : live.length > 1 ? `${live.length} runs ok` : ''
  if (ok !== '') return queued > 0 ? `${ok} · ${queued} pending` : ok
  if (queued > 0) return `${queued} run${queued > 1 ? 's' : ''} pending`
  return list.length > 0 ? `${list.length} run${list.length > 1 ? 's' : ''} finished` : undefined
}

// Why ssh failed, from its own message, in words that say what to do. Under BatchMode a key that needs its
// passphrase, or a host key not yet trusted, fails exactly like a dead network unless told apart here.
export const sshProblem = (stderr: string, host: string) => {
  if (/Permission denied \(/.test(stderr)) return `login to ${host} refused (is your key loaded in ssh-agent?)`
  if (/Host key verification failed|REMOTE HOST IDENTIFICATION HAS CHANGED/.test(stderr)) {
    return `${host}'s host key is not trusted yet (ssh to it once to accept it)`
  }
  if (/Could not resolve hostname/.test(stderr)) return `can't resolve ${host}`
  const why = /timed out/i.test(stderr) ? 'timed out'
    : /No route to host|Network is unreachable/.test(stderr) ? 'no route'
    : /Connection refused/.test(stderr) ? 'connection refused'
    : ''
  return why ? `can't reach ${host} (${why})` : `can't reach ${host}`
}

// One read of one log: the fields it changes. Remote logs are read over ssh, in one round trip, with the
// state of the Slurm job that writes them.
const readRun = async ($: EngineInterface, run: Run, now: number): Promise<Partial<Run>> => {
  const { host, path } = parseTarget(run.path)
  if (host !== undefined) {
    const r = await $.process.run(sshArgv(host, remoteScript(path, run.job?.id)), { timeoutMs: 30_000 }).catch(() => undefined)
    if (r === undefined) return { status: 'unreachable', sshError: `can't reach ${host} (timed out)` }
    if (r.exitCode !== 0) return { status: 'unreachable', sshError: sshProblem(r.stderr, host) }
    const head = run.job !== undefined ? r.stdout.match(/^JOB(.*)\n/) : null
    const out = head === null ? r.stdout : r.stdout.slice(head[0].length)
    // An ended job stays ended once squeue forgets it, minutes later, on clusters without accounting.
    const said = head === null ? undefined : slurmState(head[1] ?? '')
    const jobState = said ?? (hasEnded(run.jobState) ? run.jobState : undefined)
    const nl = out.indexOf('\n')
    const first = (nl < 0 ? out : out.slice(0, nl)).trim()
    if (first === 'MISSING') {
      const status = jobStatus(jobState, 'missing')
      // Nothing at a guessed path is the wrong guess, unless the job has yet to start writing.
      return { jobState, sshError: undefined, status: run.isGuess && status !== 'pending' ? 'missing' : status }
    }
    const mtimeMs = Number(first) * 1000
    if (!Number.isFinite(mtimeMs)) return { status: 'unreachable', sshError: `unexpected reply from ${host}` }
    const log = analyze(nl < 0 ? '' : out.slice(nl + 1), mtimeMs, now)
    return { mtimeMs, isGuess: false, jobState, sshError: undefined, ...log, status: jobStatus(jobState, log.status) }
  }
  const stat = await $.fs.stat(path).catch(() => undefined)
  if (stat === undefined) return { status: 'missing' }
  const { stdout } = await $.process.run(['tail', '-c', String(TAIL_BYTES), path])
  return { mtimeMs: stat.mtimeMs, isGuess: false, ...analyze(stdout, stat.mtimeMs, now) }
}

let isPolling = false

const poll = async ($: EngineInterface) => {
  if (isPolling) return
  isPolling = true
  try {
    const now = await $.clock.now()
    const before = await read($, runs)
    const after = await Promise.all(
      before.map(async (run): Promise<Run> => {
        const isRemote = parseTarget(run.path).host !== undefined
        if (run.isSeen && now - run.polledAt < (isRemote ? REMOTE_POLL_MS : POLL_MS) - 1000) return run
        return { ...run, ...(await readRun($, run, now)), polledAt: now, isSeen: true }
      }),
    )

    // A guessed Slurm log not there while its job runs or has run was the wrong guess (a read that finds the
    // log clears isGuess): drop it and say how to add the right one.
    const dropped = after.filter(r => r.isGuess && r.status === 'missing')
    for (const r of dropped) $.ui.toast(`run-watcher: no log at ${r.path}; /watch host:path to add the job's log`)

    for (const run of after) {
      const was = before.find(r => r.path === run.path)
      // Only changes after the first read: a log found already crashed or finished is shown, not announced.
      if (!was?.isSeen || run.status === was.status) continue
      if (ALERTS.includes(run.status)) {
        const msg = `${shortName(run)}: ${describe(run, now)}`
        $.ui.toast(msg)
        if (NOTIFY) void $.ui.notify(msg, { title: 'Run watcher' })
      } else if (run.status === 'done' || run.status === 'cancelled') {
        $.ui.toast(`${shortName(run)}: ${describe(run, now)}`)
      }
    }

    const list = await update($, runs, list =>
      list.flatMap(r => (dropped.some(d => d.path === r.path) ? [] : [after.find(a => a.path === r.path) ?? r])),
    )
    if (dropped.length > 0) await remember($, list)
    await update($, checkedAt, () => now)
    $.ui.status(statusLine(list, now))
  } finally {
    isPolling = false
  }
}

const SPARK = '▁▂▃▄▅▆▇█'
const sparkline = (xs: number[], width: number) => {
  const shown = xs.slice(-width)
  const finite = shown.filter(Number.isFinite)
  const lo = Math.min(...finite)
  const hi = Math.max(...finite)
  return shown
    .map(x => (!Number.isFinite(x) ? '!' : hi === lo ? SPARK[3] : SPARK[Math.round(((x - lo) / (hi - lo)) * (SPARK.length - 1))]))
    .join('')
}

const COLOR: Record<RunStatus, string> = {
  running: 'success', pending: 'subtle', done: 'suggestion', cancelled: 'inactive', stalled: 'warning', spike: 'warning',
  nan: 'error', crashed: 'error', missing: 'inactive', unreachable: 'warning',
}

export const register: Register = (on, options) => {
  POLL_MS = Math.max(5, Number(options.pollSeconds ?? 15)) * 1000
  REMOTE_POLL_MS = Math.max(15, Number(options.remotePollSeconds ?? 60)) * 1000
  STALL_MS = Math.max(0, Number(options.stallMinutes ?? 10)) * 60_000
  NOTIFY = options.notify !== false
  SHARE_SSH = options.reuseSsh !== false

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'watch',
      description: 'Watch a training log or a Slurm job in the Runs pane (no path: open the pane)',
      argumentHint: '[log path | host:path | host:job/<id>] [label]',
    })
    await $.command.register({ name: 'unwatch', description: 'Stop watching a log', argumentHint: '<path | label | host:job/<id> | all>' })

    const now = await $.clock.now()
    const saved = ((await $.store.get('runs')) ?? []) as Saved[]
    const kept = saved.filter(r => now - r.addedAt < FORGET_MS)
    await update($, runs, list => (list.length > 0 ? list : kept.map(r => fresh(r.path, r.label, r.addedAt, false, r.job))))
    $.clock.every(POLL_MS, () => poll($))
    if (kept.length > 0) void poll($)

    return next(e)
  })

  on('command.run', { command: 'watch' }, async ($, e) => {
    const [path, ...words] = e.args.trim().split(/\s+/).filter(Boolean)
    if (path === undefined) {
      await $.ui.open({ id: PANE, title: 'Runs' })
      return { text: 'Runs pane opened.' }
    }
    const label = words.length > 0 ? words.join(' ') : undefined
    const job = parseJob(path)
    if (job !== undefined) {
      const found = await jobLog($, job)
      if (!found.isReachable) return { text: `Can't reach ${job.host}.` }
      if (found.path === undefined) return { text: `Slurm on ${job.host} gave no output file for job ${job.id}.` }
      const key = await watch($, `${job.host}:${found.path}`, label, false, job)
      return { text: `Watching ${key}, the log of job ${job.id}.` }
    }
    const key = await watch($, path, label)

    return { text: key === undefined ? `No file at ${path}.` : `Watching ${key}.` }
  })

  on('command.run', { command: 'unwatch' }, async ($, e) => {
    const arg = e.args.trim()
    const job = parseJob(arg)
    const isJob = (r: Run) => job !== undefined && r.job?.id === job.id && r.job.host === job.host
    const list = await update($, runs, list =>
      arg === 'all' ? [] : list.filter(r => r.path !== arg && r.label !== arg && !r.path.endsWith(`/${arg}`) && !isJob(r)),
    )
    await remember($, list)
    void poll($)

    return { text: `Watching ${list.length} run${list.length === 1 ? '' : 's'}.` }
  })

  // Pick up logs from training launches, local or over ssh: shell redirects, tee, a Slurm job's output,
  // or a background task's output file.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    const isBackground = e.run_in_background === true
    if (ran.deny !== undefined || !isLaunch(e.command, isBackground)) return ran

    const home = (await $.env.get('HOME')) ?? ''
    // What the model read; from a hook that answered the call itself, the tool's own output.
    const own = ran.result as { stdout?: string; stderr?: string } | undefined
    const output = ran.text ?? [own?.stdout, own?.stderr].filter(Boolean).join('\n')
    const logs = findLogs(e.command, output, isBackground, home, await $.session.cwd())
    const watched = await Promise.all(
      logs.map(async l => {
        const host = parseTarget(l.path).host
        if (l.job === undefined || host === undefined) return watch($, l.path, undefined, l.isGuess)
        const job = { id: l.job, host }
        // Slurm knows where the job writes, whatever #SBATCH lines the script holds; the guess is the fallback.
        const real = l.isGuess ? (await jobLog($, job)).path : undefined
        if (real !== undefined) return watch($, `${host}:${real}`, undefined, false, job)
        return l.path.includes('%') ? undefined : watch($, l.path, undefined, l.isGuess, job)
      }),
    )
    if (!watched.some(p => p !== undefined)) {
      $.ui.toast('run-watcher: saw a training launch but found no log file; /watch <path> to add it')
    }

    return ran
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, runs)
    const checked = await read($, checkedAt)
    const now = await $.clock.now()
    const width = Math.max(10, (e.props.bodyColumns ?? 40) - 2)

    return (
      <Box flexDirection="column">
        <Text dimColor>
          {list.length} watched · checked {checked > 0 ? `${ago(checked, now)} ago` : 'never'}
        </Text>
        {list.length === 0 && (
          <Text dimColor>Nothing watched. /watch &lt;log&gt;, /watch host:path or /watch host:job/&lt;id&gt;, or launch a train*.py with its output redirected to a file.</Text>
        )}
        {list.map(run => {
          const last = run.losses.at(-1)
          return (
            <Box key={run.path} flexDirection="column" marginTop={1}>
              <Box flexDirection="row" justifyContent="space-between">
                <Text wrap="truncate-end">
                  <Text bold>{run.label}</Text> <Text color={COLOR[run.status]}>{run.status === 'unreachable' ? describe(run, now) : run.status === 'crashed' ? crashWord(run) : run.status}</Text>
                  {run.step !== undefined ? ` · step ${run.step}` : ''}
                  {last !== undefined ? ` · loss ${Number.isFinite(last) ? last.toPrecision(4) : String(last)}` : ''}
                  {run.mtimeMs > 0 ? ` · ${ago(run.mtimeMs, now)}` : ''}
                </Text>
                <Button
                  key={`unwatch:${run.path}`}
                  plain
                  onPress={async () => {
                    await remember($, await update($, runs, l => l.filter(r => r.path !== run.path)))
                  }}
                >
                  ×
                </Button>
              </Box>
              {run.losses.length > 1 && <Text color={COLOR[run.status]}>{sparkline(run.losses, width)}</Text>}
              <Text dimColor wrap="truncate-end">
                {run.lastLine}
              </Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}
