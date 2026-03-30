# Claude Code Self-Improving Operator

Claude Code plugin for persistent project improvement.

This plugin is generated from the canonical autonomy kernel in `https://github.com/wd041216-bit/codex-self-improving-operator`.

## What it does

- creates or resumes durable `.operator/` state
- scans repo and GitHub signals into a prioritized backlog
- filters out fake work from prose, string literals, and generated outputs
- drops stale scan-derived pending items on refresh
- executes one bounded improvement at a time
- verifies, checkpoints, and keeps going
- stops only on a real stop reason

## Core command

```text
/self-improving-operator:improve-project improve onboarding and keep going until you hit a real blocker
```

## Durable state

- `.operator/mission.md`: mission, scope, work sources, stop reasons, and publish mode.
- `.operator/backlog.json`: prioritized work items discovered from repo and GitHub signals.
- `.operator/state.json`: current item, verification state, last stop reason, and `next_action`.
- `.operator/checkpoints/*.md`: durable checkpoints written after verified work.

## Runtime loop

```bash
python3 scripts/operator_runtime.py bootstrap --repo /path/to/repo --goal "Stabilize onboarding and keep shipping"
python3 scripts/operator_runtime.py scan --repo /path/to/repo
python3 scripts/operator_runtime.py next --repo /path/to/repo
```

Use `ingest-plan` when a broad strategy needs to be decomposed into executable backlog items, and `checkpoint` after each verified improvement.

## Validation

```bash
python3 scripts/validate_plugin.py
```

## Canonical source

- Codex kernel repo: `https://github.com/wd041216-bit/codex-self-improving-operator`
- Claude plugin repo: `https://github.com/wd041216-bit/claude-code-self-improving-operator`
