# Activation test — `path-scope-example`

Verifies the `paths:` scoping declared in `SKILL.md` (`_00-Project-Management/40-Decisions/**/*`)
per ADR-0010: the skill must **activate in-scope** and stay **silent out-of-scope**. This is a
documented activation spec (the kit's static-analysis testing convention) — each case states the
trigger, the expected auto-load behaviour, and how to confirm it.

## Case A — in-scope → activates

- **Trigger:** Claude reads or writes a file under `_00-Project-Management/40-Decisions/`
  (e.g. creating `ADR-0077-some-decision.md`, or editing an existing `ADR-*.md`).
- **Expected:** the skill **activates** (auto-loads) — the ADR-authoring reminder is available
  because the touched file matches the `paths:` glob.
- **Confirm:** the touched path matches `_00-Project-Management/40-Decisions/**/*`. A file at
  `…/40-Decisions/ADR-0077-x.md` matches → in-scope, skill loads.

## Case B — out-of-scope → does not activate (silent)

- **Trigger:** Claude works anywhere outside the decisions folder — e.g. editing
  `_00-Project-Management/32-Stories/EPIC-17/FEAT-17.2/STORY-17.2.01-*.md`, a file under `skills/`,
  or a source file at the repo root.
- **Expected:** the skill is **silent** — it does **not** auto-load, because no touched file
  matches the `paths:` glob. (It remains explicitly invocable, but is not auto-surfaced.)
- **Confirm:** none of `32-Stories/…`, `skills/…`, `package.json` match
  `_00-Project-Management/40-Decisions/**/*` → out-of-scope, skill stays silent.

## Boundary notes

- `paths:` narrows **auto-load**, not invocation or permissions (ADR-0010, nuance 1): out-of-scope
  the skill is silent but still reachable if explicitly invoked.
- Trigger is **file-touch**, not cwd (ADR-0010, nuance 3): opening a decisions file from any working
  directory activates Case A; merely `cd`-ing into the folder without touching a matching file does not.
- `paths:` is **additive** with `description:` (nuance 2): in-scope, the description-match still
  gates the final activation; out-of-scope, the description-match is suppressed.
