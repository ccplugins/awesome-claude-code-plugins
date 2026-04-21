---
name: confluence-to-markdown
description: >
  Internal fetcher module for Confluence pages. Fetches content via Atlassian MCP (preferred),
  REST API with Basic Auth (fallback), or browser DOM extraction via Claude in Chrome (last resort)
  and returns Markdown. Used by /bedrock:teach and /bedrock:sync — not intended for direct user invocation.
user_invocable: false
allowed-tools: Bash, Read, Write, WebFetch, ToolSearch, mcp__plugin_atlassian_atlassian__*, mcp__claude-in-chrome__*
---

# Confluence Fetcher

Internal module — invoked by `/bedrock:teach` Phase 1 and `/bedrock:sync` Phase 2, not user-invocable.

Fetches a Confluence page and returns its content as Markdown. Three layers in fallback order:
**MCP (preferred) → REST API → Browser DOM extraction.**

**Dependency:** Browser fallback (Layer 3) requires `scripts/extract.js` (relative to this skill directory).

---

## Step 1 — Parse URL

Parse the Confluence URL. Accept these formats:
- `https://<domain>.atlassian.net/wiki/spaces/<spaceKey>/pages/<pageId>/<title>`
- `https://<domain>.atlassian.net/wiki/spaces/<spaceKey>/pages/<pageId>`
- `https://<domain>.atlassian.net/wiki/x/<shortlink>`
- `https://<domain>.atlassian.net/wiki/pages/viewpage.action?pageId=<pageId>`

Extract:
- **Base URL**: `https://<domain>.atlassian.net` (everything before `/wiki/...`)
- **Page ID**: the numeric ID from the URL path (segment after `/pages/`) or `pageId` query parameter
- **Full URL**: the original URL as provided (needed for browser fallback)

---

## Step 2 — Layer 1: MCP (Atlassian)

The preferred layer. Uses the `plugin:atlassian:atlassian` MCP server if installed and authenticated.

### 2.1 Check MCP availability

Use ToolSearch to check if Atlassian MCP tools are available:

```
ToolSearch(query: "atlassian confluence page", max_results: 5)
```

Evaluate the result:

- **MCP tools found and functional** (tools other than `authenticate` and `complete_authentication` are available) → proceed to **2.2 Fetch via MCP**
- **Only `authenticate` / `complete_authentication` tools found** (MCP installed but not authenticated) → proceed to **2.3 Guide authentication**
- **No Atlassian MCP tools found** → log and fall through:

> **MCP not available:** No Atlassian MCP server installed.
> Install the Atlassian MCP plugin for Claude Code to enable direct Confluence access.
> Falling back to API (Layer 2).

### 2.2 Fetch via MCP

Use the Atlassian MCP tools to fetch the page content. The specific tool depends on what the MCP exposes after authentication (typically a page read or content retrieval tool).

Call the MCP tool passing the page ID or URL. The MCP returns the page content directly.

- **Success** → convert content to Markdown if not already, proceed to **Output Contract**
- **Error** → log the error and fall through to Layer 2:

> **MCP fetch failed:** {error message}.
> Falling back to API (Layer 2).

### 2.3 Guide authentication

If the MCP is installed but not authenticated, guide the user:

> **MCP not authenticated:** The Atlassian MCP server is installed but requires authentication.
> Run `mcp__plugin_atlassian_atlassian__authenticate` to start the OAuth flow, then complete it in your browser.
> After authentication, Confluence pages can be fetched directly via MCP.

Ask the user: "Would you like to authenticate the Atlassian MCP now, or skip to API fallback (Layer 2)?"

- **User wants to authenticate** → invoke `mcp__plugin_atlassian_atlassian__authenticate`, wait for the user to complete the OAuth flow, then retry **2.2 Fetch via MCP**
- **User declines** → log "User declined MCP authentication, falling to Layer 2" → continue to Step 3

---

## Step 3 — Layer 2: API (REST)

Uses the Confluence REST API with Basic Auth (API token + email).

### 3.1 Check credentials

```bash
echo "CONFLUENCE_API_TOKEN: ${CONFLUENCE_API_TOKEN:+set}" && echo "CONFLUENCE_USER_EMAIL: ${CONFLUENCE_USER_EMAIL:+set}"
```

- **Both set** → proceed to **3.2 Compute auth header**
- **Either missing** → guide and fall through:

> **API not available:** `CONFLUENCE_API_TOKEN` or `CONFLUENCE_USER_EMAIL` environment variable is not set.
> Generate an API token at https://id.atlassian.com/manage-profile/security/api-tokens and export both variables:
> `export CONFLUENCE_API_TOKEN="your-token"` and `export CONFLUENCE_USER_EMAIL="your-email"`.
> Falling back to Browser extraction (Layer 3).

### 3.2 Compute Basic Auth header

```bash
echo -n "${CONFLUENCE_USER_EMAIL}:${CONFLUENCE_API_TOKEN}" | base64
```

### 3.3 Fetch the page

Use `WebFetch`:
```
WebFetch(
  url: "{baseUrl}/wiki/api/v2/pages/{pageId}?body-format=storage",
  headers: {
    "Authorization": "Basic {base64_value}",
    "Accept": "application/json"
  }
)
```

If WebFetch cannot send the Authorization header, fall back to `curl` via Bash:
```bash
curl -sL -H "Authorization: Basic {base64_value}" -H "Accept: application/json" \
  "{baseUrl}/wiki/api/v2/pages/{pageId}?body-format=storage"
```

### 3.4 Extract content from response

The API returns JSON with:
- `title` — page title
- `body.storage.value` — XHTML content (Confluence storage format)

### 3.5 Convert XHTML to Markdown

Convert the storage format XHTML to Markdown using these rules:

| XHTML element | Markdown output |
|---|---|
| `<h1>` through `<h6>` | `#` through `######` |
| `<p>` | Paragraph with blank line separation |
| `<strong>`, `<b>` | `**text**` |
| `<em>`, `<i>` | `*text*` |
| `<s>`, `<del>` | `~~text~~` |
| `<a href="...">` | `[text](url)` |
| `<ul>` / `<ol>` / `<li>` | Markdown lists (respect nesting) |
| `<table>` | Markdown table with `\|` separators and header row |
| `<ac:structured-macro ac:name="code">` | Fenced code block with language from `<ac:parameter ac:name="language">` |
| `<pre>` | Fenced code block |
| `<code>` (inline) | `` `code` `` |
| `<blockquote>` | `> text` |
| `<hr>` | `---` |
| Confluence macros (`<ac:*>`) with text | Extract text content |
| Confluence macros with no text (images, drawio, attachments) | Skip silently |

### 3.6 Error handling

| HTTP status | Action |
|---|---|
| 200 OK | Proceed to **Output Contract** |
| 401 Unauthorized | Log and fall through to Layer 3: |

> **API authentication failed:** API returned 401. The token may be expired or invalid.
> Regenerate your token at https://id.atlassian.com/manage-profile/security/api-tokens.
> Falling back to Browser extraction (Layer 3).

| HTTP status | Action |
|---|---|
| 403 Forbidden | Abort (no fallback can bypass permissions): |

> **API access denied:** API returned 403. The user does not have access to this page.
> Verify page permissions in Confluence.

| HTTP status | Action |
|---|---|
| 404 Not Found | Abort: |

> **Page not found:** API returned 404. The page ID may be incorrect.
> Verify the URL: `{original_url}`.

---

## Step 4 — Layer 3: Browser (Claude in Chrome)

Last resort. Opens the page in Chrome and extracts content via DOM scraping.

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
> No further fallback layers available — cannot fetch this Confluence page.

### 4.2 Get browser context

```
mcp__claude-in-chrome__tabs_context_mcp(createIfEmpty: true)
```

### 4.3 Navigate to the page

```
mcp__claude-in-chrome__tabs_create_mcp()
mcp__claude-in-chrome__navigate(url: "<full confluence URL>", tabId: <id>)
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
  "totalLength": 52969,
  "totalChunks": 6,
  "chunkSize": 10000,
  "title": "Page Title",
  "instructions": "Run window.__confluence.chunk(0), window.__confluence.chunk(1), etc."
}
```

If the script returns an `error` field: handle accordingly (login page, empty content, wrong page).

### 4.5 Read chunks

For each chunk from `0` to `totalChunks - 1`:
```
mcp__claude-in-chrome__javascript_tool(
  action: "javascript_exec",
  text: "window.__confluence.chunk(N)",
  tabId: <id>
)
```

Concatenate all chunks into a single Markdown string.

### 4.6 Validate

Check that the result is not empty and not a login page. If validation fails:

> **Browser extraction failed:** Could not extract content from the page.
> Ensure you are logged into Confluence in Chrome and the page has loaded.
> No further fallback layers available — cannot fetch this Confluence page.

---

## Output Contract

Return to the caller (`/bedrock:teach` or `/bedrock:sync`):
- **Markdown content**: the full page content as Markdown
- **Page title**: extracted from MCP response, API response (`title` field), or browser extraction (`title` in JSON)
- **Layer used**: MCP, API, or Browser

The caller is responsible for saving the content to its target location.

---

## Hard Rules

| Rule | Detail |
|---|---|
| Read-only | Never write back to Confluence. |
| No OAuth interactive flows | Use only existing MCP auth, API tokens, or browser sessions. |
| Validate before returning | Do not return empty content, HTML error pages, or login pages. |
| Layer order is sacred | Always try MCP → API → Browser, in that order. Never skip ahead unless a layer is unavailable or user declines. |
| Guide before falling through | If a layer exists but is misconfigured, guide the user before moving to the next layer. |
| Skip rich media silently | Images, diagrams, drawio, and attachment macros are omitted without error. |
| Best-effort | If a layer fails, try the next. If all fail, report and abort — do not retry indefinitely. |
| 403 is terminal | Permission denied cannot be resolved by falling to another layer — abort immediately. |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| MCP not authenticated | Run `mcp__plugin_atlassian_atlassian__authenticate` to start OAuth flow |
| MCP tools not found | Atlassian MCP plugin not installed — use API or browser fallback |
| API returns 401 | Token expired — regenerate at https://id.atlassian.com/manage-profile/security/api-tokens |
| API returns 403 | User lacks page access — check Confluence permissions |
| API returns 404 | Wrong page ID — verify URL |
| Chrome extension disconnected | Refresh extension, call `tabs_context_mcp(createIfEmpty: true)` |
| Browser redirects to login | User not authenticated — log into Confluence in Chrome, retry |
| `extract.js` returns empty | Page may not have loaded — wait and retry, or check if page is empty |
| Shortlink URL (`/wiki/x/...`) with API | Navigate in browser first to resolve full URL with page ID |
