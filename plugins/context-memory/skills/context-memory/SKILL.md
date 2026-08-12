---
name: "context-memory"
description: >
  Saves and searches past Claude Code sessions so context, decisions, and
  code persist across conversations. Use when user says 'remember this',
  'save this session', 'recall', 'search past sessions', 'what did we
  discuss about', or 'find previous work on'. Do NOT use for general file
  storage, note-taking, or bookmark management.
license: "MIT"
compatibility: "Requires Python >= 3.8 with sqlite3 FTS5 support (included in standard library). MCP server requires Python >= 3.10. Claude Code CLI only."
allowed-tools: "Bash(python:*)"
metadata:
  author: "ErebusEnigma"
  version: "1.3.1"
---

# Context Memory Skill

Saves and searches past Claude Code sessions so context, decisions, and code persist across conversations.

## Trigger Phrases

Activate this skill when the user says:
- "remember this" / "save this session" / "store this for later"
- "recall" / "search past sessions"
- "what did we discuss about..."
- "find previous work on..."
- "look up past decisions about..."
- "context memory"

## Features

- **Cross-session memory** - Save and recall past work across Claude Code sessions
- **Structured AI summaries** - Rich summaries with decisions, problems solved, technologies, outcome
- **Full-text search** - FTS5 with Porter stemming for fast, fuzzy search
- **Two-tier retrieval** - Summary-ranked search (<10ms) + deep content fetch (<50ms)
- **Auto-save on exit** - Stop hook captures session context automatically
- **Pre-compact checkpoints** - Saves full conversation before context compaction
- **Web dashboard** - Full SPA with analytics (optional, requires flask)
- **MCP server** - Six tools for programmatic access (optional, requires Python >= 3.10)

## Installation

```bash
git clone https://github.com/ErebusEnigma/context-memory.git
cd context-memory
python install.py
```

## Commands

### /remember [note]
Save the current session with an optional annotation.

### /recall <query> [options]
Search past sessions.
- `--project`: Limit to current project
- `--detailed`: Include full message content and code snippets
- `--limit N`: Maximum results (default: 10)

## Source Repository

https://github.com/ErebusEnigma/context-memory
