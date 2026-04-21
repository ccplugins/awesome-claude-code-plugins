---
name: preserve
description: >
  Single write point for the vault. Centralizes entity detection, textual matching,
  entity creation/update, and bidirectional linking. Accepts structured input
  (list of entities), free-form input (text, meeting notes, session context),
  or graphify output (graph.json + obsidian markdown from /graphify pipeline).
  Use when: "bedrock preserve", "bedrock-preserve", "save to vault", "record in vault", "/bedrock:preserve",
  or when another skill (e.g., /bedrock:teach) needs to persist entities in the vault.
user_invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, mcp__plugin_github_github__*, mcp__plugin_atlassian_atlassian__*
---

# /bedrock:preserve — Single Write Point for the Vault

## Plugin Paths

Entity definitions and templates are in the plugin directory, not in the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already injected automatically into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to operate on. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name and remove it from the arguments before further parsing.

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
Extract `language`, `git.strategy`, and other relevant fields for use in later phases.

**From this point forward, ALL vault file operations use `<VAULT_PATH>` as the root.**
- Entity directories: `<VAULT_PATH>/actors/`, `<VAULT_PATH>/people/`, etc.
- Vault config: `<VAULT_PATH>/.bedrock/config.json`
- Git operations: `git -C <VAULT_PATH> <command>`

---

## Overview

This skill centralizes ALL write logic for the vault. It receives input (structured, free-form,
or graphify output), identifies entities, correlates with the existing vault, proposes changes
to the user, and executes after confirmation. It is the only path to create or update entities in the vault (except `/sync-people`
which handles people/teams via GitHub API).

**You are an execution agent.** Follow the phases below in order, without skipping steps.

---

## Phase 0 — Pre-Write Setup

Two pre-flight steps run before any input parsing: synchronize the vault with its remote, then (when applicable) merge an incoming graphify output directory into the vault's cumulative `graphify-out/`.

### 0.1 Vault Sync

Execute:
```bash
git -C <VAULT_PATH> pull --rebase origin main
```

If the pull fails:
- No remote configured: warn "No remote configured. Working locally." and proceed.
- Pull conflict: `git -C <VAULT_PATH> rebase --abort` and warn the user. DO NOT proceed without resolving.
- Otherwise: proceed.

### 0.2 Merge Incoming Graphify Output

**When this runs:** Only when the skill was invoked with a `graphify_output_path` argument pointing at a graphify output directory (e.g., `/bedrock:teach` passes `$TEACH_TMP/graphify-out-new/`). Free-form text input and structured entity-list input skip this sub-phase entirely.

**Skip condition (backward compat):** If the input's `graphify_output_path` resolves to the same absolute path as `<VAULT_PATH>/graphify-out/`, skip this sub-phase. Legacy callers (and `/bedrock:sync` in its current form) point at the vault's own output directory — there is nothing to merge. Use `realpath` (or equivalent) to compare:

```bash
incoming_real=$(cd "<graphify_output_path>" 2>/dev/null && pwd -P)
vault_real=$(cd "<VAULT_PATH>/graphify-out" 2>/dev/null && pwd -P)
if [ "$incoming_real" = "$vault_real" ]; then
  echo "Phase 0.2: graphify_output_path already points at the vault — skipping merge."
  # proceed to Phase 1 with graphify_output_path unchanged
fi
```

**Skip condition (no graphify input):** If the input is free-form text, structured entity list, or otherwise does not include `graphify_output_path`, skip.

---

**Step 1 — Validate incoming directory.** Verify that `<graphify_output_path>/graph.json` exists, is non-empty, and parses as valid JSON. If invalid, abort with a clear error and do NOT mutate the vault:

```bash
if [ ! -s "<graphify_output_path>/graph.json" ]; then
  echo "ERROR: graph.json missing or empty in <graphify_output_path>. Aborting before vault mutation."
  exit 1
fi
python3 -c "import json,sys; json.load(open('<graphify_output_path>/graph.json'))" || { echo "ERROR: graph.json is not valid JSON."; exit 1; }
```

**Step 2 — First-ingestion edge case.** If `<VAULT_PATH>/graphify-out/` does not exist, promote the incoming directory wholesale (no re-merge pass) and record stats, then skip to Step 7:

```bash
if [ ! -d "<VAULT_PATH>/graphify-out" ]; then
  mkdir -p "<VAULT_PATH>"
  cp -R "<graphify_output_path>" "<VAULT_PATH>/graphify-out"
  echo "Phase 0.2: first ingestion — promoted incoming graphify output to <VAULT_PATH>/graphify-out/."
  # record: nodes_added = <count of nodes in graph.json>, nodes_merged = 0, edges_added = <count of edges>, stale_flag_set = false
  # skip to Step 7 (record stats) then exit sub-phase
fi
```

**Step 3 — Merge `graph.json` (nodes + edges).** Both files follow NetworkX node-link format (`{"nodes": [...], "edges": [...]}` or `"links"` — accept either key). Run the merge via an inline Python block to avoid hand-merging JSON in the prompt. Write the merged graph to a staging file, then atomically swap:

```bash
python3 - <<'PY'
import json, os, pathlib, shutil, sys

existing_path = pathlib.Path("<VAULT_PATH>/graphify-out/graph.json")
incoming_path = pathlib.Path("<graphify_output_path>/graph.json")
staging_path = existing_path.with_suffix(".json.staging")

with existing_path.open() as f:
    existing = json.load(f)
with incoming_path.open() as f:
    incoming = json.load(f)

# Accept both "edges" and "links" keys — normalize to "edges".
def _edges(g):
    return g.get("edges", g.get("links", []))

# --- Node merge keyed by id ---
def _union(a, b):
    # Preserve order; dedup by string representation.
    seen, out = set(), []
    for item in (a or []) + (b or []):
        key = json.dumps(item, sort_keys=True) if not isinstance(item, str) else item
        if key not in seen:
            seen.add(key)
            out.append(item)
    return out

def _dedup_sources_by_url(a, b):
    seen, out = set(), []
    for item in (a or []) + (b or []):
        if isinstance(item, dict) and "url" in item:
            if item["url"] in seen:
                continue
            seen.add(item["url"])
        out.append(item)
    return out

existing_nodes = {n["id"]: n for n in existing.get("nodes", [])}
nodes_added = 0
nodes_merged = 0
for inc in incoming.get("nodes", []):
    nid = inc["id"]
    if nid not in existing_nodes:
        existing_nodes[nid] = inc
        nodes_added += 1
    else:
        cur = existing_nodes[nid]
        # Union sources by URL
        if "sources" in inc or "sources" in cur:
            cur["sources"] = _dedup_sources_by_url(cur.get("sources"), inc.get("sources"))
        # Most-recent updated_at (YYYY-MM-DD lexical compare works)
        cur_ua, inc_ua = cur.get("updated_at"), inc.get("updated_at")
        if inc_ua and (not cur_ua or inc_ua > cur_ua):
            cur["updated_at"] = inc_ua
        # Union labels and tags
        for key in ("labels", "tags"):
            if key in inc or key in cur:
                cur[key] = _union(cur.get(key), inc.get(key))
        nodes_merged += 1

# --- Edge dedup keyed by (source, target, type/relation) ---
def _edge_key(e):
    return (e.get("source"), e.get("target"), e.get("type") or e.get("relation"))

existing_edges = _edges(existing)
seen_edges = {_edge_key(e) for e in existing_edges}
edges_added = 0
for inc_edge in _edges(incoming):
    k = _edge_key(inc_edge)
    if k in seen_edges:
        continue
    existing_edges.append(inc_edge)
    seen_edges.add(k)
    edges_added += 1

merged = dict(existing)
merged["nodes"] = list(existing_nodes.values())
# Preserve the key naming the existing file used.
merged_key = "edges" if "edges" in existing else ("links" if "links" in existing else "edges")
merged[merged_key] = existing_edges

with staging_path.open("w") as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

# Emit stats to stdout for capture.
print(json.dumps({"nodes_added": nodes_added, "nodes_merged": nodes_merged, "edges_added": edges_added}))
PY
```

Atomic swap after the Python block succeeds:
```bash
mv "<VAULT_PATH>/graphify-out/graph.json.staging" "<VAULT_PATH>/graphify-out/graph.json"
```

If the Python block exits non-zero, abort without running the `mv` — the vault's `graph.json` stays untouched.

**Step 4 — Append `obsidian/*.md` files.** For each markdown file in `<graphify_output_path>/obsidian/`:

- If the corresponding file exists in `<VAULT_PATH>/graphify-out/obsidian/`: append the incoming content to the existing file, separated by `\n\n---\n\n`. Existing content is preserved verbatim.
- If it does not exist: copy the file into `<VAULT_PATH>/graphify-out/obsidian/`.

```bash
mkdir -p "<VAULT_PATH>/graphify-out/obsidian"
for src in "<graphify_output_path>/obsidian/"*.md; do
  [ -e "$src" ] || continue
  dest="<VAULT_PATH>/graphify-out/obsidian/$(basename "$src")"
  if [ -e "$dest" ]; then
    printf '\n\n---\n\n' >> "$dest"
    cat "$src" >> "$dest"
  else
    cp "$src" "$dest"
  fi
done
```

**Step 5 — Append `GRAPH_REPORT.md`.** If `<graphify_output_path>/GRAPH_REPORT.md` exists:

- If `<VAULT_PATH>/graphify-out/GRAPH_REPORT.md` exists: append a new dated section.
- If it does not exist: copy.

```bash
if [ -f "<graphify_output_path>/GRAPH_REPORT.md" ]; then
  dest="<VAULT_PATH>/graphify-out/GRAPH_REPORT.md"
  if [ -e "$dest" ]; then
    {
      printf '\n\n---\n\n# Merge on %s\n\n' "$(date +%Y-%m-%d)"
      cat "<graphify_output_path>/GRAPH_REPORT.md"
    } >> "$dest"
  else
    cp "<graphify_output_path>/GRAPH_REPORT.md" "$dest"
  fi
fi
```

**Step 6 — Mark `.graphify_analysis.json` stale.** If `<VAULT_PATH>/graphify-out/.graphify_analysis.json` exists, set a top-level `"stale": true` field. Other content is untouched:

```bash
analysis="<VAULT_PATH>/graphify-out/.graphify_analysis.json"
stale_flag_set=false
if [ -f "$analysis" ]; then
  python3 - <<PY
import json, pathlib
p = pathlib.Path("$analysis")
with p.open() as f:
    data = json.load(f)
data["stale"] = True
with p.open("w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
PY
  stale_flag_set=true
fi
```

If the file does not exist, skip (nothing to mark).

**Step 7 — Record merge stats for the Phase 7 report.** Capture `nodes_added`, `nodes_merged`, `edges_added` (from Step 3's Python stdout) and `stale_flag_set` (from Step 6). These values are threaded through to Phase 7's report block under a new **"Graphify merge"** section and returned in the skill's result payload to the caller (e.g., `/bedrock:teach`).

**Step 8 — Point subsequent phases at the merged location.** After the merge succeeds, set `graphify_output_path := <VAULT_PATH>/graphify-out/` for all downstream phases. Phase 1.3 (graphify-output parsing), Phase 2 (matching), and the rest of the flow read from the merged vault location — not from the original temp input.

---

## Phase 1 — Parse Input

`/bedrock:preserve` accepts three input modes. Determine which to apply:

### 1.1 Structured input

When called by another skill (e.g., `/bedrock:teach`) or when the user provides an explicit list.
The format is a list of entities, each with:

```yaml
- type: actor | person | team | concept | topic | discussion | project | fleeting | code
  name: "canonical entity name"
  action: create | update
  content: "content to include in the entity body"
  relations:
    actors: ["actor-slug-1", "actor-slug-2"]
    people: ["person-slug-1"]
    teams: ["team-slug-1"]
    concepts: ["concept-slug-1"]
    topics: ["topic-slug-1"]
    discussions: ["discussion-slug-1"]
    projects: ["project-slug-1"]
    code: ["node-slug-1"]
  source: "github | confluence | jira | session | manual | gdoc | csv | graphify"
  metadata: {}  # additional frontmatter fields specific to the type
```

If the input follows this format (or something close): parse directly and go to Phase 2.

### 1.2 Free-form input

When the user provides natural text, meeting notes, session context, or any
unstructured content. Analyze the text and extract:

1. **Mentioned entities** — identify by name, alias, or reference:
   - People: names in "First Last" format
   - Actors: service names, APIs, repositories
   - Teams: squad names
   - Concepts: patterns, principles, techniques, protocols, abstractions
   - Topics: discussion themes, bugs, RFCs, features
   - Discussions: meetings, decisions, debates
   - Projects: initiatives, migrations, cross-team features

2. **Inferred action** — for each entity:
   - If the entity already exists in the vault: `update`
   - If the entity does not exist: `create`

3. **Content** — what was said about each entity in the input

4. **Relations** — infer which entities relate to each other based on context

5. **Source** — infer: `session` (conversation), `meeting-notes` (minutes), `manual` (typed text)

To classify new content, consult the plugin's entity definitions (see "Plugin Paths" section) (loaded in Phase 2.0):
- "When to create" section → positive criteria for creating a new entity
- "When NOT to create" section → exclusion criteria
- "How to distinguish from other types" section → disambiguation

Convert the result to the structured format from section 1.1 and proceed.

### 1.3 Graphify output input

When called by `/bedrock:teach` (or any skill) with a graphify output reference,
OR when the user invokes `/bedrock:preserve` directly pointing at a `graphify-out/` directory:

**Input format:**
- `graphify_output_path`: path to `graphify-out/` directory
- `source_url`: original external source URL/path (optional — may not be present for manual invocation)
- `source_type`: type of external source (optional)

**Detection:** If the input contains a path ending in `graphify-out/` or `graphify-out`,
or references `graph.json`, treat as graphify output input.

**Processing:**

1. **Read graph.json** from `graphify_output_path/graph.json`:
   - Parse NetworkX node-link format
   - Extract all nodes with: `id`, `label`, `file_type`, `source_file`, `source_location`
   - Extract all edges with: `source`, `target`, `relation`, `confidence`, `confidence_score`
   - If `graph.json` is missing or empty: abort with error "No graph.json found in graphify output. Run /graphify first."

2. **Read obsidian files** from `graphify_output_path/obsidian/*.md`:
   - For each markdown file, read frontmatter and body content
   - Correlate with graph.json by matching filename stem to node `id` (kebab-cased)
   - If obsidian file doesn't exist for a node: fall back to graph.json metadata alone

3. **Read analysis** from `graphify_output_path/.graphify_analysis.json` (if exists):
   - Extract community assignments, god nodes, community labels
   - Use community labels to inform `domain/*` tags when creating entities

4. **Classify graphify nodes into vault entity types** — /preserve owns this classification:
   - Read ALL entity definitions from plugin (see "Plugin Paths")
   - For each graphify node, classify:
     - `file_type: code` → `code` (actor inferred from `source_file` path or repo name in the path)
     - `file_type: document` or `file_type: paper` → check for concept first: if the node describes a pattern, principle, technique, protocol, or abstraction AND is self-contained AND is not specific to a single actor → `concept`
     - `file_type: document` (non-concept) → classify using entity definitions ("When to create" / "When NOT to create" / "How to distinguish")
     - `file_type: paper` (non-concept) → `topic` or `fleeting` depending on completeness criteria
     - God nodes (high degree in `.graphify_analysis.json`) → consider as `actor`, `concept`, or `topic`
     - Apply Zettelkasten classification (section 1.4): if content doesn't meet completeness criteria → `fleeting`

5. **Filter relevant nodes:**
   - For code entities: select top ~50 by relevance (degree > average, or label contains "Service", "Controller", "Client", "Factory", "Handler", "Mapper", "Gateway", "Provider"). Exclude test nodes (labels with "Test", "Tests", "Builder", "Mock", "Fake") and trivial nodes (getters, setters, simple DTOs).
   - For document/paper nodes: include all.

6. **Match against existing vault** — Use existing textual matching logic from Phase 2 (filename, name, aliases, `graphify_node_id`). Mark matched nodes as `update`, unmatched as `create`.

7. **Build internal structured format** for each classified + filtered entity:
   - `type`: from classification (step 4)
   - `name`: from graphify node `label` (kebab-cased for filename)
   - `action`: `create` or `update` (from step 6 matching)
   - `content`: from obsidian markdown file body (or generate from graph.json metadata if no obsidian file)
   - `relations`: from graph.json edges (convert node ids to entity slugs via kebab-case)
   - `source`: from input `source_type` (or `"graphify"` if not provided)
   - `source_url`: from input `source_url` (if provided)
   - `source_type`: from input `source_type` (if provided)
   - `metadata`: for code entities, include:
     - `graphify_node_id`: node `id` from graph.json
     - `actor`: wikilink of the parent actor (inferred from `source_file` path)
     - `node_type`: infer from context (`function`, `class`, `module`, `interface`, `endpoint`)
     - `source_file`: relative path from graph.json
     - `confidence`: from the strongest edge connected to the node (`EXTRACTED` > `INFERRED` > `AMBIGUOUS`)
   - `metadata`: for concepts (from graphify), include:
     - `graphify_node_id`: node `id` from graph.json
     - `confidence`: from the strongest edge connected to the node (`EXTRACTED` > `INFERRED` > `AMBIGUOUS`)

8. **Proceed to Phase 3** (Change Proposal) — present the classified entity list for user confirmation, then execute writes as normal (Phases 4-7).

> **Note:** When invoked directly by the user (not via /teach), the user confirmation in Phase 3
> is the only gate before writes. When invoked via /teach, /teach has already shown the user
> the graphify report (god nodes, communities) providing context for the confirmation.

### 1.4 Zettelkasten Classification

Before converting to structured format, classify each entity by Zettelkasten role.
Consult the plugin's entity definitions ("Completeness Criteria" section) to determine the correct type:

**Classification rule:**
- If the content meets the completeness criteria of a permanent type (actor, person, team) → classify as permanent
- If the content has `graphify_node_id` and `actor` defined → classify as `code` (permanent extension, sub-entity of actor)
- If the content defines a pattern, principle, technique, protocol, or abstraction that is self-contained and actor-independent → classify as `concept` (permanent)
- If the content meets the completeness criteria of a bridge type (topic, discussion) → classify as bridge
- If the content meets the completeness criteria of an index type (project) → classify as index
- **If the content does NOT meet the completeness criteria of any type** → classify as `fleeting`

**Heuristics for fleeting:**
- Vague mention without concrete data (no repo name, no full person name, no date, no decision)
- Idea or hypothesis without confirmation ("it seems like...", "maybe...", "someone mentioned...")
- Fragment of information without sufficient context to be self-contained
- Generic TODO without assignee or deadline

**When in doubt, err on the side of fleeting** — it is safer to capture as fleeting and promote later than to create an incomplete permanent entity.

If the input came from another skill (e.g., `/bedrock:teach`) and already includes a classification suggestion (`type: fleeting`), respect the suggestion but validate against the criteria above.

If no input was provided: ask the user "What would you like to preserve in the vault? Provide text, meeting notes, or a list of entities."

---

## Phase 2 — Matching with Existing Entities

**Objective:** Correlate entities from the input with the existing vault.

### 2.0 Read entity definitions

Read ALL entity definition files from the plugin (see "Plugin Paths" section):
`<base_dir>/../../entities/*.md`
These files define what each entity type is, when to create, when NOT to create, and how
to distinguish between types. Internalize these definitions — you will use them to classify new
content (especially in free-form mode, Phase 1.2).

### 2.1 Collect vault entities

List all files in each entity directory (exclude `_template.md` and `_template_node.md`):

```
<VAULT_PATH>/actors/*.md and <VAULT_PATH>/actors/*/*.md (actors can be folders)
<VAULT_PATH>/actors/*/nodes/*.md (code entities within actors)
<VAULT_PATH>/people/*.md
<VAULT_PATH>/teams/*.md
<VAULT_PATH>/topics/*.md
<VAULT_PATH>/discussions/*.md (if exists)
<VAULT_PATH>/projects/*.md (if exists)
<VAULT_PATH>/fleeting/*.md (if exists)
```

For each file found, extract:
- `filename` (without extension) — canonical identifier
- `name` (or `title`) from frontmatter — human-readable name
- `aliases` from frontmatter — alternative names
- `graphify_node_id` from frontmatter — for code entities (if present)

### 2.2 Textual matching

For each entity from the input, check if it already exists in the vault:

**Match rules (in priority order):**

1. **Exact match by filename** (case-insensitive): `billing-api` == `billing-api`
2. **Match by name/title field** (case-insensitive): `"Billing API"` finds `billing-api.md`
3. **Match by aliases** (case-insensitive): `"BillingAPI"` finds `billing-api.md` if alias contains "BillingAPI"
4. **Match by filename without hyphens** (case-insensitive): `billing-api` → `billingapi` finds "BillingAPI"
5. **Match by graphify_node_id** (for code entities): exact match by `graphify_node_id` in frontmatter. This is the most reliable match for code entities and takes priority over the others when present.

**Safety rules:**
- DO NOT match by substrings of 3 characters or fewer (e.g., "api" should not match everything)
- Maximum 20 correlations per entity type
- In case of ambiguity: record all candidates and resolve in Phase 3 (proposal)

### 2.3 Classify actions

For each entity from the input:
- If match found in vault: mark as `update` (update existing entity)
- If no match: mark as `create` (new entity)
- If the input already specified the action: respect the input's action

### 2.4 Enrich via external sources (best-effort)

For entities of type `actor` that have a `repository` field in frontmatter:

**GitHub MCP** (call directly, NOT via subagent):
- `mcp__plugin_github_github__list_pull_requests` → recent PRs (5, state=all, sort=updated)
- `mcp__plugin_github_github__list_commits` → recent commits (5)

**Atlassian MCP**:
- Search for Jira issues from the relevant squad
- Search for related Confluence pages

> **IMPORTANT:** Enrichment is best-effort. If MCP is not available or fails, continue without it. Record which sources failed in the final report.

> **IMPORTANT:** DO NOT use subagents for MCP calls. Permissions are not inherited by subagents.

---

## Phase 3 — Change Proposal

**Objective:** Present to the user EVERYTHING that will be done, BEFORE executing.

### 3.1 Build proposal

For each entity, present:

```
## Change Proposal — /bedrock:preserve

### Entities to create
| # | Type | Name | File | Relations |
|---|---|---|---|---|
| 1 | actor | billing-new-api | actors/billing-new-api.md | [[squad-payments]], [[alice-smith]] |

### Entities to update
| # | Type | Name | File | Changes |
|---|---|---|---|---|
| 1 | actor | billing-api | actors/billing-api.md | Add "Recent Activity" section |

### Bidirectional links
| Source entity | Target entity | Section added |
|---|---|---|
| [[billing-new-api]] | [[squad-payments]] | "Related Actors" in squad-payments |
| [[squad-payments]] | [[billing-new-api]] | "team" in billing-new-api |

### Sources consulted
- ✅ Local vault
- ✅ / ❌ GitHub MCP
- ✅ / ❌ Atlassian MCP

Total: N entities to create, M to update, P bidirectional links.
```

### 3.2 Await confirmation

Ask: "Confirm execution? (yes/no/adjust)"

- **yes**: proceed to Phase 4
- **no**: abort and inform
- **adjust**: ask what to adjust, modify proposal, re-present

**DO NOT proceed without explicit user confirmation.**

---

## Phase 4 — Execute Changes

**Objective:** Create and update entities as per the approved proposal.

### 4.1 Create new entities

For each entity marked as `create`:

1. Read the plugin template: `<base_dir>/../../templates/<directory>/_template.md`
2. Fill frontmatter with data from input + matching:
   - `type`: entity type
   - `name` (or `title` for topics): extracted name
   - `aliases`: generate at least 1 alias following the convention per type (see conventions.md)
   - `tags`: use hierarchical tags: `[type/<type>, status/<status>, domain/<domain>]`
   - `updated_at`: today's date (YYYY-MM-DD)
   - `updated_by`: "preserve@agent"
   - Relation fields: wikilinks to correlated entities
   - Remaining fields: fill with data from input or leave empty
3. Fill body following the template structure
4. Add mandatory callouts when applicable:
   - Actors with `status: deprecated` → `> [!warning] Deprecated`
   - Actors with `pci: true` → `> [!danger] PCI Scope`
5. Save to `<directory>/<filename>.md`

**Rules per entity type:**

| Type | Directory | Filename pattern | Name frontmatter key |
|---|---|---|---|
| actor | actors/ or actors/\<name\>/ | `repo-name.md` | `name` |
| code | actors/\<actor\>/nodes/ | `node-slug.md` | `name` |
| person | people/ | `first-last.md` | `name` |
| team | teams/ | `squad-name.md` | `name` |
| concept | concepts/ | `slug.md` | `name` |
| topic | topics/ | `YYYY-MM-category-slug.md` | `title` |
| discussion | discussions/ | `YYYY-MM-DD-slug.md` | `title` |
| project | projects/ | `project-slug.md` | `name` |
| fleeting | fleeting/ | `YYYY-MM-DD-slug.md` | `title` |

### 4.1.2 Code entity specific rules

When creating a code entity:

1. **Resolve the parent actor:** the `actor` field in the input (wikilink or slug) indicates the actor. Verify that the actor exists in `actors/`.
2. **Ensure folder structure:** if the actor is still a flat file (`actors/<name>.md`):
   - Create folder `actors/<name>/`
   - Move `actors/<name>.md` → `actors/<name>/<name>.md` (use `git mv`)
   - Create subfolder `actors/<name>/nodes/`
   - Add "Knowledge Nodes" section to the actor body (before the "Infrastructure" section or at the end)
3. **Create code entity:** use template `actors/_template_node.md`
   - Save to `actors/<actor>/nodes/<node-slug>.md`
   - Filename: kebab-case of the node's `name` (e.g., `ProcessTransaction` → `process-transaction.md`)
   - Fill `graphify_node_id`, `actor`, `node_type`, `source_file`, `confidence` from the input
   - Inherit `domain/*` tags from the parent actor
   - Generate at least 1 alias (human-readable name + camelCase if applicable)
4. **Bidirectional backlink:**
   - In the code entity: `actor: "[[actor-name]]"` in frontmatter
   - In the actor: add `- [[node-slug]] — brief description` in the "Knowledge Nodes" section

### 4.1.1 Linking rules by Zettelkasten role

When filling the entity body, apply semantic linking rules by role:

- **Permanent notes** (actors, people, teams, concepts): wikilinks in the body must have textual context.
  E.g., "receives authorizations from [[payment-gateway]] via gRPC" — not just "[[payment-gateway]]"
- **Bridge notes** (topics, discussions): wikilinks in the body explain *why* permanents relate.
  E.g., "the deprecation of [[legacy-gateway]] is blocked because clients depend on [[billing-api]]"
- **Index notes** (projects): wikilinks in the body point to where the knowledge is.
  E.g., "progress documented in [[2026-06-deprecation-legacy-gateway]]"
- **Fleeting notes**: exploratory wikilinks allowed without full textual context.

### 4.2 Update existing entities

For each entity marked as `update`:

1. Read the existing file
2. **Frontmatter:** merge — update fields with new data. NEVER delete existing fields.
   - ALWAYS update `updated_at` and `updated_by`
   - Add new wikilinks to existing arrays (do not duplicate)
   - Add new aliases if discovered
3. **Body:**
   - **Actors:** can be modified/merged — new information replaces outdated information
   - **People, Teams, Concepts, Topics:** append-only — add information, NEVER delete existing content
   - **Discussions, Projects:** append-only for the general body; structured fields (action_items, conclusions) can be updated
   - **"Recent Activity" section** (actors): REPLACE content (temporal data)
4. **Wikilinks:** add new ones, NEVER remove existing ones

### 4.3 Populate `sources` field (when applicable)

If the input contains `source_url` and `source_type` (provided by `/bedrock:teach` or another caller):

**When creating an entity:**
- Add to frontmatter:
  ```yaml
  sources:
    - url: "<source_url>"
      type: "<source_type>"
      synced_at: "<today's date>"
  ```

**When updating an entity:**
1. Read the existing `sources` field from frontmatter
2. If the URL already exists in the list: update `synced_at` with today's date
3. If the URL does not exist: append new entry `{url, type, synced_at}`
4. Sort by `synced_at` descending (most recent first)
5. NEVER remove existing entries (append-only)

**If the input does NOT contain `source_url`:** do not modify the `sources` field — keep the existing value (or `[]` if new entity).

---

## Phase 5 — Bidirectional Linking

**Objective:** Ensure that every relation is reciprocal.

### 5.1 Linking rules

When creating/updating entity X with a reference to entity Y:
- Check if Y already references X
- If NOT: add reference from Y → X

**Bidirectional linking graph:**

```
Team ──members──→ Person ──team──→ Team
Team ──actors──→ Actor ──team──→ Team
Topic ──people──→ Person
Topic ──actors──→ Actor
Person ──focal_points──→ Actor
Project ──focal_points──→ Person ──projects──→ Project
Project ──related_actors──→ Actor
Project ──related_topics──→ Topic
Project ──related_teams──→ Team
Discussion ──related_actors──→ Actor
Discussion ──related_people──→ Person
Discussion ──related_projects──→ Project
Discussion ──related_topics──→ Topic
Code ──actor──→ Actor ──"Knowledge Nodes" section──→ Code
Code ──relations──→ Code (bidirectional via relations[])
```

### 5.2 Implementation

For each pair (X → Y) in the approved proposal:

1. Read entity Y
2. Identify the corresponding field/section in the reverse link (Y → X)
3. **In frontmatter:** if the array field exists, add wikilink `[[X]]` if not already present
4. **In body:** if there is a corresponding section (e.g., `## Discussions`, `## Related Projects`):
   - If section exists: add `- [[X]] — brief context` at the end of the list
   - If section does NOT exist: create the section in the appropriate location (before "Expected Bidirectional Links" or before the last `---`)
5. Update `updated_at` and `updated_by` of Y
6. Save

**Idempotency:** if the wikilink `[[X]]` already exists in Y's field/section, DO NOT add it again.

### 5.3 Linking sections by target entity type

| Target entity (Y) | Body section | Frontmatter field |
|---|---|---|
| Actor receiving link from Discussion | `## Discussions` | — |
| Actor receiving link from Project | `## Related Projects` | — |
| Person receiving link from Discussion | `## Discussions` | — |
| Person receiving link from Project | `## Projects` | `projects` (if exists) |
| Topic receiving link from Project | `## Related Projects` | — |

For frontmatter-based links (team↔actor, team↔person, person↔team, etc.): use only the YAML field, do not create a body section.

---

## Phase 6 — Publish

### 6.1 Prepare commit

Determine the commit message following the convention:

**Single entity:**
```
vault(<type>): <verb> <name> [source: <source>]
```

Types: `actor`, `person`, `team`, `concept`, `topic`, `discussion`, `project`, `source`
Verbs: `creates`, `updates`, `links`
Sources: `memory`, `github`, `jira`, `confluence`, `gdoc`, `csv`, `manual`, `session`, `preserve`

**Multiple entities:**
```
vault: preserves N entities [source: <sources>]
```

Or, if called by `/bedrock:teach`:
```
vault: teaches <source-name>, creates N updates M entities [source: <type>]
```

### 6.2 Execute git workflow

#### 6.2.1 Stage and commit

```bash
# Stage touched entities (includes actor subfolders: actors/*/nodes/)
git -C <VAULT_PATH> add actors/ people/ teams/ topics/ discussions/ projects/ fleeting/

# Check if there is anything to commit
git -C <VAULT_PATH> diff --cached --quiet && echo "Nothing to commit" && exit 0
```

#### 6.2.2 Read git strategy

Read the vault's git strategy from `.bedrock/config.json`:

```bash
cat <VAULT_PATH>/.bedrock/config.json 2>/dev/null
```

Extract the `git.strategy` field. If the file does not exist or has no `git` key, default to `"commit-push"`.

Valid values: `"commit-push"`, `"commit-push-pr"`, `"commit-only"`.

#### 6.2.3 Dispatch by strategy

**Strategy: `commit-push`** (default)

```bash
git -C <VAULT_PATH> commit -m "<message per convention>"
git -C <VAULT_PATH> push origin main
```

If push fails (conflict):
```bash
git -C <VAULT_PATH> pull --rebase origin main
git -C <VAULT_PATH> push origin main
```

If it fails 2x: STOP and inform the user.
If there is no remote: commit locally and warn.

---

**Strategy: `commit-push-pr`**

First, check that `gh` is available:

```bash
which gh 2>/dev/null
```

If `gh` is not found: warn the user and **fall back to `commit-push`** strategy (above).

If `gh` is available:

1. **Create a branch.** Derive the branch name from the commit message:

   - Single entity: `vault/<YYYY-MM-DD>-<entity-name>` (e.g., `vault/2026-04-15-billing-api`)
   - Multiple entities: `vault/<YYYY-MM-DD>-batch-<N>-entities` (e.g., `vault/2026-04-15-batch-7-entities`)

   Check for collisions:
   ```bash
   git -C <VAULT_PATH> branch --list "vault/<YYYY-MM-DD>-<slug>*"
   ```
   If the branch already exists, append a counter: `vault/2026-04-15-billing-api-2`.

   ```bash
   git -C <VAULT_PATH> checkout -b <branch-name>
   ```

2. **Commit and push the branch:**
   ```bash
   git -C <VAULT_PATH> commit -m "<message per convention>"
   git -C <VAULT_PATH> push origin <branch-name>
   ```

3. **Open a pull request:**
   ```bash
   cd <VAULT_PATH> && gh pr create --title "<commit message>" --body "Automated by /bedrock:preserve" --base main
   ```

4. **Return to main:**
   ```bash
   git -C <VAULT_PATH> checkout main
   ```

---

**Strategy: `commit-only`**

```bash
git -C <VAULT_PATH> commit -m "<message per convention>"
```

Do not push. Output:
```
Git strategy: commit-only — changes committed locally. Use `git push` manually when ready.
```

---

## Phase 7 — Report

Present to the user:

```
## Preserve — Report

### Entities created
| Type | Name | File | Source |
|---|---|---|---|
| actor | payment-new-api | actors/payment-new-api.md | github |

### Entities updated
| Type | Name | File | Changes |
|---|---|---|---|
| actor | billing-api | actors/billing-api.md | Recent Activity, wikilinks |

### Bidirectional links applied
| Source | Target | Type |
|---|---|---|
| [[billing-new-api]] | [[squad-payments]] | frontmatter: actors[] |
| [[squad-payments]] | [[billing-new-api]] | frontmatter: team |

### Graphify merge (only when Phase 0.2 ran)
| Metric | Value |
|---|---|
| Nodes added | N |
| Nodes merged | M |
| Edges added | P |
| Analysis marked stale | true / false |

Omit this section entirely when Phase 0.2 was skipped (no `graphify_output_path`, or backward-compat path match).

The same four fields are included in the skill's return payload (e.g., consumed by `/bedrock:teach`):

```yaml
graphify_merge:
  nodes_added: N
  nodes_merged: M
  edges_added: P
  stale_flag_set: true | false
```

### Sources consulted
- ✅ Local vault
- ✅ / ❌ GitHub MCP
- ✅ / ❌ Atlassian MCP

### Git
- Commit: `vault: preserves 2 entities [source: github]`
- Push: ✅ success / ❌ failed (reason)

### Warnings
- [orphan wikilinks, ambiguous entities, MCP unavailable, etc.]
```

---

## Critical Rules

| # | Rule |
|---|---|
| 1 | **NEVER delete content** written by another agent or human (except the "Recent Activity" section in actors, which is temporal) |
| 2 | **NEVER overwrite frontmatter** — only merge new fields. NEVER delete existing fields. |
| 3 | **NEVER commit sensitive data** (credentials, tokens, PANs, CVVs) |
| 4 | **ALWAYS update** `updated_at` and `updated_by` on every touched entity |
| 5 | **ALWAYS use kebab-case** without accents for filenames |
| 6 | **ALWAYS follow the templates** from `_template.md` when creating new pages |
| 7 | **ALWAYS confirm** proposal with user before executing writes |
| 8 | **Maximum 2 push attempts** — after that, abort and inform |
| 9 | **Best-effort for external sources** — never block due to unavailable MCP |
| 10 | **Idempotency in wikilinks** — do not add a link that already exists |
| 11 | **Frontmatter keys in English**, values in the vault's configured language |
| 12 | **Bare wikilinks** — `[[name]]`, never `[[dir/name]]` |
| 13 | **Hierarchical tags** — `[type/actor]`, never `[actor]` |
| 14 | **Mandatory aliases** — at least 1 alias per new entity |
| 15 | **Mandatory callouts** — `[!warning] Deprecated` for deprecated, `[!danger] PCI Scope` for PCI |
| 16 | **Vault resolution first** — resolve `VAULT_PATH` before any file operation or git command |
| 17 | **All git commands use `git -C <VAULT_PATH>`** — never assume CWD is the vault |
| 18 | **All entity paths use `<VAULT_PATH>/` prefix** — `<VAULT_PATH>/actors/`, not `actors/` |
| 19 | **Graphify merge is append-only** — Phase 0.2 never deletes nodes, edges, obsidian content, or GRAPH_REPORT sections. On node-id collision: union `sources` by URL, take most-recent `updated_at`, union labels/tags. On edge collision by `(source, target, type)`: drop the incoming duplicate. |
| 20 | **Graphify merge backward-compat** — if `graphify_output_path` resolves to the same absolute path as `<VAULT_PATH>/graphify-out/`, Phase 0.2 is a no-op. Legacy callers and `/bedrock:sync` continue to work unchanged. |
| 21 | **Graphify merge is atomic** — `graph.json` is merged into a `.staging` file and atomically renamed. If validation or merge fails, the vault's `graph.json` is untouched. |
| 22 | **`.graphify_analysis.json` is marked stale, never recomputed** — Phase 0.2 sets `stale: true` on merge. `/bedrock:compress` owns recomputation. |
