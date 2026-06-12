---
name: session-start
description: Load active project context at the start of a Claude Code session. Use when the user opens a session and asks "what's going on", "what's next", "where did we leave off", or invokes /Tandem:session-start. Reads 12-Active/ACTIVE.md, the most recent ADRs, the MONITOR revision history, and any stories in `in-progress` or `blocked` — then announces the suggested hat and next step.
---

# Tandem: session-start (orientation)

Use at the start of a working session to re-orient. The blog's "start hooks load team-specific context dynamically" recommendation, implemented as a manual skill (less noisy than a hook that fires on every session, including 2-message ones).

## Pre-flight — is the kit wired?

Before loading context, run the cheap wiring gate: `node _00-Project-Management/93-Scripts/doctor.js --gate` (npm: `npm run pm:doctor -- --gate`). It is **silent on success**; if it exits non-zero with **kit not wired — run `npm run pm:install`**, surface that first and recommend `npm run pm:install` before orienting — the kit isn't wired yet, so the folders/scripts this skill reads may be missing. (STORY-12.2.03)

## What to load

Folder locations are resolved through the path map (`pm-paths.js` / `pm-paths.json`) rather than hardcoded, ensuring consistent references across all skills regardless of whether the repo uses the canonical or flattened layout. The script `node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve <role>` prints the physical folder for any logical role (e.g., `resolve stories`, `resolve decisions`, `resolve active`, `resolve monitor`).

1. **Active WIP index** — resolve the `active` folder via the path map; it typically maps to `12-Active` (canonical) or `00-Active` (flattened). Read `ACTIVE.md` from the resolved folder.
   - Falls back to: scan stories with `status: in-progress` directly (slower but always works).

2. **Monitor / revision history** — resolve the `monitor` folder via the path map; it typically maps to `42-Monitor` (canonical) or `00-Monitor` (flattened). Read `MONITOR.md` from the resolved folder.
   - If the file does not exist, note "no monitor file found".

3. **Last 5 ADRs by filename**, sorted descending by NNNN — resolve the `decisions` folder via the path map; it maps to this repo's canonical decisions folder, or to `06-ADR` under a flattened layout. Glob `ADR-*.md` under that resolved folder.
   - If the folder does not exist, note "no ADR folder yet — first ADR will need to create it."

4. **Stories folder** — resolve the `stories` folder via the path map; it maps to this repo's canonical stories folder, or to `03-Stories` under a flattened layout. Glob `STORY-*.md` recursively under that resolved folder.
   - From that folder, surface:
     - `status: in-progress` — list paths + AC tick state.
     - `status: blocked` — list paths + reason.
     - `status: in-review` aged > 3 days — flag for close-out.

For multi-file scans (step 4), delegate to an Explore agent (SOP §18) and ingest the summary — do not paste raw file contents into the main thread. **Use the Explore scan only for the in-progress / blocked / stale-in-review *list*, NOT for project-wide totals** — a broad fan-out scan can silently undercount or sample a subset of the stories folder. Take any shipped / total / blocked / in-progress *counts* from the resolved MONITOR (the maintained source of truth), per the tiebreaker rule in "Output rules" below. (Precedent: a session-start Explore scan once under-reported the story/epic totals and missed a blocked story vs the MONITOR's authoritative count — which is why project-wide counts come from the MONITOR and only the WIP list comes from the scan.)

**Layout detection rule:** check existence with `Bash ls`, `Glob`, or `Read` (which returns an error for missing files — treat that as "not present" rather than throwing). Do not assume any single layout. The orientation must work whether the repo uses the canonical SOP scaffold OR a project-specific flattened variant.

## What to output

A short orientation block:

```
📌 Session-start orientation — <ISO date>

Active WIP:
  - STORY-NN.M.PP-<slug> (in-progress, 3/5 ACs ticked, started <date>)
  - STORY-NN.M.PP-<slug> (in-review, all ACs ticked, awaiting testplan run)

Blocked (1):
  - STORY-NN.M.PP-<slug> — blocked on ADR-NNNN since <date>

Stale in-review (1):
  - STORY-NN.M.PP-<slug> — in-review for 5 days, run /Tandem:close-out-story

Recent ADRs:
  - ADR-NNNN — <title> (<date>)

Last week (from MONITOR):
  - <copy the most recent revision-history line>

Suggested hat: <Dev | PM | QA | Founder>
Suggested next step: <one specific action>
```

## Output rules

- ≤ 25 lines total. This is orientation, not a status report.
- Do not modify any artefact during session-start — read-only.
- If the resolved ACTIVE / monitor file is empty (or none exists), say so and recommend the user pull a Ready story.
- If the resolved monitor file hasn't been updated in > 7 days, flag it.
- **MONITOR is the tiebreaker over the fan-out story scan.** If the step-4 `Explore` story scan disagrees with the resolved monitor file (different shipped/blocked/in-progress counts, missing a story the monitor lists as blocked, or status values that don't match the project's enum) AND the monitor was updated within 7 days, treat the **monitor as authoritative**, surface the discrepancy in one line, and base the "Blocked / In-progress" lists on the monitor. A broad fan-out scan can silently undercount or sample a subset; the monitor is the maintained source of truth.
- If the repo's folder layout differs from the canonical scaffold, name the resolved paths in a short note at the top of the output (one line, e.g. "Layout: 00-Monitor + 03-Stories + 06-ADR (flattened variant)") so subsequent skills + the user know what's actually being read.

## Non-negotiable rules from CLAUDE.md

- Subagent delegation (SOP §18) for multi-file scans.
- Status enum — never invent values when summarising.
- Do not regenerate the dashboard at session start (that's the Stop hook's job).

## Join this chat to the conversation Mode

This chat opts in to the project's global Mode as part of session start:

1. Get the current state and join:
   `node _00-Project-Management/93-Scripts/mode.js join --session <session_id>`
   `node _00-Project-Management/93-Scripts/mode.js get --json`
2. Lead the session announcement with the active mode, e.g.
   *"Tandem mode: **DEV** (set by you, 2026-06-03). I'll nudge on planning requests."*
   If mode is `neutral`, say so and note the user can set one with `/mode <plan|dev|dual|neutral>`.

Use the session ID from the session context as `<session_id>`.

## End-of-session-start

Always end with a single concrete suggested next action — not a menu. The user can override; the default should be obvious.
