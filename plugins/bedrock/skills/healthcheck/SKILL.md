---
name: healthcheck
description: >
  Read-only vault health diagnostic. Generates a report without modifying any files.
  Checks: graphify-out integrity, setup verification, orphan entities, dangling content,
  old content (>15 days). Safe to run at any frequency.
  Use when: "bedrock healthcheck", "bedrock-healthcheck", "vault health", "check vault",
  "vault status", "/bedrock:healthcheck".
user_invocable: true
allowed-tools: Bash, Read, Glob, Grep
---

# /bedrock:healthcheck — Vault Health Report

## Plugin Paths

Entity definitions and templates are in the plugin directory, not the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already injected automatically into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to diagnose. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name.

**Step 2 — Resolve vault path:**

1. **If `--vault <name>` was provided:**
   Read the vault registry at `<base_dir>/../../vaults.json`. Find the entry matching the name.
   If not found: error — "Vault `<name>` is not registered. Run `/bedrock:vaults` to see available vaults."
   If found: set `VAULT_PATH` to the entry's `path` value.

2. **If no `--vault` flag — CWD detection:**
   Read `<base_dir>/../../vaults.json`. Check if the current working directory is inside any registered vault path
   (CWD starts with a registered vault's absolute path). If multiple match, use the longest path (most specific).
   If found: set `VAULT_PATH` to the matching vault's `path`.

3. **If CWD detection fails — default vault:**
   From the registry, find the vault with `"default": true`.
   If found: set `VAULT_PATH` to the default vault's `path`.

4. **If no resolution:**
   Error — "No vault resolved. Available vaults:" followed by the registry listing.
   "Use `--vault <name>` to specify, or run `/bedrock:setup` to register a vault."

**Step 3 — Validate vault path:**
```bash
test -d "<VAULT_PATH>" && echo "exists" || echo "missing"
```
If missing: error — "Vault path `<VAULT_PATH>` does not exist on disk. Run `/bedrock:setup` to re-register."

**Step 4 — Read vault config:**
```bash
cat <VAULT_PATH>/.bedrock/config.json 2>/dev/null
```
Extract `language` and other relevant fields for use in later phases.

**From this point forward, ALL vault file operations use `<VAULT_PATH>` as the root.**
- Entity directories: `<VAULT_PATH>/actors/`, `<VAULT_PATH>/people/`, etc.
- Graphify output: `<VAULT_PATH>/graphify-out/`

---

## Overview

This skill produces a diagnostic report of vault health without modifying any files.
It scans the vault once, runs 5 checks against the scan data, and prints the results.

**You are a read-only agent.** You do NOT write files, commit, push, invoke other skills,
or spawn subagents. Your only output is the diagnostic report printed to the terminal.

### Five health checks

| # | Check | What it verifies |
|---|---|---|
| 1 | graphify-out | Graph.json exists, is valid, is fresh |
| 2 | Setup | Directories, templates, entity definitions, plugin manifest |
| 3 | Orphan entities | Entities with zero inbound wikilinks |
| 4 | Dangling content | Entities fully disconnected (no inbound, no outbound, no relations) |
| 5 | Old content | Entities with `updated_at` older than 15 days |

### Status values

Each check reports one of:
- **OK** — no issues found
- **WARN** — issues found (with details)
- **MISSING** — prerequisite not met (e.g., graphify-out absent)

---

## Phase 1 — Scan the Vault

Read all entity files once and store the data for use across all 5 checks.

### 1.1 Enumerate entity files

For each entity directory (`<VAULT_PATH>/actors/`, `<VAULT_PATH>/people/`, `<VAULT_PATH>/teams/`, `<VAULT_PATH>/concepts/`, `<VAULT_PATH>/topics/`, `<VAULT_PATH>/discussions/`, `<VAULT_PATH>/projects/`, `<VAULT_PATH>/fleeting/`):

1. List all `.md` files using Glob, **excluding `_template.md` and `_template_node.md`**
   - For actors: include both `<VAULT_PATH>/actors/*.md` (flat) and `<VAULT_PATH>/actors/*/*.md` (folder)
   - Include code entities: `<VAULT_PATH>/actors/*/nodes/*.md`
2. Record the directory and filename for each entity

### 1.2 Read entity data

For each entity file found in 1.1:

1. Read the file
2. Extract from frontmatter:
   - `type`
   - `name` (or derive from filename)
   - `aliases` (array)
   - `updated_at` (date string)
   - All frontmatter array fields that contain wikilinks (e.g., `actors`, `people`, `teams`, `related_to`, etc.)
3. Extract from body:
   - All wikilinks `[[target]]` (regex: `\[\[([^\]]+)\]\]`)
4. Compute:
   - `outbound_wikilinks`: union of all wikilinks from body + frontmatter arrays
   - `has_frontmatter_relations`: true if any frontmatter array field contains at least one wikilink value
   - `entity_slug`: the filename without extension (used as the canonical identifier)

**Output:** `vault_entities` map: `entity_slug → {type, name, aliases[], updated_at, outbound_wikilinks[], has_frontmatter_relations, file_path}`

Also collect: `all_entity_slugs` — set of all entity slugs in the vault (for resolving wikilinks).

---

## Phase 2 — Run Checks

### 2.1 Check 1 — graphify-out

1. Check if directory `<VAULT_PATH>/graphify-out/` exists:
   ```bash
   ls -d <VAULT_PATH>/graphify-out/ 2>/dev/null && echo "EXISTS" || echo "MISSING"
   ```

2. If MISSING:
   - Status: **MISSING**
   - Details: "graphify-out/ directory not found. Run `/bedrock:teach` on an actor repository to generate."
   - Skip remaining sub-checks.

3. If EXISTS, check `<VAULT_PATH>/graphify-out/graph.json`:
   ```bash
   test -f <VAULT_PATH>/graphify-out/graph.json && echo "EXISTS" || echo "MISSING"
   ```

4. If graph.json MISSING:
   - Status: **MISSING**
   - Details: "graph.json not found in graphify-out/. Run `/bedrock:teach` to generate."
   - Skip remaining sub-checks.

5. If graph.json EXISTS, validate and extract stats:
   ```bash
   python3 -c "
   import json, os, time
   from pathlib import Path

   g = json.loads(Path('<VAULT_PATH>/graphify-out/graph.json').read_text())
   nodes = g.get('nodes', [])
   code_nodes = [n for n in nodes if n.get('file_type') == 'code']
   mtime = os.path.getmtime('<VAULT_PATH>/graphify-out/graph.json')
   mod_date = time.strftime('%Y-%m-%d', time.localtime(mtime))
   days_old = (time.time() - mtime) / 86400

   print(f'total_nodes={len(nodes)}')
   print(f'code_nodes={len(code_nodes)}')
   print(f'mod_date={mod_date}')
   print(f'days_old={int(days_old)}')
   print(f'stale={\"yes\" if days_old > 30 else \"no\"}')
   " 2>/dev/null || echo "INVALID_JSON"
   ```

6. If INVALID_JSON:
   - Status: **WARN**
   - Details: "graph.json exists but is not valid JSON."

7. If valid:
   - If stale (>30 days): Status: **WARN**, Details: "Graph.json is stale (>30 days). Last updated: {mod_date}. Run `/bedrock:teach` or `/bedrock:sync` to update."
   - If fresh: Status: **OK**, Details: "{total_nodes} nodes ({code_nodes} code). Last updated: {mod_date}."

**Store:** `graphify_status`, `graphify_details`, `graphify_node_count`

### 2.2 Check 2 — Setup

Verify the vault structure and plugin dependencies.

#### 2.2.1 Entity directories

Check that each expected directory exists:
- `<VAULT_PATH>/actors/`, `<VAULT_PATH>/people/`, `<VAULT_PATH>/teams/`, `<VAULT_PATH>/concepts/`, `<VAULT_PATH>/topics/`, `<VAULT_PATH>/discussions/`, `<VAULT_PATH>/projects/`, `<VAULT_PATH>/fleeting/`

For each directory, check if `_template.md` exists inside it.

Record: list of missing directories, list of directories missing templates.

#### 2.2.2 Entity definitions

Check that entity definitions exist in the plugin directory:
```
<base_dir>/../../entities/
```

Expected files: `actor.md`, `person.md`, `team.md`, `concept.md`, `topic.md`, `discussion.md`, `project.md`, `fleeting.md`

Record: list of missing entity definitions.

#### 2.2.3 Plugin manifest

Check that `.claude-plugin/plugin.json` exists and is valid JSON:
```bash
python3 -c "import json; json.loads(open('.claude-plugin/plugin.json').read()); print('VALID')" 2>/dev/null || echo "INVALID"
```

Record: manifest status.

#### 2.2.4 Result

- If everything present: Status: **OK**, Details: "All directories, templates, definitions, and manifest verified."
- If issues found: Status: **WARN**, Details: list of missing items.

**Store:** `setup_status`, `setup_details`, `setup_issue_count`

### 2.3 Check 3 — Orphan entities

For each entity in `vault_entities`:

1. Count **inbound wikilinks**: how many OTHER entities reference this entity via `[[entity_slug]]`
   - Search: count how many entities in `vault_entities` have this entity's slug in their `outbound_wikilinks`
   - Also check for alias matches: if entity has `aliases`, check if any alias (converted to slug format) appears in other entities' outbound wikilinks
2. If inbound count = 0: mark as **orphan**

Exclude from orphan check:
- Templates (`_template.md`)
- The entity itself (self-links don't count)

**Store:** `orphan_entities[]` — list of `{entity_slug, type}`
**Aggregate:** `orphan_count_by_type` — map `type → count`

Result:
- If 0 orphans: Status: **OK**
- If orphans found: Status: **WARN**, Details: count per type + entity names

### 2.4 Check 4 — Dangling content

From the orphan list (Check 3), further filter for entities that are **fully disconnected**:

An entity is dangling if ALL three conditions are true:
1. **No inbound wikilinks** (already orphan from Check 3)
2. **No outbound wikilinks** in the body (entity's `outbound_wikilinks` is empty)
3. **No frontmatter relations** (entity's `has_frontmatter_relations` is false)

**Store:** `dangling_entities[]` — list of `{entity_slug, type}`

Result:
- If 0 dangling: Status: **OK**
- If dangling found: Status: **WARN**, Details: entity names

### 2.5 Check 5 — Old content

For each entity in `vault_entities`:

1. Read `updated_at` from the entity data
2. If `updated_at` is missing or cannot be parsed: skip (do not flag — missing metadata is a setup issue, not a staleness issue)
3. Calculate age in days: `current_date - updated_at`
4. If age > 15 days: mark as **old**

**Store:** `old_entities[]` — list of `{entity_slug, type, updated_at, age_days}`, sorted by `age_days` descending (oldest first)
**Aggregate:** `old_count_by_type` — map `type → count`

Result:
- If 0 old: Status: **OK**
- If old found: Status: **WARN**, Details: count per type, oldest entity with age

---

## Phase 3 — Generate Report

Print the full report to the terminal.

```markdown
## /bedrock:healthcheck — Report

| Check | Status | Count | Details |
|---|---|---|---|
| graphify-out | {graphify_status} | {node_count} nodes | {graphify_details} |
| Setup | {setup_status} | {setup_issue_count} issues | {setup_details} |
| Orphan entities | {orphan_status} | {orphan_count} orphans | {orphan_details} |
| Dangling content | {dangling_status} | {dangling_count} dangling | {dangling_details} |
| Old content (>15d) | {old_status} | {old_count} stale | {old_details} |
```

### Orphan details (if WARN)

```markdown
### Orphan Entities

| # | Entity | Type |
|---|---|---|
| 1 | [[entity-slug]] | actor |
| 2 | [[entity-slug]] | person |
| ... | ... | ... |

**By type:** actors: N, people: N, teams: N, ...
```

### Dangling details (if WARN)

```markdown
### Dangling Content (fully disconnected)

| # | Entity | Type |
|---|---|---|
| 1 | [[entity-slug]] | fleeting |
| ... | ... | ... |
```

### Old content details (if WARN)

```markdown
### Old Content (>15 days without update)

| # | Entity | Type | Last updated | Age |
|---|---|---|---|---|
| 1 | [[entity-slug]] | actor | 2026-03-01 | 45 days |
| 2 | [[entity-slug]] | topic | 2026-03-15 | 31 days |
| ... | ... | ... | ... | ... |

**By type:** actors: N, topics: N, ...
```

### Suggestions

Based on findings, append actionable suggestions:

- If orphan or dangling count > 0: "Run `/bedrock:compress` to detect and fix alignment issues (broken backlinks, missing entities)."
- If graphify-out is MISSING or stale: "Run `/bedrock:teach` on an actor repository to generate or update the graph."
- If old count > 0: "Review {N} stale entities for relevance. Consider updating or archiving."
- If setup has issues: "Run `/bedrock:setup` to initialize missing directories or templates."
- If all checks are OK: "Vault is healthy. No action needed."

---

## Error Handling

| Situation | Action |
|---|---|
| Empty vault (no entity files) | Report all checks as OK with 0 counts. "Vault is empty — no entities found." |
| Entity file cannot be read | Skip entity, do not fail the check. Note in report: "N entities skipped due to read errors." |
| Frontmatter cannot be parsed | Skip entity for frontmatter-dependent checks (updated_at, relations). Count as readable for wikilink checks. |
| graphify-out/graph.json is not valid JSON | Report as WARN for Check 1. Continue with other checks. |
| Plugin directory not accessible | Report as WARN for Check 2. Continue with other checks. |
| No `updated_at` field in entity | Skip for Check 5 (old content). Do not flag as old. |

---

## Critical Rules

| Rule | Detail |
|---|---|
| Read-only | NEVER use Write, Edit, Skill, or Agent tools. This skill only reads and reports. |
| No git operations | NEVER run git add, commit, push, pull, or any mutating git command. |
| No skill invocations | NEVER invoke /bedrock:compress, /bedrock:teach, /bedrock:preserve, or any other skill. Suggest them in text only. |
| Terminal output only | The report is printed to the terminal. No files are created or modified. |
| Single-pass scan | Phase 1 scans once. All 5 checks in Phase 2 use the same scan data. |
| Exclude templates | Always exclude `_template.md` and `_template_node.md` from entity counts and checks. |
| 15-day threshold | Old content is defined as `updated_at` > 15 days from current date. Hardcoded. |
| 30-day threshold | Stale graph is defined as graph.json modification date > 30 days. Hardcoded. |
| Bare wikilinks | Parse wikilinks as `[[name]]` only. Never path-qualified (`[[dir/name]]`). |
| Sensitive data | NEVER include credentials, tokens, passwords, PANs, CVVs in the report. |
| Vault resolution first | Resolve `VAULT_PATH` before any file operation — never assume CWD is the vault |
| All entity paths use `<VAULT_PATH>/` prefix | `<VAULT_PATH>/actors/`, not `actors/` |
