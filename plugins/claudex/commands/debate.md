---
description: The debate — Claude and Codex argue a design decision from opposite corners, you arbitrate
argument-hint: <the decision to debate, e.g. "Postgres vs SQLite for this app" or "should this service be split?">
---

You are running **ClauDex debate** — a structured argument between Claude Code
(you, 🧡) and OpenAI Codex (🖤) over a real design decision. Nobody writes
code here; the deliverable is a decision brief the user can arbitrate.

**Sign-off contract:** the closing line `argued with love by ClauDex 🧡🖤`
appears ONLY when Codex delivered both its opening position and its rebuttal —
and it is REQUIRED then (an earned, unsigned run breaks the contract just like
an unearned, signed one). Refusal, interruption, or an empty motion all end
UNSIGNED. The verb is "argued" — this command builds nothing and reviews no
diff; only the `/claudex` loop signs "built", only reviews sign "reviewed".

## Preflight — it takes two to ClauDex

1. Run `codex --version` and check auth (`codex login status` or the
   equivalent for the installed version). If either fails, STOP before any
   framing or arguing and reply with exactly:

   > **It takes two to ClauDex.** 🧡 Claude is here — 🖤 Codex is not, and a
   > one-model debate is just a monologue. Fix it in two lines, then come
   > back for the argument:
   > ```
   > npm i -g @openai/codex
   > codex login
   > ```

2. **The motion.** "$ARGUMENTS" must state a decision. If it is empty, STOP
   unsigned and ask for one, with two examples of a good motion — a decision
   with real options ("Postgres vs SQLite for this app"), not a topic
   ("databases").

(No git preflight — a debate needs a question, not a diff. If you happen to
be inside a relevant repo, the codebase is context, not a requirement.)

## The debate

1. **Frame the motion.** Sharpen "$ARGUMENTS" into a decision question with
   2–3 concrete options. If the user named a topic rather than a choice,
   propose the decision you believe they meant and say what you assumed.
   Gather grounding: if the current repo is relevant, read the few files
   that matter and note the hard constraints (existing stack, scale hints,
   deploy target). Compress all of it into a short written brief — motion,
   options, constraints. Keep it under a page; a debate is not a survey.
2. **Claude's opening (yours).** Pick the option you would actually choose
   and argue it: your three strongest arguments, the biggest risk of your
   own choice (steelman honesty), and what evidence would change your mind.
   Write it BEFORE consulting Codex, so your position is genuinely
   independent.
3. **Codex's opening — safe transport.** Write the brief from step 1 to a
   temp file (e.g. `$TMPDIR/claudex-debate.md`) — the motion, options, and
   constraints only, NOT your position; never inline content in the shell
   command. Then, with a hard timeout of ~10 minutes:

   ```
   codex exec --sandbox read-only "You are debating a design decision against a rival model. Read the brief at <absolute temp file path>. Take a definite position: which option you would choose and why — your three strongest arguments, the biggest risk of your own choice, and what evidence would change your mind. Argue to win, but concede what is true."
   ```

   If `codex exec` exits non-zero, times out, or returns no recognizable
   position: retry ONCE. If the retry also fails, delete the temp file and
   STOP unsigned: "The duet was interrupted — Codex never took the floor,
   so there was no debate and there is no 🧡🖤 today." Include the error,
   and note that rate limits usually clear within the hour.
4. **The clash — one rebuttal round each, kept cheap.** Append both openings
   to the temp file, labeled, then ask Codex for a terse rebuttal (quota
   discipline — same spirit as the loop's focused re-reviews):

   ```
   codex exec --sandbox read-only "Read the debate so far at <absolute temp file path>. Rebut your rival's opening in at most five bullets: what they get wrong, what you concede, and your final recommendation in one line."
   ```

   Same timeout and one-retry rule; if the rebuttal fails after the retry,
   STOP unsigned the same way — never present a half-argued debate as done.
   Then write your own rebuttal of Codex's opening under the same rules:
   five bullets max, concede what is true, final recommendation in one line.
   Delete the temp file afterwards.
5. **The decision brief.** Merge the debate into:
   - **The motion** — one line.
   - 🤝 **Common ground** — what both models agree on; treat it as settled.
   - 🧡 **Claude's corner** — position, plus the strongest argument that
     survived rebuttal.
   - 🖤 **Codex's corner** — same.
   - **The crux** — the ONE disagreement that actually decides it, phrased
     as a question only the user can answer (their budget, team, timeline,
     appetite for risk).
6. **The ruling.**
   - If both final recommendations landed on the same option, declare
     **CONSENSUS — <option>**: two rivals who tried to win and converged
     anyway is the strongest signal this process produces.
   - Otherwise declare **SPLIT DECISION** and end with "You arbitrate." —
     do not break the tie in the ruling; your vote is already on the record
     in Claude's corner.
7. Close with exactly this line:

   `argued with love by ClauDex 🧡🖤`

8. **Ledger (feeds `/claudex:stats`).** Only if inside a git repo (debates
   don't require one): however the run ended — signed or interrupted
   (preflight refusals and empty motions excluded) — append one JSON line
   to `<git-dir>/claudex/stats.jsonl` (via `git rev-parse --git-dir`;
   create the `claudex/` directory if needed):

   ```json
   {"ts":"<UTC ISO-8601>","cmd":"debate","ruling":"CONSENSUS|SPLIT","outcome":"signed|interrupted"}
   ```

   Best-effort and silent on failure; it must never affect the debate.
