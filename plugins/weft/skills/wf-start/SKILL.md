---
name: wf-start
description: "Initialize a weft workflow from a template or inline steps. Use only when user types /wf-start."
argument-hint: "<template-name | step1,step2,step3>"
allowed-tools: [Bash, Read, Write]
---

# Start Weft Workflow

Initialize a new deterministic workflow.

## Arguments
$ARGUMENTS

## Instructions

### If no arguments — guided template picker:

1. List available templates with full details:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start
   ```

2. For each template, show a preview of its steps:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" preview <name>
   ```

3. Present the user with a numbered list like:
   ```
   1. generic (3 steps) — plan, implement, verify
   2. feature-workflow (12 steps) — full-cycle feature development with guards
   3. Custom — describe your task and I'll build a workflow
   ```

4. Wait for the user to pick a number, name, or describe their task.
   - If they pick a template: show the full preview and ask to confirm before starting.
   - If they describe a task: suggest appropriate steps, confirm, then start as ad-hoc.

### If a template name is given:

1. Preview it first:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" preview <template-name>
   ```

2. Start it:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start <template-name>
   ```

### If comma-separated step names are given (ad-hoc):

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start "step1,step2,step3"
```

### After starting:

Display the workflow checklist and remind the user:
- `/wf-step complete` to advance steps
- `/wf-status` to check progress
- `/wf-dashboard` to open the live monitoring TUI
- The Stop hook will prevent finishing with incomplete steps
- If the current step has guards, explain what commands are blocked and why
