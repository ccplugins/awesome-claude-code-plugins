#!/bin/bash
# [fe-rail] quality-gate.sh — Stop
# 응답 종료 전 변경 파일에 린터(Biome 또는 ESLint) + tsc --noEmit 일괄 실행. 차단 없음(exit 0).
# 소비자 환경을 감지해 설치된 도구만 돌린다. Biome·ESLint 가 모두 있으면 둘 다 실행.
# xargs 는 shell function 을 직접 호출할 수 없어 파일별 루프로 실행한다.

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "quality-gate" "standard" && exit 0

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# 변경 파일 수집 (staged + unstaged + 신규 untracked, 최대 20개). 두 갈래로 나눈다:
# - CHANGED_SRC : 소스 파일 — 린터에 파일 단위로 넘긴다
# - CHANGED_CFG : 타입에 영향 주는 설정(tsconfig*.json·package.json) — 소스 변경이 없어도
#   타입체크를 돌리는 트리거. (vite.config.ts 등은 확장자상 CHANGED_SRC 에 이미 포함)
_CHANGED_ALL=$(
  { git diff --name-only --diff-filter=d HEAD 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null; } \
  | sort -u
)
CHANGED_SRC=$(printf '%s\n' "$_CHANGED_ALL" | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|vue)$' | head -20)
CHANGED_CFG=$(printf '%s\n' "$_CHANGED_ALL" | grep -E '(^|/)(tsconfig[^/]*\.json|package\.json)$' | head -20)

[ -z "$CHANGED_SRC" ] && [ -z "$CHANGED_CFG" ] && exit 0

# 공유 감지·실행 로직 로드
LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
[ -f "$LIB_DIR/scripts/lint-lib.sh" ] && . "$LIB_DIR/scripts/lint-lib.sh"

OUTPUT=""

# ── Biome ───────────────────────────────────────────────────────────────────
# biome check 는 clean 일 때도 요약을 출력하므로 종료코드로 게이트한다.
if fe_has_biome "$PROJECT_ROOT"; then
  BIOME_OUT="" BIOME_FAIL=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    out=$(fe_run_biome "$PROJECT_ROOT" check --no-errors-on-unmatched "$f" 2>&1); rc=$?
    [ "$rc" -ne 0 ] && BIOME_FAIL=1 && BIOME_OUT="${BIOME_OUT}${out}"$'\n'
  done <<< "$CHANGED_SRC"
  [ "$BIOME_FAIL" -ne 0 ] && [ -n "$BIOME_OUT" ] && OUTPUT="${OUTPUT}[Biome]\n${BIOME_OUT}"
fi

# ── ESLint ──────────────────────────────────────────────────────────────────
if fe_has_eslint "$PROJECT_ROOT"; then
  LINT_OUT=""
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    out=$(fe_run_eslint "$PROJECT_ROOT" --quiet "$f" 2>&1)
    [ -n "$out" ] && LINT_OUT="${LINT_OUT}${out}"$'\n'
  done <<< "$CHANGED_SRC"
  [ -n "$LINT_OUT" ] && OUTPUT="${OUTPUT}[ESLint]\n${LINT_OUT}"
fi

# ── TypeScript ───────────────────────────────────────────────────────────────
# 솔루션 스타일 tsconfig(files:[]+references)에서는 bare `tsc -p tsconfig.json` 가
# 아무 파일도 검사하지 않으므로(no-op), typecheck 스크립트 → `tsc -b` → `tsc -p` 순으로 폴백한다.
# 바이너리/PM 경로를 문자열 변수에 담아 비인용 실행하지 않음(공백 안전).
_fe_pm() {  # 패키지 매니저 감지 (lock 파일 기준)
  if   [ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]; then echo pnpm
  elif [ -f "$PROJECT_ROOT/yarn.lock" ];      then echo yarn
  elif [ -f "$PROJECT_ROOT/bun.lockb" ] || [ -f "$PROJECT_ROOT/bun.lock" ]; then echo bun
  else echo npm; fi
}
_fe_has_tsc() {
  [ -f "$PROJECT_ROOT/tsconfig.json" ]
}
_fe_run_tsc() {
  ( cd "$PROJECT_ROOT" && \
    if [ -x "$PROJECT_ROOT/node_modules/.bin/tsc" ]; then
      "$PROJECT_ROOT/node_modules/.bin/tsc" "$@"
    else
      npx tsc "$@"
    fi
  )
}

# 타입체크는 종료코드로 판정한다 — `tsc -b`/`typecheck` 스크립트는 성공(exit 0)해도
# verbose 배너·요약을 stdout 에 남길 수 있어, "출력 있으면 오류"로 보면 성공 케이스가
# 가짜 [TypeScript] 경고로 뜬다(오탐). 출력은 실패(rc!=0)일 때만 채택한다.
if _fe_has_tsc; then
  TSC_RAN=0
  if grep -q '"typecheck"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    # 프로젝트가 의도한 config 사용 — 가장 안전 (예: tsc -p tsconfig.app.json)
    # PM run 은 프로젝트 자신의 lockfile/node_modules 를 쓰므로 npx 옵트인과 무관하게 항상 허용.
    PM=$(_fe_pm)
    TSC_RAW=$( ( cd "$PROJECT_ROOT" && "$PM" run typecheck ) 2>&1 ); TSC_RC=$?; TSC_RAN=1
  elif [ -x "$PROJECT_ROOT/node_modules/.bin/tsc" ] || fe_npx_ok; then
    # 로컬 tsc 없이 npx 로 떨어지는 경로는 Biome/ESLint 와 동일하게 FE_RAIL_ALLOW_NPX 옵트인 필요.
    if grep -q '"references"' "$PROJECT_ROOT/tsconfig.json" 2>/dev/null; then
      # 솔루션 스타일 → build 모드라야 참조 프로젝트를 검사
      TSC_RAW=$(_fe_run_tsc -b --pretty false 2>&1); TSC_RC=$?
    else
      TSC_RAW=$(_fe_run_tsc --noEmit --pretty false --project "$PROJECT_ROOT/tsconfig.json" 2>&1); TSC_RC=$?
    fi
    TSC_RAN=1
  fi
  if [ "$TSC_RAN" -eq 1 ] && [ "$TSC_RC" -ne 0 ]; then
    TSC_OUT=$(printf '%s\n' "$TSC_RAW" | head -20)
    [ -n "$TSC_OUT" ] && OUTPUT="${OUTPUT}[TypeScript]\n${TSC_OUT}\n"
  fi
fi

# ── 린터 설정은 있으나 로컬 미설치 안내 ───────────────────────────────────────
# npx 자동 폴백을 옵트인으로 바꾼 대신(lint-lib.sh: FE_RAIL_ALLOW_NPX), 설정은 있는데
# 로컬 바이너리가 없어 검사를 건너뛴 경우를 알린다. Stop 훅이라 응답당 한 번만 나간다.
NUDGE=""
if fe_has_biome_config "$PROJECT_ROOT" && ! fe_has_biome "$PROJECT_ROOT"; then
  NUDGE="${NUDGE}[fe-rail][quality-gate] biome.json 감지 — 로컬 biome 미설치로 검사 생략. 설치하거나 FE_RAIL_ALLOW_NPX=1 로 npx 허용.\n"
fi
if fe_has_eslint_config "$PROJECT_ROOT" && ! fe_has_eslint "$PROJECT_ROOT"; then
  NUDGE="${NUDGE}[fe-rail][quality-gate] ESLint 설정 감지 — 로컬 eslint 미설치로 검사 생략. 설치하거나 FE_RAIL_ALLOW_NPX=1 로 npx 허용.\n"
fi
if _fe_has_tsc && ! grep -q '"typecheck"' "$PROJECT_ROOT/package.json" 2>/dev/null \
   && [ ! -x "$PROJECT_ROOT/node_modules/.bin/tsc" ] && ! fe_npx_ok; then
  NUDGE="${NUDGE}[fe-rail][quality-gate] tsconfig.json 감지 — 로컬 tsc 미설치로 타입체크 생략. 설치하거나 FE_RAIL_ALLOW_NPX=1 로 npx 허용.\n"
fi

# ── 출력 ────────────────────────────────────────────────────────────────────
if [ -n "$OUTPUT" ]; then
  printf "[fe-rail][quality-gate] 수정된 파일에 오류가 있습니다:\n" >&2
  printf "%b" "$OUTPUT" | head -30 >&2
fi
[ -n "$NUDGE" ] && printf "%b" "$NUDGE" >&2

exit 0
