---
name: sync
description: >
  Re-synchronizes the vault with external sources. In default mode, scans the `sources`
  field of all entities, deduplicates URLs, fetches updated content from each source
  (Confluence, GDocs, GitHub, Markdown), performs incremental diff and delegates writing to
  /bedrock:preserve. With --people, scans actor repositories via GitHub API and
  identifies active contributors. With --github, detects relevant activity in
  repositories and correlates PRs with topics/projects via LLM semantic matching.
  Use when: "bedrock sync", "bedrock-sync", "/bedrock:sync", "synchronize",
  "update sources", "sync people", "sync github".
user_invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Skill, Agent, mcp__plugin_github_github__*, mcp__plugin_atlassian_atlassian__*
---

# /bedrock:sync — Vault Synchronization

## Plugin Paths

Entity definitions and templates are in the plugin directory, not in the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already injected automatically into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to sync. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name and remove it from the arguments before parsing `--people` or `--github`.

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

This skill synchronizes the vault with external sources. It operates in three modes:

| Mode | Flag | Description |
|---|---|---|
| **Sources (default)** | _(none)_ | Re-synchronizes entities with a populated `sources` field |
| **People** | `--people` | Scans actor repositories and identifies active contributors |
| **GitHub** | `--github` | Detects activity in repos and correlates PRs with topics/projects |

---

## Routing

Analyze the argument passed by the user:

1. If argument contains `--people` → go to **Mode: Sync People** (below)
2. If argument contains `--github` → go to **Mode: Sync GitHub** (below)
3. Otherwise → go to **Mode: Sync Sources (default)** (below)

> **Note:** If no argument is passed, or the argument does not contain recognized flags,
> execute the default mode (Sync Sources).

---
---


# Mode: Sync Sources (default)




## Overview

This skill scans the `sources` field of all vault entities, deduplicates by URL,
fetches updated content from each external source, compares with existing entities
in the vault (incremental diff), and delegates all changes to `/bedrock:preserve` for centralized writing.

`/bedrock:sync` **does NOT write entities directly** — all entity writing goes through `/bedrock:preserve`.
After re-sync, `/bedrock:preserve` updates `synced_at` in the `sources` field of affected entities.

`/bedrock:sync` **does NOT ingest new sources** — for that, use `/bedrock:teach`.

**You are an execution agent.** Follow the phases below in order, without skipping steps.

---

## Phase 0 — Synchronize the Vault

Execute:
```bash
git -C <VAULT_PATH> pull --rebase origin main
```

If the pull fails:
- No remote configured: warn "No remote configured. Working locally." and proceed.
- Pull conflict: `git -C <VAULT_PATH> rebase --abort` and warn the user. Do NOT proceed without resolving.
- Otherwise: proceed.

---

## Phase 1 — Collect Syncable Sources

Provenance is recorded in the `sources` field of each entity's frontmatter.
Scan all entities to collect unique URLs.

1. Use Grep to find entities with a non-empty `sources` field:
   ```
   Grep pattern "^sources:" in directories: actors/, people/, teams/, topics/, discussions/, projects/, fleeting/
   ```
2. For each file found, use Read to extract the `sources` field from the YAML frontmatter.
   Each entry has: `{url, type, synced_at}`
3. **Build URL → entities map:**
   Deduplicate by URL. For each unique URL, record all entities that reference it:
   ```
   {
     "https://mycompany.atlassian.net/...": {
       type: "confluence",
       synced_at: "2026-04-09",
       entities: ["actors/billing-api.md", "topics/2026-04-feature-x.md"]
     },
     "https://github.com/acme-corp/billing-api": {
       type: "github-repo",
       synced_at: "2026-04-10",
       entities: ["actors/billing-api.md"]
     }
   }
   ```
4. **Filter syncable sources:**
   - Keep only URLs with `type` in (`confluence`, `gdoc`, `github-repo`, `markdown`)
   - Ignore URLs with `type` = `csv` or `manual` (log: "URL X ignored — non-syncable type")
5. Store the list of syncable URLs with their entity maps

Report: "Phase 1: N entities with sources, M unique URLs found, K syncable, J ignored (non-syncable type)."

---

## Phase 2 — Re-read Sources

For each syncable source, fetch updated content:

### 2.1 Confluence

For sources with `source_type: confluence`:

1. Read the internal fetcher at `<base_dir>/../confluence-to-markdown/SKILL.md`
2. Follow its instructions to parse the URL, choose layer (MCP → API → browser), and extract content
3. The fetcher returns Markdown content and page title

### 2.2 Google Docs

For sources with `source_type: gdoc`:

1. Read the internal fetcher at `<base_dir>/../gdoc-to-markdown/SKILL.md`
2. Follow its instructions to parse the URL, detect document type, choose layer (MCP → API/public export → browser), and extract content
3. The fetcher returns Markdown content and document metadata

### 2.3 GitHub Repository

For sources with `source_type: github-repo`:

1. Extract `owner/repo` from the URL (path segments after `github.com/`)
2. Use GitHub MCP directly (NOT via subagent — MCP permissions are not inherited):
   - `mcp__plugin_github_github__get_file_contents` → read the repo's README.md
   - `mcp__plugin_github_github__list_commits` → last 10 commits
   - `mcp__plugin_github_github__list_pull_requests` → last 5 PRs (state=all, sort=updated)
3. Compile everything into a single markdown text

> **Best-effort:** If any MCP call fails, continue with what was obtained. Do NOT block the sync.

### 2.4 Local Markdown

For sources with `source_type: markdown`:

1. Extract the path from the `url` field
2. Use Read to read the file directly
3. If the file does not exist: log and skip

### 2.5 Error handling

- If reading a source fails (MCP unavailable, broken URL, missing file):
  - Log the error: "Source X failed — reason"
  - Continue with remaining sources
  - Do NOT abort the entire execution for one source

Report: "Phase 2: N sources read successfully, M failed (list)."

---

## Phase 3 — Incremental Diff + Entity Extraction

### 3.1 Load entity definitions

Use Read to read ALL entity definition files from the plugin (see "Plugin Paths" section):
`<base_dir>/../../entities/*.md`
These files define what each entity type is, when to create, and how to distinguish them.
Internalize these definitions — you will use them to classify content.

### 3.2 Catalog existing entities

Use Glob to list all files in each entity directory (excluding `_template.md`):
- `<VAULT_PATH>/actors/*.md`
- `<VAULT_PATH>/people/*.md`
- `<VAULT_PATH>/teams/*.md`
- `<VAULT_PATH>/topics/*.md`
- `<VAULT_PATH>/discussions/*.md`
- `<VAULT_PATH>/projects/*.md`
- `<VAULT_PATH>/fleeting/*.md`

For each file found:
- Extract the filename without extension (e.g.: `billing-api`)
- Use Read to extract the `name` (or `title`) and `aliases` fields from the YAML frontmatter
- Store: `{filename, name, aliases, type}` for matching

### 3.3 Analyze content and detect changes

For each source successfully read in Phase 2:

1. **Identify entities mentioned in the updated content:**
   - For each entity cataloged in Phase 3.2, check if the filename, name, or alias appears in the content
   - Match rules:
     - Normalize for comparison: lowercase, no accents, no hyphens
     - Partial match acceptable for compound names (e.g.: "billing api" matches "billing-api")
     - Do NOT match substrings of 3 letters or fewer (e.g.: "api" does NOT match "billing-api")
     - Do NOT match generic words (e.g.: "company", "service", "system")

2. **Compare with the source's `entities_generated`:**
   - Entity in content AND already in vault → candidate for `update` (if there is new info in the content)
   - Entity in content but NOT in vault → candidate for `create`
   - Entity in `entities_generated` but NOT in updated content → **keep** (do not delete)

3. **Classify new entities:**
   - For `create` candidates, consult the entity definitions:
     - "When to create" section → positive criteria
     - "When NOT to create" section → exclusion criteria
     - "How to distinguish from other types" section → disambiguation

   > **Projects:** `project` is a valid type in extraction. When classifying new entities,
   > pay special attention to signals of initiatives with closed scope (deadline, deliverables,
   > focal points). Consult `entities/project.md` for creation criteria. An excerpt that
   > mentions migration with a deadline and responsible person is probably a project, not a topic.

4. **Record** for each detected entity:
   - Type (actor, person, team, topic, discussion, project)
   - Canonical name (filename or suggested slug)
   - Action: `create` or `update`
   - Extracted info: excerpt of the content where it appears
   - Source of origin: source slug

Report: "Phase 3: N entities detected (P creates, Q updates) across M sources."

---

## Phase 4 — Consolidated Confirmation

**REQUIRED:** Before creating/updating any entity, present a SINGLE list
with all changes from ALL sources:

```
## Sync — Proposed Changes

| # | Source | Type | Name | Action | Info |
|---|---|---|---|---|---|
| 1 | roadmap-26q1 | topic | 2026-04-feature-x | create | New topic mentioned |
| 2 | eventos-cobranca | actor | webhook-receiver | update | Description updated |
| ... | ... | ... | ... | ... | ... |

Total: N creates, M updates across P sources.
Confirm? (yes/no/adjust)
```

- **yes**: proceed to Phase 5
- **no**: abort with "Sync cancelled. No entities modified."
- **adjust**: ask what to adjust, modify list, re-present

**If no changes detected in any source:**
- Report: "No changes detected in any source. Vault is already up to date."
- Skip to Phase 6 (update `last_synced` anyway)

**Do NOT proceed without explicit user confirmation.**

---

## Phase 5 — Delegate to /bedrock:preserve

### 5.1 Compile structured list

Build the entity list in the format accepted by `/bedrock:preserve`:

```yaml
entities:
  - type: topic
    name: "2026-04-feature-x"
    action: create
    content: "relevant excerpt from content extracted in Phase 3..."
    relations:
      actors: ["actor-slug-1"]
      people: ["person-slug-1"]
    source: "confluence"
  - type: actor
    name: "webhook-receiver"
    action: update
    content: "new context extracted in Phase 3..."
    source: "github-repo"
```

**Compilation rules:**
- `type` and `name`: extracted from Phase 3
- `action`: `create` or `update` as identified
- `content`: excerpt of the source content that justifies the entity
- `relations`: infer relationships between entities in the list (if A mentions B, include B in A's relations)
- `source`: use the `source_type` of the originating source

### 5.2 Invoke /bedrock:preserve

Use the Skill tool to invoke `/bedrock:preserve --vault <VAULT_NAME>` passing the structured list as argument.
The `--vault <VAULT_NAME>` flag ensures preserve writes to the same vault.

`/bedrock:preserve` handles:
- Textual matching with existing entities
- Creation of new entities following templates
- Updating existing entities (merge/append-only)
- Bidirectional linking (wikilinks)
- Git commit of entities

### 5.3 Await result

`/bedrock:preserve` returns:
- List of created/updated entities
- Commit hash (if there was a commit)
- Any errors or warnings

Record the result for use in the final report (Phase 7).

---

## Phase 6 — Update synced_at in Entities

After re-sync of each URL, `/bedrock:preserve` has already updated the entities with new content.
Additionally, for each URL processed successfully, pass `source_url` and `source_type`
to `/bedrock:preserve` so it updates `synced_at` in the `sources` field of each mapped entity.

The URL → entities map (built in Phase 1) indicates which entities need
`synced_at` updated for each re-synced URL.

> **Note:** `/bedrock:preserve` already handles the entity commit. `/bedrock:sync` does NOT make a separate commit.

---

## Phase 7 — Report

Present to the user:

```
## Report

| Metric | Value |
|---|---|
| Sources found | N |
| Sources synchronized | N |
| Sources ignored (type) | N |
| Sources with error | N |
| Entities created | N |
| Entities updated | N |

### Per source
| Source | Type | Entities | Status |
|---|---|---|---|
| roadmap-26q1 | confluence | 3 creates, 2 updates | ✅ |
| acme-corp-billing-api | github-repo | 0 creates, 1 update | ✅ |
| manual-notes | manual | — | ⏭️ ignored |
| broken-source | confluence | — | ❌ error (reason) |

### Git
- Commit (entities): <hash from /bedrock:preserve or "no entities">
- Commit (sources): vault: syncs N sources [source: sync]
- Push: ✅ success / ❌ failed (reason)

### Suggestions
- [sources with errors that can be fixed]
- [entities mentioned in content but not created, if any]
```

---

## Critical Rules

| # | Rule |
|---|---|
| 1 | **NEVER write entities directly** — all entity writing goes through `/bedrock:preserve` |
| 2 | **NEVER create sources** — `/bedrock:sync` only processes URLs already registered in entities' `sources` field |
| 3 | **NEVER delete entities** — entities absent from updated content are kept |
| 4 | **ALWAYS confirm** consolidated proposal with user before executing (Phase 4) |
| 5 | **Best-effort for external sources** — never block due to unavailable MCP or broken URL |
| 6 | **MCP in main context** — do NOT use subagents for GitHub/Atlassian MCP calls |
| 7 | **csv and manual sources are ignored** — static types with no URL to re-fetch |
| 8 | **Maximum 2 push attempts** — after that, abort and inform |
| 9 | **Sensitive data** — NEVER include credentials, tokens, passwords, PANs, CVVs |
| 10 | **Frontmatter keys in English**, values in the vault's configured language |
| 11 | **Bare wikilinks** — `[[name]]`, never `[[dir/name]]` |

---
---

# Mode: Sync People (--people)




Skill that populates `people/` from recent commits in repositories listed in `actors/`.

**You are an execution agent.** Follow the phases below in order, without skipping steps.
Do not make git commit/push. Do not update `topics/` or `actors/`. Do not read CLAUDE.md from repositories.

---

## Phase 1 — Actor collection

1. Use Glob to list all files `<VAULT_PATH>/actors/*.md`
2. Exclude `<VAULT_PATH>/actors/_template.md`
3. For each file, use Read to extract from the YAML frontmatter:
   - `repository` — GitHub URL (e.g.: `https://github.com/acme-corp/billing-api/`)
   - `team` — squad wikilink (e.g.: `[[squad-payments]]`)
   - `name` — canonical name of the actor (e.g.: `billing-api`)
4. Parse `owner/repo` from the URL: extract the two path segments after `github.com/`
5. **Skip** actors without a `repository` field, with an empty URL, or with a URL that does not contain `github.com`
6. Store the list of valid actors: `{name, owner, repo, team_wikilink, team_slug}`
   - `team_slug`: extracted from the wikilink, e.g.: `[[squad-payments]]` → `squad-payments`

At the end of this phase, report: "Phase 1: N actors found, M with valid repository, K skipped."

---

## Phase 2 — Commit collection

For each actor in the list (in parallel when possible):

1. Calculate the date 30 days ago in ISO 8601 format (e.g.: `2026-03-04T00:00:00Z`)
2. Execute via Bash:
   ```
   gh api "repos/{owner}/{repo}/commits?since={date_30_days}&per_page=100" 2>/dev/null
   ```
3. If the command fails (404, 403, network error): **log and skip** — do not fail the execution
4. For each commit in the JSON result, extract:
   - `author.login` — GitHub login (may be `null` if commit via email without linked account)
   - `commit.author.name` — author's display name
5. **Filter bots:** ignore commits where:
   - `author.login` is `null`
   - `author.login` contains `[bot]`
   - `author.login` (case-insensitive) is exactly: `dependabot`, `renovate`, `github-actions`, `snyk-bot`, `codecov`, `sonarcloud`, `renovate-bot`, `depfu`
6. Store the valid commits associated with the actor

At the end of this phase, report: "Phase 2: N repositories accessed, M with commits, K inaccessible (list). Total of L commits from P unique contributors."

---

## Phase 3 — Aggregation

1. Group all commits by `author.login` (lowercase)
2. For each unique person, build:
   - `github`: login in lowercase
   - `name`: `commit.author.name` from the most recent commit (fallback: login if name is empty)
   - `focal_points`: list of canonical actor names where the person has commits (no duplicates)
   - `team_counts`: commit count by squad (e.g.: `{squad-payments: 15, squad-notifications: 3}`)
   - `team`: squad with most commits; in case of tie, first alphabetically
   - `filename`: derived from `name` → lowercase, no accents (normalize NFD and remove combining marks), spaces→hyphens, special characters removed, kebab-case
     - E.g.: `Alice Smith` → `alice-smith.md`
     - E.g.: `José María` → `jose-maria.md`
     - Fallback: if name not available, use login as filename

3. **Duplicate detection by filename:**
   - If two contributors (different logins) generate the same filename: append `-2`, `-3`, etc. to the second
   - If a file `people/{filename}` already exists with a different `github`: treat as different person, append suffix

At the end of this phase, report: "Phase 3: N unique contributors identified. Distribution by squad: [list]."

---

## Phase 4 — Write people

For each person:

### If `people/{filename}` does NOT exist — CREATE:

Use Write to create the file with this exact content (replace the placeholders):

```markdown
---
type: person
name: "{display_name}"
role: ""
team: "[[{team_slug}]]"
focal_points: [{focal_points_yaml}]
github: "{github_login}"
jira: ""
updated_at: {today_date_YYYY-MM-DD}
updated_by: "sync-people"
tags: [type/person]
---

# {Display Name}

> Active contributor identified via commits in the last 30 days.

## Team

Member of [[{team_slug}]].

## Focal Points

{focal_points_list}

## Active Topics

_No topics linked yet._
```

Where:
- `{focal_points_yaml}` = YAML array of wikilinks, e.g.: `["[[billing-api]]", "[[notification-service]]"]`
- `{focal_points_list}` = markdown list, e.g.:
  ```
  - [[billing-api]] — recent commits
  - [[notification-service]] — recent commits
  ```
- `{today_date_YYYY-MM-DD}` = today's date in `YYYY-MM-DD` format

### If `people/{filename}` ALREADY exists — UPDATE:

1. Use Read to read the existing file
2. **Merge focal_points:** add new actors to the existing YAML array, without removing those already there
3. **Update team:** overwrite with the new calculation (squad with most commits)
4. **Update updated_at:** today's date
5. **Update updated_by:** `"sync-people"`
6. Update the "Focal Points" section in the markdown body to reflect the merged list
7. Use Edit to apply the changes (do not rewrite the entire file — preserve manual content)

**Identification by login:** Before creating a new file, use Grep to search for `github: "{login}"` in `<VAULT_PATH>/people/*.md`. If found, update that file instead of creating a new one (even if the filename does not match).

At the end of this phase, report: "Phase 4: N people created, M updated."

---

## Phase 5 — Update teams

For each squad that received new people:

1. Use Read to read `teams/{team_slug}.md`
2. Extract the `members` array from the YAML frontmatter
3. For each person in the squad: add `"[[{person_filename_without_ext}]]"` to the array if it does not exist
4. Update `updated_at` and `updated_by: "sync-people"` in the frontmatter
5. Use Edit to apply the changes to the frontmatter

**Do not modify** any other section of the team file.

At the end of this phase, report: "Phase 5: N teams updated. [list of squads → number of members added]."

---

## Phase 6 — Final report

Print a consolidated summary:

```
## Sync People — Report

| Metric | Value |
|---|---|
| Actors scanned | N |
| Repositories accessed | N |
| Inaccessible repositories | N |
| Commits analyzed | N |
| Contributors found | N |
| People created | N |
| People updated | N |
| Teams updated | N |

### People by squad

| Squad | People |
|---|---|
| squad-payments | alice, bob |
| squad-notifications | carol |
| ... | ... |

### Inaccessible repositories

- owner/repo — error (if any)
```

---

## General rules

- **Language:** Use the vault's configured language for content, technical terms in English
- **Filenames:** kebab-case, no accents, lowercase
- **Wikilinks:** no path — `[[name]]`, never `[[people/name]]`
- **Frontmatter:** valid YAML, double quotes for strings with special characters
- **Idempotency:** identify people by `github` login, not by filename
- **Errors:** log and continue — never fail the entire execution for one repo or person
- **No git:** do not commit, push, or perform any git operations
- **No topics:** do not create/update files in `topics/`
- **No actors:** do not modify files in `actors/`

---
---

# Mode: Sync GitHub (--github)




## Overview

This is an **autonomous agent** designed to run in background without human interaction.
It traverses all actors with `status: active` and a populated `repository` field,
fetches recent PRs via GitHub MCP, filters noise, uses LLM semantic matching to correlate
PRs with existing topics/projects in the vault, and delegates updates to `/bedrock:preserve`.

**Operating mode: autonomous.**
- Does NOT ask for confirmation — processes and writes automatically
- Safety guaranteed by: (1) only HIGH confidence correlations generate updates,
  (2) topics/projects receive informational notes (append), never status overwrite,
  (3) medium confidence correlations are recorded in the report for human review
- Generates a report in `fleeting/` at the end of each execution

**For recurring execution:**
- Via `/loop`: `/loop 6h /bedrock:sync --github`
- Via `/schedule`: configure cron with this skill

`/bedrock:sync --github` **does NOT write entities directly** — all entity writing goes through `/bedrock:preserve`.
Exception: watermark fields (`last_synced_at`, `last_synced_sha`) in actor frontmatter are written
directly via Edit (they are not new entities, they are sync metadata).

`/bedrock:sync --github` **does NOT create new topics or projects** — it only updates existing ones.

**You are an autonomous execution agent.** Follow the phases below in order, without skipping steps.
Do NOT ask for user confirmation in any phase.

---

## Phase 0 — Synchronize the Vault

Execute:
```bash
git -C <VAULT_PATH> pull --rebase origin main
```

If the pull fails:
- No remote configured: log "No remote configured. Working locally." and proceed.
- Pull conflict: `git -C <VAULT_PATH> rebase --abort`, log the error and **ABORT** the entire execution.
  Record in the report: "Aborted — git conflict on initial pull."
- Otherwise: proceed.

---

## Phase 1 — Collect Syncable Actors

1. Use Glob to list all files `<VAULT_PATH>/actors/*.md`
2. Exclude `<VAULT_PATH>/actors/_template.md`
3. For each file, use Read to extract from the YAML frontmatter:
   - `status` — actor status
   - `repository` — GitHub repository URL
   - `name` — actor name
   - `last_synced_at` — date of last GitHub sync (may not exist)
   - `last_synced_sha` — SHA of last sync (may not exist)
4. **Filter syncable actors:**
   - Keep only actors with `status: active` (or `in-development`)
   - Keep only actors with a populated `repository` field containing `github.com`
   - Ignore actors with `status: deprecated` (log: "Actor X ignored — deprecated")
   - Ignore actors without `repository` or with an invalid URL (log: "Actor X ignored — no GitHub repository")
5. For each syncable actor, extract `owner/repo` from the URL:
   - Parse the URL: `https://github.com/<owner>/<repo>/` → `owner`, `repo`
   - Remove trailing slashes and `.git` suffix if present
6. Store the list of syncable actors with: `{filename, name, owner, repo, last_synced_at, last_synced_sha}`

Log: "Phase 1: N actors found, M syncable, K ignored (deprecated/no repo)."

---

## Phase 2 — Fetch PRs via GitHub MCP

For each syncable actor, fetch recent PRs:

1. Use GitHub MCP directly (NOT via Agent tool — MCP permissions are not inherited by subagents):
   - `mcp__plugin_github_github__list_pull_requests` with parameters:
     - `owner`: repo owner
     - `repo`: repo name
     - `state`: "all" (open, merged, closed)
     - `sort`: "updated"
     - `per_page`: 20
2. **Filter by watermark:**
   - If the actor has `last_synced_at`: keep only PRs with `updated_at` >= `last_synced_at`
   - If the actor does NOT have `last_synced_at`: keep only PRs from the last 30 days
3. Record for each PR:
   - `number`, `title`, `body` (description), `state` (open/closed), `merged` (bool)
   - `user.login` (author)
   - `updated_at`, `created_at`
   - `head.sha` (latest commit SHA)

> **Best-effort:** If the MCP call fails for an actor (rate limit, private repo, invalid URL):
> - Log the error: "Actor X failed — reason"
> - Continue with the remaining actors
> - Do NOT abort the entire execution for one actor

> **Quick skip:** If no PRs were returned or all PRs are older than the watermark,
> log "Actor X — no relevant activity" and skip to the next actor.

Log: "Phase 2: N actors queried, M with relevant PRs, K without activity, J with errors."

---

## Phase 3 — Filter Noise

For each PR collected in Phase 2, apply noise filters:

### 3.1 Filter by author
Remove PRs from bots and automated tools:
- Author contains `[bot]` or `bot` in login (e.g.: `dependabot[bot]`, `renovate[bot]`, `github-actions[bot]`)
- Author is `dependabot`, `renovate`, `snyk-bot`, `greenkeeper`

### 3.2 Filter by title
Remove PRs with titles indicating automatic or irrelevant changes:
- Title starts with: `Bump `, `chore(deps)`, `build(deps)`, `Update dependency`
- Title contains: `version bump`, `dependency update`, `auto-merge`
- Title is just a version number (e.g.: `v1.2.3`, `1.2.3`)

### 3.3 Record result
For each actor, maintain a list of relevant PRs (post-filter).
If all PRs from an actor were filtered: log "Actor X — all PRs filtered (noise)" and skip.

Log: "Phase 3: N total PRs, M relevant after filter, K filtered as noise."

---

## Phase 4 — LLM Semantic Matching

### 4.1 Load topics and projects catalog

Use Glob + Read to collect:

**Topics (`<VAULT_PATH>/topics/*.md`, excluding `_template.md`):**
- `filename` (without extension)
- `title`
- `aliases`
- `status` (open, in-progress, completed, cancelled)
- `actors` (list of wikilinks)
- `objective`
- `category`

**Projects (`projects/*.md`, excluding `_template.md`):**
- `filename` (without extension)
- `name`
- `aliases`
- `status` (planning, active, blocked, completed)
- `related_actors` (list of wikilinks)
- `blockers`
- `action_items` (list with description, status)
- `progress`

Store as catalog for matching.

### 4.2 Prepare matching batch

For each actor with relevant PRs, build a block:

```
Actor: <actor-name> (<owner>/<repo>)
Relevant PRs:
- PR #<number>: "<title>" (state: <open|closed|merged>, author: <login>, date: <date>)
  Description: <first 200 chars of body>
- PR #<number>: ...
```

### 4.3 Execute semantic matching

With the topics/projects catalog and the PR batch, analyze semantically:

For each relevant PR, determine:

1. **Correlation with topic/project:** Does the PR relate to an existing topic or project?
   - Consider: PR title, description, originating actor, aliases of topics/projects
   - Match by: theme (deprecation, feature, bugfix), mentioned system, aligned objective
   - Do NOT match generically — require clear semantic relationship

2. **Status implication:** If there is a correlation, does the PR imply a status change?
   - Merged PR in an actor listed in an "open" topic → suggests status "in-progress" or "completed"
   - Merged PR that resolves a project blocker → suggests blocker removal
   - Open PR for a feature in a "blocked" topic → suggests status "in-progress"
   - Closed PR without merge → no status implication

3. **Change classification:**
   - `status_hint` — suggested status (e.g.: "in-progress", "completed")
   - `evidence` — evidence description (e.g.: "PR #42 merged implements feature X of topic Y")
   - `confidence` — high, medium, low
   - `entity_type` — "topic" or "project"
   - `entity_name` — topic/project filename

**Matching rules:**
- Prioritize high confidence matches (PR title explicitly mentions the topic/project)
- Discard low confidence matches (vague correlation, only by domain)
- If no PRs from an actor have correlation: record "no correlation" and proceed
- Do NOT create new topics/projects — only correlate with existing ones

### 4.4 Classify results by action level

Separate correlations into two groups:

**HIGH confidence → automatic action:**
- Will be processed automatically in Phase 5 (without human confirmation)
- Criteria: PR title explicitly mentions the topic/project, OR the PR is in an actor
  listed in the `actors`/`related_actors` frontmatter of the topic/project AND the PR theme
  aligns with the topic's `objective` or the project's `progress`/`action_items`

**MEDIUM confidence → report only:**
- Will NOT be processed automatically
- Will be recorded in the final report (Phase 7) for human review
- Criteria: plausible semantic correlation but without explicit evidence

Log: "Phase 4: N correlations (P high confidence → action, Q medium confidence → report). R actors with activity without correlation."

---

## Phase 5 — Delegate to /bedrock:preserve and Update Actors

### 5.1 Compile list for /bedrock:preserve

Build the entity list in the format accepted by `/bedrock:preserve`.
**Include ONLY HIGH confidence correlations + actor activity.**

**For topics with HIGH correlation:**
```yaml
- type: topic
  name: "topic-filename"
  action: update
  content: |
    ## GitHub Activity (sync-github YYYY-MM-DD)

    | PR | Repo | Status | Evidence |
    |---|---|---|---|
    | #42 | billing-api | merged | Implements feature X |

    > [!info] Suggested status: in-progress
    > Based on PR #42 merged in billing-api that implements feature X.
    > Automatically detected by sync-github@agent.
  source: "github"
```

**For projects with HIGH correlation:**
```yaml
- type: project
  name: "project-filename"
  action: update
  content: |
    ## GitHub Activity (sync-github YYYY-MM-DD)

    | PR | Repo | Status | Evidence |
    |---|---|---|---|
    | #15 | orders-api | merged | Resolves blocker Y |

    > [!info] Suggested status: active
    > Based on PR #15 merged in orders-api that resolves blocker Y.
    > Project status reflects a management decision — review this suggestion.
    > Automatically detected by sync-github@agent.
  source: "github"
```

**For actors with relevant activity (all, not just those with correlation):**
```yaml
- type: actor
  name: "actor-name"
  action: update
  content: |
    ## Recent Activity (sync-github YYYY-MM-DD)

    | PR | Title | Status | Author | Date |
    |---|---|---|---|---|
    | #42 | Feature X | merged | alice | 2026-04-10 |
    | #34 | Refactoring Y | open | bob | 2026-04-09 |
  source: "github"
```

**Compilation rules:**
- Content for topics/projects: append-only. Add "GitHub Activity" section with `[!info]` callout suggesting status. NEVER overwrite the `status` field directly.
- Content for actors: merge-ok. The "Recent Activity" section replaces the previous version (if it exists).
- `source: "github"` for all entities
- Bare wikilinks: `[[actor-name]]`, never `[[actors/actor-name]]`

### 5.2 Invoke /bedrock:preserve

Use the Skill tool to invoke `/bedrock:preserve --vault <VAULT_NAME>` passing the structured list as argument.
The `--vault <VAULT_NAME>` flag ensures preserve writes to the same vault.

> **IMPORTANT for background execution:** When invoking `/bedrock:preserve`, include in the
> instruction that `/bedrock:preserve` must also operate without human confirmation.
> Add to the prompt: "Autonomous mode — do not ask for confirmation, process directly."

`/bedrock:preserve` handles:
- Textual matching with existing entities
- Updating existing entities (merge/append-only)
- Bidirectional linking (wikilinks)
- Git commit of entities

### 5.3 Update actor watermarks

After `/bedrock:preserve` completes, update the frontmatter of EACH processed actor (with or without correlation):

1. Use Read to read the actor file
2. Use Edit to update in the frontmatter:
   - `last_synced_at`: today's date (YYYY-MM-DD)
   - `last_synced_sha`: SHA of the most recent commit from the most recent PR (or keep previous if no PRs)
   - `updated_at`: today's date
   - `updated_by`: `"sync-github@agent"`
3. If the fields `last_synced_at` and `last_synced_sha` do not exist: add them to the frontmatter (before `updated_at`)

### 5.4 Git commit of watermarks

```bash
git -C <VAULT_PATH> add actors/
git -C <VAULT_PATH> diff --cached --quiet && echo "Nothing to commit" && exit 0
```

#### Read git strategy

Read the vault's git strategy from `.bedrock/config.json`:

```bash
cat <VAULT_PATH>/.bedrock/config.json 2>/dev/null
```

Extract the `git.strategy` field. If the file does not exist or has no `git` key, default to `"commit-push"`.

Valid values: `"commit-push"`, `"commit-push-pr"`, `"commit-only"`.

Prepare the commit message following the convention:
```
vault(source): syncs github activity for N actors [source: github]
```

#### Dispatch by strategy

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

If it fails 2x: log the error and continue to the report.
If there is no remote: commit locally and log.

---

**Strategy: `commit-push-pr`**

First, check that `gh` is available:

```bash
which gh 2>/dev/null
```

If `gh` is not found: warn the user and **fall back to `commit-push`** strategy (above).

If `gh` is available:

1. **Create a branch.** Derive the branch name from the commit message:

   `vault/<YYYY-MM-DD>-sync-github-<N>-actors` (e.g., `vault/2026-04-15-sync-github-5-actors`)

   Check for collisions:
   ```bash
   git -C <VAULT_PATH> branch --list "vault/<YYYY-MM-DD>-sync-github*"
   ```
   If the branch already exists, append a counter: `vault/2026-04-15-sync-github-5-actors-2`.

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
   cd <VAULT_PATH> && gh pr create --title "<commit message>" --body "Automated by /bedrock:sync" --base main
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

## Phase 6 — Generate Report

Generate a complete execution report and save as a fleeting note.

### 6.1 Build report content

```markdown
---
type: fleeting
name: "sync-github YYYY-MM-DD"
aliases: ["Sync GitHub YYYY-MM-DD"]
status: "raw"
updated_at: YYYY-MM-DD
updated_by: "sync-github@agent"
tags: [type/fleeting, status/raw]
---

# Sync GitHub — YYYY-MM-DD

> Automatic report generated by sync-github@agent.

## Summary

| Metric | Value |
|---|---|
| Actors found | N |
| Actors synchronized | N |
| Actors ignored (deprecated/no repo) | N |
| Actors with error (MCP) | N |
| PRs collected | N |
| Relevant PRs (post-filter) | N |
| PRs filtered (noise) | N |
| High confidence correlations (processed) | N |
| Medium confidence correlations (for review) | N |
| Actors with activity (no correlation) | N |

## Processed Correlations (High Confidence)

| Actor | PR | Entity | Type | Suggested Status | Evidence |
|---|---|---|---|---|---|
| [[billing-api]] | #42 | [[2026-04-feature-x]] | topic | in-progress | PR implements feature X |
| ... | ... | ... | ... | ... | ... |

## Correlations for Human Review (Medium Confidence)

> [!todo] Review correlations below
> These correlations were detected with medium confidence. Review and apply manually if correct.

| Actor | PR | Entity | Type | Suggested Status | Evidence |
|---|---|---|---|---|---|
| [[notification-service]] | #33 | [[2026-04-bugfix-timeout-notifications]] | topic | in-progress | PR title mentions timeout |
| ... | ... | ... | ... | ... | ... |

## Activity by Actor

| Actor | Relevant PRs | Summary |
|---|---|---|
| [[billing-api]] | #42 merged, #43 open | Feature X completed, refactoring Y in progress |
| [[notification-service]] | #33 merged | Timeout fix |
| ... | ... | ... |

## Updated Actors (Watermark)

| Actor | last_synced_at | last_synced_sha |
|---|---|---|
| [[billing-api]] | YYYY-MM-DD | abc1234 |
| ... | ... | ... |

## Errors

| Actor | Error |
|---|---|
| actor-x | MCP timeout |
| ... | ... |

## Git

- Commit (entities): <hash from /bedrock:preserve or "no entities">
- Commit (watermarks): vault(source): syncs github activity [source: github]
- Push: success / failed (reason)
```

### 6.2 Save report

Save the report to `<VAULT_PATH>/fleeting/YYYY-MM-DD-sync-github.md`.

If the file already exists (duplicate execution on the same day): overwrite with most recent data.

### 6.3 Git commit of report

```bash
git -C <VAULT_PATH> add fleeting/
git -C <VAULT_PATH> diff --cached --quiet && echo "Nothing to commit" && exit 0
```

#### Read git strategy

Read the vault's git strategy from `.bedrock/config.json`:

```bash
cat <VAULT_PATH>/.bedrock/config.json 2>/dev/null
```

Extract the `git.strategy` field. If the file does not exist or has no `git` key, default to `"commit-push"`.

Valid values: `"commit-push"`, `"commit-push-pr"`, `"commit-only"`.

Prepare the commit message:
```
vault(note): creates sync-github-report YYYY-MM-DD [source: github]
```

#### Dispatch by strategy

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

If it fails 2x: log the error and continue.
If there is no remote: commit locally and log.

---

**Strategy: `commit-push-pr`**

First, check that `gh` is available:

```bash
which gh 2>/dev/null
```

If `gh` is not found: warn the user and **fall back to `commit-push`** strategy (above).

If `gh` is available:

1. **Create a branch.** Derive the branch name:

   `vault/<YYYY-MM-DD>-sync-github-report` (e.g., `vault/2026-04-15-sync-github-report`)

   Check for collisions:
   ```bash
   git -C <VAULT_PATH> branch --list "vault/<YYYY-MM-DD>-sync-github-report*"
   ```
   If the branch already exists, append a counter.

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
   cd <VAULT_PATH> && gh pr create --title "<commit message>" --body "Automated by /bedrock:sync" --base main
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

## Phase 7 — Finalize

Log final message:

```
sync-github@agent completed.
- Actors processed: N
- Correlations processed (high): N
- Correlations for review (medium): N
- Report: fleeting/YYYY-MM-DD-sync-github.md
```

**Execution ends here.** The agent does not wait for user response.

---

## Critical Rules

| # | Rule |
|---|---|
| 1 | **AUTONOMOUS MODE** — do NOT ask for user confirmation in any phase |
| 2 | **NEVER write entities directly** — all writing of topics/projects/actors goes through `/bedrock:preserve` |
| 3 | **NEVER create new topics or projects** — only update existing ones |
| 4 | **NEVER overwrite status** of topics/projects — only add a note with suggestion via `[!info]` callout |
| 5 | **Only HIGH confidence generates action** — medium confidence correlations go only to the report |
| 6 | **Best-effort for GitHub MCP** — never block due to rate limit or inaccessible repo |
| 7 | **MCP in main context** — do NOT use Agent tool for GitHub MCP calls |
| 8 | **Filter noise before matching** — dependabot, version bumps, bots |
| 9 | **Conservative semantic matching** — discard low confidence correlations |
| 10 | **Maximum 2 push attempts** — after that, log and continue |
| 11 | **Sensitive data** — NEVER include credentials, tokens, passwords, PANs, CVVs |
| 12 | **Frontmatter keys in English**, values in the vault's configured language |
| 13 | **Bare wikilinks** — `[[name]]`, never `[[dir/name]]` |
| 14 | **Append-only for topics** — add information, never delete existing content |
| 15 | **Report always generated** — even if no correlations, generate report in `<VAULT_PATH>/fleeting/` |
| 16 | **Vault resolution first** — resolve `VAULT_PATH` before any file operation or git command — never assume CWD is the vault |
| 17 | **All git commands use `git -C <VAULT_PATH>`** — never assume CWD is the vault |
| 18 | **All entity paths use `<VAULT_PATH>/` prefix** — `<VAULT_PATH>/actors/`, not `actors/` |
| 19 | **Pass --vault to /preserve** — ALWAYS include `--vault <VAULT_NAME>` when delegating to `/bedrock:preserve` |
