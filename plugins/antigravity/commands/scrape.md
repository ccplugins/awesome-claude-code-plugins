---
description: Scrape structured data from a single URL using Antigravity (agy). Returns markdown table or JSON. Saves to docs/agy/scrapes/.
argument-hint: "<url> [schema fields or natural language description] [--json]"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: scrape.

Raw user request:
$ARGUMENTS

## Routing rules

1. **Parse the URL**: the first whitespace-separated token of `$ARGUMENTS` that starts with `http://` or `https://` IS the URL. If the user wrote it without a scheme, prepend `https://`. If no URL is found, ask once: "What URL should I scrape?".

2. **Parse `--json`**: if present, set `FORMAT=json` and strip the flag from the remaining text. Default is `FORMAT=md`.

3. **Schema/description**: everything else in `$ARGUMENTS` (whatever is not the URL and not `--json`) is the schema or natural-language extraction description. If empty, agy will infer reasonable fields from the page.

4. **Slug**: build from the URL's host + first path segment (lowercase, non-alphanumeric → `-`, collapse repeats, trim to 60 chars).

5. **Date**: today in `YYYY-MM-DD` (local time).

6. **Paths** (relative to current working directory):
   - `OUTPUT_DIR` = `docs/agy/scrapes/`
   - `WRITE_FILE` = `docs/agy/scrapes/<date>-<slug>.md` (or `.json` if `--json`)

7. **Pre-flight** (ONE `Bash` call):
   ```bash
   mkdir -p docs/agy/scrapes
   ```

8. **Hand off**: pass this header to the subagent:

   ```
   MODE: scrape
   URL: <url>
   SCHEMA: <schema or natural-language description, or empty>
   FORMAT: md|json
   CWD: <absolute path to current working directory>
   WRITE_FILE: docs/agy/scrapes/<date>-<slug>.md
   ```

## Operating rules

- The subagent invokes agy with `--add-dir <CWD>` so it can write the scrape report into the project.
- The subagent reports:
  1. Saved scrape path.
  2. First ~30 lines of the scrape result (preview).
  3. Number of records/fields extracted.
- Present that to the user as-is.
- If the URL returns non-200, the page is blocked by anti-bot, or the structure cannot be parsed, surface the error verbatim.

## Notes

- For JSON-API endpoints, `--json` is preferred. For HTML landing pages or content sites, default `md` table is usually more readable.
- agy uses its browser/read_url tool to fetch — JS-heavy SPAs require the browser subagent (slower but works). Static HTML works via read_url (faster).
- agy uses an isolated Chrome profile if it needs to render JS — no cookies, no logged-in state.
- For aggressive scraping (anti-bot bypass), this is the wrong tool. Use BrightData / ScrapingBee.
