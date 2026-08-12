#!/bin/bash
# [fe-rail] notify.sh — Notification (옵션)
# macOS terminal-notifier 배너 알림. setup-notifier.sh 로 활성화.

TITLE="fe-rail"

# Claude Code 는 Notification 훅 입력을 stdin JSON 으로 전달한다 (.message).
# 환경변수·기본값은 stdin 이 없을 때(수동 실행 등)만 쓰는 fallback.
# (stdin 이 tty 면 수동 실행이므로 cat 블록을 피하려 건너뛴다.)
MESSAGE=""
if [ ! -t 0 ]; then
  HOOK_INPUT=$(cat)
  command -v jq >/dev/null 2>&1 && MESSAGE=$(printf '%s' "$HOOK_INPUT" | jq -r '.message // empty' 2>/dev/null)
fi
MESSAGE="${MESSAGE:-${CLAUDE_NOTIFICATION_TITLE:-확인이 필요합니다}}"

NOTIFIER=$(command -v terminal-notifier 2>/dev/null || echo "/opt/homebrew/bin/terminal-notifier")

if [ -x "$NOTIFIER" ]; then
  "$NOTIFIER" -title "$TITLE" -message "$MESSAGE" -sound Glass
fi

# 터미널 벨 fallback
echo -e "\a"

exit 0
