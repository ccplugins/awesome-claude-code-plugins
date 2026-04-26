#!/usr/bin/env bash
# Weft PreToolUse guard — blocks commands guarded to non-current steps.
# Fast path: exits immediately if no active workflow.
set -euo pipefail
[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] || exit 0

STATE="${CLAUDE_PROJECT_DIR:-.}/.claude/weft/state.json"
[ -f "$STATE" ] || exit 0

INPUT=$(cat)
echo "$INPUT" | python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" guard 2>&1
