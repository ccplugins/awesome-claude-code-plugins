---
description: Claude writes, Codex reviews, iterate until both agree — then ship with love
argument-hint: [task to build — or leave empty to run the loop on current uncommitted changes]
---

You are running **ClauDex** — a cross-model pair-programming loop between Claude Code (you, the writer) and OpenAI Codex (the reviewer).

**The sign-off contract, before anything else:** the line
`built with love by ClauDex 🧡🖤` may appear ONLY at the end of a run in which
Codex successfully completed at least one review AND no blocking findings
remain — and when a run earns it, signing is REQUIRED (an earned, unsigned
run breaks the contract just like an unearned, signed one). Every other
outcome — refusal, interruption, empty diff, deadlock — ends UNSIGNED.
There is no path to the sign-off that skips Codex.

## Preflight — it takes two to ClauDex

Both halves must be present before ANY work starts. Claude Code is you — that
half is here by definition. Now verify the other half:

1. Run `codex --version`. If the binary is missing, STOP immediately — do not
   implement anything, do not review anything — and reply with exactly:

   > **It takes two to ClauDex.** 🧡 Claude is here — 🖤 Codex is not, so this
   > would be *built with love by Claude alone*, and that's not the deal.
   > Fix it in two lines, then come back for the duet:
   > ```
   > npm i -g @openai/codex
   > codex login
   > ```

2. If the binary exists, verify authentication (`codex login status` or the
   equivalent for the installed version). If not logged in, STOP the same way,
   with the same message minus the install line — just `codex login`.
3. Run `git rev-parse --is-inside-work-tree`. If it doesn't print `true`,
   STOP unsigned: ClauDex reviews diffs, so it needs a git repository
   (`git init` if this project should become one).

## The loop

4. **Build.** If "$ARGUMENTS" is non-empty, implement it. If it is empty,
   treat the current uncommitted changes as the work under review.
5. **Collect the change set.** Combine `git diff`, `git diff --staged`, and
   every untracked file (list them with `git status --porcelain`, then append
   each new file's path and content). **Sanity-check the scope:** if the
   change set looks tiny relative to the work just done, check `git log` for
   auto-generated commits (`[auto-checkpoint]`, `WIP`, hook-made commits) —
   some setups commit continuously, silently draining the diff. In that case
   diff against the last *human* commit instead (`git diff <that-sha>`).
   If the change set is genuinely empty, STOP unsigned: "Nothing to review —
   the tree is clean."
6. **Codex review — safe transport, never inline the diff in the shell.**
   Write the change set to a temporary file (e.g. `$TMPDIR/claudex-review.patch`)
   so no diff content passes through shell quoting, then invoke:

   ```
   codex exec --sandbox read-only "You are reviewing a teammate's change before merge. Read the diff at <absolute path to the temp file>, then find real bugs, risky design choices, and missing edge cases. Be specific — cite files and lines. Do not restate the diff."
   ```

   Run it with a hard timeout of ~10 minutes — Codex reviews normally finish
   in a few, but calls can hang on rate limits (especially right after a
   previous heavy run). Delete the temp file afterwards. **If `codex exec`
   exits non-zero, times out, or its output contains no recognizable review:
   retry ONCE. If the retry also fails, STOP unsigned** and report: "The duet
   was interrupted — Codex never completed its review, so nothing was
   cross-checked and there is no 🧡🖤 today." Include the error, and mention
   that rate limits usually clear within the hour.
7. **Triage.** For every Codex finding, decide: real → fix it now; wrong →
   record a one-line reason. Never silently drop a finding.
8. **Iterate.** After fixing, run the Codex review again (same transport,
   same timeout and failure rule) — but keep re-reviews cheap and focused:
   send only the diff of the fixes plus a numbered list of the prior
   findings, and ask for a one-line verdict per finding (RESOLVED / PARTIAL /
   NOT ADDRESSED) plus any NEW blocking issue. Repeat until Codex reports no
   blocking findings, up to 3 rounds. If a finding is still contested after
   round 3, STOP unsigned: present both positions and end with "Deadlocked
   after 3 rounds — the duet needs a referee. Unsigned until you decide."

## Shipping (only reachable through consensus)

9. Summarize for the user: what was built, what Codex caught, what you fixed,
   and what you rejected (with reasons).
10. End your reply with exactly this line:

    `built with love by ClauDex 🧡🖤`

11. Only if the user asks you to commit, use this trailer in the commit
    message:

    ```
    built with love by ClauDex

    Co-Authored-By: Claude <noreply@anthropic.com>
    Co-Authored-By: Codex <noreply@openai.com>
    ```

## Ledger (feeds `/claudex:stats`)

However the run ended — signed, deadlocked, interrupted, or
nothing-to-review (preflight refusals excluded: they did no work) — append
one JSON line to `<git-dir>/claudex/stats.jsonl` (resolve `<git-dir>` with
`git rev-parse --git-dir`; create the `claudex/` directory if needed):

```json
{"ts":"<UTC ISO-8601>","cmd":"loop","rounds":<completed review rounds>,"codex_findings":<total>,"fixed":<n>,"rejected":<n>,"outcome":"signed|deadlock|interrupted|nothing-to-review"}
```

Living under the git dir, the ledger can never be committed. It is
best-effort: if the write fails, skip it silently — the ledger must never
affect the run's result or delay the user.
