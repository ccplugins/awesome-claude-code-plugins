---
name: split-into-stories
description: Split a Feature into Stories AND paired Testplans in the same response. Use when the user asks to split / decompose a feature into stories, asks to write stories for a feature, asks to create stories + testplans, or invokes /Tandem:split-into-stories. Operates as PM hat. Enforces the kit's MANDATORY Story → Testplan pairing rule — aborts (writes nothing) if it cannot produce both story and matching testplan in the same response.
---

# Tandem: split-into-stories (PM hat)

Operate as **PM hat**. The user has an approved Feature and needs to decompose it into work-sized Stories. Each Story ships with its paired Testplan in the **same response** — this is the kit's most load-bearing rule.

This skill is the slash-command wrapper for the kit's canonical story-decomposition prompt. The prompt is the source of truth; this file is the entry point.

## Source of truth

@_00-Project-Management/92-Prompts/04-split-feature-into-stories.md

Follow that prompt verbatim. The sections below add only the slash-command-specific glue + the paired-testplan enforcement contract — do not re-declare the prompt's content here.

## Paired-testplan enforcement (MANDATORY)

Per SOP §11 — "Story → Testplan pairing — MANDATORY" — every Story file under the resolved `stories` folder (via `node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve stories`), organized as `EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-*.md`, requires a paired Testplan in the resolved `testplans` folder, organized as `EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-<slug>.md`, written **in the same response**. Folder locations are resolved through the path map (`pm-paths.json`) rather than hardcoded.

This skill enforces the rule structurally, not as an honour-system convention:

1. Draft **both** the Story and its Testplan in memory first — every AC, every TC, every runnable `Command:`.
2. Only when both drafts are complete and consistent (every AC maps to ≥1 TC, every TC has a real runnable command), **commit both files to disk in the same response**.
3. If for ANY reason the paired Testplan cannot be drafted (AC is not machine-testable, command convention unknown, etc.), **abort — do not write the Story file**. Tell the user which AC blocked the pairing and ask them to either rewrite the AC to be testable or accept dropping it. Do not silently leave an orphan Story.
4. Story + Testplan numbering is lockstep: `STORY-NN.M.PP` ↔ `TESTPLAN-NN.M.PP` for the same `PP`. The skill picks `PP` once and uses it for both files.

This contract IS the differentiator vs. the plain paste-prompt. The prompt advises pairing; this skill rejects the violation.

## Inputs needed

- Path to the source Feature file under the `features` folder (resolve via the path map: `node _00-Project-Management/93-Scripts/lib/pm-paths.js resolve features`; e.g. `_00-Project-Management/31-Features/EPIC-NN/FEAT-NN.M-<slug>.md`).
- If the user didn't supply one, ask: "Which Feature file should I decompose? Paste the path or the FEAT-NN.M id."

## Load into context

Use `Read` / `Glob` to detect existence. Treat missing files as "not present" rather than throwing. Folder locations are resolved through the path map (`pm-paths.js` / `pm-paths.json`) rather than hardcoded.

- **Source Feature** — at the resolved path above. Read fully — especially the `## Acceptance criteria` checklist (each criterion ~ 1 story).
- **Parent Epic** — resolve the `epics` folder via the path map and read `EPIC-NN-*.md` for upstream context.
- **SOP** — `_00-Project-Management/90-Standards/SOP.md` for DoR, estimation, status enum, frontmatter contract.
- **Project context** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` for runnable test command conventions (which test runner, what ports, how to invoke).
- **Story + Testplan templates** — resolve the `templates` folder via the path map and read `STORY.template.md` + `TESTPLAN.template.md`. Use both verbatim — do not redraft section headings from memory.
- **Existing Stories under this Feature** — resolve the `stories` folder via the path map and glob `EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-*.md` to find next-free `PP` (zero-padded to 2 digits). Same `PP` is used for the paired Testplan. Create both subfolders if missing.
- **Project root `CLAUDE.md`** — for project-specific overrides.

## Task

1. Read the source Feature's `## Acceptance criteria`. Each criterion is typically one Story. If a criterion implies > L work, split into multiple Stories.
2. For each derived story, **draft both files in memory first** (Story + Testplan). Do not write to disk until both drafts are complete and consistent.
3. Story file content:
   - Use `STORY.template.md` verbatim.
   - Fill `As / I want / So that`, AC checkboxes, technical notes, dependencies, references.
   - Frontmatter: `status: not-started`, `created_at: <ISO 8601 now>`, other timestamps empty, `epic: EPIC-NN`, `feature: FEAT-NN.M`, `id: STORY-NN.M.PP`, `ai_review: pending`.
   - Set `type_of_work:` to a concrete discipline (`frontend` / `backend` / `infra` / `data` / `docs`) — **never leave the template placeholder** (it's a DoR gate per SOP §6 and fuels sub-agent assignment). Add `suggested_agents: [agent, …]` only when a specific specialist clearly fits — it overrides the PROJECT-CONTEXT `type_of_work → sub-agent` map (SOP §11.3 / FEAT-03.1). Most stories need only `type_of_work`.
4. Paired Testplan file content:
   - Use `TESTPLAN.template.md` verbatim.
   - One row in the AC→TC map per Story AC, ≥1 TC per AC.
   - Every TC has a runnable `Command:` (no manual steps, no "have a human verify"). Use commands appropriate to the stack (see PROJECT-CONTEXT.md).
   - **Never assert by grepping the whole `DASHBOARD.html` for a substring that could appear in indexed artefact prose.** The generator embeds every artefact's `bodyHtml` into the `window.__DATA` payload, so a bare `grep <substring> DASHBOARD.html` is confounded — the substring almost always also appears in some artefact's prose (including the very story/testplan that *discusses* the feature under test). This produced three false results (BUG-20260606-02, TESTPLAN-15.2.02, TESTPLAN-15.2.04). Instead: **(a)** parse the `window.__DATA` payload and assert the relevant array/field, **(b)** assert a **specific rendered element** (e.g. `grep '<h1 class="app-title">'`), or **(c)** use a sentinel that cannot appear in any artefact body. Extraction one-liner for (a): `node -e 'const D=JSON.parse(require("fs").readFileSync("…/DASHBOARD.html","utf8").match(/window\.__DATA = (\{[\s\S]*?\});<\/script>/)[1]); /* assert on D */'`.
   - Frontmatter: `id: TESTPLAN-NN.M.PP`, `story: STORY-NN.M.PP`, `feature: FEAT-NN.M`, `epic: EPIC-NN`, `status: not-started`, `created_at: <ISO 8601 now>`.
5. **Validate before writing**: every AC in the draft Story is covered by ≥1 TC in the draft Testplan; every TC has a real `Command:`. If validation fails, **abort** per the enforcement contract above.
6. Commit both files to disk in the same response. Number stories sequentially within the Feature (.01, .02, .03 …).
   - As each Story file is written, dispatch the `write-outcomes` skill via a sub-agent, passing the story's title, acceptance criteria, and technical content. Write the returned single-line outcome (verbatim, no markdown) into that Story's `outcome:` frontmatter field — in the same response.
7. Update the Feature's `## Stories` section with relative links to the new Story files.
8. **Show the file tree of what you'll create before writing.** Wait for user approval.

## Output rules

- If any AC is not machine-testable, **stop and flag**: "AC-3 'looks good' is not testable. Rewrite as e.g. 'matches mockup screenshot within 5% pixel delta', or accept dropping it." Do not invent a fake TC to hide the gap.
- If a Story estimates to XL, propose splitting before writing.
- If a Story has > 5 ACs, propose splitting (AC explosion → TC bloat).
- Do **not** mark any Story `ready` — that requires DoR gate via a separate refine step.

## Non-negotiable rules from CLAUDE.md

- Frontmatter timestamps (quoted ISO 8601 with offset, from system clock).
- Status enum (`not-started` on creation).
- **Story → Testplan pairing — MANDATORY** (enforced above; reject violations, don't bend).
- Templates rule — use `STORY.template.md` and `TESTPLAN.template.md` verbatim.
- Project-specific test conventions from `PROJECT-CONTEXT.md` (ports, commands, etc.).

## End-of-session summary (always emit)

- Stories created: N (list paths)
- Testplans created: N (list paths)
- Pairing verified: yes / no (must be yes — otherwise the writes shouldn't have happened)
- ACs flagged as not machine-testable: list, or "none"
- Estimated total: <days/weeks>
- Suggested first story to pull: STORY-NN.M.PP (lowest dependency, smallest)

## Next command

Next: `/Tandem:refine-backlog` — promote selected stories `not-started` → `ready` after DoR gate.

Or, if a story is obviously DoR-clean already: `/Tandem:execute-story <story-path>` — start work directly.
