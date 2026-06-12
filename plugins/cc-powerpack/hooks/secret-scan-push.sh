#!/usr/bin/env bash
# PreToolUse hook: before any `git push`, scan outgoing commits for secrets.
# Uses gitleaks when available, falls back to a regex layer. Blocks on hit.
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
echo "$cmd" | grep -qE '(^|[;&|]\s*)git\s+push\b' || exit 0

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)
range=${upstream:+$upstream..HEAD}

fail() {
  echo "BLOCKED by cc-powerpack secret-scan: $1" >&2
  echo "Remove the secret from history (git reset / git filter-repo), rotate the credential, then retry." >&2
  exit 2
}

if command -v gitleaks >/dev/null 2>&1; then
  if [ -n "$range" ]; then
    gitleaks detect --source . --log-opts="$range" --no-banner --exit-code 9 >/dev/null 2>&1 || {
      [ $? -eq 9 ] && fail "gitleaks found secrets in outgoing commits ($range)"
    }
  fi
fi

# Regex fallback layer over the outgoing diff (also runs alongside gitleaks).
diff_target=${range:-HEAD~1..HEAD}
patterns='(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|sk-[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN (RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35})'
if git diff "$diff_target" 2>/dev/null | grep -qE "^\+.*$patterns"; then
  fail "credential-shaped string in outgoing diff ($diff_target)"
fi

# Forbidden files staged in outgoing commits
if git diff --name-only "$diff_target" 2>/dev/null | grep -qE '(^|/)(\.env(\..+)?|id_rsa|id_ed25519|.*\.pem|.*\.p12|credentials\.json)$'; then
  fail "sensitive filename in outgoing commits (.env / key material)"
fi

exit 0
