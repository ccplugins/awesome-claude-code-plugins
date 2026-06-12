---
name: close-out-story
description: Close out a STORY through the Definition of Done gate. Use when the testplan is fully PASS, when the user asks to close a story, to finish a story, to mark a story done, or to run the DoD check. Runs the DoD checklist, flips status to done, updates MONITOR, regenerates the dashboard.
---

# Tandem: close-out-story (QA → PM hat)

Operate as **QA hat** transitioning to **PM hat** for the MONITOR update. The testplan is `done` (all TCs PASS) and the story needs to gate through DoD.

## Inputs needed

- Story file path — try canonical (`_00-Project-Management/32-Stories/EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-*.md`) then flattened (`_00-Project-Management/03-Stories/EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-*.md`).
- The paired testplan should already be `done`. If not, redirect to `/Tandem:run-testplan` first.

## Load into context

The canonical layout is the scaffold under `_00-Project-Management/` (12-Active, 32-Stories, 40-Decisions, 42-Monitor, 90-Standards). Older / flattened repos may use alternate names — accept any of the below as a match. If NONE of the candidates exist for a given role, note it in the DoD output (don't fabricate scaffolding) and degrade gracefully (e.g. skip the WIP-removal step if no ACTIVE.md exists; the `status: done` flip is the source-of-truth anyway).

- **Story file** — at the resolved path from "Inputs needed" above.
- **Paired testplan** — under `_00-Project-Management/33-Testplans/...` (canonical) OR `_00-Project-Management/05-Test/...` (flattened).
- **SOP / DoD reference** — `_00-Project-Management/90-Standards/SOP.md` if present. If absent, fall back to project-root `CLAUDE.md` for DoD-equivalent rules.
- **Project-wide quality gate definitions** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` if present. If absent, infer from `package.json` scripts (see "Lint quality gate" in the DoD section).
- **Monitor** — try in order:
  - `_00-Project-Management/42-Monitor/MONITOR.md` (canonical)
  - `_00-Project-Management/00-Monitor/MONITOR.md`
  - `_00-Project-Management/00-Monitor/STORY-MONITOR.md` (older naming, e.g. Curated Lagos)
- **Active WIP index** — `_00-Project-Management/12-Active/ACTIVE.md` (canonical) OR `_00-Project-Management/00-Active/ACTIVE.md`. If neither exists, skip the WIP-removal step.
- **ADR folder** — `_00-Project-Management/40-Decisions/` (canonical) OR `_00-Project-Management/06-ADR/` (flattened). Required for DoD item 7's "ADRs present + linked" check.
- **Project root `CLAUDE.md`** — always loaded for project-specific overrides.
- **Prior HTML context (`html_context:`)** — if the story frontmatter carries a non-empty `html_context:` array, `Read` every repo-relative path it lists (explorations, annotated diffs, options-comparisons) into context **before** running the DoD AI-code review (item 6). These are the prior HTML artefacts the human reviewer read; the review agent reviews against the same architectural reasoning. Skip entries that don't resolve (validator R16 already flags missing/traversal paths at `pm:lint` — don't double-report, just note the skip). Treat the SOP §11 50 KB guideline as advisory: if a listed file is very large, summarise rather than reading it whole.

Use `Read` / `Glob` to detect existence rather than assuming; treat missing files as "not present" rather than throwing.

## Task — run the DoD checklist verbatim

For each item, mark PASS / FAIL with evidence.

### DoD checklist

1. [ ] All AC checkboxes in the story file are ticked.
2. [ ] All TCs in the testplan have `Result: PASS — YYYY-MM-DD` (or `FAIL` linked to a `wontfix`/accepted BUG with explicit user approval).
3. [ ] Project quality commands pass (from `PROJECT-CONTEXT.md` if present, else inferred from `package.json` scripts) — **scoped to the changed area, not the full repo**:
   - [ ] **Lint (scoped).** Resolution order: (a) `npm run lint` if defined in `package.json`; (b) `npx eslint <changed files>` IF a standalone ESLint config (`.eslintrc*`, `eslint.config.*`, or `eslintConfig` in `package.json`) exists at repo root; (c) if neither — most CRA/Vite/Next projects bundle ESLint into the build pipeline and have no standalone config — use `npm run build` as the lint substitute and note it explicitly in the DoD result row. NEVER report "lint skipped" silently; either it ran or it was substituted by build.
   - [ ] Type check (scoped if possible).
   - [ ] Unit tests (scoped to the modified module). For CRA projects, note that `npm test` only scans `src/`; tests outside `src/` (e.g. `firebase-functions/`, `scripts/`) need `npx jest <path> --testEnvironment=node`.
   - [ ] Build.
4. [ ] No new errors in the error tracker after smoke run (if applicable).
5. [ ] If UI: visual contract tests green (per `PROJECT-CONTEXT.md`).
6. [ ] **AI-code review pass.** First, if the story's `html_context:` array is non-empty, `Read` each listed prior HTML artefact into context (see "Load into context" above) so the review runs against the same architectural reasoning the human reviewer had. Then **delegate the code review to `/Tandem:peer-review`** — the canonical, reusable six-dimension, severity-ranked (blocker / major / minor) review contract (FEAT-05.2). Run it against the story's diff plus the prior HTML context; `peer-review` reviews for correctness, security, performance, maintainability, test coverage, and error paths, and **emits the AI-CODE-REVIEW HTML artefact** (see "AI-code-review artefact" below) — one canonical review path whether the review is invoked ad-hoc or here at the DoD gate, so the standalone skill and this gate never drift. Close-out then records the outcome in frontmatter and enforces the blocker gate below; the findings live in the artefact, not just the story body.

   **When to run (closed list — both rules in force):**
   - **Always** if the story ships test code (any new `*.test.*` / `*.spec.*` / `tests/rules/*` file, OR new `describe(...)` / `test.describe(...)` block in an existing test file), regardless of net-line count. **Reason:** test code that ships without an independent review tends to contain mock-vs-real coverage gaps, duplicate structural blocks (precedent: STORY-00.4.01 close-out 2026-05-23 H1), and assertion-shape brittleness that the dev pass misses. Three close-outs over 2025-05-22..2026-05-23 each surfaced 1+ HIGH finding under this rule.
   - **Always** if the diff exceeds 50 net lines across >2 files (the original general-purpose threshold).
   - **Skip** only for typo fixes, copy edits, one-line config tweaks, or pure frontmatter / status edits where no executable code or schema changed.

   **AI-code-review artefact (when the review runs — SOP §7.1):**
   1. Copy `_00-Project-Management/91-Templates/AI-CODE-REVIEW.template.html` to `_00-Project-Management/41-Reports/AI-CODE-REVIEW-<story-id>-<YYYY-MM-DD>.html` (today's date).
   2. Interpolate the real unified diff into the diff slot (`data-slot="diff"`) and one `<article class="anno-card severity-<level>">` per finding into the annotation slot (`data-slot="annotations"`). Each annotation carries `data-severity` (`blocker` / `critical` / `warning` / `nit`), `data-file`, `data-line`, `data-category` (security / correctness / perf / style / dead-code), plus reasoning and a suggested fix. Render reasoning/fix as text only — never `innerHTML` (XSS-safe).
   3. Write the artefact's repo-relative path into the story's `ai_review_artefact:` frontmatter, and set `ai_review: completed-YYYY-MM-DD` (today's date). **Set this token MECHANICALLY — never copy the review's verdict word.** The `ai_review:` field is a lifecycle marker, not a verdict: it is ALWAYS one of `completed-<today>` / `skipped-trivial` / `n-a`, regardless of whether the review's outcome was "APPROVE", "LGTM", "REJECT", or anything else. Copying a verdict word (e.g. `ai_review: approve`) is the exact defect BUG-20260608-01 recorded; validator **R14** now rejects any non-terminal `ai_review` on a `done` story, so a verdict word there will fail `pm:lint`.
   4. **Blocker gate (hard rule, SOP §7.1):** count the `data-severity="blocker"` annotations. **If blocker count > 0, this DoD item FAILs** — do NOT flip `status: done`. Report the blockers, fix them, re-review, and regenerate the artefact until the blocker count is zero. critical / warning / nit findings do not block the flip but must be triaged.
   5. For a **skipped** review (`skipped-trivial` / `n-a`), do NOT produce an artefact and leave `ai_review_artefact:` empty — validator R15b exempts those. Don't emit an empty placeholder artefact.
7. [ ] All ADRs created during execution are present in `40-Decisions/` and linked from the story's `decisions:` array.
8. [ ] Any tech debt observed during this work has a corresponding BACKLOG-NNNN file.

## If ANY item FAILs

- STOP. Do not flip status to `done`.
- Show the DoD result table.
- List the gap clearly. For each gap, propose the smallest fix.
- Ask the user before continuing.

## If ALL items PASS

1. Flip story status: `in-review` → `done`. Set `completed_at` to now (ISO 8601 + offset). **Atomic edit** — status + timestamp in the same write.

2. Remove the story from the resolved ACTIVE.md (canonical `12-Active/ACTIVE.md` OR flattened variant). **Skip this step entirely if no ACTIVE.md exists** — the `status: done` flip on the story file is the canonical source of WIP truth; the ACTIVE.md is just a cache.

3. Update the resolved MONITOR file in the **same response**:
   - Increment the shipped count (and per-epic / per-feature counts) IF the monitor maintains numeric totals.
   - Tick the bar character (░ → █) if MONITOR uses progress bars.
   - Prepend a one-line entry to the revision history with today's ISO date and the story ID + short outcome.

4. **Dashboard regeneration is project-specific.** Probe `package.json` for a `pm:dash` script (or equivalent — `dash`, `dashboard`, `monitor`). If it exists AND no Stop hook is configured for the project, run it. If neither the script nor a Stop hook exists, skip silently — not every project has a generated dashboard. Don't fabricate the command name.

## Output rules

- Show the DoD result table **before** flipping status — gives the user a chance to override.
- DoD is non-negotiable. "Tests are flaky so I'll skip" is not allowed — file a BUG or BACKLOG entry instead, and don't close the story until that's addressed.
- If a TC failed earlier but the bug was accepted as `wontfix` or pushed to BACKLOG, link the decision explicitly in the close-out note on MONITOR.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (`completed_at` set in the SAME edit as `status: done`).
- Status enum.
- DoD gate is mandatory.
- MONITOR update is in the same response as the status flip.
- Dashboard regen is handled by the Stop hook IF one is configured for the project; only run manually if no hook is active AND a dashboard script exists.

## End-of-close-out summary (always emit)

- DoD result: PASS / FAIL with gaps
- Story status now: `done` | still `in-review`
- MONITOR updated: yes / no
- Decisions captured: <list of ADRs>
- Tech debt captured: <list of BACKLOG entries>
- Uncommitted work: report the `git status --porcelain` line count; if > 0, note plainly that `done` means finished-and-verified-on-disk, NOT committed, and ask "commit now?". Do NOT auto-commit — commit only on explicit user request. (Stops `done` stories silently piling up uncommitted across back-to-back sessions.)
- Next Ready story to pull: <suggestion>

## Reset conversation Mode if this was the last story in the phase

After the story is `done` and MONITOR is updated, check whether any other story in the
SAME phase/feature set is still `in-progress`, `in-review`, or `ready`:

- **If none remain** (this was the last open story in the phase) → reset the mode:
  `node _00-Project-Management/93-Scripts/mode.js set neutral --by auto-neutral --session <session_id>`
  Announce it: *"Last story in the phase closed — Tandem mode reset to Neutral."*
- **If others remain** → leave the mode unchanged. Do NOT reset on every story close.

Use the same status scan you already perform for the phase; reuse `npm run pm:monitor`
output or the live frontmatter you just read. Never reset silently. Use the session ID
from the session context as `<session_id>`.

## Next command

Next: `/Tandem:close-phase`

When every story in the phase is `done`, close the whole phase (retrospective + gated merge).
