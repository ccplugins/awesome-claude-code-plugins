---
name: wf-dashboard
description: "Launch the weft TUI dashboard in a new terminal window. Use only when user types /wf-dashboard."
allowed-tools: [Bash]
---

# Weft Dashboard

Launch the interactive TUI dashboard in a new terminal tab.

## Instructions

Run this command to open the dashboard in a new iTerm/Terminal tab:

```bash
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$HOME/.claude/plugins/marketplaces/local/plugins/weft}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

osascript -e "
tell application \"System Events\"
  set frontApp to name of first application process whose frontmost is true
end tell
if frontApp is \"iTerm2\" then
  tell application \"iTerm\"
    tell current window
      create tab with default profile
      tell current session
        write text \"PYTHONPATH='$PLUGIN_ROOT' CLAUDE_PROJECT_DIR='$PROJECT_DIR' python3 '$PLUGIN_ROOT/core/dashboard.py'; exit\"
      end tell
    end tell
  end tell
else
  tell application \"Terminal\"
    do script \"PYTHONPATH='$PLUGIN_ROOT' CLAUDE_PROJECT_DIR='$PROJECT_DIR' python3 '$PLUGIN_ROOT/core/dashboard.py'; exit\"
    activate
  end tell
end if
"
```

Tell the user: "Dashboard opened in a new tab. Press `r` to refresh, `q` to quit."
