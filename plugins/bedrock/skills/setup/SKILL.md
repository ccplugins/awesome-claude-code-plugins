---
name: setup
description: >
  Initialize any folder as a Bedrock-powered Obsidian vault. Creates entity directories,
  copies templates, configures language and domain taxonomy, scaffolds connected example
  entities, and checks dependencies.
  Use when: "bedrock setup", "bedrock-setup", "/bedrock:setup", "initialize vault",
  "setup vault", "create vault", "bootstrap vault", or when a user wants to start
  a new Second Brain with Bedrock.
user_invocable: true
allowed-tools: Bash, Read, Write, Glob, Grep
---

# /bedrock:setup — Vault Initialization

## Plugin Paths

Templates and entity definitions are in the plugin directory, not in the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (auto-injected into context)

Where `<base_dir>` is the path shown in "Base directory for this skill".

---

## Overview

This skill bootstraps any folder into a fully functional Bedrock-powered Obsidian vault
through an interactive guided flow. It creates directories, copies templates, configures
the vault, scaffolds example entities with bidirectional wikilinks, checks dependencies,
and guides the user through next steps.

**You are a setup agent.** Follow the phases below in order. Do not skip steps.

---

## Phase 0 — Idempotency Check

Check if the vault is already initialized:

```bash
ls .bedrock/config.json 2>/dev/null
```

**If `.bedrock/config.json` exists:**

1. Read and display the current configuration:
   ```
   This vault is already initialized:
   - Language: <language>
   - Preset: <preset>
   - Domains: <domains>
   - Git strategy: <git.strategy or "commit-push" if absent>
   - Initialized at: <date>
   ```

2. Check if this vault is registered in the global vault registry:
   ```bash
   cat <base_dir>/../../vaults.json 2>/dev/null
   ```
   If the registry exists, check if any entry has a `path` matching the current working directory.
   - **If registered:** display "Registered as vault `<name>`" alongside the config above.
   - **If NOT registered:** display "This vault is not yet registered in the global vault registry."

3. Ask the user:
   > "This vault is already initialized. What would you like to do?"
   > 1. **Reconfigure** — Update language, domains, git strategy, and regenerate vault CLAUDE.md (directories and entities are NOT touched)
   > 2. **Register only** — Register this vault in the global registry (if not already registered) without changing configuration
   > 3. **Skip** — Exit with no changes

   - **Reconfigure**: proceed to Phase 1, but set `RECONFIGURE_MODE = true`. In Phase 3, skip directory creation (3.1), template copying (3.2), Obsidian configuration (3.5), and example entity generation (3.6). Phase 3.7 (vault registration) still runs.
   - **Register only**: skip directly to Phase 3.7 (vault registration). If already registered, display "This vault is already registered as `<name>`. No changes made." and exit.
   - **Skip**: exit with "No changes made. Vault is already initialized."

**If `.bedrock/config.json` does NOT exist:** proceed to Phase 1 with `RECONFIGURE_MODE = false`.

---

## Phase 1 — Language and Dependencies

### 1.1 Language Selection

Ask the user:

> "What language should vault content be written in?"
> 1. **English (en-US)** *(default)*
> 2. **Portuguese (pt-BR)**
> 3. **Spanish (es)**
> 4. **Other** — specify a locale code (e.g., `fr-FR`, `de-DE`, `ja-JP`)
>
> Press Enter for default (en-US).

Store the selected language as `VAULT_LANGUAGE`. This determines:
- The language of example entity content
- The language directive in the vault CLAUDE.md
- The language instruction for all future skill output in this vault

### 1.2 Dependency Check

Check for external tools, environment variables, and MCP servers that enhance the Bedrock experience.
**Never block initialization.**

**Dependencies to check:**

| Dependency | Check method | What it unlocks |
|---|---|---|
| graphify | Glob: `~/.claude/skills/graphify/SKILL.md` | **Required.** Extraction engine for all `/bedrock:teach` ingestion. Without it, /teach cannot function. |
| docling | Bash: `command -v docling >/dev/null 2>&1` | **Required.** Universal file → markdown converter used by `/bedrock:teach` to ingest DOCX, PPTX, XLSX, HTML, EPUB, PDF, images, and other non-markdown formats. Without it, /teach can only ingest text-native formats. |
| CONFLUENCE_API_TOKEN + CONFLUENCE_USER_EMAIL | Bash: `test -n "$CONFLUENCE_API_TOKEN" && test -n "$CONFLUENCE_USER_EMAIL"` | Confluence page ingestion via `/bedrock:teach` (API strategy). |
| GOOGLE_ACCESS_TOKEN | Bash: `test -n "$GOOGLE_ACCESS_TOKEN"` | Google Docs and Sheets ingestion via `/bedrock:teach` (API strategy). |
| claude-in-chrome MCP | ToolSearch: `select:mcp__claude-in-chrome__tabs_context_mcp` (succeeds = available) | **Optional.** Browser fallback for Confluence pages when API credentials are unavailable. |

### 1.2.1 Auto-install graphify if missing

If the graphify probe in the table above returns no file, attempt to install graphify silently before generating the dependency report. Execute this fallback chain in order, stopping at the first successful re-probe.

**Step 1 — pipx (preferred, isolated):**

```bash
command -v pipx >/dev/null 2>&1 && pipx install graphifyy && graphify install
```

Re-probe: `Glob: ~/.claude/skills/graphify/SKILL.md`. If the file now exists, stop — graphify is installed.

**Step 2 — pip (if pipx unavailable or Step 1 failed):**

Only if Step 1's re-probe still finds nothing, and Python 3.10+ is available:

```bash
{ command -v pip3 >/dev/null 2>&1 || command -v pip >/dev/null 2>&1; } && \
  python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)' 2>/dev/null && \
  { pip3 install graphifyy 2>/dev/null || pip install graphifyy; } && graphify install
```

Re-probe. If found, stop.

**Step 3 — curl (Python 3.10+ not available):**

If Steps 1 and 2 were both unrunnable because `pipx`, `pip`, and Python 3.10+ are all missing, **warn the user explicitly before falling back:**

> ⚠️ Python 3.10+ is not available on this system. Falling back to manual skill install via `curl`. To receive graphify updates through the official installer, install Python 3.10+ and re-run `/bedrock:setup`.

Then:

```bash
mkdir -p ~/.claude/skills/graphify && \
  curl -fsSL https://raw.githubusercontent.com/safishamsi/graphify/v1/skills/graphify/skill.md \
    > ~/.claude/skills/graphify/SKILL.md
```

Re-probe. If found, stop.

**Step 4 — Manual instructions (last resort):**

If all prior steps failed (no network, upstream unavailable, or all tooling missing), print the graphify warning shown in Section 1.2.2 below. Do not abort — setup continues regardless.

**Note on package name:** The PyPI package is currently published as `graphifyy` — temporary while the upstream project reclaims the `graphify` name. When that flip happens, update Steps 1 and 2 to `pip install graphify && graphify install`.

**After the chain completes**, run one final `Glob: ~/.claude/skills/graphify/SKILL.md`. The graphify row in the dependency-report table (Section 1.2.2 below) MUST reflect this post-install status — `installed` if the file now exists, `NOT FOUND` otherwise. Proceed to Section 1.2.2 regardless of outcome. **Never block initialization.**

### 1.2.1.1 Auto-install docling if missing

If the docling probe (`command -v docling`) returns nothing, attempt a silent install using the same fallback chain as graphify. Emit a one-line status message before starting — no interactive prompt.

> docling not found — installing silently (one-time setup; first run may take several minutes to download ML models).

**Step 1 — pipx (preferred, isolated):**

```bash
command -v pipx >/dev/null 2>&1 && pipx install docling
```

Re-probe: `command -v docling`. If found, stop.

**Step 2 — pip (if pipx unavailable or Step 1 failed):**

```bash
{ command -v pip3 >/dev/null 2>&1 || command -v pip >/dev/null 2>&1; } && \
  { pip3 install --user docling 2>/dev/null || pip install --user docling; }
```

Re-probe. If found, stop.

**Step 3 — Manual instructions (last resort):**

If both steps failed (no `pipx`/`pip`, no network, or a permissions error), print the docling warning shown in Section 1.2.2 below. Do not abort — setup continues regardless.

**After the chain completes**, run one final `command -v docling` probe. The docling row in the dependency-report table (Section 1.2.2 below) MUST reflect this post-install status — `installed` if the command is now on PATH, `NOT FOUND` otherwise. Proceed to Section 1.2.2 regardless of outcome. **Never block initialization.**

### 1.2.2 Report status

**Report format:**

```
## Dependency Check

| Dependency | Status | What it unlocks |
|---|---|---|
| graphify | installed / NOT FOUND | Extraction engine for /teach |
| docling | installed / NOT FOUND | Universal file → markdown converter for /teach |
| Confluence API credentials | configured / NOT SET | Confluence page ingestion (API) |
| Google API token | configured / NOT SET | Google Docs/Sheets ingestion (API) |
| claude-in-chrome MCP | available / NOT FOUND | Browser fallback for Confluence |

### Source availability summary
| Source type | Status | Requirements |
|---|---|---|
| Confluence | ready / partial / unavailable | API credentials or Chrome extension |
| Google Docs | ready / limited / unavailable | API token or public documents only |
| Google Sheets | ready / limited / unavailable | API token (all tabs) or public (first tab only) |
| GitHub | ready | git CLI |
| Remote URL | ready | WebFetch or curl |
| Local files | ready | filesystem access |
| Non-markdown files (DOCX, PPTX, XLSX, PDF, HTML, EPUB, images) | ready / unavailable | docling installed |
```

For **graphify** specifically (required):

```
> graphify is not installed. This is REQUIRED for /bedrock:teach to work.
> To install, check https://github.com/safishamsi/graphify for instructions.
>
> Your vault will initialize, but /bedrock:teach will not function until graphify is installed.
```

For **docling** specifically (required for non-markdown ingestion):

```
> docling is not installed. This is REQUIRED for /bedrock:teach to ingest non-markdown files
> (DOCX, PPTX, XLSX, PDF, HTML, EPUB, images, etc.).
> To install manually: pipx install docling  (or: pip install --user docling)
> More info: https://github.com/docling-project/docling
>
> Your vault will initialize, but /bedrock:teach will only handle markdown/text inputs until
> docling is installed. /teach also attempts a silent auto-install on first invocation if the
> dependency is still missing.
```

For missing environment variables (optional):

```
> CONFLUENCE_API_TOKEN and CONFLUENCE_USER_EMAIL are not set.
> To ingest Confluence pages, generate an API token at:
> https://id.atlassian.com/manage-profile/security/api-tokens
> Then set: CONFLUENCE_API_TOKEN=<token> and CONFLUENCE_USER_EMAIL=<your-email>
>
> Alternative: If you have the Claude in Chrome extension with Confluence logged in, browser extraction will work as a fallback.
> This is optional — your vault will work without Confluence ingestion.
```

```
> GOOGLE_ACCESS_TOKEN is not set.
> To ingest Google Docs/Sheets, generate an access token at:
> https://developers.google.com/oauthplayground/
> Select scope: https://www.googleapis.com/auth/drive.readonly
> Then set: GOOGLE_ACCESS_TOKEN=<token>
>
> Public Google Docs/Sheets can still be ingested without a token (limited).
> This is optional — your vault will work without Google ingestion.
```

**Proceed regardless of results.** Never block initialization for missing dependencies.

---

## Phase 2 — Vault Objective

### 2.1 Present Presets

Ask the user:

> "What is the primary purpose of this vault?"
>
> 1. **Engineering team** — Track services, APIs, teams, and technical decisions
> 2. **Product management** — Track features, research, projects, and analytics
> 3. **Company wiki** — Centralized knowledge base across departments
> 4. **Personal second brain** — Personal knowledge management and learning
> 5. **Open source project** — Track contributors, issues, architecture, and community
> 6. **Custom** — Define your own domains and focus

### 2.2 Resolve Preset

Based on the user's selection, resolve the preset configuration from this lookup table:

```yaml
presets:
  engineering:
    label: "Engineering team"
    domains: [backend, frontend, infra, data, platform, security]
    description: "Engineering team knowledge base for tracking services, APIs, technical decisions, and team operations"
    team_name: "platform-team"
    team_aliases: ["Platform", "Platform Team"]
    team_scope: "Core platform services and infrastructure"
    team_purpose: "Maintain and evolve the platform layer"
    people:
      - slug: "alice-chen"
        name: "Alice Chen"
        aliases: ["Alice Chen", "Alice"]
        role: "Tech Lead"
        email: "alice.chen@company.com"
        focal_points: ["billing-api"]
      - slug: "bob-santos"
        name: "Bob Santos"
        aliases: ["Bob Santos", "Bob"]
        role: "Backend Engineer"
        email: "bob.santos@company.com"
        focal_points: []
    actor_slug: "billing-api"
    actor_name: "billing-api"
    actor_aliases: ["Billing API", "Billing Service"]
    actor_category: "api"
    actor_description: "REST API for billing operations — invoices, payments, and subscriptions"
    actor_stack: "Go · Gin · PostgreSQL · Kafka"
    actor_status: "active"
    actor_criticality: "high"
    topic_slug: "2026-04-feature-api-migration"
    topic_title: "API v2 Migration"
    topic_aliases: ["API Migration", "v2 Migration"]
    topic_category: "feature"
    topic_objective: "Migrate billing API from v1 to v2 with improved performance and new endpoints"
    project_slug: "platform-modernization"
    project_name: "Platform Modernization"
    project_aliases: ["Platform Modernization", "PlatMod"]
    project_description: "Modernize the platform layer with new APIs, improved observability, and reduced technical debt"

  product:
    label: "Product management"
    domains: [product, design, research, analytics, growth]
    description: "Product management knowledge base for tracking features, user research, projects, and product analytics"
    team_name: "product-team"
    team_aliases: ["Product", "Product Team"]
    team_scope: "Product strategy, discovery, and delivery"
    team_purpose: "Drive product roadmap and user experience"
    people:
      - slug: "carol-kim"
        name: "Carol Kim"
        aliases: ["Carol Kim", "Carol"]
        role: "Product Manager"
        email: "carol.kim@company.com"
        focal_points: ["analytics-dashboard"]
      - slug: "david-mueller"
        name: "David Mueller"
        aliases: ["David Mueller", "David"]
        role: "UX Researcher"
        email: "david.mueller@company.com"
        focal_points: []
    actor_slug: "analytics-dashboard"
    actor_name: "analytics-dashboard"
    actor_aliases: ["Analytics Dashboard", "Dashboard"]
    actor_category: "api"
    actor_description: "Web dashboard for product analytics — funnels, cohorts, and feature adoption tracking"
    actor_stack: "TypeScript · Next.js · PostgreSQL · ClickHouse"
    actor_status: "active"
    actor_criticality: "medium"
    topic_slug: "2026-04-feature-user-research-q1"
    topic_title: "Q1 User Research Findings"
    topic_aliases: ["User Research Q1", "Q1 Research"]
    topic_category: "feature"
    topic_objective: "Synthesize Q1 user research findings into actionable product decisions"
    project_slug: "product-launch-v2"
    project_name: "Product Launch v2"
    project_aliases: ["Product Launch v2", "PLv2"]
    project_description: "Launch the redesigned product experience with improved onboarding and analytics"

  company-wiki:
    label: "Company wiki"
    domains: [engineering, product, operations, finance, hr, legal]
    description: "Company-wide knowledge base for cross-department collaboration and institutional memory"
    team_name: "operations-team"
    team_aliases: ["Operations", "Operations Team"]
    team_scope: "Cross-functional operations and internal tooling"
    team_purpose: "Ensure smooth operations and knowledge sharing across departments"
    people:
      - slug: "emma-silva"
        name: "Emma Silva"
        aliases: ["Emma Silva", "Emma"]
        role: "Operations Lead"
        email: "emma.silva@company.com"
        focal_points: ["internal-portal"]
      - slug: "frank-weber"
        name: "Frank Weber"
        aliases: ["Frank Weber", "Frank"]
        role: "Knowledge Manager"
        email: "frank.weber@company.com"
        focal_points: []
    actor_slug: "internal-portal"
    actor_name: "internal-portal"
    actor_aliases: ["Internal Portal", "Company Portal"]
    actor_category: "monolith"
    actor_description: "Internal web portal for employee self-service — HR, IT requests, and knowledge base access"
    actor_stack: "Python · Django · PostgreSQL · Redis"
    actor_status: "active"
    actor_criticality: "medium"
    topic_slug: "2026-04-feature-onboarding-process"
    topic_title: "New Employee Onboarding Process"
    topic_aliases: ["Onboarding Process", "New Hire Onboarding"]
    topic_category: "feature"
    topic_objective: "Standardize the onboarding process for new employees across all departments"
    project_slug: "knowledge-base-rollout"
    project_name: "Knowledge Base Rollout"
    project_aliases: ["KB Rollout", "Knowledge Base Rollout"]
    project_description: "Roll out the structured knowledge base across all departments with Bedrock automation"

  personal:
    label: "Personal second brain"
    domains: [learning, career, projects, ideas, health, finance]
    description: "Personal knowledge management vault for learning, projects, ideas, and life organization"
    team_name: null  # No team for personal vault
    people:
      - slug: "me"
        name: "Me"
        aliases: ["Me"]
        role: "Owner"
        email: ""
        focal_points: ["reading-tracker"]
    actor_slug: "reading-tracker"
    actor_name: "reading-tracker"
    actor_aliases: ["Reading Tracker", "Book Tracker"]
    actor_category: "monolith"
    actor_description: "Personal tool for tracking books, articles, and learning resources"
    actor_stack: "Markdown · Obsidian · Dataview"
    actor_status: "active"
    actor_criticality: "low"
    topic_slug: "2026-04-feature-learning-rust"
    topic_title: "Learning Rust"
    topic_aliases: ["Learning Rust", "Rust Journey"]
    topic_category: "feature"
    topic_objective: "Track progress and notes while learning the Rust programming language"
    project_slug: "side-project-alpha"
    project_name: "Side Project Alpha"
    project_aliases: ["Side Project Alpha", "SPA"]
    project_description: "Build a personal side project to apply new skills and explore interesting technology"

  open-source:
    label: "Open source project"
    domains: [core, docs, community, ci-cd, integrations]
    description: "Open source project knowledge base for tracking architecture, contributors, issues, and community"
    team_name: "core-maintainers"
    team_aliases: ["Core Maintainers", "Maintainers"]
    team_scope: "Core library development and release management"
    team_purpose: "Maintain the core library and coordinate community contributions"
    people:
      - slug: "alice-chen"
        name: "Alice Chen"
        aliases: ["Alice Chen", "Alice"]
        role: "Lead Maintainer"
        email: "alice.chen@project.org"
        focal_points: ["my-oss-lib"]
      - slug: "bob-santos"
        name: "Bob Santos"
        aliases: ["Bob Santos", "Bob"]
        role: "Core Contributor"
        email: "bob.santos@project.org"
        focal_points: []
    actor_slug: "my-oss-lib"
    actor_name: "my-oss-lib"
    actor_aliases: ["My OSS Lib", "The Library"]
    actor_category: "monolith"
    actor_description: "Core open source library — the main project repository"
    actor_stack: "TypeScript · Node.js · Jest · GitHub Actions"
    actor_status: "active"
    actor_criticality: "very-high"
    topic_slug: "2026-04-feature-v2-migration"
    topic_title: "v2 Migration Guide"
    topic_aliases: ["v2 Migration", "Migration Guide"]
    topic_category: "feature"
    topic_objective: "Plan and document the migration path from v1 to v2 for all users"
    project_slug: "v2-roadmap"
    project_name: "v2 Roadmap"
    project_aliases: ["v2 Roadmap", "Version 2"]
    project_description: "Roadmap for the v2 release — breaking changes, new features, and migration tooling"
```

### 2.3 Custom Preset

If the user selects **Custom**:

1. Ask: "What is the purpose of this vault? (1-2 sentences)"
   - Store as `description`

2. Ask: "List 3-6 domain tags for your vault (comma-separated). These will be used as `domain/*` tags."
   - Example: "backend, frontend, mobile, data, devops"
   - Store as `domains`

3. Ask: "Would you like me to generate example entities, or skip them?"
   - If generate: ask for a team name, 2 people names, an actor name (or use generic defaults: `example-team`, `alice-example`, `bob-example`, `example-service`, `example-topic`, `example-project`)
   - If skip: set `SKIP_EXAMPLES = true`

Build a custom preset object following the same structure as the named presets.
For fields not provided by the user, use sensible generic defaults.

### 2.4 Git Strategy Selection

Ask the user:

> "How should Bedrock handle git commits and pushes?"
>
> 1. **commit-push** *(default)* — Commit and push directly to `main` (trunk-based)
> 2. **commit-push-pr** — Commit to a branch, push, and open a pull request targeting `main`
> 3. **commit-only** — Commit locally without pushing (for offline or local-only vaults)
>
> Press Enter for default (commit-push).

Store the selected strategy as `GIT_STRATEGY`.

**If the user selects `commit-push-pr`:**

Check if the `gh` CLI is available:

```bash
which gh 2>/dev/null
```

If `gh` is not found, warn:

```
> ⚠️ The `gh` CLI is not installed. The `commit-push-pr` strategy requires it to create pull requests.
> Install it from https://cli.github.com/ before using /bedrock:preserve, /bedrock:compress, or /bedrock:sync.
>
> You can still select this strategy — skills will fall back to `commit-push` if `gh` is not available at runtime.
```

Proceed regardless — never block initialization for missing tools.

---

## Phase 3 — Scaffold

### 3.1 Create Entity Directories

> **Skip if `RECONFIGURE_MODE = true`.**

Create all 7 entity directories:

```bash
mkdir -p actors people teams topics discussions projects fleeting
```

If any directory already exists, this is a no-op (safe).

### 3.2 Copy Templates

> **Skip if `RECONFIGURE_MODE = true`.**

For each entity type, read the template from the plugin and write it to the vault:

| Source (plugin) | Destination (vault) |
|---|---|
| `<base_dir>/../../templates/actors/_template.md` | `actors/_template.md` |
| `<base_dir>/../../templates/people/_template.md` | `people/_template.md` |
| `<base_dir>/../../templates/teams/_template.md` | `teams/_template.md` |
| `<base_dir>/../../templates/topics/_template.md` | `topics/_template.md` |
| `<base_dir>/../../templates/discussions/_template.md` | `discussions/_template.md` |
| `<base_dir>/../../templates/projects/_template.md` | `projects/_template.md` |
| `<base_dir>/../../templates/fleeting/_template.md` | `fleeting/_template.md` |

For each template:
1. Use Read to read the source file from the plugin directory
2. Use Write to write it to the vault directory

**Copy templates verbatim.** Do not translate or modify them.

If a `_template.md` already exists in the destination, **overwrite it** — templates should
always match the latest plugin version.

> **Fallback:** If a template file cannot be read (path resolution fails), report:
> "Could not copy template for `<type>`. You can manually copy it from the plugin's
> `templates/<type>/_template.md` directory."

### 3.3 Create `.bedrock/config.json`

Create the `.bedrock/` directory and write the configuration:

```bash
mkdir -p .bedrock
```

Write `.bedrock/config.json` with this schema:

```json
{
  "version": "1.0.0",
  "language": "<VAULT_LANGUAGE>",
  "preset": "<selected preset name>",
  "domains": ["<domain1>", "<domain2>", "..."],
  "git": {
    "strategy": "<GIT_STRATEGY>"
  },
  "initialized_at": "<today's date YYYY-MM-DD>",
  "initialized_by": "init@agent"
}
```

**Field definitions:**
- `version`: Always `"1.0.0"` — schema version for future migrations
- `language`: The language code from Phase 1 (e.g., `"en-US"`, `"pt-BR"`)
- `preset`: The selected preset name (e.g., `"engineering"`, `"personal"`, `"custom"`)
- `domains`: Array of domain strings resolved from the preset
- `git.strategy`: The git strategy from Phase 2.3. Valid values: `"commit-push"`, `"commit-push-pr"`, `"commit-only"`. If omitted, defaults to `"commit-push"`.
- `initialized_at`: Today's date in `YYYY-MM-DD` format
- `initialized_by`: Always `"init@agent"`

### 3.4 Generate Vault CLAUDE.md

Write a `CLAUDE.md` file at the vault root with content tailored to the selected preset and language.

**IMPORTANT:** This file describes THIS SPECIFIC VAULT — its purpose, language, and conventions.
It does NOT duplicate the plugin's CLAUDE.md (which covers writing rules, entity types, tags, git workflow, and zettelkasten principles — all auto-loaded by Claude Code when the plugin is active).

**Template for vault CLAUDE.md:**

```markdown
# <Vault Name> — CLAUDE.md

> This vault is powered by the [Bedrock plugin](https://github.com/iurykrieger/claude-bedrock).
> Plugin-level instructions (entity types, writing rules, tags, git workflow) are loaded automatically.
> This file describes what is specific to THIS vault.

## Purpose

<vault description from preset>

## Language

All content in this vault is written in **<language name> (<locale code>)**.
When creating or updating entities, use <language name> for all text content.
Frontmatter keys remain in English. Technical terms in English are acceptable.

## Domains

This vault uses the following domain tags:

<list of domain/* tags>

When creating entities, use `domain/<name>` tags from this list.
New domains can be added as the vault grows.

## Quick Reference

| Action | Skill |
|---|---|
| Search and query the vault | `/bedrock:ask` |
| Ingest external sources (Confluence, Google Docs, GitHub repositories, remote URLs, and any docling-supported file format — DOCX, PPTX, XLSX, PDF, HTML, EPUB, images, and more) | `/bedrock:teach` |
| Create or update entities manually | `/bedrock:preserve` |
| Deduplicate and check vault health | `/bedrock:compress` |
| Re-sync entities with external sources | `/bedrock:sync` |
```

**Adaptation rules:**
- `<Vault Name>`: Derive from the preset label or use the folder name. For custom presets, use the user's stated purpose.
- `<vault description>`: Use the preset's `description` field.
- `<language name>`: Full language name (e.g., "English", "Portuguese", "Spanish").
- `<locale code>`: The `VAULT_LANGUAGE` value (e.g., `en-US`, `pt-BR`).
- `<list of domain/* tags>`: Format as a markdown list: `- domain/backend`, `- domain/frontend`, etc.

**Write all CLAUDE.md content in the selected `VAULT_LANGUAGE`.**
If the language is pt-BR, write sections headers and descriptions in Portuguese.
If en-US, write in English. Etc.

### 3.5 Create Obsidian Configuration

> **Skip if `RECONFIGURE_MODE = true`.**

Create a `.obsidian/` directory with default configuration files so the vault is
ready to use in Obsidian immediately — with wikilinks, a color-coded graph view,
and a minimal plugin setup.

**Step 1:** Create the `.obsidian/` directory:

```bash
mkdir -p .obsidian
```

**Step 2:** For each config file below, check if it already exists. If it does,
skip it and log `"Skipped .obsidian/<file> — already exists"`. If it does not exist,
create it with the content specified.

#### `.obsidian/app.json`

```json
{
  "useMarkdownLinks": false,
  "newLinkFormat": "shortest",
  "strictLineBreaks": false,
  "showFrontmatter": true
}
```

- `useMarkdownLinks: false` — Obsidian uses wikilinks (matches Bedrock's `[[name]]` convention)
- `newLinkFormat: "shortest"` — generates bare `[[name]]` links without path prefix
- `showFrontmatter: true` — frontmatter is central to Bedrock entities; visible by default

#### `.obsidian/appearance.json`

```json
{
  "baseFontSize": 16,
  "theme": "obsidian"
}
```

- `theme: "obsidian"` — Obsidian's built-in dark theme. Clean, high-contrast.

#### `.obsidian/graph.json`

```json
{
  "collapse-filter": true,
  "search": "",
  "showTags": false,
  "showAttachments": false,
  "hideUnresolved": false,
  "showOrphans": true,
  "collapse-color-groups": false,
  "colorGroups": [
    {
      "query": "tag:#type/actor",
      "color": { "a": 1, "rgb": 4886745 }
    },
    {
      "query": "tag:#type/person",
      "color": { "a": 1, "rgb": 5294200 }
    },
    {
      "query": "tag:#type/team",
      "color": { "a": 1, "rgb": 15241530 }
    },
    {
      "query": "tag:#type/topic",
      "color": { "a": 1, "rgb": 10181046 }
    },
    {
      "query": "tag:#type/discussion",
      "color": { "a": 1, "rgb": 15844367 }
    },
    {
      "query": "tag:#type/project",
      "color": { "a": 1, "rgb": 15158332 }
    },
    {
      "query": "tag:#type/fleeting",
      "color": { "a": 1, "rgb": 9807270 }
    }
  ],
  "collapse-display": true,
  "showArrow": false,
  "textFadeMultiplier": 0,
  "nodeSizeMultiplier": 1,
  "lineSizeMultiplier": 1,
  "collapse-forces": true,
  "centerStrength": 0.5,
  "repelStrength": 10,
  "linkStrength": 1,
  "linkDistance": 250,
  "scale": 1,
  "close": false
}
```

**Color palette (7 entity types):**

| Entity | Tag query | Color | RGB int |
|---|---|---|---|
| actor | `tag:#type/actor` | Blue (#4A90D9) | `4886745` |
| person | `tag:#type/person` | Green (#50C878) | `5294200` |
| team | `tag:#type/team` | Orange (#E8913A) | `15241530` |
| topic | `tag:#type/topic` | Purple (#9B59B6) | `10181046` |
| discussion | `tag:#type/discussion` | Gold (#F1C40F) | `15844367` |
| project | `tag:#type/project` | Red (#E74C3C) | `15158332` |
| fleeting | `tag:#type/fleeting` | Grey (#95A5A6) | `9807270` |

Key graph settings:
- `collapse-color-groups: false` — color groups panel starts expanded so users see the mapping
- `showTags: false` — tag nodes hidden to keep graph focused on entities
- `showOrphans: true` — orphan entities visible for vault health

#### `.obsidian/core-plugins.json`

```json
["graph"]
```

- Only `graph` enabled — the minimum required for the color groups to work.
  All other core plugins are disabled for a clean experience.

**Step 3:** Track the results for the setup summary (Phase 4). For each file,
record whether it was `Created` or `Skipped (already exists)`.

### 3.6 Create Example Entities

> **Skip if `RECONFIGURE_MODE = true` or `SKIP_EXAMPLES = true`.**

Using the resolved preset data from Phase 2, create connected example entities.
**Write all entity content in the selected `VAULT_LANGUAGE`.**

The entities form a mini-graph where every wikilink has a matching backlink.

#### 3.6.1 Determine Entity Set

**For all presets except `personal`:** Create 6 entities:
1. Team: `teams/<team_name>.md`
2. Person 1: `people/<person1_slug>.md`
3. Person 2: `people/<person2_slug>.md`
4. Actor: `actors/<actor_slug>.md`
5. Topic: `topics/<topic_slug>.md`
6. Project: `projects/<project_slug>.md`

**For `personal` preset:** Create 4 entities (no team):
1. Person: `people/<person_slug>.md`
2. Actor: `actors/<actor_slug>.md`
3. Topic: `topics/<topic_slug>.md`
4. Project: `projects/<project_slug>.md`

#### 3.6.2 Create Team Entity

> **Skip for `personal` preset.**

Read the team template from `<base_dir>/../../templates/teams/_template.md` as structural reference.

Write `teams/<team_name>.md`:

```markdown
---
type: team
name: "<team_name>"
aliases: <team_aliases as YAML array>
scope: "<team_scope>"
purpose: "<team_purpose>"
members: ["[[<person1_slug>]]", "[[<person2_slug>]]"]
actors: ["[[<actor_slug>]]"]
jira_board: ""
confluence_space: ""
sources: []
updated_at: <today YYYY-MM-DD>
updated_by: "init@agent"
tags: [type/team, domain/<first_domain>]
---

# <team display name>

> <team_scope>. <team_purpose>.

## Members

| Person | Role |
|---|---|
| [[<person1_slug>]] | <person1_role> |
| [[<person2_slug>]] | <person2_role> |

## Actors under Ownership

| Actor | Category | Status |
|---|---|---|
| [[<actor_slug>]] | <actor_category> | <actor_status> |

## Responsibilities

- <responsibility derived from team_scope>
- <responsibility derived from team_purpose>
```

#### 3.6.3 Create Person Entities

Read the person template from `<base_dir>/../../templates/people/_template.md` as structural reference.

**For each person in the preset's `people` array**, write `people/<person_slug>.md`:

```markdown
---
type: person
name: "<person_name>"
aliases: <person_aliases as YAML array>
role: "<person_role>"
team: "[[<team_name>]]"
focal_points: <person_focal_points as wikilink array, e.g. ["[[billing-api]]"]>
email: "<person_email>"
github: ""
slack: ""
jira: ""
sources: []
updated_at: <today YYYY-MM-DD>
updated_by: "init@agent"
tags: [type/person, domain/<first_domain>]
---

# <person_name>

> <person_role> on [[<team_name>]]. <brief context about their focus>.

## Team

Member of [[<team_name>]].

## Focal Points

<for each focal_point:>
- [[<focal_point>]] — <brief involvement context>

## Active Topics

- [[<topic_slug>]] — <brief description>

## Projects

- [[<project_slug>]] — <brief description>
```

**For `personal` preset:** Omit the `team` field (set to `""`), omit the `Team` section, and write only 1 person entity.

#### 3.6.4 Create Actor Entity

Read the actor template from `<base_dir>/../../templates/actors/_template.md` as structural reference.

Write `actors/<actor_slug>.md`:

```markdown
---
type: actor
name: "<actor_name>"
aliases: <actor_aliases as YAML array>
category: "<actor_category>"
description: "<actor_description>"
repository: ""
stack: "<actor_stack>"
status: "<actor_status>"
team: "[[<team_name>]]"
criticality: "<actor_criticality>"
pci: false
known_issues: []
sources: []
last_synced_at: ""
last_synced_sha: ""
updated_at: <today YYYY-MM-DD>
updated_by: "init@agent"
tags: [type/actor, status/<actor_status>, domain/<first_domain>]
---

# <actor display name>

> <actor_description>.

## Details

| Field | Value |
|---|---|
| Repository | — |
| Stack | <actor_stack> |
| Status | <actor_status> |
| Criticality | <actor_criticality> |
| PCI | no |
| Team | [[<team_name>]] |

## Dependencies

- No dependencies documented yet.

## Related Topics

- [[<topic_slug>]] — <brief description>

## Related Projects

- [[<project_slug>]] — <brief description>
```

**For `personal` preset:** Set `team` to `""` and omit the Team row from the Details table.

#### 3.6.5 Create Topic Entity

Read the topic template from `<base_dir>/../../templates/topics/_template.md` as structural reference.

Write `topics/<topic_slug>.md`:

```markdown
---
type: topic
title: "<topic_title>"
aliases: <topic_aliases as YAML array>
category: "<topic_category>"
status: "open"
people: ["[[<person1_slug>]]"]
actors: ["[[<actor_slug>]]"]
objective: "<topic_objective>"
created_at: <today YYYY-MM-DD>
sources: []
updated_at: <today YYYY-MM-DD>
updated_by: "init@agent"
tags: [type/topic, status/open, category/<topic_category>, domain/<first_domain>]
---

# <topic_title>

> <topic_objective>.

## Context

This topic was created as an example during vault initialization. Replace this content
with real context about the topic's background and motivation.

## People Involved

| Person | Role |
|---|---|
| [[<person1_slug>]] | focal point |

## Actors Involved

| Actor | Relation |
|---|---|
| [[<actor_slug>]] | affected system |

## History

| Date | Event |
|---|---|
| <today YYYY-MM-DD> | Topic created during vault initialization |

## Decisions

- No decisions recorded yet.

## Next Steps

- [ ] Replace this example content with real information
- [ ] Link to related topics and discussions

## Related Projects

- [[<project_slug>]] — <brief description>
```

#### 3.6.6 Create Project Entity

Read the project template from `<base_dir>/../../templates/projects/_template.md` as structural reference.

Write `projects/<project_slug>.md`:

```markdown
---
type: project
name: "<project_name>"
aliases: <project_aliases as YAML array>
description: "<project_description>"
status: "planning"
deadline: ""
progress: "Vault initialized — project tracking setup complete"
blockers: []
action_items:
  - description: "Replace example content with real project data"
    status: "todo"
    deadline: ""
    owner: "[[<person1_slug>]]"
focal_points: ["[[<person1_slug>]]"]
related_topics: ["[[<topic_slug>]]"]
related_actors: ["[[<actor_slug>]]"]
related_teams: ["[[<team_name>]]"]
sources: []
updated_at: <today YYYY-MM-DD>
updated_by: "init@agent"
tags: [type/project, status/planning, domain/<first_domain>]
---

# <project_name>

> <project_description>.

## Overview

This project was created as an example during vault initialization. Replace this content
with the real project description, motivation, and expected outcomes.

## Status

| Field | Value |
|---|---|
| Status | planning |
| Deadline | — |
| Progress | Vault initialized — project tracking setup complete |

## Action Items

| Item | Status | Deadline | Owner |
|---|---|---|---|
| Replace example content with real project data | todo | — | [[<person1_slug>]] |

## Focal Points

| Person | Role |
|---|---|
| [[<person1_slug>]] | lead |

## Related Topics

| Topic | Relation |
|---|---|
| [[<topic_slug>]] | related topic |

## Related Actors

| Actor | Relation |
|---|---|
| [[<actor_slug>]] | affected system |

## Related Teams

| Team | Relation |
|---|---|
| [[<team_name>]] | owning team |
```

**For `personal` preset:** Remove the `related_teams` field and the "Related Teams" section.

#### 3.6.7 Verify Bidirectional Links

After creating all entities, verify the wikilink graph is fully bidirectional.

**Expected links (non-personal presets):**

```
Team → Person 1: members[] ✓ | Person 1 → Team: team field ✓
Team → Person 2: members[] ✓ | Person 2 → Team: team field ✓
Team → Actor: actors[] ✓ | Actor → Team: team field ✓
Topic → Person 1: people[] ✓ | Person 1 → Topic: "Active Topics" ✓
Topic → Actor: actors[] ✓ | Actor → Topic: "Related Topics" ✓
Project → Person 1: focal_points[] ✓ | Person 1 → Project: "Projects" ✓
Project → Actor: related_actors[] ✓ | Actor → Project: "Related Projects" ✓
Project → Team: related_teams[] ✓
Project → Topic: related_topics[] ✓ | Topic → Project: "Related Projects" ✓
```

Use Grep to spot-check that each entity file contains the expected wikilinks
to its connected entities. If any link is missing, fix it before proceeding.

### 3.7 Register Vault in Global Registry

> **This phase runs in ALL modes** — fresh setup, reconfigure, and register-only.

Register this vault in the plugin's global vault registry so it can be targeted
by name from any directory using `--vault <name>`.

**Step 1:** Resolve the registry path:

```
REGISTRY_PATH = <base_dir>/../../vaults.json
```

**Step 2:** Read the existing registry (if it exists):

```bash
cat <REGISTRY_PATH> 2>/dev/null
```

If the file does not exist or is empty, initialize an empty registry:
```json
{
  "vaults": []
}
```

**Step 3:** Check if this vault is already registered (match by absolute path of CWD):

- **If already registered:** display "This vault is already registered as `<name>`." and skip to Phase 4.
- **If not registered:** continue to Step 4.

**Step 4:** Prompt the user for a vault name:

> "Choose a name for this vault. This name is used with `--vault <name>` to target this vault from any directory."
> Default: `<basename of CWD>`

Validate the name:
- Must be kebab-case: lowercase, no spaces, only letters, numbers, and hyphens
- Must be unique across all registered vaults
- If invalid or duplicate, ask the user to choose another name

**Step 5:** Determine default status:

- If the registry has no other vaults (empty `vaults` array), mark this vault as default (`"default": true`)
- If other vaults exist, ask the user:
  > "Set this vault as the default? (current default: `<current_default_name>`) [y/N]"
  - If yes: set `"default": true` on this vault and `"default": false` on all others
  - If no: set `"default": false`

**Step 6:** Append the vault entry and write the registry:

```json
{
  "name": "<vault_name>",
  "path": "<absolute path of CWD>",
  "default": true | false
}
```

Write the updated registry to `REGISTRY_PATH` using the Write tool. Format with 2-space indentation.

**Step 7:** Confirm:

```
Vault registered as `<vault_name>` (<path>).
<if default:> This is your default vault.
<if not default:> Default vault is `<current_default_name>`. Use `/bedrock:vaults --set-default <vault_name>` to change.
```

---

## Phase 4 — Next Steps Guide

After all files are created, present the user with a summary and next steps.

**Summary format:**

```
## Vault Initialized

**Language:** <language>
**Preset:** <preset label>
**Domains:** <comma-separated domains>
**Vault name:** <vault_name> <if default: "(default)">

### Files Created

| Type | Path |
|---|---|
| Config | .bedrock/config.json |
| CLAUDE.md | CLAUDE.md |
| Obsidian | .obsidian/app.json |
| Obsidian | .obsidian/appearance.json |
| Obsidian | .obsidian/graph.json |
| Obsidian | .obsidian/core-plugins.json |
| Template | actors/_template.md |
| Template | people/_template.md |
| Template | teams/_template.md |
| Template | topics/_template.md |
| Template | discussions/_template.md |
| Template | projects/_template.md |
| Template | fleeting/_template.md |
| Example | teams/<team>.md |
| Example | people/<person1>.md |
| Example | people/<person2>.md |
| Example | actors/<actor>.md |
| Example | topics/<topic>.md |
| Example | projects/<project>.md |

### What's Next?

1. **Open the vault in Obsidian** — Open this folder as an Obsidian vault. You'll see the example entities
   and their connections in the graph view immediately.

2. **Ingest your first source** — Run `/bedrock:teach <url>` to import content from:
   - A GitHub repository URL
   - A Confluence page URL
   - A Google Docs URL
   - A local markdown or CSV file path

3. **Ask your vault** — Run `/bedrock:ask <question>` to search across all entities.
   Example: `/bedrock:ask what do we know about <actor>?`

4. **Create entities manually** — Run `/bedrock:preserve` with free-form text or structured input
   to add new entities to the vault.

5. **Maintain vault health** — Periodically run `/bedrock:compress` to detect duplicates,
   orphan entities, and stale content.

6. **Replace example content** — The example entities are there to show you how Bedrock works.
   Edit or delete them as you start adding real content.

7. **Manage vaults** — Run `/bedrock:vaults` to list all registered vaults, set a default,
   or remove a vault. Use `--vault <name>` on any skill to target a specific vault from
   any directory.

> **Tip:** The graph view is preconfigured with 7 colors — one for each entity type.
> Open Graph View (Ctrl/Cmd+G) to see your entities color-coded by type.
> Customize colors in Graph View → Groups if you prefer different colors.

> **Tip:** The example entities are fully connected with bidirectional wikilinks.
> Open the Obsidian graph view to see how they relate to each other — this is the
> pattern all future entities will follow.
```

Adapt the language of this guide to `VAULT_LANGUAGE`.

---

## Critical Rules

| # | Rule |
|---|---|
| 1 | **NEVER block initialization** for missing dependencies — always warn and continue |
| 2 | **NEVER modify existing skills** — init only creates new files in the vault |
| 3 | **NEVER auto-install** dependencies — only provide instructions |
| 4 | **NEVER run `git init`** — the user handles their own git setup |
| 5 | **ALWAYS copy templates verbatim** — no translation or modification |
| 6 | **ALWAYS create bidirectional wikilinks** in example entities |
| 7 | **ALWAYS use hierarchical tags** — `type/actor`, never `actor` |
| 8 | **ALWAYS use bare wikilinks** — `[[name]]`, never `[[dir/name]]` |
| 9 | **ALWAYS write entity content in VAULT_LANGUAGE** — adapt example text to the chosen language |
| 10 | **Idempotency** — respect `.bedrock/config.json` existence and offer reconfigure/register/skip |
| 11 | **ALWAYS register vault** in the global registry during setup — prompt for name, validate kebab-case and uniqueness |
| 12 | **First vault is auto-default** — if the registry is empty, mark the new vault as default without asking |
