---
name: critique
description: Advisory artefact quality review for planning artefacts (Epic, Feature, Story, Testplan). Use when the user asks to critique, review quality, check a planning artefact, audit a story or epic, or run a pre-refinement quality pass. Detects artefact type and runs the matching check set. Never rewrites the file.
---

# Tandem: critique (PM hat)

Operate as **PM hat**. The user wants a quality critique of a planning artefact before it enters the DoR gate or is shared with the team. This skill is **advisory**: it detects the artefact's type, runs the matching check set, proposes improvements, and reports findings — it never silently rewrites the file and does not promote status.

## Inputs needed

- Artefact path — one of:
  - Epic: `_00-Project-Management/30-Epics/EPIC-NN-<slug>.md` (canonical) or equivalent flattened path.
  - Feature: `_00-Project-Management/31-Features/EPIC-NN/FEAT-NN.M-<slug>.md` or equivalent.
  - Story: `_00-Project-Management/32-Stories/EPIC-NN/FEAT-NN.M/STORY-NN.M.PP-<slug>.md` or equivalent.
  - Testplan: `_00-Project-Management/33-Testplans/EPIC-NN/FEAT-NN.M/TESTPLAN-NN.M.PP-<slug>.md` or equivalent.
- If the user did not supply a path, ask: "Which artefact? Paste the file path."

## Load into context

Use `Read` / `Glob` to detect existence. Treat missing files as "not present" rather than throwing.

- **Target artefact** — at the resolved path.
- **Quality standards reference** — `_00-Project-Management/90-Standards/SOP.md`. This is the authoritative source for what "well-formed" means for every artefact type. Read the relevant sections at runtime; do not rely on a hardcoded copy in this skill.
- **Artefact template** — the matching template from `_00-Project-Management/91-Templates/` (e.g. `EPIC.template.md`, `FEATURE.template.md`, `STORY.template.md`, `TESTPLAN.template.md`). Used to verify no required section is absent or still holds a placeholder value.
- **Parent artefacts** (for Stories and Testplans) — load the parent Feature and Epic to verify strategic linkage and AC ancestry. For a Testplan, also load the paired Story.
- **Project root `CLAUDE.md`** — always loaded for project-specific overrides.

## Task — type detection and routing

### Step 1 — detect and route

Read the artefact's `type:` frontmatter field. Route to the matching check set:

| `type:` value | Dispatch to |
|---|---|
| `epic` | Epic checks |
| `feature` | Feature checks |
| `story` | Story checks |
| `testplan` | Testplan checks |

If `type:` is absent or unrecognised, infer from the filename prefix (EPIC-, FEAT-, STORY-, TESTPLAN-). If inference is also ambiguous, stop and ask the user which type to treat the artefact as.

### Step 2 — run the per-type checks

Run every check for the detected type. For each check: mark **PASS**, **WARN**, or **FAIL** with a one-line reason citing the specific evidence found (or missing) in the artefact.

---

#### Epic checks

1. **Strategic linkage** — does the Epic have a clear `okr:` or `prd_section:` reference? Strategic linkage strength: is it traceable to a measurable business outcome, or is it floating?
2. **In/out-scope clarity** — does the Epic define what is explicitly in scope and what is out of scope? Ambiguous scope leads to scope creep. Check that both sides are stated.
3. **Measurable success criteria** — does the Epic carry measurable success criteria (metrics, KPIs, or exit conditions), not just narrative intent? Vague "improve the experience" statements fail this check.
4. **4-week split check** — is the Epic sized to be completed within roughly four weeks of team effort? Larger Epics must be split. If the Epic bundles more than one coherent strategic theme, flag it as an oversized Epic and propose a split.
5. **Premise ↔ reality reconciliation** — if the Epic makes a status claim about, or proposes to retire/archive/delete/supersede, a named other artefact, resolve those ids and compare actual `status:` to the claim. A mismatch (or unresolvable id) is a **major** finding (see the Story-check definition for the tell + fixture). Advisory only.

---

#### Feature checks

1. **Goal / user value clarity** — does the Feature have a well-stated goal and articulate the user value it delivers? "User value" must be explicit: who benefits, how, and why it matters.
2. **AC testability** — are Acceptance Criteria written as machine-verifiable conditions? Subjective ACs ("feels fast", "looks good") fail this check. Each AC must be independently testable.
3. **Dependency realism** — are dependencies on other Features, services, or external systems listed? For each listed dependency: is it done or scheduled? Floating "depends on TBD" is a FAIL.
4. **Premise ↔ reality reconciliation** — if the Feature makes a status claim about, or proposes to retire/archive/delete/supersede, a named other artefact, resolve those ids and compare actual `status:` to the claim. A mismatch (or unresolvable id) is a **major** finding (see the Story-check definition for the tell + fixture). Advisory only.

---

#### Story checks

1. **Machine-testable ACs** — every AC must be verifiable by a machine (CLI command, assertion, file check, API call). Subjective or manual-only ACs are a FAIL.
2. **DoR-readiness** — does the Story satisfy the kit's Definition of Ready checklist? Check: AC checkboxes present; `feature:` and `epic:` frontmatter set; risks section non-empty; estimate set. A Story with DoR gaps should go through `/Tandem:refine-backlog` before being pulled to work — that gate, not this skill, is the authoritative promotion path.
3. **Estimate sanity / XL → split** — is the estimate set to XS / S / M / L? If the estimate is `XL`, the Story is too large: flag it for splitting before promotion. A missing estimate is a WARN.
4. **≤5 ACs** — Story ACs must number five or fewer (≤5 ACs). More than five ACs suggests the Story is too broad and should be split.
5. **Paired-testplan AC↔TC coverage** — if a paired Testplan exists, verify that every AC maps to at least one TC (AC↔TC coverage). If coverage is incomplete, list the uncovered ACs. If no Testplan exists yet and the Story is not in `not-started`, flag the absence.
6. **`type_of_work` set** — the `type_of_work:` frontmatter field must be set to a concrete discipline (`frontend`, `backend`, `infra`, `data`, `docs`). A missing or placeholder value is a FAIL.
7. **Premise ↔ reality reconciliation** — when the Story names other artefact ids (`STORY-`/`FEAT-`/`EPIC-`/`ADR-`/`BACKLOG-`) **and** makes a status claim about them (*"X is never-started / superseded / done / obsolete"*) **or** proposes to **retire / archive / delete / supersede / mutate** them, resolve those ids and compare their **actual `status:`** to the claim. A mismatch (or an unresolvable id) is a **major** finding — the premise is empirically false. Advisory only: critique never rewrites; the blocking enforcement lives in `refine-backlog`'s DoR gate. _Fixture: STORY-15.1.02 claimed "STORY-04.6.01–05 are never-started/superseded" and proposed `archived`, but all five are `done` — this check flags that as a major._

---

#### Testplan checks

1. **Every AC mapped to ≥1 TC** — the AC → TC coverage map must be complete. List any AC from the paired Story that has no corresponding TC entry.
2. **Every TC has a runnable `Command:`** — each Test Case must carry a `Command:` that Claude (or a CI runner) can execute unattended. A TC whose `Command:` is blank, says "manual verification", or says "have a human check" is a FAIL. The Command: must be a runnable shell or CLI instruction — no placeholders, no prose descriptions.

---

### Step 3 — compile findings

After running all checks, convert every non-PASS result into a **finding**. Assign each finding a severity (see §Severity model below), attach a concrete suggested fix, then emit the findings severity-ranked: blockers first, then majors, then minors.

---

## Severity model

Every finding carries exactly one of three severity levels. Severity-ranked output means all findings are ordered blocker → major → minor in the report.

| Level | Meaning | Typical check-verdict origin |
|---|---|---|
| **blocker** | Must fix before the DoR gate; leaving it in place will cause rework or invalidate the artefact. | FAIL on a gate-critical check (e.g. missing ACs, no `type_of_work:`, blank TC `Command:`, XL estimate un-split). |
| **major** | Should fix; the artefact is functional but the gap degrades quality or traceability. | FAIL on a quality check that does not directly block promotion (e.g. weak strategic linkage, floating dependency), or a WARN that represents a meaningful quality risk. |
| **minor** | Polish or nit; the artefact is DoR-ready but could be cleaner. | Soft WARN (e.g. a slightly vague AC that is still testable, a recommended-but-not-required field). |

### Verdict → severity mapping

Per-check verdicts (PASS / WARN / FAIL) map to finding severities as follows:

- **FAIL** on a gate check → **blocker** (the check description marks gate-critical items above; when in doubt, a FAIL is at least major).
- **FAIL** on a quality/traceability check → **major**.
- **WARN** with meaningful quality risk → **major**.
- **WARN** that is advisory or polish → **minor**.
- **PASS** → no finding; counted in the PASS total only.

### Per-finding suggested fix

Every finding (blocker, major, or minor) must include a **concrete suggested fix**: a specific, minimal, actionable edit — not a general directive. Examples of correct form:

- "Add `type_of_work: frontend` to the frontmatter after the `estimate:` line."
- "Replace AC-3 ('feels responsive') with a machine-testable condition: `p95 load time < 300 ms measured by Lighthouse CI`."
- "Split into two stories: one for the API endpoint, one for the UI surface."

"Improve this section" or "add more detail" are not acceptable suggested fixes.

---

## Output rules

- This skill is **advisory**. It proposes edits and improvements; it never silently rewrites the artefact or edits any file on disk. All proposed changes are shown in the findings report as suggestions for the user to apply.
- This skill does not promote status. Artefact status (e.g. `not-started` → `ready`) stays the DoR gate's job. The `/Tandem:refine-backlog` skill owns that promotion path; this critique skill complements it by surfacing quality issues upstream. Running critique before refinement reduces DoR-gate failures but does not replace the gate.
- Every check gets an explicit PASS / WARN / FAIL verdict — no silent omissions.
- Proposed fixes are concrete and minimal: "Add a `type_of_work: frontend` line to frontmatter" not "fill in the missing fields".
- If the artefact is high quality and all checks PASS, say so plainly — the skill is not obligated to find problems.

### Report format

Emit the following sections in order. Findings are severity-ranked (blockers → majors → minors).

**Artefact:** `<path>` (`<type>`) — `<status>`
**Critique summary:** B blocker / M major / N minor / K PASS

**Blockers (must fix before DoR gate)**
For each blocker finding: check name · one-line diagnosis · **Suggested fix:** `<specific, minimal, actionable edit>`.

**Major findings (should fix)**
For each major finding: check name · one-line diagnosis · **Suggested fix:** `<specific, minimal, actionable edit>`.

**Minor findings (polish / nit)**
For each minor finding: check name · one-line diagnosis · **Suggested fix:** `<specific, minimal, actionable edit>`.

**All checks PASS** _(list count only — "K checks passed")_

**Recommended next step:**
- If blockers present → fix the gaps, then run `/Tandem:critique` again, then proceed to `/Tandem:refine-backlog`.
- If only major / minor findings → user decides whether to address them; proceed to `/Tandem:refine-backlog` when ready.
- If all PASS → artefact is critique-clean; proceed to `/Tandem:refine-backlog` for the official DoR gate.

---

## Optional HTML critique artefact

The operator MAY request a persisted HTML critique artefact. This is **optional** — it is NOT produced by default. Only generate it when the operator explicitly asks (e.g. "save a critique report" or "write the HTML artefact").

When requested, write the artefact to:

`41-Reports/CRITIQUE-<artefact-id>-<YYYY-MM-DD>.html`

Where `<artefact-id>` is the artefact's ID token (e.g. `STORY-05.1.02`) and `<YYYY-MM-DD>` is today's date.

The HTML file must contain the full severity-ranked findings report (same content as the chat output), structured for human readability. The skill **describes** the artefact and writes its content; it does not bundle a renderer or stylesheet beyond basic inline HTML. Use semantic HTML elements (`<h1>`, `<h2>`, `<table>`, `<ul>`) — no external CSS dependencies.

This follows the kit's `41-Reports/` HTML-output convention: all generated report files live under `41-Reports/` at the project root, named with a type prefix, artefact ID, and ISO date.

## Non-negotiable rules from CLAUDE.md

- Read-only skill: this skill never writes to any file. Findings are chat-only.
- Status enum: this skill never touches `status:` in any file — status promotion is not its role.
- All checks run: no check is skipped silently. If a check cannot be evaluated (e.g. paired Testplan is absent), record it as "cannot evaluate — reason" rather than dropping it.
