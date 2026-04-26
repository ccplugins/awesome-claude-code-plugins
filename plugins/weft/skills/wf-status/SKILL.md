---
name: wf-status
description: "Show current weft workflow state and recent events. Use only when user types /wf-status."
allowed-tools: [Bash, Read]
---

# Weft Workflow Status

## Instructions

1. Show the current workflow state:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" status
   ```

2. If `--json` is in $ARGUMENTS, show raw JSON instead:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" status --json
   ```

3. If no active workflow, say so and suggest `/weft:wf-start`.
