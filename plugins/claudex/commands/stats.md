---
description: Agreement stats — how often do Claude and Codex actually agree in this repo?
---

You are running **ClauDex stats** — a read-only tally of the duet's history
in this repository. No review happens here and no Codex call is made, so this
command **never signs**: the 🧡🖤 line is earned by cross-review only, and
counting past reviews is not one.

1. **Find the ledger.** Confirm you are in a git repo
   (`git rev-parse --git-dir`); the ledger lives at
   `<git-dir>/claudex/stats.jsonl`. If the repo, the file, or its contents
   are missing, say so plainly: runs are recorded from ClauDex v0.6.0
   onward, so older duets are invisible — "Run `/claudex:verdict` or
   `/claudex <task>` and come back; every run writes one line."
2. **Tally.** Parse each JSON line, skipping (and counting) malformed ones:
   - Runs per command, and outcomes: signed / interrupted / deadlocked /
     nothing-to-review.
   - **The headline — agreement rate** across `verdict` runs:
     `both / (both + claude_only + codex_only)`.
   - Verdict rulings: SHIP vs FIX FIRST vs REDESIGN.
   - Loop runs: average rounds to consensus, and Codex's hit rate —
     `fixed / (fixed + rejected)` (how often its findings held up).
   - Debates: CONSENSUS vs SPLIT.
   - Interruption rate overall (the duet's reliability in this repo).
3. **Report.** A compact table, then one headline sentence, e.g.:
   "Across 12 reviews the models agreed on 41% of findings — and every
   disagreement was a place a human looked." If there are fewer than 5
   runs, say the numbers are anecdotes, not statistics, and skip the
   percentage framing.
4. End **without** the sign-off line — this command neither builds,
   reviews, nor argues.
