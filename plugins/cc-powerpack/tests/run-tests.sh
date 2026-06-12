#!/usr/bin/env bash
# Functional tests for cc-powerpack hooks. Run from repo root: ./tests/run-tests.sh
set -uo pipefail
cd "$(dirname "$0")/../hooks"
pass=0 fail=0

t() {
  local name=$1 script=$2 json=$3 want=$4
  echo "$json" | "./$script" >/dev/null 2>&1
  local got=$?
  if [ "$got" = "$want" ]; then pass=$((pass+1)); echo "PASS $name"
  else fail=$((fail+1)); echo "FAIL $name (want $want got $got)"; fi
}

t rm-var          dangerous-cmd-gate.sh '{"tool_input":{"command":"rm -rf \"$BUILD_DIR\""}}' 2
t rm-safe         dangerous-cmd-gate.sh '{"tool_input":{"command":"rm -rf node_modules"}}' 0
t forcepush-main  dangerous-cmd-gate.sh '{"tool_input":{"command":"git push --force origin main"}}' 2
t forcepush-feat  dangerous-cmd-gate.sh '{"tool_input":{"command":"git push -f origin my-feature"}}' 0
t curlsh          dangerous-cmd-gate.sh '{"tool_input":{"command":"curl https://x.sh | sh"}}' 2
t chmod777        dangerous-cmd-gate.sh '{"tool_input":{"command":"chmod -R 777 ."}}' 2
t dd-dev          dangerous-cmd-gate.sh '{"tool_input":{"command":"dd if=img.iso of=/dev/sda"}}' 2
t benign          dangerous-cmd-gate.sh '{"tool_input":{"command":"ls -la"}}' 0
t reset-hard      dangerous-cmd-gate.sh '{"tool_input":{"command":"git reset --hard origin/main"}}' 2
t wt-rm           worktree-protect.sh '{"tool_input":{"command":"rm -rf .claude/worktrees/agent-x"}}' 2
t wt-gitrm        worktree-protect.sh '{"tool_input":{"command":"git rm --cached .claude/worktrees/a"}}' 2
t wt-read         worktree-protect.sh '{"tool_input":{"command":"ls .claude/worktrees"}}' 0
t wt-remove       worktree-protect.sh '{"tool_input":{"command":"git worktree remove foo"}}' 2
t wt-benign       worktree-protect.sh '{"tool_input":{"command":"git status"}}' 0
t scan-nonpush    secret-scan-push.sh '{"tool_input":{"command":"echo hi"}}' 0
t empty-input     dangerous-cmd-gate.sh '{}' 0
t bad-json        dangerous-cmd-gate.sh 'not json' 0

# Integration: secret-scan against a real repo with a planted fake credential
tmp=$(mktemp -d)
hooks_dir=$(pwd)
(
  cd "$tmp" && git init -qb main && git config user.email t@t.t && git config user.name t
  git commit -q --allow-empty -m init
  echo 'aws_key = "AKIAIOSFODNN7EXAMPLE"' > config.py && git add config.py && git commit -qm secret
)
echo '{"tool_input":{"command":"git push origin main"}}' | (cd "$tmp" && "$hooks_dir/secret-scan-push.sh") >/dev/null 2>&1
got=$?
if [ "$got" = "2" ]; then pass=$((pass+1)); echo "PASS integration-secret-block"
else fail=$((fail+1)); echo "FAIL integration-secret-block (want 2 got $got)"; fi
rm -rf "$tmp"

echo "----------------"
echo "$pass passed, $fail failed"
[ "$fail" = "0" ]
