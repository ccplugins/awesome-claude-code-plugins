---
name: write-outcomes
description: Dispatched by producer skills via a sub-agent to turn an artefact's technical content into one plain-English founder-outcome line; it is not a manually-invoked lifecycle command.
---

# Tandem: write-outcomes (dispatch-only)

This skill is **dispatch-only**. Producer skills (via FEAT-14.3 wirings) spawn a sub-agent, hand it an artefact's technical scope, and this skill transforms it into a single plain-English outcome line for founder-facing communication. A human never invokes this directly; it is not part of the lifecycle command chain.

An "outcome line" is the what-you-can-now-do summary: what a founder will *have* or *be able to do* after this artefact ships. It strips internals and surfaces value.

## Voice

The outcome voice is one sentence, plain English, second-person or capability-framed. Hard bans (literal — keep this phrasing intentional and verbatim; TESTPLAN-14.1.01 TC-02 asserts these markers): **no internal IDs**, **no command names**, **no shell**, no jargon. Apply these strict rules:

- **DO:** Write what the founder will have or be able to do (`You can now…`, `You have…`, or `Teams can…`).
- **DON'T:** Use internal IDs (e.g., PROJ-12, RFC-44, TICKET-318).
- **DON'T:** Name commands or implementation (e.g., slash-commands, build scripts, CLI flags).
- **DON'T:** Include shell syntax, jargon, or tool names (e.g., "webhook payload," "API v3.2").
- **DO:** Keep it under ~20 words — one line, scannable.

## Template

```
You can now <capability> — <the value it unlocks>.
```

Or: `You have <artefact> enabling <outcome>.` Adapt as needed; keep it a single line.

## Examples

Each pair is labelled by the artefact type whose technical body the producer hands in. The *Bad* lines use invented placeholders (a fictional product, made-up `PROJ-`/`TICKET-`/`RFC-` ids) — they illustrate the failure mode without referencing this kit's real internals.

**Story:**

**Good:** You can now auto-generate dashboards from your requirements — ship faster without wiring widgets by hand.

**Bad:** PROJ-12 implements the dashboard-generator workflow via the build step (see RFC-44, TICKET-318).
*Why bad:* Invented internal IDs (PROJ-12, RFC-44, TICKET-318) and build jargon leak; no founder value.

---

**Feature:**

**Good:** Your team can spin up a release pipeline that scrubs gated content before publishing.

**Bad:** Run the publish build on the release branch, then execute the gated workflow per the FEAT-9 wiring.
*Why bad:* Command/branch references and an invented feature ID (FEAT-9) assume technical knowledge.

---

**Chat:**

**Good:** You can bulk-run a folder of work items in dependency order and track the full cycle to completion.

**Bad:** Batch-execute a work folder via the folder pointer + sub-agent fan-out in dependency order (TICKET-91).
*Why bad:* Mechanism jargon (batch-execute, folder pointer, sub-agents) and an invented id (TICKET-91) leak.

---

**Phase:**

**Good:** Documentation now stays accurate by testing that every example still works.

**Bad:** The docs-automation feature bundles four tickets into a scripts-plus-skill design for auto-managing the layer.
*Why bad:* Internal jargon (docs-automation feature, scripts-plus-skill, auto-managing) with no founder-facing outcome.

---

**PRD:**

**Good:** Your monitoring app now updates its alert rules without rebuilding the entire codebase.

**Bad:** Refactored the alert-rules module to hot-reload config per the Q3 polish milestone (see RFC-90).
*Why bad:* Mechanism leak (refactored, hot-reload config) and an invented decision id (RFC-90) assume background knowledge.

---

**Story:**

**Good:** You can deploy changes across all your sites without manually syncing dashboard copies.

**Bad:** Dashboard-generator dev/sync rules via symlinks and copy-drift gotchas per the reference-fork integration.
*Why bad:* Mechanism details (symlinks, copy-drift gotchas, dev/sync rules) and tooling jargon; no founder value statement.

## Input / Output Contract

**INPUT:** The artefact's technical content — title, acceptance criteria, scope, technical notes — passed by the producer skill.

**OUTPUT:** Exactly one single line of plain text, no markdown formatting, no leading label (no "Outcome:" prefix), no surrounding quotes. Length-bounded to ~20 words (at most 120 characters — ≤120 char). This bound is agent-enforced (advisory); it is not linted by `pm:lint` and will not cause a build failure. The producer persists this verbatim to the artefact's outcome field.

**Thin / empty input → return an empty line.** When the input describes no user-visible capability yet — a stub, empty or placeholder acceptance criteria, scaffolding-only scope, or a TODO with nothing shipped — return an empty line (no text). The producer then leaves the outcome field blank rather than inventing one. Never fabricate value the artefact does not yet deliver: a blank outcome is correct and honest; a plausible-sounding but unearned promise is not. This keeps the five FEAT-14.3 producers consistent — none should synthesise an outcome from an artefact that has no shipped capability to describe.

## How Producers Dispatch This

A producer skill (e.g., the FEAT-14.3 wirings for dashboard-generator or CLAUDE.md automation) spawns a sub-agent, hands it the artefact's technical body + this skill file, and receives the one-line outcome back to store. The sub-agent runs this skill in isolation, not as part of the lifecycle chain. The outcome line is persisted by the caller, not by this skill.

This skill is dispatch-only and does not execute in the main lifecycle.
