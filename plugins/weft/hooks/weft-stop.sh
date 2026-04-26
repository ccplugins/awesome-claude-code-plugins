#!/usr/bin/env bash
# Weft Stop gate — blocks Claude from stopping if workflow has incomplete steps.
# Fast path: exits immediately if no active workflow.
set -euo pipefail
[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] || exit 0

STATE="${CLAUDE_PROJECT_DIR:-.}/.claude/weft/state.json"
[ -f "$STATE" ] || exit 0

INPUT=$(cat)
echo "$INPUT" | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" gate
