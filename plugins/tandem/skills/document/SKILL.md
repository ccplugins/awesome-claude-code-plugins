---
name: document
description: Author the project's default markdown documentation set from accumulated PM knowledge. Use when the user asks to generate docs, write project documentation, create the documentation set, or invokes /Tandem:document. Reads PROJECT-CONTEXT.md, epics/features/stories, ADRs, and the codebase — then authors one markdown file per doc into the documentation/ folder. Authors markdown only; HTML rendering is a separate step.
---

# Tandem: document (Technical Writer hat)

Operate as **Technical Writer hat**. The user wants a coherent, shareable documentation set synthesised from what Tandem already knows about the project — no separate doc-writing pass required.

## Default doc set

Author **exactly these five markdown files**, one per document, using these verbatim names as the output filenames:

| # | Document | Output file |
|---|----------|-------------|
| 1 | Overview | `documentation/overview.md` |
| 2 | Getting started | `documentation/getting-started.md` |
| 3 | Architecture | `documentation/architecture.md` |
| 4 | Decisions (digest) | `documentation/decisions.md` |
| 5 | Features (& usage) | `documentation/features.md` |

All output files are written into the **`documentation/` folder** at the project root, one `.md` per doc. Do not create subfolders inside `documentation/` — flat layout.

## Sources (read before authoring)

Read the following in order, resolving paths against the project root. Treat a missing file as "not present" (note the gap in the relevant section) rather than throwing.

1. **`PROJECT-CONTEXT.md`** — canonical project identity: name, purpose, tech stack, audience, deployment. This drives the Overview and Getting started sections.
2. **Epics** (`_00-Project-Management/30-Epics/EPIC-*.md`) — strategic scope. Skim titles + `## In scope` sections.
3. **Features** (`_00-Project-Management/31-Features/**/*.md`) — feature-level capabilities. Drives the Features (& usage) doc.
4. **Stories** (`_00-Project-Management/32-Stories/**/*.md`) — implementation detail and done/not-done status. Informs accuracy of the Getting started and Features docs.
5. **ADRs** (`_00-Project-Management/40-Decisions/ADR-*.md`) — architectural decisions. Drives the Decisions (digest) and Architecture docs. Read all; summarise the most consequential ones.
6. **Codebase** — the source tree itself. Read entry points, key modules, README fragments (if any). Drives the Architecture and Getting started docs. Limit scope: entry-point files, major module directories, config files — do not attempt to read every file.

## Per-document authoring guide

### 1 · Overview (`documentation/overview.md`)
- What the project is, who it is for, and why it exists.
- One-paragraph project statement sourced from PROJECT-CONTEXT.md.
- Key capabilities list (3–7 bullets, sourced from epics/features).
- Current project status (active / beta / archived) — infer from MONITOR if present.

### 2 · Getting started (`documentation/getting-started.md`)
- Prerequisites (runtime, env vars, credentials) — sourced from PROJECT-CONTEXT.md and codebase config files.
- Install / setup steps — numbered list, runnable commands.
- First run — the single command that proves the project is working.
- Troubleshooting tips — at most 3 common failure modes from stories/bugs if present.

### 3 · Architecture (`documentation/architecture.md`)
- System diagram described in prose or Mermaid (prefer Mermaid if the structure is clear from the codebase).
- Key components and their responsibilities — sourced from codebase + ADRs.
- Data flow — how a request/event moves through the system.
- External dependencies — services, APIs, storage — sourced from PROJECT-CONTEXT.md and config files.
- Link to relevant ADRs inline (e.g. "see ADR-0003 for why X was chosen").

### 4 · Decisions (digest) (`documentation/decisions.md`)
- Introduction: what ADRs are and how to read them.
- One row per ADR in a markdown table: `| ADR | Title | Status | Date | Summary (one line) |`.
- Sort by ADR number descending (most recent first).
- Source: all files matching `_00-Project-Management/40-Decisions/ADR-*.md`. If none exist yet, write a placeholder row.

### 5 · Features (& usage) (`documentation/features.md`)
- One `##` section per major feature, sourced from the Features files.
- Each section: brief description, how to invoke / configure, example (code block or command).
- Status column: note if a feature is in-progress or planned vs. shipped — infer from story statuses.

## Authoring rules

- **Markdown only** — author `.md` files. Do not generate HTML, CSS, or any rendered output. HTML rendering is handled by a separate later step.
- **Self-contained output** — each doc must be readable standalone. Cross-link between docs with relative markdown links (e.g. `[Architecture](architecture.md)`).
- **Prose quality** — use plain English, active voice, present tense. No marketing filler.
- **No invention** — if a fact is not in the sources, say "not yet documented" rather than guessing. Accuracy over completeness.
- **SELF-CONTAINED SKILL** — this skill contains no references to any specific consumer project or company. Keep output project-neutral in structure; project-specific content comes entirely from the sources above.

## Execution steps

1. Read all sources listed above (parallelise reads where possible).
2. For each of the five documents, draft content in memory, then write to `documentation/<filename>.md`.
3. If the `documentation/` folder does not exist, create it before writing.
4. After writing all five files, emit a short summary:
   - Files written: list with relative paths.
   - Sources read: list with any gaps noted.
   - Sections marked "not yet documented": list, or "none".

## Output rules

- Write all five docs in a single response — do not ask for confirmation between docs.
- If a source file is missing, note the gap inside the relevant doc section and continue — do not abort.
- Do not modify any PM artefact (stories, ADRs, MONITOR) during this skill.

## Next command

Once `STORY-04.4.02` ships, `/Tandem:document-html` will render the `documentation/*.md` files as a styled HTML site. (Not yet available — markdown authoring is the final step for now.)
