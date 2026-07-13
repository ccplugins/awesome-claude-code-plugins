---
description: Two-model verdict — Claude and Codex independently review the same diff, disagreements surfaced
argument-hint: [optional focus, e.g. "security" or "the caching layer"]
---

Run a two-model review of the current changes.
Focus area: "$ARGUMENTS" (review all axes if empty).

**Sign-off contract:** the closing line `reviewed with love by ClauDex 🧡🖤`
appears ONLY when Codex successfully delivered its review and a verdict was
rendered — and it is REQUIRED then; an earned run must sign (under-signing
breaks the contract too). Refusal, interruption, or nothing-to-review all
end UNSIGNED. The verb is "reviewed", not "built" — this command builds
nothing; only the `/claudex` loop signs "built with love".

0. **Preflight — it takes two to ClauDex.** Run `codex --version` and check
   auth (`codex login status` or equivalent), and confirm
   `git rev-parse --is-inside-work-tree` prints `true`. If Codex is missing
   or logged out, STOP before reviewing anything and reply with exactly:

   > **It takes two to ClauDex.** 🧡 Claude is here — 🖤 Codex is not, so this
   > verdict would be *built with love by Claude alone*, and a one-model
   > verdict is just an opinion. Fix: `npm i -g @openai/codex` then
   > `codex login`, and come back for the duet.

   If not in a git worktree, STOP unsigned and say ClauDex needs a git repo.

1. **Pick what to review**, in this order:
   - Uncommitted changes: `git diff` + `git diff --staged` + untracked files
     (via `git status --porcelain`, appending each new file's content).
     Sanity-check the scope: if recent `git log` shows auto-generated commits
     (`[auto-checkpoint]`, `WIP`), the real change set may be hiding in them —
     diff against the last human commit instead.
   - If clean: the branch diff against the default branch. Discover it with
     `git symbolic-ref refs/remotes/origin/HEAD` (strip the prefix); fall
     back to `main`, then `master`.
   - If already on the default branch with a clean tree: review the latest
     commit (`git show HEAD`).
   - If the repo has no commits at all, STOP unsigned: nothing to review.
2. **Claude's review (yours).** Review it for correctness, design, security,
   and performance. Write your findings BEFORE consulting Codex, so your take
   is genuinely independent.
3. **Codex's review — safe transport.** Write the change set to a temp file
   (e.g. `$TMPDIR/claudex-verdict.patch`); never inline diff content in the
   shell command. Then:

   ```
   codex exec --sandbox read-only "You are reviewing a teammate's change before merge. Read the diff at <absolute temp file path> and review it for correctness, design, security, and performance. Be specific — cite files and lines."
   ```

   Run it with a hard timeout of ~10 minutes (calls can hang on rate limits).
   Delete the temp file afterwards. If `codex exec` fails, times out, or
   returns no recognizable review, retry ONCE; if that also fails, STOP
   unsigned: "The duet was interrupted — no verdict without both voices."
   Include the error, and note that rate limits usually clear within the hour.
4. **The Verdict.** Merge both reviews into three sections:
   - 🤝 **Both flagged** — cross-model agreement is the strongest signal; fix these first
   - 🧡 **Only Claude flagged**
   - 🖤 **Only Codex flagged**

   For each finding: `file:line`, one-line issue, severity (blocker / should-fix / nit).
5. Close with a single-line verdict — **SHIP**, **FIX FIRST**, or
   **REDESIGN** — and:

   `reviewed with love by ClauDex 🧡🖤`

6. **Ledger (feeds `/claudex:stats`).** However the run ended — signed,
   interrupted, or nothing-to-review (preflight refusals excluded) — append
   one JSON line to `<git-dir>/claudex/stats.jsonl` (via
   `git rev-parse --git-dir`; create the `claudex/` directory if needed):

   ```json
   {"ts":"<UTC ISO-8601>","cmd":"verdict","both":<n>,"claude_only":<n>,"codex_only":<n>,"ruling":"SHIP|FIX FIRST|REDESIGN","outcome":"signed|interrupted|nothing-to-review"}
   ```

   Best-effort and silent on failure; under the git dir it can never be
   committed, and it must never affect the verdict itself.
