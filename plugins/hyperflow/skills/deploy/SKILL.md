---
name: deploy
description: Use when committing, releasing, pushing, or deploying completed work after full verification and an explicit remote-action gate.
allowed-tools: Read, Write, Edit, Glob, Grep, Agent, AskUserQuestion, WebSearch, WebFetch, Bash
argument-hint: "[target]"
version: 6.1.1
license: MIT
compatibility: Portable; project release instructions are authoritative
tags: [release, deploy, push, verification]
---

# Deploy

Ship only the resolved scope. Local completion never implies remote authorization. Never bypass hooks, publish unexpectedly, or force-push a protected branch.

## 1. Resolve state

Read project instructions and inspect the branch, upstream, worktree, staged files, commits ahead, remotes, tags, lockfiles, and available project scripts. Preserve unrelated and untracked work. If the intended inclusion set cannot be proven from the task, commits, or diff, ask one scoped inclusion question after inspection.

An earlier explicit “push `<branch>`” may satisfy the push gate only when the resolved remote, branch, and commit set are unchanged and were named by the user. Otherwise show those exact targets and request a neutral `Push` / `Hold` decision after local gates.

## 2. Pre-push gates

Run the project-required full checks once, in fail-fast order where possible:

1. formatting/lint
2. type or compile checks
3. test suite, including integration checks the project mandates
4. production build when defined
5. security sweep of the exact diff and dependency audit when supported

Commands run in the coordinator; do not spend agent calls on test execution. Use one `risk-reviewer` only for security-sensitive or release-critical diffs. On any failure, halt and report the command and actionable error. Do not silently fix unrelated failures or claim readiness.

## 3. History and release

Stage only in-scope files. Keep each distinct task in its own conventional commit and never add model attribution. Do not amend unrelated history. Follow the repository's documented release command, changelog, version, tag, and manifest synchronization order exactly. If no release procedure exists, do not invent publication steps.

Reinspect the worktree, local-vs-upstream commits, version surfaces, and tags after release automation. A locally created release is not a pushed release.

## 4. Remote gate

Before the first remote mutation, require explicit authorization for the displayed remote, branch, head commit, and tags. Binary choices are neutral: `Push` / `Hold`. Headless or ambiguous means Hold.

On Push, use a normal non-force push and push required tags only. Verify the remote ref afterward. On Hold, leave the verified local commits/tags intact and report the exact refs.

## 5. Result

Return only: gates, commits, version/tag when applicable, remote/branch status, and remaining risk. Do not delete task files, handoffs, user data, or project memory as release cleanup.
