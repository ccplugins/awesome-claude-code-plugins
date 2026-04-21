---
name: ask
description: >
  Adaptive vault reader skill. Receives a natural language question,
  searches the vault first (Glob/Grep, entity reads, wikilink traversal),
  then self-assesses whether more context is needed. Escalates to /graphify
  for graph-level understanding or to /bedrock:teach for remote content ingestion
  only when the vault alone is insufficient. Answers simple questions with zero
  graphify calls.
  Use when: "bedrock ask", "bedrock-ask", "/bedrock:ask", any question about the vault,
  "what do we know about", "who owns", "what's the status of", "tell me about",
  "how does it work", or any Second Brain query.
user_invocable: true
allowed-tools: Bash, Read, Glob, Grep, Skill, Agent
---

# /bedrock:ask — Adaptive Vault Reader

## Plugin Paths

Entity definitions and templates are in the plugin directory, not at the vault root.
Use the "Base directory for this skill" provided at invocation to resolve the paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already automatically injected into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to query. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name and remove it from the arguments (the remaining text is the question).

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

This skill receives a natural language question and answers it using an adaptive,
vault-first approach. It always reads vault content first, then decides whether
to escalate to graphify or /teach based on what's actually needed — not what the
question looks like in isolation.

**You are an adaptive context orchestrator agent. You only READ — never write, edit, or delete files directly.**

Writes happen exclusively through `/bedrock:teach` delegation (which flows through `/bedrock:preserve`).
If the query reveals outdated or missing information and no remote source is available to ingest,
suggest that the user run `/bedrock:preserve` or `/bedrock:teach` to update the vault.

---

## Phase 0 — Read Configuration

### 0.1 Load config

Read `.bedrock/config.json` from the vault root:

```bash
if [ -f ".bedrock/config.json" ]; then
    cat .bedrock/config.json
else
    echo "config_not_found"
fi
```

- **If config exists:** extract the value of `query.max_graphify_calls`. Store as `max_graphify_calls`.
- **If config does not exist or field is absent:** set `max_graphify_calls = 3` (default).
- **Valid range:** 1–5. If the value is outside this range, clamp to the nearest bound and log a warning.

---

## Phase 1 — Analyze the Question

### 1.1 Classify the question

Read the user's question and identify:

1. **Mentioned entities** — names of systems, people, teams, topics, projects, or discussions.
   They may appear as:
   - Exact filename (e.g.: "billing-api", "squad-payments")
   - Human-readable name (e.g.: "Billing API", "Squad Payments")
   - Alias or acronym (e.g.: "BillingAPI", "BRB")
   - Contextual reference (e.g.: "the billing service", "the notifications team")

2. **Relevant domain(s)** — `payments`, `notifications`, `orders`, `integrations`, `checkout`, `compliance`, `internal-tools`.
   Infer from the mentioned entities or the question context.

3. **Type of information sought:**
   - **Status/overview** — "what is X?", "what's the status of X?"
   - **Architecture/stack** — "how does X work?", "what's the stack of X?"
   - **People/teams** — "who owns X?", "who works with Y?"
   - **History/decisions** — "what was decided about X?", "what happened with Y?"
   - **Relationships** — "what depends on X?", "how does Y relate to Z?"
   - **Deprecation** — "what is being deprecated?", "what's the deprecation plan for X?"

### 1.2 Assess clarity

If the question is too ambiguous to produce a targeted search (e.g.: "tell me everything",
"how does the system work?", "what's going on?"), ask for clarification:

> "Your question is broad. Can you specify: which system, team, or topic would you like to know more about?"

If the question mentions something that clearly isn't part of the vault (e.g.: something personal,
unrelated technology), inform: "I didn't find anything in the vault about this."

### 1.3 Phase 1 classification result

At the end, you should have:
- **search_terms**: list of names, aliases, and keywords to search for
- **domains**: list of relevant domains (may be empty if not identified)
- **info_type**: classification of the type of information sought
- **explicit_entities**: entities mentioned directly by name (if any)

---

## Phase 2 — Vault-First Search

This phase **always runs** for every question, regardless of graph availability.
It is the foundation of the adaptive approach — read vault content first, decide later.

### 2.1 Read entity definitions

Use Read to read the entity definition files from the plugin (see "Plugin Paths" section):
- If the question is about a system → read `<base_dir>/../../entities/actor.md`
- If the question is about a person → read `<base_dir>/../../entities/person.md`
- If the question is about a team → read `<base_dir>/../../entities/team.md`
- If the question is about a topic/deprecation → read `<base_dir>/../../entities/topic.md`
- If the question is about a meeting/decision → read `<base_dir>/../../entities/discussion.md`
- If the question is about a project/initiative → read `<base_dir>/../../entities/project.md`
- If you don't know the type → read all entity definitions from the plugin to classify correctly

### 2.2 Search entities by name and alias

For each search term identified in Phase 1:

**Step 1 — Search by filename:**
```
Glob: <VAULT_PATH>/actors/<term>*.md, <VAULT_PATH>/people/<term>*.md, <VAULT_PATH>/teams/<term>*.md,
      <VAULT_PATH>/topics/*<term>*.md, <VAULT_PATH>/discussions/*<term>*.md, <VAULT_PATH>/projects/<term>*.md,
      <VAULT_PATH>/fleeting/*<term>*.md
```

**Step 2 — Search by alias in frontmatter:**
```
Grep: pattern="aliases:.*<term>" in directories: <VAULT_PATH>/actors/, <VAULT_PATH>/people/, <VAULT_PATH>/teams/,
      <VAULT_PATH>/topics/, <VAULT_PATH>/discussions/, <VAULT_PATH>/projects/
      (case-insensitive)
```

**Step 3 — Search by name in frontmatter:**
```
Grep: pattern="name:.*<term>" or pattern="title:.*<term>"
      in the same directories (case-insensitive)
```

**Step 4 — Search by content (fallback):**
If steps 1-3 did not return sufficient results:
```
Grep: pattern="<term>" in entity directories (case-insensitive)
```

### 2.3 Filter by domain

If domains were identified in Phase 1, filter results:
```
Grep: pattern="domain/<domain>" in the found files (tags field of frontmatter)
```

Keep all results, but prioritize those matching the domain.

### 2.4 Read found entities

For each entity found (limit: 15 entities):

1. Read the frontmatter first (~first 30 lines) to confirm relevance
2. If relevant: read the full file
3. If not relevant (false positive from Grep): discard

Record for each entity read:
- filename, type, name
- wikilinks found in frontmatter and body
- external URLs found in the content (Confluence, Google Docs, GitHub)
- Explicit date in the filename (if any)

### 2.5 Follow wikilinks (1 level of depth)

For each extracted wikilink that is relevant to the question:

1. Resolve the file: search for `<wikilink-name>.md` in entity directories
   ```
   Glob: <VAULT_PATH>/actors/<name>.md, <VAULT_PATH>/people/<name>.md, <VAULT_PATH>/teams/<name>.md,
         <VAULT_PATH>/topics/*<name>*.md, <VAULT_PATH>/discussions/*<name>*.md, <VAULT_PATH>/projects/<name>.md
   ```

2. Read the found file (frontmatter + body)

3. **Do NOT follow wikilinks from this second level** — stop here to avoid context explosion

**Relevance criteria for following a wikilink:**
- The question is about relationships ("who owns", "what depends on") → follow all
- The question is about status/overview → follow team, people (focal points)
- The question is about history → follow related discussions, topics
- The question is about architecture → follow dependent actors

**Limit:** Do not read more than 15 entities total (2.4 + 2.5 combined).
If the limit is reached, prioritize entities directly mentioned in the question.

### 2.6 Phase 2 output

At the end of Phase 2, you have:
- A set of vault entities with their full content
- Wikilinks between them (structural relationships)
- External URLs found in their content (Confluence, GDocs, GitHub)
- A sense of whether the vault content covers the question

---

## Phase 3 — Context Assessment + Conditional Escalation

This is the core decision point. After reading vault content in Phase 2,
assess whether you have enough context to answer the question.

### 3.1 Self-Assessment

Evaluate the vault content you read in Phase 2 against the original question.
Determine one of three outcomes:

**`vault_sufficient`** — You have enough information to compose a good answer.
Indicators:
- The question is factual/status/ownership and the vault entities contain a clear answer
- Examples: "who owns X", "what's the status of Y", "what team manages Z", "what is X"
- The entities read in Phase 2 directly address the question
- No significant gaps in the information

**`needs_graphify`** — The vault content is partial but the knowledge graph could fill the gaps.
Indicators:
- The question involves code-level relationships, cross-domain dependencies, or architectural paths
- The vault entities reference systems whose connections aren't explicit in the markdown
- You feel you're missing structural context that the knowledge graph could provide
- Examples: "how does X connect to Y at the code level", "what are the dependencies of X", "trace the data flow from A to B"

**`needs_remote_content`** — The vault entities reference external URLs that appear directly relevant
to the question, but the content behind those URLs isn't ingested in the vault.
Indicators:
- An entity's `sources` field or body text contains a URL (Confluence, GDocs, GitHub) that likely holds the answer
- The question asks about something documented externally (e.g., "what's the runbook for X" and the entity links to a Confluence page)
- The vault has a pointer to the answer but not the answer itself

**Priority when multiple outcomes apply:**
`needs_remote_content` > `needs_graphify` > `vault_sufficient`

Rationale: remote content must be internalized first for the vault to be complete.
Graphify can run on richer data after ingestion. If both apply, handle remote content first,
then re-assess whether graphify is still needed.

**After determining the outcome:**
- `vault_sufficient` → skip directly to **Phase 4** (recency) then **Phase 5** (respond)
- `needs_graphify` → proceed to **Phase 3-G**
- `needs_remote_content` → proceed to **Phase 3-T**

---

### Phase 3-G — Graphify Escalation

Execute only when the self-assessment determines `needs_graphify`.

#### 3-G.0 Check graph availability

```bash
if [ -f "<VAULT_PATH>/graphify-out/graph.json" ] && [ -s "<VAULT_PATH>/graphify-out/graph.json" ]; then
    echo "graph_available"
else
    echo "graph_not_available"
fi
```

**If `graph_not_available`:** Display the following warning and skip to Phase 4 with vault-only content:

> [!warning] Knowledge graph unavailable
> The knowledge graph is not available (`<VAULT_PATH>/graphify-out/graph.json` missing or empty).
> The answer below is based on vault content only — it may be incomplete for this type of question.
> Run `/graphify build` to rebuild the graph from the vault's actor repositories.

#### 3-G.1 Formulate graphify calls

Based on the gap between what you have (Phase 2 content) and what the question needs,
formulate 1–N graphify calls. Use the same modes as before:

| Gap identified | Graphify mode |
|---|---|
| Need to understand a single entity's code structure | `explain "<entity>"` |
| Need to find how two entities connect | `path "<entityA>" "<entityB>"` |
| Need broad relationship or dependency context | `query "<question about the gap>"` |

The LLM decides the calls based on what's missing — not from a pre-planned decomposition.
Never exceed `max_graphify_calls`.

#### 3-G.2 Execute graphify calls sequentially

For each call, invoke `/graphify` via the Skill tool. Append the structured JSON output instruction:

```
After completing the traversal, return ONLY a JSON object with this structure (no prose, no markdown fences):
{
  "mode": "query|path|explain",
  "start_nodes": ["node_id1", "node_id2"],
  "nodes": [
    {"id": "node_id", "label": "Human Readable Name", "source_file": "relative/path", "community": 0, "source_location": "file:line"}
  ],
  "edges": [
    {"source": "node_id", "target": "node_id", "relation": "calls|references|...", "confidence": "EXTRACTED|INFERRED|AMBIGUOUS", "confidence_score": 0.9}
  ],
  "communities": {
    "0": {"label": "Community Name", "node_ids": ["id1", "id2"]}
  },
  "traversal": {"mode": "bfs|dfs", "depth": 3, "budget_used": 1200}
}
```

- **If JSON parses successfully:** accumulate nodes, edges, and communities.
- **If parsing fails:** log warning "Graphify call N failed — skipping." Continue with next call.
- **If ALL calls fail:** continue to Phase 4 with vault-only content. Never block.

#### 3-G.3 Deduplicate and blend

1. Deduplicate nodes by `id`, edges by `source+target+relation`
2. Resolve graphify nodes to vault `.md` files (by label or source_file)
3. Merge with the vault entities already collected in Phase 2
4. Respect the 15-entity total limit

#### 3-G.4 Check for remote content need

If graphify results reveal additional external URLs that appear relevant to the question
and aren't ingested in the vault → escalate to Phase 3-T before proceeding.

---

### Phase 3-T — Teach Delegation

Execute when the self-assessment determines `needs_remote_content`, or when Phase 3-G.4
identifies uningested URLs.

#### 3-T.1 Identify URLs to ingest

From the vault entities read in Phase 2 (and optionally Phase 3-G), identify external URLs
that appear directly relevant to answering the question:
- Confluence URLs (containing `confluence` or `atlassian.net`)
- Google Docs URLs (containing `docs.google.com`)
- GitHub URLs (containing `github.com`)

**Limit:** 2 URLs per `/bedrock:ask` invocation. If more than 2 relevant URLs exist,
prioritize those most directly related to the question.

#### 3-T.2 Invoke /bedrock:teach

For each URL, invoke `/bedrock:teach` via the Skill tool:

```
/bedrock:teach <URL>

Context: Ingesting to answer the question: "<original question>"
```

**IMPORTANT:**
- Invoke via the Skill tool — same delegation pattern as teach → preserve
- `/teach` handles its own flow: fetch content, extract entities, present to user for confirmation, delegate to `/preserve`
- `/ask` waits for `/teach` to complete

#### 3-T.3 Re-read newly created entities

After `/teach` completes successfully:
1. Search the vault for entities that were just created or updated (based on `/teach`'s output)
2. Read these new entities (frontmatter + body)
3. Add them to the working set of vault entities for response composition

#### 3-T.4 Best-effort fallback

If `/teach` fails or the user declines the confirmation:
- Log: "Teach delegation for <URL> did not complete. Continuing with available content."
- Continue to Phase 4 with whatever content is available
- **Never block the response** because of a failed teach delegation

---

## Phase 4 — Prioritize by Recency

### 4.1 Identify entities with explicit dates

For discussions and topics, extract the date from the filename:
- Pattern `YYYY-MM-DD-slug.md` → full date (e.g.: `2026-04-02`)
- Pattern `YYYY-MM-slug.md` → partial date, assume day 01 (e.g.: `2026-04-01`)

For consolidated entities (actors, people, teams, projects):
- Treat as equally up-to-date — do not apply temporal ranking
- Trust that content is up-to-date via `/bedrock:preserve` and `/bedrock:compress`

### 4.2 Sort by recency

When the response involves multiple dated discussions or topics:
- Sort by date descending (most recent first)
- If the question is explicitly about something recent ("what happened lately",
  "latest decisions"), limit to entities from the last 30 days
- If the question is about history ("what happened with X over time"),
  include all dates but present chronologically (most recent first)

---

## Phase 5 — Respond to the User

### 5.1 Compose the response

Build the response following these rules:

1. **Language:** Use the vault's configured language. Technical terms in English are accepted (PCI DSS, API, EKS, etc.)

2. **Response structure:**
   - Open with a direct answer to the question (1-3 sentences)
   - If necessary, expand with details organized by topic
   - Use headers (`##`, `###`) if the response is long (>5 paragraphs)
   - Use tables when the information is comparative or inventory-like

3. **Entity citations:**
   - Cite ALL consulted entities as wikilinks: `[[entity-name]]`
   - Use bare wikilinks (never `[[dir/entity-name]]`)
   - Group citations at the end if there are many, or inline when natural

4. **Escalation transparency:**
   - If graphify was used, note: "I consulted the knowledge graph for deeper context."
   - If /teach was invoked, note: "I ingested [source] into the vault to answer this question."
   - If vault-only was sufficient, no special note needed

5. **When nothing is found:**
   - State explicitly: "I didn't find information about [X] in the vault."
   - If relevant, suggest: "You can use `/bedrock:teach <URL>` to ingest a source about this topic."
   - **NEVER fabricate information.** Only respond with what was found.

6. **Response prioritization (Zettelkasten hierarchy):**
   When composing the response, apply weight by Zettelkasten role:
   - **Permanent notes** (actors, people, teams) — maximum weight, consolidated information. Present as current facts.
   - **Bridge notes** (topics, discussions) — high weight, contextualized information. Most recent discussions/topics first.
   - **Index notes** (projects) — medium weight, organizational reference. Point to where the detail is.
   - **Fleeting notes** — low weight, unconsolidated information. **ALWAYS** flag with disclaimer:
     `(source: fleeting note — unconsolidated information)`
   - If there is conflicting information between sources, point out the discrepancy.

7. **Fleeting note promotion detection (criterion 3: active relevance):**
   When a fleeting note is referenced in the response because it is relevant to the query:
   - Check if it meets promotion criteria (see `<base_dir>/../../entities/fleeting.md`):
     - Critical mass (>3 paragraphs with sources)
     - Corroboration (confirmed by an existing permanent)
   - If any criterion is met, add at the end of the response:
     `> [!info] Promotion suggested: [[fleeting-note-name]] can be promoted to permanent/bridge`
   - `/bedrock:ask` does NOT promote automatically — it only flags. Promotion happens when
     `/bedrock:preserve` is invoked with the instruction to promote.

### 5.2 Post-response suggestions

When appropriate, suggest actions to the user:

- If information is outdated: "The vault may be outdated about [X]. Consider running `/bedrock:teach <source>` to update."
- If the question revealed gaps: "I didn't find [Y] in the vault. If you have this information, you can use `/bedrock:preserve` to record it."
- If the question is complex and the response incomplete: "For a more complete view, you may also want to run `/bedrock:teach <URL>` to ingest additional sources."

---

## Critical Rules

| Rule | Detail |
|---|---|
| Vault-first principle | Phase 2 ALWAYS runs before any escalation. Read vault content first, decide later. Never skip Phase 2. |
| LLM self-assessment | The decision to escalate is made by the LLM after reading vault content (Phase 3.1), not by a heuristic rule table. Use the guidance provided, but the LLM makes the final call. |
| Escalation priority | When multiple outcomes apply: `needs_remote_content` > `needs_graphify` > `vault_sufficient`. Internalize first, then analyze. |
| No direct writes | `/ask` NEVER writes, edits, or deletes files directly. All writes are delegated through `/bedrock:teach` → `/bedrock:preserve`. |
| Teach delegation via Skill tool | Invoke `/bedrock:teach` via the Skill tool. `/teach` owns its confirmation gate. `/ask` cannot bypass it. |
| Graphify via Skill tool | Invoke `/graphify` via the Skill tool — NEVER call the Python API directly. |
| Max graphify calls | Read `query.max_graphify_calls` from `.bedrock/config.json` (default: 3, valid range: 1–5). Only consumed when graphify is actually invoked. |
| Graph unavailable warning | When `needs_graphify` but `graphify-out/graph.json` is missing, display `> [!warning]` callout with `/graphify build` instruction. Continue with vault-only content. |
| Best-effort escalation | If graphify fails or teach fails or user declines: continue with available content. NEVER block the response. |
| Limit of 15 entities | Do not read more than 15 entities total across Phase 2 + Phase 3 |
| Limit of 2 teach URLs | Do not invoke `/bedrock:teach` for more than 2 URLs per `/bedrock:ask` invocation |
| No fabrication | Respond ONLY with information found in the vault or obtained through escalation. Never fabricate data. |
| Clarification before guessing | If the question is ambiguous, ask for clarification. Do not assume. |
| Vault language with technical terms in English | Response always in the vault's configured language |
| Bare wikilinks | `[[name]]`, never `[[dir/name]]` |
| Consolidated entities = up-to-date | Actors, people, teams do not need temporal ranking |
| Dated discussions/topics = prioritize recent | Sort by date in filename (YYYY-MM-DD) |
| Sensitive data | NEVER display credentials, tokens, PANs, CVVs found in the vault |
| Fleeting notes with disclaimer | ALWAYS flag information from fleeting notes with `(source: fleeting note — unconsolidated information)` |
| Promotion as side-effect | When a relevant fleeting note meets promotion criteria, flag with callout. Do NOT promote automatically. |
| Weight hierarchy | permanent > bridge > index > fleeting. Use as guideline, not mathematical formula. |
| Vault resolution first | Resolve `VAULT_PATH` before any file operation — never assume CWD is the vault |
| All entity paths use `<VAULT_PATH>/` prefix | `<VAULT_PATH>/actors/`, not `actors/` |
