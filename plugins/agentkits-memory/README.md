# AgentKits Memory

Persistent memory system for AI coding assistants — saves decisions, patterns, errors, and context across sessions via MCP.

## Features

- **MCP Server** with 8 tools: `memory_save`, `memory_search`, `memory_timeline`, `memory_details`, `memory_recall`, `memory_list`, `memory_update`, `memory_delete`
- **Hybrid Search** combining SQLite FTS5 full-text search with vector embeddings
- **Session Management** with automatic summarization
- **Context Hooks** for SessionStart, UserPromptSubmit, PostToolUse, and Stop events
- **Web Viewer** for browsing memories visually
- **No Daemon** — single SQLite file, zero infrastructure

## Install

```bash
# Via Claude Code Plugin Marketplace
/plugin marketplace add agentkits-memory
/plugin install agentkits-memory@agentkits-memory

# Or via npm
npx @aitytech/agentkits-memory install
```

## Links

- **GitHub:** https://github.com/aitytech/agentkits-memory
- **npm:** https://www.npmjs.com/package/@aitytech/agentkits-memory
- **Homepage:** https://www.agentkits.net/memory
