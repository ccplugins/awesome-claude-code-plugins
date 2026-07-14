---
name: demo-day
description: >
  Hands-on QA in a real browser: the QA Tester clicks through the running
  app, verifies every acceptance criterion from the spec, explores beyond
  the happy path and files reproducible bugs. Use after /peer-review passes,
  or to re-test after fixes. Requires a running app and browser tooling.
---

# /demo-day — Review (QA Tester)

You are running the **QA** ceremony. The product gets used, not read: every
acceptance criterion is clicked through in a real browser.

## Input

Argument: the app URL (and optionally the feature name). No URL → ask the
user for it, and how to start the app if it isn't running.

## Steps

1. **Check the gates and the gear.**
   - `.spark/<feature-name>/review.md` must be `passed`. If not, stop and
     point to `/peer-review`. (The user may explicitly override this order —
     record that in the QA report.)
   - Confirm browser tooling is available (Claude in Chrome, Playwright MCP,
     Chrome DevTools MCP — whatever the session offers) and the app responds
     at the given URL. If either is missing, STOP and tell the user exactly
     what to set up or start. **Never substitute code reading for testing.**
2. **Delegate to the QA Tester.** Invoke the `qa-tester` agent with the app
   URL, the feature paths, the agreed viewports, any credentials/test data
   the user provided, and the report template from
   `${CLAUDE_PLUGIN_ROOT}/templates/qa-report.md`.
3. **Relay needs.** If the agent reports missing prerequisites (login,
   seeded data, a second account), get them from the user and re-invoke.
4. **Present the report.** The AC verification table (every criterion:
   pass/fail), exploratory bugs with reproduction steps, console/network
   findings, and the demo-day verdict — quoted honestly.
5. **Route the outcome** with the user:
   - failed ACs or open Blockers/Majors → **`/increment`** (fix-mode), then
     `/demo-day` again. Re-tests cover the fixed bugs *and* their
     surrounding flows.
   - Minor bugs → the user accepts them (recorded) or sends them to fix.
6. **Close the gate.** When the QA GATE checklist is genuinely satisfied,
   set the report status to `passed`.

## Rules

- A QA report without performed browser steps is invalid — reject it and
  fix the tooling problem instead.
- Never mark `passed` while a Must-story AC is unverified.

## Handoff

- QA `passed` → **`/go-live`** (release it)
- Bugs to fix → **`/increment`**
