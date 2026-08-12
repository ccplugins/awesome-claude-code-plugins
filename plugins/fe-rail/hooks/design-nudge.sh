#!/bin/bash
# [fe-rail] design-nudge.sh — PostToolUse:Edit|Write|MultiEdit
# 프론트 파일 편집 직후, "제네릭/템플릿틱(AI slop)" 신호가 새로 들어오면 경고만 낸다. 차단 없음(exit 0).
#
# 정책: fe-rail 은 "품질은 경고(stderr)" 원칙. 이 넛지는 fe-reviewer 의 리뷰 시점 점검을
#   *편집 즉시*로 앞당겨 피드백 루프를 줄인다. 단 오탐을 극도로 경계한다:
#   - 신호는 fe-reviewer 의 DESIGN Bans 어휘와 정렬된 고신호만 사용
#     (무거운/임의 그림자 · AI 기본 보라 그라디언트). 노이즈 큰 text-center·font-sans·grid-cols 등은 제외.
#   - **소비자 레포에 DESIGN.md 가 있으면 침묵** — 디자인 계약의 1차 소스는 DESIGN.md 이고
#     fe-reviewer 가 그것으로 정밀 대조하므로, 넛지는 계약이 아직 없을 때의 공백만 메운다.
#   - 편집으로 *새로 들어온* 텍스트만 검사(기존 코드의 잔존 패턴으로 매번 울리지 않게).

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "design-nudge" "standard" && exit 0

HOOK_INPUT=$(cat)

# ── 입력 추출 (jq 우선, 없으면 grep 폴백) ────────────────────────────────────
if command -v jq >/dev/null 2>&1; then
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
  NEW_TEXT=$(printf '%s' "$HOOK_INPUT" | jq -r '
    [ .tool_input.content, .tool_input.new_string, (.tool_input.edits[]?.new_string) ]
    | map(select(. != null)) | join("\n")' 2>/dev/null)
else
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
              | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')
  NEW_TEXT="$HOOK_INPUT"
fi
FILE_PATH="${FILE_PATH:-${TOOL_INPUT_FILE_PATH}}"

[ -z "$FILE_PATH" ] && exit 0

# ── 프론트엔드(뷰) 파일만 대상 ───────────────────────────────────────────────
case "$FILE_PATH" in
  *.tsx|*.jsx|*.vue|*.svelte|*.astro|*.css|*.scss) ;;
  *) exit 0 ;;
esac

# ── DESIGN.md 가 있으면 침묵 (fe-reviewer 의 DESIGN Bans 가 정본) ─────────────
PROJECT_ROOT=$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null || pwd)
[ -f "$PROJECT_ROOT/DESIGN.md" ] && exit 0

# ── 정제된 slop 신호 검사 (편집으로 새로 들어온 텍스트) ───────────────────────
FINDINGS=""
# 1) 무겁거나 임의값인 그림자 (DESIGN Bans 상습 항목)
if printf '%s\n' "$NEW_TEXT" | grep -qE '\bshadow-(xl|2xl)\b|shadow-\['; then
  FINDINGS="${FINDINGS}  - 무겁거나 임의값 그림자(shadow-xl/2xl/shadow-[…]) — 깊이는 레이어링/대비로\n"
fi
# 2) AI 기본 보라·인디고 그라디언트 (제네릭 slop의 대표 신호)
if printf '%s\n' "$NEW_TEXT" | grep -qE '\b(from|via|to)-(purple|violet|indigo|fuchsia)-[0-9]'; then
  FINDINGS="${FINDINGS}  - 기본 보라/인디고 그라디언트(from/to-purple·violet·indigo) — 도메인에 맞는 팔레트로\n"
fi

[ -z "$FINDINGS" ] && exit 0

# ── 넛지 출력 (경고만, 차단 없음) ────────────────────────────────────────────
{
  echo "[fe-rail][design-nudge] 제네릭/템플릿틱 신호가 감지되었습니다 — $(basename "$FILE_PATH")"
  printf "%b" "$FINDINGS"
  echo "  ↳ 점검: 시각적 위계·의도적 여백·목적 있는 hover/focus·도메인에 맞는 색/타이포"
  echo "  ↳ (heuristic 경고일 뿐 차단 아님. DESIGN.md 를 두면 이 넛지 대신 fe-reviewer 가 정밀 대조합니다.)"
} >&2

exit 0
