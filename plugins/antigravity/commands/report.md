---
description: Generate a publication-grade HTML report from a markdown source using the TRAID Design System catalog (5 templates). Agy matches content to template, you confirm, agy produces final branded HTML.
argument-hint: "<markdown_path> [--template <id>] [--output <html_path>]"
context: fork
allowed-tools: Bash, Read, Write, Agent, AskUserQuestion
---

Two-phase orchestrator using the canonical TRAID Design System catalog of 5 templates: `traid-dark`, `traid-light`, `stripe-press`, `notion-docs`, `magazine`. Full specs in `knowledge/traid/design-system/design-system.md`.

Raw user request:
$ARGUMENTS

## Phase 1 — Parse and validate

- Parse optional flags:
  - `--template <id>` — if provided with a valid id (`traid-dark | traid-light | stripe-press | notion-docs | magazine`), SKIP Phase 2 and Phase 3 (analyze + ask) and use that template directly.
  - `--output <path>` — custom output HTML path.
  - `--images <mode>` — `native` (default) | `external` | `none`. Controls how `![generate: ...]` cues become images:
    - `native`: agy generates each image itself (no external deps; quality/format inconsistent in headless agy — broken/missing images are caught by the Phase 5 check).
    - `external`: agy only references `<basename>.assets/<slug>.png`; YOU (or the caller) pre-generate those PNGs with a dedicated image model. **Recommended for brand-quality infographics.** See "Image strategy" below.
    - `none`: styled placeholders instead of images (no broken `<img>`).
- What remains after stripping flags is the markdown source path.
- If the source path is empty, ask once: "Which markdown file should agy turn into a report?"
- Resolve the source path against the current working directory if relative. If it doesn't exist or isn't readable, stop without invoking the subagent.
- Compute default output if `--output` omitted:
  - `output-slug` = source filename minus extension, lowercased, non-alphanumeric → `-`, collapsed, trimmed 60 chars. (Distinct from the per-image `<slug>` used for `![generate:]` cues below.)
  - `date` = today YYYY-MM-DD.
  - `output` = `docs/agy/reports/<date>-<output-slug>.html` relative to CWD.
- Ensure output dir exists:
  ```bash
  mkdir -p docs/agy/reports
  ```

## Phase 2 — Analyze (SKIP if `--template` was provided)

Invoke the `antigravity:agy-rescue` subagent with this header:

```
MODE: report-analyze
INTENSITY:
MODEL:
RESUME: false
WRITE_FILE:
SOURCE_FILE: <absolute path to source markdown>
USER_TEXT:
```

The subagent matches the source content against the embedded 5-template catalog and returns JSON of the shape:

```json
{
  "content_analysis": {
    "tone": "...",
    "audience": "internal | client-facing | research | publication",
    "structure": "...",
    "key_cues": ["...", "...", "..."]
  },
  "recommendations": [
    {"template_id": "traid-dark | traid-light | stripe-press | notion-docs | magazine", "rank": 1, "fit_score": "high|medium|low", "justification": "..."},
    { ... up to 2 more ... }
  ]
}
```

The subagent returns the raw JSON.

## Phase 3 — Ask user (SKIP if `--template` was provided OR if recommendations has exactly 1 entry)

Parse the JSON. Cases:

- **Exactly 1 recommendation with fit_score "high"** → auto-select it, tell the user "Auto-selected `<name>` (high fit: <justification>)" and proceed to Phase 4.
- **2-3 recommendations** → use `AskUserQuestion` with the recommended template_ids as options. Each option's `label` is the template's display name; each option's `description` combines `fit_score`, `justification`, and a one-line vibe summary.
- **JSON parse failed or zero recommendations** → fall back to asking the user freeform which of the 5 templates to use (list all 5 from the catalog).

The catalog of valid template_ids and their display names:

| `template_id` | Display name | One-line vibe |
|---|---|---|
| `traid-dark` | TRAID Dark Deck | Pink + obsidian, commercial nocturnal, glow halos |
| `traid-light` | TRAID Sales Deck | Pink + white + ink dark, commercial print-ready A4 |
| `stripe-press` | Stripe Press Editorial | Source Serif 4 + indigo, scholarly premium |
| `notion-docs` | Notion Modern Docs | System sans + color-coded callouts + TOC sidebar |
| `magazine` | Magazine Editorial Wired 2023 | Fraunces + gradient + pull-quotes, bold longform |

## Phase 4 — Generate (subagent MODE: report-generate)

Construct the full STYLE_SPEC for the chosen `template_id` by reading the section for that template from `knowledge/traid/design-system/design-system.md`. The STYLE_SPEC must include:

- Template ID + display name
- Full palette (every CSS custom property with hex)
- Typography pairing (family + size + weight + line-height)
- Layout (max-width + padding + column structure)
- Required components (named with their CSS class conventions)
- Anti-patterns
- Reference exemplar (if any)

Then invoke the subagent:

```
MODE: report-generate
INTENSITY:
MODEL:
RESUME: false
WRITE_FILE: <output path computed in phase 1>
SOURCE_FILE: <absolute path to source markdown>
STYLE_SPEC: <full multiline STYLE_SPEC block per design-system.md>
IMAGES: <native|external|none from --images flag, default native>
USER_TEXT:
```

If `--images external`: BEFORE invoking report-generate, compute the assets dir (`<output basename>.assets/` next to the HTML) and the expected `<slug>.png` filenames for each `![generate: ...]` cue in the source (slug = description lowercased, non-alphanumeric → `-`, collapsed, trimmed 60 chars). Generate those PNGs with whatever image model the user has available (e.g. the `gemini_image_generation` MCP tool with model `gemini-3.1-flash-image-preview` / Nano Banana 2 — include the TRAID brand signature in commercial prompts), saving each as `<assets-dir>/<slug>.png`, THEN run report-generate so agy references the already-present files.

The subagent calls agy with a prompt that asks it to:
- Read `SOURCE_FILE`.
- Apply the full `STYLE_SPEC` rigorously — palette, typography, components, anti-patterns are all non-negotiable.
- For each `![generate: <description>]` cue in the markdown, invoke the native `generate_image` tool and embed inline.
- Compose a single self-contained HTML.
- Write to `WRITE_FILE` via `write_file`.

## Phase 5 — Report back

When the subagent returns, present:
1. Saved HTML path (absolute).
2. Template selected (display name + template_id).
3. Images: the `IMAGES_PRESENT=<n>/<total>` line from the assets-existence check, the IMAGES mode used, and — if any are missing — the list of expected `<slug>.png` and the `ASSETS_DIR` path. If images are missing in `native` mode, suggest re-running with `--images external` (pre-generate the PNGs) or `--images none`.
4. Open hint for the user's platform:
   - Windows: `start "<path>"`
   - macOS: `open "<path>"`
   - Linux: `xdg-open "<path>"`
   - (Note: opening via `file://` may block local `<img>` loading in some setups; if images don't show, serve the folder with `python -m http.server` and open over `http://`.)

## Operating rules

- If agy reports missing/unauthenticated at any phase, tell the user to run `/agy:setup` and stop.
- Do not paraphrase agy's output between phases.
- If `--template <id>` is invalid (not one of the 5 canonical IDs), reject with an error listing valid IDs and stop.
- If the source markdown has zero `![generate: ...]` cues, agy still produces HTML — log it as "0 images".
- The full design system reference lives in `knowledge/traid/design-system/design-system.md`. Keep this command and that document in sync — if a template is added/removed/changed there, update Phase 3 catalog table and Phase 1 valid `--template` IDs here.

## Image strategy (infographics)

The intended flow is: **you write a clean source `.md` with `![generate: <description>]` cues, agy turns it into a branded document, and the cues become infographics.** How the images are produced depends on `--images`:

- **`--images native` (default):** agy generates the images itself. Zero setup, but in headless mode agy is unreliable — it may emit JPEG bytes under a `.png` name, or reference images it never created (broken `<img>`). The Phase 5 assets-existence check catches this and tells you what's missing. Fine for drafts and quick internal docs.
- **`--images external` (recommended for client/brand-grade infographics):** generate the PNGs yourself with a dedicated image model — e.g. **Nano Banana 2** (`gemini_image_generation`, model `gemini-3.1-flash-image-preview`) — into the `<basename>.assets/` dir using the slug convention, THEN run report-generate so agy just references them. Real PNGs, full brand control, deterministic. This is the path that produces the polished result.
- **`--images none`:** styled placeholder boxes (the description as caption) instead of images — useful when you'll drop final art in later or the doc is text-first.

Slug convention (so pre-generated filenames match agy's references): `<description lowercased, non-alphanumeric → "-", collapsed, trimmed to 60 chars>.png`.
