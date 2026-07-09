#!/bin/bash
# [fe-rail] guard.sh — PreToolUse:Bash
# 비가역적 위험 명령어를 차단합니다. exit 2 = 도구 실행 차단.

# [fe-rail] 프로파일/비활성 토글 (profile-lib.sh; 없으면 fail-open)
_FE_PLIB="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)/scripts/profile-lib.sh"
[ -f "$_FE_PLIB" ] && . "$_FE_PLIB" && ! fe_hook_enabled "guard" "minimal" && exit 0

# Claude Code 는 hook 입력을 stdin JSON 으로 전달한다.
# 환경변수 fallback 은 로컬 테스트 전용 — 실제 실행 시에는 stdin 이 사용된다.
HOOK_INPUT=$(cat)

if command -v jq >/dev/null 2>&1; then
  CMD=$(printf '%s' "$HOOK_INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
else
  # jq 미설치: 구조 분리를 못하므로 raw 입력 전체를 검사 대상으로 삼는다.
  # (grep 로 "command" 값만 뽑으면 따옴표 포함 명령이 중간에서 잘려 뒷부분이 미검사되므로,
  #  안전 방향인 "전체 검사"를 택한다 — 오탐이 늘 수 있으나 위험 명령 누락보다 낫다.)
  CMD="$HOOK_INPUT"
fi
CMD="${CMD:-${TOOL_INPUT_COMMAND}}"

[ -z "$CMD" ] && exit 0

# 차단 사유는 stderr 로 출력한다.
# Claude Code 는 exit 2 시 stderr 를 모델에 피드백하므로, stdout 으로 내면 사유가 전달되지 않는다.
block() {
  echo "[fe-rail] BLOCKED: $1" >&2
  exit 2
}

# ─── 차단 패턴 ───────────────────────────────────────────────────────────────

# 1. git add . / git add -A / git add --all / git add ./
#    `.`(또는 `./`) 뒤가 공백·따옴표·행끝일 때만 차단 — `git add ./src`(범위 지정)는 통과.
#    따옴표 허용으로 `bash -c "git add ."` 래핑도 잡는다.
if echo "$CMD" | grep -qE 'git[[:space:]]+add[[:space:]]+(-A|--all|\.\/?)([[:space:]"]|$)'; then
  block "'git add .' / 'git add -A' / 'git add ./' 금지. 파일을 명시적으로 지정하세요."
fi

# 2. git push --force / -f  (--force-with-lease 는 안전하므로 허용)
#    연결 명령("git push --force-with-lease ... && git push --force ...")의 *모든* push 호출을
#    개별 검사한다 — 첫 호출만 보면(head -1) 뒤에 이어붙인 강제 푸시가 우회된다.
if echo "$CMD" | grep -qE 'git[[:space:]]+push[[:space:]].*(--force|-f)([[:space:];&|]|$)'; then
  PUSHES=$(echo "$CMD" | grep -oE 'git[[:space:]]+push[^;&|`$]*')
  while IFS= read -r inv; do
    [ -z "$inv" ] && continue
    # 경계 있는 (--force|-f) 만 매칭 — --force-with-lease 는 "-with-lease" 가 뒤따라 경계에
    # 걸리지 않으므로 자동 제외된다. `--force --force-with-lease` 처럼 둘 다 준 조합에서
    # --force-with-lease 존재만으로 안전 처리하던 우회를 없앤다.
    if echo "$inv" | grep -qE '([[:space:]]|^)(--force|-f)([[:space:];&|]|$)'; then
      block "force push 금지. 원격 히스토리가 손상됩니다. (--force-with-lease 는 허용)"
    fi
  done <<< "$PUSHES"
fi

# 3. git commit --no-verify / -n  (커밋 훅 우회)
#    `-[a-zA-Z]*n` 짧은 플래그만 공백 선행 + 트레일링 경계를 요구해 `--dry-run`·`--gpg-sign`
#    (끝 글자 n)의 부분 오탐을 막는다. `--no-verify` 는 트레일링 경계를 요구하지 않는다 —
#    이전 회귀: (.*[[:space:]])? 로 두 분기 모두에 트레일링 경계를 강제했더니
#    `git commit --no-verify;git push` 처럼 뒤에 공백 없이 다른 명령이 이어지면
#    빠져나갔다(치명적 우회). `--no-verify` 는 완전한 리터럴이라 부분매칭 위험이 없으므로
#    경계 없이 어디서든 매칭해야 우회를 막는다.
#    커밋 메시지(따옴표 내부)는 먼저 제거해 검사한다 — `-m "... -n ..."` 같은 메시지 내용 오탐 방지.
#    sed 는 줄 단위로 동작해 여러 줄 커밋 본문(Conventional Commits 본문 등)에 걸친 따옴표는
#    못 지운다 — 개행을 공백으로 접어 한 줄로 만든 뒤 제거한다.
CMD_NOQUOTE=$(printf '%s\n' "$CMD" | tr '\n' ' ' | sed 's/"[^"]*"//g; '"s/'[^']*'//g")
if echo "$CMD_NOQUOTE" | grep -qE 'git[[:space:]]+commit[[:space:]]+(.*[[:space:]]+)?(--no-verify|-[a-zA-Z]*n([[:space:]]|$))'; then
  block "'--no-verify' / 'git commit -n' 금지. 린트·타입 오류를 수정하세요."
fi

# 4. git stash drop / git stash clear
if echo "$CMD" | grep -qE 'git[[:space:]]+stash[[:space:]]+(drop|clear)'; then
  block "'git stash drop/clear' 금지. 작업 내용이 영구 손실됩니다."
fi

# 5. yarn/npm/pnpm publish
if echo "$CMD" | grep -qE '(yarn|npm|pnpm)[[:space:]]+publish'; then
  block "패키지 배포 금지. 수동으로 실행하세요."
fi

# 6. rm -rf / rm -fr 루트·홈 디렉토리 (/, /*, ~, ~/, $HOME 은 차단 · /tmp·~/build 등 범위 지정은 통과)
if echo "$CMD" | grep -qE 'rm[[:space:]]+(-rf|-fr|-Rf|-fR)[[:space:]]+(/|~|\$HOME)\/?\*?([[:space:]]|$)'; then
  block "루트/홈 디렉토리 삭제 금지."
fi

# 7. DROP TABLE / DROP DATABASE — DB 실행 문맥(DB 클라이언트)에서만 차단.
#    (git log --grep "drop table" 같은 문자열 검색·문서 인용은 통과시켜 오탐을 줄인다)
if echo "$CMD" | grep -iqE '(psql|mysql|mariadb|sqlite3?|mongosh?|prisma|cockroach|clickhouse-client)' \
   && echo "$CMD" | grep -iqE 'DROP[[:space:]]+(TABLE|DATABASE)'; then
  block "DROP TABLE/DATABASE 금지. 수동으로 실행하세요."
fi

# 8. git reset --hard
if echo "$CMD" | grep -qE 'git[[:space:]]+reset[[:space:]]+--hard'; then
  block "'git reset --hard' 금지. 변경사항이 손실됩니다."
fi

# 9. git checkout . / git restore .  ( `-- .` · `HEAD -- .` · `HEAD .` · 끝의 `./` 변형 포함 )
#    LLM 이 선의로 자주 쓰는 `git checkout -- .`(작업 폐기)·`git checkout ./`(rc=0 우회)까지 잡는다.
if echo "$CMD" | grep -qE 'git[[:space:]]+(checkout|restore)[[:space:]]+(--[[:space:]]+|HEAD[[:space:]]+(--[[:space:]]+)?)?\.\/?([[:space:]"]|$)'; then
  block "모든 변경사항 되돌리기 금지. 파일을 명시적으로 지정하세요."
fi

exit 0
