#!/bin/bash
# [fe-rail] doc-sync-check.sh — Stop
# 사용자 프로젝트(이 플러그인이 설치된 프로젝트)의 코드 구조·의존성 변경이
# 감지되면 fe-doc-sync 실행을 안내합니다. 차단 없음(exit 0).
#
# 트리거 디렉토리:
#   - src/ app/ pages/ components/ hooks/ lib/ services/ stores/ api/ features/
#   - apps/ packages/ docs/   (모노레포)
# 트리거 파일:
#   - package.json (의존성·scripts 변경)
#   - tsconfig*.json next.config.* vite.config.* tailwind.config.* (설정 변경)
#   - .env.example (환경 변수 키 변경)
# 제외:
#   - CLAUDE.md / README.md (스킬이 수정하는 대상)
#   - node_modules / .next / dist / build / .git
#
# 워킹트리 변경 + 최근 5개 커밋의 변경 파일을 합집합으로 검사
# (커밋 직후에도 한 번은 안내되도록).

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "doc-sync-check" "standard" && exit 0

# Claude Code 는 Stop 훅 입력을 stdin JSON 으로 전달한다 (.session_id).
# 아래 억제 키가 세션 단위로 동작하려면 이 값이 필요하다 — 환경변수 CLAUDE_SESSION_ID 는
# 훅 실행 시 제공되지 않으므로, stdin 을 안 읽으면 'nosess' 로 고정돼 새 세션에서도 억제가 안 풀린다.
# (stdin 이 tty 면 수동 실행이므로 cat 블록을 피하려 건너뛴다.)
SESSION_ID=""
if [ ! -t 0 ]; then
  HOOK_INPUT=$(cat)
  command -v jq >/dev/null 2>&1 && SESSION_ID=$(printf '%s' "$HOOK_INPUT" | jq -r '.session_id // empty' 2>/dev/null)
fi
SESSION_ID="${SESSION_ID:-${CLAUDE_SESSION_ID:-nosess}}"

CHANGED=$(
  {
    git diff HEAD --name-only 2>/dev/null
    git log --name-only --pretty=format: -5 2>/dev/null
  } \
  | grep -vE '^(node_modules|\.next|dist|build|\.git)/' \
  | grep -E '^(src/|app/|pages/|components/|hooks/|lib/|services/|stores/|api/|features/|apps/|packages/|docs/)|^(package\.json|tsconfig.*\.json|(next|vite|tailwind)\.config\..*|\.env\.example)$' \
  | grep -vE '(CLAUDE\.md|README\.md)$' \
  | sort -u \
  | head -20
)

[ -z "$CHANGED" ] && exit 0

# 매 Stop 마다 같은 안내를 반복하지 않도록 억제 — (세션, HEAD) 조합당 1회만 안내한다.
# 새 커밋으로 HEAD 가 바뀌거나 새 세션이 시작되면 다시 안내 가능.
HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo none)
REPO_KEY=$(pwd | cksum | cut -d' ' -f1)
NOTIFY_KEY="${SESSION_ID}:${HEAD_SHA}"
MARKER="${TMPDIR:-/tmp}/fe-rail-docsync-${REPO_KEY}-${USER:-shared}"
[ -f "$MARKER" ] && [ "$(cat "$MARKER" 2>/dev/null)" = "$NOTIFY_KEY" ] && exit 0

COUNT=$(echo "$CHANGED" | wc -l | tr -d ' ')
FILES=$(echo "$CHANGED" | head -5 | sed 's/^/    /')

# stdout 은 Stop 훅 exit 0 시 transcript 모드(Ctrl+R)에서만 보여 평소엔 묻힌다.
# quality-gate.sh 등 다른 Stop 훅과 동일하게 stderr 로 내야 실제로 눈에 띈다.
{
  echo "[fe-rail][doc-sync] 프로젝트 구조·의존성 변경 감지 (${COUNT}개 파일):"
  echo "$FILES"
  echo "[fe-rail][doc-sync] CLAUDE.md / README.md 업데이트가 필요할 수 있습니다."
  echo "[fe-rail][doc-sync] → /fe-rail:fe-doc-sync 가 프로젝트 전반을 스캔해 누락·불일치를 분석하고 수정안을 제안합니다."
} >&2

# 이 (세션, HEAD) 상태에서 안내했음을 기록 — 다음 Stop 부터는 침묵
printf '%s' "$NOTIFY_KEY" > "$MARKER" 2>/dev/null

exit 0
