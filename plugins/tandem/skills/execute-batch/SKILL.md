---
name: execute-batch
description: Execute one "chat" from an Implementation Strategy in this fresh session — run its stories sequentially (execute-story → run-testplan → close-out-story) with atomic per-story finalisation, a context-budget guard, and clean failure recovery; then flip the chat's executed flag so the dashboard shows it done. Use when the user invokes /Tandem:execute-batch with a chat id (e.g. CHAT-01), or asks to run/execute a batch or chat from the execution-strategist's plan. Operates as Dev/QA hat. This command DOES change story status (unlike execution-strategist, which is dry-run).
---

# Tandem: execute-batch (Dev/QA hat)

Operate as **Dev/QA hat** in a **fresh chat**. The user has an Implementation Strategy (from
`/Tandem:execution-strategist`) and wants to clear one of its **chats** — a small
set of stories grouped to run together — end to end, without re-warming context per story.

A "chat" is the execution-strategist's batch unit (`CHAT-01`, `CHAT-02`, …). This skill runs the
chat's stories **sequentially**, finalising each atomically before the next. It composes the three
existing per-story skills; it does **not** re-implement their logic.

## Inputs needed

- **A chat id** — e.g. `CHAT-01`. If the user didn't supply one, ask, or list the chats in the
  latest strategy.
- **The strategy** — default to the latest `_00-Project-Management/41-Reports/EXECUTION-STRATEGY-*.json`
  (the structured sidecar `execution-strategist` writes). Fall back to the paired `.md` report if the
  JSON is absent. The user may name a specific strategy file.

## Load into context

Use `Read` / `Glob`; treat missing files as "not present", never throw.

- **The named chat** from the latest `EXECUTION-STRATEGY-*.json`: its `stories` (with `ready`
  flags), `lanes` (serial/parallel), `verify` command, `sub_agents`, and `executed` flag.
- **Each story + its paired testplan** under `32-Stories/` + `33-Testplans/`.
- **SOP** — `90-Standards/SOP.md` (DoR/DoD, status enum, WIP limits §5).
- **The three sub-skills** this one delegates to: `execute-story`, `run-testplan`, `close-out-story`.

## DoR precheck (MANDATORY — before running anything)

A chat may include stories the strategy **flagged un-ready** (`ready: false`). **Do not execute an
un-ready story.** If any story in the chat is not `ready`, STOP and report which — the user runs
`/Tandem:refine-backlog` on those first. Only proceed when every story in the chat
is `ready` (or the user explicitly drops the un-ready ones from this run).

## Algorithm — sequential loop with atomic finalisation

Order the chat's stories by its **lanes**: a `serial` lane runs in its listed order; `parallel`
lanes are also run **sequentially here** (one at a time) — concurrent fan-out is **BACKLOG-0020**,
out of scope. Then, **for each story in order**:

1. **execute-story** — verify DoR, flip `ready` → `in-progress` (atomic + `started_at`), implement
   the ACs one at a time, file ADRs/BUGs as they arise. Use the chat's resolved **sub-agent** for
   this story's discipline where appropriate.
2. **run-testplan** — execute every TC's `Command`, mark PASS/FAIL, auto-file `BUG-YYYYMMDD-NN` for
   any failure.
3. **close-out-story** — run the DoD gate; flip to `done` (atomic + `completed_at`); update
   `MONITOR.md`; regenerate the dashboard (`npm run pm:dash`).
4. **Finalise atomically before the next story.** Do not advance until the current story has flipped
   to `done` AND MONITOR is updated (status flip + `completed_at` + revision-history line) AND a
   per-story **commit** has landed. The commit is the load-bearing recovery checkpoint — it is what
   makes mid-batch failure recoverable (a crashed batch leaves every completed story committed and
   `done`). The **dashboard regen (`npm run pm:dash`) may be batched to once at batch end** rather
   than run per story: it is a generated read-view (the Stop hook regenerates it anyway), and on a
   large board a 9 MB `pm:dash` per story is wasteful churn. Refresh MONITOR's generated count blocks
   cheaply per story with `npm run pm:monitor`; reserve the heavy `pm:dash` for the end.

### Context-budget guard

**Before each story**, estimate the remaining context. If running the next story would push
context **utilisation above ~80%**, **abort cleanly** (do not start it). A conservative threshold is
deliberate: if unsure, abort. Completed stories are already `done` and safe; the batch can be
resumed in a new chat.

### Failure-recovery contract

On any abort (context overflow, a story's DoD failing, a hard error):

- **Completed stories stay `done`** (they finalised atomically).
- **The current story** (the one mid-flight) goes to **`blocked`** with a one-line note in its body
  explaining why; do not leave it half-flipped.
- **Remaining stories stay `ready`** — untouched.
- Report: N done, 1 blocked (which), M remaining `ready`, and the chat id to resume.

## On success — mark the chat executed

When **all** the chat's stories reach `done`, set the chat's **`executed: true`** in the
`EXECUTION-STRATEGY-*.json` sidecar (so the dashboard's Implementation Strategy view renders it as
`AUTO-EXECUTED`), then regenerate the dashboard. Finally, run the chat's **verify-before-closing**
command and report its result.

## Output rules

- Commit messages per story: `STORY-NN.M.PP — <imperative>` (close-out-story owns these).
- Status changes are THIS command's job (it is **not** dry-run — that's `execution-strategist`).
- Respect SOP §5 WIP: only one story is `in-progress` at a time (sequential loop), so the in-progress
  limit is never exceeded by this skill.

## End-of-session summary (always emit)

- Chat: CHAT-NN (from EXECUTION-STRATEGY-YYYY-MM-DD)
- Stories done: X / Y · blocked: <id or none> · remaining `ready`: <list or none>
- Chat `executed` flag set: yes/no · dashboard regenerated: yes/no
- Verify-before-closing: <command> → <result>

## Non-negotiable rules from CLAUDE.md

- **Atomic finalisation** per story (status flip + `completed_at` + MONITOR + dashboard) before the
  next — the recovery contract depends on it.
- Status enum is the closed set of nine; DoR gate before `in-progress`, DoD gate before `done`.
- ADR-on-the-spot for non-obvious decisions; BUG auto-raise on any defect / TC failure.
- Never execute an un-ready story (DoR precheck above).

## Next command

Next: `/Tandem:run-testplan`

`/Tandem:weekly-monitor` — after a chat closes, fold the delta into the Friday
cadence. Or re-run `/Tandem:execute-batch <next-chat-id>` for the next chat in the
strategy (mind the chat's `depends_on` edges — run unlocked chats first).
