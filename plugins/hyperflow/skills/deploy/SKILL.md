---
name: deploy
description: Use when the user says "ship it", "ready to push", "release", "deploy", or wants pre-push gates (lint, typecheck, build, tests) plus commit/release/push in one flow. Standalone — never auto-invoked; push always requires explicit confirmation.
---

# Deploy

No gate skipped, no failure ignored. If any gate fails, halt and report. Never `--no-verify`. Never bypass.

## Step 1 — Survey State

- `git status` — track uncommitted changes for the commit step
- `git log origin/<branch>..HEAD --oneline` — what's ahead
- Detect package manager and project type from `.hyperflow/profile.md` and root files

## Step 2 — Quality Gates (halt on first failure)

Run gates in order. Print `Gate <n> — <name>` before each.

**Gate A — Lint**

Dispatch `Implementer — running lint`.
- Detect — `npm run lint` / `pnpm lint` / `bun run lint` / `yarn lint` / `eslint .`
- On failure — auto-fix via `--fix`, re-run once. Still failing → halt.
- Skip silently if no lint script.

**Gate B — Typecheck**

- Detect — `tsc --noEmit` / `npm run typecheck` / project-specific
- Skip silently if not a typed project. Halt on failure (no auto-fix).

**Gate C — Build**

- Detect — `npm run build` / `pnpm build` / `bun run build`
- Skip silently if no build script. Halt on failure.

**Gate D — Tests**

- Detect runner from `.hyperflow/testing.md` (vitest, jest, playwright, pytest, etc.)
- Run full suite — not just affected. Halt on failure.

See [quality-gates.md](../hyperflow/quality-gates.md) for gate details.

## Step 3 — Security Sweep

Dispatch `**Reviewer** — security sweep on staged + recent changes` with model: opus.

Per [security.md](../hyperflow/security.md), scan for hardcoded secrets, API keys, private keys, connection strings. If any found → halt with `SECURITY_VIOLATION:` marker.

## Step 4 — Commit

- Worker-introduced fixes from Step 2 → commit automatically with a conventional commit message.
- Pre-existing user-owned uncommitted changes → use `AskUserQuestion` to confirm inclusion. Per DOCTRINE rule 8, mark a recommended option:

  ```
  Include uncommitted user changes in this commit?
    Include (Recommended) — your local work + the pre-push fixes ship together
    Exclude               — commit only the worker fixes; user changes stay local
  ```

- **Never** add `Co-Authored-By: Claude` in commit messages — see [git-workflow.md](../hyperflow/git-workflow.md).

## Step 5 — Release

- `scripts/release.sh` exists → run it.
- `release-please` / `changesets` / similar detected → use it.
- "Nothing to release" or no releasable commits → skip.
- Otherwise → skip (user releases manually).

## Step 6 — Push (confirmation required · STRUCTURAL GATE)

Use `AskUserQuestion`. Per DOCTRINE rule 8, mark a recommended option — but the recommendation depends on gate state. If all gates passed and the diff looks clean, recommend `Push`; if anything was marginal (test flakiness, large diff, etc.), recommend `Hold`.

```
Push to origin/<branch>?
  Push (Recommended)  — all gates pass · safe to ship
  Hold                — keep local; you can push later
```

- **Never force-push to main or master.**
- On yes — `git push`, then `git push --tags` if release created tags.

## Step 7 — Output

```
── Ship Result ───────────────────
Branch: <name>
Gates: lint pass · typecheck pass · build pass · tests pass (<n> passed)
Security: pass
Commit: <sha> <message>
Release: v<x.y.z> (or skipped)
Push: confirmed (or held)
──────────────────────────────────
```

On gate failure:

```
── Ship Result ───────────────────
Branch: <name>
Gates: lint pass · typecheck fail · tests skipped · build skipped
  typecheck: 3 errors in src/auth/middleware.ts
Halted at Gate B
──────────────────────────────────
```

Use `pass` / `fail` / `skipped` as plain words — no `✓` / `✗` / `—` symbols.

## Anti-patterns

- `--no-verify`, `--no-gpg-sign`, bypassing hooks
- Ignoring failing tests
- Force-pushing to main
- Auto-pushing without explicit confirmation
- Committing `Co-Authored-By: Claude`

## Memory

After successful ship, append to `.hyperflow/memory/patterns.md` if any new pattern was confirmed during gates. Skip if nothing new.

## Doctrine

Full rules in [DOCTRINE.md](../hyperflow/DOCTRINE.md). Output style in [output-style.md](../hyperflow/output-style.md).
