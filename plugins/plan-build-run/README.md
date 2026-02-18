# Plan-Build-Run

Context-engineered development workflow for Claude Code. Solves context rot through disciplined subagent delegation, structured planning, atomic execution, and goal-backward verification.

## Features

- Keeps orchestrator at ~15% context by delegating to fresh 200k-token subagent windows
- 21 `/pbr:*` slash commands covering the full development lifecycle
- 10 specialized agents (researcher, planner, executor, verifier, etc.)
- 15 lifecycle hooks enforcing commit format, context budget, plan compliance
- Wave-based parallel execution with atomic commits
- Goal-backward verification (checks codebase against must-haves, not just task completion)
- Kill-safe: all state lives on disk in `.planning/`

## Install

```bash
claude plugin marketplace add SienkLogic/plan-build-run
claude plugin install pbr@plan-build-run
```

## Links

- **Repository**: https://github.com/SienkLogic/plan-build-run
- **License**: MIT
