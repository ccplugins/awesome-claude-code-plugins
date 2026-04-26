---
name: wf-edit-template
description: "Edit an existing weft workflow template. Use only when user types /wf-edit-template."
argument-hint: "<template-name>"
allowed-tools: [Bash, Read, Write]
---

# Edit Weft Template

Load an existing template, modify it interactively, and save.

## Arguments
$ARGUMENTS

## Instructions

### Step 1: Load
If no arguments, list templates and ask which to edit:
```bash
python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" start
```

Load the template preview:
```bash
python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" preview <name>
```

### Step 2: Show current state
Display the current template with all step details, guards, and policies.

### Step 3: Ask what to change
Ask: "What would you like to change?"

Supported modifications:
- **Add a step**: "add a review step after implement" → insert into steps array
- **Remove a step**: "remove the deploy step" → remove from steps array
- **Rename a step**: "rename test to verify" → change step name
- **Change policy**: "make test retry on failure" → set on_fail
- **Add guard**: "block git push during planning" → add guard to step
- **Remove guard**: "remove the commit guard from scope-check" → remove guard
- **Reorder**: "move review before test" → reorder steps array
- **Change description**: "update the description to ..." → set description

### Step 4: Preview changes
Show the modified template and ask: "Save these changes?"

### Step 5: Save
Ask whether to overwrite the original or save as a new name.

If saving to the project-local directory:
```bash
echo '<template_json>' | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" save-template
```

If the original is a plugin-bundled template, always save as a project-local override (don't modify plugin files).

Tell the user the template was saved and how to start it.
