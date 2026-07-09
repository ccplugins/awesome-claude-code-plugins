#!/bin/bash
# [fe-rail] write-guard.sh — PreToolUse:Write|Edit|MultiEdit
# 민감한 파일 생성·수정을 차단합니다. exit 2 = 도구 실행 차단.
# .env.example 은 허용됩니다.

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "write-guard" "minimal" && exit 0

HOOK_INPUT=$(cat)

if command -v jq >/dev/null 2>&1; then
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
else
  FILE_PATH=$(printf '%s' "$HOOK_INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
              | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')
fi
FILE_PATH="${FILE_PATH:-${TOOL_INPUT_FILE_PATH}}"

[ -z "$FILE_PATH" ] && exit 0

BASENAME=$(basename "$FILE_PATH")

# 차단 사유는 stderr 로 출력한다 (exit 2 시 stderr 만 모델에 피드백됨).
block() {
  echo "[fe-rail] BLOCKED: $1" >&2
  exit 2
}

case "$BASENAME" in
  # .env 계열 — .env.example 은 제외되므로 통과 · .envrc(direnv) 포함
  .env|.env.local|.env.production|.env.staging|.env.development|.env.test|.env.*.local|.envrc)
    block ".env 파일 직접 생성 금지. .env.example 만 허용됩니다."
    ;;
  # 인증서·키 파일 (id_rsa 등 확장자 없는 개인키 포함)
  *.pem|*.key|*.p12|*.pfx|*.crt|*.cer|id_rsa|id_dsa|id_ecdsa|id_ed25519)
    block "인증서/키 파일 생성 금지."
    ;;
  # 자격증명 파일
  credentials.json|secrets.json|.npmrc)
    block "자격증명/토큰 파일 생성 금지."
    ;;
  # 시크릿/자격증명 '페이로드 파일' 형태만 차단 — 소스 파일명에 secret/credential 이 들어가는 경우
  # (CredentialForm.tsx, useSecret.ts, features/credentials/ 등)는 통과시킨다 (오탐 방지).
  *.secret|*.secrets|*secret*.json|*secrets*.json|*credential*.json|*credentials*.json)
    block "시크릿/자격증명 페이로드 파일 생성 금지 (예: *.secret, *credentials*.json)."
    ;;
esac

exit 0
