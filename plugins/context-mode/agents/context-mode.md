# Context Mode

An MCP server that processes large outputs in sandboxed subprocesses instead of dumping raw data into the context window. Returns only concise summaries — same analysis, up to 98% less context usage.

## Problem

Large command outputs (logs, API responses, Playwright snapshots, git history) flood the context window with hundreds of kilobytes of raw data, burning tokens and degrading session quality.

## Solution

Context Mode intercepts these outputs, processes them in isolated subprocesses with 10 language runtimes, and returns structured summaries. A SQLite FTS5 knowledge base with BM25 ranking stores indexed content for later retrieval.

## Performance

| Operation | Raw Output | With Context Mode | Savings |
|---|---|---|---|
| Playwright snapshot | 56.2 KB | 299 B | 99% |
| GitHub Issues (20) | 58.9 KB | 1.1 KB | 98% |
| Access log (500 req) | 45.1 KB | 155 B | 100% |
| Git log (153 commits) | 11.6 KB | 107 B | 99% |

## MCP Tools

- `execute` — Run code in a sandboxed subprocess and return a summary
- `execute_file` — Execute a file in a sandboxed subprocess
- `index` — Index content into the SQLite FTS5 knowledge base
- `search` — Search indexed content with BM25 ranking
- `fetch_and_index` — Fetch a URL, process it, and index the result

## Supported Runtimes

JavaScript, TypeScript, Python, Ruby, PHP, Perl, Lua, R, jq, Shell (bash/zsh)

## Authenticated CLI Passthrough

Supports `gh`, `aws`, `gcloud`, `kubectl`, `docker`, and other CLI tools with credential passthrough.

## Install

```bash
claude mcp add context-mode -- npx -y context-mode
```

## Links

- GitHub: https://github.com/mksglu/claude-context-mode
- npm: https://www.npmjs.com/package/context-mode
