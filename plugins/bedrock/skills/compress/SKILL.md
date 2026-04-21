---
name: compress
description: >
  Vault alignment engine. Detects and fixes 5 types of structural misalignments:
  broken backlinks, concept fragmentation, entity miscategorization, duplicated entities,
  and misnamed entities. Delegates all writes to /bedrock:preserve.
  Supports interactive mode (user confirmation) and cron mode (autonomous mechanical fixes +
  queued semantic proposals). Use when: "bedrock compress", "bedrock-compress",
  "align vault", "fix backlinks", "fix misalignments", "/bedrock:compress".
user_invocable: true
allowed-tools: Bash, Read, Glob, Grep, Skill, Agent
---

# /bedrock:compress — Vault Alignment Engine

## Plugin Paths

Entity definitions and templates are in the plugin directory, not the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already injected automatically into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to compress. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name and remove it from the arguments before parsing `--mode`.

**Step 2 — Resolve vault path:**

1. **If `--vault <name>` was provided:**
   Read the vault registry at `<base_dir>/../../vaults.json`. Find the entry matching the name.
   If not found: error — "Vault `<name>` is not registered. Run `/bedrock:vaults` to see available vaults."
   If found: set `VAULT_PATH` to the entry's `path` value. Store the resolved vault name as `VAULT_NAME`.

2. **If no `--vault` flag — CWD detection:**
   Read `<base_dir>/../../vaults.json`. Check if the current working directory is inside any registered vault path
   (CWD starts with a registered vault's absolute path). If multiple match, use the longest path (most specific).
   If found: set `VAULT_PATH` to the matching vault's `path`. Store its name as `VAULT_NAME`.

3. **If CWD detection fails — default vault:**
   From the registry, find the vault with `"default": true`.
   If found: set `VAULT_PATH` to the default vault's `path`. Store its name as `VAULT_NAME`.

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
- Git operations: `git -C <VAULT_PATH> <command>`
- When delegating to `/bedrock:preserve`, pass `--vault <VAULT_NAME>`

---

## Overview

This skill scans all entities in the vault, detects 5 types of structural misalignments,
proposes fixes to the user, and delegates all writes to `/bedrock:preserve`.

**You are an execution agent.** Follow the phases below in order, without skipping steps.

### Execution modes

The skill accepts an optional `--mode` argument:

- **`interactive`** (default): all 5 capabilities prompt the user for confirmation before execution.
- **`cron`**: capabilities 1 and 4 (mechanical, deterministic) execute autonomously without confirmation.
  Capabilities 2, 3, and 5 (semantic, judgment-dependent) are detected but written as a proposal to a
  fleeting note for human review — they are NOT executed.

Parse the mode from the invocation arguments. If no `--mode` is specified, default to `interactive`.

### Five alignment capabilities

| # | Capability | Type | Cron behavior |
|---|---|---|---|
| 1 | Broken backlinks | Mechanical | Autonomous — fix without confirmation |
| 2 | Concept match | Semantic | Queued — write proposal to fleeting note |
| 3 | Entity misalignment | Semantic | Queued — write proposal to fleeting note |
| 4 | Duplicated entities | Mechanical | Autonomous — fix without confirmation |
| 5 | Misnamed entities | Semantic | Queued — write proposal to fleeting note |

**Critical rules:**
- **NEVER** write entity files directly — all mutations go through `/bedrock:preserve`
- **NEVER** execute semantic capabilities (2, 3, 5) without confirmation in interactive mode
- **NEVER** execute semantic capabilities (2, 3, 5) autonomously in cron mode — always queue
- **NEVER** remove existing wikilinks
- **NEVER** delete entities (compress aligns, it does not delete)
- People/Teams/Concepts/Topics: **append-only** — never delete content
- Actors: **free merge** — may edit body freely

---

## Phase 0 — Sync the Vault

Execute:
```bash
git -C <VAULT_PATH> pull --rebase origin main
```

If it fails:
- No remote: warn "No remote configured. Working locally." and proceed.
- Conflict: `git -C <VAULT_PATH> rebase --abort` and warn the user. Do NOT proceed without resolving.

---

## Phase 1 — Scan and Detect

Scan the entire vault and run all 5 detection algorithms. Store results for Phase 2.

### 1.0 Load entity definitions

Read the entity definitions from the plugin directory to understand classification criteria:
- `<base_dir>/../../entities/concept.md` — needed for capability 2 (concept match)
- `<base_dir>/../../entities/*.md` — needed for capability 3 (entity misalignment)

Store the "When to create", "When NOT to create", and "How to distinguish" sections
from each entity definition for use in detection.

### 1.1 Read all entities

For each entity directory (`<VAULT_PATH>/actors/`, `<VAULT_PATH>/people/`, `<VAULT_PATH>/teams/`, `<VAULT_PATH>/concepts/`, `<VAULT_PATH>/topics/`, `<VAULT_PATH>/discussions/`, `<VAULT_PATH>/projects/`, `<VAULT_PATH>/fleeting/`):

1. List all `.md` files, **excluding `_template.md` and `_template_node.md`**
   - For actors: include both `<VAULT_PATH>/actors/*.md` (flat) and `<VAULT_PATH>/actors/*/*.md` (folder)
2. For each entity, read frontmatter + body
3. Extract:
   - `type` from frontmatter
   - `name` from frontmatter (or filename as fallback)
   - `aliases` from frontmatter (array)
   - All wikilinks `[[target]]` from body AND frontmatter arrays
   - All proper nouns, service names, team names, person names mentioned in the body (for capabilities 4 and 5)

**Optimization for large vaults:** If the vault has more than 100 entities in a type,
use subagents via Agent tool to parallelize reading by entity type.

**Output:** `vault_data` map: `entity_name → {type, name, aliases[], wikilinks[], body_mentions[], frontmatter, body}`

### 1.2 Capability 1 — Detect broken backlinks

For each entity A in `vault_data`:
1. For each wikilink `[[B]]` found in A (body or frontmatter arrays):
   - Skip if B does not exist as an entity file in the vault (wikilinks to non-existent entities are valid in Obsidian)
   - If B exists: check if B contains a wikilink `[[A]]` (body or frontmatter arrays)
   - If B does NOT link back to A: register as **broken backlink**

**Output:** `broken_backlinks[]` — list of `{source: A, target: B, direction: "A→B exists, B→A missing"}`

### 1.3 Capability 2 — Detect concept fragmentation

Scan all entity bodies for recurring terms or phrases that:
1. Appear in **3+ different entities** (across any types)
2. Do NOT have a corresponding entity file in `<VAULT_PATH>/concepts/` (or any other entity directory)
3. Are NOT already wrapped in a wikilink `[[term]]`

For each candidate term, evaluate against the concept entity definition (`entities/concept.md`):
- Is it **timeless and definitional**? (not temporal, not an initiative)
- Is it **actor-independent**? (not specific to one system's implementation)
- Does it match "When to create" criteria?
- Does it NOT match "When NOT to create" criteria?

Filter out:
- Common English words and generic terms
- Terms that are already entity filenames or aliases
- Terms shorter than 2 words (unless they are well-known patterns like "CQRS", "mTLS")

**Output:** `concept_candidates[]` — list of `{term, occurrences: [{entity, context_snippet}], meets_concept_criteria: bool}`

### 1.4 Capability 3 — Detect entity misalignment

For each entity in `vault_data`:
1. Read the entity's frontmatter `type` field
2. Read the corresponding entity definition from `entities/<type>.md`
3. Evaluate the entity's content against:
   - "When to create" criteria for the current type → does the entity still qualify?
   - "When NOT to create" criteria for the current type → does the entity violate any?
   - "How to distinguish" table → does the entity look like another type?
4. If a different type is a better fit:
   - Score the entity against "When to create" criteria of the proposed new type
   - Score the entity against "When NOT to create" criteria of the proposed new type
   - If the new type scores higher: flag as **misaligned**

Focus on these common misalignments:
- Fleeting notes that have matured into topics, actors, or concepts (critical mass, corroboration)
- Topics that are actually concepts (timeless definition vs. temporal initiative)
- Actors that are actually projects (no repo/deployment yet)

**Output:** `misaligned_entities[]` — list of `{entity, current_type, proposed_type, reason}`

### 1.5 Capability 4 — Detect duplicated entities

Scan all entity bodies for proper nouns, service names, team names, and person names that:
1. Are mentioned in **3+ different entity files**
2. Do NOT have a corresponding entity file anywhere in the vault
3. Are NOT already wrapped in a wikilink `[[name]]`

Identification heuristics:
- Capitalized multi-word phrases (e.g., "Payment Gateway", "Alice Smith")
- Kebab-case or camelCase terms that look like service names (e.g., "billing-api", "notificationService")
- Terms following patterns like "the X team", "the X service", "X squad"

Filter out:
- Terms that are already entity filenames or aliases (existing entities)
- Generic organizational terms ("the team", "the service", "the API")
- Terms that appear only within wikilinks (already linked)

**Output:** `missing_entities[]` — list of `{name, inferred_type, mentions: [{entity, context_snippet}]}`

### 1.6 Capability 5 — Detect misnamed entities

Scan for name variants of the same real-world entity:
1. For each entity, collect all known names: filename (kebab-case), `name` field, `aliases[]`
2. For each proper noun/service name found in body text across the vault:
   - Check if it is a variant of an existing entity name (case-insensitive, with/without hyphens, abbreviated forms)
   - Example matches: "Iury" ↔ "Iury Krieger", "billing-api" ↔ "BillingAPI" ↔ "Billing API"
3. If a mention is a variant of an existing entity but NOT wrapped in a wikilink AND
   the variant is NOT in the entity's `aliases[]`: flag as **misnamed**
4. If two distinct entity files refer to the same real-world entity (e.g., `iury.md` and `iury-krieger.md`):
   flag as **duplicate entity files** requiring merge

**Output:** `misnamed_entities[]` — list of `{canonical_entity, variant_name, found_in: [{entity, context_snippet}], action: "add_alias" | "merge_entities"}`

---

## Phase 2 — Build Proposal

Present all findings to the user in a structured report, grouped by capability.

### 2.1 Summary table

```markdown
## /bedrock:compress — Alignment Proposal

| # | Capability | Findings | Mode |
|---|---|---|---|
| 1 | Broken backlinks | N found | Autonomous / Interactive |
| 2 | Concept match | N candidates | Queued / Interactive |
| 3 | Entity misalignment | N misaligned | Queued / Interactive |
| 4 | Duplicated entities | N missing | Autonomous / Interactive |
| 5 | Misnamed entities | N variants | Queued / Interactive |

**Total findings:** N
**Mode:** interactive / cron
```

### 2.2 Capability 1 — Broken backlinks

```markdown
### Capability 1: Broken Backlinks

| # | Source | Target | Missing direction |
|---|---|---|---|
| 1 | [[entity-a]] | [[entity-b]] | entity-b → entity-a |
| 2 | [[entity-c]] | [[entity-d]] | entity-d → entity-c |

**Fix:** Add missing backlinks in target entities via /bedrock:preserve.
```

If no broken backlinks found: "No broken backlinks found."

### 2.3 Capability 2 — Concept match

```markdown
### Capability 2: Concept Fragmentation

| # | Candidate concept | Occurrences | Entities |
|---|---|---|---|
| 1 | "event sourcing" | 5 | [[actor-a]], [[topic-b]], [[actor-c]], ... |
| 2 | "circuit breaker" | 3 | [[actor-d]], [[actor-e]], [[topic-f]] |

**Fix:** Create concept entities and add wikilinks in referencing entities via /bedrock:preserve.
```

If no candidates found: "No concept fragmentation found."

### 2.4 Capability 3 — Entity misalignment

```markdown
### Capability 3: Entity Misalignment

| # | Entity | Current type | Proposed type | Reason |
|---|---|---|---|---|
| 1 | [[note-about-cqrs]] | fleeting | concept | Meets critical mass: >3 paragraphs, timeless definition |
| 2 | [[new-checkout-system]] | actor | project | No repo or deployment yet |

**Fix:** Recategorize via /bedrock:preserve (create under new type, mark original as promoted/consolidated).
```

If no misalignments found: "No entity misalignments found."

### 2.5 Capability 4 — Duplicated entities

```markdown
### Capability 4: Missing Entities (Mentioned but Not Created)

| # | Name | Inferred type | Mentions |
|---|---|---|---|
| 1 | "Payment Gateway" | actor | 4 mentions in [[topic-a]], [[actor-b]], [[discussion-c]], [[actor-d]] |
| 2 | "Alice Smith" | person | 3 mentions in [[discussion-e]], [[topic-f]], [[discussion-g]] |

**Fix:** Create missing entities and establish backlinks via /bedrock:preserve.
```

If no missing entities found: "No duplicated entity mentions found."

### 2.6 Capability 5 — Misnamed entities

```markdown
### Capability 5: Misnamed Entities

| # | Canonical entity | Variant found | Found in | Action |
|---|---|---|---|---|
| 1 | [[iury-krieger]] | "Iury" | [[discussion-a]], [[topic-b]] | Add alias + wikilink |
| 2 | [[billing-api]] | "BillingAPI" | [[actor-c]] | Add alias + wikilink |
| 3 | [[iury.md]] + [[iury-krieger.md]] | Same person | — | Merge entities |

**Fix:** Add aliases and wikilinks, or merge duplicate entity files via /bedrock:preserve.
```

If no misnamed entities found: "No misnamed entities found."

### 2.7 No findings

If ALL 5 capabilities found 0 issues:
Report "Vault is aligned. No misalignments detected." and end (skip Phases 3-5).

---

## Phase 3 — Confirmation and Mode Handling

### Interactive mode (`--mode interactive` or default)

Present the full proposal from Phase 2 and ask:

```markdown
Confirm execution? (yes / no / partial)
- **yes**: execute all findings
- **no**: abort
- **partial**: specify which capabilities or individual findings to execute (e.g., "only capability 1 and 4", "all except finding 3 in capability 5")
```

**STOP HERE and wait for user confirmation.**

If the user says "no": report "No changes made." and end.
If the user partially confirms: filter the execution list accordingly.

### Cron mode (`--mode cron`)

No user confirmation needed for mechanical capabilities. Split findings:

**Autonomous execution (capabilities 1 and 4):**
- Proceed directly to Phase 4 with all findings from capabilities 1 and 4.
- When invoking `/bedrock:preserve`, include in the prompt:
  "Autonomous mode — do not ask for confirmation, process directly."

**Queued proposals (capabilities 2, 3, and 5):**
- If there are findings in capabilities 2, 3, or 5: compile them into a single fleeting note
  and delegate creation to `/bedrock:preserve`:

```yaml
entities:
  - type: fleeting
    name: "<today's date YYYY-MM-DD>-compress-proposals"
    action: create
    content: |
      ## Compress Alignment Proposals — <today's date>

      The following alignment issues were detected by `/bedrock:compress` running in cron mode.
      Review each proposal and run `/bedrock:compress` in interactive mode to execute.

      ### Concept Fragmentation (Capability 2)
      <formatted findings from Phase 2.3>

      ### Entity Misalignment (Capability 3)
      <formatted findings from Phase 2.4>

      ### Misnamed Entities (Capability 5)
      <formatted findings from Phase 2.6>
    relations: {}
    source: "compress"
    metadata:
      status: "raw"
      source: "session"
      captured_at: "<today's date YYYY-MM-DD>"
```

- Include in the `/bedrock:preserve` invocation:
  "Autonomous mode — do not ask for confirmation, process directly."

---

## Phase 4 — Delegate to /bedrock:preserve

### 4.1 Compile structured entity list

Build the entity list in the format accepted by `/bedrock:preserve`, grouping all confirmed fixes:

#### Capability 1 fixes (broken backlinks)

For each broken backlink `{source: A, target: B}`:
```yaml
- type: <B's entity type>
  name: "<B's entity name>"
  action: update
  content: ""
  relations:
    <A's type plural>: ["<A's entity name>"]
  source: "compress"
```

The content field is empty because the fix is adding a relation (backlink), not body content.
`/bedrock:preserve` handles adding the wikilink in B's body or frontmatter.

#### Capability 2 fixes (concept creation)

For each confirmed concept candidate:
```yaml
- type: concept
  name: "<concept-slug>"
  action: create
  content: "<brief definition derived from the recurring mentions>"
  relations:
    <referencing entity types>: ["<entity-1>", "<entity-2>", ...]
  source: "compress"
```

Plus, for each referencing entity that should link to the new concept:
```yaml
- type: <entity's type>
  name: "<entity's name>"
  action: update
  content: ""
  relations:
    concepts: ["<concept-slug>"]
  source: "compress"
```

#### Capability 3 fixes (entity misalignment)

For each misaligned entity:

**If current type is `fleeting` (promotion):**
```yaml
- type: <proposed new type>
  name: "<new entity name in correct format>"
  action: create
  content: "<content migrated from the fleeting note>"
  relations:
    <inferred relations>: [...]
  source: "compress"
- type: fleeting
  name: "<original fleeting note name>"
  action: update
  content: ""
  relations: {}
  source: "compress"
  metadata:
    status: "promoted"
    promoted_to: "[[<new entity name>]]"
```

**If current type is NOT fleeting (recategorization):**
```yaml
- type: <proposed new type>
  name: "<new entity name in correct format>"
  action: create
  content: "<content from the misaligned entity>"
  relations:
    <inferred relations>: [...]
  source: "compress"
```

Add a consolidation callout in the original entity (via update):
```yaml
- type: <current type>
  name: "<original entity name>"
  action: update
  content: "> [!info] Content recategorized to [[<new entity name>]]\n> This entity was recategorized by /bedrock:compress. See [[<new entity name>]] for the current version."
  relations:
    <new type plural>: ["<new entity name>"]
  source: "compress"
```

#### Capability 4 fixes (create missing entities)

For each missing entity:
```yaml
- type: <inferred type>
  name: "<entity-slug>"
  action: create
  content: "<aggregated context from all mentions>"
  relations:
    <mentioning entity types>: ["<entity-1>", "<entity-2>", ...]
  source: "compress"
```

Plus, for each mentioning entity (to establish backlinks):
```yaml
- type: <entity's type>
  name: "<entity's name>"
  action: update
  content: ""
  relations:
    <new entity's type plural>: ["<entity-slug>"]
  source: "compress"
```

#### Capability 5 fixes (misnamed entities)

**For alias additions:**
```yaml
- type: <entity's type>
  name: "<canonical entity name>"
  action: update
  content: ""
  relations: {}
  source: "compress"
  metadata:
    aliases: ["<existing aliases>", "<new variant name>"]
```

For each file where the variant was found (to add the wikilink):
```yaml
- type: <entity's type>
  name: "<entity where variant was found>"
  action: update
  content: ""
  relations:
    <canonical entity's type plural>: ["<canonical entity name>"]
  source: "compress"
```

**For entity merges** (two files for the same real-world entity):
```yaml
- type: <canonical entity's type>
  name: "<canonical entity name>"
  action: update
  content: "<merged content from both entities>"
  relations:
    <merged relations from both>: [...]
  source: "compress"
  metadata:
    aliases: ["<combined aliases from both entities>"]
```

Add a consolidation callout in the secondary entity:
```yaml
- type: <secondary entity's type>
  name: "<secondary entity name>"
  action: update
  content: "> [!info] Content consolidated in [[<canonical entity name>]]\n> This entity has been consolidated by /bedrock:compress. See [[<canonical entity name>]] for the merged version."
  relations:
    <canonical entity's type plural>: ["<canonical entity name>"]
  source: "compress"
```

### 4.2 Invoke /bedrock:preserve

Use the Skill tool to invoke `/bedrock:preserve --vault <VAULT_NAME>` passing the compiled structured entity list as argument.
The `--vault <VAULT_NAME>` flag ensures preserve writes to the same vault.

Include `source: "compress"` for all entities so `/bedrock:preserve` records provenance.

If running in cron mode (autonomous capabilities):
- Add to the invocation prompt: "Autonomous mode — do not ask for confirmation, process directly."

### 4.3 Await result

`/bedrock:preserve` returns:
- List of created/updated entities
- Commit hash (if there was a commit)
- Any errors or warnings

Record the result for use in the final report (Phase 5).

---

## Phase 5 — Final Report

Present to the user:

```markdown
## /bedrock:compress — Report

### Mode: interactive / cron

### Alignment fixes applied
| # | Capability | Findings | Fixed | Queued |
|---|---|---|---|---|
| 1 | Broken backlinks | N | M | — |
| 2 | Concept match | N | M | P (cron) |
| 3 | Entity misalignment | N | M | P (cron) |
| 4 | Duplicated entities | N | M | — |
| 5 | Misnamed entities | N | M | P (cron) |

**Total:** N findings, M fixed, P queued

### Entities processed (via /bedrock:preserve)
| Type | Name | Action |
|---|---|---|
| <type> | <name> | create / update |
| ... | ... | ... |

### Queued proposals (cron mode only)
- Created fleeting note: [[<YYYY-MM-DD>-compress-proposals]]
- Contains N proposals for capabilities 2, 3, 5
- Review and run `/bedrock:compress` in interactive mode to execute

### Git
- Commit: <hash from /bedrock:preserve>
- Push: success / failed (reason)

### Suggestions
- Run `/bedrock:healthcheck` for a full vault health report
- [additional suggestions based on findings]
```

If no fixes were applied (user refused all, or no findings):
Present only the summary table with zero counts.

---

## Error Handling

| Situation | Action |
|---|---|
| Empty vault (no entities) | Report "No entities found in the vault." and end |
| No findings across all 5 capabilities | Report "Vault is aligned." and end |
| User refuses all findings (interactive) | Report "No changes made." and end |
| Error reading entity | Skip entity, warn in the report |
| `/bedrock:preserve` fails | Report the error, list what was NOT processed |
| Entity without frontmatter | Skip entity, warn in the report |
| `--mode` argument not recognized | Default to `interactive`, warn the user |

---

## Critical Rules

| Rule | Detail |
|---|---|
| All writes via /bedrock:preserve | NEVER use Write or Edit on entity files. Invoke `/bedrock:preserve` via the Skill tool. |
| Mechanical vs. semantic split | Capabilities 1, 4 = mechanical (autonomous in cron). Capabilities 2, 3, 5 = semantic (queued in cron, confirmed in interactive). |
| User confirmation in interactive | ALWAYS wait for explicit confirmation before delegating to /bedrock:preserve in interactive mode. |
| Append-only for people/teams/topics | When fixing entities of these types, NEVER delete existing content. Add callouts and new links only. |
| Actors allow free merge | Actor bodies can be modified freely. Frontmatter is merge-only (never delete fields). |
| Never remove wikilinks | When fixing backlinks or renaming, ADD new links. Never remove existing ones. |
| Entity definitions are authoritative | Capabilities 2 and 3 MUST read entity definitions from the plugin directory. Do not hardcode classification heuristics. |
| 3+ threshold | Capabilities 2 and 4 require a term/name to appear in 3+ different entities before flagging. |
| Provenance | All entities delegated to /bedrock:preserve use `source: "compress"`. |
| MCP in main context | Do NOT use subagents for MCP calls — permissions are not inherited. |
| Sensitive data | NEVER include credentials, tokens, passwords, PANs, CVVs. |
| Vault resolution first | Resolve `VAULT_PATH` before any file operation or git command — never assume CWD is the vault |
| All git commands use `git -C <VAULT_PATH>` | Never assume CWD is the vault |
| All entity paths use `<VAULT_PATH>/` prefix | `<VAULT_PATH>/actors/`, not `actors/` |
| Pass --vault to /preserve | ALWAYS include `--vault <VAULT_NAME>` when delegating to `/bedrock:preserve` |
