---
name: draft-epic
description: Draft a new EPIC from an OKR key result or a PRD section. Use when the user asks to draft an epic, create an epic, write an epic, turn an OKR / PRD into an epic, or invokes /Tandem:draft-epic. Operates as PM hat. Reads the source OKR or PRD plus the EPIC template; produces 30-Epics/EPIC-NN-<slug>.md with mandatory strategic linkage (frontmatter okr: or prd_section:). Aborts if strategic linkage cannot be established.
---

# Tandem: draft-epic (PM hat)

Operate as **PM hat**. The user has an approved strategic bet (OKR KR or PRD section) and needs to put it into the work graph as an Epic.

This skill is the slash-command wrapper for the kit's canonical epic-drafting prompt. The prompt is the source of truth; this file is the entry point.

## Source of truth

@_00-Project-Management/92-Prompts/02-draft-epic-from-okr-or-prd.md

Follow that prompt verbatim. The sections below add only the slash-command-specific glue — do not re-declare the prompt's content here.

## Inputs needed

- Path to the source OKR file (`_00-Project-Management/00-Strategy/OKR-YYYY-Qx.md`) or PRD file (`_00-Project-Management/20-Requirements/PRD-*.md`).
- If the user didn't supply one, ask: "Which OKR or PRD am I drafting from? Paste the path or the KR/section text inline."

## Load into context

Use `Read` / `Glob` to detect existence. Treat missing files as "not present" rather than throwing.

- **Source OKR / PRD** — at the resolved path above. If neither is provided and no `okr:` or `prd_section:` can be inferred from the user's inline text, **abort** — the kit's strategic-linkage rule forbids Epics without it. Tell the user: "I need an OKR or PRD reference before drafting. Which one moves this?"
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` for DoR, estimation, status enum.
- **Project context** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md`.
- **EPIC template** — `_00-Project-Management/91-Templates/EPIC.template.md`. Use verbatim — do not redraft section headings from memory.
- **Existing Epics** — glob `_00-Project-Management/30-Epics/EPIC-*.md` to find the next-free `EPIC-NN` (scan for the max NN, increment by 1, pad to 2 digits). Do **not** invent a number; do **not** reuse one.
- **Project root `CLAUDE.md`** — for project-specific overrides.

## Task

1. Find next-free `EPIC-NN` by globbing `_00-Project-Management/30-Epics/EPIC-*.md` and computing `max(NN) + 1`. Pad to 2 digits.
2. Draft the Epic at `_00-Project-Management/30-Epics/EPIC-NN-<slug>.md` using `EPIC.template.md` verbatim.
3. Fill every section, especially:
   - **Strategic linkage** — must reference the source OKR KR or PRD section. Frontmatter `okr:` OR `prd_section:` is **mandatory** — if neither can be set with a real value, abort and tell the user the linkage is too weak to proceed (kit's strategy-linkage rule).
   - **In scope / Out of scope** — explicit deferrals are how mid-epic creep is resisted.
   - **Success criteria** — measurable, not vibes.
   - **Dependencies, Data touched, Risks** — top 3 risks max, with one-line mitigations.
4. Outline 3–7 Features at high level (title + one-line goal each) in the `## Features` section. **Do not create FEAT files** — `/Tandem:split-into-features` does that.
5. Set frontmatter: `status: not-started`, `created_at: <ISO 8601 now from system clock>`, other timestamp fields empty strings.
6. **Show the file tree of what you'll create before writing.** Wait for user approval.

## Output rules

- If the Business Outcome line can't be written ("what metric does this move and by how much?"), stop and ask. Don't proceed without a clear answer.
- If the Epic feels > 4 weeks of solo work, propose splitting into two Epics.
- Strategic-linkage rejection: if the user pushes back on the OKR/PRD requirement, point to `_00-Project-Management/90-Standards/SOP.md` ("Strategy linkage" rule). Do not write the file without `okr:` or `prd_section:` set.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (quoted ISO 8601 with offset, from system clock).
- Status enum (`not-started` on creation).
- Strategy-linkage rule — `okr:` or `prd_section:` is MANDATORY. **Reject** the request and stop if neither can be set.
- Templates rule — use `EPIC.template.md` verbatim.

## End-of-session summary (always emit)

- File written: `_00-Project-Management/30-Epics/EPIC-NN-<slug>.md`
- Strategic linkage: `okr: <ref>` or `prd_section: <ref>`
- Features outlined: X
- Estimate: S | M | L | XL
- Status: `not-started`

## Next command

Next: `/Tandem:split-into-features` — decompose this Epic into FEAT files.
