---
name: handoff
description: Use when transferring a planned task to another session or reviewing work returned from one, with Markdown and exact Git refs.
allowed-tools: Read, Write, Edit, Glob, Grep, Skill, AskUserQuestion, Bash
argument-hint: "<create|list|status|pickup|review|complete> [slug]"
version: 6.1.1
license: MIT
compatibility: Git-backed and portable across sessions
tags: [handoff, sessions, git, resumability]
---

# Handoff

Use Git as the transport and exact refs as the boundary. Handoffs are Markdown-only and depend on no hidden session state.

## Package

A committed package contains:

```text
.hyperflow-handoff/<slug>/
  task.md
  handoff.md
```

`task.md` is the complete single task artefact copied from `.hyperflow/tasks/<slug>.md`. `handoff.md` contains a small table: status (`planned`, `built`, `reviewed`), source branch, build branch, base ref, head ref, created/updated dates, result, checks, and commit list.

Legacy v5 packages using `HANDOFF.md`, `STATUS`, or nested `artefact/` directories are archive-only. `list` and `status` may report their paths, but `pickup` and `review` require the user to manually create the current `task.md` plus `handoff.md` layout with exact refs. Never delete, rewrite, or claim to resume legacy data automatically.

## Commands

### `create <slug>`

Require the planned task file and a resolvable committed base. Copy the task into the package, record the exact base ref and intended build branch, set `planned`, and commit the package as its own conventional task commit so another session can fetch it. Do not include unrelated changes.

### `list` / `status [slug]`

Read only. Show status, branches, base/head refs, result, and whether the package is awaiting build or review.

### `pickup <slug>`

Require `planned`, verify the base ref exists, and preserve the package's scope. Check out or create only the recorded build branch when safe, then invoke `dispatch` with `task.md`. On completion, append the exact head ref, commits, changed paths, checks, and result to `handoff.md`; set `built` and commit that update. Do not widen the task or invent refs.

### `review <slug>`

Require `built` plus resolvable `base_ref` and `head_ref`. Invoke `audit` over exactly `<base_ref>..<head_ref>`. Never substitute the current worktree diff. On accepted PASS, set `reviewed` and commit the status update. On `NEEDS_FIX`, keep `built` until fixes are committed and the exact head ref is refreshed. On `SECURITY_VIOLATION`, halt.

### `complete <slug>`

Print final refs and evidence. Completion does not archive, delete, merge, deploy, or push. Those actions require their own explicit intent and gates.

If Git state makes branch switching or scoped commits unsafe, stop with the exact conflict rather than stashing, cleaning, or overwriting user work.
