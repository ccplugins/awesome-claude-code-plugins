# run-suggested

A Claude Code mod that turns the shell commands Claude suggests into numbered shortcuts above the prompt. Press a number to run one; its output streams into the row, and goes to Claude with your next message.

```text
╭─ ›_ run-suggested ──────────────────────────────────────────── 3 commands ─╮
│ 1: ls /nonexistent-folder                                  ✗ exit 1 · 0.1s │
│    │ ls: /nonexistent-folder: No such file or directory                    │
│    ↳ ask Claude about this failure · click, or ctrl+x tab then a           │
│ 2: for i in 1 2 3 4 5; do echo $i; sleep 1; done  ■ press 2 to stop · 0:03 │
│    │ 1                                                                     │
│    │ 2                                                                     │
│    │ 3                                                                     │
│ 3: git push origin main                         ⚠ asks first · press twice │
│ 0: run all stops at the first failure                          press twice │
╰─ press a number to run · press a running one to stop ── runs in ~/project ─╯
```

Copying a command out of a reply, pasting it after `!` and pressing Enter is a small cost, paid many times a day. This removes it, without making it easy to run something you didn't mean to.

## Install

At the prompt of a Claude Code terminal session:

```text
/plugin install run-suggested --marketplace hematteo/run-suggested
```

Answer `y` to add the marketplace, then pick a scope (user scope makes it available in every session). From a shell, the same is:

```sh
claude plugin install run-suggested --marketplace hematteo/run-suggested
```

It needs a Claude Code version with hooks-module plugins ("mods"); it was built and tested on 2.1.308.

## Using it

After each reply, the commands Claude suggested appear in a frame above the prompt, numbered 1 to 9.

| Key, in an empty prompt | What it does |
| --- | --- |
| `1`–`9` | Run that command, or select it if it needs a second press |
| the same number again | Run a selected command, or stop a running one |
| `0` | Run all of them in order, stopping at the first failure |
| `ctrl+x tab`, then `a` | Ask Claude about the most recent failure (or click the line) |

Clicking a row does the same as its number. The row clears when you send your next prompt, and everything that ran is attached to that prompt, so Claude sees the output as it would a `!` command's.

### What needs a second press

The mod reads the Bash permission rules in your Claude Code settings and treats each command the way Claude Code would treat it, with deny ranked over ask over allow:

| Your rules | On the row | To run it |
| --- | --- | --- |
| `allow` matches | no mark | one press |
| `ask` matches | `⚠ asks first · press twice` | two presses |
| no rule matches | `press twice` | two presses |
| `deny` matches | dimmed, `blocked by your rules` | can't be run from the row |

A compound command (`a && b`, `a | b`, `a; b`) is as risky as its riskiest part, and runs on one press only when every part is allowed. Operators inside quotes don't split it.

The second press exists because a digit typed into an empty prompt is easy to hit by accident, for instance when starting a message with "1.".

### Where commands run

Commands run in your login shell (`$SHELL -l`), in the session's working directory, as you, outside Claude Code's sandbox. The bottom border names that directory, and turns yellow when the session has moved away from its project root, so a relative path may not point where you expect.

## How commands are found

Only lines inside fenced code blocks tagged `sh`, `bash`, `zsh`, `shell` or `console` count. Untagged blocks, `text` blocks and inline code are ignored, so example output and prose stay out of the row. Comments and blank lines are skipped, a leading `$ ` or `! ` is dropped, and a line ending in `\` is joined with the next.

To make that reliable, the mod adds a short section to Claude's system prompt asking it to put commands meant for you in `sh` blocks, one per line, and to use other fence languages for everything else.

## How it works

It is a single hooks module, `hooks/register.tsx`, on these surfaces:

| Hook or call | What it does there |
| --- | --- |
| `turn.complete` | Reads the main loop's final answer, extracts the commands, and classifies each against `$.settings.read()`'s `permissions` |
| `ui.render` on `AbovePrompt` | Draws the framed band: one `Button` per command with a digit `hotkey`, its status, and the tail of its output |
| `$.process.spawn` | Runs a command in the user's login shell and streams its output into the row; leaving the stream stops it |
| `prompt.submit` | Attaches what ran to the next prompt as `context`, then clears the band |
| `prompt.compose` | Adds one system prompt section asking Claude to put commands for the user in `sh` fences |
| `$.prompt.submit` | Sends the "ask Claude about this failure" question |

State lives in `$.state` (`commands`, `armed`, `runs`); `types/index.d.ts` declares it. It makes no network requests.

## Options

Set them in `/config`, or under `pluginConfigs` in `~/.claude/settings.json`:

| Option | Default | |
| --- | --- | --- |
| `icon` | `text` | `text` (›_), `nerd-font` (needs a Nerd Font) or `none` |
| `indent` | `2` | Columns before the frame; 2 lines it up with Claude Code's status line |
| `frameColor` | `subtle` | A Claude Code theme colour name, or a hex value such as `#4f5663` |
| `detailColor` | `inactive` | Colour of hints, counts and output; a theme name or a hex value |

Theme colour names follow Claude Code's light and dark themes. Hex values are useful for matching a custom status line exactly.

## Limitations

- Output arrives in pieces as the command writes it, so a program that waits for a terminal (a pager, a progress bar that redraws in place, anything interactive) won't behave as it would in your shell. Run those yourself.
- Commands get no standard input.
- The band leaves the last five columns of the terminal to Claude Code's collapse button, so its right edge sits a few columns left of a full-width status line.
- Permission rules are matched by their `Bash(...)` patterns only; rules that Claude Code applies in other ways (sandbox settings, hooks, managed policy) are not consulted.

## Development

Load it from a clone for one session:

```sh
claude --plugin-dir /path/to/run-suggested
```

Run the tests, check the manifest and hooks, and type-check (the type definitions are written into `.claude-plugin/types/` the first time Claude Code loads the plugin):

```sh
claude plugin test .
claude plugin validate .
npx -p typescript tsc -p . --noEmit
```

`hooks/register.tsx` is the whole mod; `types/index.d.ts` declares the state it keeps.

## License

MIT
