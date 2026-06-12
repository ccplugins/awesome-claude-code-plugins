#!/usr/bin/env bash
# PreToolUse hook: prevent any session from touching another session's
# git worktrees or .claude/worktrees state. Worktrees that look orphaned
# may be live agent sessions with uncommitted work.
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

if echo "$cmd" | grep -qE '\.claude/worktrees'; then
  if echo "$cmd" | grep -qE '\b(rm|rmdir|git\s+rm|git\s+add|mv|unlink)\b'; then
    echo "BLOCKED by cc-powerpack worktree-protect: command mutates .claude/worktrees ($cmd)." >&2
    echo "Worktrees belong to the session that spawned them. Ask the user before touching them." >&2
    exit 2
  fi
fi

# git add -A / git add . in a repo that contains agent worktrees silently
# stages gitlinks to them — warn the model to use explicit paths instead.
if echo "$cmd" | grep -qE 'git\s+add\s+(-A|--all|\.)(\s|$)'; then
  if [ -d ".claude/worktrees" ] 2>/dev/null; then
    echo "BLOCKED by cc-powerpack worktree-protect: 'git add -A/.' would sweep up .claude/worktrees gitlinks." >&2
    echo "Use explicit file paths with git add in this repo." >&2
    exit 2
  fi
fi

echo "$cmd" | grep -qE 'git\s+worktree\s+(remove|prune)' && {
  echo "BLOCKED by cc-powerpack worktree-protect: worktree removal requires explicit user confirmation." >&2
  exit 2
}

exit 0
