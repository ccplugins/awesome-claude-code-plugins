#!/usr/bin/env bash
# PreToolUse hook: block high-blast-radius shell commands before execution.
# Reads the tool call as JSON on stdin; exit 2 blocks the call and feeds
# stderr back to the model so it can ask the user instead.
set -euo pipefail

extract_cmd() {
  if command -v jq >/dev/null 2>&1; then
    jq -r '.tool_input.command // empty' 2>/dev/null || true
  elif command -v python3 >/dev/null 2>&1; then
    python3 -c 'import json,sys
try: print(json.load(sys.stdin).get("tool_input",{}).get("command",""))
except Exception: pass' 2>/dev/null || true
  fi
}

cmd=$(extract_cmd)
[ -z "$cmd" ] && exit 0

block() {
  echo "BLOCKED by cc-powerpack dangerous-cmd-gate: $1" >&2
  echo "If the user explicitly wants this, they must run it themselves." >&2
  exit 2
}

# rm -rf / rm -fr on root-ish, home, or variable-expanded paths
if echo "$cmd" | grep -qE 'rm\s+(-[a-zA-Z]*f[a-zA-Z]*r|-[a-zA-Z]*r[a-zA-Z]*f)\b'; then
  echo "$cmd" | grep -qE 'rm\s+\S+\s+("?\$|/\s*$|/\*|~|\.\.)' && block "recursive force-delete on dangerous path: $cmd"
fi

# force push to shared branches
echo "$cmd" | grep -qE 'git\s+push\s+.*(--force|-f)\b.*\b(main|master|develop|release)' \
  && block "force-push to protected branch: $cmd"

# history rewrite of pushed commits
echo "$cmd" | grep -qE 'git\s+reset\s+--hard\s+(origin|upstream)/' \
  && block "hard reset to remote ref discards local work: $cmd"

# world-writable permissions
echo "$cmd" | grep -qE 'chmod\s+(-R\s+)?777' \
  && block "chmod 777 makes files world-writable: $cmd"

# piping remote scripts straight into a shell
echo "$cmd" | grep -qE '(curl|wget)[^|;&]*\|\s*(sudo\s+)?(ba)?sh' \
  && block "piping remote script into shell without inspection: $cmd"

# DD onto block devices
echo "$cmd" | grep -qE '\bdd\b.*\bof=/dev/' \
  && block "dd writing directly to a device: $cmd"

exit 0
