---
name: insider-radar
description: Scan SEC Form 4 insider trades and 13F ownership moves for a ticker or a watchlist using the AlphaAI MCP. Use when the user asks about "insider buying", "insider selling", "Form 4 activity", "who's buying <ticker>", "institutional ownership changes", or wants an insider-activity sweep.
---

# Insider radar

Surface ownership-change signal: **SEC Form 4** trades (officers, directors, 10%
owners trading their own stock) and **13F** moves (funds and foundations
adjusting stakes). AlphaAI templates each filing into a relevance-scored news row,
so the read-across is already done.

## Steps

1. **Single ticker.** Call `alphai_insider_news(ticker="<SYM>")`. If the user
   wants only the strongest signal, raise the floor with `min_relevance=8`.
2. **Watchlist.** Call `alphai_insider_news(ticker=...)` once per name. If the
   user gave none, call `alphai_insider_news()` unfiltered for the broad tape.
3. **Time-box on request.** For "this week" / "since earnings", pass
   `from_date` (ISO, UTC). Paginate with `cursor` only if they ask for more.
4. **Distinguish buys from sells.** Open-market *purchases* by insiders are the
   higher-signal event; routine 10b5-1 scheduled sales and option-exercise sales
   are noise more often than not. Call that out — don't treat every sale as
   bearish.

## Output

- **Notable buys** — insider purchases first: ticker · who/role · size if given ·
  relevance. These are what most users actually want.
- **Notable sells** — flag whether each looks like a discretionary sale vs a
  scheduled/10b5-1 or option-related sale, where the feed says.
- **Institutional (13F)** — any fund stake increases/trims worth a mention.
- **Read** — one line: is the cluster leaning accumulation or distribution, or is
  it just routine?

## Guardrails

- An insider sale is not automatically bearish (taxes, diversification, scheduled
  plans). Say what the filing shows; don't over-read it.
- One filing can span several tranches sharing a row — report the *event*, not a
  count of line items.
- Lead with `relevance_score`; "no notable insider activity in the window" is a
  valid, useful answer.
- News, not advice.
