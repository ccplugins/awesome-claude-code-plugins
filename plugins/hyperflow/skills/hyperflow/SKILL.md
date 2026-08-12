---
name: hyperflow
description: Use when routing non-trivial engineering work through Hyperflow's compact, portable orchestration kernel.
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, Skill, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "[task]"
version: 6.1.1
license: MIT
compatibility: Portable across hosts with inline fallbacks when child agents are unavailable
tags: [orchestration, planning, execution, review, release]
---

# Hyperflow

Use the smallest workflow that can finish correctly. Read project instructions and the relevant code before asking questions or choosing a lane. Do not run startup commands, write project state, or spawn an agent merely to route work.

## Lanes

| Lane | Use when | Planning ceiling | Plan + build ceiling | Artefact |
|---|---|---:|---:|---|
| Direct | Clear, reversible work in one subsystem | 0 child calls | 0 child calls | None unless the user asked for a plan |
| Focused | Moderate work with several related tasks | At most 2 child calls | At most 4 child calls total | One `.hyperflow/tasks/<slug>.md` |
| Deep | Security, migrations, cross-boundary architecture, or material external research | At most 5 child calls | At most 8 child calls total | One `.hyperflow/tasks/<slug>.md` |

Full-chain ceilings include investigators, planners, workers, reviews, and retries. The coordinator performs remaining dependent work when another child call would exceed the ceiling. For a plan-and-build request, defer the independent plan review to the final cumulative review; do not review the same decision twice.

Escalate when new evidence crosses a lane boundary. Never downgrade merely to save time.

## Intent routing

| Intent | Action |
|---|---|
| build, implement, add, refactor | Inspect, choose a lane, then continue through `dispatch` without a build confirmation |
| fix, solve, failing behavior | Run `trace`; when the request asks for a fix, continue into execution after the root cause is established |
| plan, design, brainstorm, explore, scope, decompose, "what if", "should we", "unsure about" | Run `plan`, write the task artefact, and stop |
| audit, review | Run `audit`; stop after findings unless the same request explicitly asks for fixes |
| ship, release, deploy, push | Run `deploy`; remote mutation remains separately push-gated |
| handoff, another session | Run `handoff` with exact Git refs |

A combined request such as “plan and build” includes build intent and continues. A plan-only or design-only request never implements.

## Execution contract

1. Inspect the relevant surface, repository state, local instructions, and only the memory entries directly relevant to the task.
2. Ask only for a material choice that cannot be resolved from evidence or a safe, reversible assumption. Ask after inspection.
3. Keep plans and task state in one Markdown file. Keep child prompts in the two compact templates; do not add secondary persistence or formatting agents.
4. Use child agents only for independent work or independent judgment. Load [worker-brief.md](worker-brief.md) for workers and [reviewer-brief.md](reviewer-brief.md) for reviewers. Workers never review their own changes; reviewers never implement or coordinate.
5. The coordinator owns task status, integration, validation, and commits. Each distinct task receives its own conventional commit. Preserve unrelated and untracked user work.
6. Run checks proportionate to risk. Never claim completion while required checks are red or unrun without saying so.
7. Append a short project-memory entry only for a durable, verified learning. Read and write Markdown directly; do not maintain derived indexes.
8. Keep chat to short status lines and a compact final result. Put durable detail in the task or audit file.

## Safety floor

Blocked files: `.env`, `.env.*`, `*.pem`, `*.key`, `*.crt`, `~/.ssh/*`, `~/.aws/credentials`, `~/.config/gcloud/*`, and `~/.kube/config`.

Do not run `rm -rf`, `git push --force`, `sudo`, or `chmod 777`. `npm publish` and `cargo publish` require an explicit publication request. Never bypass hooks. Resolve destructive targets with read-only checks first. A confirmed security violation halts the chain as `SECURITY_VIOLATION:`.

Remote push, release publication, merge, and destructive operations require explicit authorization for the resolved target. Local implementation permission does not imply remote permission.
