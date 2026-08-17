---
description: Show claude-bionify's current settings.
allowed-tools: Bash(python3 *)
---

!`python3 "${CLAUDE_PLUGIN_ROOT}/scripts/control.py" status`

The command above printed claude-bionify's current state, and a warning line if the hook cannot start. Relay exactly what it printed to the user and take no further action.
