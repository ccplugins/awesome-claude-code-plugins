---
name: core
description: Core PM Operating Kit rules — closed-set status enum, frontmatter timestamps, Story-Testplan pairing, DoR/DoD gates, hat protocol, ADR-on-the-spot, bug-auto-raise. Use when working anywhere under _00-Project-Management/, when creating or modifying any artefact (epic/feature/story/testplan/bug/ADR), or when uncertain about the project's PM conventions.
---

# Tandem — core PM rules

You are working in a project that uses the Greenfield PM Operating Kit. These rules are mandatory whenever you touch anything under `_00-Project-Management/`.

## Lifecycle command chain (canonical order — single source of truth)

This is the **one** place the lifecycle command order is recorded (ADR-0047). Every per-command `Next:` pointer in the lifecycle skills must agree with this chain; if a pointer ever disagrees, **this record wins** and the pointer is the bug.

`/Tandem:draft-okrs` → `/Tandem:draft-prd` → `/Tandem:draft-epic` → `/Tandem:split-into-features` → `/Tandem:split-into-stories` → `/Tandem:refine-backlog` → `/Tandem:execution-strategist` → `/Tandem:execute-batch` → `/Tandem:run-testplan` → `/Tandem:close-out-story` → `/Tandem:close-phase`

`close-phase` is terminal (no `Next:` pointer). Cadence / utility skills (`weekly-monitor`, `monthly-retro`, `reflect`, `session-start`, `critique`, `peer-review`, `document`, `curate-toolkit`, `fill-claude-md`, `execute-story`) are **not** chain members; `execute-story` is the single-story alternative to `execute-batch`.

## Reference order — where to look

1. Project root `CLAUDE.md` — pointers + critical gotchas
2. `_00-Project-Management/CLAUDE.md` — folder semantics
3. `_00-Project-Management/90-Standards/SOP.md` — full lifecycle, DoR, DoD, frontmatter contract, subagent policy (§18)
4. `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` — this project's stack quirks
5. `_00-Project-Management/90-Standards/DAILY-WORKFLOW.md` — rhythm + worked example
6. `_00-Project-Management/90-Standards/CLAUDE-CODE-CONFIG.md` — how this plugin maps to Anthropic's Claude Code best practices
7. Template in `_00-Project-Management/91-Templates/`

## Non-negotiable rules

### Frontmatter timestamps

Every artefact has three timestamp fields:

```yaml
created_at: ''      # set on file create; ISO 8601 with offset, quoted string
started_at: ''      # set when status → in-progress
completed_at: ''    # set when status → done | wontfix | duplicate | archived
```

- Format: `YYYY-MM-DDTHH:MM:SS±HH:MM`. Always quoted.
- Source of "now": system clock (`Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"` or `date -u +"%Y-%m-%dT%H:%M:%S%z"`), **not** the chat-stated date.
- Status flip + timestamp set = **same edit**, not separate.
- Status revert (back to `not-started`) → clear `started_at` and `completed_at` to `''`.

### Status enum — closed set, exactly 9 values

`not-started | ready | in-progress | in-review | done | blocked | wontfix | duplicate | archived`

Never invent values. Never use `open / shipped / completed / fixed / deferred / Planned`.

## Folder layout (full | flattened | custom)

The kit's skills and templates name PM sub-folders in the canonical **"full"** numbering: `30-Epics`, `31-Features`, `32-Stories`, `33-Testplans`, `34-Bugs`, `40-Decisions`, `42-Monitor`, `11-Backlog`, …

A project may instead use a **"flattened"** layout (e.g. `01-EPIC`, `02-Features`, `03-Stories`, `05-Test`, `04-Bug`, `06-ADR`, `00-Monitor`) or a **custom** map.

The scripts resolve the real folder names automatically via `_00-Project-Management/93-Scripts/lib/pm-paths.js`, driven by `.claude-pm-config.json` (`"layout": "full"|"flattened"` and/or a per-key `"paths"` override). `pm:install` pins this; `pm:doctor` reports it.

**INSTRUCTION TO CLAUDE:** when a skill names a folder like `32-Stories`, do **not** assume that literal path — resolve it to the project's actual folder first (read `.claude-pm-config.json`, or list `_00-Project-Management/` and match by role: epics/features/stories/testplans/bugs/decisions/monitor/backlog). On a flattened project: `32-Stories`→`03-Stories`, `33-Testplans`→`05-Test`, `34-Bugs`→`04-Bug`, `40-Decisions`→`06-ADR`, `42-Monitor`→`00-Monitor`.

### Story → Testplan pairing — MANDATORY

When creating a STORY under `32-Stories/EPIC-NN/FEAT-NN.M/`, create the paired TESTPLAN at `33-Testplans/EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-<slug>.md` **in the same response**.

- Every AC checkbox in the story maps to ≥1 TC in the testplan.
- Every TC has a runnable `Command:` (no manual steps, no "have a human verify").
- See `91-Templates/STORY.template.md` + `91-Templates/TESTPLAN.template.md`.

### Bug auto-raise on failure — MANDATORY

Whenever a TC fails or you observe any defect during exploration/code review, file a BUG at `34-Bugs/EPIC-NN/FEAT-NN.M/BUG-<YYYYMMDD-NN>-<slug>.md` **in the same response**, before reporting in chat.

- ID format: `BUG-YYYYMMDD-NN` where `NN` is the day's sequential counter within that FEAT folder.
- Slug: kebab-case, ≤6 words, describing the symptom.
- Body includes: reproduction steps, environment snapshot, first analysis hypothesis, suggested fix direction a junior dev can act on.
- Use `91-Templates/BUG.template.md`.

### DoR gate — before in-progress

Before flipping a story `not-started`/`ready` → `in-progress`, verify the DoR checklist in `SOP.md` §6. If a DoR item is missing, **stop**, list the gap, ask.

### DoD gate — before done

Before flipping a story `in-review` → `done`, verify the DoD checklist in `SOP.md` §7. MONITOR.md update is part of the same response.

### ADR on the spot — MANDATORY for non-obvious decisions

On any non-obvious decision (library choice, schema field name, threshold setting, scope deferral, divergence from defaults), create `40-Decisions/ADR-<NNNN>-<slug>.md` **in the same response**. Number sequentially across the project. Link from the story's `decisions:` array.

### Templates over memory

Every new artefact starts from `91-Templates/<TYPE>.template.md`. Do not redraft section headings from memory.

### Strategy linkage

Every EPIC must have `okr:` or `prd_section:` in frontmatter. Reject epics without strategic linkage — ask "What business outcome does this move?" before writing.

### Hat protocol

State which hat at session start: **Founder · PM · Dev · QA**. Don't mix hats in one session.

| Hat | Owns |
|---|---|
| Founder | Strategy, OKRs, epic approvals, sunset decisions |
| PM | Inbox → Backlog refinement, MONITOR updates |
| Dev | Code, tests, story status Ready → Active → Review |
| QA | Testplan execution, bug raising, DoD sign-off |

### Conversation Mode (the moat) — enforces the hats across chats

A project-global **Mode** (`plan · dev · dual · neutral`) groups and enforces the hats across separate chats. It persists in `.tandem-mode.json` (repo root, git-ignored) and is injected each message by the `UserPromptSubmit` hook for **joined** chats. Plan groups Founder/PM/QA-planning; Dev groups Dev/QA-execution. On an out-of-mode request, **nudge** (switch / go Dual / one-off) — never hard-block. Set it with `/mode <plan|dev|dual|neutral>`; it auto-resets to Neutral on `close-out-story` (last story in phase) and `close-phase`. Full rules: the **`mode`** skill.

### MONITOR + dashboard

When a story flips to `done`, update `42-Monitor/MONITOR.md` in the same edit (tick the bar, update shipped count, prepend revision-history one-liner). The dash hook (`Stop` event) regenerates `DASHBOARD.html` at session end — you don't need to run `npm run pm:dash` manually if the plugin is active.

### Subagent delegation (SOP §18)

- Editing / decisions / status flips → **main thread**.
- "Where is X / which files reference Y" → **Explore agent** (read-only).
- Multi-step research, running tests, anything producing noisy logs → **fresh agent**.
- Never delegate understanding. Agents return evidence; main thread synthesises.

## When in doubt

Bring it to the user. Do not invent rules. Do not silently bend.
