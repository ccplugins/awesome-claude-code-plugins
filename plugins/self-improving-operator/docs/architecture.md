# Architecture

`codex-self-improving-operator` v2 is built as a canonical autonomy kernel plus generated variants.

## Layers

1. `kernel/`
   Canonical spec and prompt templates
2. `scripts/operator_runtime.py`
   Deterministic runtime for `.operator/` state, backlog refresh, plan decomposition, next-item selection, and checkpoints
3. `scripts/sync_variants.py`
   Generates the Codex skill bundle, the local installed skill bundle, and the Claude plugin bundle
4. `skill/self-improving-operator/`
   Upstream-ready Codex skill bundle
5. `generated/claude-code-self-improving-operator/`
   Canonical generated snapshot for the Claude plugin variant

## Durable state model

Target repositories use a repo-local `.operator/` directory:

- `mission.md`
- `backlog.json`
- `state.json`
- `checkpoints/*.md`

This state is the continuity layer that lets a fresh thread resume without reconstructing prior decisions from chat history.

## Execution loop

1. Bootstrap or load mission/state
2. Scan repo and GitHub signals
3. Merge and prioritize backlog items
4. Select the next in-scope item
5. Implement and verify
6. Write a checkpoint and save `next_action`
7. Re-scan and continue

## Signal hygiene

The runtime only turns actionable signals into backlog items:

- comment-style TODO/FIXME markers in source files
- explicit doc headings or bullets such as `Next steps` and `Known blockers`
- current GitHub failures, issues, review states, and discussions

Literal mentions in prose, regex strings, and generated output directories are ignored. Scan-derived pending items are rebuilt on each refresh, so resolved or vanished signals fall out of the queue instead of lingering forever.

## Variant strategy

The Codex skill and the Claude plugin share the same kernel semantics:

- same `.operator/` state model
- same stop reasons
- same priority order
- same publish default of checkpoint branch/commit without auto-PR

The generated variants may differ in surface syntax, but they should not drift in behavior.
