---
name: wf-rebuild
description: "Rebuild weft state.json from the event log. Use only when user types /wf-rebuild."
argument-hint: "[workflow_id]"
allowed-tools: [Bash, Read, Write]
---

# Rebuild Weft State from Events

Proves event sourcing: reconstruct state.json purely from events.jsonl.

## Arguments
$ARGUMENTS

## Instructions

1. Run:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" rebuild $ARGUMENTS
   ```

2. Display the rebuilt state.

3. If no workflow_id given, rebuilds the most recent workflow.
