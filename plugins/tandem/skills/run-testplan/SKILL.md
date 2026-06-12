---
name: run-testplan
description: Run every test case in a TESTPLAN. Use when the user asks to run a testplan, execute tests, verify a story, or work with a testplan file under the project's testplans folder. Runs each TC's Command verbatim, marks PASS/FAIL, and auto-files BUG-YYYYMMDD-NN files for every failure before reporting in chat.
---

# Tandem: run-testplan (QA hat)

Operate as **QA hat**. A story has flipped to `in-review` and its paired testplan needs verification.

## Pre-flight — refuse loudly if the kit isn't wired

Before running any TC, run the cheap wiring gate: `node _00-Project-Management/93-Scripts/doctor.js --gate` (npm: `npm run pm:doctor -- --gate`). It is **silent on success**; on an unwired project it exits non-zero and prints one line — **kit not wired — run `npm run pm:install`**. If it fails, **refuse and surface that message verbatim** rather than proceeding — a mis-wired kit must fail loudly, not silently no-op. (STORY-12.2.03)

## Inputs needed

- Testplan file path — resolve the `testplans` folder via the path map (`node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve testplans`; the config is `90-Standards/pm-paths.json`), then glob for `EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-*.md` under it. (E.g., it resolves to `05-Test` in a flattened layout.)
- If the user didn't supply it, infer from a recently-completed story or ask.

## Load into context

Folder locations are resolved through the path map (`pm-paths.js` / `pm-paths.json`) rather than hardcoded, ensuring consistent references across all skills. Use the resolver script to determine physical folders for logical roles such as stories, testplans, bugs, and templates. If NONE of the candidates exist for a given role, note it in the output (don't fabricate scaffolding) and degrade gracefully.

- **Testplan file** — at the resolved path from "Inputs needed".
- **Paired story** — resolve the `stories` folder via the path map and read the corresponding STORY file.
- **SOP / DoD reference** — `_00-Project-Management/90-Standards/SOP.md` if present. If absent, fall back to project-root `CLAUDE.md`.
- **Stack quirks** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` if present. If absent, infer from `package.json` + project-root `CLAUDE.md`.
- **BUG template** — resolve the `templates` folder via the path map and read `BUG.template.md` if present. If absent, redraft from a sibling BUG in the same FEAT folder.
- **BUGs folder** (for filing new ones) — resolve the `bugs` folder via the path map.
- **Project root `CLAUDE.md`** — always loaded.
- **Prior HTML context (`html_context:`)** — if the testplan (or its paired story) frontmatter carries a non-empty `html_context:` array, `Read` every repo-relative path it lists (explorations, annotated diffs, options-comparisons) into context **before** executing the test cases, so test interpretation is grounded in the same architectural reasoning the human reviewer had. Skip entries that don't resolve (validator R16 already flags missing/traversal paths at `pm:lint` — don't double-report, just note the skip). Treat the SOP §11 50 KB guideline as advisory: summarise very large files rather than reading them whole.

Use `Read` / `Glob` to detect existence rather than assuming; treat missing files as "not present" rather than throwing.

## Task

1. **Flip the testplan's status:** `not-started` → `in-progress`. Set `started_at` to now. (Testplans don't use `in-review` — that's the story's status. If you find the testplan already at `in-review` from a prior skill misuse, flip it back to `in-progress` for this run, then on to `done` if all PASS.)

2. **Verify all Preconditions** in the testplan are met. If not, STOP and report.

   **Ingest prior HTML context first.** If the testplan (or its paired story) carries a non-empty `html_context:`, `Read` every listed prior HTML artefact into context now — before any TC runs (see "Load into context" above) — so the expected behaviour is interpreted against the same architectural reasoning the human reviewer had.

3. **Run every TC in order:**
   - Execute the `Command:` exactly as written. **No improvisation.** No "I'll try a slightly different command."
     - **Runtime-on-PATH exception:** if a command fails only because its runtime isn't on the shell PATH (`exit 127` / "command not found" for `node`/`npm`/etc.), that's an environment gap, not a bad command — resolve it per `PROJECT-CONTEXT.md` "Known stack gotchas" (put the runtime on PATH or invoke its absolute binary), then re-run the **same** command verbatim. Resolving the runtime ≠ rewriting the `Command:`.
   - Compare actual output to `Expected:`.
     - **Confound caution (dashboard TCs):** if a TC asserts via a bare `grep <substring> DASHBOARD.html` (no `window.__DATA`/element qualifier), treat a PASS/FAIL with suspicion — the generator embeds every artefact body into `window.__DATA`, so the substring may match indexed *prose*, not the rendered feature (precedents: BUG-20260606-02, TESTPLAN-15.2.02/04). Still run the `Command:` verbatim, but if the result looks confounded, file a BUG against the testplan (not the product) and flag the TC for re-authoring to a payload-/element-scoped assertion (see `split-into-stories` testplan-authoring rule).
   - Update the TC's `Result:` line:
     - `PASS — YYYY-MM-DD` on success.
     - `FAIL — see BUG-YYYYMMDD-NN` on failure (link the bug you file).

4. **If a TC fails — IMMEDIATELY:**
   - File a BUG at `<resolved-bugs-folder>/EPIC-NN/FEAT-NN.M/BUG-YYYYMMDD-NN-<slug>.md` using `BUG.template.md`. Include full repro, environment snapshot, first analysis hypothesis, suggested fix direction. A junior dev should be able to act on it without asking questions.
   - Update the failed TC's `Result:` line to reference the bug.
   - If the failure is critical and blocks the rest of the run, STOP further TC execution. Otherwise continue.
   - A bug filed in chat-only is a process violation — the BUG file must exist on disk before you report the failure in your summary.
   - **Spec-error exception:** if the failure indicates the AC / Expected line is wrong (budget set without measurement, expected vocabulary that contradicts shipped code, etc.) rather than a code defect, file an **ADR** documenting the spec correction in place of a BUG. The ADR linked from the TC's `Result:` line IS the resolution. Don't file both for the same root cause.

5. After all TCs run, update the testplan's "Sign-off" section.

6. **If ALL TCs PASS** — flip testplan status to `done`. Set `completed_at` to now. Recommend `/Tandem:close-out-story` next.

7. **If ANY TC FAILed** — leave testplan as `in-progress`. Story stays `in-review`. The dev needs to fix the bugs and re-run the failed TCs.

## Output rules

- Run TCs serially, not in parallel — easier to attribute failures.
- **Batched-pattern invocation is OK** when commands share a runner (e.g. running multiple jest TCs in one `--testPathPattern` invocation), AS LONG AS the runner's per-file PASS/FAIL output keeps each TC's `Result:` line independently attributable. Don't batch across runners (jest + Playwright + bash scripts in one call); those run separately.
- For UI test commands: capture screenshot artifacts to the resolved reports folder (`41-Reports/` canonical or `_Reports/` flattened) if helpful.
- Trim log output in BUG evidence sections to ≤30 lines, key frames preserved.
- For long-running test suites that produce noisy logs: spawn a fresh agent (SOP §18) and get back the PASS/FAIL summary — don't paste 500 lines of stdout into the main thread.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps.
- Status enum.
- Bug auto-raise on failure — MANDATORY, in the same response as the failure observation.
- Templates rule.

## End-of-run summary (always emit)

- TCs PASSED: X / Y
- TCs FAILED: Y - X
- BUGs filed: <list of paths>
- Testplan status: `done` | `in-progress`
- Recommended next step:
  - All PASS → `/Tandem:close-out-story`
  - Any FAIL → assign bugs to Dev hat; re-run testplan after fixes

## Next command

Next: `/Tandem:close-out-story`

When every TC PASSes, close the story through the Definition of Done gate.
