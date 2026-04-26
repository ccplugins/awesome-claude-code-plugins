---
name: ev-query
description: "Query the weft event log with filters. Use only when user types /ev-query."
argument-hint: "[event_type] [--tool X] [--last N] [--workflow ID] [--session ID]"
allowed-tools: [Bash, Read]
---

# Query Weft Event Log

## Arguments
$ARGUMENTS

## Instructions

1. Parse filter flags from arguments.

2. Run:
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" query $ARGUMENTS
   ```

3. If no arguments, show a summary (event counts by type).

4. Present results in a readable format, not raw JSON.

## Filter Examples
- `/ev-query` — count by event type
- `/ev-query wf.step_changed` — all step transitions
- `/ev-query --last 20` — last 20 events
- `/ev-query --tool Bash --last 10` — last 10 Bash tool events
- `/ev-query --workflow adhoc-20260406` — events for specific workflow
