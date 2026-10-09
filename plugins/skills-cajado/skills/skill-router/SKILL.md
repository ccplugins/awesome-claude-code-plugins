---
name: skill-router
description: Routing table that says which skill to use for each kind of task when several seem to fit (social posts, UI, marketing copy, SEO, documents, reviews). Check it before triggering a content, design, SEO or document skill, and after installing or removing skills to keep the table current.
---

# skill-router

Several installed skills compete for the same requests, and the one whose
description happens to match the wording best is not always the best one. This
table settles each contest once. Checking it costs one read; triggering the
wrong skill costs redoing the work.

## How to use

1. Find the row for the task. Trigger the skill under **Use** with the Skill
   tool.
2. Don't trigger the skills under **Don't use**, even if their description
   matches the request's words better. The reason is in the row.
3. Do what **After** says before showing the result.
4. No row matches: use what the session's skill list offers, or no skill. Don't
   force a similar row.
5. The **Use** skill isn't installed in this project: say which one it would be
   and continue without it. Don't fall back to a **Don't use** skill.
6. The project's CLAUDE.md overrides the table (design tokens, voice, content
   rules).

## First run: build the table

The table ships empty because it depends on what you have installed.

1. Run the check (below). With an empty table it lists every installed skill
   and the pairs with similar descriptions.
2. For each pair or family that competes for the same request, open the first
   40 lines of each SKILL.md (not the whole skill) and decide which one wins and
   for which kind of task. Ask the user in a single question about the
   ambiguous ones.
3. Write one row per kind of task. Put the losers in **Don't use** with a short
   reason. Put skills that never compete (slash-only, utilities) under **No
   route**; `plugin:*` covers a whole plugin.
4. Run the check again until nothing is uncovered.

`examples.md` has sample rows for common contests. Copy only the rows whose
skills the user actually has.

## Table

| Task | Use | Don't use | After |
|---|---|---|---|

## No route

Installed, but they don't need a row (slash-only, or they compete with
nothing):
`skill-router`, `skill-trimmer`.

A name with `*` covers the whole plugin. A skill named in the table counts even
if its plugin is listed here.

## Keep the table current

```bash
python3 <skill-dir>/scripts/check.py
```

`<skill-dir>` is this skill's folder (the base directory shown when it loads).
The script only reads files. It shows:
- installed skills the table doesn't cover;
- names in the table that are no longer installed in any project;
- pairs of similar descriptions the table hasn't settled;
- how often each skill was triggered, and what came right after each
  consultation of this table.

For each new skill, decide with the user: it gets a new row, joins an existing
row as **Don't use**, or goes under **No route**. A skill that only appears
under **Don't use** is a candidate for removal (the `skill-trimmer` skill does
that).
