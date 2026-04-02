---
allowed-tools: Bash(bash:*), Bash(python3:*), Bash(open:*)
description: Show all installed skills, plugins, MCP servers, commands, and hooks in a browser dashboard
---

## Your Task

Inspect the current Claude Code environment and display a browser-based dashboard showing all installed components.

The dashboard is scope-aware (user / project / local) and covers:
- **Skills** — installed slash-command skills
- **Plugins** — active Claude Code plugins
- **MCP Servers** — configured Model Context Protocol servers
- **Commands** — registered slash commands
- **Hooks** — configured lifecycle hooks

### How It Works

1. Scan `~/.claude/` and project-level `.claude/` directories
2. Generate a self-contained HTML dashboard (no external dependencies)
3. Open it in the default browser

### Source

GitHub: [howardpen9/cc-inspect](https://github.com/howardpen9/cc-inspect)
