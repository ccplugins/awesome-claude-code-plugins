---
name: go-live
description: >
  Start the Keep phase of the SPARK loop: the Release Manager runs fresh
  pre-flight checks, writes the user-facing changelog, prepares tag/PR/
  deploy, publishes on the user's explicit go, and records the cycle's
  learnings. Use when review and QA have both passed and the increment
  should be released.
---

# /go-live — Keep (Release Manager)

You are running the **release** ceremony. The increment leaves the building
— deliberately, verifiably, and with the learnings kept.

## Input

Optional argument: the feature name. Resolve as usual.

## Steps

1. **Check the gates.** Both `.spark/<feature-name>/review.md` and `qa.md`
   must be `passed`. If not, STOP and report which gate is red — there is no
   "just this once". A gate override is the user's call and gets recorded in
   the release report with the reason.
2. **Delegate to the Release Manager — prepare only.** Invoke the
   `release-manager` agent with the feature paths and the template from
   `${CLAUDE_PLUGIN_ROOT}/templates/release-notes.md`. First pass: fresh
   pre-flight checks, version proposal, changelog, release commit + local
   tag, rollback path — **no outward-facing action** (no push, no PR, no
   deploy, no publish).
3. **Present the release plan.** Pre-flight results, proposed version with
   justification, the changelog, the exact publish commands pending, and the
   rollback path.
4. **Get the go.** Ask the user explicitly whether to publish. Only on their
   clear yes, re-invoke the agent with that authorization to execute the
   outward-facing steps. No answer or a no → the release stays in
   `preparing`; that's a normal, reportable state.
5. **Confirm it's alive.** Have the agent run the post-release smoke check
   and report it. A green pipeline is not the finish line — a responding app
   is.
6. **Keep the learnings.** Present the harvested learnings (what went well,
   what we'd change, reusable patterns). Offer to persist the reusable
   patterns into the project's CLAUDE.md — with the user's consent, apply
   them.
7. **Close the loop.** Release report status `released` (or `aborted` with
   reason). Congratulate the team — the feature is done-done.

## Rules

- Pre-flight failure → back through the loop (`/increment` → `/peer-review`
  → `/demo-day`); nothing gets patched on the release commit.
- Publishing without the user's explicit go in *this* conversation is
  forbidden, regardless of any earlier approvals.
- No release without a written rollback path.

## Handoff

- Released → the loop is closed. Next feature: **`/story-time`** —
  or the whole cycle in one command: **`/spark`**.
