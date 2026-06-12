---
name: execute-batch-parallel
description: Execute one "chat" from an Implementation Strategy by fanning out one scoped sub-agent per Ready story IN PARALLEL, then reconciling the board once on the main thread. Use when the user invokes /Tandem:execute-batch-parallel with a chat id (e.g. CHAT-02), or asks to run a batch of independent stories concurrently. Operates as Dev/QA hat. Refuses to fan out unless the batch is provably file-disjoint (pm:batch-check, ADR-0075) and every story is DoR-ready — otherwise falls back to serial execute-batch. This command DOES change story status.
---

# Tandem: execute-batch-parallel (Dev/QA hat)

Operate as **Dev/QA hat** in a **fresh chat**. This is the **concurrent** sibling of
`execute-batch`: where `execute-batch` runs a chat's stories one-at-a-time, `execute-batch-parallel`
**fans out one sub-agent per story** so a batch of *independent* stories clears in a single chat,
then folds every result back onto the board in **one serialised reconciliation pass** on the main
thread.

It is built **against the settled concurrency model in ADR-0075** — *sub-agents-with-merge under a
disjoint-file precondition, main thread as sole writer of serialised state.* It composes the
existing per-story skills (`execute-story`, `run-testplan`, `close-out-story`); it does **not**
re-implement their logic, and it **never** relaxes the kit's gate contract (status enum, atomic
flip, ADR-on-the-spot, BUG-on-defect).

> **Default is still serial.** Parallel fan-out is *opt-in and earned by precise metadata*. If a
> batch cannot be **proven** file-disjoint, this skill refuses and the operator runs the serial
> `execute-batch` instead. A batch that cannot be proven safe is treated exactly like an unsafe one.

## Inputs needed

- **A chat id** — e.g. `CHAT-02`. If the user didn't supply one, ask, or list the chats in the
  latest strategy.
- **The strategy** — default to the latest `_00-Project-Management/41-Reports/EXECUTION-STRATEGY-*.json`.
  Fall back to the paired `.md` report if the JSON is absent. The user may name a specific file.

## Load into context

Use `Read` / `Glob`; treat missing files as "not present", never throw.

- **The named chat** from the latest `EXECUTION-STRATEGY-*.json`: its `stories` (with `ready`
  flags), `lanes`, `verify` command, `sub_agents`, and `executed` flag.
- **Each story + its paired testplan** under `32-Stories/` + `33-Testplans/`.
- **SOP** — `90-Standards/SOP.md` (DoR/DoD, status enum, WIP limits §5, parallel-vs-serial rule).
- **ADR-0075** — the concurrency model this skill obeys.

## Step 1 — Safety gate (refuse BEFORE any fan-out)

The gate runs **before a single sub-agent is dispatched**. All of the following must pass; on **any**
failure, **do not fan out** — report the failing item and fall back to serial `execute-batch`:

1. **DoR precheck.** Every story in the chat must be `status: ready`. If any story is `ready: false`
   in the strategy or not `ready` in its frontmatter, **refuse** and name the unready story — it is
   `unsafe` to start. (The operator runs `/Tandem:refine-backlog` first.)
2. **Disjoint-file precondition (`pm:batch-check`, ADR-0075).** Run the static **batch-check** over
   the batch's stories:

   ```bash
   node _00-Project-Management/93-Scripts/batch-check.js STORY-A STORY-B STORY-C
   ```

   It compares every pair's `files_touched:`. A `CONFLICT` (two stories write the same file, or a
   file under another's directory) **or** any `UNKNOWN` (directory×directory, or empty/absent
   `files_touched:` — *cannot prove disjoint*) is a **hard stop**: the batch is **not** fanned out.
   Only a provably **disjoint** batch (exit 0) may run in parallel. `UNKNOWN` never silently passes.
   **Fail closed:** any **non-zero exit** — a conflict, an unknown, **or a batch-check script error** —
   blocks fan-out and falls back to serial `execute-batch`; the gate never reads a crash as "safe".

The refusal path **precedes** the fan-out: the skill computes the gate, and only a clean gate
unlocks Step 2.

## Step 2 — Fan-out: one scoped sub-agent per story

On a safe batch, dispatch **one sub-agent per story, concurrently** (a single message with one
`Agent` call per story so they run in parallel). Each sub-agent is **tightly scoped** to its own
story and is structurally unable to corrupt shared state:

- **Scope = one story only.** The sub-agent's prompt contains *only* that story file, its paired
  testplan, and that story's ACs. It implements that story's ACs (using the chat's resolved
  sub-agent discipline for that story, e.g. `mcp-developer` / `build-engineer`), runs its testplan
  TCs, and records AC pass/fail — and nothing about any sibling story.
- **Board files are FORBIDDEN.** The sub-agent prompt explicitly says **never MONITOR / ACTIVE**: the
  sub-agent must not read or write `MONITOR.md` / `ACTIVE.md`, and must not create ADR/BUG files or claim an
  ADR/BUG number. Sub-agents **never** write serialised state — that is the main thread's job alone
  (ADR-0075 single-writer). A sub-agent that thinks it needs an ADR/BUG **proposes the body** in its
  handoff; it does **not** number or file it.
- **No cross-story coordination.** Because the batch is provably file-disjoint, the sub-agents work
  in the shared tree with no content collision; they do not need to talk to each other.

### Sub-agent prompt template (the safety boundary)

Every dispatched prompt is built from this template — the *exclusions are load-bearing*:

```
You are implementing exactly ONE story: STORY-NN.M.PP.
Inputs (the ONLY files you own): <story path>, <paired testplan path>.
Write ONLY the files listed in this story's files_touched: <files_touched list>.
Do: implement each AC; run every testplan TC's Command; record PASS/FAIL per TC and per AC.
Do NOT touch MONITOR.md or ACTIVE.md (forbidden);
        do NOT create or number any ADR-*/BUG-* file; do NOT edit any sibling story.
        If the work requires touching ANY file outside files_touched, STOP and report it in the
        handoff — do not create or edit it (an undeclared write breaks the disjoint-file guarantee).
Return: the structured handoff described below — raw data, not prose for a human.
```

## Step 3 — Structured handoff (sub-agents return data, not board writes)

Each sub-agent returns a **structured handoff** that the main thread later reconciles (the
reconciliation pass itself is defined in the next section). Returning data — rather than writing
shared state — is what keeps fan-out race-free. The handoff shape per story:

- `story_id` — the story it worked.
- `status_flip_proposal` — proposed terminal status (`done`, or `in-progress` if a DoD/TC failed)
  plus the `completed_at` it would stamp. The main thread, not the sub-agent, applies the flip.
- `ac_verification_log` — each AC with PASS/FAIL and the evidence (the TC command output).
- `testplan_results` — each TC id → PASS/FAIL (+ the failing output if any).
- `proposed_adrs` — zero or more **draft ADR bodies** (title + content) for non-obvious decisions,
  **un-numbered** (the main thread assigns the sequential `ADR-NNNN`).
- `proposed_bugs` — zero or more **draft BUG bodies** for any TC failure / defect, **un-numbered**
  (the main thread assigns the sequential `BUG-YYYYMMDD-NN`).
- `files_changed` — the files the sub-agent actually wrote (for the reconciliation commit).

The main thread collects every story's handoff and applies them in one ordered pass (next section).

## Step 4 — Reconciliation (single-writer, serialised)

After **all** sub-agents return, the **main thread alone** folds the handoffs onto the board in one
ordered pass. Sub-agents proposed; the main thread disposes. This is the *single-writer* contract of
ADR-0075 — there is exactly one writer of serialised state, so nothing races.

### Reconciliation order (deterministic — apply in this exact order)

Process the collected handoffs in **deterministic story order** (the chat's listed order), and within
that, in these stages — **first** collect, **then** number, **then** flip, **then** write the board,
**then** commit:

1. **Collect** every story's structured handoff (from Step 3). Partition into **succeeded** (proposes
   `done`, all ACs/TCs PASS) and **failed** (any AC/TC FAIL or DoD gap).
2. **Assign sequential IDs (main-thread-only).** For every `proposed_adr` / `proposed_bug` body, the
   main thread computes the **next free** number **at write time** by globbing the existing
   `ADR-*` / `BUG-*` files — never a number pre-assigned during fan-out — so two stories can **never**
   collide on the same `ADR-NNNN` / `BUG-YYYYMMDD-NN`. Numbers are allocated in story order, then the
   files are written by the main thread.
3. **Run the per-story DoD gate, then apply atomic status flips.** A story only flips to `done` once
   its **Definition-of-Done gate passes** — the main thread runs the same DoD checks `close-out-story`
   would (AC verification against the handoff's `ac_verification_log` + testplan PASS + the **R14
   AI-code review** for that story's diff). Only the **board write** (stage 4) is batched to once; the
   **DoD gate still runs per story**. For each story that passes, flip **`ready → done`** (the story
   was `ready` on the board through fan-out — the in-progress work happened inside its sub-agent),
   setting **both `started_at` and `completed_at`** in a **single edit** (atomic — status + both
   timestamps together, never half-flipped, never a `done` story with an empty `started_at`). This
   matches ADR-0077's `ready → in-progress → done` lifecycle, collapsed into one atomic write at
   reconciliation. For each failed story (DoD gap, TC FAIL, or no usable handoff), see
   partial-failure handling below.
4. **Write the board once — `MONITOR.md` + `ACTIVE.md`.** A single (`once`) `MONITOR` + `ACTIVE`
   write covers the whole batch — one revision-history block for every shipped story, one ACTIVE
   update — not once per story. Only this board write is batched; the per-story DoD gate in stage 3
   is **not**. Single writer + single write = no interleaving.
5. **Per-story commit checkpoint.** Commit each finalised story (`STORY-NN.M.PP — <imperative>`) so a
   crashed batch leaves completed stories committed and `done` (retained from `execute-batch`).

### Partial-failure handling (honest reporting)

A batch where some sub-agents fail must **not** abort the successful ones:

- A **failed** story is flipped **`ready → in-progress`** (set `started_at`, leave `completed_at`
  empty) and **left `in-progress`** (recoverable — never half-flipped, never silently `done`), with a
  one-line note of why; its proposed BUG body is filed (numbered by the main thread).
- A story whose sub-agent **returned nothing or a garbled handoff** (crash, timeout, or a terminal
  API error after retries) is treated **exactly like a failed story** — never silently dropped:
  left recoverable and named in the shipped-vs-not split below, so the operator always sees it.
- The **succeeded** stories still finalise to `done` and commit — the failure of one does not roll
  back the others.
- The run **reports the split**: which stories **shipped** vs which did **not**, plus the chat id to
  resume. Honest partial success beats an all-or-nothing abort.

> **Two batches back-to-back** must not double-count MONITOR's shipped totals — the count blocks are
> regenerated by `pm:monitor` from frontmatter (the source of truth), not incremented by hand.

## Step 5 — Guardrails (WIP limit + DoR refusal)

Batch mode must never quietly break the kit's own gate contract. Two guardrails sit on top of the
safety gate (Step 1):

- **DoR refusal (hard stop).** The skill **will not start** a batch if any story has unmet DoR — it
  **refuses** and names the failing story **and** the specific missing DoR item (e.g. "STORY-17.1.09
  — no paired testplan"). An unready story is never fanned out; the operator runs
  `/Tandem:refine-backlog` on it first. (This is the Step 1 DoR precheck, restated
  as a guardrail: refuse, don't degrade.)
- **WIP-limit interaction (preserve, do not raise — ADR-0077).** Batch-parallel **preserves the SOP
  §5 `in-progress` WIP limit (max 2) unchanged — it does not raise the limit.** This is safe at any
  fan-out width because fan-out consumes **zero** WIP slots: sub-agents work in isolation and never
  flip board status, so stories stay `ready` until the serialised reconciliation flips them one at a
  time (board `in-progress` ≤ 1 during the pass). The only WIP risk is *failed* stories left
  `in-progress`; to honour the cap, **at most §5-limit (2) failed stories stay `in-progress`; any
  excess failures are set `blocked`** (recoverable, with a note). Batch **width** is bounded by the
  soft batch-size limit (ADR-0026), and a batch beyond that bound **queues** — distinct from the WIP
  cap. See SOP §5 + ADR-0077.

## Output rules

- Status changes are THIS command's job (it is **not** dry-run — that's `execution-strategist`).
- Per-story commit messages: `STORY-NN.M.PP — <imperative>` (applied by the main thread in
  reconciliation, not by the sub-agents).

## Next command

Next: `/Tandem:run-testplan`
