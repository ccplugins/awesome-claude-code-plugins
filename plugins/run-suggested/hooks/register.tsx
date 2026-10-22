import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Armed, Commands, Risk, Run } from '../types'

const commands = atom({ plugin: 'run-suggested', key: 'commands' } as const, [] as Commands)
const armed = atom({ plugin: 'run-suggested', key: 'armed' } as const, null as Armed)
const runs = atom({ plugin: 'run-suggested', key: 'runs' } as const, [] as Run[])

const MAX = 9
const SHELL_LANGS = new Set(['sh', 'bash', 'zsh', 'shell', 'console'])
const TAIL_LINES = 6
const CONTEXT_CHARS = 8000
const KEEP_CHARS = 200000

const CONVENTION = `# Commands for the user to run
When you suggest a shell command for the user to run themselves, put it in a fenced \`\`\`sh block, one command per line, with no prompt characters, comments or output in that block. The terminal turns each line into a numbered shortcut the user can run with a key, and attaches the output to their next message. Use other fence languages (text, json, ...) for output, config, examples and anything that is not meant to be run, and never put example commands in a sh block.`

// Commands from a turn's final answer: every line of a sh/bash/zsh/shell/console fence. A trailing
// backslash joins lines, comments and blank lines are skipped, "$ " and "! " prefixes dropped.
export function extract(answer: string): string[] {
  const found: string[] = []
  const add = (cmd: string) => {
    const c = cmd.trim().replace(/^[$!]\s*/, '').trim()
    // Starts like a command (a name, a path, a variable), so placeholders and stray punctuation don't become rows
    if (/^[\w.~/$]/.test(c) && !found.includes(c)) found.push(c)
  }
  let fence: string | null = null
  let isShell = false
  let pending = ''
  for (const raw of answer.split('\n')) {
    const line = raw.trimEnd()
    const open = line.match(/^\s*(```+|~~~+)\s*([\w-]*)/)
    if (fence === null && open) {
      fence = open[1] ?? '```'
      isShell = SHELL_LANGS.has((open[2] ?? '').toLowerCase())
      continue
    }
    if (fence === null) continue
    if (line.trim().startsWith(fence)) {
      if (pending) add(pending)
      fence = null
      pending = ''
      continue
    }
    if (!isShell) continue
    const body = line.trim()
    if (body.endsWith('\\')) {
      pending += body.slice(0, -1).trimEnd() + ' '
      continue
    }
    add(pending + body)
    pending = ''
  }
  return found.slice(0, MAX)
}

export type Rules = { allow: string[]; ask: string[]; deny: string[] }

// A Bash(...) rule body as a whole-command matcher: "*" is any text, a legacy "git:*" is "git *",
// a bare "Bash" matches everything.
const matcher = (rule: string): RegExp | null => {
  if (rule === 'Bash') return /^.*$/s
  const m = rule.match(/^Bash\((.*)\)$/s)
  if (!m || m[1] === undefined) return null
  const body = m[1].replace(/:\*$/, ' *')
  const re = body.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  // "git *" also matches a bare "git", as Claude Code's prefix rules do
  return new RegExp(`^${re.replace(/ \.\*$/, '( .*)?')}$`, 's')
}

// The simple commands in a compound one: split at &&, ||, ; and | outside quotes and backslash escapes.
export function splitCommand(cmd: string): string[] {
  const parts: string[] = []
  let cur = ''
  let quote: '"' | "'" | null = null
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i] ?? ''
    if (quote) {
      if (c === '\\' && quote === '"') {
        cur += c + (cmd[++i] ?? '')
        continue
      }
      if (c === quote) quote = null
      cur += c
      continue
    }
    if (c === '\\') {
      cur += c + (cmd[++i] ?? '')
      continue
    }
    if (c === '"' || c === "'") {
      quote = c
      cur += c
      continue
    }
    const two = cmd.slice(i, i + 2)
    if (two === '&&' || two === '||' || c === ';' || c === '|') {
      parts.push(cur)
      cur = ''
      if (two === '&&' || two === '||') i++
      continue
    }
    cur += c
  }
  parts.push(cur)
  return parts.map(p => p.trim()).filter(Boolean)
}

// How the rules treat a command, as Claude Code ranks them: deny over ask over allow. A compound command
// (&&, ||, ;, |) is as risky as its riskiest part, and allowed only when every part is.
export function classify(cmd: string, rules: Rules): Risk {
  const hits = (list: string[], part: string) => list.some(r => matcher(r)?.test(part) ?? false)
  const parts = splitCommand(cmd)
  const each = parts.map((p): Risk => (hits(rules.deny, p) ? 'deny' : hits(rules.ask, p) ? 'ask' : hits(rules.allow, p) ? 'allow' : 'default'))
  for (const r of ['deny', 'ask', 'default'] as const) if (each.includes(r)) return r
  return 'allow'
}

// A rounded frame with the name in its top border, in the style of a boxed status line. Colours are
// Claude Code theme names (so they follow light and dark) or hex values, set by the plugin's options.
let FRAME = 'subtle'
let MUT = 'inactive'
let ICON = '\u203a_'
let INDENT = 2
const ICONS: Record<string, string> = { text: '\u203a_', 'nerd-font': '\uf120', none: '' }

const width = (s: string) => [...s].length
const clip = (s: string, n: number) => (n <= 0 ? '' : width(s) <= n ? s : [...s].slice(0, n - 1).join('') + '…')
const dashes = (n: number) => '─'.repeat(Math.max(1, n))
const seconds = (ms: number) => (ms < 10000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms / 1000)}s`)
const clock = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const register: Register = (on, options) => {
  FRAME = String(options.frameColor || FRAME)
  MUT = String(options.detailColor || MUT)
  ICON = ICONS[String(options.icon)] ?? ICON
  INDENT = Math.max(0, Number(options.indent ?? INDENT))

  // Running children by row, so a second press can stop one. Module state: a reload kills them anyway.
  const live = new Map<number, { stop: () => void }>()
  // How many runs existed when the current "run all" started, for its n/N counter
  let allStart = 0

  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)
    return { ...r, sections: [...r.sections, { id: 'run-suggested', text: CONVENTION, scope: 'session' }] }
  })

  // The next prompt carries what was run, so Claude sees it as it would a `!` command's output.
  on('prompt.submit', async ($, e, next) => {
    const done = (await read($, runs).catch(() => [] as Run[])).filter(r => !r.isRunning)
    for (const l of live.values()) l.stop()
    void update($, commands, () => []).catch(() => undefined)
    void update($, armed, () => null).catch(() => undefined)
    void update($, runs, () => []).catch(() => undefined)
    if (done.length === 0 || e.command) return next(e)
    const block = [
      'The user ran these commands you suggested, from the shortcut row above their prompt:',
      ...done.map(r => {
        const how = r.isStopped ? 'stopped by the user' : `exit ${r.exitCode ?? 'did not start'}`
        return `$ ${r.cmd}\n(${how}, ${seconds(r.ms)})\n${r.output.slice(-CONTEXT_CHARS)}`
      }),
    ].join('\n\n')
    return next({ ...e, context: [...(e.context ?? []), block] })
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && !e.isAborted) {
      const found = extract(e.answer)
      let rules: Rules = { allow: [], ask: [], deny: [] }
      try {
        const p = ((await $.settings.read()) as { permissions?: Partial<Rules> }).permissions ?? {}
        rules = { allow: p.allow ?? [], ask: p.ask ?? [], deny: p.deny ?? [] }
      } catch {
        // No readable rules: everything needs two presses.
      }
      await update($, commands, () => found.map(cmd => ({ cmd, risk: classify(cmd, rules) })))
      await update($, armed, () => null)
      await update($, runs, () => [])
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, commands)
    if (e.props.hasSurvey || list.length === 0) return next(e)
    const isArmed = await read($, armed)
    const done = await read($, runs)
    const cwd = await $.session.cwd()
    const root = await $.session.root()

    const { Box, Button, Text } = $.ui.resolve(e)

    const latest = (index: number) => done.filter(x => x.index === index).at(-1)
    const setRun = (i: number, patch: Partial<Run>) => update($, runs, rs => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))

    // Streams the command's output into its row; resolves true when it exited 0.
    const runOne = async (index: number, cmd: string): Promise<boolean> => {
      const i = (await read($, runs)).length
      await update($, runs, rs => [...rs, { index, cmd, exitCode: null, ms: 0, output: '', isRunning: true, isStopped: false }])
      const t0 = await $.clock.now()
      let output = ''
      let isStopped = false
      let isRunning = true
      // The user's own login shell, so PATH and aliases match their terminal; /bin/sh only finds it.
      const stream = $.process.spawn({ argv: ['/bin/sh', '-c', 'exec "${SHELL:-/bin/sh}" -lc "$1"', 'run-suggested', cmd], cwd })
      live.set(index, {
        stop: () => {
          isStopped = true
          void stream.return(undefined as never).catch(() => undefined)
        },
      })
      // The clock on the row ticks even while the command prints nothing.
      void (async () => {
        while (isRunning) {
          await $.clock.sleep(1000)
          if (isRunning) await setRun(i, { ms: (await $.clock.now()) - t0, output })
        }
      })()
      let exitCode: number | null = null
      try {
        let last = 0
        for await (const chunk of stream) {
          output = (output + chunk.text).slice(-KEEP_CHARS)
          const now = await $.clock.now()
          if (now - last > 200) {
            last = now
            await setRun(i, { output, ms: now - t0 })
          }
          if (isStopped) break
        }
        if (!isStopped) exitCode = (await stream.result).code
      } catch (err) {
        if (!isStopped) output = `${output}\n${String(err)}`.trim()
      }
      isRunning = false
      live.delete(index)
      await setRun(i, { output: output.trimEnd(), exitCode, ms: (await $.clock.now()) - t0, isRunning: false, isStopped })
      return exitCode === 0
    }

    // Allowed commands run on one press; ask and unlisted ones on the second; denied ones not at all.
    // Pressing a running command stops it.
    const press = (index: number) => async () => {
      const running = live.get(index)
      if (running) return running.stop()
      const todo = index === -1 ? list.map((s, i) => [i, s] as const) : list.slice(index, index + 1).map(s => [index, s] as const)
      if (todo.some(([, s]) => s.risk === 'deny')) {
        $.ui.toast('Blocked by your deny rules in settings.json')
        return
      }
      const needsSecond = todo.some(([, s]) => s.risk !== 'allow')
      if (needsSecond && (await read($, armed)) !== index) {
        await update($, armed, () => index)
        return
      }
      await update($, armed, () => null)
      // In the background, so the press returns and the next press (to stop it) is heard.
      if (index === -1) {
        let isCancelled = false
        allStart = (await read($, runs)).length
        live.set(-1, {
          stop: () => {
            isCancelled = true
            live.forEach((l, k) => k !== -1 && l.stop())
          },
        })
        void (async () => {
          for (const [i, s] of todo) if (!(await runOne(i, s.cmd)) || isCancelled) break
          live.delete(-1)
        })()
      } else {
        void runOne(index, list[index]?.cmd ?? '')
      }
    }

    const askClaude = (r: Run) => async () => {
      await $.prompt.submit({ text: `\`${r.cmd}\` failed with exit ${r.exitCode ?? '–'}. What went wrong, and how do I fix it?`, asUser: true })
    }

    type Status = { text: string; color: string } | null
    const status = (index: number): Status => {
      const n = index === -1 ? 0 : index + 1
      if (isArmed === index) return { text: `↵ press ${n} again to run`, color: 'warning' }
      if (index === -1) {
        if (live.has(-1)) return { text: `running ${done.length - allStart}/${list.length} · press 0 to stop`, color: 'suggestion' }
        if (list.some(s => s.risk === 'deny')) return { text: 'has a blocked command', color: MUT }
        return list.every(s => s.risk === 'allow') ? null : { text: 'press twice', color: MUT }
      }
      const r = latest(index)
      if (r?.isRunning) return { text: `■ press ${n} to stop · ${clock(r.ms)}`, color: 'suggestion' }
      if (r?.isStopped) return { text: `■ stopped · ${seconds(r.ms)}`, color: 'warning' }
      if (r) return r.exitCode === 0 ? { text: `✓ ${seconds(r.ms)}`, color: 'success' } : { text: `✗ exit ${r.exitCode ?? '–'} · ${seconds(r.ms)}`, color: 'error' }
      const risk = list[index]?.risk
      if (risk === 'deny') return { text: 'blocked by your rules', color: 'error' }
      if (risk === 'ask') return { text: '⚠ asks first · press twice', color: 'warning' }
      if (risk === 'default') return { text: 'press twice', color: MUT }
      return null
    }

    const tail = (index: number): string[] => {
      const r = latest(index)
      if (!r || !r.output) return []
      const lines = r.output.trimEnd().split('\n')
      const shown = lines.slice(-TAIL_LINES)
      return lines.length > TAIL_LINES ? [`… ${lines.length - TAIL_LINES} more lines`, ...shown] : shown
    }

    // Every row is the same width: "│ " + inner + " │". The default indent of 2 lines the left edge up with
    // Claude Code's status line; the band always stops 5 columns short of the right edge, for its [-].
    const W = Math.max(30, e.props.bodyColumns - INDENT)
    const inner = W - 4
    const side = <Text color={FRAME}>│ </Text>
    const sideR = <Text color={FRAME}> │</Text>

    const commandRow = (key: string, hotkey: string, label: string, onPress: () => Promise<void>, s: Status, isDim: boolean, hint?: string) => {
      const right = s ? s.text : ''
      const room = inner - width(hotkey) - 2 - (right ? width(right) + 2 : 0)
      const shownHint = hint && width(label) + width(hint) + 1 <= room ? hint : ''
      const shownLabel = clip(label, room - (shownHint ? width(shownHint) + 1 : 0))
      return (
        <Box key={key}>
          {side}
          <Box width={inner} justifyContent="space-between">
            <Button key={`b-${key}`} hotkey={hotkey} plain dimColor={isDim} onPress={onPress}>
              {shownLabel}
              {shownHint ? <Text color={MUT}> {shownHint}</Text> : ''}
            </Button>
            {s ? <Text color={s.color}>{right}</Text> : null}
          </Box>
          {sideR}
        </Box>
      )
    }

    const textRow = (key: string, text: string, color: string) => (
      <Box key={key}>
        {side}
        <Box width={inner}>
          <Text color={color}>{clip(text, inner)}</Text>
        </Box>
        {sideR}
      </Box>
    )

    // Under the most recent failure only, so its "a" hotkey is unambiguous.
    const failed = [...done].reverse().find(r => !r.isRunning && !r.isStopped && r.exitCode !== 0)
    const askRow = (r: Run) => (
      <Box key="ask">
        {side}
        <Box width={inner}>
          <Text color={MUT}>{'   ↳ '}</Text>
          <Button key="ask-claude" hotkey="a" plain onPress={askClaude(r)}>
            ask Claude about this failure
          </Button>
          <Text color={MUT}>{clip(' · click, or ctrl+x tab then a', inner - 36)}</Text>
        </Box>
        {sideR}
      </Box>
    )

    const title = ICON ? `${ICON} run-suggested` : 'run-suggested'
    const count = `${list.length} command${list.length === 1 ? '' : 's'}`
    const topFill = W - 3 - width(title) - 2 - width(count) - 3
    const ran = done.some(r => !r.isRunning)

    // Bottom border: what the keys do on the left, where commands run on the right (yellow when the
    // session has moved off its project root, so a relative path may not mean what it looks like).
    const home = cwd.replace(/^\/Users\/[^/]+/, '~')
    const isElsewhere = cwd !== root
    let where = `runs in ${home}`
    const help = ran ? 'output goes with your next message' : 'press a number to run · press a running one to stop'
    const room = W - 3 - 3 - 2
    if (width(help) + width(where) + 3 > room) where = clip(where, Math.max(12, room - width(help) - 3))
    const shownHelp = clip(help, room - width(where) - 3)
    const bottomFill = W - 3 - width(shownHelp) - 2 - width(where) - 3

    return (
      <Box flexDirection="column" marginLeft={INDENT}>
        <Text>
          <Text color={FRAME}>╭─ </Text>
          <Text color="cyan" bold>{title}</Text>
          <Text color={FRAME}> {dashes(topFill)} </Text>
          <Text color={MUT}>{count}</Text>
          <Text color={FRAME}> ─╮</Text>
        </Text>
        {list.flatMap((s, i) => {
          const r = latest(i)
          return [
            commandRow(`row-${i}`, String(i + 1), s.cmd, press(i), status(i), s.risk === 'deny'),
            ...tail(i).map((l, j) => textRow(`out-${i}-${j}`, `   │ ${l}`, MUT)),
            ...(r && failed === r ? [askRow(r)] : []),
          ]
        })}
        {list.length > 1 && commandRow('row-all', '0', 'run all', press(-1), status(-1), false, 'stops at the first failure')}
        <Text>
          <Text color={FRAME}>╰─ </Text>
          <Text color={MUT}>{shownHelp}</Text>
          <Text color={FRAME}> {dashes(bottomFill)} </Text>
          <Text color={isElsewhere ? 'warning' : MUT}>{where}</Text>
          <Text color={FRAME}> ─╯</Text>
        </Text>
      </Box>
    )
  })
}
