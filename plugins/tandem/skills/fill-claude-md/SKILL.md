---
name: fill-claude-md
description: Fill in or trim a CLAUDE.md so only non-discoverable, project-specific, broadly-relevant lines remain — the judgement layer applying the three content-economics tests over `pm:claude-scaffold`'s stubs. Use when a CLAUDE.md stub created by `pm:claude-scaffold` still carries `[auto — verify]` or `<fill in>` markers, when `pm:claude-audit` reports `incomplete`, or when an existing CLAUDE.md needs trimming.
---

# Tandem: fill-claude-md (Dev hat)

You are completing the **judgement layer** of the kit's CLAUDE.md automation.
The scaffold script (`pm:claude-scaffold`) wrote the *discoverable* starter lines
and marked them `[auto — verify]`. Your job is the part automation cannot do:
decide what non-discoverable, project-specific content earns a place, and confirm
or remove the auto-detected starters.

## The content-economics tests (CLAUDE-CODE-CONFIG §2.1.4)

Before any line stays in a CLAUDE.md, it must pass ALL of these tests:

1. **Applies broadly at this scope.** Root file → relevant to almost any task in
   the repo. Subdir file → relevant to almost any task in that subdir. Narrower →
   push it down the tree or into a skill.
2. **Not discoverable by exploration.** If `grep`, `ls`, or reading the code would
   reveal it, it does not belong. Encode what the code can't say: gotchas,
   "looks like X but is actually Y", which command to use *here*, where to start.
3. **Project-specific, not reusable expertise.** Advice that applies to any repo
   is a *skill*, not CLAUDE.md.
4. **Reference, don't duplicate.** If a line is reference material that already
   has a canonical home — a frontmatter block or section skeleton living in
   `91-Templates/`, a schema, a status enum, a command list owned by another
   file — *point to that home*, don't inline a copy. Inlined duplication drifts
   from its source and is paid for in context every session. Flag any inlined
   copy of a template/schema/owned-command-list for replacement with a one-line
   pointer (e.g. "Story frontmatter: see `91-Templates/STORY.template.md`").

**Inclusion gate for every line:** "If I delete this line, what specifically goes wrong, and how often?" If the answer is "nothing, most of the time" — delete it.

## Tiered layout (where a rule lives)

CLAUDE.md is a tree, not one file. Place each rule by **cost-of-a-miss**: a
serious or irreversible miss (data loss, a broken release, a security hole) earns
a spot higher up; a recoverable, area-local miss lives lower down.

- **Tier 1 — always-on root `CLAUDE.md`.** Loaded every session, so it costs
  context on *every* task. Keep only rules relevant to **almost every** task here.
  Keep it lean; it signposts the rest of the tree in plain words.
- **Tier 2 — folder-scoped `CLAUDE.md`.** One per major area, auto-loaded by
  Claude Code when a file in that folder is touched. **Additive** — it adds what's
  true *only* in that folder; it is never a copy of root.
- **Tier 3 — thin pointer file.** In a folder that only occasionally needs a rule
  whose real home is elsewhere, a tiny `CLAUDE.md` that names the rule's single
  home and is followed on demand — not a second copy of the rule.

**Never use `@import`.** An `@import` (or `@path/to/file`) pulls the target into
the always-loaded context eagerly, re-bloating Tier 1 with everything it points
at — the opposite of the tiered model. Use a **plain-text signpost** ("when
editing X, read `x/CLAUDE.md`") instead; Claude Code loads the folder file on
demand when it's actually relevant.

## Workflow

```dot
digraph fill {
  "Find target stubs" [shape=box];
  "For each stub: read it + its directory" [shape=box];
  "Confirm [auto — verify] starters" [shape=box];
  "Draft gotchas/conventions" [shape=box];
  "Run each candidate through 3 tests" [shape=diamond];
  "Write outside managed markers" [shape=box];
  "Strip confirmed [auto — verify] markers" [shape=box];
  "Re-audit" [shape=doublecircle];

  "Find target stubs" -> "For each stub: read it + its directory";
  "For each stub: read it + its directory" -> "Confirm [auto — verify] starters";
  "Confirm [auto — verify] starters" -> "Draft gotchas/conventions";
  "Draft gotchas/conventions" -> "Run each candidate through 3 tests";
  "Run each candidate through 3 tests" -> "Write outside managed markers" [label="passes"];
  "Run each candidate through 3 tests" -> "Draft gotchas/conventions" [label="fails: drop or move to skill"];
  "Write outside managed markers" -> "Strip confirmed [auto — verify] markers";
  "Strip confirmed [auto — verify] markers" -> "Re-audit";
}
```

### Step 1 — Find the targets

If given a path, use it. Otherwise run:
`npm run pm:claude-audit -- --json` and take every entry with state `incomplete`
(and any `gap` you intend to fill). Each maps to a `CLAUDE.md` file.

### Step 2 — For each stub, confirm the `[auto — verify]` starters

Read the file and the directory it governs. For each `[auto — verify]` line:
- Verify the command actually exists and is the *right* one (e.g. check the
  manifest's scripts; confirm `npm run test` isn't actually `pnpm test:unit`).
- If correct → **remove the `[auto — verify]` suffix**, keep the line. Add a
  disambiguating note only if the obvious command is wrong (e.g. "NOT `npm test`
  — that runs e2e, ~20min").
- If wrong → fix or delete it.

These lines live inside the `<!-- PM-KIT:BEGIN managed:commands -->` block.
Editing them in place is fine — but do NOT add new human prose inside that block;
the scaffold rewrites its inner content on the next run.

### Step 3 — Draft and filter gotchas + conventions

Propose candidate lines for `## Critical gotchas` and `## Conventions`. For each,
apply the four tests and the deletion gate. Concretely reject:
- "Components live in `/components`" → discoverable by `ls`. **Drop.**
- "Use TypeScript strict mode" → discoverable from `tsconfig.json`. **Drop.**
- "Write good commit messages" → reusable expertise. **Move to a skill, not here.**
- A pasted copy of the Story frontmatter block → has a canonical home in
  `91-Templates/STORY.template.md`. **Replace with a pointer to it** (test 4).

Concretely keep (when true for this repo):
- "Migrations run from repo root, not `/services/*`, despite appearances."
- "DB writes go through `/packages/db/writers/*` — don't call the ORM from routes."
- "Dates are always `Temporal`, never `Date`; the lint rule misses some paths."

Write these **outside** the managed markers (under the `## Critical gotchas` and
`## Conventions` headings, in the human area). Keep each file lean — a subdir file
should be additive to root, never a copy of it.

### Step 4 — Trimming mode (existing bloated files)

If asked to trim, run every existing line through the four tests in reverse.
Produce a short list: "Recommend deleting — reason" per failing line (including
"duplicates `<canonical home>` — replace with pointer" for test-4 failures). Make
the edits only after the user confirms, unless they asked you to trim directly.

### Step 5 — Re-audit

Run `npm run pm:claude-audit -- --json` again. The files you completed should no
longer be `incomplete` (no `[auto — verify]` / `<fill in>` left). Report what
changed and any boundary you deliberately left `excluded`.

## Guardrails

- Never write content inside a `PM-KIT:BEGIN/END` managed block except the
  command lines the scaffold owns — the scaffold overwrites managed inner content.
- Never copy root content into a subdir file. Subdir files are additive.
- When in doubt about a line, delete it. A lean file that's all signal beats a
  complete file that's half noise. The context cost is paid every session.
