#!/usr/bin/env bash
# [fe-rail] setup-permissions.sh — 소비자 프로젝트에 권장 Bash 권한 화이트리스트 설정
# 실행: 반드시 "소비자 프로젝트 루트"에서 절대경로로 실행한다(설정은 CWD 의 git 루트/pwd 기준으로 쓰인다):
#   bash <fe-rail 설치경로>/hooks/scripts/setup-permissions.sh [--yes]
# (플러그인 디렉토리로 cd 해서 상대경로로 실행하면 설정이 소비자가 아닌 플러그인에 쓰인다 → 아래 가드로 차단)
#
# 권장 Bash 권한을 소비자 .claude/settings.local.json 의 permissions.allow 에 "병합"한다(기존 키·값 보존):
# - Bash(git *)            : 버전관리 전반 — 위험 명령(force push·reset --hard·checkout .·commit --no-verify 등)은
#                            guard.sh 훅이 exit 2 로 계속 차단하므로 광범위 allow 라도 백스톱이 유지된다.
# - Bash(gh pr *)          : GitHub PR (git remote 에서 github.com 감지될 때만 추가)
# - Bash(aws codecommit *) : CodeCommit PR (git remote 에서 codecommit 감지될 때만 추가)
# settings.local.json 을 쓰는 이유: .claude 가 .gitignore 대상일 수 있고, 권한은 개인 로컬 설정이라
# 팀 공유 settings.json 을 건드리지 않기 위함. (setup-notifier.sh 와 동일 원칙)

set -eu

# 인자: --yes/-y 면 확인 프롬프트 없이 적용 (비대화형/CI)
AUTO_YES=0
case "${1:-}" in --yes|-y) AUTO_YES=1 ;; esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$(dirname "$SCRIPT_DIR")"

# 대상 프로젝트: 스크립트가 어디 설치돼 있든(마켓플레이스 설치 시 플러그인 경로가 됨) 상관없이
# 사용자가 지금 실행한 "자신의 프로젝트"(git 루트, 없으면 pwd)에 설정한다.
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# 안전장치: 플러그인(HOOKS_DIR)이 PROJECT_ROOT 안에 있으면 = 플러그인/마켓플레이스 트리에서 실행한 것이라
# 소비자 프로젝트가 아니다 → 엉뚱한 곳에 설정을 쓰지 않도록 중단.
case "$HOOKS_DIR/" in
  "$PROJECT_ROOT"/*) echo "[fe-rail] 오류: 소비자 프로젝트 루트에서 실행하세요 — 지금 대상($PROJECT_ROOT)이 플러그인을 포함하는 경로입니다." >&2; exit 1 ;;
esac

SETTINGS_DIR="$PROJECT_ROOT/.claude"
SETTINGS_FILE="$SETTINGS_DIR/settings.local.json"
SHARED_FILE="$SETTINGS_DIR/settings.json"

# 호스트 감지 → PR 권한 결정 (git remote 기준)
REMOTES="$(git -C "$PROJECT_ROOT" remote -v 2>/dev/null || true)"
REC=('Bash(git *)')
case "$REMOTES" in
  *github.com*)    REC+=('Bash(gh pr *)');          HOST_NOTE="GitHub (gh)" ;;
  *codecommit*)    REC+=('Bash(aws codecommit *)');  HOST_NOTE="CodeCommit (aws)" ;;
  *)               HOST_NOTE="호스트 미감지 — git 권한만 (PR 권한은 필요 시 수동 추가)" ;;
esac

# 이미 있는 권한인지 검사 (settings.local.json + 팀 공유 settings.json 둘 다 확인)
has_perm() {
  local p="$1" f
  for f in "$SETTINGS_FILE" "$SHARED_FILE"; do
    [ -f "$f" ] || continue
    if command -v jq >/dev/null 2>&1; then
      jq -e --arg p "$p" '((.permissions.allow // []) | index($p)) != null' "$f" >/dev/null 2>&1 && return 0
    else
      grep -qF "\"$p\"" "$f" 2>/dev/null && return 0
    fi
  done
  return 1
}

MISSING=()
for p in "${REC[@]}"; do
  has_perm "$p" || MISSING+=("$p")
done

if [ ${#MISSING[@]} -eq 0 ]; then
  echo "[fe-rail] 권장 Bash 권한이 이미 설정돼 있습니다 — 추가 작업 없음. ($SETTINGS_FILE / $SHARED_FILE)"
  exit 0
fi

echo "[fe-rail] 대상 소비자 프로젝트: $PROJECT_ROOT"
echo "[fe-rail] 감지된 호스트: $HOST_NOTE"
echo "[fe-rail] 다음 권한을 $SETTINGS_FILE 의 permissions.allow 에 추가합니다:"
for p in "${MISSING[@]}"; do echo "  - $p"; done
echo "[fe-rail] 위험 git 명령은 guard.sh 훅이 계속 차단합니다(광범위 allow 라도 백스톱 유지)."

if [ "$AUTO_YES" != 1 ]; then
  if [ -t 0 ]; then
    printf "[fe-rail] 진행할까요? [y/N] "
    read -r ans
    case "$ans" in [Yy]*) ;; *) echo "[fe-rail] 취소했습니다."; exit 0 ;; esac
  else
    echo "[fe-rail] 비대화형 실행입니다 — 적용하려면 --yes 를 붙여 다시 실행하세요: bash \"$SCRIPT_DIR/setup-permissions.sh\" --yes" >&2
    exit 0
  fi
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "[fe-rail] jq 가 없어 자동 병합이 불가합니다. 아래를 $SETTINGS_FILE 의 permissions.allow 에 수동 추가하세요:" >&2
  for p in "${MISSING[@]}"; do echo "  \"$p\"," >&2; done
  exit 1
fi

mkdir -p "$SETTINGS_DIR"
[ -f "$SETTINGS_FILE" ] || printf '%s\n' '{}' > "$SETTINGS_FILE"

# 기존 파일이 유효한 JSON 인지 확인 (깨진 파일을 덮어써 손실시키지 않도록)
if ! jq -e . "$SETTINGS_FILE" >/dev/null 2>&1; then
  echo "[fe-rail] 오류: $SETTINGS_FILE 이 유효한 JSON 이 아닙니다 — 자동 수정하지 않습니다. 수동 확인 후 다시 실행하세요." >&2
  exit 1
fi

# 권장 권한 배열(JSON) — 기존 allow 에 없는 것만 순서 보존하며 추가. 그 외 키(hooks 등)는 그대로 보존.
REC_JSON="$(printf '%s\n' "${MISSING[@]}" | jq -R . | jq -s .)"
TMP_OUT="$SETTINGS_FILE.fe-rail.tmp"
jq --argjson rec "$REC_JSON" '
  .permissions = (.permissions // {})
  | .permissions.allow = ((.permissions.allow // []) + ($rec - (.permissions.allow // [])))
' "$SETTINGS_FILE" > "$TMP_OUT" && mv "$TMP_OUT" "$SETTINGS_FILE"

echo "[fe-rail] 완료 — 추가됨: ${MISSING[*]}"
echo "[fe-rail] $SETTINGS_FILE 에 반영했습니다. 설정 적용을 위해 세션을 갱신(또는 Claude Code 재시작)하세요."
