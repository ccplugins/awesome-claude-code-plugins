---
name: skill-trimmer
description: Audits installed skills, plugins and MCP connectors and proposes archiving, disabling or merging what is outdated, redundant or unused, always with the reason and the alternative. Use when the user wants to clean up or prune skills, feels they have too many skills, plugins or connectors, complains about context bloat or token cost, or asks whether a skill is worth keeping. Not for installing, finding or creating skills.
---

# skill-trimmer

Every installed skill, plugin and connector costs something in every session,
used or not: its description goes into the list Claude reads before each
request, and each connector tries to connect at startup. With too many items
the damage goes beyond tokens: when the list overflows its budget, the app
shows many skills by name only, and a skill without a description almost never
triggers; similar skills compete for the same request and sometimes the wrong
one wins.

The job is to find what does not pay for itself, explain why, and say what
covers the gap. The user decides. And the audit must cost less than it saves:
measure with the script instead of reading everything.

The scripts live in `scripts/` inside this skill's folder (the base directory
shown when the skill loads). Below, `<skill-dir>` means that folder.

## 1. Measure

```bash
python3 <skill-dir>/scripts/inventory.py --project "$PWD"
```

It runs in about a second, changes nothing, and returns:

- **What the last session loaded**, read from its transcript: size of the
  skill list and how many appear by name only, tools per MCP server, each
  server's instructions, servers waiting for login or failing. This is the real
  cost. Don't measure it again by hand.
- **Fixed instructions**: size of the global and project CLAUDE.md and memory.
- **Local skills**: source, days since install, uses in this project and in all
  projects (`here/all`), last use, description tokens (cost per session), body
  tokens (cost when triggered), and signals.
- **Plugins**: install date, skills, connectors, usage.
- **MCP servers called**, and configured servers never called.
- **Similar descriptions**, which compete for the same request.

The signals summarize what used to require opening each skill:

| signal | read as |
|---|---|
| `used-only-in-other-project` | installed here, used only in another folder: maybe it belongs there |
| `slash-only` | runs only via `/name`; its description costs nothing per session |
| `missing-path:…` | mentions a config path that does not exist. It may be a file the skill creates on first use, or a script that will never work here. Check before concluding |
| `mentions:cursor`, `mentions:codex`… | written for another agent; parts of it may not apply here |
| `spawns-subagents` | every use multiplies the spend |
| `recent` | under 14 days: lack of use proves nothing yet |

Cross-check with what only you know: CLAUDE.md and memory (what the user does,
what was installed and why; anything mentioned there is protected until proven
otherwise), and servers named by UUID, which identify themselves by their tools
(`apply_migration` is Supabase).

Open a SKILL.md (the first 40 lines are enough) only when the verdict on an
item that matters depends on its content. Don't use subagents or read every
skill.

## 2. Judge each item

Four questions, in this order:

1. **Does it serve the real work?** Compare with what the user does (projects,
   CLAUDE.md, memory, what shows up in transcripts). Another company's brand
   guidelines, a Slack tool for someone who doesn't use Slack, a sales pack for
   someone who doesn't sell: these go even if just installed, because the
   reason doesn't depend on usage time.
2. **Does something else already do it?** Another skill, a line in CLAUDE.md, a
   built-in tool, or Claude's default behavior. When they overlap, keep the more
   complete or more used one; the other goes or is merged.
3. **Is it outdated?** It cites models, APIs, flags or versions that changed, or
   teaches what the current model already does on its own. Search the web only
   when a specific claim decides the verdict.
4. **Is it used?** Coverage matters here. The inventory says how many days of
   history exist and how long ago each item was installed. With less than ~30
   days of history, or an item installed less than 14 days ago, "never used" is
   weak evidence: say so and propose "review on <date>", unless questions 1 to 3
   already settle it.

Weigh by cost and don't inflate. A 60-token skill costs little; a plugin with
40 skills and 30 connectors costs a lot. Order proposals by savings, and if
everything you propose saves 3%, say 3%. When the skill list has already
overflowed, cutting skills that appear by name only saves few tokens: the gain
is giving the remaining skills their descriptions back. Say it in those words.

Two cost sources that are not skills, but count:

- **A large CLAUDE.md.** It is loaded in full every session. If it weighs as
  much as the skills, propose trimming it (history to a log, details to
  `docs/`).
- **A rule that makes things pile up.** If CLAUDE.md says to install skills
  without asking, or the whole pack when the task uses one, propose changing
  the rule; otherwise pruning will be needed again in a week.

Many items are settled in one line with what the table already shows.
Investigate in depth only what could change a high-savings proposal.

Don't propose removing (at most, ask):

- anything CLAUDE.md, memory or project scripts mention;
- a skill with no recorded source and user-specific content: the user may have
  written it;
- a rarely used but critical skill (security, legal, data recovery), where
  missing it at the wrong moment costs more than the tokens.

If this skill itself duplicates another installed one (`skill-stocktake`,
`context-budget` and the like), say that too.

## 3. Verdicts

| Verdict | When | What to propose |
|---|---|---|
| Keep | used, or useful with no substitute | nothing |
| Trim | useful, but long description (>120 tokens) or heavy body | the exact cut |
| Update | useful, but with an outdated reference | the passage and the fix |
| Merge into X | duplicates X | what useful part to carry into X |
| Archive | local skill that doesn't pay for itself | move it out of the folder and keep it |
| Move to <project> | project skill used only in another folder | install there, archive here |
| Disable | plugin or connector that doesn't pay for itself | the user disables it in the app |
| Review on <date> | no evidence yet | nothing for now |

Every item other than Keep carries:

- **Evidence**: inventory numbers (uses, days, tokens) or the passage that
  proves the overlap or the staleness.
- **Reason** in one sentence that lets the user decide without opening
  anything.
- **Alternative**: what covers the need afterwards (another skill, a line in
  CLAUDE.md, a built-in tool, default behavior). If nothing needs to cover it,
  say why.
- **Savings** in tokens per session.

Bad reason: "rarely used". Good reason: "0 uses in 23 days; the plugin adds
≈8,600 description tokens and 35 connectors never authenticated, and no project
deals with inventory or payroll. If needed, re-enable it in the app with one
click."

## 4. Report

One line per item. Use this format:

```markdown
# Skill pruning — <date>

**Today:** ≈X fixed tokens per session (skill list A, connector tools and instructions B, CLAUDE.md and memory C); K skills appear by name only.
**Proposal:** cuts ≈Y tokens (Z%) and <effect on triggering>.
**Basis:** T transcripts from <start> to <end>. <Caveat, if the basis is short.>

## Proposals (largest savings first)
| # | Item | Verdict | Savings | Reason | Alternative |
|---|---|---|---|---|---|

## Keep
<one line; justify only what someone would find surprising>

## Review on <date>
<items without evidence yet>

Reply with the numbers you want to apply (e.g. "1, 3, 4" or "all").
```

Write the report in the user's language.

## 5. Apply only what was approved

Nothing goes without a "yes" from the user for that item, or "all" for the list
shown. Approval covers what was listed, not what you discover later.

**Local skill: archive, don't delete.**

```bash
python3 <skill-dir>/scripts/archive.py --project "$PWD" --reason "<short reason>" name1 name2
```

It moves the skill to `~/.claude/skills-archive/<date>/`, removes the symlink
from `.claude/skills` and the entry from the lock file (the project's
`skills-lock.json` or `~/.agents/.skill-lock.json`), and logs it in
`ARCHIVE.md` with the reinstall command. `--dry-run` shows what it would do;
`--restore name` undoes it. Deleting for good is the user's call, after a while
without missing it.

**Plugin: the user disables it in the app.** Plugin folders are synced by the
app; editing or deleting there doesn't work and can break the install. Give the
exact plugin name and say it is disabled on the Claude app's plugin screen (or
on claude.ai). Disabling a plugin removes its skills and connectors at once and
applies to the whole account, including claude.ai chats, which the transcripts
here don't show. Don't invent menu paths: if you're not sure of the screen's
name, just say where to look.

**Connector:** a claude.ai connector is disconnected by the user in the
connector settings (and it's gone from claude.ai chat too); a local one with
`claude mcp remove <name>` in the right scope. That is a configuration change,
so only after a "yes".

**Trim, Update, Merge:** show the proposed edit before applying. For
third-party skills, warn that reinstalling or updating undoes the edit.

Afterwards:

- Run the inventory again and show before → after.
- If memory or a project record lists the installed skills, update it.
- Note that the current session keeps the old list; the change applies to new
  sessions.

## Small question, small answer

A question about one skill or family ("are the gsap skills useful?") doesn't
call for a full audit. Run the inventory filtered to what matters
(`... | grep -E 'gsap|^\| skill'`), apply the four questions to those items
only, and answer in a few lines with the verdict and the offer to archive.
