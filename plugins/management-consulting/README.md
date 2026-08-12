# Management Consulting Plugin

Skills for the full consulting engagement lifecycle, from problem structuring through implementation and close-out.

> Built on the [Agent Skills](https://agentskills.io) open standard. Works with Claude Code, Cowork, Codex, Gemini CLI, and [other compatible agents](https://agentskills.io).

Part of [unsol.dev](https://unsol.dev)

## Why this exists

The mechanics of consulting follow the same patterns every engagement. Scoping, stakeholder alignment, analysis, strategy, delivery, commercials. This plugin encodes that harness so you can focus on the parts that actually require judgment.

## Skills

| Skill | What it covers |
|---|---|
| `strategic-analysis` | Problem structuring, hypothesis development, framework application, cross-framework synthesis |
| `financial-modeling` | Business cases, cost-benefit analysis, ROI/NPV/IRR, sensitivity analysis, scenario modeling |
| `proposal-development` | RFP analysis, proposal writing, SOW creation, pitch decks, oral defense |
| `engagement-setup` | Kickoff design, discovery planning, stakeholder mapping, the first two weeks |
| `engagement-pricing` | Fee structures, rate cards, engagement economics, procurement navigation |
| `implementation-planning` | Phased plans, workstreams, business cases, program recovery |
| `due-diligence` | Commercial, operational, financial, strategic, and technology assessment, integration planning |
| `change-management` | Transition planning, resistance management, adoption measurement |
| `process-excellence` | DMAIC, value stream mapping, root cause analysis, control plans |
| `org-design` | Operating models, structure design, role frameworks, transition planning |
| `project-governance` | Steering committees, stage gates, RACI, risk management, status reporting |
| `client-deliverables` | Presentations, reports, storylining, slide design, PPTX generation patterns |
| `workshop-facilitation` | Strategy workshops, facilitation design, participant dynamics |
| `thought-leadership` | POVs, white papers, case studies, thesis development |
| `project-closeout` | Handover, knowledge transfer, lessons learned, benefits tracking |
| `writing-style` | Consulting tone, depth calibration, content integrity standards |

## Install

### Skills CLI (recommended, works across agents)

```bash
npx skills add anotb/management-consulting-plugin
```

One install for Claude Code, Codex, Cursor, Gemini CLI, and [40+ other agents](https://skills.sh).

### Claude Desktop

Download [`dist/management-consulting.skill`](https://github.com/anotb/management-consulting-plugin/raw/main/dist/management-consulting.skill), then in Claude go to Customize (left nav) > Skills > `+` > Upload a skill. Requires "Code execution and file creation" enabled in Settings > Capabilities.

This installs as a single `management-consulting` skill that routes by topic via an internal dispatcher. To get individual slash commands per skill (`/strategic-analysis`, `/financial-modeling`, etc.), install directly into the skills directory instead:

```bash
# Option A: clone (updates via git pull)
git clone https://github.com/anotb/management-consulting-plugin.git ~/.claude/skills/management-consulting

# Option B: download a snapshot
curl -L https://github.com/anotb/management-consulting-plugin/archive/refs/heads/main.tar.gz | \
  tar -xz -C ~/.claude/skills/ && \
  mv ~/.claude/skills/management-consulting-plugin-main ~/.claude/skills/management-consulting
```

Restart Claude Desktop after either method.

### Claude Code

```bash
claude plugin marketplace add anotb/management-consulting-plugin
claude plugin install management-consulting@anotb-management-consulting-plugin
```

### Cowork

Download the repo as a ZIP, then in Cowork go to Customize > Browse plugins > click `+` and upload. (Organization admins can sync directly from GitHub via Settings > Plugins > Add plugin.)

### Codex

Codex auto-discovers skills under `.agents/skills/`. The cross-agent installer places them there for you:

```bash
npx skills add anotb/management-consulting-plugin
```

To install manually, copy the individual skill folders (each `skills/<name>/`) into `.agents/skills/` at your repo root, or `~/.agents/skills/` for all projects. Each `SKILL.md` must sit one level down (for example `.agents/skills/strategic-analysis/SKILL.md`).

### Gemini CLI

```bash
gemini skills install https://github.com/anotb/management-consulting-plugin.git
```

### Other agents

Clone into `.agents/skills/` (the cross-platform standard) or the agent's native skills directory.

## Usage

Skills activate automatically when your conversation touches consulting topics. No slash commands needed. Just describe the work ("structure the due diligence for this acquisition") and the relevant skill loads.

You can also invoke a skill directly in Claude Code:

```
/management-consulting:strategic-analysis
/management-consulting:engagement-pricing
```

For best results, use [plan mode](https://code.claude.com/docs/en/common-workflows#plan-before-coding) (`shift+tab` twice in Claude Code). This makes Claude ask clarifying questions (your data, client context, constraints) before building anything, instead of assuming.

## Heads up

This plugin produces structured consulting outputs. Everything should be reviewed by someone who knows the client context before it goes near a client.

## License

[MIT](LICENSE)
