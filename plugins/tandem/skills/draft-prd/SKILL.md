---
name: draft-prd
description: Draft a Product Requirements Document from a North Star, an OKR Key Result, raw founder notes, or a BACKLOG entry that needs more spec. Use when the user asks to draft a PRD, write a PRD, write requirements, write a spec, turn notes into a PRD, or invokes /Tandem:draft-prd. Operates as Founder hat (synthesis) handing to PM hat (write). Reads strategy sources and produces 20-Requirements/PRD-<slug>.md following 91-Templates/PRD.template.md — 8 mandatory H2 sections, lightweight markdown, no frontmatter.
---

# Tandem: draft-prd (Founder → PM hat)

Operate as **Founder hat** for the synthesis (problem framing, audience, goals), transitioning to **PM hat** for the write (requirements, constraints, open questions). PRDs sit upstream of the Epic/Feature/Story graph — they describe the **problem and desired end state**; the Epic encodes the **work commitment**.

This skill is **net-new content**. There is no paste-prompt for it in `92-Prompts/` — the kit previously assumed PRDs existed but provided no skill to draft them. The synthesis flow below IS the source of truth for PRD drafting in this kit.

## Why this skill exists (gap closed)

The kit's pre-2026-05-23 lifecycle:

```
North Star  →  ??? (gap)  →  OKR or Epic  →  Feature  →  Story  →  Testplan  →  Done
```

`prompt 02` (`draft-epic-from-okr-or-prd`) accepts a PRD path as input but no upstream skill produces one. `draft-prd` closes that gap so the chain is unbroken from North Star to shipped work.

## Inputs needed

- A source of strategic intent. Any of:
  - A North Star file path (`_00-Project-Management/00-Strategy/NORTH-STAR.md`)
  - An OKR Key Result (file path + which KR — e.g. "OKR-2026-Q3.md, O2 KR-1")
  - A BACKLOG entry that needs more spec before becoming an Epic (path under `_00-Project-Management/11-Backlog/`)
  - Raw founder notes pasted inline
- The intended PRD slug (kebab-case, ≤6 words — e.g. `html-output-convention`).
- If the user didn't supply input, ask: "What's the source? Paste a path or the notes themselves. What slug should the PRD use?"

## Load into context

Use `Read` / `Glob` to detect existence. Treat missing files as "not present" rather than throwing.

- **Source artefact** at the resolved path (or the inline notes from the user).
- **North Star** (`_00-Project-Management/00-Strategy/NORTH-STAR.md`) — for strategic linkage even when the source is a BACKLOG entry, so the PRD's `Source:` line can reference upstream intent.
- **Existing OKRs** (`_00-Project-Management/00-Strategy/OKR-*.md`, most recent) — for the success-metrics section linkage if applicable.
- **PRD template** — `_00-Project-Management/91-Templates/PRD.template.md`. Use verbatim — do not redraft section headings from memory. The 8 mandatory H2 sections are: `Problem`, `Audience`, `Goals`, `Non-goals`, `Success metrics`, `Key requirements`, `Constraints`, `Open questions`.
- **Existing PRDs** — glob `_00-Project-Management/20-Requirements/PRD-*.md` (top-level + subdirs) to see established shape conventions and avoid duplicating an existing PRD.
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` for the strategy-linkage rule (every PRD-driven Epic must reference its PRD section).
- **Project root `CLAUDE.md`** — for project-specific overrides.

## Synthesis flow (the load-bearing part)

This is what makes a `draft-prd` skill different from a plain `cat template > new-prd.md` operation. Follow these 5 steps in order — do not skip ahead. Each step has a checkpoint.

### Step 1 — Read & cluster

Read all source material end-to-end. Extract every distinct concern, complaint, observation, or stated requirement into a flat list. Then **cluster** them into 5–8 themes by what they're really about. A theme that contains only 1 item is suspicious — either fold it into a neighbouring theme or interrogate whether it's a real concern.

**Checkpoint:** show the user the clustered themes. Wait for confirmation before drafting.

### Step 2 — Frame the problem (Founder hat)

For each theme, write the **lived experience** in one sentence: who feels this, when, and what they do instead today. If you can't write this without naming a solution, the problem isn't framed yet — push back to Step 1. The Problem section is the foundation; everything downstream rots if it's vague.

**Checkpoint:** read the draft Problem section to the user. Ask: "Does this name what hurts, not what we'd build?"

### Step 3 — Draft the PRD body (PM hat)

Open the template and fill all 8 sections in order:

1. **Problem** — synthesised from Step 2.
2. **Audience** — primary, secondary, explicit out-of-audience. Be specific about role + context.
3. **Goals** — 3–5 outcomes phrased as desired end-state, not features to build.
4. **Non-goals** — 3–5 deferrals. The mid-spec-creep firewall.
5. **Success metrics** — quantitative where possible. Tie each metric back to the source OKR KR if applicable.
6. **Key requirements** — numbered (R1, R2, R3…) so downstream Epics + Stories can reference them. Each requirement testable.
7. **Constraints** — technical, business, operational. Make assumed constraints explicit.
8. **Open questions** — what you don't know yet. Better to list honestly than fake certainty.

### Step 4 — Confirm with the user

Show the full draft PRD in chat **before writing the file**. Ask three questions:

- "Are the non-goals strict enough? Anything stakeholders might assume is in scope?"
- "Are success metrics measurable, or vibes?"
- "What's missing? Open questions section is honest about that — but anything else?"

Wait for edits before saving.

### Step 5 — Save

Write to `_00-Project-Management/20-Requirements/PRD-<slug>.md` using the template verbatim. Plain markdown — **no frontmatter** (matches the kit's existing PRD convention; validator does not scan `20-Requirements/`). Set the document `Status:` field at the top to `draft` and the `Date:` to today.

**Auto-dispatch write-outcomes:** Before saving, spawn a sub-agent with the PRD's technical content (Problem through Open questions) plus the `write-outcomes` skill. Capture the returned single-line outcome (founder voice, no label or quotes) and insert it as a founder-facing summary immediately below the `Status:` line. It is one outcome sentence, not a re-digest of every section.

## Output rules

- The 8 H2 section headings are **mandatory and fixed**. Do not rename, reorder, or omit them — the `draft-prd` testplan grep is exact-match, and downstream skills look for them by exact string.
- PRDs are markdown-only artefacts. **No YAML frontmatter** (no `type:`, `id:`, `status:` block). The header `**Status:** draft | reviewed | approved | superseded` near the top of the body is the status surface.
- Use appendices for material that supports but doesn't belong inside the 8 sections (user research, competitor scans, glossary, new-artefact-type frontmatter contracts).
- If during Step 3 you find a requirement that needs its own ADR-level decision (e.g. "should PRDs have frontmatter?"), file an ADR in the same response per the kit's "ADR on the spot" rule.

## Non-negotiable rules from CLAUDE.md

- Strategy linkage — the PRD's `Source:` header line must reference its upstream OKR KR, North Star section, or BACKLOG entry. PRDs without strategic linkage drift.
- Templates rule — use `PRD.template.md` verbatim. Do not redraft the 8 H2 section headings from memory.
- ADR on the spot — if the PRD requires a new artefact-type frontmatter contract or other non-obvious decision, file an ADR.

## End-of-session summary (always emit)

- File written: `_00-Project-Management/20-Requirements/PRD-<slug>.md`
- Status: `draft` (awaiting user review → `approved`)
- Themes clustered: X
- Key requirements (R1..Rn): n
- Open questions captured: y
- Linked source: <OKR / North Star / BACKLOG ref>

## Next command

Next: `/Tandem:draft-epic` — turn this PRD into an Epic that commits the work.
