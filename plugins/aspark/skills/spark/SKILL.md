---
name: spark
description: >
  Run the full SPARK loop end-to-end for one feature: Specify → Plan → Act →
  Review → Keep, pausing at every gate for the user's decision. Use when the
  user brings a feature idea and wants the whole agile team to take it from
  idea to release in one guided session — or wants to resume a feature that
  is somewhere mid-loop.
---

# /spark — The Full Loop (Orchestrator)

You are conducting the **entire SPARK loop** for one feature. You don't do
the phase work yourself — each ceremony's skill defines it. You sequence the
ceremonies, enforce the gates, and keep the user in charge at every
transition.

## Input

- **With an idea as argument** → start a fresh loop at Specify.
- **Without an argument** → resume: pick the feature (single one in
  `.spark/` → use it; several → ask the user), read its artifacts' statuses,
  and continue at the first phase whose gate is not yet closed (see the
  phase map below).

## The Phase Map

Determine the current position from artifact statuses in
`.spark/<feature-name>/`:

| Artifact state | Next ceremony |
|---|---|
| no `spec.md` | `/story-time` |
| `spec.md` is `draft`, UI-facing, design review empty | `/look-and-feel` |
| `spec.md` is `draft` otherwise | finish `/story-time` (approval) |
| `spec.md` `approved`, no/unapproved `plan.md` | `/sprint-plan` |
| `plan.md` `approved`, tasks not all `done` | `/increment` |
| tasks `done`, `review.md` missing or not `passed` | `/peer-review` |
| `review.md` `passed`, `qa.md` missing or not `passed` | `/demo-day` |
| `review.md` + `qa.md` `passed`, no `released` release | `/go-live` |
| release `released` | loop closed — tell the user |

## How You Conduct

1. **Set expectations once.** At the start, tell the user the route ahead
   and that you will stop at every gate for their decision.
2. **Gather QA prerequisites early.** Before `/increment` starts, ask how
   the app will be run for `/demo-day` (start command, URL) and confirm
   browser tooling exists — a loop that stalls at QA for missing setup
   wastes the whole session.
3. **Run each ceremony by its own rules.** For every phase, read
   `${CLAUDE_PLUGIN_ROOT}/skills/<ceremony>/SKILL.md` and follow it exactly
   — same agents, same templates, same gate procedure. You add nothing and
   skip nothing.
4. **Stop at every gate.** Present the phase's artifact and result, then get
   the user's explicit decision: approve and continue, iterate this phase,
   or stop here (a paused loop resumes later via `/spark`). Never roll
   through a gate on momentum — an approval for the spec is not an approval
   for the plan.
5. **Handle the feedback loops.** Review or QA findings route back through
   `/increment` (fix-mode) and then re-run the phase that found them. Count
   the rounds: after **3 failed rounds of the same phase**, stop and lay the
   situation before the user — the plan or the spec is probably wrong, and
   grinding harder won't fix that. Offer `/sprint-plan` (revision) or
   `/story-time`.
6. **Keep the narrative.** At each transition, give a one-paragraph
   state-of-the-loop: what just closed, what's next, what's still ahead.
   The user should never wonder where in the loop they are.
7. **Close the loop.** After `/go-live`, summarize the whole journey:
   idea → what shipped, rounds needed, learnings kept. Then offer
   `/story-time` for the next idea.

## Rules

- Every gate needs the user's explicit decision **in this conversation** —
  including the final go for publishing in `/go-live`. If the user asked to
  "run it all without stopping", still honor the two hard stops: plan
  approval and the publish go.
- All ceremony rules apply unchanged; on conflict, the ceremony's own
  SKILL.md wins for its phase.
- If the session ends mid-loop, the artifacts *are* the state — any later
  `/spark` resumes from them. Leave statuses accurate at all times.
