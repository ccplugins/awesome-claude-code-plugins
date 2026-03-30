---
name: operator-playbook
description: Operational discipline for proactive diagnose-build-verify-handoff loops in ongoing software projects.
user-invocable: false
---

Use this playbook when the task is not just to make one local edit, but to move a project to a better operating state.

## Core loop

1. Inspect the current repository, runtime, and documentation before making assumptions.
2. Choose one bounded improvement with the highest leverage.
3. Verify with real evidence whenever possible.
4. Update docs or handoff notes so the next operator inherits the truth.

## Verification rule

Prefer:

- tests over confidence
- runtime probes over guessed compatibility
- repository status over memory
- direct file inspection over inferred structure

If something cannot be verified, say so explicitly and name what remains uncertain.

## Scope rule

Be proactive, but not reckless.

- prefer the smallest improvement that changes the trajectory
- avoid large irreversible architecture changes without a clear reason
- do not invent product requirements without evidence
- pause only when the next move has non-obvious consequences

## Handoff rule

Leave behind a better baseline for the next thread:

- note what changed
- note what was verified
- note what is still blocked
- recommend the next highest-leverage step
