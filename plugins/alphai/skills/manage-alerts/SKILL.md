---
name: manage-alerts
description: List, add, or remove the user's ticker news-alert subscriptions through the AlphaAI MCP. Use when the user asks to "alert me on <ticker>", "subscribe me to <ticker> earnings news", "what alerts do I have?", "stop alerts for <ticker>", or to manage their AlphaAI alert inventory. Requires a paid (Basic/Pro) AlphaAI plan.
---

# Manage alerts

Let the user manage their own AlphaAI ticker news-alert subscriptions from the
chat. Identity comes from the OAuth login — these tools act on the **caller's
own** account.

> **Tier-gated.** `alphai_alerts_*` require a **Basic or Pro** plan. On the Free
> tier they return `tier_not_paid` — relay that and point to
> <https://alphai.io/pricing> instead of retrying.

## Steps

1. **Show current state first.** For any add/remove, call `alphai_alerts_list()`
   up front so you (and the user) can see existing subscriptions, the per-alert
   filters, and the tier limit (`current` / `limit`).
2. **Subscribe / update.** `alphai_alerts_subscribe(ticker, category_filter?,
   min_relevance_score?)`.
   - This is a **partial update**: omitting a field on an *existing* subscription
     preserves its current value. A brand-new subscription defaults
     `min_relevance_score` to 6.
   - `category_filter` is an optional whitelist from the 14 categories (e.g.
     `["earnings", "insider"]`) — only those categories trigger the alert.
   - Confirm the ticker is real first if unsure (`alphai_tickers`); the tool
     raises `unknown_ticker` / `limit_reached` otherwise.
3. **Unsubscribe.** `alphai_alerts_unsubscribe(ticker)` — idempotent; returns
   `{removed: false}` if it was already inactive.

## Output

- After a change, restate the resulting subscription in one line: ticker, which
  categories trigger it, and the minimum relevance — so the user sees exactly
  what they'll be alerted on.
- For a list request, render the subscriptions as a short table (ticker ·
  categories · min relevance · delivery mode) and note `current/limit`.

## Guardrails

- **Confirm before mutating.** Read back what you're about to subscribe to or
  remove before calling the write tool, especially for bulk changes.
- Handle errors plainly: `tier_not_paid` → suggest upgrading; `limit_reached` →
  list current alerts so the user can free a slot; `unknown_ticker` → don't guess
  a substitute.
- Never subscribe to tickers the user didn't ask for.
