---
name: audit
description: Use when reviewing code, a diff, branch, pull request, or system for correctness, risk, security, performance, or maintainability.
allowed-tools: Read, Write, Glob, Grep, Agent, Skill, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "[target] [--level 1-5] [and-fix]"
version: 6.1.1
license: MIT
compatibility: Portable with read-only specialist reviewers
tags: [review, audit, security, quality]
---

# Audit

Review evidence, not preferences. Audit is read-only except for its Markdown findings artefact. It stops after findings unless the request also explicitly asks to fix them.

## Scope and depth

Resolve the exact target first: supplied paths, pull-request diff, or Git range; otherwise use current staged and unstaged changes. Never widen an explicit range. Read project instructions, affected code, callers, tests, and relevant configuration.

Map `--level` to the smallest useful lane:

| Level | Lane | Coverage |
|---:|---|---|
| 1 | Direct | syntax, obvious correctness, accidental change |
| 2 | Focused | acceptance, edge cases, tests, local conventions |
| 3 | Focused | cross-file integration and common security risks |
| 4 | Deep | architecture, accessibility, data, performance, operations |
| 5 | Deep | adversarial and cross-boundary review |

Default to level 2. Security-sensitive, migration, authentication, authorization, credential, or regulated-data scope is always Deep regardless of the flag.

## Review

- **Direct:** coordinator reviews the exact diff with zero child agents.
- **Focused:** one matching specialist reviewer examines the cumulative target.
- **Deep:** run two or three independent specialist lenses only when their domains are present, then one specialist integration reviewer reconciles evidence and severity.

Choose from `agents/systems-reviewer.md`, `experience-reviewer.md`, `data-reviewer.md`, `risk-reviewer.md`, or `performance-reviewer.md`. Use `debugger.md` for failure causality and `researcher.md` only when external current facts are material. Reviewers are read-only, never coordinate, never implement, and never review their own authored change.

Every finding must include severity, `path:line`, observed evidence, impact, and the smallest viable correction. Exclude vague possibilities, praise padding, and style opinions unsupported by project rules. Confirm applicability before reporting a vulnerability. A confirmed secret or critical trust-boundary defect returns `SECURITY_VIOLATION:` and halts.

## Artefact and continuation

Write one `.hyperflow/audits/<YYYY-MM-DD-HHmm>-<scope>.md`:

```markdown
# Audit: <scope>
| Field | Value |
|---|---|
| Verdict | PASS / NEEDS_FIX / SECURITY_VIOLATION |
| Level | <1-5> |
| Target | <exact paths or refs> |

## Findings
- [severity] `<path:line>` — <impact>. Fix: <smallest correction>.

## Evidence
- <checks, inspected paths, and material limits>
```

If the user asked only for review, print verdict plus file path and stop; do not ask a fix gate. If the same request says “audit and fix,” convert only actionable findings into the single task-file format and continue through `dispatch`. Audit does not imply deploy or push.
