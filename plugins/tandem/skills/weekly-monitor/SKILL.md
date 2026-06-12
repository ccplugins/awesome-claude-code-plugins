---
name: weekly-monitor
description: Weekly MONITOR update (Friday cadence). Use when the user asks for a weekly review, end-of-week summary, monitor update, or weekly cadence. Computes the 7-day delta, updates MONITOR.md with revision history, flags stalled/blocked stories, runs backlog hygiene, regenerates the dashboard.
---

# Tandem: weekly-monitor (PM hat)

Operate as **PM hat**. Friday 30-minute weekly review.

## Load into context

- `_00-Project-Management/42-Monitor/MONITOR.md` (current state)
- `_00-Project-Management/12-Active/ACTIVE.md`
- Last 7 days of activity — scan which files under `30-Epics/`, `31-Features/`, `32-Stories/`, `34-Bugs/`, `40-Decisions/` have `completed_at` or `started_at` within the last 7 days. For a multi-folder scan, delegate to an Explore agent (SOP §18) and ingest the summary, not the raw paths.
- `_00-Project-Management/14-Retros/` (most recent retro's "One change" — did it happen this week?)
- `_00-Project-Management/90-Standards/SOP.md`

## Task

### 1. Compute the weekly delta

- Stories shipped (status → `done` in the last 7 days)
- Stories started (status → `in-progress` in the last 7 days)
- Stories currently `blocked`
- BUGs filed
- BUGs fixed
- ADRs created

### 2. Update `42-Monitor/MONITOR.md`

- Per-epic and per-feature counts (shipped / total).
- Progress bars (if used).
- "Last updated" date.
- Prepend a revision-history entry dated today, summarising the week in 3-5 lines.

### 3. Audit currents

- Any story `in-progress` for > 5 days? Flag as stall risk.
- Any story `blocked` for > 5 days? Escalate — Founder hat decision needed?
- Any story `in-review` for > 3 days? Push to close-out (`/Tandem:close-out-story`).

### 4. Backlog hygiene

- Anything in `not-started` for > 90 days? Propose `wontfix` or `archived` (SOP §15 sunset rule).
- Inbox count > 20? Propose a quick triage pass.

### 5. Dashboard regen

- Run `npm run pm:all` (validator + dashboard together).
- Confirm `42-Monitor/DASHBOARD.html` reflects the week's changes.
- If validator fails, fix the violations BEFORE the dashboard run.
- If the `Stop` hook is active, the dashboard will also regen at session end — but running it explicitly here is cheap insurance.

## Output rules

- Single revision-history entry per week, prepended to MONITOR.
- Format: `**YYYY-MM-DD — week summary.** <3-5 lines>.`
- Be specific. Not "shipped some stories", but "shipped STORY-01.2.07 + STORY-01.3.01, closing FEAT-01.2 except for the sortable-headers AC".
- Flag carry-forwards: "carrying STORY-02.1.04 into next week — blocked on ADR-0012."

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps — do NOT modify any artefact's timestamps as part of this update. Only MONITOR's "Last updated" line changes.
- Status enum — use canonical statuses in your summary, never synonyms.
- Dashboard regen at end of update.

## End-of-update summary (always emit)

- Shipped this week: N
- Stalled: <list of stories in-progress > 5 days>
- Blocked: <list with reasons>
- Carry-forward to next week: <list>
- Suggestion for Founder hat: <if any strategic drift detected>
