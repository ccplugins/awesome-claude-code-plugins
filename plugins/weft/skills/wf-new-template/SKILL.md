---
name: wf-new-template
description: "Create a new weft workflow template interactively. Use only when user types /wf-new-template."
argument-hint: "[template-name]"
allowed-tools: [Bash, Read, Write]
---

# Create New Weft Template

Build a custom workflow template through conversation.

## Arguments
$ARGUMENTS

## Instructions

Walk the user through creating a template step by step:

### Step 1: Name
If no name in arguments, ask: "What should this workflow be called? (lowercase, hyphens ok)"

### Step 2: Description
Ask: "One-line description of what this workflow does?"

### Step 3: Steps
Ask: "List the steps in order. You can describe them naturally and I'll structure them."

Example user input: "first plan the work, then implement it, run tests, do a code review, then push"
→ Parse into: plan, implement, test, review, push

### Step 4: Policies (for each step)
For each step, ask if the default `on_fail: block` is ok, or if they want:
- `retry` — auto-retry once on failure
- `continue` — skip failed step and move on
- `block` — halt until manual retry (default)

Suggest sensible defaults: test steps → retry, optional steps → continue.

### Step 5: Guards (optional)
Ask: "Should any steps block certain commands? For example, blocking `git push` until tests pass."

If yes, collect:
- Which step the guard applies to
- The regex pattern to match (e.g., `git push`, `git commit`)
- The message to show when blocked

### Step 6: Preview and confirm
Build the template JSON and show a preview using:
```bash
echo '<json>' | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" save-template
```

Before saving, show the full template and ask: "Look good? Save it?"

### Step 7: Save
```bash
echo '<template_json>' | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" save-template
```

The template is saved to `.claude/weft/templates/<name>.json` in the project directory.

Tell the user: "Template saved! Start it with `/wf-start <name>`"
