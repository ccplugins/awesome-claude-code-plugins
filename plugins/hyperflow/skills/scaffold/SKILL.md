---
name: scaffold
description: Use when starting hyperflow in a new project, re-initializing analysis, refreshing `.hyperflow/` cache, or installing multi-tool auto-detection shims (AGENTS.md, Cursor rules, GEMINI.md, CLAUDE.md). Trigger phrases — "init hyperflow", "set up hyperflow", "refresh hyperflow", "install hyperflow shims". Standalone setup; does **not** auto-chain into the feature flow.
---

# Scaffold

One-shot project setup. Analyzes the codebase, builds the `.hyperflow/` cache, seeds the memory skeleton, and optionally installs detection shims for other AI tools. Does not start the spec → scope → dispatch chain — invoke `/hyperflow:spec` (or `/hyperflow:scope`) when you're ready for that.

## Step 1 — Analysis Cache

Check for `.hyperflow/` at project root.

**If absent — dispatch parallel searchers (single message, six Agent calls):**

| Label | File generated | Discovers |
|---|---|---|
| `Searcher — analyzing tech stack` | `profile.md` | Name, language, framework, build commands |
| `Searcher — mapping folder structure` | `architecture.md` | Dirs, patterns, routing, data flow |
| `Searcher — extracting conventions` | `conventions.md` | Naming, style, linting rules |
| `Searcher — scanning dependencies` | `dependencies.md` | UI lib, state, data fetching, DB, auth |
| `Searcher — auditing test setup` | `testing.md` | Runner, E2E, patterns, commands |
| `Searcher — reading git workflow` | `git-workflow.md` | Branches, commits, CI/CD, PR conventions |

See [project-analysis.md](../hyperflow/project-analysis.md) for what each file captures.

**If present — staleness check:**
Compute SHA256 of tracked config files, compare against `.hyperflow/.checksums`. Refresh only stale files. Print `Refreshing — <comma-separated list of stale files>`.

**After analysis:**
- Write `.hyperflow/.checksums` (SHA256 of `package.json`, `tsconfig.json`, eslint/biome config, etc.)
- Append to `.gitignore` if `.hyperflow/` is not already excluded

## Step 2 — Memory Skeleton

Create `.hyperflow/memory/` if absent:

```
.hyperflow/memory/
├── index.md
├── learnings.md
├── decisions.md
├── pitfalls.md
├── patterns.md
├── conventions.md
└── archive/.gitkeep
```

**Migration:** If `~/.claude/hyperflow-memory.md` exists, migrate entries matching the current project path into the appropriate memory files. Tag migrated entries `[migrated]`.

## Step 3 — Multi-Tool Shims

Offer to run `scripts/setup-detection.sh --tools all` to generate AGENTS.md, Cursor rules, GEMINI.md, and CLAUDE.md.

Flags — `--tools <all|agents|cursor|gemini|claude>`, `--force`, `--dry-run`.

Default — `--tools all`. Ask once via `AskUserQuestion` if the user wants to skip any tool.

## Step 4 — Summary

Print what was created, skipped, and migrated (elegant style, no icons):

```
Hyperflow init complete
  Created   .hyperflow/{profile,architecture,conventions,dependencies,testing,git-workflow}.md
  Created   .hyperflow/.checksums
  Created   .hyperflow/memory/{index,learnings,decisions,pitfalls,patterns,conventions}.md
  Skipped   .gitignore entry — already present
  Migrated  3 entries from ~/.claude/hyperflow-memory.md
  Shims     AGENTS.md, .cursor/rules, GEMINI.md, CLAUDE.md
```

## Hand-off

This skill **does not** auto-chain. Init is project setup, not feature work. When the user wants to start a feature, they invoke `/hyperflow:spec` (for ambiguous scope) or `/hyperflow:scope` (for clear specs).

## Doctrine

Full rules in [DOCTRINE.md](../hyperflow/DOCTRINE.md). Output style in [output-style.md](../hyperflow/output-style.md).
