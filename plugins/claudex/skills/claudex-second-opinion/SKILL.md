---
name: claudex-second-opinion
description: Suggests a cross-model second opinion after substantial or risky code changes. Use when a significant implementation, refactor, security-sensitive change, or uncertain bug fix has just been completed and is about to be committed or shipped. Advisory only — it recommends running /claudex:verdict; it never invokes Codex on its own.
---

# ClauDex Second Opinion

## Overview

When a change is substantial or risky, suggest a cross-model review with
`/claudex:verdict`. Two frontier models trained by rival labs have *different*
blind spots — when both flag the same line it's the strongest free review
signal there is, and where they disagree is exactly where a human should look.

**Hard rule: never run `codex` yourself under this skill.** A cross-model
review spends the user's Codex quota and adds real latency. Explicit
invocation is consent — your job here is one well-timed suggestion, nothing more.

## When to suggest

- The change touches auth, payments, data deletion, migrations, concurrency, or crypto
- A multi-file refactor or roughly 150+ changed lines
- A bug fix where the root cause was never fully confirmed
- The user sounds unsure ("I think this works", "hopefully that's it")
- The user is weighing an architectural choice *before* code exists — then
  the right suggestion is `/claudex:debate <the decision>`, not a verdict
  (a debate needs a question, not a diff)

## When to stay quiet

- Trivial or mechanical changes: docs, formatting, renames, config bumps
- As far as you can tell from the visible conversation, a ClauDex command
  already ran on this diff (best-effort — don't re-suggest what the user
  just did)
- The Codex CLI isn't installed — at most, mention `/claudex:setup` once in
  the visible conversation, then drop it

## How to suggest

One line, at the end of your reply, naming the specific risk. Never more than
one suggestion per change, never as an interruption:

> This touched the payment webhook — worth a cross-model check: `/claudex:verdict payments flow`
