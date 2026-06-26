---
description: Start ForkMind or branch/inspect/regression-test an LLM call
---

Invoke the `forkmind` skill. Based on `$ARGUMENTS`:

- no args or `start` → tell the user how to launch ForkMind
  (`npx github:medhovarsh/forkmind start`, proxy + dashboard on :4500) and how
  to point their OpenAI-compatible client at `http://localhost:4500/v1`.
- `branch` / `fork` → explain forking an alternative prompt or model from a
  historical node in the dashboard.
- `test` / `regression` → explain pinning baselines and catching drift in CI.
- `mcp` → show the MCP server config so an agent can query its own history.

Keep it actionable: give the exact command(s) for what the user asked.
