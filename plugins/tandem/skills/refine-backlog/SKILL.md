---
name: refine-backlog
description: Refine a BACKLOG item or not-started STORY by running the SOP §6 Definition of Ready checklist. Use when the user asks to refine the backlog, refine an item, promote to ready, run DoR, gate a story, do a Friday review, or invokes /Tandem:refine-backlog. Operates as PM hat. Either flips status to ready (if all DoR items pass) OR stops, lists gaps, and asks — never silently promotes.
---

# Tandem: refine-backlog (PM hat)

Operate as **PM hat**. The user wants to take a BACKLOG entry or a `not-started` STORY through the Definition of Ready gate — either promoting it to `ready` (eligible to pull into work) or surfacing exactly what's missing.

This skill is the slash-command wrapper for the kit's canonical refinement prompt. The prompt is the source of truth; this file is the entry point.

## Source of truth

@_00-Project-Management/92-Prompts/05-refine-backlog-to-ready.md

Follow that prompt verbatim. The sections below add only the slash-command-specific glue + the DoR enforcement contract — do not re-declare the prompt's content here.

## Definition of Ready (DoR) — what we're gating against

Per SOP §6, a story is `ready` only when **all** of the following are true. The skill walks each item; missing items abort the promotion with a clear gap list.

- [ ] **Linked to a Feature → Epic → OKR or PRD.** Story frontmatter `feature:` and `epic:` set; parent Epic has `okr:` or `prd_section:` populated.
- [ ] **AC written as testable checkboxes.** Each AC verifiable by a machine, not by vibes.
- [ ] **Paired TESTPLAN exists at the mirrored path.** `33-Testplans/EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-<slug>.md`.
- [ ] **Every AC maps to ≥1 TC in the TESTPLAN.** Coverage matrix complete.
- [ ] **Every TC has a runnable `Command:`.** No "have a human verify" steps.
- [ ] **Dependencies listed and either done or scheduled.** No floating "depends on TBD".
- [ ] **Estimate set** (XS / S / M / L). `XL` means split before promoting.
- [ ] **`type_of_work` set to a concrete discipline** (`frontend` / `backend` / `infra` / `data` / `docs`) — not the template placeholder. A missing or placeholder value is a DoR gap (it fuels `execution-strategist` sub-agent assignment; see SOP §11.3 / FEAT-03.1).
- [ ] **Risks section non-empty.** "None — reviewed YYYY-MM-DD" counts; blank does not.
- [ ] **Premise verified.** Any claim the item makes about **another artefact's state** (status / existence / supersession), or any intent to **retire / archive / delete / supersede / mutate** a named `STORY-`/`FEAT-`/`EPIC-`/`ADR-`/`BACKLOG-` artefact, has been **checked against that artefact's current frontmatter**. A claim that contradicts reality — or names an artefact that can't be resolved — is a DoR gap.

## DoR enforcement contract (MANDATORY)

This skill **never silently promotes**. The contract:

1. Walk the DoR checklist verbatim — every item gets PASS / FAIL with a one-line reason.
2. If **all** items pass → before flipping `status: not-started` → `ready`, perform a fill-if-missing check: if the story's `outcome:` frontmatter is empty or absent, dispatch a sub-agent with the `write-outcomes` skill — handing it the story's **title + acceptance criteria + technical notes** (the same dispatch input the other four FEAT-14.3 producers pass, per ADR-0059) — to auto-generate exactly one plain-text line, then write that line into `outcome:` (fill-if-missing only — never overwrite an existing outcome). Then flip the story (or BACKLOG entry, after conversion) `status: not-started` → `ready`. Atomic edit. Do **not** set `started_at` (that happens at `in-progress`, not `ready`). Show the user the result table.
3. If **any** item fails → **stop**. Do **not** flip status. Show the gap list and the smallest fix for each. Ask the user before patching — the skill never auto-completes the missing pieces (e.g. don't invent ACs, don't fabricate TCs, don't guess at risks).
4. **Sunset check** — per SOP §15, if a story has been `not-started` > 90 days, propose `wontfix` or `archived` instead of refinement. Stale items rot; the kit prefers honest sunsetting over false hope.

### Premise resolution (the "Premise verified" DoR item)

A story can be perfectly well-*formed* and still be *wrong*, because the other DoR items only check structure — never whether the item's stated premise is **true**. To walk the **Premise verified** item:

1. Scan the item's body/ACs for the tell — a phrase shape that makes a **state claim about a named other artefact** or proposes to **mutate** one: *"X is never-started / not-started / superseded / done / blocked / obsolete / duplicate"* or *"retire / archive / delete / supersede / close X"*, where **X is a `STORY-`/`FEAT-`/`EPIC-`/`ADR-`/`BACKLOG-` id**. (Only ids named **with a status claim or mutation intent** — a bare reference in prose does not trip the gate.)
2. **Resolve each named id** and read its current `status:` (and existence). If the artefact can't be found, or its real status contradicts the claim → **DoR FAILS**: do not promote; name the specific mismatch (claimed-vs-actual) and stop, consistent with the "never silently promote" rule above.

**Worked example (the regression fixture this guards) — STORY-15.1.02:** it asserted "STORY-04.6.01–05 are five never-started, superseded stories" and proposed to flip them to `archived` — but all five are genuinely `status: done`. Executing it would have silently corrupted the board (done-count 154→149) while **every structural gate stayed green** (`archived` + `completed_at` is enum-legal; R21 doesn't fire on terminal status). The premise check resolves `STORY-04.6.01…05`, sees `done`, and fails the gate before promotion — catching systematically what was previously caught only by luck (execution happening to inspect the targets first).

The gap-list path is the skill's load-bearing differentiator vs the plain paste-prompt. Silent or partial promotion would corrupt the kit's "Ready means Ready" invariant — every downstream skill (`execute-story` especially) relies on it.

## Inputs needed

- Either:
  - A path to a BACKLOG entry (`_00-Project-Management/11-Backlog/BACKLOG-NNNN-<slug>.md`) — large items get refined into a Feature spec first; small ones promote directly to a Story+Testplan pair.
  - A path to an existing `not-started` Story (`_00-Project-Management/32-Stories/EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-<slug>.md`) — direct DoR gate.
  - A short list of candidates ("top 5 by priority") if the user wants a batch review.
- If the user didn't supply anything, ask: "Which item(s)? Paste a path, a list of paths, or 'pick from not-started' if you want me to choose."

## Load into context

Use `Read` / `Glob` to detect existence. Treat missing files as "not present" rather than throwing.

- **Target item(s)** at the resolved path(s).
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` (specifically §6 DoR + §15 sunset rule). The DoR list above is sourced from §6; if §6 has drifted from this skill's list, **§6 wins** — flag the drift to the user.
- **Project context** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` (for stack-specific runnable-command conventions when checking testplan TCs).
- **MONITOR** — `_00-Project-Management/42-Monitor/MONITOR.md` for current WIP. After processing, the skill suggests "WIP is currently N in-progress + M in-review. You have capacity to pull K more."
- **Parent artefacts** — for each target Story, also load its parent Feature + Epic to verify the strategic-linkage DoR item.
- **Templates** — `_00-Project-Management/91-Templates/STORY.template.md` + `_00-Project-Management/91-Templates/TESTPLAN.template.md` (for the gap-fix proposals when ACs / testplans are incomplete).
- **Project root `CLAUDE.md`** — for project-specific overrides.

## Task

1. Read each target item end-to-end.
2. Walk the DoR checklist verbatim. Per item: PASS or FAIL, with a one-line reason citing what was checked.
3. If the item is a BACKLOG entry (not a Story yet), additionally judge:
   - **Story-sized?** Single coherent unit of work, fits an XS/S/M/L estimate → promote by creating STORY+TESTPLAN via `/Tandem:split-into-stories` (after refinement). Don't write them inside this skill.
   - **Feature-sized?** Multi-story scope → suggest the user run `/Tandem:split-into-features` on the parent Epic, or draft a new Feature directly.
   - **Sunset candidate?** Captured >90 days ago, no movement → propose `wontfix` or `archived`.
4. If all DoR items PASS for a Story → flip `status: not-started` → `ready`. Atomic edit. Do **not** set `started_at`.
5. If any FAIL → **stop**. Show the gap list + smallest fix per gap. Ask the user before any patching action.
6. Repeat per item. Process **serially** — one item at a time, user reviews each pass/fail decision before moving on.
7. Emit the summary table at the end (see Output rules).

## Output rules

- **Never silently promote.** Every gap blocks the flip. No "I'll just fill that in for you" — the user owns the decision to patch or defer.
- Process candidates **serially**, not in parallel — gives the user a beat to review each pass/fail call.
- Show a summary table at the end:

  | Item | DoR result | Notes |
  |---|---|---|
  | STORY-NN.M.PP | ✓ ready | Promoted 2026-MM-DD |
  | STORY-NN.M.PP | ✗ fail | Missing: estimate, risks. Smallest fix: ... |
  | BACKLOG-NNNN | ✗ sunset | Captured 2025-MM-DD (>90 days), no movement — propose wontfix |

- Do **not** pull anything to `in-progress` here. That's `/Tandem:execute-story`.
- After processing, surface capacity guidance: "WIP is currently N in-progress (max 2) + M in-review (max 3). You have capacity to pull K more. Top Ready candidate: STORY-NN.M.PP."

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps — flipping to `ready` touches `status:` only. **Do not** modify `started_at` or `completed_at`.
- Status enum — `ready` is one of the closed 9 values; do not invent intermediate states.
- DoR gate is **MANDATORY** — no shortcuts, no partial credit, no honour-system bypass.
- Sunset rule (SOP §15) — items `not-started` > 90 days should be honestly retired rather than perpetually refined.

## End-of-session summary (always emit)

- Items processed: N (serial)
- Promoted to `ready`: list of paths
- Blocked on DoR gaps: list of paths + gap-count per item
- Sunset proposed: list of paths
- WIP after this session: <N in-progress> + <M in-review> (capacity for K more)
- Top Ready candidate to pull next: STORY-NN.M.PP

## Next command

Next: `/Tandem:execution-strategist`

`/Tandem:split-into-stories <feature-path>` — if a refined item turned out to be feature-sized.

Or, if a Story is now `ready` and within WIP capacity: `/Tandem:execute-story <story-path>` — start the work.
