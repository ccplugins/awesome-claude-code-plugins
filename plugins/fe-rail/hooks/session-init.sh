#!/bin/bash
# [fe-rail] session-init.sh — SessionStart
# 원격 버전 체크 (하루 1회). 무소음 원칙: 정상 상태는 무출력.

[ -z "$CLAUDE_PLUGIN_ROOT" ] && exit 0

PLUGIN_JSON="${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json"
[ ! -f "$PLUGIN_JSON" ] && exit 0

PLUGIN_VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PLUGIN_JSON" | head -1 \
                 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')

[ -z "$PLUGIN_VERSION" ] && exit 0

# 원격 버전 체크 (GitHub, 하루 1회)
REMOTE_CHECK_CACHE="$HOME/.claude/fe-rail-version-check.cache"
mkdir -p "$(dirname "$REMOTE_CHECK_CACHE")"
REMOTE_URL="https://raw.githubusercontent.com/sh5623/fe-rail/main/.claude-plugin/plugin.json"

_is_stale() {
  [ ! -f "$1" ] && return 0
  local last now
  last=$(stat -f "%m" "$1" 2>/dev/null || stat -c "%Y" "$1" 2>/dev/null)
  now=$(date +%s)
  [ $((now - last)) -gt 86400 ] && return 0
  return 1
}

if _is_stale "$REMOTE_CHECK_CACHE"; then
  REMOTE_RAW=$(curl -sf --max-time 5 "$REMOTE_URL" 2>/dev/null)
  if [ -n "$REMOTE_RAW" ]; then
    REMOTE_VER=$(printf '%s' "$REMOTE_RAW" \
      | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
      | sed 's/.*"version"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')
    [ -n "$REMOTE_VER" ] && printf '%s' "$REMOTE_VER" > "$REMOTE_CHECK_CACHE"
  fi
fi

# semver 세 자리(x.y.z)를 순수 bash 산술로 비교 — 외부 프로세스 없이 이식성 확보.
# (sort -V 는 GNU 확장이라 구버전 macOS BSD sort 등에서 미지원일 수 있음)
_fe_is_newer() {
  local IFS=.
  local -a lp=($1) rp=($2)
  local i l r
  for i in 0 1 2; do
    l="${lp[i]:-0}"; r="${rp[i]:-0}"
    if (( 10#$r > 10#$l )); then return 0; fi
    if (( 10#$r < 10#$l )); then return 1; fi
  done
  return 1
}

REMOTE_VER=$(cat "$REMOTE_CHECK_CACHE" 2>/dev/null)
if [ -n "$REMOTE_VER" ] && [ -n "$PLUGIN_VERSION" ] && [ "$REMOTE_VER" != "$PLUGIN_VERSION" ]; then
  # 원격이 로컬보다 "더 최신일 때만" 안내한다. 단순 != 비교는 로컬이 앞선 개발 체크아웃에서
  # 다운그레이드를 새 버전으로 오인해 매 세션 오보를 낸다.
  if _fe_is_newer "$PLUGIN_VERSION" "$REMOTE_VER"; then
    echo "[fe-rail] 새 버전 v${REMOTE_VER} 이 있습니다 (현재 v${PLUGIN_VERSION})"
    echo "[fe-rail] 업데이트: /plugin update fe-rail@fe-rail-market"
  fi
fi

# [fe-rail] 훅 프로파일 안내 — 기본(standard)이 아니거나 비활성 훅이 설정돼 있으면 알린다.
#   제어: FE_RAIL_HOOK_PROFILE(minimal|standard|strict) · FE_RAIL_DISABLED_HOOKS="a,b"
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
if [ -f "$_FE_PLIB" ]; then
  . "$_FE_PLIB"
  _FE_PROF=$(fe_active_profile)
  if [ "$_FE_PROF" != "standard" ] || [ -n "$FE_RAIL_DISABLED_HOOKS" ]; then
    echo "[fe-rail][session] 훅 프로파일: ${_FE_PROF}${FE_RAIL_DISABLED_HOOKS:+ · 비활성: ${FE_RAIL_DISABLED_HOOKS}}" >&2
  fi
fi

# 권장 Bash 권한 미설정 안내 (소비자 프로젝트 기준). 이미 설정됐거나 opt-out 이면 조용히 넘어간다.
# - SessionStart 훅은 비대화형이라 설치/선택은 못 하고 1회 안내만 한다.
# - 실제 설정: hooks/scripts/setup-permissions.sh (호스트 감지 → settings.local.json 병합).
# - MCP 는 훅에서 연결 여부를 알 수 없어 여기서 다루지 않는다 → 각 에이전트가 사용 시점에 JIT 안내.
if [ -z "${FE_RAIL_SKIP_SETUP_NUDGE:-}" ] && [ -n "${CLAUDE_PLUGIN_ROOT:-}" ]; then
  _FE_PROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  _FE_SETUP="${CLAUDE_PLUGIN_ROOT}/hooks/scripts/setup-permissions.sh"
  case "$_FE_SETUP/" in
    "$_FE_PROOT"/*) : ;;  # 플러그인이 프로젝트 안 = 이 저장소 자체(개발 체크아웃) → 넛지 생략
    *)
      _FE_HAS_PERM=0
      for _f in "$_FE_PROOT/.claude/settings.local.json" "$_FE_PROOT/.claude/settings.json"; do
        [ -f "$_f" ] && grep -q '"Bash(git' "$_f" 2>/dev/null && _FE_HAS_PERM=1
      done
      if [ "$_FE_HAS_PERM" -eq 0 ]; then
        echo "[fe-rail][session] 권장 Bash 권한이 설정돼 있지 않습니다 — PR 단계에서 매번 권한 프롬프트가 뜹니다." >&2
        echo "[fe-rail][session] 설정: bash \"$_FE_SETUP\" (끄기: FE_RAIL_SKIP_SETUP_NUDGE=1)" >&2
      fi
      ;;
  esac
fi

exit 0
