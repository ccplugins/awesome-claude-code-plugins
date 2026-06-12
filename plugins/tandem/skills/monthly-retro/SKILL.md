---
name: monthly-retro
description: Run the monthly retrospective. Use when the user asks for a monthly retro, monthly retrospective, end-of-month review, month-in-review, or invokes /Tandem:monthly-retro. Operates as Founder + PM hats jointly. Auto-detects the most recently completed full month, reads MONITOR + closed stories + ADRs + bugs from that window, and produces 14-Retros/RETRO-YYYY-MM.md from the kit's retro template.
---

# Tandem: monthly-retro (Founder + PM hats)

Operate as **Founder + PM hats jointly** for a solo retro. The user is closing out a month and wants the retro filed in one slash command — no paste-prompt copy.

This skill is the slash-command wrapper for the kit's canonical monthly-retro prompt. The prompt is the source of truth; this file is the entry point.

## Source of truth

@_00-Project-Management/92-Prompts/10-monthly-retro.md

Follow that prompt verbatim. The sections below add only the slash-command-specific glue (which month to retro, input resolution, output path, empty-month handling, post-write handoff) — do not re-declare the prompt's content here.

## Which month — the prior-month window rule

**Always retro the MOST RECENTLY COMPLETED FULL month — never the in-progress month.** Auto-detect this month from the system clock unless an argument overrides it.

The rule, stated precisely with its boundary cases:

- Run on **2026-06-01** → retro **2026-05**. June has just begun; May is the most recently completed full month.
- Run on **2026-05-31** → **also retro 2026-05** (NOT June). You retro the month that just finished, not the in-progress one — and on the last day of May you are wrapping up May itself, so May is the target. The point of the boundary is to never retro a month that is still partly ahead of you: a run dated anywhere in late May still targets **2026-05**, and a run on the very first day of June still targets **2026-05**.

  In short: the target is the **last full month whose work is done** — the prior month relative to a fresh-of-the-month run, and the just-closed current month when you run on its final day. Either way you land on the most recently completed full month and you do not retro a month still in progress beyond "today".

- **Argument override:** if the user passes an explicit month (e.g. `2026-03` or "March"), retro that month instead of the auto-detected one. The argument always wins over the clock.

Derive `YYYY-MM` for the target month and use it for both the output filename and the `period_start` / `period_end` frontmatter (`period_end` = last calendar day of the target month).

## Inputs needed

- If the user passed a month argument, use it. Otherwise auto-detect per the prior-month window rule above from the system clock.
- If the user is ambiguous ("do the retro"), state which month you resolved to before drafting, so they can correct you in one line.

## Load into context

The canonical layout is under `_00-Project-Management/`. Use `Read` / `Glob` to detect existence rather than assuming; treat missing files as "not present" rather than throwing. Load the inputs the source prompt lists, scoped to the target month's window:

- **MONITOR** — `_00-Project-Management/42-Monitor/MONITOR.md` (last ~4 weeks of revision history).
- **Previous month's retro** — `_00-Project-Management/14-Retros/RETRO-*.md`, the one immediately before the target month, to check the carry-forward "One change".
- **Current quarter's OKRs** — `_00-Project-Management/00-Strategy/OKR-*.md` (most recent) for the strategic check.
- **Closed stories in-window** — stories under `_00-Project-Management/32-Stories/` whose `completed_at` falls inside the target month.
- **ADRs in-window** — `_00-Project-Management/40-Decisions/ADR-*.md` created in the target month.
- **Bugs in-window** — `_00-Project-Management/34-Bugs/` filed / fixed in the target month.
- **Retro template** — `_00-Project-Management/91-Templates/RETRO.template.md`.
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` for retro rules + frontmatter contract.

For a multi-folder scan of the in-window activity, delegate to an Explore agent (SOP §18) and ingest the summary, not the raw paths.

## Task

Run the source prompt verbatim. The mechanical points that matter for the slash command:

1. Write the retro to **`14-Retros/RETRO-YYYY-MM.md`** (target month's `YYYY-MM`), using **`91-Templates/RETRO.template.md`** verbatim — do not redraft section headings from memory.
2. Compute the objective metrics (stories shipped, bugs filed/fixed delta, ADRs created, average story cycle time, time in `blocked`) from the in-window data. Auto-draft the objective sections; leave "What worked / What hurt / Surprises" for the user to edit to their voice.
3. Propose 2-3 candidate "One change" actions — propose only, the user picks one.
4. Run the strategic check: did the month's work ladder into the current OKRs? Flag drift for the next quarterly review.
5. **Show the draft in chat before saving.** Wait for the user's edits.

## Empty month is valid output

A month with **0 closed stories is valid** — still produce the retro file. Populate the metrics with zeros, note explicitly in "What worked / What hurt" that the month was quiet (and why, if known — e.g. holiday, founder offline, single long-running story not yet closed), and still propose a "One change" for the next month. Do NOT skip the file or error out on an empty window; early-kit months legitimately have no closed work.

## Output rules

- One retro file per month: `14-Retros/RETRO-YYYY-MM.md`.
- Objective sections (Metrics, Action-from-last-retro carry-forward, Strategic check) are Claude's to write; subjective sections (What worked / What hurt / Surprises) are the user's voice — draft them as a starting point only.
- The "One change" — propose 2-3, the user commits to one.
- Honour the frontmatter contract: quoted ISO 8601 timestamps with offset from the system clock, canonical status enum, template used verbatim. The source prompt sets `status=done` + `completed_at` on save (this is the retro artefact's own lifecycle, not a kit story).

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (quoted ISO 8601 with offset, from the system clock).
- Status enum (closed set of 9).
- Templates rule — use `91-Templates/RETRO.template.md` verbatim; do not redraft section headings from memory.
- Update `42-Monitor/MONITOR.md` with the one-line retro entry per the source prompt's end-of-retro step.

## End-of-session summary (always emit)

- Target month resolved: `YYYY-MM` (and whether from clock or argument).
- File written: `_00-Project-Management/14-Retros/RETRO-YYYY-MM.md`.
- Stories shipped in-window: N (0 is valid — empty month noted in the file).
- Bugs filed / fixed: X / Y. ADRs created: Z.
- "One change" candidates proposed: list (user to pick one).
- Strategic drift: Yes / No.

## Next-step guidance

Review the draft with the **founder hat**; capture any decisions that surface as **ADRs**. The retro often exposes a structural choice ("we keep skipping DoR — should we?") worth recording.

## Next command

`/Tandem:weekly-monitor` — the retro's "One change" is tracked from here into next month; the weekly cadence keeps it alive. If the strategic check flagged drift, run `/Tandem:draft-okrs` next quarter to re-anchor.
