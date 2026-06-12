---
name: execute-story
description: Start work on a Ready STORY. Use when the user asks to begin a story, execute a story, pull a story, or work on a story file under the project's stories folder. Verifies Definition of Ready, flips status to in-progress, reads the paired testplan, implements ACs one at a time, files ADRs and BUGs as they arise.
---

# Tandem: execute-story (Dev hat)

Operate as **Dev hat**. The user is pulling a Ready story into active work.

> **Parallel-execution note.** When this story runs as part of a fanned-out parallel batch, the concurrency model in [ADR-0075](../../_00-Project-Management/40-Decisions/ADR-0075-parallel-execution-concurrency-model.md) governs: the batch must be provably file-disjoint (`pm:batch-check`), and the **main thread is the sole writer** of `MONITOR.md` / `ACTIVE.md` and the sole assigner of sequential `ADR-NNNN` / `BUG-YYYYMMDD-NN` IDs — a sub-agent running this skill proposes ADR/BUG bodies but never claims an ID or edits the board. Atomic status+timestamp flips are unchanged.

## Pre-flight — refuse loudly if the kit isn't wired

Before anything else, run the cheap wiring gate: `node _00-Project-Management/93-Scripts/doctor.js --gate` (npm: `npm run pm:doctor -- --gate`). It is **silent on success**; on an unwired project it exits non-zero and prints one line — **kit not wired — run `npm run pm:install`**. If it fails, **refuse and surface that message verbatim** rather than proceeding — a mis-wired kit must fail loudly, not silently no-op. (STORY-12.2.03)

## Inputs needed

- Story file path — resolve the `stories` folder via the path map (`node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve stories`; the config is `90-Standards/pm-paths.json`), then glob for `EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-*.md` under it. (E.g., it resolves to `03-Stories` in a flattened layout.)
- If the user didn't supply it, ask: "Which story file? Or want me to list Ready stories?"

## Load into context

Folder locations are resolved through the path map (`pm-paths.js` / `pm-paths.json`) rather than hardcoded, ensuring consistent references across all skills. Use the resolver script `node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve <role>` to determine physical folders for logical roles such as stories, testplans, bugs, decisions, active, and templates. If NONE of the candidates exist for a given role, note it in the output (don't fabricate scaffolding) and degrade gracefully (e.g. redraft from in-context examples rather than from a templates file that doesn't exist; flag the gap in the end-of-session summary).

- **Story file** — at the resolved path from "Inputs needed" above.
- **Paired testplan** — resolve the `testplans` folder via the path map; glob for `EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-*.md` under it.
- **Parent feature + epic** — resolve the `features` and `epics` folders via the path map; read the parent FEAT file and its parent EPIC file.
- **SOP / DoR / DoD reference** — `_00-Project-Management/90-Standards/SOP.md` if present. If absent, fall back to project-root `CLAUDE.md` for DoD-equivalent rules.
- **Project-wide stack quirks** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` if present. If absent, infer from project-root `CLAUDE.md` + `package.json` scripts.
- **Templates folder** — resolve via the path map. If absent, file the gap as tech debt and redraft from sibling artefacts in the same EPIC/FEAT.
- **ADR folder** — resolve the `decisions` folder via the path map.
- **Bugs folder** — resolve the `bugs` folder via the path map.
- **Active WIP index** — resolve the `active` folder via the path map and read `ACTIVE.md` from it. If the file doesn't exist, skip the WIP-removal step; the `status: in-progress` flip on the story file is the canonical source of WIP truth.
- **Project root `CLAUDE.md`** — always loaded for project-specific overrides.

Use `Read` / `Glob` to detect existence rather than assuming; treat missing files as "not present" rather than throwing.

## Task

1. **Verify the DoR is satisfied** (SOP.md §6). If a checklist item fails — STOP, list the gap, ask the user. Do not proceed.

2. **Flip story status:** `ready` (or `not-started`) → `in-progress`. Set `started_at` to now (ISO 8601 + offset, from system clock). Atomic edit. Update the resolved ACTIVE.md if one exists — skip silently if it doesn't.

3. **Implement the story:**
   - **Resolve the sub-agent before implementing:** use the story's `suggested_agents:` if set, else the PROJECT-CONTEXT `type_of_work → sub-agent` map, else discipline-only / `general-purpose`. An unknown or uninstalled agent never blocks — degrade to the next step. Name the chosen sub-agent, and dispatch suitable implementation work to it (SOP §18). See SOP §11.3 / FEAT-03.1.
   - Work the acceptance criteria one at a time.
   - For each AC, write the code AND wire the corresponding TC's setup.
   - **Tick the AC's checkbox in the story body in the SAME edit as the code/artefact change that satisfies it.** Do NOT defer body-checkbox ticking to the close-out pass — that creates a gap window where the story's frontmatter trends toward `done` while the body still says nothing's complete. For an AC resolved via spec-error exception (the AC was wrong, replaced by an ADR), still tick the box and append an inline ratification note (e.g., `- [x] <AC text> — ratified via ADR-NNNN §Verification (deferred per <trigger>)`). Strict DoD rule: "All AC checkboxes ticked" is non-negotiable. Precedent: FEAT-00.5 4-way close-out 2026-05-23 caught 20 unticked boxes across 4 stories at the explicit `/close-out-story` invocation because the body-tick step had been skipped through the execute-story cycle.
   - Tests must run via the commands documented in the TESTPLAN — do not improvise commands during execution.
   - For multi-file searches like "where is symbol X" — delegate to Explore agent (SOP §18). Don't paste grep results into main thread.
   - **Before adding any new top-level structural element to an existing file** (jest `describe(...)` block, Playwright `test.describe(...)` block, Firestore rule `match /collection/{id}` block, GraphQL resolver, OpenAPI path, route module export, etc.), grep that file for the exact name to surface collisions. The Explore-agent inventory step at the start of "verify + harden" stories MUST include a "find existing structural-name collisions inside files we'll touch" pass — filename matching alone misses in-file duplicates (precedent: STORY-00.4.01 close-out 2026-05-23 caught a duplicate `describe('activity_logs collection', ...)` block only at the DoD code-review stage, after the testplan had already run with both blocks active).

4. **Whenever you make a non-obvious decision** (library choice, threshold, schema field name, deferred sub-feature, divergence from defaults), STOP coding and:
   - Find the next free `ADR-NNNN` (glob the resolved ADR folder).
   - Create `<resolved-adr-folder>/ADR-NNNN-<slug>.md` using `ADR.template.md` if present, else redraft from a sibling ADR in the same folder.
   - Add the ADR ID to the story's `decisions:` frontmatter array.
   - Resume coding.

5. **Whenever you observe a defect** (yours or pre-existing), STOP and:
   - File a BUG at `<resolved-bugs-folder>/EPIC-NN/FEAT-NN.M/BUG-YYYYMMDD-NN-<slug>.md` using `BUG.template.md` if present, else redraft from a sibling BUG.
   - Decide: fix-now (block this story) or fix-later (link from BACKLOG).
   - Reference the bug in the story's body.
   - **Spec-error exception:** if the failure indicates the AC is wrong (budget set without measurement, vocabulary that contradicts shipped code, etc.) rather than a code defect, file an **ADR** documenting the spec correction instead of a BUG. The ADR linked from the TC's `Result:` line IS the resolution. Cite the ADR in the story body. Don't file both for the same root cause.

6. **Default stop-state:** when all ACs implemented and self-review done, flip status to `in-review` and STOP. Do **not** set `completed_at` yet — that's the DoD gate via `/Tandem:close-out-story`. Do **not** auto-run `/run-testplan` or `/close-out-story` — those are deliberate next invocations the user owns, giving a QA-as-second-pair-of-eyes break between dev work and DoD sign-off.

   **Combine-into-one-cycle exception:** it IS appropriate to chain execute → run-testplan → close-out → MONITOR + dashboard sync all the way to `status: done` within a single execute-story invocation when:
   - The user explicitly requests it ("execute and close out together", "do the full cycle", "4-way batch", etc.), OR
   - The story is a **paperwork-only ratification spike** — no source-code change, only ADR-writing or status-flipping, where the QA pass adds no signal because there's nothing executable to QA beyond the static-analysis TCs the implementation step just satisfied (precedent: FEAT-00.5 4-way close-out 2026-05-23 — 4 spike stories closed in one cycle with 4 new ratification ADRs).

   Default for code-touching stories is the staged flow (stop at `in-review`); combined-cycle is the exception, not the rule.

## Output rules

- Tick AC checkboxes in the story file as you complete them.
- Update TC `Result:` lines in the TESTPLAN as you run them.
- Commit messages: `STORY-NN.M.PP — <imperative>`.
- If you hit a `blocked` situation, flip status to `blocked`, note the reason in the story body, return to user.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (set `started_at` on in-progress; do **not** set `completed_at` yet).
- Status enum (closed set of 9).
- ADR on the spot for non-obvious decisions.
- Bug auto-raise for any defect, in the same response as the observation.
- Templates rule — never redraft section headings.

## End-of-session summary (always emit)

- ACs ticked: X / Y
- TCs run: X / Y (PASS / FAIL counts)
- ADRs created: <list of paths>
- BUGs filed: <list of paths>
- Status now: `in-progress` | `in-review` | `blocked`
- Next step: `/Tandem:run-testplan` if in-review; fix block if blocked
