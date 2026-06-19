---
description: Send the current git diff to Antigravity (agy) for code review. Optional focus text to steer the review.
argument-hint: "[--background] [focus text]"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: review.

Raw user request:
$ARGUMENTS

Routing rules:

- If the request contains `--background`, invoke the subagent with `run_in_background: true`. Strip the flag.
- Capture the current git diff BEFORE delegating. Use ONE Bash call with this exact fallback chain (do not invent your own — `git diff HEAD` first because it includes committed-but-not-pushed work too):

  ```bash
  set -e
  REPO_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"
  DIFF_FILE="$(mktemp -t agy-review-XXXXXX.diff 2>/dev/null || mktemp)"
  git -C "$REPO_DIR" diff HEAD > "$DIFF_FILE" 2>/dev/null || true
  if [ ! -s "$DIFF_FILE" ]; then
    git -C "$REPO_DIR" diff > "$DIFF_FILE" 2>/dev/null || true
  fi
  if [ ! -s "$DIFF_FILE" ]; then
    rm -f "$DIFF_FILE"
    echo "NO_DIFF"
  else
    echo "DIFF_FILE=$DIFF_FILE"
    wc -l < "$DIFF_FILE"
  fi
  ```

- If the Bash output is `NO_DIFF`, tell the user "no git diff found in this repo — stage or make changes first" and stop. Do NOT invoke the subagent.
- Anything left in the user text after stripping `--background` is the focus text (may be empty). Default focus if empty: "review for correctness, edge cases, security issues, and style".

Pass this header block to the subagent followed by the focus text:

```
MODE: review
INTENSITY:
MODEL:
RESUME: false
WRITE_FILE:
FOCUS: <focus text or default>
DIFF_FILE: <absolute path captured above>
USER_TEXT:
```

Operating rules:

- The subagent reads `DIFF_FILE`, builds a review prompt embedding the diff + focus, invokes agy via the write_file workaround (bug #76), and returns the review verbatim.
- Present agy's response as-is. No paraphrase.
- If agy reports missing/unauthenticated, tell the user to run `/agy:setup`.
- After delegating, leave the temp `DIFF_FILE` alone — the subagent owns its lifecycle (it cleans up on success).
