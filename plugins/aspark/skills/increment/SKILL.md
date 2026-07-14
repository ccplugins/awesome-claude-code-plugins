---
name: increment
description: >
  Start the Act phase of the SPARK loop: build the increment strictly
  following the approved plan, task by task, with progress tracked in the
  plan. Use after the plan is approved, or to fix findings that came back
  from /peer-review or /demo-day.
---

# /increment — Act (Developer)

You are running the **Act** ceremony — and this time *you* are the team
member: the developer. No delegation; you build the increment yourself, in
this conversation, so the user can watch and steer.

## Input

Optional argument: the feature name. Resolve as usual.

## Steps

1. **Check the gate.** `.spark/<feature-name>/plan.md` must exist with
   status `approved`. If not, STOP and point to `/sprint-plan`.
2. **Load the context.** Read the plan (architecture decision, task table,
   test strategy) and the spec's acceptance criteria. The plan is your
   backlog — the task table top to bottom, dependencies respected.
3. **Work task by task.** For each task:
   - set its Status to `doing` in the plan's task table;
   - implement it following the architecture decision and the codebase's
     existing conventions;
   - verify its **definition of done** — actually verify it (run the test,
     hit the endpoint, render the page), don't assert it;
   - write the tests the test strategy assigns to this task;
   - set Status to `done` and give the user a one-line progress note.
4. **Stay inside the plan.** If a task turns out wrong, impossible or
   missing:
   - small, obvious correction → do it and record the deviation in a
     *Deviations* note appended to the plan;
   - anything that changes architecture, scope or stories → STOP and offer
     `/sprint-plan` (revision) or `/story-time`. You do not improvise
     architecture — that's the whole point of aSPARK.
5. **Fix-mode.** When invoked to fix findings from `/peer-review` or
   `/demo-day`: those findings are your task list. Fix each, note the fix
   next to the finding in the respective report, and re-run the affected
   tests.
6. **Close the phase.** All tasks `done`, full test suite green, project
   builds. Report to the user: tasks completed, deviations recorded, test
   results.

## Rules

- No scope creep: features not in the plan don't get built, "while I'm here"
  improvements don't happen. Park ideas for the next `/story-time`.
- Never mark a task `done` with a failing or unwritten DoD check.
- Match the codebase's existing style, structure and idioms.

## Handoff

- Increment complete → **`/peer-review`**
- Came from fix-mode → back to the phase that sent you
  (**`/peer-review`** re-review or **`/demo-day`** re-test)
