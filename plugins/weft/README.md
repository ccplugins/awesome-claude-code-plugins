# weft

**Deterministic workflow tracking for Claude Code — event-sourced state machine, smart skills, template management.**

→ [dioptx/weft](https://github.com/dioptx/weft) (MIT, Python stdlib only, 191 tests)

## Install

```
/plugin marketplace add dioptx/weft
/plugin install weft@dioptx-weft
```

## What it gives you

- 11 slash commands (`/wf-start`, `/wf-step`, `/wf-status`, `/wf-rebuild`, `/wf-compose`, `/wf-dashboard`, etc.)
- 4 hooks (`SessionStart`, `PreToolUse`, `PreCompact`, `Stop`)
- 2 bundled templates (`generic`, `feature-workflow`) + custom-template authoring via heredoc
- Event-sourced state under `.claude/weft/events.jsonl` — fully reconstructible after compaction or restart

## Demos

See [the upstream README](https://github.com/dioptx/weft#readme) for 5 reproducible asciinema GIFs covering pitch, walkthrough, compose, extend, and audit.
