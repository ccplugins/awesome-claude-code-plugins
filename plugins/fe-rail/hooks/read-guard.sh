#!/bin/bash
# [fe-rail] read-guard.sh — PreToolUse:Read
# 민감한 파일 읽기 시도를 감지합니다.
# 정책: 경고(stderr) + exit 0 — 차단하지 않고 사용자에게 인지시킵니다.

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "read-guard" "standard" && exit 0

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

case "$BASENAME" in
  .env|.env.local|.env.production|.env.staging|.env.development|.env.test|.env.*.local|.envrc)
    echo "[fe-rail] ⚠️  WARNING [read-guard]: 민감한 환경변수 파일 읽기 감지 → $FILE_PATH" >&2
    echo "[fe-rail]   이 파일의 내용이 응답에 노출되지 않도록 주의하세요." >&2
    ;;
  *.pem|*.key|*.p12|*.pfx|*.crt|*.cer|id_rsa|id_dsa|id_ecdsa|id_ed25519)
    echo "[fe-rail] ⚠️  WARNING [read-guard]: 인증서/키 파일 읽기 감지 → $FILE_PATH" >&2
    echo "[fe-rail]   민감한 키 내용이 노출될 수 있습니다." >&2
    ;;
  # 시크릿/자격증명 '페이로드 파일'만 경고 — 소스 파일명에 secret/credential 이 든 경우
  # (secret-store.ts, useCredentials.ts 등)는 제외해 오탐을 줄인다 (write-guard 와 동일 기준).
  .npmrc|credentials.json|secrets.json|*.secret|*.secrets|*secret*.json|*secrets*.json|*credential*.json|*credentials*.json)
    echo "[fe-rail] ⚠️  WARNING [read-guard]: 자격증명 파일 읽기 감지 → $FILE_PATH" >&2
    echo "[fe-rail]   민감한 정보가 응답에 포함되지 않도록 주의하세요." >&2
    ;;
esac

exit 0
