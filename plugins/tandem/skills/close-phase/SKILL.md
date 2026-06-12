---
name: close-phase
description: Close out a whole phase after an execution-strategist chat / execute-batch run finishes — gate on every phase story being done, compile a phase retrospective, capture follow-ups, update the board, then run a gated merge to main. Use when the user asks to close a phase, wrap up a phase, finish a batch/chat, run a phase retro, or integrate a finished phase.
---

# Tandem: close-phase (PM hat)

Operate as **PM hat**. `close-phase` is the **phase-level analogue of `close-out-story`**: where
`close-out-story` is the per-story Definition-of-Done gate, this is its per-phase counterpart —
invoked after an `execution-strategist` chat / `execute-batch` run finishes, to wrap a whole
**phase** up safely and integrate it.

> **Opener counterpart:** `start-phase` is the opener this skill closes against. `start-phase`
> **opens** a phase — it cuts the phase branch `phase/<phase-id>` off `main` per the shared
> **phase-branch convention** (recorded in `40-Decisions/`, ADR-0045); `close-phase` **closes**
> that same phase — it merges that branch back to `main` (Steps 6–7). Both skills obey the one
> branch convention, so the branch the opener creates is exactly the one the closer merges.

It runs in a fixed order, each step gated on the one before it:

1. **Phase-scope detection** — resolve the set of stories in an explicit target.
2. **Done-gate** — every phase story must be `done`, or abort and list the gaps.
3. **Retrospective** — what shipped, what went well / what didn't, the phase metrics.
4. **Follow-up capture** — file BACKLOG items + an ADR backstop for anything surfaced.
5. **Board update** — write the phase report, update `MONITOR.md`, regenerate the dashboard.
6. **Gated merge to `main`** — integrate only when the merge gate passes; never force-merge.

> **Dry-run-until-gated.** Steps 3–5 only read and append artefacts; the merge step is hard-gated
> and never force-merges (see "Integration"). If the done-gate fails, the skill stops and reports
> — it never partially wraps up an incomplete phase.

## Step 1 — Phase-scope detection (EXPLICIT target — never guess)

Take an **explicit** phase / chat / epic **target** from the user — never infer which phase to
close from ambient state. Accepted targets:

- a **strategist phase** or **chat id** (e.g. `CHAT-02`) from an `EXECUTION-STRATEGY-*.json`
  sidecar — resolve to the `stories[]` listed under that chat / phase;
- an **`EPIC-NN`** (or a single `FEAT-NN.M`) — resolve the **set of stories** belonging to that
  epic / feature by globbing `32-Stories/EPIC-NN/...`.

**Resolve the set of stories in the target phase** before doing anything else, then echo the
resolved list (id + status) back to the user so the scope is explicit and reviewable. If the
target is ambiguous, missing, or resolves to zero stories, **stop and ask** for a concrete
phase / chat / epic — do not guess which stories are in scope.

## Step 2 — Done-gate (every phase story must be `done`)

Verify **every** resolved phase story is `status: done`. This is a hard gate:

- If **all** phase stories are `done` → proceed to the retrospective (Step 3).
- If **any** are not `done` → **abort** and **list the not-done stories** (each `id` + its current
  `status`), so the operator knows exactly which stories still block the close. Do **not** compile
  a retro, capture follow-ups, update the board, or merge for an incomplete phase.

This mirrors `close-out-story`'s gate-then-act discipline at the phase level: the gate is
non-negotiable, and the abort-and-list path is the load-bearing behaviour — a half-closed phase
is worse than an un-closed one.

## Step 3 — Compile the phase retrospective

Once the done-gate passes, compile a **phase retrospective** — **derived from the phase's own
artefacts** (its stories, their paired testplans, and the `34-Bugs/` + `40-Decisions/` filed
during the phase), never invented from memory. Three parts:

- **What shipped** — list the phase's `done` **stories** and the **PASS** results of their paired
  **testplans** (the TCs that verify each story). One line per story: what it delivered.
- **What went well / what didn't** — a short, honest reflection: **what went well** this phase,
  and **what didn't go well / what to improve** next phase. Keep it specific to this phase's work,
  not generic platitudes.
- **Metrics** — the phase's hard numbers, read straight from the artefacts: **bugs** filed
  (`34-Bugs/`), **ADRs** created (`40-Decisions/`), and the execution **lanes** used (the
  serial / parallel lanes from the `execution-strategist` strategy this phase ran under).

Because every part is **sourced from the phase artefacts** — the stories' and testplans' statuses
and results, the bugs and ADRs filed in the phase — the retro is reproducible and auditable, not a
subjective recollection. This is **phase-cadence**, distinct from the time-cadence retros
(`weekly-monitor` / `monthly-retro`): it closes one phase, not a calendar window.

## Step 4 — Capture follow-ups (BACKLOG + ADR backstop)

Before touching the board, sweep the phase for loose ends and **capture** them so nothing
surfaced during the work is lost:

- **Follow-up capture (BACKLOG)** — for any **tech-debt**, deferred **idea**, or **follow-up**
  the phase surfaced, **file a BACKLOG item** (`11-Backlog/BACKLOG-NNNN-<slug>.md`, from
  `91-Templates/BACKLOG.template.md`). This mirrors `reflect` / `refine-backlog`: a follow-up that
  isn't filed is a follow-up that's lost.
- **ADR backstop** — verify an **ADR exists** for every non-obvious decision the phase made (the
  **ADR-on-the-spot** rule). If a decision was made during the phase but no ADR was filed, **file
  the missing ADR** now (`40-Decisions/ADR-NNNN-<slug>.md`) as a backstop, so the phase's
  decisions are all on record before the phase closes.

## Step 5 — Update the board

Write the phase up and refresh the live board:

- **Phase report** — write the retrospective (Step 3) plus the captured follow-ups (Step 4) to the
  **phase-report home**, `41-Reports/PHASE-<phase-id>-<YYYY-MM-DD>.md` (the home is fixed by a
  recorded ADR — see "Recorded decisions" below).
- **MONITOR** — update `42-Monitor/MONITOR.md`: a phase summary plus a one-line **revision-history**
  entry dated today.
- **Dashboard** — regenerate it with `npm run pm:dash` so `42-Monitor/DASHBOARD.html` reflects the
  closed phase.

### Recorded decisions

The skill's **name + phase-granularity** and the **phase-report home** are settled once in an ADR
(`40-Decisions/`), not re-litigated each phase. The home choice is **`41-Reports/PHASE-*`** (the
phase report is a generated execution artefact alongside `EXECUTION-STRATEGY-*`), rather than
`14-Retros/` (reserved for the time-cadence weekly/monthly retros).

## Step 6 — Integration: merge the phase to `main` (gated)

The integration step runs after the wrap-up — the retro, follow-up capture, and board update
(Steps 3–5) all happen first; only then does the phase merge to `main`.

### Step 6a — Already-merged detection (retro-only path)

**Before** evaluating the merge gate, detect whether the phase branch has **already been merged**
to `main` — the real order of events sometimes runs ahead of the board (this kit hit exactly this:
a phase branch was fast-forwarded into `main` in git while the board still said "merge pending").
Probe **true ancestry**, not a clean working tree:

```bash
git merge-base --is-ancestor phase/<phase-id> main && echo "ALREADY-MERGED" || echo "NOT-MERGED"
```

- **Already-merged** (`git merge-base --is-ancestor phase/<phase-id> main` exits **0** — the phase
  branch tip is reachable from `main`): route to the **retro-only path**. Steps 2–5 (done-gate,
  retrospective, follow-up capture, board + MONITOR + dashboard) **still run in full**; only the
  merge itself (Step 6 gate + Step 7 mechanism) is **skipped and marked already-integrated** in the
  phase report and the MONITOR revision-history line (e.g. "merge: already-integrated — phase branch
  is an ancestor of `main`"). Nothing is force-merged or re-merged; the retro + board update are the
  whole job.
- **Not-merged** (`--is-ancestor` exits **non-zero**): the **normal path** — fall through to the
  merge gate (below) and Step 7.

**Gate on true ancestry, never on a clean tree.** `--is-ancestor` is true only when the phase
branch tip is *fully* reachable from `main`; a **partially-merged** branch (some commits in `main`,
tip not yet) returns non-zero and therefore takes the normal merge path — a partial merge must
**not** be mistaken for a complete one. A clean working tree alone says nothing about whether the
phase was integrated, so it is **not** the signal used here.

On the **not-merged** (normal) path, before anything reaches `main`, a hard **merge gate** must
pass — **all four** items:

- **All phase stories `done`** — re-confirm the Step-2 gate still holds for every story in the phase.
- **`npm run pm:lint` green** — the PM artefacts validate.
- **Build / tests green** — the project's build and tests pass per `PROJECT-CONTEXT.md`'s quality
  commands (scoped to the area the phase changed).
- **Clean working tree** — `git status --porcelain` is empty (no uncommitted changes).

If **any** gate item is unmet, the skill **refuses to merge** and **reports which item failed** —
it does not proceed. A blocked merge names the failing gate item so the operator knows exactly
what to fix; it never merges a phase that hasn't cleared all four.

## Step 7 — Merge mechanism: PR-default vs gated direct

Once the merge gate (Step 6) passes, integrate via one of two mechanisms — never a force-merge:

- **Open a PR** — the **review-friendly default**. Open a pull request from the phase branch
  (`phase/<phase-id>` — the branch `start-phase` cut off `main` per the shared convention,
  ADR-0045) to `main` and **surface the PR command / link** for the operator to review and merge.
- **Gated direct merge** — for a solo / no-review workflow, a direct merge to `main` is allowed,
  but only once the Step-6 gate has passed.

In both cases the skill **surfaces the PR / merge command or link** rather than force-merging — it
**never force-merges** and never bypasses the gate. No `gh` CLI is assumed: surface a
copy-pasteable command or link; don't hard-call a host API. The PR-vs-gated-direct default and the
gate composition are recorded in an ADR (`40-Decisions/`) so the integration path is settled once.

### Step 7a — Log the approval (`10-Inbox/APPROVALS.md`)

A merge to `main` is a **manual, gated approval** — when the operator **confirms** it (the gated
direct merge, or merging the surfaced PR), **append a one-line approval entry** to
`10-Inbox/APPROVALS.md` so the sign-off survives beyond the chat transcript (audit + handover).
The same applies on the **already-integrated** retro-only path (Step 6a): record that the close was
confirmed even though no fresh merge ran. Append (newest at the bottom):

```
- <ISO 8601 timestamp> — <what was approved> — by: <who> — gated: <artefact / command>
```

e.g. `- 2026-06-06T15:55:00+01:00 — merge phase/p1-outcome-contract to main — by: operator — gated: close-phase Step 7 (gated direct merge)`.

- Use the **system clock** for the timestamp (ISO 8601 with offset), not the chat-stated date.
- It's a **one-line append**, not a ceremony. `10-Inbox/` is not a linted artefact folder, so the
  entry must keep the file valid plain markdown.
- If `10-Inbox/APPROVALS.md` does **not exist** yet, **create it** (header + the convention
  documented at the top of that file) and append the first entry. See the file for the full
  convention.

## Non-negotiable rules (from CLAUDE.md)

- Operates as **PM hat**; the phase-level analogue of `close-out-story`.
- The **done-gate** (Step 2) and the **merge-gate** (Step 6) are hard gates — abort and report on
  any unmet item; never partially close a phase and never force-merge.
- **ADR-on-the-spot** for any non-obvious phase decision; **auto-raise a BUG** for any defect.
- Status / timestamp flips, the MONITOR update, and the dashboard regen follow the kit's
  "when you change a status" rule (atomic edit + same-response board update + `npm run pm:dash`).

## End-of-session summary (always emit)

- Phase target + resolved stories (done / not-done).
- Done-gate: PASS / aborted (+ the not-done gaps).
- Retro written (+ path); follow-ups captured (BACKLOG + ADR list); board updated (MONITOR + dashboard).
- Merge gate: PASS / blocked (+ the failing item); mechanism: PR link or gated direct merge.
- Next step: the surfaced PR / merge command, or the gate gap to fix.

## Reset conversation Mode to Neutral

A closed phase means the active frame's work is done. Always reset:

`node _00-Project-Management/93-Scripts/mode.js set neutral --by auto-neutral --session <session_id>`

Announce it: *"Phase closed — Tandem mode reset to Neutral."* This is also how `dual`
returns to Neutral. Use the session ID from the session context.
