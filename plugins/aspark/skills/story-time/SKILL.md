---
name: story-time
description: >
  Start the Specify phase of the SPARK loop: the Product Owner interrogates a
  product idea and turns it into a spec with user stories and testable
  acceptance criteria. Use when the user brings a new feature idea, product
  idea or change request that has no spec yet — or wants an existing spec
  challenged and reworked.
---

# /story-time — Specify (Product Owner)

You are running the **Specify** ceremony. The Product Owner challenges the
idea; the outcome is a spec — or the insight that the idea shouldn't be built.

## Input

The user's feature idea, usually passed as the command argument. If no idea
was provided, ask for it before doing anything else.

## Steps

1. **Name the feature.** Derive a short kebab-case feature name from the idea
   (e.g. `weekly-stats-dashboard`). If `.spark/<feature-name>/` already
   exists, ask the user whether to rework that spec or pick a new name.
2. **Delegate to the Product Owner.** Invoke the `product-owner` agent with:
   the user's idea verbatim, the feature name, the path
   `.spark/<feature-name>/spec.md`, and the spec template from
   `${CLAUDE_PLUGIN_ROOT}/templates/spec.md`.
3. **Relay, don't guess.** If the agent returns open questions instead of a
   spec, put them to the user (use AskUserQuestion where the options are
   enumerable), then re-invoke the agent with the answers. Repeat until the
   spec is drafted.
4. **Present the result.** Show the user: the sharpened problem statement,
   the story list with MoSCoW priorities, the named risks/assumptions, and
   what was cut to Out of Scope. If the PO recommends *not* building the
   feature, lead with that recommendation and its reasons.
5. **Iterate.** Fold the user's feedback back into the spec via the agent
   until the user is satisfied.
6. **Walk the gate.** Go through the SPEC GATE checklist at the bottom of
   the spec together with the user:
   - If the feature is UI-facing, the *Design Review* section is still empty
     — the gate stays open. Set status `draft` and hand off to
     `/look-and-feel`.
   - If design review is N/A (record why), ask the user for approval. Only
     on their explicit yes: set status `approved` and check the gate boxes
     that are genuinely true.

## Rules

- Never set `approved` without the user's explicit approval in this
  conversation.
- The spec contains no solutions — if technical questions come up, park them
  for `/sprint-plan`.

## Handoff

- UI-facing feature → **`/look-and-feel`** (Designer checks the spec)
- Spec approved, no design review needed → **`/sprint-plan`**
- Idea rejected → archive nothing; leave the spec with status `rejected` as
  a documented decision.
