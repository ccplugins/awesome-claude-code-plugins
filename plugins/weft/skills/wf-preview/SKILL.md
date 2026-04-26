---
name: wf-preview
description: "Preview a weft workflow template with full step details. Use only when user types /wf-preview."
argument-hint: "<template-name>"
allowed-tools: [Bash, Read]
---

# Preview Weft Template

Show a detailed view of a workflow template's steps, policies, and guards.

## Arguments
$ARGUMENTS

## Instructions

1. If no arguments, list available templates first:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start
   ```
   Then ask which one to preview.

2. Show the detailed preview:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" preview <template-name>
   ```

3. Explain the template to the user:
   - What each step does (from descriptions if available)
   - Which steps have guards and what they block
   - Which steps have non-default on_fail policies
   - Which steps are optional
   - Total step count and expected flow

4. Suggest: "Use `/wf-start <name>` to start this workflow."
