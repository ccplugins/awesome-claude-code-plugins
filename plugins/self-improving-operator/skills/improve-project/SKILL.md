---
name: improve-project
description: Inspect the current state of a project, execute one high-leverage bounded improvement, verify it, checkpoint it, and keep going until a real stop reason is reached.
argument-hint: [mission-or-focus]
context: fork
agent: self-improving-operator-executor
user-invocable: true
---

Take ownership of this project improvement mission: $ARGUMENTS

Use `.operator/` as the durable operating system for this repo.

Required loop:

1. Load or infer the mission.
2. Refresh the backlog from repo and GitHub signals.
3. Pick the next safe, high-leverage item.
4. Implement one bounded improvement.
5. Verify with direct evidence.
6. Write a checkpoint and update `next_action`.
7. Continue until a real stop reason is recorded.

Do not stop because a plan exists, because one file was edited, or because the repo merely looks better.

If a broad plan is needed, decompose it into multiple backlog items and keep executing.
