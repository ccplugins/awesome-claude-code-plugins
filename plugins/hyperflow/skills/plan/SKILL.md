---
name: plan
description: Use when the user asks to plan, design, explore, scope, or decompose work before implementation.
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "<request>"
version: 6.1.1
license: MIT
compatibility: Portable; child agents are optional outside Deep work
tags: [planning, design, decomposition]
---

# Plan

Turn the request into one build-ready Markdown task artefact. An explicit plan or design request stops after the file is reviewed. Do not ask where to build and do not implement. If the same request explicitly includes building, return control to `dispatch` after the file is ready without another confirmation.

## 1. Inspect and classify

Read project instructions, repository state, relevant code, nearby tests, and only directly relevant project memory. Then choose:

- **Direct:** clear, reversible, one subsystem. Coordinator plans; zero child calls.
- **Focused:** moderate scope or several related tasks. A plan-only request may use one investigator and one separate reviewer; maximum two planning child calls.
- **Deep:** security, migration, cross-boundary architecture, or material research. A plan-only request may use two or three independent investigators, one planner synthesis, and one specialist review; maximum five planning child calls.

| Plan lane | Child-call ceiling | Planning-token ceiling |
|---|---:|---:|
| Focused | <=2 child calls | <=6k planning tokens |
| Deep | <=5 child calls | <=18k planning tokens |

The call ceilings are hard. Token ceilings are host-reported budgets; never invent usage when the host does not expose it.

Questions come after inspection and only when an answer changes the plan materially. Prefer a documented, reversible assumption. Ask no more than three concise questions in one turn.

## 2. Investigate economically

Give each child a distinct question and bounded file scope. Do not dispatch agents for routing, formatting, status, test execution, or writing individual sections. Parallelize only independent investigations. Keep detailed exploration in child context; carry forward conclusions, paths, constraints, and unresolved risks.

External research is reserved for current or uncertain facts that affect the decision. Prefer primary sources and record links compactly in the task file.

## 3. Write one artefact

Write only `.hyperflow/tasks/<slug>.md`. Keep a simple task file under 1,200 words:

```markdown
# <Task>

| Field | Value |
|---|---|
| Status | planned |
| Lane | Direct / Focused / Deep |
| Scope | <bounded surface> |

## Outcome
<two or three sentences>

## Evidence and decisions
- `<path>` — <fact or constraint>
- Decision: <choice and short reason>

## Tasks
- [ ] T1 — <action> — files: `<paths>` — accepts: <observable result>
- [ ] T2 — <action> — files: `<paths>` — depends: T1 — accepts: <result>

## Verification
- <smallest relevant check>
- <end-to-end or full gate when risk requires it>

## Risks and boundaries
- <risk, mitigation, and explicit non-goal>
```

Tasks must be independently committable, ordered by dependency, and precise enough that `dispatch` does not need to redesign them. One user task may span files, but two distinct requests remain two tasks and two commits.

## 4. Review and stop or continue

Direct plans receive a coordinator consistency check. For a plan-only request, Focused plans receive one independent review and Deep plans receive one specialist review. Review scope, dependencies, acceptance criteria, safety, and verification once; revise only failed points.

- Explicit plan/design/explore/decompose: print the lane and task-file path, then stop.
- Explicit plan-and-build: skip the separate plan review and invoke `dispatch` with the task-file path. Its single cumulative review covers both the plan and implementation, keeping the Focused full chain at four child calls and the Deep full chain at eight.

The explicit intent determines whether the flow stops or continues; do not add another confirmation.
