---
name: gdoc-to-markdown
description: >
  Internal fetcher module for Google Docs and Sheets. Fetches content via MCP (preferred, when available),
  Google API with bearer token or public URL export (fallback), or browser DOM extraction via Claude in
  Chrome (last resort) and returns Markdown.
  Used by /bedrock:teach and /bedrock:sync — not intended for direct user invocation.
user_invocable: false
allowed-tools: Bash, Read, Write, WebFetch, ToolSearch, mcp__claude-in-chrome__*
---

# Google Docs & Sheets Fetcher

Internal module — invoked by `/bedrock:teach` Phase 1 and `/bedrock:sync` Phase 2, not user-invocable.

Fetches a Google Docs document or Google Sheets spreadsheet and converts it to a local Markdown file.
Supports both document types with automatic detection. Three layers in fallback order:
**MCP (preferred) → API / Public Export → Browser DOM extraction.**

**Dependency:** Browser fallback (Layer 3) requires `scripts/extract.js` (relative to this skill directory).

---

## Step 1 — Parse URL and Detect Type

Parse the URL. Accept these formats:

**Google Docs:**
- `https://docs.google.com/document/d/{docId}/edit`
- `https://docs.google.com/document/d/{docId}/edit#heading=...`
- `https://docs.google.com/document/d/{docId}/edit?tab=t.0`
- `https://docs.google.com/document/d/{docId}`
- Raw document ID (no URL) — treat as Doc by default

**Google Sheets:**
- `https://docs.google.com/spreadsheets/d/{docId}/edit`
- `https://docs.google.com/spreadsheets/d/{docId}/edit#gid=0`
- `https://docs.google.com/spreadsheets/d/{docId}`
- Raw spreadsheet ID — only if the user explicitly mentions "sheet" or "spreadsheet"

**Detect type:**
- URL contains `/spreadsheets/d/` → **Sheet**
- URL contains `/document/d/` → **Doc**
- Raw ID with no URL → default to **Doc** unless user context indicates Sheet

Extract the `{docId}` — the string between `/d/` and the next `/` or end of path.

---

## Step 2 — Layer 1: MCP (Google Docs)

The preferred layer. Checks if a Google Docs/Drive MCP server is installed and authenticated.

### 2.1 Check MCP availability

Use ToolSearch to check if any Google Docs or Google Drive MCP tools are available:

```
ToolSearch(query: "google docs drive document", max_results: 5)
```

Evaluate the result:

- **Google Docs/Drive MCP tools found and functional** → proceed to **2.2 Fetch via MCP**
- **MCP tools found but not authenticated** → proceed to **2.3 Guide authentication**
- **No Google Docs MCP tools found** (this is the expected case today) → log and fall through:

> **MCP not available:** No Google Docs/Drive MCP server installed.
> When a Google Docs MCP becomes available, install it for direct document access.
> Falling back to API (Layer 2).

### 2.2 Fetch via MCP

Use the Google Docs MCP tools to fetch the document content. The specific tool depends on what the MCP exposes.

- **Success** → convert content to Markdown if not already, proceed to **Output Contract**
- **Error** → log the error and fall through to Layer 2:

> **MCP fetch failed:** {error message}.
> Falling back to API (Layer 2).

### 2.3 Guide authentication

If an MCP is installed but not authenticated, guide the user:

> **MCP not authenticated:** A Google Docs MCP server is installed but requires authentication.
> Complete the authentication flow as prompted by the MCP server.
> After authentication, Google documents can be fetched directly via MCP.

Ask the user: "Would you like to authenticate the Google Docs MCP now, or skip to API fallback (Layer 2)?"

- **User wants to authenticate** → invoke the MCP authentication tool, wait for the user to complete the flow, then retry **2.2 Fetch via MCP**
- **User declines** → log "User declined MCP authentication, falling to Layer 2" → continue to Step 3

---

## Step 3 — Layer 2: API

Uses the Google Drive/Sheets API with a bearer token or public URL export.

### Strategy selection

- **If `GOOGLE_ACCESS_TOKEN` env var exists** → use **Strategy A (API with token)**
- **If `GOOGLE_ACCESS_TOKEN` is NOT set** → use **Strategy B (Public Export)**
- **If Strategy B fails (private document)** → guide and fall through to Layer 3:

> **API not available:** This document requires authentication and no `GOOGLE_ACCESS_TOKEN` is set.
> Generate a token at https://developers.google.com/oauthplayground/ with the `https://www.googleapis.com/auth/drive.readonly` scope.
> Export: `export GOOGLE_ACCESS_TOKEN="your-token"`.
> Falling back to Browser extraction (Layer 3).

Inform the caller which strategy is being used and whether the document is a **Doc** or **Sheet**.

---

### Google Docs — Strategy A (API with token)

#### A.1 Fetch as Markdown

Use `WebFetch`:
```
WebFetch(
  url: "https://www.googleapis.com/drive/v3/files/{docId}/export?mimeType=text/markdown",
  headers: { "Authorization": "Bearer {GOOGLE_ACCESS_TOKEN}" },
  prompt: "Return the COMPLETE raw content exactly as-is. Do not summarize or truncate."
)
```

If WebFetch cannot send the Authorization header, fall back to Bash:
```bash
curl -sL -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
  "https://www.googleapis.com/drive/v3/files/{docId}/export?mimeType=text/markdown"
```

#### A.2 Validate

- Valid Markdown content → proceed to **Output Contract**
- 401 → guide and fall through to Layer 3:

> **API authentication failed:** Google API returned 401. The token may be expired or invalid.
> Refresh your token at https://developers.google.com/oauthplayground/.
> Falling back to Browser extraction (Layer 3).

- 403 → abort (permissions issue, no fallback can bypass):

> **API access denied:** Google API returned 403. You do not have access to this document.
> Verify document sharing permissions in Google Docs.

- 404 → abort:

> **Document not found:** Google API returned 404. The document ID may be incorrect.
> Verify the URL or document ID.

- Empty response → guide and fall through to Layer 3:

> **API returned empty:** The document appears to be empty or the export failed.
> Falling back to Browser extraction (Layer 3).

**Do not post-process** the Markdown — return Google's native output as-is.

---

### Google Docs — Strategy B (Public Export)

#### B.1 Fetch via public endpoint

```bash
curl -sL "https://docs.google.com/document/d/{docId}/export?format=md"
```

The `-L` flag follows the 307 redirect to `*.googleusercontent.com`.

#### B.2 Validate

- Valid Markdown content → proceed to **Output Contract**
- HTML error page or Google login page → document is private, fall through to Layer 3:

> **Public export not available:** Document is private and requires authentication.
> Set `GOOGLE_ACCESS_TOKEN` for API access, or ensure you are logged into Google in Chrome.
> Falling back to Browser extraction (Layer 3).

- Empty response → fall through to Layer 3:

> **Public export returned empty:** The document appears to be empty or inaccessible.
> Falling back to Browser extraction (Layer 3).

---

### Google Sheets — Strategy A (API with token)

#### A.1 List all sheet tabs

```bash
curl -sL -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
  "https://sheets.googleapis.com/v4/spreadsheets/{docId}?fields=sheets.properties"
```

Returns JSON with `sheets[].properties.title` (sheet name) and `sheets[].properties.sheetId` (gid).

#### A.2 Export each tab as CSV

For each tab:
```bash
curl -sL -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
  "https://docs.google.com/spreadsheets/d/{docId}/export?format=csv&gid={sheetGid}"
```

If the export endpoint fails for a specific tab, fall back to the Sheets API values endpoint:
```bash
curl -sL -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
  "https://sheets.googleapis.com/v4/spreadsheets/{docId}/values/{sheetName}!A:ZZ"
```

Convert the JSON `values` array rows to comma-separated values to produce CSV.

#### A.3 Convert CSV to Markdown tables

For each tab's CSV:
1. Parse CSV correctly — respect quoted fields (fields containing commas, newlines, or double quotes wrapped in `"..."` are a single field)
2. First row = header → `| col1 | col2 | ... |`
3. Separator row → `| --- | --- | ... |`
4. Data rows → `| val1 | val2 | ... |`
5. Escape pipe characters `|` within cell values as `\|`

#### A.4 Concatenate all tabs

For each tab, prepend: `## {sheet_name}` followed by a blank line, then the Markdown table, then a blank line. Tabs appear in the same order as returned by the Sheets API metadata.

#### A.5 Validate

- At least one tab produced valid content → proceed to **Output Contract**
- 401 → guide and fall through to Layer 3:

> **API authentication failed:** Sheets API returned 401. The token may be expired or invalid.
> Refresh your token at https://developers.google.com/oauthplayground/.
> Falling back to Browser extraction (Layer 3).

- 403 → abort:

> **API access denied:** Sheets API returned 403. You do not have access to this spreadsheet.
> Verify spreadsheet sharing permissions or ensure token has `drive.readonly` scope.

- 404 → abort:

> **Spreadsheet not found:** Sheets API returned 404. The spreadsheet ID may be incorrect.
> Verify the URL.

- All tabs empty → fall through to Layer 3:

> **API returned empty:** The spreadsheet appears to be empty.
> Falling back to Browser extraction (Layer 3).

---

### Google Sheets — Strategy B (Public Export)

#### B.1 Export first tab

```bash
curl -sL "https://docs.google.com/spreadsheets/d/{docId}/gviz/tq?tqx=out:csv&gid=0"
```

#### B.2 Validate and convert

- Valid CSV → convert to Markdown table (same rules as Strategy A step A.3), proceed to **Output Contract**
- HTML error page or Google login page → spreadsheet is private, fall through to Layer 3:

> **Public export not available:** Spreadsheet is private and requires authentication.
> Set `GOOGLE_ACCESS_TOKEN` for API access, or ensure you are logged into Google in Chrome.
> Falling back to Browser extraction (Layer 3).

- Empty response → fall through to Layer 3:

> **Public export returned empty:** The spreadsheet appears to be empty or inaccessible.
> Falling back to Browser extraction (Layer 3).

#### B.3 Multi-sheet limitation

Inform the caller: "Public export can only retrieve the first sheet tab. To export all tabs, set `GOOGLE_ACCESS_TOKEN`."

Format the single tab with heading `## Sheet1` followed by the Markdown table.

---

## Step 4 — Layer 3: Browser (Claude in Chrome)

Last resort. Opens the document in Chrome and extracts content via DOM scraping.

### 4.1 Load Chrome tools

Via ToolSearch:
```
select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp
select:mcp__claude-in-chrome__navigate
select:mcp__claude-in-chrome__javascript_tool
```

If Chrome MCP tools are not available, abort:

> **Browser not available:** Claude in Chrome MCP is not installed or not running.
> Install the Claude in Chrome extension and ensure it is connected.
> No further fallback layers available — cannot fetch this document.

### 4.2 Get browser context

```
mcp__claude-in-chrome__tabs_context_mcp(createIfEmpty: true)
```

### 4.3 Navigate to the document

```
mcp__claude-in-chrome__tabs_create_mcp()
mcp__claude-in-chrome__navigate(url: "<full document URL>", tabId: <id>)
```

### 4.4 Execute extraction script

Read `scripts/extract.js` from this skill's directory using the Read tool. Then execute it:

```
mcp__claude-in-chrome__javascript_tool(
  action: "javascript_exec",
  text: <contents of extract.js>,
  tabId: <id>
)
```

The script returns JSON:
```json
{
  "status": "ready",
  "totalLength": 31450,
  "totalChunks": 4,
  "chunkSize": 10000,
  "title": "Document Title",
  "docType": "doc",
  "instructions": "Run window.__gdoc.chunk(0), window.__gdoc.chunk(1), etc."
}
```

If the script returns an `error` field: handle accordingly (login page, empty content, wrong page).

### 4.5 Read chunks

For each chunk from `0` to `totalChunks - 1`:
```
mcp__claude-in-chrome__javascript_tool(
  action: "javascript_exec",
  text: "window.__gdoc.chunk(N)",
  tabId: <id>
)
```

Concatenate all chunks into a single Markdown string.

### 4.6 Validate

Check that the result is not empty and not a login page. If validation fails:

> **Browser extraction failed:** Could not extract content from the document.
> Ensure you are logged into Google in Chrome and the document has loaded.
> No further fallback layers available — cannot fetch this document.

---

## Output Contract

### Save the file

- **Doc** → save to `/tmp/gdoc_{docId}.md`
- **Sheet** → save to `/tmp/gsheet_{docId}.md`

Write the Markdown content using the Write tool. Verify the file was written by reading the first few lines.

### Return to caller

Return to `/bedrock:teach` or `/bedrock:sync`:
- **Output file path**: `/tmp/gdoc_{docId}.md` or `/tmp/gsheet_{docId}.md`
- **Document type**: Doc or Sheet
- **Layer used**: MCP, API, Public Export, or Browser
- **Tabs exported** (Sheets only): number of tabs

The caller copies the file to `$TEACH_TMP/<slug>.md`.

---

## Hard Rules

| Rule | Detail |
|---|---|
| Read-only | Never write back to Google Docs or Sheets. |
| No OAuth interactive flows | Use only existing MCP auth, static token from `GOOGLE_ACCESS_TOKEN`, or browser session. |
| Validate before saving | Do not save empty files, HTML error pages, or Google login pages. |
| Layer order is sacred | Always try MCP → API → Browser, in that order. Never skip ahead unless a layer is unavailable or user declines. |
| Guide before falling through | If a layer exists but is misconfigured, guide the user before moving to the next layer. |
| No Markdown post-processing for Docs | Return Google's native Markdown export as-is (API layer). |
| Export all sheet tabs (API) | Do not skip tabs or allow selective export. |
| Respect CSV quoting rules | Quoted fields are single fields, even with commas or newlines inside. |
| Best-effort | If a layer fails, try the next. If all fail, report and abort — do not retry indefinitely. |
| 403 is terminal | Permission denied cannot be resolved by falling to another layer — abort immediately. |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| No Google Docs MCP available | Expected today — skip to API layer automatically |
| API returns 401 | Token expired — refresh at https://developers.google.com/oauthplayground/ |
| API returns 403 | User lacks access to the document/spreadsheet |
| API returns 404 | Document ID is wrong — verify URL |
| Public export returns HTML login page | Document is private — set `GOOGLE_ACCESS_TOKEN` or use browser |
| Content is truncated | Google Drive API limits exports to 10 MB — document may be too large |
| WebFetch fails to send Authorization header | Fall back to `curl -H "Authorization: Bearer {token}" -sL "<url>"` via Bash |
| Sheets 403 for metadata | Token may lack `drive.readonly` or `spreadsheets.readonly` scope |
| Sheets CSV export returns HTML | Export endpoint blocked — fall back to Sheets API values endpoint |
| Public Sheets export returns only first tab | Expected limitation — multi-sheet export requires `GOOGLE_ACCESS_TOKEN` |
| Chrome extension disconnected | Refresh extension, call `tabs_context_mcp(createIfEmpty: true)` |
| Browser redirects to Google login | User not authenticated — log into Google in Chrome, retry |
| `extract.js` returns empty | Document may not have loaded — wait and retry, or check if document is empty |
