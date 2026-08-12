#!/bin/bash
# [fe-rail] lint-fix.sh — PostToolUse:Edit|Write|MultiEdit
# 소비자 환경을 감지해 Biome 또는 ESLint(+Prettier) 로 자동 정리한다. 차단 없음(exit 0).
#   - Biome  : biome check --write (lint + format 통합)
#   - ESLint : eslint --fix
#   - Prettier: prettier --write (Biome 미감지 시에만 — 이중 포맷 충돌 방지)
# tsc 는 quality-gate.sh(Stop)에서 한 번만 실행하여 중복 방지.

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "lint-fix" "standard" && exit 0

HOOK_INPUT=$(cat)

if command -v jq >/dev/null 2>&1; then
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
else
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
              | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')
fi
FILE_PATH="${FILE_PATH:-${TOOL_INPUT_FILE_PATH}}"

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# 확장자 화이트리스트
case "$FILE_PATH" in
  *.js|*.ts|*.jsx|*.tsx|*.mjs|*.cjs|*.vue|*.css|*.scss|*.json) ;;
  *) exit 0 ;;
esac

# 프로젝트 루트 탐색
PROJECT_ROOT=$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null || pwd)

# 공유 감지·실행 로직 로드
LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
[ -f "$LIB_DIR/scripts/lint-lib.sh" ] && . "$LIB_DIR/scripts/lint-lib.sh"

# ── Biome (lint + format 통합) ───────────────────────────────────────────────
if fe_has_biome "$PROJECT_ROOT"; then
  fe_run_biome "$PROJECT_ROOT" check --write --no-errors-on-unmatched "$FILE_PATH" >/dev/null 2>&1
  REMAINING=$(fe_run_biome "$PROJECT_ROOT" check --no-errors-on-unmatched "$FILE_PATH" 2>&1)
  RC=$?
  if [ "$RC" -ne 0 ] && [ -n "$REMAINING" ]; then
    echo "[fe-rail][biome] $REMAINING" | head -10 >&2
  fi
fi

# ── ESLint ──────────────────────────────────────────────────────────────────
if fe_has_eslint "$PROJECT_ROOT"; then
  fe_run_eslint "$PROJECT_ROOT" --fix --quiet "$FILE_PATH" 2>/dev/null
  REMAINING=$(fe_run_eslint "$PROJECT_ROOT" --quiet "$FILE_PATH" 2>&1)
  if [ -n "$REMAINING" ]; then
    echo "[fe-rail][eslint] $REMAINING" | head -10 >&2
  fi
fi

# ── Prettier (Biome 미감지 시에만) ───────────────────────────────────────────
if fe_has_prettier "$PROJECT_ROOT" && ! fe_has_biome "$PROJECT_ROOT"; then
  fe_run_prettier "$PROJECT_ROOT" --write --log-level=silent "$FILE_PATH" 2>/dev/null
fi

exit 0
