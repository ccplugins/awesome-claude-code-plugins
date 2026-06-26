---
name: forkmind
description: >
  Use when debugging, comparing, or regression-testing LLM / agent calls — when
  the user wants to capture LLM traffic, see a conversation as a branchable DAG,
  fork an alternative prompt or model from a past turn, or pin good outputs as
  baselines to catch drift. ForkMind is local-first (no cloud, no account) and
  proxies any OpenAI-compatible API, defaulting to free Ollama models.
  Trigger: "debug this prompt", "compare two models", "branch from that turn",
  "why did the LLM change its answer", "regression test my prompt", "capture LLM
  calls", "forkmind".
---

# ForkMind

ForkMind treats AI context windows like a Git repo. It runs a local proxy that
records every LLM call into `.forkmind/` as a node in a DAG, serves a dashboard,
and lets you branch alternative prompts/models from any historical turn.

## When to reach for it

| Situation | Why ForkMind |
|---|---|
| "This prompt sometimes regresses — catch it" | Pin baselines, re-run, diff drift |
| "Compare llama3 vs gpt-4o on the same turn" | Fork the node, swap model, re-run |
| "Why did the agent change its answer?" | Inspect the DAG: request/response, tokens, lineage |
| "Capture all LLM traffic during this task" | Point client at the proxy; everything is logged |
| Agent needs to recall its own past attempts | ForkMind MCP server exposes the history |

Do NOT use for: production traffic logging at scale, hosted/cloud observability,
or non-LLM HTTP debugging.

## Run it

ForkMind runs straight from the git link — no npm registry needed:

```bash
# starts proxy + dashboard on :4500
npx github:medhovarsh/forkmind start
```

Then point any OpenAI-compatible client at the proxy:
- `baseURL: http://localhost:4500/v1`
- dashboard: `http://localhost:4500`

Free local default: install [Ollama](https://ollama.com), `ollama pull llama3`.
Any provider works (OpenAI, Anthropic, Groq, OpenRouter, Together, vLLM, LM Studio)
by passing that provider's base URL + key through the proxy.

## Core moves

- **Capture** — route calls through `:4500/v1`; each call becomes a DAG node.
- **Branch** — in the dashboard, "Fork from here" on any node → edit prompt /
  swap model / change params → re-run only that subtree.
- **Inspect** — node inspector shows request, response, tokens, provenance, and
  whether the response was streamed.
- **Regression test** — pin a known-good output as a baseline; re-run after a
  prompt tweak; ForkMind flags drift (wire into CI).

## MCP for agents

Installed as the Claude Code plugin, ForkMind's MCP server is wired up
automatically (`forkmind` server, launched via `npx … forkmind mcp`). An agent
can query its own history mid-task — recall previous attempts, trace lineage,
self-correct. No manual config needed.

Outside the plugin, add it to any MCP client by hand:

```json
{
  "mcpServers": {
    "forkmind": { "command": "npx", "args": ["-y", "github:medhovarsh/forkmind", "mcp"] }
  }
}
```

## Delegating heavy compares

For "compare model X vs Y" or "why did the answer change" tasks that would dump
big transcripts into context, spawn the **`forkmind-debugger`** subagent. It runs
the comparison in isolation and returns a compact verdict (winner, diff, drift),
not raw logs.

## Notes

- Everything is plain JSON on disk under `.forkmind/`. No database, no telemetry.
- Add `.forkmind/` to `.gitignore` (the repo already does for its own checkout).
- Full docs: https://github.com/Medhovarsh/forkmind#readme
