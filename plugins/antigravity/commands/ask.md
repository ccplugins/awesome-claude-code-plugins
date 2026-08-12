---
description: One-shot prompt to Antigravity (agy) — quick question, returns response verbatim. No file persistence to docs/.
argument-hint: "[--background] <prompt>"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: ask.

Raw user request:
$ARGUMENTS

Routing rules:

- If the request contains `--background`, invoke the subagent with `run_in_background: true`. Strip the flag from the forwarded prompt.
- Otherwise run the subagent in the foreground.
- What remains after stripping `--background` IS the prompt. Trim whitespace.

Pass this header block to the subagent followed by the prompt:

```
MODE: ask
INTENSITY:
MODEL:
RESUME: false
WRITE_FILE:
USER_TEXT:
<cleaned prompt>
```

Operating rules:

- The subagent wraps the prompt with a `write_file` instruction (bug #76 workaround — see https://github.com/google-antigravity/antigravity-cli/issues/76). Agy writes the answer to a temp file, the subagent reads it back, returns the content verbatim.
- Present the response as-is. No commentary, no paraphrase.
- If the user did not supply a prompt, ask once: "What do you want to ask Antigravity?"
- If agy reports it is missing or unauthenticated, tell the user to run `/agy:setup`.
- For multi-step or long-running work, suggest `/agy:rescue` instead (carries the same write-to-file workaround but with a longer timeout and the option to resume conversations).
