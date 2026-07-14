---
name: peer-review
description: >
  Start the Review phase of the SPARK loop: the Reviewer audits the diff
  produced by /increment — plan conformance, correctness, edge cases,
  security, test quality — and writes the review report. Use after
  /increment reports done, or to re-review after fixes.
---

# /peer-review — Review (Reviewer)

You are running the **code review** ceremony. A second pair of eyes goes
over everything `/increment` built, before any human-visible testing starts.

## Input

Optional argument: the feature name. Resolve as usual.

## Steps

1. **Check the gate.** The plan at `.spark/<feature-name>/plan.md` must show
   all tasks `done`. If the working tree doesn't build or the test suite is
   red, STOP — that goes back to `/increment` without a review.
2. **Delegate to the Reviewer.** Invoke the `reviewer` agent with the
   feature paths, the report template from
   `${CLAUDE_PLUGIN_ROOT}/templates/review-report.md`, and how to determine
   the diff (commit range or changed files since the increment started).
   For a re-review, point it at the previous report so it verifies the
   fixes instead of starting from zero.
3. **Present the report.** Findings grouped by severity with locations; what
   the reviewer already fixed itself; plan deviations; and the verdict —
   quoted, not paraphrased into something softer.
4. **Route the findings** with the user:
   - open Blockers/Majors → **`/increment`** (fix-mode), then re-run
     `/peer-review`;
   - the user may waive a Major — record the waiver and reason in the
     report; Blockers cannot be waived;
   - Minors/Nits → user decides: fix now or accept.
5. **Close the gate.** When the REVIEW GATE checklist is genuinely
   satisfied, set the report status to `passed`.

## Rules

- Never soften the verdict when presenting it.
- The reviewer's own fixes must be visible to the user — list them, they are
  part of the diff now.
- Don't skip re-review after fixes: fixed code is new code.

## Handoff

- Review `passed` → **`/demo-day`** (QA in the real browser)
- Findings to fix → **`/increment`**
