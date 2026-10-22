# run-watcher

[![CI](https://github.com/hematteo/run-watcher/actions/workflows/ci.yml/badge.svg)](https://github.com/hematteo/run-watcher/actions/workflows/ci.yml)

A Claude Code mod that watches your training logs while you work. When Claude launches a training run, its log is picked up automatically; the Runs pane shows each run's step, loss and a loss sparkline, and you get an alert when the loss goes NaN or spikes, a run crashes, or its output stalls. Logs on other machines are read over ssh. For Slurm jobs submitted there, the mod asks Slurm where the job writes its log and what state the job is in, so a queued job shows as pending and a job killed for running out of memory or time says so.

```text
4 watched · checked 4s ago

gpt2-small running · step 4200 · loss 2.913 · 6s                      ×
█▇▆▆▅▅▄▄▄▃▃▃▃▃▂▂▂▂▂▂▂▂▁▁▁▁▁▁▁▁▁▁
step 4200 | loss 2.913 | lr 2.9e-04 | 41k tok/s

hpc:exp/4242.out spike · step 900 · loss 6.120 · 31s                  ×
▃▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▇█
step 900 | loss 6.120 | grad_norm 41.7

lr-sweep-3 crashed · step 120 · loss 3.402 · 2m                        ×
▆▅▄▄▃
torch.OutOfMemoryError: CUDA out of memory. Tried to allocate 2.00 GiB

hpc:logs/4250.out pending                                              ×
```

The status line carries a one-line summary (`gpt2-small ok: step 4200, loss 2.91`, or the problem, in words), so you see trouble without opening the pane.

## Install

At the prompt of a Claude Code terminal session:

```text
/plugin install run-watcher --marketplace hematteo/run-watcher
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```sh
claude plugin install run-watcher --marketplace hematteo/run-watcher
```

It needs a Claude Code version with hooks-module plugins ("mods"); it was built and tested on 2.1.308.

## Using it

### Runs Claude starts

When Claude runs a training command through its Bash tool, the mod finds the log it writes and starts watching it:

| Claude runs | The log it watches |
| --- | --- |
| `python train.py > logs/run1.log 2>&1` | `logs/run1.log`, relative to the last `cd` in the command or the session's directory |
| `torchrun train.py \| tee out.txt` | `out.txt` |
| a launch in the background | the background task's output file |
| `ssh gpu-box 'cd exp && nohup python train.py > run.log 2>&1 &'` | `run.log` on `gpu-box`, in `~/exp` |
| `ssh hpc 'sbatch --output=logs/%j.out run.sh'` | `logs/<job id>.out` on `hpc`, and the job's state |
| `ssh hpc 'sbatch run.sh'` | the log `scontrol show job` names (`StdOut=`, which follows the script's own `#SBATCH --output`), and the job's state |

A launch is a `train*.py`, `finetune*.py`, `pretrain*.py` or `sweep*.py` script run by `python`, `uv run`, `nohup` or `srun`, a `python -m …train` module, `torchrun`, `accelerate launch`, `deepspeed`, `sbatch`, or any Python command Claude runs in the background. If the mod sees a launch but no log, it says so.

### Runs you start

```text
/watch logs/run1.log            watch a local log
/watch gpu-box:~/exp/run.log    watch a log on another machine
/watch hpc:job/4242             watch a Slurm job on hpc: its log, and its state
/watch /scratch/r.log my-run    give it a label
/watch                          open the Runs pane
/unwatch my-run                 stop watching (a label, a path, hpc:job/4242, or all)
```

`/watch hpc:job/4242` asks `scontrol show job 4242` on `hpc` for the job's `StdOut`, or `sacct` once the job has left the controller's memory, and watches that log. Watched runs, and the Slurm jobs they belong to, are remembered across sessions for seven days.

### What it reports

| Status | Meaning | Alert |
| --- | --- | --- |
| running | printing, loss parsed | — |
| pending | a Slurm job waiting in the queue (no log yet is expected) | — |
| nan | the latest training loss is NaN or infinite | yes |
| spike | two of the last three losses far above the recent median | yes |
| crashed | a traceback, CUDA out-of-memory, segfault, `Killed`, NCCL or Slurm error at the end of the log; or Slurm says the job failed, `crashed (out of memory)` or `crashed (time limit)` | yes |
| stalled | no new output for 10 minutes (configurable) | yes |
| done | a trainer's closing line: "training complete", Hugging Face's "Training completed.", Lightning's "`Trainer.fit` stopped", wandb's run summary; or Slurm says the job completed | toast only |
| cancelled | Slurm says the job was cancelled | toast only |
| missing | the log file is gone | — |
| can't reach host | ssh to the machine failed, with the reason (login refused, host key not trusted, timed out, no route); the last reading is kept | — |

An alert is a toast in Claude Code, and also a notification through Claude Code's notification channel (your terminal's notification or bell) unless you turn that off. Alerts fire when a run changes state while watched; a log that was already crashed or finished when it was found is shown in that state without an alert.

Only the training loss counts. Evaluation losses (`val_loss`, `eval/loss`, `eval loss`, `Validation Loss:`) and other quantities named loss (`aux_loss`, the AMP loss scale) are skipped, so an eval spike does not raise an alert.

### Remote logs

A remote log is named as scp names it, `host:/path` or `host:~/path`, with any host your ssh config knows. Each read is one non-interactive ssh call (`BatchMode=yes`, so it never waits for a password), at most once a minute by default. Key-based login is required.

The reads to one host share one ssh connection: the mod passes `ControlMaster=auto`, `ControlPersist=120` and `ControlPath=~/.ssh/cm-rw-%C`, so the first read opens a connection that stays up for two minutes after the last one, and later reads skip the login. The socket's name is ssh's hash of the host, port and user, short enough for macOS's limit on socket paths. If multiplexing misbehaves with a host, turn `reuseSsh` off.

Because the reads cannot ask you anything, a host that works in your terminal can still fail here. The pane says which way:

| The pane says | Why | Fix |
| --- | --- | --- |
| login to host refused (is your key loaded in ssh-agent?) | your key has a passphrase and the agent doesn't hold it | `ssh-add` it once (on macOS, `ssh-add --apple-use-keychain ~/.ssh/id_ed25519` keeps it across restarts) |
| host's host key is not trusted yet | the host isn't in `known_hosts` under the name you watch it by (an IP address and a hostname are different names) | `ssh` to it once by that name and accept the key |
| can't reach host (timed out) | a firewall, or a network that only works from inside an institution | connect to its VPN, or watch from a machine inside |
| can't reach host (no route) | often a `.local` name that resolves only to IPv6 | add `AddressFamily inet` for that host in `~/.ssh/config` |

### Slurm jobs

A run that comes from a Slurm job (an `sbatch` Claude ran over ssh, or `/watch host:job/<id>`) carries the job's id and host, and each read of its log asks Slurm for the job's state in the same ssh call: `sacct -j <id> -X -n -P -o State`, or `squeue -h -j <id> -o %T` where accounting is off. Slurm's state decides whether a job is waiting, finished, failed or cancelled; while it runs, the log decides as for any run, so a NaN or a spike still raises an alert.

| Slurm state | Status |
| --- | --- |
| `PENDING`, `CONFIGURING`, `REQUEUED` | pending |
| `RUNNING`, and any other | from the log |
| `COMPLETED` | done |
| `FAILED`, `NODE_FAIL`, `BOOT_FAIL` | crashed |
| `OUT_OF_MEMORY` | crashed (out of memory) |
| `TIMEOUT` | crashed (time limit) |
| `CANCELLED` (`CANCELLED by <uid>`) | cancelled |

When Slurm knows nothing of the job any more (squeue forgets a job minutes after it ends, and there is no accounting), the log decides again; a job already seen to end keeps that ending.

Where the job writes is plain when the command gives `--output` with only `%j` to fill in. Otherwise, right after the submission, the mod asks `scontrol show job <id>` for the job's `StdOut`, which follows an `#SBATCH --output` line in the script and fills in patterns such as `%x`. Only if scontrol can't say does the mod guess Slurm's default, `slurm-<id>.out`. A guess with no log behind it is kept while the job is pending; once the job runs and the log is still not there, the guess is dropped and the mod tells you to `/watch` the right path.

## How it works

It is a single hooks module, `hooks/register.tsx`, on these surfaces:

| Hook or call | What it does there |
| --- | --- |
| `tool.call` on `Bash` | After a command Claude ran, decides whether it was a training launch and finds the logs it writes; after an `sbatch` over ssh, asks `scontrol` where the job writes |
| `$.fs.stat`, `$.process.run` | Reads a local log's last 256 KB with `tail`, or a remote one with one `ssh` call, which also asks `sacct` (or `squeue`) for the state of the log's Slurm job |
| `$.clock.every` | Polls the watched logs |
| `ui.render` on `Pane` | Draws the Runs pane |
| `$.ui.status`, `$.ui.toast`, `$.ui.notify` | The status line summary and the alerts |
| `command.run` | `/watch` and `/unwatch` |
| `$.store` | Remembers watched runs, and their Slurm jobs, across sessions |

State lives in `$.state` (`runs`, `checkedAt`); `types/index.d.ts` declares it. It makes no network requests of its own; remote logs go through your `ssh`.

## Options

Set them in `/config`, or under `pluginConfigs` in `~/.claude/settings.json`:

| Option | Default | |
| --- | --- | --- |
| `pollSeconds` | `15` | Seconds between reads of local logs (at least 5) |
| `remotePollSeconds` | `60` | Seconds between reads of remote logs (at least 15) |
| `stallMinutes` | `10` | Minutes without output before a run counts as stalled; `0` turns stall alerts off |
| `notify` | `true` | Also send alerts through Claude Code's notification channel |
| `reuseSsh` | `true` | Share one ssh connection per host between reads (`ControlMaster`, socket under `~/.ssh`); turn off for hosts where multiplexing misbehaves |

## Limitations

- The loss and step are read from the text of the log by pattern. A trainer that prints its loss without the word "loss" (a bare progress bar, a custom key) shows up as running without a curve.
- A run that ends without one of the recognised closing lines is reported as stalled once it goes quiet, unless it is a Slurm job whose state Slurm still knows. Lower the noise with `stallMinutes`, or `/unwatch` it.
- Spike detection is a heuristic over the last few logged values; a loss logged rarely gives it little to go on.
- Only commands Claude runs are picked up automatically. A run you start in another terminal needs `/watch`.
- Remote reads need non-interactive ssh to the host.
- Slurm's state wins once a job ends. A batch script that carries on after its training command crashes (no `set -e`) ends `COMPLETED`, and shows as done.
- Job states are read for jobs on a remote host. An `sbatch` Claude runs on the machine it runs on (a login node) is watched by its log alone. Job arrays are read as their first task.
- `sacct`'s `StdOut` field, used by `/watch host:job/<id>` once `scontrol` has forgotten a job, exists only in recent Slurm versions; with older ones, `/watch` the log's path.
- The ssh connection sharing puts its socket in `~/.ssh`, which must exist.

## Development

Load it from a clone for one session:

```sh
claude --plugin-dir /path/to/run-watcher
```

Run the tests, check the manifest and hooks, and type-check (the type definitions are written into `.claude-plugin/types/` the first time Claude Code loads the plugin):

```sh
claude plugin test .
claude plugin validate .
npx -p typescript tsc -p . --noEmit
```

`tests/analyze.test.ts` covers the parsing and the alert rules; `tests/slurm.test.ts` the Slurm state mapping, log path lookup and ssh commands; `tests/run-watcher.test.tsx` drives the whole mod against a fake file system, ssh, Slurm and Bash tool.

## License

MIT
