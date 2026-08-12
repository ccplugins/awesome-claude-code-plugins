---
description: Run a UX/visual design audit of a URL using Antigravity (agy). Captures desktop + mobile screenshots, scores 10 dimensions (hierarchy, typography, color, spacing, a11y, etc.), benchmarks against industry. Saves to docs/agy/design-reviews/.
argument-hint: "<url> [focus instructions]"
context: fork
allowed-tools: Bash, Write
---

Route this to the `antigravity:agy-rescue` subagent in MODE: design-review.

Raw user request:
$ARGUMENTS

## Routing rules

1. **Parse the URL**: the first whitespace-separated token of `$ARGUMENTS` that starts with `http://` or `https://` IS the URL. If the user wrote it without a scheme, prepend `https://`. If no URL is found, ask once: "What URL should I review the design of?".

2. **Focus**: everything else in `$ARGUMENTS` is optional natural-language emphasis (e.g., "focus on the checkout flow on mobile", "compare against MercadoLibre seller backend"). Empty by default = full 10-dimension review at both viewports.

3. **Slug**: build from URL host + first path segment (lowercase, non-alphanumeric → `-`, collapse repeats, trim to 60 chars).

4. **Date**: today in `YYYY-MM-DD`.

5. **Paths** (relative to current working directory):
   - `OUTPUT_DIR` = `docs/agy/design-reviews/`
   - `WRITE_FILE` = `docs/agy/design-reviews/<date>-<slug>.md`

6. **Pre-flight** (ONE `Bash` call):
   ```bash
   mkdir -p docs/agy/design-reviews
   ```

7. **Hand off**: pass this header to the subagent:

   ```
   MODE: design-review
   URL: <url>
   FOCUS: <natural-language focus or empty>
   CWD: <absolute path>
   WRITE_FILE: docs/agy/design-reviews/<date>-<slug>.md
   ```

## Operating rules

- The subagent invokes agy with `--add-dir <CWD>` and a long timeout (`12m0s`) because design reviews involve browser navigation + multiple viewports + multimodal vision analysis.
- The subagent reports:
  1. Saved report path.
  2. First ~30 lines (executive summary + design score).
  3. Paths to captured screenshots (desktop + mobile).
- Present that to the user as-is.
- If the URL is blocked, returns non-200, or browser session crashes, surface the error verbatim.

## What the review covers

Default 10-dimension audit:
1. Visual hierarchy
2. Typography (fonts, sizes, line-height, contrast)
3. Color system (palette, WCAG contrast, gradient usage)
4. Spacing & layout (grid, white space, alignment)
5. Interactive elements (button states, form affordance, micro-interactions)
6. Brand & tone (does design match the value-prop?)
7. Accessibility (alt text, focus indicators, ARIA, color contrast)
8. UX heuristics (Nielsen's 10)
9. Mobile/responsive behavior
10. Competitive context (if `--focus` includes a category, agy compares against industry standards)

Ends with:
- 3 concrete strengths
- 3 highest-leverage improvements (ordered by ROI)
- Overall design score /10

## Notes

- Uses agy's browser subagent under the hood — same `--add-dir` + write_file workaround as `/agy:record`.
- For login-protected pages, agy uses an isolated Chrome profile (no shared cookies). For demos behind auth, pass credentials in the focus text (be aware they end up in the prompt).
- For comparing TWO designs, run `/agy:design-review` twice and synthesize. (A `--compare` flag is a v0.4.0 candidate.)
- Captures both desktop (1440×900) and mobile (375×667) viewports by default.
