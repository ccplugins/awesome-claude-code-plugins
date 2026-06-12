---
name: start-phase
description: Open a phase — the opener counterpart to close-phase. Use when the user asks to start a phase, open a phase, begin a phase, kick off a phase / batch / chat, or cut the phase branch before an execute-batch run. Resolves an explicit phase target, gates the entry state (clean working tree + currently on main + every phase story DoR-ready), then cuts the phase branch off main and records the open on the board.
---

# Tandem: start-phase (PM hat)

Operate as **PM hat**. `start-phase` is the **opener counterpart to `close-phase`**: where
`close-phase` is the per-phase Definition-of-Done gate that wraps a finished phase up and merges it
to `main`, `start-phase` is its mirror at the front — it **opens** a phase safely before an
`execution-strategist` chat / `execute-batch` run begins. The two skills share one phase-branch
convention (`40-Decisions/`, ADR-0045): `start-phase` **cuts** `phase/<phase-id>` off `main`,
`close-phase` later **merges** that same branch back to `main`.

It runs in a fixed order, each step gated on the one before it:

1. **Phase-scope detection** — resolve the set of stories in an explicit target, and echo them.
2. **Entry gate** — clean working tree + currently on `main` + every phase story DoR-ready, or
   **abort and list** the specific gap.
3. **Branch creation** — cut `phase/<phase-id>` off `main` per the convention; surface the
   checkout command (never force, no `gh` assumed).
4. **Board update** — record the open on `MONITOR.md` + `ACTIVE.md` and regenerate the dashboard.

> **Gate-then-act.** Step 1 only reads; Step 2 is a hard gate; once it passes, Steps 3–4 act. If the
> entry gate fails, `start-phase` **stops and reports the failing item** — it never branches from a
> dirty tree, off the wrong base, or for a phase whose stories aren't ready. This mirrors
> `close-phase`'s done-gate discipline, inverted for entry: the abort-and-list path is the
> load-bearing behaviour.

## Step 1 — Phase-scope detection (EXPLICIT target — never guess)

Take an **explicit** phase / chat / epic **target** from the user — never infer which phase to
open from ambient state (mirrors `close-phase` Step 1). Accepted targets:

- a **strategist phase** or **chat id** (e.g. `CHAT-01`) from an `EXECUTION-STRATEGY-*.json`
  sidecar — resolve to the `stories[]` listed under that chat / phase;
- an **`EPIC-NN`** (or a single **`FEAT-NN.M`**) — resolve the **set of stories** belonging to that
  epic / feature by globbing `32-Stories/EPIC-NN/...`.

**Resolve the set of stories** in the target, then **echo the resolved list** (each `id` +
`status`) back to the user so the scope is explicit and reviewable before anything is created. If
the target is **ambiguous, missing, or zero-story**, **stop and ask** for a concrete
phase / chat / epic — do not guess which stories are in scope. A target that resolves to no
stories is treated as a missing target: abort rather than open an empty phase.

## Step 2 — Entry gate (abort-and-list — never open from a bad state)

Before creating anything, verify **all three** entry conditions. This is a hard gate:

- **Clean working tree** — `git status --porcelain` is empty (no uncommitted changes); a phase
  must not be opened on top of unrelated dirty edits.
- **Currently on `main`** — the phase branch is cut from `main` (ADR-0045), so the entry branch
  must be `main` (`git branch --show-current` → `main`). Opening from another branch would give
  the phase branch the wrong base.
- **Every phase story DoR-ready** — each resolved story carries `status: ready` in its frontmatter
  (the kit's Definition-of-Ready gate). A `not-started` / un-refined story must go through
  `/Tandem:refine-backlog` first.

If **all three** pass → proceed (Step 3, branch creation). If **any** fails → **abort and list the
specific gap** — name exactly which item failed (the dirty paths, the current branch if not
`main`, or each not-ready story `id` + its `status`) so the operator knows precisely what to fix.
`start-phase` never opens a phase from a dirty tree, off a non-`main` base, or with stories that
aren't ready; a half-opened phase is worse than an un-opened one.

## Step 3 — Create the phase branch off `main` (surface the command — never force)

Once the entry gate passes, create the phase branch per the shared convention (`40-Decisions/`,
ADR-0045): name **`phase/<phase-id>`**, **cut from `main`**.

- **Branch off `main`.** The phase branch is created **from `main`** (the entry gate already
  confirmed you're on `main`), giving it the clean base `close-phase` will later merge back.
  `<phase-id>` is the explicit target's id (e.g. `phase/chat-01`, `phase/epic-10`), lowercased,
  exactly per the convention ADR-0045.
- **Surface a copy-pasteable command — never force, no `gh` assumed.** `start-phase` **surfaces**
  the branch-create command for the operator rather than force-creating it:

  ```bash
  git switch -c phase/<phase-id> main      # equivalently: git checkout -b phase/<phase-id> main
  ```

  The command is **never a force operation** — `start-phase` **never force-creates** or clobbers a
  branch (no `--force`, no `-B` reset), and it assumes **no `gh` CLI** (a plain `git` command /
  link is surfaced, not a host API call). This mirrors `close-phase` Step 7 — surface the command,
  never force — inverted for branch creation. If a `phase/<phase-id>` branch already exists, **stop
  and surface that** rather than overwrite it.

## Step 4 — Record the open on the board (MONITOR + ACTIVE) + regenerate the dashboard

With the phase branch created, record that the phase is now **open** so the live board reflects it
the moment it opens — the front-end mirror of `close-phase` Step 5 (which records the close):

- **MONITOR** — update `42-Monitor/MONITOR.md`: note the phase's stories are now **in-flight**,
  plus a one-line **revision-history** entry dated today recording that the phase opened.
- **ACTIVE** — add the now-in-progress story pointers to `12-Active/ACTIVE.md` (the live WIP index
  of `in-progress` items), per the kit's "when you change a status" rule — the moment the phase
  opens, its stories appear on the board.
- **Dashboard** — regenerate it with `npm run pm:dash` so `42-Monitor/DASHBOARD.html` reflects the
  opened phase. The MONITOR/ACTIVE edits and the dashboard regen happen in the same step (the kit's
  atomic status-change rule).

## Non-negotiable rules (from CLAUDE.md)

- Operates as **PM hat**; the phase-level opener analogue of `close-phase`.
- Scope detection takes an **explicit** target (never guesses); the **entry gate** (Step 2) is a
  hard gate — abort and list the failing item, never open from a bad entry state.
- Branch creation (Step 3) **surfaces** the `git switch -c … main` command and **never force**s,
  assuming **no `gh`** — per the shared phase-branch convention (ADR-0045) and the project root
  `CLAUDE.md` git rules (branch first; no force without authorisation).
- Board update (Step 4) follows the kit's "when you change a status" rule — the `MONITOR.md` +
  `ACTIVE.md` edits and the `npm run pm:dash` regen happen together when the phase opens.
