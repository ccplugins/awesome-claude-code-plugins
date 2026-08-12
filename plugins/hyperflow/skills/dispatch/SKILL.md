---
name: dispatch
description: Use when implementing an explicit build, fix, refactor, or approved task file through the Direct, Focused, or Deep lane.
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, Skill, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "[task-file-or-request]"
version: 6.1.1
license: MIT
compatibility: Portable with coordinator-only Direct execution
tags: [implementation, orchestration, verification]
---

# Dispatch

Implement the requested outcome with the fewest useful handoffs. An explicit build or fix request authorizes local execution after inspection; do not add a build confirmation. It does not authorize push, merge, publication, broad cleanup, or unrelated edits.

## 1. Load and bound

Read project instructions, repository status, the supplied `.hyperflow/tasks/<slug>.md` when present, and the relevant implementation/tests. Preserve dirty-worktree changes and identify overlap before editing. If there is no task file:

- Direct work executes from the inspected request.
- Focused or Deep work first creates the single task file using the `plan` structure, then continues automatically because build intent is already explicit.

Confirm the lane from evidence:

| Lane | Execution |
|---|---|
| Direct | Coordinator edits, validates, and reports. Zero child agents. Escalate if risk or scope expands. |
| Focused | Use at most two worker calls for independent tasks; the coordinator handles the rest. One separate batch reviewer checks the integrated diff. Full plan-and-build ceiling: four child calls. |
| Deep | Use at most three worker calls, ordered by dependency, then one matching specialist integration reviewer. Security and migration work always stays Deep. Full plan-and-build ceiling: eight child calls. |

Keep the Focused full chain <=20k non-cached tokens and the Deep full chain <=60k non-cached tokens when the host reports usage. Treat these as ceilings, not targets; never fabricate unavailable totals.

Child-call ceilings are enforceable even without usage telemetry. They include planning, implementation, review, and retries. Never create a child for work the coordinator can finish within the existing context.

## 2. Build

For each task:

1. Re-read its files, acceptance criterion, dependencies, and local conventions.
2. Reuse existing libraries, components, utilities, and tests. Make the smallest coherent change.
3. When delegating, load [worker-brief.md](../hyperflow/worker-brief.md) and fill it from the task row. Keep each brief under 350 words. Give workers non-overlapping ownership whenever they run concurrently.
4. Workers edit only their scope, run affected checks, and return paths plus evidence. Workers do not review, spawn, change task files, or perform Git operations.
5. The coordinator integrates results, resolves only in-scope conflicts, and updates checkboxes/status in the same task Markdown file. Do not create secondary state or duplicate briefs.

If a worker fails, inspect the failure and retry once only when that call remains inside the lane ceiling. Otherwise complete the bounded task in the coordinator or report the specific blocker. Do not repeat an unchanged prompt.

## 3. Review once at the right boundary

- **Direct:** the coordinator checks the acceptance criterion and diff. No synthetic reviewer role.
- **Focused:** after the batch is integrated, give one separate reviewer the cumulative diff and task acceptance criteria using [reviewer-brief.md](../hyperflow/reviewer-brief.md). Fix only concrete `NEEDS_FIX` findings, then have the coordinator verify those corrections.
- **Deep:** use the specialist profile matching the dominant risk from `agents/` for one integration review over the cumulative diff. Confirm security, reversibility, cross-boundary contracts, and failure modes as applicable.

Workers never review their own output. Reviewers are read-only and never coordinate or implement. A `SECURITY_VIOLATION` halts execution immediately.

## 4. Verify and commit

Run affected lint, type checks, and tests after each task when available. Run the full project-required suite once at chain end for multi-task, cross-boundary, security, release-sensitive, or project-mandated work; include a production build when the project defines one. Do not run full suites after every worker. Never bypass a red check.

After a task passes its required checks and review, the coordinator creates its own conventional commit. Keep distinct tasks in distinct commits; feature code and its directly required docs/tests may share the same task commit. Never amend unrelated history, stage unrelated files, or add model attribution.

If Git operations are outside the granted scope, leave the verified changes uncommitted and say so.

## 5. Finish

Update the task file to `completed` or `blocked` with concise verification evidence and commit refs. Append only durable verified project learnings to the relevant `.hyperflow/memory/*.md` file.

Return a compact result: outcome, files, checks, commits, and any remaining risk. Stop locally. Invoke `deploy` only when the request also includes ship/release/deploy/push; remote actions keep their own gate.
