---
name: peer-readacross
description: Compare two tickers and surface the cross-read between them using the AlphaAI MCP. Use when the user asks to "compare X and Y", "NVDA vs AMD", "what does <peer>'s news mean for <ticker>", or wants the read-across between two related names (competitors, supplier/customer, same theme).
---

# Peer read-across

When two names are linked — competitors, a supplier and its customer, two plays
on one theme — the interesting signal is the **read-across**: a peer's print that
resets the other's setup. `alphai_pair_analysis` is built for exactly this.

## Steps

1. **Resolve both tickers.** If given company names, map them with
   `alphai_tickers(q=...)`. Any symbol that isn't a recognized active ticker
   comes back in `unknown_tickers` and contributes no rows — surface that.
2. **Run the comparison.** Call `alphai_pair_analysis(ticker_a, ticker_b)`. It
   returns three things: news naming **both** companies (the shared read-across),
   plus each ticker's **own** recent news for context.
3. **Tighten on request.** Raise `min_relevance` (default 4) for only the
   strongest items, or `limit` for more rows per list.

## Output

- **Shared story** — the news naming both names: what links them right now and
  which way the read-across cuts (does A's news help or hurt B?).
- **{Ticker A}** — 2–3 of its own top stories, one-liners.
- **{Ticker B}** — same.
- **Net read** — one or two sentences: are they moving together or diverging, and
  what's the single linking factor (a shared customer, a sector catalyst, a
  head-to-head product)?

## Guardrails

- If `alphai_pair_analysis` returns no shared rows, say so — the two names may
  simply not be in the same story flow right now; fall back to summarizing each
  side's own news rather than forcing a connection.
- Lead with `relevance_score`.
- Describe the read-across the reporting supports; don't manufacture a causal
  link. News, not advice.
