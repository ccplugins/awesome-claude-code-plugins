#!/usr/bin/env bash
# Weft SessionStart — restore workflow context into Claude's context.
# Stdout is injected as a systemMessage.
set -euo pipefail

STATE="${CLAUDE_PROJECT_DIR:-.}/.claude/weft/state.json"
[ -f "$STATE" ] || exit 0

python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" context 2>/dev/null
