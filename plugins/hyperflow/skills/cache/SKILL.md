---
name: cache
description: Use when the user wants to view, search, add, edit, prune, archive, or clear hyperflow memory entries — phrases like "show memory", "search memory for X", "clear memory", "what does hyperflow remember about Y", or any `hyperflow: memory *` invocation.
---

# Cache

CRUD interface for `.hyperflow/memory/`. Full protocol: [memory-system.md](../hyperflow/memory-system.md).

## Storage

All operations target `.hyperflow/memory/` at the project root. Never modify source code files — if asked to "remember X about file Y", add a memory entry only, never edit Y.

## Subcommands

| Subcommand | Description |
|---|---|
| `show [tag]` | Print index or filter entries by tag |
| `search <query>` | Full-text search across all memory files |
| `add <category> <title>` | Append a new entry (prompts for details) |
| `edit <entry-id>` | Find entry by date+title slug and update in place |
| `prune` | Remove stale, superseded, and orphaned entries |
| `archive` | Move entries older than 30 days to cold storage |
| `clear` | Wipe all memory (with confirmation, recoverable) |
| `stats` | Counts, tier breakdown, tag frequency, oldest/newest |
| `migrate` | Import entries from legacy `~/.claude/hyperflow-memory.md` |
| `off` | Disable memory writes for this session |

## Subcommand Details

### `show [tag]`
No arg → print `index.md`. With tag → filter all files for matching entries.
Output table: `Date | Title | Tags | File | Tier`

### `search <query>`
grep/ripgrep across `learnings.md`, `decisions.md`, `pitfalls.md`, `patterns.md`, `conventions.md`.
Return `file:line` + snippet, ranked by relevance.

### `add <category> <title>`
Categories: `learning` `decision` `pitfall` `pattern` `convention`
Prompt via AskUserQuestion for: `what`, `why it matters`, `tags` (controlled vocab).
Append to the matching file using:
```
### [YYYY-MM-DD] <title>  `[tag1, tag2]`
**What:** ...
**Why it matters:** ...
**Evidence:** ...
```
Update `index.md` with the new row.

### `edit <entry-id>`
Locate by date+title slug. Show current value, prompt for new value, update in place.

### `prune`
Per [memory-system.md](../hyperflow/memory-system.md) pruning protocol:
- Remove `[SUPERSEDED]` entries older than 7 days
- Remove entries whose referenced files no longer exist (`test -f`)
- Archive entries unreferenced 90+ days to `.hyperflow/memory/archive/YYYY-MM.md`
Print summary of removed/archived counts.

### `archive`
Compress hot entries older than 30 days → `.hyperflow/memory/archive/YYYY-MM.md`.
Leave one-line summary in original file. Update `index.md` tier column.

### `clear`
Confirm via AskUserQuestion: "This wipes all memory for this project. Are you sure?"
If yes → move all content to `.hyperflow/memory/archive/cleared-<timestamp>.md`, then reset files to empty stubs.

### `stats`
Print: total entries, hot/warm/cold counts, tag frequency table, oldest and newest entry dates.

### `migrate`
Read `~/.claude/hyperflow-memory.md`, filter entries matching current project path.
Append matching entries to `learnings.md`. Leave legacy file untouched.
Print count of migrated entries.

### `off`
Print: "Memory writes disabled for this session." No files modified.

## Flow

1. Parse invocation to determine subcommand
2. If subcommand missing → list subcommands table above with one-line descriptions
3. Execute subcommand
4. Print structured result with counts/changes summary
