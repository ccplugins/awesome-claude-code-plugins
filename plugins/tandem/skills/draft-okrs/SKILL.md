---
name: draft-okrs
description: Draft quarterly OKRs from a North Star. Use when the user asks to draft OKRs, write OKRs, plan a quarter, set objectives, draft KRs / Key Results, or invokes /Tandem:draft-okrs. Operates as Founder hat. Reads 00-Strategy/NORTH-STAR.md, the previous quarter's OKRs, and recent retros; produces 00-Strategy/OKR-YYYY-Qx.md following the kit's strategy template.
---

# Tandem: draft-okrs (Founder hat)

Operate as **Founder hat**. The user is starting a new quarter (or replacing OKRs that drifted from the work).

This skill is the slash-command wrapper for the kit's canonical OKR-drafting prompt. The prompt is the source of truth; this file is the entry point.

## Source of truth

@_00-Project-Management/92-Prompts/01-draft-okrs-from-northstar.md

Follow that prompt verbatim. The sections below add only the slash-command-specific glue (input resolution, layout detection, post-write handoff) — do not re-declare the prompt's content here.

## Inputs needed

- If the user didn't supply context, ask: "Are we drafting for a fresh quarter, or replacing OKRs that feel disconnected? And which quarter's filename should I use — e.g. OKR-2026-Q3?"
- Quarter slug format: `YYYY-Qx` (e.g. `2026-Q3`). Used in the output filename.

## Load into context

The canonical layout is under `_00-Project-Management/`. Use `Read` / `Glob` to detect existence rather than assuming; treat missing files as "not present" rather than throwing.

- **North Star** — `_00-Project-Management/00-Strategy/NORTH-STAR.md` if present. If absent, ask the user to paste their North Star text inline before drafting.
- **Previous quarter's OKRs** — `_00-Project-Management/00-Strategy/OKR-*.md` (most recent by filename). If absent, treat this as the first OKR set.
- **Customer journey** — `_00-Project-Management/00-Strategy/CUSTOMER-JOURNEY.md` if present (optional context).
- **Recent retros** — `_00-Project-Management/14-Retros/*.md`, most recent 1–2 by filename (optional).
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` for OKR rules + frontmatter contract.
- **OKR template** — `_00-Project-Management/91-Templates/OKRS.template.md` if present; if absent, scaffold from the structure described in the source prompt and note the gap in the end-of-session summary.

## Task

1. Re-read the North Star. If it has shifted from what last quarter assumed, **stop** and ask the user before drafting.
2. Review the previous quarter's OKRs (if any): which KRs hit ≥70%, which missed, and for each miss whether it was wrong-target / wrong-action / wrong-quarter.
3. Draft a new `OKR-YYYY-Qx.md` per the source prompt's rules:
   - ≤ 3 Objectives.
   - 2–3 KRs per Objective, each a measurable number or binary state.
   - Confidence column (0–100%) per KR — honest probability of hitting.
   - "What we are deliberately NOT doing this quarter" section.
   - Explicit North Star linkage per Objective.
4. **Show the draft to the user in chat before writing the file.** Wait for edits before saving.
5. On save: set frontmatter `status: not-started`, `created_at: <ISO 8601 now from system clock>`, all other timestamp fields empty strings.
6. Final question to the user before saving: **"Which of these will hurt to drop in 4 weeks?"** — if they can't answer, the set isn't focused enough; iterate.

## Output rules

- Three Objectives is the ceiling. Two or one is fine.
- KRs must be numbers or binary states. "Improve X" is not a KR. "X reaches 100 by Sept 30" is.
- KR confidence > 90% is not ambitious. < 30% is not realistic. Aim 50–70%.
- Do NOT mark the OKR file `ready` or `in-progress` — Founder approval (next session) handles that.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (quoted ISO 8601 with offset, from system clock).
- Status enum (closed set of 9 — `not-started` on creation).
- Templates rule — use `91-Templates/OKRS.template.md` verbatim if present; do not redraft section headings from memory.
- Strategy linkage — every Objective must reference a North Star section.

## End-of-session summary (always emit)

- File written: `_00-Project-Management/00-Strategy/OKR-YYYY-Qx.md`
- Objectives drafted: X
- KRs drafted: Y
- Mean KR confidence: Z%
- Status: `not-started` (awaiting Founder approval)

## Next command

Next: `/Tandem:draft-prd` — turn one of these Objectives into a PRD.

Or, if you're going straight to execution-shaped strategy: `/Tandem:draft-epic` — turn a KR directly into an Epic.
