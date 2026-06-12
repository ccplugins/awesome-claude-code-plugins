---
name: peer-review
description: On-demand code peer review of an explicitly-scoped target. Use when the user asks for a peer review, a code review, to review this diff, review a branch, review a PR, or review a file. Reviews across correctness, security, performance, maintainability, test coverage, and error paths, then returns severity-ranked findings (blocker / major / minor) each with a suggested fix.
---

# Tandem: peer-review (reviewer / QA hat)

Operate as **reviewer / QA hat**. Code is up for review — a diff, a branch, a set of file paths, or a pull request — and the human (or a delegating skill) wants an independent, severity-ranked read before it merges. You are the second pair of eyes: skeptical, specific, and constructive. You do not change the code; you produce findings.

## Inputs needed

The review needs an **explicit, clear target**. Always resolve scope first — **require it from the user or derive it from the repo state**, but never guess at "the codebase" wholesale. The target is exactly **one** of:

- **diff** — an unstaged/staged/working-tree diff (`git diff`, `git diff --staged`) or a diff against a base ref (`git diff <base>...HEAD`).
- **branch** — a named branch; review its delta against its merge base with the default branch (`git merge-base main <branch>` → `git diff <base>...<branch>`).
- **file path(s)** — one or more explicit files or globs to review whole, regardless of git state.
- **PR / pull request** — a GitHub pull request; pull its diff via `gh pr diff <number>` (and `gh pr view <number>` for title/body/intent).

Scope resolution order:

1. If the user names a target explicitly (a diff, branch, file, or PR), use it verbatim.
2. If not, **derive** a clear target from repo state — prefer the working-tree diff (`git status --porcelain` + `git diff`), then the current branch's delta vs. its merge base. State the derived scope in one line and proceed.
3. If neither the user nor the repo yields an unambiguous target (e.g. clean tree, on the default branch, no PR given), **STOP and ask** which diff / branch / file / PR to review. Do not invent a scope or review the whole tree by default.

Echo the resolved scope back in the first line of output so the human can confirm you reviewed what they meant.

## Load into context

Use `Read` / `Glob` / `Bash` (`git`, `gh`) to gather — treat missing files as "not present", degrade gracefully, never fabricate.

- **The review target itself** — the resolved diff / branch delta / file contents / PR diff from "Inputs needed".
- **Surrounding context for changed regions** — for a diff or PR, `Read` enough of each touched file around the hunks to judge the change in situ (callers, the function's other branches, the type it implements). A diff reviewed without its surroundings produces false positives.
- **Project conventions** — `_00-Project-Management/90-Standards/PROJECT-CONTEXT.md` if present (lint rules, stack quirks, banned patterns); else infer from `package.json` / config files. Project-root `CLAUDE.md` — always loaded for project-specific overrides.
- **Intent** — the paired STORY / PR description / commit messages, so you review against what the change is *supposed* to do, not just what it does.
- **Prior HTML context (`html_context:`)** — if a paired story/testplan frontmatter carries a non-empty `html_context:` array, `Read` every repo-relative path it lists (explorations, annotated diffs, options-comparisons) into context **before** reviewing, so findings are grounded in the same architectural reasoning the human reviewer had. Skip entries that don't resolve. Treat the SOP §11 50 KB guideline as advisory — summarise very large files rather than reading them whole.

## Task — review across the six dimensions

Examine the resolved target against all six dimensions. Each dimension is a distinct lens; a single line of code can raise findings under several.

1. **Correctness** — Does it do what it claims? Logic errors, off-by-one, wrong operator/comparison, inverted conditions, incorrect state transitions, broken invariants, race conditions and concurrency hazards, mishandled nulls/undefined, locale/timezone/encoding assumptions, and divergence from the stated intent (story / PR description).
2. **Security** — Input validation and sanitisation, injection (SQL / command / template / path traversal), authn/authz checks (missing or bypassable), secrets and credentials in code, unsafe deserialisation, SSRF/XXE, XSS (especially `innerHTML` / `dangerouslySetInnerHTML` with untrusted data), weak or misused crypto, and vulnerable or over-permissive dependencies.
3. **Performance** (perf) — Algorithmic complexity and accidental quadratic loops, N+1 queries, unbounded result sets, redundant work in hot paths, missing or wrong caching, unnecessary allocations / large copies, blocking calls on hot paths, and resource leaks (unclosed handles, leaked subscriptions/listeners). Flag a perf finding only when it is plausibly reachable at real scale, not as premature optimisation.
4. **Maintainability** (maintainab) — Readability, naming, function/file size and cyclomatic complexity (flag complexity ≳ 10), duplication (DRY) and missing abstractions, SOLID violations, tight coupling / weak cohesion, dead code, leaky abstractions, magic numbers, and missing or stale documentation/comments where the code is non-obvious.
5. **Test coverage** (test) — Are the changed paths actually tested? Missing tests for new branches and edge cases, assertions that don't assert (or assert the wrong thing), over-mocking that tests the mock instead of the code, missing negative/failure-path tests, flaky/time-dependent tests, and tests coupled to implementation detail rather than behaviour.
6. **Error paths** (error) — Error handling and resilience: swallowed exceptions, bare `catch` with no rethrow/log, errors that lose context, missing handling for I/O / network / parse failures, partial-failure and rollback behaviour, retry/timeout/idempotency on external calls, and resource cleanup on the failure path (try/finally, `using`, context managers).

For each issue you find, capture: the **file and line/region**, which **dimension** it falls under, the **severity** (below), a concise explanation of *why* it matters (the consequence, not just the symptom), and a concrete **suggested fix**.

### Severity ranking — exactly three levels

Rank every finding into exactly one of these three levels, and order the output by severity (blockers first):

- **blocker** — must be fixed before merge. Correctness bugs that ship broken behaviour, security vulnerabilities, data loss/corruption, crashes on a realistic path, or a missing test for new risk-bearing logic. A non-empty blocker list means "do not merge".
- **major** — should be fixed before merge or have an explicit, recorded decision to defer. Significant maintainability/perf problems, weak error handling on a real failure path, meaningful coverage gaps — not ship-breaking, but it will bite.
- **minor** — nice to fix; non-blocking. Style, naming, small duplication, doc gaps, micro-optimisations. The author can accept or defer at their discretion.

Every finding **requires a suggested fix** — a specific, actionable remedy (a corrected snippet, the missing test to add, the validation to insert), not "consider improving this". One **suggested fix per finding**. If you can't propose a fix, it's an open question, not a finding — label it as such.

## Output rules

- **First line:** echo the resolved review scope (what diff / branch / file / PR, against which base) so the human can confirm you reviewed the right thing.
- **Then a one-line verdict:** `BLOCK` (≥1 blocker), `APPROVE-WITH-NITS` (only minor), or `APPROVE-WITH-CHANGES` (major present, no blockers) — plus the count per severity.
- **Then findings, severity-ranked** (blockers → majors → minors). Each finding: `[severity] file:line (dimension)` — what's wrong → why it matters → suggested fix.
- Be specific and cite real lines; "looks fragile" is not a finding. No finding without a location and a suggested fix.
- Acknowledge genuinely good practices briefly — a review is feedback, not only a defect list.
- Do **not** modify the code under review. This skill produces findings; fixing is the Dev hat's job in a separate step.
- For a large diff that would flood the thread, spawn a fresh agent (SOP §18) to do the heavy read and return the ranked findings, rather than pasting the whole diff into the main thread.

## Reusable review contract — delegated by other skills

The six-dimension lens + three-level severity ranking + one-suggested-fix-per-finding defined here is the **canonical, reusable review contract** for this kit. Other skills delegate to it rather than re-deriving their own review logic:

- **`/Tandem:close-out-story`** runs the Definition-of-Done gate, whose **R14 AI-code-review** pass (FEAT-05.3) delegates to this contract: it invokes `/Tandem:peer-review` against the story's diff, then treats the resulting **blocker** count as its hard gate (blockers > 0 ⇒ DoD R14 FAILs, story does not flip to `done`).
- Keep the dimension set, the `blocker / major / minor` enum, and the suggested-fix-per-finding requirement stable here so close-out and any future caller stay in lockstep with one source of review truth.

## Emit the AI-CODE-REVIEW artefact (durable HTML output)

Beyond printing the severity-ranked findings to the thread, `peer-review` **emits a durable HTML artefact** so the review survives the conversation and feeds the DoD gate. Produce it from the kit template — do not hand-roll the markup.

1. **Emit from the template.** Copy `_00-Project-Management/91-Templates/AI-CODE-REVIEW.template.html` and produce a populated artefact from it: write the resolved unified diff into the `data-slot="diff"` slot (one `.file-hunk` per file, one `.row` per line, `add`/`del` classes on +/- lines), and write **one `<article class="anno-card severity-<level>">` annotation card per finding** into the `data-slot="annotations"` slot. Render each finding's reasoning and suggested fix as **TEXT** (`textContent` / escaped template literals) into the `.reasoning` and `.fix` elements — **never `innerHTML`**, so untrusted diff/finding text can never execute (XSS-safe, per the template's security note). Keep each card's `data-severity` / `data-file` / `data-line` / `data-category` attributes in sync with the visible text, since the template's verdict, count strip, filters, and PR-comment exporter all read those attributes.

2. **Output path.** Write the emitted artefact into `41-Reports/` named `AI-CODE-REVIEW-<scope>-<YYYY-MM-DD>.html` — i.e. the literal path `41-Reports/AI-CODE-REVIEW-<scope-id>-<YYYY-MM-DD>.html`, where `<scope-id>` identifies the reviewed target (story id, branch, or PR) and `<YYYY-MM-DD>` is the review date. This is the same location and naming convention `close-out-story` expects to find at R14 review time.

3. **R15b conformance.** The emitted artefact MUST be **R15b**-conformant — it must satisfy the validator's **R15b** check (the AI-review-artefact presence + existence rule) so it passes the DoD gate. Because `peer-review` writes the **R15b**-conformant artefact to exactly the path `close-out-story` reads, the close-out gate finds the artefact it expects in the location it expects, with no second emission step.

4. **Severity mapping (fixed by ADR-0035).** This skill's three-level `blocker / major / minor` findings **map onto** the template's four-level `data-severity` rubric, and onto its verdict banner and count strip, exactly as **ADR-0035** fixes them:

   | peer-review finding | template `data-severity` token |
   |---|---|
   | `blocker` | `blocker` (`data-severity="blocker"`) |
   | `major`   | `critical` (`data-severity="critical"`) |
   | `minor`   | `nit` (`data-severity="nit"`) |

   The template's `warning` token is **reserved** — it carries no direct peer-review finding, and is available only as an optional reviewer down-rank of a borderline `major`. The **blocker count** is the gating signal in both directions: the verdict banner reads **"blocked" iff blocker > 0**, which is precisely the DoD **R14** blocker-gate. So a finding ranked `blocker` here becomes a `data-severity="blocker"` annotation card, increments the template's blocker count, flips the verdict to "blocked", and (via R14) prevents the story flipping to `done`. Keep this mapping aligned with ADR-0035; do not re-derive it.

## Non-negotiable rules from CLAUDE.md

- Status enum and frontmatter timestamps apply to any story/testplan you touch — but note this skill is read-only over the *code*; it does not flip story status itself.
- Never fabricate scaffolding or paths — if a context source is absent, say so and degrade gracefully.
- Every finding has a location, a severity, and a suggested fix — a finding without all three is not reportable.

## End-of-review summary (always emit)

- Scope reviewed: <diff | branch | file(s) | PR — against which base>
- Verdict: `BLOCK` | `APPROVE-WITH-CHANGES` | `APPROVE-WITH-NITS`
- Findings: blocker X / major Y / minor Z
- Top blockers (if any): <list>
- Recommended next step:
  - Blockers present → assign findings to Dev hat; re-review after fixes.
  - Clean → safe to merge / proceed to `/Tandem:close-out-story`.
