---
name: execution-strategist
description: Plan how to execute a whole epic — group its stories into "chats" that are genuinely good to run together, the way a lead plans a sprint. Use when the user asks to plan execution, strategise an epic, group stories to run together, decide what to batch, or invokes /Tandem:execution-strategist (typically with an EPIC-NN). Operates as PM hat. Takes an epic, reads all its not-done stories + paired testplans, and writes an Implementation Strategy — phases → chats, each with execution lanes (serial/parallel), sub-agents, a paste-ready trigger, a verify-before-closing command, and depends/unlocks edges — as a markdown report PLUS a structured JSON sidecar. DRY-RUN: never modifies story status.
---

# Tandem: execution-strategist (PM hat)

Operate as **PM hat**. After an epic has been planned, the user runs this skill to get the best
way to clear that epic's stories in a small number of batched "chats" — reasoning about which
stories are genuinely **good to do together** (a long view, like planning a sprint), not just
mechanical matching. The output (an **Implementation Strategy**) is the input to
`execute-batch` / `execute-story` and is rendered by the dashboard's Implementation Strategy view.

This file IS the source of truth for the behaviour. Grouping is **judgment-led** (see ADR-0025):
two runs may differ, and that is acceptable — the plan is a dry-run proposal you review before
acting. Verification is therefore **structural** (does each chat carry lanes, sub-agents, a
trigger, a verify line, valid phases?), not exact-output matching.

## Dry-run contract (read-only — MANDATORY)

- It **reads** story + testplan frontmatter/content and **writes exactly two artefacts**: the
  Implementation Strategy report (`.md`) and its paired structured sidecar (`.json`), both under
  `41-Reports/`.
- It does **NOT modify story status**, does **NOT** flip anything to `in-progress`, does **NOT**
  edit any story, testplan, MONITOR, or dashboard. Acting on the plan happens later via
  `/Tandem:execute-batch`. If asked to "start"/"pull" a chat, stop and clarify —
  that is `execute-batch`.

## Inputs needed

- **An epic identifier** — `EPIC-NN` (or a path under `32-Stories/EPIC-NN/`). If the user didn't
  supply one, ask: "Which epic? e.g. `EPIC-100`." Optionally a target date for the filename
  (default: today, system clock).

## Load into context

Use `Read` / `Glob` to detect existence; treat missing files as "not present", never throw.

- **Epic-scoped stories** — glob `_00-Project-Management/32-Stories/EPIC-NN/FEAT-*/STORY-*.md` for
  the named epic only. Keep every story that is **not-done** (exclude `done` / `wontfix` /
  `duplicate` / `archived`). This is the corpus — the whole epic, not just `ready` ones.
- **DoR flag** — a story whose `status` is not `ready` (e.g. `not-started`) is still **included**
  but **flagged** with a visible DoR-gap marker, so the user knows that chat needs
  `/Tandem:refine-backlog` before it can actually run. Never silently drop it.
- **Paired testplans** — for each story, read `_00-Project-Management/33-Testplans/EPIC-NN/FEAT-*/TESTPLAN-NN.M.PP-*.md`
  (used to compose the verify line — see step 6).
- **Story frontmatter fields consumed:** `id`, `feature`, `estimate`, `priority`, `status`,
  `type_of_work`, `suggested_agents` (FEAT-03.1), `depends_on`, `files_touched` (ADR-0020).
- **PROJECT-CONTEXT.md** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` "Sub-agent
  mapping" (the `type_of_work → sub-agent` default map) + "Quality commands" (the DoD fallback
  for verify lines).
- **SOP** — `90-Standards/SOP.md` (status/estimate enums, §11.3 sub-agent resolution).
- **ADRs** — ADR-0020 (depends_on/files_touched), ADR-0023 (sub-agent metadata), ADR-0025
  (judgment-led determinism stance), ADR-0026 (soft batch-size bounds).

## Step 1 — Scope the epic

Collect the epic's not-done stories (above). For each, note id, title, feature, status, estimate,
priority, `suggested_agents`, `depends_on`, `files_touched`, and a `ready` boolean
(`status == ready`). Flag any not-`ready` story for the DoR-gap marker.

## Step 2 — Group into chats (JUDGMENT-LED)

**Reason** about which stories are genuinely good to execute together in one fresh chat — shared
domain, a dependency you'd want warm, the same files, a coherent slice of the epic. Think like a
lead planning a sprint, not a mechanical matcher. The old affinity signals (same FEAT,
`depends_on` chain, `files_touched` overlap) are **inputs to your judgment**, not the whole story.
Each chat gets a **one-line rationale** explaining *why these belong together*.

**Soft bounds (ADR-0026, amends ADR-0021):** aim for **2–5 stories** per chat. These are
**guidance, not hard caps** — you MAY deviate (a justified single-story chat, or a cohesive
6-story phase) when the reasoning warrants it, but you MUST record the deviation in that chat's
rationale. A story with no good companion is its own chat (note "runs solo — no good co-batch").

## Step 3 — Derive lanes (serial vs parallel)

Within each chat, mark how its stories sequence:

- **Serial** — stories linked by `depends_on` form an ordered chain (e.g. "serial (A → B)").
- **Parallel** — two stories are parallel-**safe** ONLY when their `files_touched` lists are
  provably **disjoint** (no shared path). Label e.g. "3 parallel (separate files)".
- **Default to serial** when `files_touched` is missing or overlap is uncertain — be
  **conservative**; never assert parallel you can't prove disjoint.

This skill only **plans** lanes. Actually running stories concurrently (fan-out) is **BACKLOG-0020**,
out of scope here.

## Step 4 — Assign sub-agents (per chat)

Resolve each story's sub-agent via the FEAT-03.1 order: the story's **`suggested_agents`** if set
→ else the **PROJECT-CONTEXT** `type_of_work → sub-agent` **map** → else discipline-only /
**`general-purpose`** **fallback**. An unknown/uninstalled agent never hard-fails — degrade to the
next step. Aggregate the distinct resolved agents per chat **with counts** (e.g.
`react-expert ×2, javascript-pro`) into the chat's `sub_agents`.

## Step 5 — Compose the paste-trigger (per chat)

A ready-to-paste prompt the user drops into a fresh chat. Template:

> Execute STORY-A, STORY-B together. [lanes: serial chain A → B / N parallel, file-isolated].
> Follow CLAUDE.md gates: paired testplan per story, auto-file BUG-* on any TC failure, atomic
> status → done. Sub-agents: [resolved list].

The trigger drives the existing `execute-batch` / `execute-story` flow — it does **not** invent a
new runtime.

## Step 6 — Compose the verify-before-closing line (per chat)

From each constituent story's **paired testplan**, collect the **P0 + integration** TC `Command`s
and join them with `&&` into one verify line (de-duplicate identical commands across the chat;
skip `manual-review-by-claude` TCs — they have no runnable command). **Fallback:** when a story
has no P0/integration TC, use the project **DoD quality gates** (lint / typecheck / test / build
from PROJECT-CONTEXT) plus `npm run pm:lint`.

**Exit-code gates only (MANDATORY — BUG-20260608-01).** Every gate in the verify line must rely on
the command's **exit code**, never on a substring of its output. Emit `npm run pm:lint >/dev/null
2>&1 && echo OK` (the script exits non-zero on any violation — let that gate). **Never** emit the
`npm run pm:lint 2>&1 | grep -E "violations" | tail -1` shape: the summary reads `N violation(s)`
(no bare `violations` substring) and a trailing `| tail` always exits 0, so that pipeline can never
fail and would green-light a dirty corpus. The same rule applies to any `grep … | tail`/`| head`
"gate" — a pipe into `tail`/`head` masks the real exit status.

**Never re-emit `npm run pm:mirror`.** The scaffold-parity mirror gate was retired in ADR-0074 (the
script no longer exists in `package.json`), so a verify line that calls it would now hard-fail on a
missing script. Do not append `&& npm run pm:mirror` (or `npm run pm:mirror &&`) to any emitted
`verify` block. Historical sidecars that still carry it are a one-time cleanup, not a live gate.

## Step 6b — Generate chat and phase outcomes (via `write-outcomes` skill)

For each **chat** and for each **phase**, dispatch a sub-agent with the `write-outcomes` skill to
synthesize a **fresh, founder-facing outcome line** — a single plain-text sentence describing *what
the founder will have* once that chat/phase lands (the new capability, not the implementation).
**Critical nuance:** The outcome is a **fresh synthesis** of the grouped stories' collective value,
**NOT** a concatenation or list of individual story outcomes. The sub-agent is handed the grouped
stories' technical scope and writes one clean line. Capture the returned line verbatim (no
markdown, no "Outcome:" label, no quotes) and write it into the JSON sidecar's `chats[].outcome`
and `phases[].outcome` fields, and render it in the markdown report.

**Ordering note (chats vs phases):** chats already exist by Step 2, so chat outcomes can be
synthesized here. **Phase outcomes are synthesized once Step 7 has grouped chats into phases** — the
phase set does not exist yet at this step, so run the phase-outcome dispatch after Step 7 (or treat
this step's phase pass as deferred until the phases are known). Either way a phase outcome is a
fresh synthesis of its constituent chats' collective value, not a concatenation of their lines.

## Step 7 — Order into phases + edges

Group chats into **ordered phases**, **foundation-first** (chats with no cross-chat dependency
come first; then themed phases). Compute chat-level **`depends_on` / `unlocks`** edges from the
cross-chat `depends_on` relationships between the constituent stories. Name phases by their theme
(e.g. "Foundations", then feature-themed).

## Output — Implementation Strategy (markdown report + JSON sidecar)

Write **two** artefacts (today's date; on same-day re-run append `-02`, `-03`, … — never clobber):

1. `_00-Project-Management/41-Reports/EXECUTION-STRATEGY-YYYY-MM-DD.md` — human-readable.
2. `_00-Project-Management/41-Reports/EXECUTION-STRATEGY-YYYY-MM-DD.json` — structured; the
   dashboard's Implementation Strategy view (FEAT-03.3) reads this. The per-chat `executed` flag
   lives here (default `false`; later flipped by `execute-batch` / by hand, then `pm:dash`).

### JSON sidecar schema

```json
{
  "epic": "EPIC-NN",
  "generated_at": "<ISO 8601>",
  "phases": [
    {
      "name": "Foundations",
      "outcome": "<optional: founder-facing 'what you'll have' once this phase lands>",
      "chats": [
        {
          "id": "CHAT-01",
          "title": "<short title>",
          "outcome": "<optional: founder-facing 'what you'll have' once this chat lands>",
          "stories": [{ "id": "STORY-NN.M.PP", "status": "ready", "ready": true }],
          "lanes": [{ "type": "serial", "stories": ["STORY-...", "STORY-..."] }],
          "sub_agents": ["react-expert ×2", "javascript-pro"],
          "trigger": "<paste-ready prompt>",
          "verify": "<&&-joined command>",
          "depends_on": ["CHAT-..."],
          "unlocks": ["CHAT-..."],
          "estimate": "<rolled-up>",
          "executed": false
        }
      ]
    }
  ]
}
```

**`outcome` (optional, per `phase` and per `chat`)** — a single founder-facing sentence describing *what you'll have* once that phase/chat lands (the capability, not the implementation). Omit it (or use `""`) when there's nothing founder-facing to say; it never affects grouping or the dry-run contract. When present, the dashboard's Implementation Strategy view surfaces it on phase headers and chat cards (FEAT-14.2). This mirrors the optional `outcome:` field on Story/Feature frontmatter (SOP §11; nudged by the non-fatal W1 `pm:lint` warning, ADR-0061).

### Markdown report

Renders the same data human-readably: a `## Phase N · <name>` heading per phase, then one block
per chat carrying its id, rolled-up estimate, title, **Stories** (DoR-gap flagged where
not-`ready`), **Lanes**, **Sub-agents**, a fenced **paste-trigger**, a fenced
**verify-before-closing** command, **Depends on / Unlocks**, and the phase/chat **outcome** line
(if present, rendered after the phase heading and after the chat title respectively). End with the next-command stub
`/Tandem:execute-batch <chat-id>`.

### Empty case (handle gracefully — do NOT error)

If the epic has **0** not-done stories, write a valid empty strategy (0 phases / 0 chats) stating
there is nothing to execute — and, if the only stories are `done`, say the epic is complete.

## End-of-session summary (always emit)

- Artefacts written: `EXECUTION-STRATEGY-YYYY-MM-DD.md` + `.json`
- Epic: EPIC-NN — stories scanned: N (R ready, U un-ready flagged)
- Phases: P · Chats: C
- Confirm: no story status was modified (dry-run).

## Non-negotiable rules from CLAUDE.md

- **Dry-run / read-only** — never changes a `status:` field; writes only the two report artefacts.
- Grouping is **judgment-led** (ADR-0025) — reason, don't mechanically match; record a rationale.
- Batch-size bounds are **soft guidance** (ADR-0026) — deviate only with a written rationale.
- Parallel lanes require **provably-disjoint** `files_touched`; default serial.
- Reports live in `41-Reports/`.

## Next command

Next: `/Tandem:execute-batch`

`/Tandem:execute-batch <chat-id>` — pull one proposed chat into a fresh working
chat. That command owns the status changes; this one does not.
