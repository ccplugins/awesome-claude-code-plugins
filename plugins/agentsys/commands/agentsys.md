---
description: Agent runtime and orchestration system — 12 plugins, 41 agents, 27 skills for task-to-production workflows
author: Avi Fenesh
author-url: https://github.com/avifenesh
version: 5.0.0
---

# AgentSys

Agent runtime and orchestration system for Claude Code, OpenCode, and Codex CLI.

Install the full package for all plugins, agents, and skills:

```bash
npm install -g agentsys
agentsys
```

Or install directly as a Claude Code plugin:

```bash
/plugin install agentsys
```

## What's Included

**12 plugins, 41 agents (31 file-based + 10 role-based), 27 skills**

### Core Workflow
- `/next-task` — Master workflow orchestrator: task discovery, exploration, planning, implementation, review, and delivery
- `/ship` — PR creation, CI monitoring, and merge automation

### Code Quality
- `/enhance` — Run 9 enhancement analyzers across plugins, agents, docs, prompts, and hooks
- `/audit-project` — Multi-agent code review with 10 specialized agents
- `/deslop` — Detect and clean AI slop patterns

### Analysis
- `/perf` — Performance investigation with baseline, benchmark, profile, and theory-testing agents
- `/repo-map` — AST-based repository mapping
- `/drift-detect` — Compare planned work against actual implementation

### Utilities
- `/sync-docs` — Keep documentation in sync with code
- `/learn` — Research topics online and create learning guides with RAG index
- `/agnix` — Lint agent configurations (SKILL.md, CLAUDE.md, hooks, MCP)
- `/consult` — Cross-tool AI consultation

## Links

- GitHub: https://github.com/avifenesh/agentsys
- npm: https://www.npmjs.com/package/agentsys
- License: MIT
