---
name: scope
description: Use when the user says "plan this", "decompose this task", "break this down", or wants the task file before any code changes. Writes `.hyperflow/tasks/<slug>.md` with batched sub-tasks, then **auto-chains into `/hyperflow:dispatch`** — no manual gate.
---

# Scope

Decompose, don't build. Read-only with respect to source code. The only writes are to `.hyperflow/tasks/`, `.hyperflow/memory/`, and `.hyperflow/specs/`. When the task file is ready, hand off to `dispatch` (auto or with a gate, depending on chain mode).

This skill exercises **Layer 0 (Project Analysis)** for context, **Layer 6 (Project Memory)** for past-learning surfacing, and **Layer 7 (Task Templates)** for decomposition patterns. It also inherits the triage classification from `/hyperflow:spec` to size each batch correctly.

## Per-Step Agent Map (DOCTRINE rule 12)

Every substantive step dispatches at least one Agent.

| Step | Worker tier | Thinking tier | Notes |
|---|---|---|---|
| 0 — Chain mode | — | — | `AskUserQuestion` only (exempt) |
| 1 — Understand | — | — | `AskUserQuestion` if ambiguous (exempt) |
| 2 — Research | Searcher × 2 (Sonnet) parallel | **Reviewer** (Opus) verifies coverage | Both tiers |
| 3 — Decompose | — | **Planner** (Opus) produces the batch graph | Pure thinking |
| 4 — Write task file | Writer (Sonnet) emits the markdown | **Reviewer** (Opus) verifies the plan vs the design | Both tiers |
| 5 — Output | — | — | Print only (exempt) |
| 6 — Memory | Writer (Sonnet) appends to memory files | **Reviewer** (Opus) checks for duplicates / contradictions | Both tiers |
| 7 — Hand off | — | — | `Skill` tool invocation (exempt) |

## Approval Gates

| Gate | When | Format |
|---|---|---|
| Chain mode | Step 0, only if invoked directly | `AskUserQuestion` — auto / manual |
| Decomposition sanity | Step 4, after writing the task file | Print the batch summary; user reads it |
| Phase advance (if `manual` mode) | Step 7, before invoking `dispatch` | `AskUserQuestion` — continue / stop |

## Flow

### Step 0 — Choose chain mode (FIRST tool call · STRUCTURAL GATE)

This is a **structural gate** per DOCTRINE rule 8. It MUST fire every time the skill is invoked directly. "No clarifying questions" / "auto-pilot" / "always-on" / any other autonomy directive does NOT skip it. Defaulting to `auto` without asking is a doctrine violation.

If invoked with a `chain-mode=<auto|manual>` arg (from `/hyperflow:spec` or a prior skill), skip this step — the previous chain-starter already asked.

Otherwise, **before research**, ask via `AskUserQuestion`. Per DOCTRINE rule 8, the recommended option goes first with `(Recommended)`:

```
How should I advance through the chain after this phase?

  Auto (Recommended)  — chain forward through scope → dispatch with no gate.
                        Fewer interruptions, faster end-to-end.

  Manual              — pause between phases and ask before advancing.
                        More control, more confirmations.
```

Wait for the user's answer. Do not proceed without it. Save the chosen mode and propagate via `args: "chain-mode=<mode>"` when invoking dispatch.

If the agent cannot present `AskUserQuestion` (e.g., headless mode), it should print an error and stop — never silently default.

### Step 1 — Understand

- Ambiguous → `AskUserQuestion` (max 3)
- Pure design question → suggest `/hyperflow:spec` instead and stop

### Step 2 — Research (parallel)

Agents — `Searcher` × 2 (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch in a single message (parallel):
   - `Searcher — mapping affected files and existing patterns`
   - `Searcher — finding related tests and conventions`
2. Read `.hyperflow/profile.md`, `architecture.md`, `conventions.md`, and `.hyperflow/memory/index.md` to surface relevant past learnings.
3. Dispatch `**Reviewer** — verifying research coverage` to confirm both Searchers hit the relevant subsystems. If gaps remain, redispatch a Searcher targeting the gap before moving on.

### Step 3 — Decompose

Agents — **Planner** (Opus, thinking-tier).

Dispatch `**Planner** — producing batch graph` with the research findings, triage classification, and applicable templates from [task-templates.md](../hyperflow/task-templates.md) (CRUD Feature, API Endpoint, UI Component, Database Migration, Refactor, Bug Fix — else bespoke).

The Planner produces, for each sub-task:
- Worker role — Implementer / Searcher / Writer
- Files to read / modify / create
- Dependencies — parallel vs sequential
- Complexity estimate (drives review level cap downstream)

### Step 4 — Write Task File

Agents — `Writer` (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch `Writer — emitting task file` with the Planner's output. The Writer writes to `.hyperflow/tasks/<task-slug>.md` using the template below.
2. Dispatch `**Reviewer** — verifying task file vs design` to confirm every design requirement maps to at least one sub-task and no orphan sub-tasks exist.

Task-file template —

```markdown
# Task: <Name>

## Goal
<one-line>

## Context
<background, why this matters, research findings>

## Affected files
- Read: <list>
- Modify: <list>
- Create: <list>

## Batches

### Batch 1 (parallel)
- [ ] T1: [Role] <description>
- [ ] T2: [Role] <description>

### Batch 2 (sequential — depends on Batch 1)
- [ ] T3: [Role] <description>

### Batch 3
- [ ] T4: Final integration review

## Open questions
<anything needing user input before execution>

## Verification plan
<how to test end-to-end>

## Estimated cost
- Thinking: ~N agents, ~Xk tokens
- Worker: ~N agents, ~Yk tokens

## Status
Created: <date>
```

### Step 5 — Output

Print the task file path and batch summary table:

```
Plan ready — .hyperflow/tasks/<slug>.md (3 batches, 7 sub-tasks)
```

### Step 6 — Memory

Agents — `Writer` (Sonnet) ⇒ **Reviewer** (Opus).

1. Dispatch `Writer — appending decisions to .hyperflow/memory/decisions.md`. Skip trivial ones. For complex features (3+ files, multiple subsystems) the Writer also produces `.hyperflow/specs/<feature-slug>.md` referenced from the task file.
2. Dispatch `**Reviewer** — checking memory entries` to catch duplicates or contradictions with existing entries before they land in `.hyperflow/memory/`.

See [task-tracking.md](../hyperflow/task-tracking.md) and [worker-prompt.md](../hyperflow/worker-prompt.md).

### Step 7 — Hand off to `/hyperflow:dispatch`

**If `chain-mode=auto`** — immediately invoke `Skill` with `skill: execute` and `args: "chain-mode=auto <task-slug>"`. Print:

```
Auto-chaining to /hyperflow:dispatch…
```

**If `chain-mode=manual`** — ask via `AskUserQuestion`: "Plan done. Continue to /hyperflow:dispatch?" → yes / no / stop. On yes, invoke `Skill` with `skill: execute` and `args: "chain-mode=manual <task-slug>"`.

## Anti-patterns

- Writing implementation code
- Modifying source files outside `.hyperflow/` and `.hyperflow/specs/`
- Skipping the research step
- Single-batch plans for multi-file work
- Omitting the verification plan
- Pausing for "should I execute?" when `chain-mode=auto` — that was already answered at Step 0
- Asking the chain-mode question again when a `chain-mode=<…>` arg was passed in

## References

- [DOCTRINE.md](../hyperflow/DOCTRINE.md) — shared rules
- [output-style.md](../hyperflow/output-style.md) — elegant label format
