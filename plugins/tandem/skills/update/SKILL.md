---
name: update
description: Pull Tandem kit improvements into an already-installed project without touching your work — refresh only kit-owned files (templates, standards, tooling) + regenerate the dashboard, never the operator's artefacts or folder structure. Use when the user asks to update Tandem, upgrade the PM kit, pull kit changes, refresh tooling, or invokes /Tandem:update. Thin wrapper over the canonical update.js (pm:update); shows the change diff and confirms before applying.
---

# Tandem: update (non-destructive refresh)

Refresh an already-installed project's kit to the current version **without ever touching the
operator's work**. This skill is the entry point; the deterministic, safety-critical work lives in
the canonical `update.js` script (`pm:update`).

## Source of truth
`_00-Project-Management/93-Scripts/update.js` (run as `npm run pm:update`). See ADR-0073 (update is
manually triggered; `pm:doctor` only reports drift) and ADR-0072 (kit/user ownership boundary).

## The non-destructive contract (load-bearing)
- Refreshes **only** `ownership:kit` content — manifest kit seed files (templates, standards, the
  PM-folder CLAUDE.md) + the `93-Scripts/` tooling.
- **Never** writes an `ownership:user` path (PROJECT-CONTEXT.md, MONITOR.md, ACTIVE.md, settings.json)
  or any work folder (epics/stories/…) — they stay byte-identical.
- **Never** creates, removes, or moves a folder — the folder set is unchanged.

## How to run it
- Preview the change diff first (recommended): `node _00-Project-Management/93-Scripts/update.js --dry-run`
- Apply: `npm run pm:update` (or `--target <dir>` for another project root)
- Check for drift first: `npm run pm:doctor` prints `update available` when the installed
  `kitVersion` is behind the shipped one (read-only — it writes nothing).

## Conversational steps this skill owns
- **Show the diff** — run `--dry-run` and present the list of kit files that *would* refresh + the
  `kitVersion` bump, so the operator sees exactly what changes.
- **Confirm before applying** — only run the real `pm:update` after the operator confirms the diff.
- **Report** — after applying, surface the count of refreshed files, the new `kitVersion`, and the
  regenerated dashboard path.

## Non-negotiable rules
- Adds **no** destructive behaviour beyond `update.js`. Never deletes or moves the operator's work.
- Keep deterministic logic in the script — the skill only previews (diff), confirms, and reports.

## Next
Next: `/Tandem:session-start` to re-orient after a refresh, or `/Tandem:weekly-monitor` to fold the
change into the Friday cadence.
