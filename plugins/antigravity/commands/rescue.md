---
description: Delegate a coding, debugging or implementation task to the Antigravity CLI (agy) subagent
argument-hint: "[--background] [--resume|--fresh] <what agy should do>"
context: fork
allowed-tools: Bash, Write
---

Route this request to the `antigravity:agy-rescue` subagent in MODE: rescue.

Raw user request:
$ARGUMENTS

Routing rules:

- If the request contains `--background`, invoke the subagent with `run_in_background: true`. Use this when the user phrasing suggests a long-running task ("investigate", "refactor the whole module", "write tests for everything in X") and they explicitly opted in. Strip the flag.
- If the request includes `--resume`, set `RESUME: true` in the header you pass to the subagent.
- If the request includes `--fresh`, set `RESUME: false`.
- If neither flag is present and the user phrasing sounds like a follow-up ("continue", "keep going", "resume", "apply the first fix"), set `RESUME: true`. Otherwise `RESUME: false`.
- Strip the routing flags (`--background`, `--resume`, `--fresh`) from the user text before forwarding.

Pass this header block to the subagent followed by the cleaned user text:

```
MODE: rescue
INTENSITY:
MODEL:
RESUME: <true|false>
WRITE_FILE:
USER_TEXT:
<cleaned user request>
```

> **Note**: `--model` was rejected by `agy` 1.0.0/1.0.1 but is accepted again in **agy 1.0.5+**. This plugin defaults to omitting it (cross-version-safe — `agy` uses its configured default, typically Gemini 3.5 Flash "Medium"). The `MODEL:` header field is passed through to the subagent, which only forwards `--model` when set AND the local `agy --version` is ≥ 1.0.5; otherwise it's ignored.

Operating rules:

- The subagent is a thin forwarder. It returns agy's stdout verbatim.
- Return that stdout to the user as-is. Do not add commentary before or after.
- If agy reports it is missing or unauthenticated, tell the user to run `/agy:setup`.
