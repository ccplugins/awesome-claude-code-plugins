---
name: mode
description: Set and enforce the project's global conversation Mode (Plan · Dev · Dual · Neutral) — the persistent "moat" that frames every joined chat. Use when the user says "go to plan/dev/dual mode", "set the mode", "isolate this chat", "rejoin global mode", when a request is out-of-mode, or when uncertain which phase the project is in.
---

# Tandem conversation Mode — "the moat"

A single project-global Mode frames every **joined** chat so suggestions stay in-phase. State lives in `.tandem-mode.json` at the repo root (git-ignored). Read/write it ONLY through `_00-Project-Management/93-Scripts/mode.js` (CLI or import) — never hand-edit the JSON.

## The four modes

| Mode | Meaning | Out-of-mode requests |
|---|---|---|
| **plan** | Planning phase. Founder/PM/QA-planning work. | Dev requests → nudge |
| **dev** | Building phase. Dev/QA-execution work. | Plan requests → nudge |
| **dual** | Both allowed (planning in one chat, building in another). | No nudge |
| **neutral** | No active frame (default/resting). | No enforcement |

## What is Plan vs Dev (anchored to lifecycle skills, not keyword-guessing)

- **Plan:** draft-okrs, draft-prd, draft-epic, split-into-features, split-into-stories, refine-backlog, execution-strategist; *planning* a testplan.
- **Dev:** execute-batch, execute-story, run-testplan, close-out-story; *running* a testplan.

## Joining (opt-in) and isolation

- A chat is **free** (no mode, no nudges) until it **joins**. Joining happens when `session-start` runs, or when the mode is set from within the chat.
- The `UserPromptSubmit` hook injects a `Tandem mode: …` banner each message for joined chats; a free chat gets nothing.
- **"isolate this chat"** → free it again: `node _00-Project-Management/93-Scripts/mode.js leave --session <session_id>`.

> Use the session ID from the hook payload / session context as `<session_id>` in every command below.

## Setting the mode

Triggered by `/mode <plan|dev|dual|neutral>` or natural language ("go to plan mode"):

```
node _00-Project-Management/93-Scripts/mode.js set <mode> --by user --session <session_id> [--context "<short label>"]
```

Setting from a chat also joins that chat. Confirm the change in one line and state what it now enforces.

## The nudge (soft — never a hard block)

When a JOINED chat's active mode disagrees with the request:

- **In plan, asked for Dev work:**
  > ⚠️ We're in **Plan** mode — that's Dev work. (a) switch to **Dev**, (b) go **Dual** so planning here + dev elsewhere both run, or (c) do it as a **one-off** without changing the mode?

  On (c), do the single task; leave the flag on `plan` (no silent drift).
- **In dev, asked for Plan work:** mirror image.
- **In dual:** no nudge — both allowed.
- **In neutral:** no enforcement; proceed. If a *sustained* run of one phase begins, you MAY offer once: "Want to set Plan mode for this?" — offer, never force.
- **Free (un-joined) chat:** no banner, no nudge.

## Auto-reset to Neutral (driven by the close skills)

You do not flip to Neutral spontaneously. It happens via:
- `close-out-story` — only when the closed story was the **last open story in the phase**.
- `close-phase` — always (also how Dual exits).

Each auto-reset is announced; it is written with `--by auto-neutral`.

## When in doubt

Bring it to the user. Never invent a fifth mode. Never hand-edit `.tandem-mode.json`.
