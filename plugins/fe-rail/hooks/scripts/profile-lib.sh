#!/bin/bash
# [fe-rail] profile-lib.sh — 훅 프로파일/비활성 토글 공유 로직
# 모든 훅이 상단에서 source 하여 "현재 프로파일에서 이 훅이 켜져 있는가"를 판정한다.
#
# 제어 환경변수 (소비자 프로젝트에서 설정 — 플러그인 파일 수정 불필요):
#   FE_RAIL_HOOK_PROFILE   minimal | standard | strict   (기본: standard)
#     - minimal  : 비가역 위험을 막는 "안전 차단기"만 동작 (guard·write-guard·task-guard·config-protection)
#     - standard : minimal + 품질 경고/편의 훅 전부 (기본값)
#     - strict   : standard 와 동일 + 향후 더 엄격한 동작을 위한 상위 티어(현재는 standard 상위집합)
#   FE_RAIL_DISABLED_HOOKS 콤마(또는 공백) 구분 훅 이름 목록 — 명시적으로 끌 훅
#     예: FE_RAIL_DISABLED_HOOKS="doc-sync-check,design-nudge"
#
# 설계 원칙:
#   - 프로파일 "하향(minimal)"으로는 안전 차단기가 꺼지지 않는다(minimal 티어에 포함되므로).
#     안전 차단기를 끄려면 DISABLED_HOOKS 에 이름을 명시해야 한다("타협 없는 차단" + 명시적 탈출구).
#   - 라이브러리가 로드되지 않으면 훅은 fail-open(그대로 동작) — 기존 동작 보존.

# fe_hook_enabled <hook-name> <min-profile>
#   현재 프로파일·비활성목록 기준으로 이 훅을 실행해야 하면 0(성공), 아니면 1 반환.
#   훅 상단 관용구: fe_hook_enabled "guard" "minimal" || exit 0
fe_hook_enabled() {
  local name="$1" min="${2:-standard}"

  # 1) 명시적 비활성 목록 (콤마/공백 제거 후 ,name, 매칭)
  #    set -u 환경에서 FE_RAIL_DISABLED_HOOKS 미설정 시 unbound variable 방지 위해 기본값 적용
  local disabled_val="${FE_RAIL_DISABLED_HOOKS:-}"
  local disabled=",${disabled_val//[[:space:],]/,},"
  case "$disabled" in
    *",$name,"*) return 1 ;;
  esac

  # 2) 프로파일 티어 비교
  local prof="${FE_RAIL_HOOK_PROFILE:-standard}" prank mrank
  case "$prof" in minimal) prank=0 ;; strict) prank=2 ;; *) prank=1 ;; esac  # 알 수 없는 값은 standard 취급
  case "$min"  in minimal) mrank=0 ;; strict) mrank=2 ;; *) mrank=1 ;; esac
  [ "$prank" -ge "$mrank" ]
}

# fe_active_profile — 정규화된 현재 프로파일명 출력 (session-init 안내용)
fe_active_profile() {
  case "${FE_RAIL_HOOK_PROFILE:-standard}" in
    minimal) echo minimal ;;
    strict)  echo strict ;;
    *)       echo standard ;;
  esac
}
