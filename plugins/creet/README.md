# Creet

**Never wonder which plugin to use again.**

Creet is a skill navigator for Claude Code by [Creeta](https://www.creeta.com). It scans your installed plugins, finds the best skill for your task, and runs it — all from a single command.

Works with **any** combination of plugins. No hardcoded dependencies.

## The Problem

You installed 10+ plugins. That's 50+ slash commands, MCP tools, and LSP servers. You can't remember them all, and you don't know which combination works best for your task.

## The Solution

```
You: /c build a dashboard with auth

Creet — Skill Scan
| #  | Name          | Type  | Plugin    | Domain   |
|----|---------------|-------|-----------|----------|
| 1  | /auth-setup   | Skill | plugin-a  | Auth     |
| 2  | /ui-builder   | Skill | plugin-b  | Frontend |
| 3  | context7      | MCP   | context7  | Docs     |
| 4  | typescript    | LSP   | ts-tools  | LSP      |
| .. | ...           | ...   | ...       | ...      |

Total: 30 skills, 3 MCP tools, 2 LSP servers from 10 plugins

Creet — Recommendation

> "Build a dashboard with auth"

Which skill should I run?
  /auth-setup (Recommended) — Auth logic for your app
  /ui-builder — Dashboard UI components
  Other
```

Select a skill and Creet runs it immediately.

## Installation

### Option 1: Load directly from GitHub (Recommended)

Clone the repo and load it with `--plugin-dir`:

```bash
git clone https://github.com/Creeta-creet/creet.git
claude --plugin-dir ./creet
```

Then use `/creet:c` inside Claude Code.

### Option 2: Copy to your commands (Quick setup)

Copy the skill file to your user-level commands for a shorter `/c` command:

```bash
mkdir -p ~/.claude/commands
curl -o ~/.claude/commands/c.md https://raw.githubusercontent.com/Creeta-creet/creet/main/skills/c/SKILL.md
```

Restart Claude Code, then use `/c` directly.

### Option 3: Load as a local plugin

If you already cloned the repo:

```bash
claude --plugin-dir /path/to/creet
```

## Usage

```
/c <what you want to do>
```

### `/c` — Navigate to the best skill

```
/c <what you want to do>
```

| You type | What happens |
| --- | --- |
| `/c build a login page` | Recommends your best auth + frontend skill |
| `/c review my PR` | Recommends your code review skill |
| `/c deploy to production` | Recommends your deployment skill |
| `/c` (no args) | Shows full skill inventory |

### `/cc` — Run all relevant skills in parallel

```
/cc <what you want to do>
```

Instead of picking one, `/cc` finds **every** relevant skill and runs them all simultaneously as independent agents, then synthesizes the results.

| You type | What happens |
| --- | --- |
| `/cc build a dashboard with auth` | Runs `/auth`, `/ui-builder`, `/code-review` in parallel — one unified output |
| `/cc review this codebase` | Runs every review-related skill at once |
| `/cc` (no args) | Shows full skill inventory (same as `/c`) |

**When to use which:**

| | `/c` | `/cc` |
|---|---|---|
| Goal | Best single skill | All relevant skills |
| Output | One skill's result | Synthesized multi-agent output |
| Speed | Fast | Slower (parallel agents) |
| Use when | You know roughly what you need | You want comprehensive coverage |

Creet dynamically matches against whatever plugins you have installed.

## How It Works

### `/c` — Single skill navigator
1. **Scan** — Detects all installed skills, MCP tools, and LSP servers
2. **Recommend** — Matches your request to the best skill(s) via AskUserQuestion
3. **Execute** — Runs the chosen skill immediately
4. **Discover** — If no match, suggests installable plugins from registry

### `/cc` — Multi-agent parallel engine
1. **Scan** — Same as `/c`
2. **Multi-Match** — Selects ALL relevant skills (no cap)
3. **Execute** — Launches every matched skill as a parallel Task agent simultaneously
4. **Synthesize** — Collects all outputs and produces a unified result with agreements, conflicts, and next steps

## Scanner

Creet's skill scanner automatically detects all plugin types:

| Type | Detection | What it finds |
| --- | --- | --- |
| **Skill** | `skills/*/SKILL.md` and `commands/*.md` | Slash commands from any plugin |
| **MCP** | `.mcp.json` (direct and wrapper formats) | MCP tool servers |
| **LSP** | `lspServers` in `plugin.json` | Language servers |
| **Hybrid** | Skill + MCP in same plugin | Plugins with both types |

### Scanner Details

- Scans `~/.claude/plugins/cache/` for all installed plugins
- Supports YAML frontmatter and markdown table formats for skill metadata
- Extracts trigger keywords (multi-line, 8 languages)
- Auto-detects domain from 24 pattern categories
- Hybrid plugins are marked with `hasMcp` flag

### Dynamic Keyword Matching

Creet builds its keyword map **dynamically** from scanner results. Each skill's trigger keywords become the matching dictionary. No hardcoded skill-to-keyword mappings — if a plugin declares triggers, Creet uses them automatically.

## Features

- Auto-scans all installed plugins at session start via SessionStart hook
- Detects Skills, MCP tools, and LSP servers from plugin cache
- **Zero hardcoded dependencies** — works with any plugin combination
- Dynamic keyword matching from scanner-extracted triggers
- Uses AskUserQuestion for interactive skill selection
- Compares overlapping skills and explains the difference
- Recommends execution order for multi-skill workflows
- Max 5 recommendations (no overwhelm)
- Responds in your language (EN, KO, JA, ZH, ES, FR, DE, IT)
- Session memory — remembers your most used skills across sessions
- Plugin Discovery — suggests installable plugins when no match found

## Architecture

```
creet/
  .claude-plugin/
    plugin.json          # Plugin manifest
    marketplace.json     # Marketplace registration
  skills/c/
    SKILL.md             # /c skill — navigate to best skill
  skills/cc/
    SKILL.md             # /cc skill — run all relevant skills in parallel
  hooks/
    hooks.json           # Hook registration (SessionStart, UserPromptSubmit)
    session-start.js     # Session startup: scan + cache + context injection
  scripts/
    user-prompt-handler.js  # Per-message keyword matching (from cache)
  lib/
    skill-scanner.js     # Core scanner (Skills, MCP, LSP detection)
    keyword-matcher.js   # Dynamic keyword matching (no hardcoded maps)
    memory-store.js      # Session memory persistence
    plugin-registry.js   # Known plugins registry for discovery
  creet.config.json      # Configuration
```

## Configuration

`creet.config.json`:

```json
{
  "version": "1.3.0",
  "autoRecommend": true,
  "showReport": true,
  "minMatchScore": 5,
  "memoryPath": null,
  "customKeywords": []
}
```

| Option | Default | Description |
| --- | --- | --- |
| `autoRecommend` | `true` | Show skill suggestions in responses |
| `showReport` | `true` | Show Creet tip line when skill matches |
| `minMatchScore` | `5` | Minimum keyword match score for recommendations |
| `memoryPath` | `null` | Custom path for memory file (null = plugin root) |
| `customKeywords` | `[]` | Additional keyword-to-skill mappings |

## Building Custom Skills with Creet

Creet is a navigator, but you can build your own skills that take advantage of the same multi-agent patterns. Here's an example:

**`design-council`** — A skill that summons all installed design agents in parallel, collects their perspectives, and synthesizes a unified design decision.

```markdown
---
name: design-council
description: "Summons all installed design agents in parallel and synthesizes the optimal design decision."
user-invocable: true
---

## Phase 1 — Scan active design agents
Use Glob to find installed agents under ~/.claude/plugins/cache/.

## Phase 2 — Parallel deliberation
Launch each agent via Task tool simultaneously.
Each agent analyzes the task from their domain perspective.

## Phase 3 — Synthesis
Collect all agent outputs and produce a unified recommendation.
```

This pattern works for any domain: security councils, code review boards, architecture committees. Creet's scanner will automatically detect and list any such skill you install.

## Requirements

- Claude Code v1.0.33+
- 2+ plugins installed (otherwise you don't need a navigator)

## License

MIT
