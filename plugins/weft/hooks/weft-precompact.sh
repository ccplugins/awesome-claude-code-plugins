#!/usr/bin/env bash
# Weft PreCompact — inject workflow state summary into compaction context.
# Stdout is added to Claude's context after compaction.
set -euo pipefail

STATE="${CLAUDE_PROJECT_DIR:-.}/.claude/weft/state.json"
[ -f "$STATE" ] || exit 0

python3 "${CLAUDE_PLUGIN_ROOT}/core/cli.py" context 2>/dev/null
