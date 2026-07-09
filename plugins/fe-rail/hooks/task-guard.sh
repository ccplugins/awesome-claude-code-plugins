#!/bin/bash
# [fe-rail] task-guard.sh — PreToolUse:Task|Agent
# 서브에이전트(Task/Agent) 프롬프트 내 위험 패턴을 감지합니다.
# 에이전트 체인 탈출: Task 도구는 별도 세션으로 실행되어 guard.sh가 적용되지 않으므로
# 프롬프트 자체를 검사합니다.
# 정책: 인젝션/위험 명령 위임 → exit 2 차단 / 민감 파일 접근 패턴 → 경고

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "task-guard" "minimal" && exit 0

HOOK_INPUT=$(cat)

# 프롬프트 추출: jq 는 긴 프롬프트도 정확히 파싱함.
# jq 미설치 시 raw stdin 전체를 검색 대상으로 사용 (구조 필드에 위험 패턴이 올 가능성 낮음)
PROMPT=""
if command -v jq >/dev/null 2>&1; then
  PROMPT=$(printf '%s' "$HOOK_INPUT" | jq -r '(.tool_input.prompt // .tool_input.description // empty)' 2>/dev/null)
fi
PROMPT="${PROMPT:-${TOOL_INPUT_PROMPT}}"

# 검색 대상: PROMPT 추출 성공 시 프롬프트만, 미성공 시 raw stdin
SEARCH_IN="${PROMPT:-$HOOK_INPUT}"
[ -z "$SEARCH_IN" ] && exit 0

SEARCH_LOWER=$(echo "$SEARCH_IN" | tr '[:upper:]' '[:lower:]')

# 차단 사유는 stderr 로 출력한다 (exit 2 시 stderr 만 모델에 피드백됨).
block() {
  {
    echo "[fe-rail] ❌ BLOCKED [task-guard]: $1"
    echo "[fe-rail]   패턴: $2"
    echo "[fe-rail]   $3"
  } >&2
  exit 2
}

# ── 차단: 프롬프트 인젝션·가드 우회 시도 ────────────────────────────────────
for pattern in \
  "ignore previous instructions" \
  "ignore all instructions" \
  "disregard your instructions" \
  "forget your rules" \
  "override instructions" \
  "jailbreak" \
  "do anything now" \
  "dan mode" \
  "new instructions:"; do
  if echo "$SEARCH_LOWER" | grep -qF -- "$pattern"; then
    block "서브에이전트 프롬프트에 인젝션 패턴 감지" "$pattern" \
          "에이전트 체인을 통한 가드 우회 시도는 차단됩니다."
  fi
done

# ── 차단: 서브에이전트에 위험 명령 위임 시도 ─────────────────────────────────
# 코드 펜스(```) 내부는 코드 예시로 보고 검사에서 제외.
# 펜스 외부에서 위험 명령어가 발견되면 실행 동사 불문 차단하되,
# 그 줄이 "부정 문맥"(하지 마·금지·never·don't 등)이면 안전 지시문으로 보고 건너뛴다.
# → "절대 rm -rf 하지 마" 같은 정상 지시가 차단되던 오탐(false positive)을 줄인다.
# (부정어 판별이 실패하면 기존대로 차단 = 안전 방향. 위협 모델은 악의적 우회가 아니라 LLM 실수/오탐 균형.)
fe_strip_fences() {
  printf '%s\n' "$1" | awk '/^```/{f=!f;next} !f{print}'
}
SEARCH_NO_FENCE=$(fe_strip_fences "$SEARCH_IN")
# 소문자 변환은 루프 진입 전 한 번만 — 줄마다 반복하면 프롬프트 줄 수만큼 외부 프로세스가
# 생성돼 느려진다.
SEARCH_NO_FENCE_LOWER=$(printf '%s\n' "$SEARCH_NO_FENCE" | tr '[:upper:]' '[:lower:]')

# 부정 문맥 판별용 정규식(소문자 기준). 한글은 UTF-8 로케일에서 매칭됨.
# "절대"는 부정어와 결합된 형태만 매칭 — "절대적으로 필요하다"처럼 긍정 강조로 쓰이면
# 부정 문맥으로 오판해 위험 명령 차단이 우회될 수 있기 때문.
NEG_RE="don't|do not|never|must not|should not|avoid|하지[[:space:]]*마|하지[[:space:]]*말|하면[[:space:]]*안|금지|절대[[:space:]]*(하지|금지|안|말|불가)|말아야|말 것|삼가"

DANGER_HIT=""
while IFS= read -r line_lower; do
  [ -z "$line_lower" ] && continue
  # 이 줄이 부정 문맥이면 안전 지시문으로 간주하고 건너뛴다
  echo "$line_lower" | grep -qE "$NEG_RE" && continue
  for pattern in \
    "rm -rf" \
    "git push --force" \
    "git reset --hard" \
    "drop table" \
    "drop database" \
    "--no-verify" \
    "git stash drop" \
    "git stash clear"; do
    if echo "$line_lower" | grep -qF -- "$pattern"; then
      DANGER_HIT="$pattern"
      break
    fi
  done
  [ -n "$DANGER_HIT" ] && break
done <<< "$SEARCH_NO_FENCE_LOWER"

if [ -n "$DANGER_HIT" ]; then
  {
    echo "[fe-rail] ❌ BLOCKED [task-guard]: 서브에이전트에 위험 명령 위임 감지"
    echo "[fe-rail]   패턴: $DANGER_HIT"
    echo "[fe-rail]   guard.sh 차단 대상 명령을 Task를 통해 우회할 수 없습니다."
    echo "[fe-rail]   코드 예시라면 \`\`\` 펜스 블록 안에, 금지 지시라면 부정 표현(예: \"절대 ~하지 마\")과 함께 쓰세요."
  } >&2
  exit 2
fi

# ── 경고: 민감 파일 접근 위임 패턴 ──────────────────────────────────────────
for pattern in \
  ".env" \
  ".pem" \
  ".key" \
  "secret" \
  "credential" \
  "api_key" \
  "api key" \
  "access token"; do
  if echo "$SEARCH_LOWER" | grep -qF -- "$pattern"; then
    echo "[fe-rail] ⚠️  WARNING [task-guard]: 서브에이전트 프롬프트에 민감 정보 접근 패턴 감지" >&2
    echo "[fe-rail]   패턴: $pattern" >&2
    echo "[fe-rail]   서브에이전트가 민감한 파일이나 정보를 다루지 않도록 확인하세요." >&2
    break
  fi
done

exit 0
