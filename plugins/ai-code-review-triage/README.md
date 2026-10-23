# ai-code-review-triage

Review AI-written pull requests as three separate jobs instead of one line-by-line read:

1. **Catch bugs**: a fresh-context sub-agent reviews the diff independently; findings are CONFIRMED or PLAUSIBLE depending on whether they reproduce.
2. **Align context**: old → new → unit for every changed constant, git history for prior reverts, callers, requirement match.
3. **Own the sign-off**: explain it, detect it, undo it, and state what was verified in the approval.

Triggers on requests like "review this AI-generated PR" or "can this diff be merged".

Source, docs and a worked example: https://github.com/laulauraluo/ai-code-review-triage (MIT)
