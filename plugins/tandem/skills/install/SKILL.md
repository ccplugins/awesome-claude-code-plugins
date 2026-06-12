---
name: install
description: Wire the Tandem PM kit into a project — materialize the full folder tree + seed files from the manifest, pin the folder layout, merge the pm:* scripts, guard-register hooks, and generate the Command Center dashboard. Use when the user asks to install Tandem, set up the PM kit, onboard a new repo, wire the kit, or invokes /Tandem:install. Thin wrapper over the canonical install.js (pm:install) — the script does the deterministic work; this skill handles the conversational choices (layout, PROJECT-CONTEXT) and confirms the result.
---

# Tandem: install (operator setup)

Wire the PM kit into the current project (or a `--target`) so a fresh repo gets the complete
`_00-Project-Management/` tree, seed files, wired `pm:*` scripts, and a working dashboard — in one
command. This skill is the entry point; the deterministic work lives in the canonical
`install.js` script (`pm:install`), so behaviour stays testable and identical whether invoked here
or from the CLI.

## Source of truth
`_00-Project-Management/93-Scripts/install.js` (run as `npm run pm:install`). It is idempotent and
additive — re-running it never overwrites an existing definition or a user-owned file. See
ADR-0072 (manifest schema + kit/user ownership boundary) and ADR-0054 (canonical entrypoint).

## What it does (delegated to install.js)
1. **Materialize the tree** — create every folder declared in `lib/pm-manifest.json` and copy seed
   files under the kit/user ownership rule (kit-owned overwritten; user-owned written only when
   absent, so an operator's edits survive a re-install).
2. **Pin the layout** — write `.claude-pm-config.json` (`layout`, `kitVersion`) and
   `90-Standards/pm-paths.json` from the detected or chosen preset.
3. **Wire scripts + hooks** — merge the `pm:*` scripts into the host `package.json` and
   guard-register the Claude Code hooks (only when absent — ADR-0055).
4. **Generate HTML** — run the dashboard generator so the Command Center opens with the project's
   own name and working links.

## How to run it
- Default (this repo): `npm run pm:install`
- Another project root: `node _00-Project-Management/93-Scripts/install.js --target <dir>`
- Pin a layout instead of auto-detecting: `--layout full|flattened`
- Preview without writing: `--dry-run`

## Conversational steps this skill owns
- **Layout choice** — if the project's layout is ambiguous, confirm `full` vs `flattened` with the
  operator before pinning it (default: auto-detect → `full`).
- **PROJECT-CONTEXT fill** — `90-Standards/PROJECT-CONTEXT.md` is seeded as a user-owned starting
  point; offer to fill in the project's stack quirks / gotchas so later skills have real context.
- **Confirm the result** — after install, surface the generated dashboard path and recommend
  `npm run pm:doctor` to verify the wiring is healthy.

## Non-negotiable rules
- Adds **no** destructive behaviour beyond `install.js`. This skill never deletes or moves a user's
  work; it only orchestrates the script and confirms.
- Keep deterministic logic in the script — the skill only orchestrates + confirms.

## Next
Next: `/Tandem:session-start` (orient), then begin planning with `/Tandem:draft-okrs`. Pull kit
improvements later with `/Tandem:update`.
