# skills-cajado

Two Claude Code skills for keeping a skill setup lean and making sure the right
skill runs for each task.

| Skill | What it does |
|---|---|
| **skill-trimmer** | Audits installed skills, plugins and MCP connectors using real usage from your Claude Code transcripts, and proposes what to archive, disable, merge or trim, each with the reason, the alternative and the token savings. Archives instead of deleting, with one-command restore. |
| **skill-router** | A routing table that says which skill to use for each kind of task when several compete (e.g. two caption writers, three UI skills), with a "don't use" column and the reason. A script keeps the table in sync with what you install. |

Why: every installed skill costs tokens in every session, used or not. Past a
certain size the skill list overflows, many skills are shown by name only and
stop triggering, and similar skills fight over the same request. The trimmer
cuts the fixed cost; the router fixes the triggering.

Both read only local files (`~/.claude`, the project's `.claude/`) and never
touch the network. Python 3.9+ standard library, no dependencies.

## Install

### Option 1: paste this into Claude Code

```text
Install the skill-trimmer and skill-router skills from
github.com/gabosa-cajado/skills-cajado:

1. Run: npx skills add gabosa-cajado/skills-cajado --skill '*' -g -y
2. Show me this block, and add it to my global ~/.claude/CLAUDE.md only after I say yes:

   ## Pick the right skill

   Before a task involving social posts, UI, marketing copy, SEO or documents,
   check the `skill-router` skill: it says which skill to use when several seem to fit.

3. Run skill-router's "First run" to build my routing table from the skills I
   have installed, asking me about the ambiguous contests in one question.
4. Run skill-trimmer once and show me the report. Don't apply anything without
   my approval.
```

### Option 2: skills CLI

```bash
npx skills add gabosa-cajado/skills-cajado
```

Then add the "Pick the right skill" block above to `~/.claude/CLAUDE.md` if you
use skill-router. Without it, the router only runs when a request happens to
match its description.

### Option 3: Claude Code plugin

```text
/plugin marketplace add gabosa-cajado/skills-cajado
/plugin install skills-cajado@skills-cajado
```

### Option 4: by hand

Copy `skills/skill-trimmer` and `skills/skill-router` into `~/.claude/skills/`.

## Use

- "Which of my skills can I remove?", "my context feels heavy", `/skill-trimmer`
- "Is the X skill worth keeping?" (short answer, no full audit)
- After installing or removing skills: "update the skill-router table"

skill-trimmer never deletes. Archived skills go to
`~/.claude/skills-archive/<date>/`, logged in `ARCHIVE.md`:

```bash
python3 ~/.claude/skills/skill-trimmer/scripts/archive.py --restore <name>
```

Plugins and claude.ai connectors can't be removed from disk (the app re-syncs
them): the report tells you which ones to disable in the app.

## Limits

- Claude Code only. They read Claude Code transcripts in `~/.claude/projects`;
  in claude.ai chat there's nothing to measure.
- Plugin discovery covers the Claude desktop app's folders on macOS, Linux and
  Windows, plus Claude Code plugins in `~/.claude/plugins`.
- Changes apply to new sessions; the current one keeps its skill list.
- Token figures are estimates (characters ÷ 4): good for comparing, not for
  billing.

---

## Em português

Duas skills para o Claude Code:

- **skill-trimmer** mede o que cada skill, plugin e conector custa por sessão e
  quanto é usado de verdade (pelas transcrições), e propõe o que arquivar,
  desligar ou fundir, com motivo, alternativa e economia. Arquiva em vez de
  apagar e restaura com um comando.
- **skill-router** é uma tabela que diz qual skill usar em cada tipo de tarefa
  quando várias disputam o mesmo pedido, com uma coluna de "não use" e o
  motivo. Um script avisa quando a tabela fica desatualizada.

Para instalar, cole o bloco da opção 1 no Claude Code. As skills estão em
inglês, mas respondem na língua de quem pede.

## License

MIT
