---
name: operator-playbook
description: Operational discipline for persistent diagnose-build-verify-checkpoint loops in ongoing software projects.
user-invocable: false
---

Use this playbook whenever the goal is to keep a project moving without losing continuity.

## Required files

- `.operator/mission.md`: mission, scope, work sources, stop reasons, and publish mode.
- `.operator/backlog.json`: prioritized work items discovered from repo and GitHub signals.
- `.operator/state.json`: current item, verification state, last stop reason, and `next_action`.
- `.operator/checkpoints/*.md`: durable checkpoints written after verified work.

## Priority order

1. broken runtime or ci
2. github blockers
3. existing backlog commitments
4. tests diagnostics onboarding docs
5. cleanup and polish

## Stop reasons

- `needs_user_decision`
- `external_blocker`
- `risk_budget_exceeded`
- `no_safe_work`
- `mission_complete`

## Guardrails

- Stay inside the active mission.
- Prefer the smallest improvement that changes the trajectory.
- Record state before stopping.
- Resume from `.operator/state.json`, not from memory.
