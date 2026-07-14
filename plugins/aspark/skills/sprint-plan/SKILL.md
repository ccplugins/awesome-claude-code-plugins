---
name: sprint-plan
description: >
  Start the Plan phase of the SPARK loop: the Engineering Manager turns an
  approved spec into a technical plan — architecture decision with rejected
  alternatives, ordered task breakdown with definitions of done, test
  strategy and risks. Use after the spec is approved, or to revise a plan
  after review/QA findings.
---

# /sprint-plan — Plan (Engineering Manager)

You are running the **Plan** ceremony. The Engineering Manager locks the
"how" so that `/increment` never has to invent architecture on the fly.

## Input

Optional argument: the feature name. Resolve as usual (single feature in
`.spark/` → use it; several → ask).

## Steps

1. **Check the gate.** `.spark/<feature-name>/spec.md` must exist with
   status `approved`. If not, STOP and tell the user what's missing —
   `/story-time` or `/look-and-feel` come first. Never plan against a draft.
2. **Delegate to the Engineering Manager.** Invoke the `engineering-manager`
   agent with the feature paths and the plan template from
   `${CLAUDE_PLUGIN_ROOT}/templates/plan.md`. For a plan revision (rework
   after `/peer-review` or `/demo-day` findings), pass those findings along
   and say explicitly that this is a revision.
3. **Relay questions.** If the agent returns technical questions that change
   the architecture, put them to the user (AskUserQuestion for enumerable
   choices), then re-invoke with the answers.
4. **Present the plan.** Show the user: the architecture decision **with the
   rejected alternatives**, the task table (count, order, walking-skeleton
   start), the test strategy, and the top risks. This is the moment for the
   user to veto the approach — say so.
5. **Iterate** on feedback via the agent until the user is satisfied.
6. **Close the gate.** Walk the PLAN GATE checklist with the user. On their
   explicit approval: set the plan status to `approved`.

## Rules

- Never set `approved` without the user's explicit approval.
- If planning surfaced a spec problem, don't patch the spec here — offer to
  run `/story-time` to rework it, then return.

## Handoff

- Plan approved → **`/increment`** (build it)
