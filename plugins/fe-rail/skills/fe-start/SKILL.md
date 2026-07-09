---
name: fe-start
description: >-
  feature.md 파일을 받아 스펙 확인 → 구현 → 리뷰 → 커밋 → PR까지 자동으로 진행합니다.
  Use when: "fe-start feature.md" 또는 "feature.md로 시작해줘"라고 말할 때.
  Do NOT load for: 단발 버그 핫픽스·1줄 변경·탐색성 작업·통과/실패 신호가 모호한 작업 (단일 스킬 또는 직접 프롬프트가 낫다).
  사람 개입은 두 번: "구현할까요?", "커밋할까요?" — fe-spec 풀 자동 핸드오프로 진입 시는 "커밋할까요?" 한 번(fe-spec Phase 3 선택이 첫 승인을 겸함, 총합 2회 유지). 재위임 상한 소진 시 예외 에스컬레이션 STOP 가능.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - AskUserQuestion
  - Task
  - Agent
---

# FE Start — 원스톱 자동화 스킬

`feature.md` 하나로 PR까지 자동으로 처리합니다.
중간에 딱 두 번만 묻습니다.

## When to Use

- "fe-start feature.md" 실행 시
- "feature.md로 시작해줘" 라고 말할 때
- 자동화 모드로 기능 개발 시작할 때

## When NOT to Use

- 단발 버그 핫픽스 / 1줄·국소 변경 → fe-build 또는 직접 수정
- 탐색·조사성 작업(무엇을 만들지 미정) → 직접 프롬프트
- 통과/실패 신호가 모호해 완료 판정이 어려운 작업 → 풀 파이프라인 부적합

> 반복되고 통과/실패가 명확한 기능 개발에만 풀 파이프라인을 쓴다 (루프 비용 대비 효과).

## Instructions

### Phase 0 — feature.md 읽기 및 분석
```

feature.md 존재 확인 → 없으면: "feature.md가 없습니다. fe-spec 스킬로 먼저 작성해주세요." → 있으면: 파일 읽고 요구사항 파악

```

분석 결과를 요약해서 보여줍니다:
- 구현할 컴포넌트/기능
- 영향받는 파일
- 예상 소요 단계

### Phase 1 — 첫 번째 확인 ⛔ STOP

Phase 0 요약을 보여준 뒤 AskUserQuestion 으로 진행 여부를 묻는다 (자유 텍스트 아님 — 단일 선택 라디오). 승인 전 코드 작성 금지.

```jsonc
// AskUserQuestion 호출 — 단일 선택(라디오)
{
  "questions": [{
    "header": "구현 시작",
    "question": "위 내용으로 구현을 시작할까요?",
    "multiSelect": false,
    "options": [
      { "label": "구현 시작", "description": "스펙대로 Phase 2 부터 구현 진행" },
      { "label": "계획만",    "description": "코드 작성 없이 계획만 확인하고 멈춤 (--plan-only 와 동일)" },
      { "label": "중단",      "description": "시작하지 않고 멈춤" }
    ]
  }]
}
```

- 구현 시작 → Phase 2 로 진행. 그 외(계획만·중단·Other) → 코드 작성 없이 멈추고 사용자 지시를 기다린다.

> 예외 (중복 확인 방지): fe-spec Phase 3 의 "풀 자동" 선택으로 진입한 경우, 구현 시작 승인을 이미 받은 것이므로 이 질문은 생략하고 Phase 2 부터 시작한다. (standalone fe-start feature.md 진입은 그대로 이 확인을 거친다.)

---

### Phase 2 — 구현 (fe-build 스킬 기준 적용)
1. 관련 기존 코드 탐색
2. 타입 정의
3. 커스텀 훅 작성
4. 컴포넌트 구현
5. 테스트 작성

> **재위임 상한·실패 출구 (Phase 3·4 공통)**
> 자동 수정/리뷰 재위임은 **같은 항목 군(群) 기준 누적 3회**까지. 3회 후 미해소면 루프를 멈추고
> **사람에게 에스컬레이션** — 미해소 항목·시도 이력(각 회차 무엇을 바꿨고 왜 막혔는지)·추정 원인을
> STOP 으로 보고한다. (개별 에이전트 `maxTurns` 는 단일 호출 경계라 이 오케스트레이션 루프를 못 막는다.)
> **반복 신호 전달**: 직전 회차 미해소 사유를 다음 위임 컨텍스트에 넣어 같은 접근의 재시도를 막는다.

### Phase 3 — 자동 검증

먼저 lock 파일로 패키지 매니저를 감지한다 (pnpm 고정 금지):
```bash
if   [ -f pnpm-lock.yaml ]; then PM=pnpm; PX=pnpm
elif [ -f yarn.lock ];      then PM=yarn; PX=yarn
elif [ -f bun.lockb ] || [ -f bun.lock ]; then PM=bun; PX=bun
else                              PM=npm; PX=npx
fi
```

감지된 `$PM`으로 검증을 실행한다. **`package.json`의 `scripts` 존재 여부를 먼저 확인**하고 정의된 것만 실행한다 — `||` 폴백은 스크립트 실패 시에도 우측을 실행해 타입체크/테스트가 이중 실행되므로 쓰지 않는다:
```bash
# 타입: typecheck 스크립트 우선 → 없고 솔루션 스타일 tsconfig(references)면 tsc -b → 그 외 tsc --noEmit
# (bare tsc --noEmit 은 files:[]+references 구성에서 아무 파일도 검사하지 않는 no-op — fe-build-fixer 등과 동일 기준)
if grep -q '"typecheck"' package.json; then $PM run typecheck
elif grep -q '"references"' tsconfig.json 2>/dev/null; then $PX tsc -b
else $PX tsc --noEmit; fi
# 린트: 스크립트가 있을 때만 (없으면 건너뜀 — 검증 중단 방지)
if grep -q '"lint"' package.json; then $PM run lint; fi
# 테스트: test 스크립트가 있으면 그것만, 없으면 vitest 폴백 (watch 비활성: --run)
if grep -q '"test"' package.json; then $PM run test; else $PX vitest run; fi
```

실패 시 `fe-build-fixer` 에이전트에 위임하여 최소 diff로 오류 수정 후 재검증.
**같은 오류 군 3회 초과 시 → 위 "재위임 상한·실패 출구"로** (무한 수정 루프 차단).

### Phase 4 — 리뷰 (에이전트 위임)

`fe-reviewer` 에이전트에 위임하여 4축(타입·성능·a11y·품질) 리뷰를 수행한다.
접근성(a11y) BLOCK/WARN 발생 시 → `fe-a11y-auditor` 추가 위임.
성능 BLOCK/WARN 발생 시 → `fe-perf-auditor` 추가 위임 (Tailwind 감지 시 purge·@apply 감사 포함).

결과를 받아 BLOCK/WARN/INFO 항목을 간략 보고한다.
BLOCK이 있으면 수정 후 재위임하되 **같은 BLOCK 군 3회 초과 시 → "재위임 상한·실패 출구"로**.
BLOCK 0 은 **Phase 4.5 진행의 필요조건**일 뿐, 최종 종료 판정은 Phase 4.5 의 완료 기준 통과로 한다
(BLOCK 0 = "리뷰어가 그만 지적함" ≠ "완료").

### Phase 4.5 — 완료 기준 게이트 (런타임 검증)

> **"완료"의 정의는 `feature.md` 의 '완료 기준'(Acceptance Criteria)이다.** (fe-spec 생성 feature.md 는 항상 포함.)

1. `## 완료 기준 (Acceptance Criteria)` 섹션을 읽어 **두 부류로** 처리한다 (문구를 명령으로 파싱하지 않고
   고정 체크리스트를 표준 게이트에 매핑). 섹션이 없으면(fe-spec 우회·손작성) "완료 기준 미정의"로 기록하고
   자동 게이트만 돌린 뒤 STOP 에 표기한다.
   - **자동 실행 항목** ← 타입·린트·단위(Phase 3 결과 재사용) + 빌드·E2E(아래).
   - **사람 검증 항목** ← 자동 불가: 반응형(375/768/1280)·접근성(키보드·aria·대비)·다크모드·DESIGN.md Bans
     → 실행하지 않고 STOP 에서 사람 확인 대상으로 노출.
2. **무거운 게이트(build·e2e)는 여기서 1회만** 실행한다 — 재위임 루프 안에서 반복하지 않는다.
   ```bash
   # PM/PX 재감지 (Phase 3 변수가 이 블록에 전달되지 않을 수 있어 독립 선언)
   PM=npm; PX=npx
   [ -f pnpm-lock.yaml ] && PM=pnpm && PX=pnpm
   [ -f yarn.lock ]      && PM=yarn && PX=yarn
   { [ -f bun.lockb ] || [ -f bun.lock ]; } && PM=bun && PX=bun
   if grep -q '"build"' package.json; then $PM run build; fi
   # E2E: 완료기준이 "(E2E/Playwright 존재 시)" 로 조건부 → 디렉터리+의존성 있을 때만
   if [ -d e2e ] && grep -q '@playwright/test' package.json; then
     $PX playwright install --with-deps chromium >/dev/null   # 브라우저 미설치 대비
     if grep -q '"e2e"' package.json; then $PM run e2e; else $PX playwright test; fi
   fi
   ```
3. 결과를 **통과/실패/미실행(사유: e2e 없음·브라우저·포트 등 환경 미비)** 로 구분 기록한다.
   **미실행을 통과로 표기하지 않는다.**
4. **(고증 화면 한정) 시각 충실도 게이트** — `화면 흐름` 충실도 등급=**고증 시안** 이고 `레퍼런스` 가 있는 화면만.
   (와이어프레임·스케치·레퍼런스 없음 → 건너뜀 — 레퍼런스 없이 충실도를 채점하면 환각.)
   - **캡처**: 빌드/dev 서버 기동 후 해당 라우트를 레퍼런스와 **동일 뷰포트**로 스크린샷(Playwright `page.screenshot()` 또는 chrome-devtools MCP). 앱 미기동·라우트 부재면 **"미검증"**(통과 아님)으로 기록.
   - **판정**: `fe-vision` **대조 모드**에 `reference_images`+`generated_screenshot`+`category_hint`(Figma=`figma-hifi` / PPT-PDF=`ppt-layout`)를 넘겨 JSON 판정을 받는다.
   - **루프**: `score < 임계` 면 `differences`/`suggestions` 를 `fe-build`(또는 `fe-build-fixer`)에 먹여 타깃 수정 → 재캡처 → 재판정. 위 **"재위임 상한"(같은 화면 3회)** 으로 bound, 초과 시 출구로.
   - 최종 점수·미해결 차이를 Phase 5 보고에 그대로 노출(미달도 정직 보고 — "통과" 단정 금지).

> **CI 위임(A안)**: `--ci-live` 면 build·e2e 를 로컬 실행 대신 "CI(push 후)에서 검증" 으로 위임한다.
> 기본(플래그 없음)은 로컬 실행(B안)이 floor — `buildspec.yml`·`.github/workflows` 등 *설정 파일 존재*만으로
> CI 가 살아있다고 가정하지 않는다.
> **건너뛰기**: `--skip-e2e` 면 e2e 생략하되 STOP·PR 에 "E2E 미검증" 을 명시한다.

### Phase 5 — 두 번째 확인 ⛔ STOP

**먼저** 실제 실행된 검증만 텍스트로 보고하고("검증 완료" 같은 포괄 표현 금지 — Phase 3·4.5 결과를 그대로 채운다), **그다음 `AskUserQuestion` 으로 커밋·PR 여부를 묻는다** (단일 선택 라디오).

보고(질문 앞 본문):
> **"자동 검증 — 타입·린트·단위: {통과/실패}, 빌드: {통과/실패/미실행}, E2E: {통과/실패/미실행(사유)}{, 시각 충실도: {점수/미검증} — 고증 화면 시}.
> 사람 확인 필요 — 반응형·접근성·다크모드{·DESIGN}."**

```jsonc
// AskUserQuestion 호출 — 단일 선택(라디오)
{
  "questions": [{
    "header": "커밋·PR",
    "question": "로컬에서 동작을 직접 확인하셨다면, 커밋·PR 을 진행할까요?",
    "multiSelect": false,
    "options": [
      { "label": "커밋·PR 진행", "description": "커밋·푸시 후 PR 생성 (Phase 6 전체)" },
      { "label": "커밋만",       "description": "커밋·푸시만, PR 생성 안 함 (--no-pr 와 동일)" },
      { "label": "중단",         "description": "커밋하지 않고 멈춤" }
    ]
  }]
}
```

- **커밋·PR 진행** → Phase 6 전체. **커밋만** → 6-1 만(PR 생략). **중단·Other** → 커밋하지 않고 멈춘다.
- E2E 미실행/미검증이면 보고에 그대로 노출한다 (예: "E2E: 미실행 — 로컬 미수행·CI 미연결").
- `--ci-live` 면: 보고에 "E2E·빌드는 push 후 CI 에서 검증" 으로 표기.
- `--no-pr` 가 이미 켜져 있으면 "커밋·PR 진행" 대신 "커밋 진행"으로 좁혀 묻는다(PR 항목 제외).

---

### Phase 6 — 커밋 & PR (에이전트 위임)

본문에서 git/gh 명령을 직접 실행하지 않고 전담 에이전트에 순차 위임합니다.
이렇게 하면 `hooks/guard.sh` 의 위험 명령 차단 정책과 자연스럽게 일치하고,
메인 세션 컨텍스트가 diff·커밋 메시지로 오염되지 않습니다.

#### 6-1. `fe-git-operator` 위임 — 커밋 & 푸시

전달할 컨텍스트:
- Phase 2에서 작성/수정한 **파일 목록** (명시적 스테이징 대상)
- 기능명, 주요 변경사항 요약, 관련 이슈 번호

에이전트가 책임지는 것:
- 명시적 파일 스테이징 (절대 `git add -A` / `git add .` 사용 금지)
- 논리 단위별 커밋 분리, 컨벤셔널 커밋 메시지 작성
- `git push origin HEAD`

#### 6-2. `fe-pr-author` 위임 — PR 생성

전달할 컨텍스트:
- feature.md 경로
- 커밋 범위 (base..HEAD)
- Phase 4 리뷰 요약 (통과/경고 항목)

에이전트가 책임지는 것:
- PR 제목·본문 작성 (변경사항·완료 기준 체크리스트 포함)
- `gh pr create --draft` 실행
- 메인 세션은 **PR URL만** 결과로 받음

> PR은 기본 draft로 생성합니다. 준비되면 직접 ready for review로 전환하세요.
> `--no-pr` 플래그가 켜져 있으면 6-2는 건너뜁니다.

## 플래그

| 플래그 | 설명 |
|--------|------|
| `--plan-only` | Phase 1까지만 (계획 확인만) |
| `--no-pr` | 커밋까지만, PR 생성 안 함 |
| `--no-draft` | PR을 바로 ready 상태로 생성 |
| `--ci-live` | push 후 CI 가 build·e2e 를 실제로 돌린다고 선언 → Phase 4.5 무거운 게이트를 로컬 대신 CI 에 위임 |
| `--skip-e2e` | Phase 4.5 로컬 E2E 생략 (STOP·PR 에 "E2E 미검증" 명시) |

> **신규 도입 순서(권장)**: `--plan-only`(계획만) → `--no-pr`(커밋까지) → 풀 파이프라인.
> 핵심 워크플로에 전면 적용하기 전, 제한 범위에서 비용·효과를 먼저 확인한다.
