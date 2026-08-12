---
name: market-pulse
description: Summarize what's moving in the market right now using the AlphaAI MCP. Use when the user asks "what's moving?", "what's the big story today?", "anything breaking?", "market pulse", or wants a fast read on the current tape rather than one specific ticker.
---

# Market pulse

Answer "what's happening *right now*?" from AlphaAI's feed. Two tools cover two
different questions — pick the right one:

- **`alphai_actionable_now`** — breaking, *decision-grade* news from the last few
  hours. The gate is strict: by default only `actionability='high'` (something to
  act on TODAY — guidance cut, halted trading, breaking M&A, surprise print).
- **`alphai_trending`** — top stories of the last 48h by relevance. The "big
  picture", not necessarily urgent.

## Steps

1. **Start narrow, with `alphai_actionable_now()`** (defaults: last 6h,
   high-actionability). This is the real "is anything breaking" signal.
2. **Read an empty result correctly.** Outside major market hours (nights,
   weekends — crypto trades 24/7, but high-actionability prints still cluster in
   US/European/Asian sessions) an empty list is *expected* — it means no
   high-actionability prints in the window, **not** that the tool failed. Before
   concluding "nothing happened", widen once: `alphai_actionable_now(hours=24, min_actionability='medium')`.
3. **Add the backdrop with `alphai_trending(limit=10)`.** Use this for the
   "bigger stories shaping the week" layer even when nothing is breaking.
4. **Optional focus.** If the user named a sector or theme, resolve it to
   tickers (`alphai_tickers(q=...)` or your own knowledge), then
   `alphai_news_search(tickers=[...], min_relevance=7)` — there is no free-text
   news search; match themes client-side on the returned titles/summaries.

## Output

- **Breaking now** — the high-actionability items, if any. Each: headline ·
  ticker(s) · one clause on the decision it forces. If none, say so in one line
  and note the window you checked.
- **Big picture** — 3–5 trending stories by relevance, each a one-liner.
- **So what** — one or two sentences tying it together (risk-on/off, a sector in
  focus, an event everyone's positioning around).

## Guardrails

- Don't conflate "trending" with "actionable". A story can dominate the tape
  (trending) without being something to act on today (actionable). Label which
  layer each item came from if it matters.
- Report relevance / actionability honestly; don't upgrade a medium item to
  "breaking".
- News, not advice — no trade calls.
