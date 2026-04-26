#!/usr/bin/env bash
# Launch the weft TUI dashboard in a new terminal tab.
# Usage: bash dashboard_launcher.sh [project_dir]
set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="${1:-${CLAUDE_PROJECT_DIR:-.}}"

export PYTHONPATH="$PLUGIN_ROOT"
export CLAUDE_PROJECT_DIR="$PROJECT_DIR"

# Detect terminal and open a new tab
FRONT_APP=$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null || echo "unknown")

case "$FRONT_APP" in
  iTerm2)
    osascript <<APPLE
tell application "iTerm"
  tell current window
    create tab with default profile
    tell current session
      write text "PYTHONPATH='$PLUGIN_ROOT' CLAUDE_PROJECT_DIR='$PROJECT_DIR' python3 '$PLUGIN_ROOT/core/dashboard.py'; exit"
    end tell
  end tell
end tell
APPLE
    ;;
  *)
    osascript <<APPLE
tell application "Terminal"
  do script "PYTHONPATH='$PLUGIN_ROOT' CLAUDE_PROJECT_DIR='$PROJECT_DIR' python3 '$PLUGIN_ROOT/core/dashboard.py'; exit"
  activate
end tell
APPLE
    ;;
esac
