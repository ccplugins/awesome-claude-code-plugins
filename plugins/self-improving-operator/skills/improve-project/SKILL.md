---
name: improve-project
description: Inspect the current state of a project, make one high-leverage bounded improvement, verify it, and leave behind a better handoff trail.
argument-hint: [goal-or-focus]
context: fork
agent: self-improving-operator-executor
user-invocable: true
---

Take ownership of this project improvement task: $ARGUMENTS

Work in a proactive but bounded way:

1. Inspect the real current state before deciding what to change.
2. Identify the highest-leverage unfinished gap related to the goal.
3. Make one improvement that materially raises the bar.
4. Verify the outcome with tests, smoke checks, runtime probes, or another direct check.
5. Update docs, handoff notes, or operator guidance if the truth changed.
6. Stop only when the requested outcome is working, a meaningful bar has been reached, or a real blocker remains after at least one reasonable fallback.

Do not stop at "the file is edited" or "the repo looks better."

Prefer work that reduces future drag:

- productize a manual workflow
- add diagnostics after a confusing failure
- strengthen tests around the core path
- improve onboarding or takeover guidance
- make the system easier to operate, verify, or evolve

Avoid vanity work and large speculative refactors.
