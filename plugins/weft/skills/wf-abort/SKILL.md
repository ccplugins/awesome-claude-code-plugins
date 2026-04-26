---
name: wf-abort
description: "Abort the current weft workflow. Use only when user types /wf-abort."
argument-hint: "[reason]"
allowed-tools: [Bash, Read, Write]
---

# Abort Weft Workflow

## Arguments
$ARGUMENTS

## Instructions

1. Confirm with the user before aborting (unless they explicitly said to abort).

2. Run:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" abort "<reason>"
   ```

3. Show the final state.
