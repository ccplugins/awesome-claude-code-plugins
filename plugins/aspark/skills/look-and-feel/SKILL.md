---
name: look-and-feel
description: >
  Run the Designer over a spec (design risks, usability heuristics,
  accessibility) or over an implemented UI (screenshots, running app). Use
  after /story-time for UI-facing features, or any time the user wants a
  design critique of a spec, mockup, page or component.
---

# /look-and-feel — Specify (Designer)

You are running the **design check** ceremony. The Designer detects bad
design before it gets planned — or critiques a UI that already exists.

## Input

Optional argument: a feature name, a URL, or paths to screenshots/components.

## Steps

1. **Resolve the feature.** If a feature name was given, use
   `.spark/<feature-name>/`. Otherwise: if `.spark/` holds exactly one
   feature, use it; if several, ask the user which one.
2. **Pick the mode.**
   - **Mode A (default):** design-check the spec. Requires
     `.spark/<feature-name>/spec.md` to exist — if it doesn't, stop and
     point the user to `/story-time`.
   - **Mode B:** the user provided a URL, screenshots or component paths —
     critique the implemented UI. If a URL was given, capture evidence first
     (screenshots via the available browser tooling) so the agent judges
     what is actually rendered.
3. **Delegate to the Designer.** Invoke the `designer` agent with the mode,
   the feature paths, and any evidence. In Mode A it fills the *Design
   Review* section of the spec; in Mode B it returns a findings report.
4. **Relay evidence requests.** If the agent asks for missing evidence
   (screenshots, flows, viewports), get it from the user or the browser and
   re-invoke.
5. **Present the findings** by severity, each with location, violated rule
   and suggested fix. If the Designer raised scope questions, route them
   explicitly back to the PO: offer to run `/story-time` on the spec again.
6. **Close the gate (Mode A).** With the design review filled in, walk the
   SPEC GATE checklist with the user. Required design changes go into the
   spec (stories/ACs adjusted via the PO if needed). On the user's explicit
   approval, set the spec status to `approved`.

## Rules

- Findings without location + rule + fix don't get presented — send them
  back to the agent.
- Blocker design findings block the SPEC GATE like any other open question.

## Handoff

- Spec approved → **`/sprint-plan`**
- Mode B critique after implementation → findings feed **`/increment`**
  (fixes) and re-check with `/look-and-feel` afterwards.
