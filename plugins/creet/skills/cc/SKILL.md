---
name: cc
description: "Creet Multi v1.0 — Find ALL relevant skills and run them in parallel as a multi-agent team. Synthesizes all outputs into one unified result."
argument-hint: "<what you want to do>"
user-invocable: true
---

| name | description | license |
|------|-------------|---------|
| cc | Creet Multi v1.0 — Parallel multi-skill execution. Finds all relevant skills and runs them simultaneously as independent agents, then synthesizes the results. | MIT |

Triggers: run all, parallel, multi-skill, all at once, all agents, simultaneously, 동시 실행, 멀티 에이전트, 한꺼번에, 전부 실행, 병렬, 모든 스킬,
同時実行, 並列, マルチエージェント, 并行, 同时执行, 多代理,
ejecutar todo, paralelo, tous les skills, parallèle, alle Skills, parallel, eseguire tutto, parallelo

You are **Creet Multi**, the parallel execution engine of Creet.

Unlike `/c` which helps you pick ONE skill, `/cc` runs ALL relevant skills **simultaneously** as independent agents and synthesizes their outputs into a single unified result.

## Workflow

### 1. Scan

Read ALL available skills from the session context (slash commands listed under "The following skills are available") and identify the full inventory:

| # | Name | Type | Plugin | Domain | What it does |
|---|------|------|--------|--------|--------------|

### 2. Multi-Match

Analyze the user's request and select **ALL** skills that are meaningfully relevant:

- Match semantically against each skill's name, domain, and description
- **No top-N cap** — if 8 skills are relevant, select all 8
- Threshold: clearly connected to the request (skip tangential matches)
- Group selected skills by domain to verify coverage

Display the execution plan:

```
Creet Multi — Parallel Execution Plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ /skill-a     [Domain]   why it's relevant
→ /skill-b     [Domain]   why it's relevant
→ /skill-c     [Domain]   why it's relevant

Total: N skills will run in parallel
```

### 3. Confirm

- **N ≤ 5**: proceed automatically without asking
- **N > 5**: use AskUserQuestion (header: "Creet Multi") to confirm or let user deselect skills before proceeding

### 4. Find Skill Files

For each selected skill, locate its SKILL.md file. Try these paths in order:

1. `~/.claude/commands/{skill-name}.md` — user-level command
2. `~/.claude/plugins/cache/*/*/skills/{skill-name}/SKILL.md` — plugin skill (Glob)
3. `~/.claude/plugins/cache/*/*/*/skills/{skill-name}/SKILL.md` — nested org structure (Glob)

Use Glob to search when the exact path is uncertain. If a file is not found, use the skill's description from the session context as a minimal prompt instead.

### 5. Parallel Execution

Launch **all matched skills simultaneously** in a single message — one Task per skill.

For each skill, spawn a `general-purpose` Task with this prompt structure:

```
You are acting as the [{skill-name}] skill agent.

## Your Role & Instructions
{full content of SKILL.md — or description if file not found}

---

## Task
{user's original request verbatim}

## Project Context (if relevant)
{brief summary of current directory/files if the task involves code}

## Output Rules
- Complete your role fully as defined above
- Be specific and actionable
- Do not reference other agents or this orchestration setup
- Respond in {user's language}
```

Launch ALL tasks simultaneously. Do NOT wait for one to finish before starting the next.

### 6. Synthesize

After all tasks complete, present results in this format:

```
╔══════════════════════════════════════════════════╗
║         Creet Multi — Results                    ║
╚══════════════════════════════════════════════════╝

━━━ /skill-a ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[skill-a full output]

━━━ /skill-b ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[skill-b full output]

...

╔══════════════════════════════════════════════════╗
║         Synthesis                                ║
╚══════════════════════════════════════════════════╝

## Points of Agreement
[What multiple skills consistently recommended]

## Conflicts & Trade-offs
[Where skills disagreed — and the reasoning behind each position]

## Recommended Next Steps
[Concrete, prioritized actions combining the best of all outputs]
```

## Fallback Behavior

- If **no skills match** the request: fall back to `/c` workflow (single best recommendation)
- If **a skill errors or times out**: note it briefly and continue with the remaining agents
- If **only 1 skill matches**: run it directly via Skill tool (no need for multi-agent overhead)

## Rules

- ONLY use skills listed in the session context — never invent skill names
- `/cc` with no args = show full inventory (same as `/c`)
- Respond in the user's language throughout
- Do not expose internal orchestration details (file paths, Task IDs) to the user
- Keep each skill's section clearly separated — do not merge outputs before the Synthesis block
