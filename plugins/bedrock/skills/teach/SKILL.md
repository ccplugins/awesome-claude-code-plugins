---
name: teach
description: >
  Teaches the Second Brain to recognize a new external data source. Fetches content from
  Confluence, Google Docs, GitHub repositories, remote URLs, or any local file format
  supported by docling (DOCX, PPTX, XLSX, PDF, HTML, EPUB, images, Markdown, CSV, and more),
  converts non-markdown formats to markdown via docling, runs the /graphify extraction pipeline,
  and delegates entity persistence (including the graphify-output merge) to /bedrock:preserve.
  Use when: "bedrock teach", "bedrock-teach", "teach", "ingest source", "import document", "/bedrock:teach",
  or when the user provides a Confluence, Google Docs, or GitHub URL, a remote file URL, or
  a local file path to incorporate into the vault.
user_invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Skill, Agent, WebFetch, mcp__plugin_github_github__*, mcp__plugin_atlassian_atlassian__*
---

# /bedrock:teach — External Source Ingestion into the Second Brain

## Plugin Paths

Entity definitions and templates are in the plugin directory, not at the vault root.
Use the "Base directory for this skill" provided at invocation to resolve paths:

- Entity definitions: `<base_dir>/../../entities/`
- Templates: `<base_dir>/../../templates/{type}/_template.md`
- Plugin CLAUDE.md: `<base_dir>/../../CLAUDE.md` (already injected automatically into context)

Where `<base_dir>` is the path provided in "Base directory for this skill".

---

## Vault Resolution

Resolve which vault to teach. This skill can be invoked from any directory.

**Step 1 — Parse `--vault` flag:**
Check if the input arguments include `--vault <name>`. If found, extract the vault name and remove it from the arguments (the remaining text is the source URL/path).

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
Extract `language` and other relevant fields for use in later phases.

**From this point forward, ALL vault file operations use `<VAULT_PATH>` as the root.**
- Graphify output: `<VAULT_PATH>/graphify-out/`
- When delegating to `/bedrock:preserve`, pass `--vault <VAULT_NAME>`

---

## Overview

This skill receives an external source (URL or local path), fetches its content to a temporary
directory, converts non-markdown files to markdown via docling, runs the `/graphify` extraction
pipeline on the tmp content, and delegates entity persistence (plus graphify-output merge) to
`/bedrock:preserve`.

**You are a fetcher and orchestrator agent.** Your job is to:
1. Ensure docling is installed (auto-install if missing)
2. Classify the input and fetch content to `/tmp`
3. Convert fetched files to markdown via docling (when applicable)
4. Invoke `/graphify` to extract a knowledge graph into a per-run temp directory
5. Delegate graph merge and entity writes to `/bedrock:preserve`
6. Clean up temporary files

You do NOT classify entities, create vault files, write to the vault directly, or merge graph state.
All extraction is done by `/graphify`. All writes (including the graphify-output merge into the
vault's cumulative `graphify-out/`) are done by `/bedrock:preserve`.

Follow the phases below in order, without skipping steps.

---

## Phase 0 — Ensure docling is installed

Before any fetch or conversion, verify that the `docling` CLI is available. If missing, install
it silently using the same fallback chain `/bedrock:setup` uses for graphify, emitting a single
status line before proceeding.

```bash
if command -v docling >/dev/null 2>&1; then
  echo "Phase 0: docling already installed — proceeding."
else
  echo "Phase 0: docling not found — installing silently (one-time setup, may take a few minutes for model download)."
  # Step 1 — pipx (preferred, isolated)
  if command -v pipx >/dev/null 2>&1; then
    pipx install docling >/dev/null 2>&1 || true
  fi
  # Step 2 — pip (fallback if pipx unavailable or failed)
  if ! command -v docling >/dev/null 2>&1; then
    if command -v pip3 >/dev/null 2>&1; then
      pip3 install --user docling >/dev/null 2>&1 || true
    elif command -v pip >/dev/null 2>&1; then
      pip install --user docling >/dev/null 2>&1 || true
    fi
  fi
  # Final re-probe
  if ! command -v docling >/dev/null 2>&1; then
    echo "ERROR: docling install failed. Run /bedrock:setup to install it, or install manually: pipx install docling"
    exit 1
  fi
  echo "Phase 0: docling installed."
fi
```

**Failure mode:** If install fails (no `pipx`/`pip`, network outage, permission denied), abort
the skill with the error above. Do NOT fetch or mutate anything. Direct the user to `/bedrock:setup`.

**No user prompt:** this step is silent — one status line on success, one error line on failure.

---

## Phase 1 — Fetch

### 1.1 Classify the input

The user provides an argument. Classify it in the following priority order. URL-type routing
is unchanged; local files no longer have an extension allowlist — any existing file is accepted,
and Phase 1.5 decides whether to run docling on it.

| Input | Detected type | Fetch method |
|---|---|---|
| URL containing `confluence` or `atlassian.net` | confluence | Read `skills/confluence-to-markdown/SKILL.md`, follow instructions, save output to tmp |
| URL containing `docs.google.com` | gdoc | Read `skills/gdoc-to-markdown/SKILL.md`, follow instructions, save output to tmp |
| URL containing `github.com` | github-repo | `git clone --depth 1` to tmp + GitHub MCP enrichment (docling never runs on GitHub repos) |
| URL starting with `http://` or `https://` (any other) | remote-binary | Download raw bytes to tmp via `curl`/WebFetch; Phase 1.5 decides conversion |
| Local file path (any existing file) | local-file | Copy to tmp; Phase 1.5 decides conversion |
| Local directory path | local-dir | Copy directory to tmp |
| No match above | manual | Ask the user: "Could not identify the source type. Paste the content or provide a valid URL/path." |

If no argument was provided: ask the user "What source do you want to ingest? Provide a URL (Confluence, Google Docs, GitHub, or any HTTP(S) URL) or a local file path (any file type — docling will convert it to markdown if supported)."

### 1.2 Create temporary directory

All content is fetched to a temporary directory. This is the single input path for `/graphify`.

```bash
TEACH_TMP="/tmp/bedrock-teach-$(date +%s)"
mkdir -p "$TEACH_TMP"
echo "Temporary directory: $TEACH_TMP"
```

Store the path for use in subsequent phases.

### 1.3 Fetch content

Execute the fetch strategy for the detected type. All content lands in `$TEACH_TMP/`.

#### 1.3.1 GitHub repository

For GitHub URLs (e.g.: `https://github.com/acme-corp/billing-api`):

1. Extract `owner/repo` and `repo-name` from the URL
2. Clone the repository (shallow):
   ```bash
   git clone --depth 1 <url> "$TEACH_TMP/<repo-name>"
   ```
3. GitHub MCP enrichment — call directly in main context (NOT via subagent — MCP permissions are not inherited):
   - `mcp__plugin_github_github__get_file_contents` → read the repo's README.md
   - `mcp__plugin_github_github__list_commits` → last 10 commits
   - `mcp__plugin_github_github__list_pull_requests` → last 5 PRs (state=all, sort=updated)
4. Compile MCP results into a single markdown file and save as `$TEACH_TMP/<repo-name>/_github_metadata.md`

> **Best-effort:** If any MCP call fails, continue with what was obtained. Do NOT block ingestion.

#### 1.3.2 Confluence

For Confluence URLs:
1. Read the internal skill at `<base_dir>/../confluence-to-markdown/SKILL.md`
2. Follow its instructions to parse the URL, choose layer (MCP → API → browser), and extract content
3. Save the returned Markdown content to `$TEACH_TMP/<slug>.md`
   - `<slug>` is derived from the page title or URL path (kebab-case, lowercase)

If all three layers (MCP, API, browser) are unavailable: warn the user with the guidance message from the fetcher module and abort this source type.

#### 1.3.3 Google Docs / Sheets

For Google Docs or Sheets URLs:
1. Read the internal skill at `<base_dir>/../gdoc-to-markdown/SKILL.md`
2. Follow its instructions to parse the URL, detect document type (Doc vs Sheet), choose layer (MCP → API/public export → browser), and extract content
3. The fetcher saves output to `/tmp/gdoc_{docId}.md` or `/tmp/gsheet_{docId}.md`
4. Copy the output file to `$TEACH_TMP/<slug>.md`
   - `<slug>` is derived from the document title or URL path (kebab-case, lowercase)

If all three layers (MCP, API/public export, browser) are unavailable: warn the user with the guidance message from the fetcher module and abort this source type.

#### 1.3.4 Remote URL (generic)

For any other HTTP/HTTPS URL, download the raw bytes so docling can operate on binary formats
(PDF, DOCX, PPTX, XLSX, images, etc.) that WebFetch cannot return faithfully as text:

1. Try `curl` first for true binary fidelity:
   ```bash
   curl -fsSL -o "$TEACH_TMP/<filename-derived-from-url>" "<url>"
   ```
   - `<filename-derived-from-url>` preserves the URL's basename (including extension) when
     available; fall back to `<slug>.bin` if no extension is present.
2. If `curl` is unavailable or the URL returns an HTML page (by Content-Type), fall back to
   WebFetch and save the response text as `$TEACH_TMP/<slug>.md`.

If both attempts fail: warn "Could not fetch URL. Check if the URL is accessible." and abort.

Phase 1.5 decides whether the downloaded file goes through docling, based on the file extension.

#### 1.3.5 Local file (any format)

For local files:
1. Verify the file exists using Read (or `test -f`).
2. Copy to tmp preserving the filename:
   ```bash
   cp "<local-path>" "$TEACH_TMP/"
   ```

No extension-based filtering — any existing file is accepted. Phase 1.5 decides conversion.

#### 1.3.6 Local directory

For local directories:
1. Verify the directory exists
2. Copy to tmp (excluding heavy directories):
   ```bash
   rsync -a --exclude='.git' --exclude='node_modules' --exclude='bin' --exclude='obj' \
     --exclude='.vs' --exclude='TestResults' --exclude='packages' \
     "<local-dir>/" "$TEACH_TMP/$(basename <local-dir>)/"
   ```

### 1.4 Phase 1 result

At the end of this phase, you should have:
- **`$TEACH_TMP`**: directory with all fetched content (local path for graphify)
- **`source_url`**: original URL or file path provided by the user
- **`source_type`**: `confluence`, `gdoc`, `github-repo`, `remote-binary`, `local-file`, `local-dir`, or `manual`

Report: "Phase 1 complete: Content fetched to `$TEACH_TMP`. Source type: `<source_type>`."

---

## Phase 1.5 — Docling Conversion

For every fetched file in `$TEACH_TMP` that is not a GitHub repo and is not already markdown
output from Confluence/GDoc fetchers, check whether docling supports the file type and, if so,
convert it to markdown in place. GitHub repos (`source_type == "github-repo"`) skip this phase
entirely and flow straight to graphify.

### 1.5.1 Docling-supported extensions

Docling supports conversion for the following file types (as of the version installed by
Phase 0 / `/bedrock:setup`). Compare by lowercase file extension:

```
.pdf .docx .pptx .xlsx
.html .htm
.md .adoc
.png .jpg .jpeg .tiff .bmp
.epub
```

- `.md` is listed here because docling passes markdown through largely unchanged. In practice,
  running docling on `.md` is a no-op we skip to save time — treat `.md` as already-markdown.
- `.txt` and `.csv` are NOT in docling's supported list (they are plain-text already); skip
  docling and pass through raw.

### 1.5.2 Routing and failure rules

For each file under `$TEACH_TMP` (excluding files inside `<repo-name>/` subdirectories of a
`github-repo` source — skip those entirely):

1. **Skip by type — already markdown or plain text:** if extension is `.md`, `.txt`, or `.csv`,
   leave the file untouched and record status `passed-through` for the report. Graphify handles
   these natively.

2. **Skip by routing — not docling-supported:** if the extension is not in the supported list
   above AND is not `.md`/`.txt`/`.csv`, leave the file untouched and record status
   `passed-through` with a note `(type not supported by docling)`. Graphify decides what to do
   with the raw file.

3. **Run docling:** otherwise, invoke docling and replace the source file with the converted
   markdown. Docling writes to the working directory by default; use `--to md` and `--output`
   to target a predictable path:

   ```bash
   cd "$TEACH_TMP"
   docling --from <auto> --to md --output "$TEACH_TMP" "<relative-file-path>"
   ```

   Docling produces `<stem>.md` alongside the source. After a successful run:
   - Remove the original binary: `rm "<relative-file-path>"`.
   - Record status `converted` for the report with the new markdown filename.

4. **Failure fallback:** if docling exits non-zero for a file:
   - If the source file's extension is `.md`, `.txt`, or `.csv` (already handled by rule 1,
     so this branch is defensive): leave the original file in place, record status
     `failed-fallback (raw passthrough)`, and continue with other files.
   - Otherwise (binary format like `.docx`, `.pdf`, etc.): **abort the entire skill**. Clean
     up `$TEACH_TMP` (`rm -rf "$TEACH_TMP"`) and emit a clear error:
     `ERROR: docling failed to convert <file>. Aborting ingestion. Temp directory cleaned up.`
     Do NOT proceed to graphify or preserve.

### 1.5.3 Phase 1.5 result

At the end of Phase 1.5:
- `$TEACH_TMP` contains markdown files (either originals or docling-converted).
- You have a per-file status map to surface in Phase 4's report:
  - `converted`: ran docling successfully
  - `passed-through`: skipped docling (markdown/plain text or unsupported type)
  - `failed-fallback`: docling failed but file was text-native; continued with raw file

Report: "Phase 1.5 complete: N converted, M passed-through, P failed-fallback."

---

## Phase 2 — Extract

### 2.1 Invoke /graphify into a per-run temp directory

Use the Skill tool to invoke `/graphify`, directing its output to a per-run temp directory
(**not** the vault). The vault's cumulative `graphify-out/` is updated by `/bedrock:preserve`'s
Phase 0 merge step, not by this skill.

```
/graphify $TEACH_TMP --mode deep --obsidian --obsidian-dir $TEACH_TMP
```

The convention used here: passing `--obsidian-dir $TEACH_TMP` makes graphify write its
`graphify-out/` tree under `$TEACH_TMP/graphify-out/`. Store that path as:

```bash
GRAPHIFY_OUT_NEW="$TEACH_TMP/graphify-out"
```

**IMPORTANT:**
- Invoke via the Skill tool — never call graphify Python API directly.
- `/graphify` runs its full pipeline: detect → extract (AST + semantic) → build → cluster → analyze → obsidian export.
- Output lands in `$GRAPHIFY_OUT_NEW`, which is inside the temp directory. The vault's
  `<VAULT_PATH>/graphify-out/` is NOT touched by this skill — `/bedrock:preserve` owns that write.

### 2.2 Verify output

After `/graphify` completes, verify the output in the temp location:

```bash
if [ -f "$GRAPHIFY_OUT_NEW/graph.json" ] && [ -s "$GRAPHIFY_OUT_NEW/graph.json" ]; then
    echo "graphify output verified: graph.json exists and is non-empty"
else
    echo "ERROR: $GRAPHIFY_OUT_NEW/graph.json is missing or empty"
fi
```

**If graph.json is missing or empty:**
- Warn the user: "graphify extraction failed — no graph produced. Check the content and try again."
- Clean up tmp: `rm -rf "$TEACH_TMP"`
- Abort gracefully

### 2.3 Phase 2 result

The following files should exist in `$GRAPHIFY_OUT_NEW`:
- `graph.json` — knowledge graph (nodes, edges, communities)
- `GRAPH_REPORT.md` — audit report with god nodes, surprising connections
- `obsidian/*.md` — one markdown file per node
- `.graphify_analysis.json` — communities, cohesion scores, god nodes

Report: "Phase 2 complete: graphify extraction finished in `$GRAPHIFY_OUT_NEW`. Graph: N nodes, M edges. Will be merged into the vault by /bedrock:preserve."

---

## Phase 3 — Delegate to /bedrock:preserve

### 3.1 Compile input for /preserve

Pass the **temp** graphify output path and provenance metadata to `/bedrock:preserve`. The
skill's Phase 0.2 merges this temp output into the vault's cumulative `graphify-out/`:

```
graphify_output_path: $GRAPHIFY_OUT_NEW       # = $TEACH_TMP/graphify-out/
source_url: <source_url from Phase 1>
source_type: <source_type from Phase 1>
```

**IMPORTANT:**
- `/teach` does NOT classify graphify nodes into entity types. Entity classification, filtering,
  matching, and user confirmation are all `/bedrock:preserve`'s responsibility (Phase 1.3).
- `/teach` does NOT merge the graph into the vault. That is `/bedrock:preserve`'s responsibility
  (Phase 0.2). We pass the per-run temp path; preserve merges and then reads from the merged
  `<VAULT_PATH>/graphify-out/`.

### 3.2 Invoke /preserve

Use the Skill tool to invoke `/bedrock:preserve --vault <VAULT_NAME>` passing the graphify
output reference (pointing at `$GRAPHIFY_OUT_NEW`) and provenance metadata as the argument.
The `--vault <VAULT_NAME>` flag ensures preserve writes to the same vault.

### 3.3 Receive result

`/bedrock:preserve` returns:
- List of entities created/updated
- Commit hash (if there was a commit)
- **`graphify_merge` block:** `{nodes_added, nodes_merged, edges_added, stale_flag_set}` from
  preserve's Phase 0.2 merge
- Any errors or warnings

Record the result for use in the report (Phase 4).

---

## Phase 4 — Cleanup and Report

### 4.1 Cleanup temporary directory

After `/bedrock:preserve` confirms completion, remove the temporary directory:

```bash
rm -rf "$TEACH_TMP"
echo "Temporary directory cleaned up: $TEACH_TMP"
```

**IMPORTANT:** Clean up AFTER /preserve confirms, not after graphify finishes.
The graphify output in `graphify-out/` is NOT cleaned up — it lives in the vault
and is used by `/bedrock:ask` for graph traversal.

### 4.2 Report

Present to the user:

```
## /bedrock:teach — Report

### Ingested source
- **Type:** <source_type>
- **URL/Path:** <source_url>

### Docling conversion (Phase 1.5)
| File | Status | Notes |
|---|---|---|
| report.docx | converted | output: report.md |
| notes.txt | passed-through | text-native |
| diagram.svg | passed-through | type not supported by docling |

Summary: N converted, M passed-through, P failed-fallback.
(Omit this block entirely for `source_type == "github-repo"` where docling is bypassed.)

### Extraction (via /graphify)
- **Graph:** N nodes, M edges, P communities (fresh run into $TEACH_TMP)
- **Report:** $GRAPHIFY_OUT_NEW/GRAPH_REPORT.md (before merge)

### Graphify merge (via /bedrock:preserve Phase 0.2)
| Metric | Value |
|---|---|
| Nodes added | N |
| Nodes merged | M |
| Edges added | P |
| Analysis marked stale | true / false |

(Pulled verbatim from `/bedrock:preserve`'s `graphify_merge` return block.)

### Entities processed (via /bedrock:preserve)
| Type | Name | Action |
|---|---|---|
| actor | billing-api | update |
| topic | 2026-04-migration-payments | create |
| code | process-transaction | create |

### Provenance
Each entity above received in the `sources` frontmatter field:
- url: <source_url>
- type: <source_type>
- synced_at: <today's date>

### Git
- Commit: <hash from /bedrock:preserve or "no entities">
- Push: success / failed (reason)

### Suggestions
- [list of entities mentioned in the content but not created, if any]
- [recommendations for future re-ingestion, if applicable]
```

---

## Critical Rules

| Rule | Detail |
|---|---|
| Invoke /graphify via Skill tool | NEVER call graphify Python API directly (`graphify.detect`, `graphify.build`, `graphify.extract`, etc.). Always invoke via the Skill tool. |
| All remote content fetched to /tmp | Every input type is fetched to `/tmp/bedrock-teach-<ts>/` before invoking graphify. graphify receives only a local path. |
| /teach does NOT classify entities | Entity classification, filtering, matching, and user confirmation are `/bedrock:preserve`'s responsibility. /teach passes the graphify output path and provenance metadata. |
| Delegate to /bedrock:preserve | ALL entities are persisted via `/bedrock:preserve` — teach does NOT create, update, or write vault entities. |
| /teach does NOT merge graphify output into the vault | Graphify is invoked into `$TEACH_TMP/graphify-out/` (per-run temp dir); `/bedrock:preserve`'s Phase 0.2 merges that into `<VAULT_PATH>/graphify-out/`. /teach never writes directly to the vault's `graphify-out/`. |
| Docling auto-install is silent | Phase 0 auto-installs docling if missing with a single status line — no user prompt. Fail the skill if install fails; direct the user to `/bedrock:setup`. |
| Docling skipped for GitHub repos | `source_type == "github-repo"` skips Phase 1.5 entirely — cloned repos flow straight to graphify. |
| Docling routing rule | Run docling on files with docling-supported extensions (see Phase 1.5.1). Pass-through for `.md`/`.txt`/`.csv` and for extensions not in docling's supported list. |
| Docling failure fallback | On docling non-zero exit: if file is `.md`/`.txt`/`.csv`, continue with raw file. For any other extension, abort the entire skill and clean up `$TEACH_TMP`. |
| Cleanup /tmp after /preserve confirms | Remove `/tmp/bedrock-teach-<ts>/` only after /preserve confirms completion, not after graphify finishes. |
| Provenance via source_url | ALWAYS include `source_url` and `source_type` when delegating to /bedrock:preserve. |
| Internal fetcher skills | Read internal skills from `<base_dir>/../confluence-to-markdown/SKILL.md` and `<base_dir>/../gdoc-to-markdown/SKILL.md` for content fetching. Never invoke external skills. |
| Best-effort for external sources | If MCP or fetch fails, warn and continue with what was obtained. Never block ingestion. |
| MCP in main context | Do NOT use subagents for GitHub/Atlassian MCP calls — permissions are not inherited. |
| Maximum 2 push attempts | After that, abort and inform (handled by /preserve). |
| Sensitive data | NEVER include credentials, tokens, passwords, PANs, CVVs. |
| Vault resolution first | Resolve `VAULT_PATH` before any file operation — never assume CWD is the vault |
| Pass --vault to /preserve | ALWAYS include `--vault <VAULT_NAME>` when delegating to `/bedrock:preserve` |
