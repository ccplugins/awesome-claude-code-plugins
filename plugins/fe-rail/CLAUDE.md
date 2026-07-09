# fe-rail — Claude 에이전트 컨텍스트

> **하네스 엔지니어링 원칙**: Agent = Model + Harness
> 이 저장소는 프론트엔드 프로젝트 전용 Claude Code 플러그인이다.
> 다른 프로젝트에 설치하여 사용하는 **하네스(Harness)** 이지, 그 자체가 애플리케이션 프로젝트가 아니다.

---

## 이 저장소의 목적

`fe-rail`은 프론트엔드 개발 워크플로우를 표준화하는 Claude Code 플러그인이다.
React + TypeScript 환경(Next.js App Router / Vite SPA 모두)을 대상으로 하며,
**spec → build → review → PR** 사이클을 강제하여 에이전트 출력 품질을 일관되게 유지한다.

---

## 하네스 구조 (Harness Layers)

```
fe-rail/
├── CLAUDE.md              ← 에이전트 컨텍스트 (이 파일)
├── agents/                ← 15개 서브에이전트 (spec·build·review·PR 단계별)
│   ├── fe-analyst.md      ← spec: 요구사항 갭 분석
│   ├── fe-deck-reader.md  ← spec: PPT 기획서 분해 (정책·화면·흐름)
│   ├── fe-vision.md       ← spec: 화면 분석 · verify: 시각 충실도 대조(visual-verdict)
│   ├── fe-researcher.md   ← spec: 외부 문서 조사
│   ├── fe-architect.md    ← spec: 아키텍처 자문
│   ├── fe-explorer.md     ← build: 코드베이스 탐색
│   ├── fe-test-author.md  ← build: BDD·TDD 테스트 작성
│   ├── fe-build-fixer.md  ← build: tsc·린터(ESLint/Biome) 오류 수정
│   ├── fe-reviewer.md     ← review: 4축 코드 리뷰
│   ├── fe-a11y-auditor.md ← review: a11y 정밀 감사
│   ├── fe-perf-auditor.md ← review: 성능 정밀 감사
│   ├── fe-test-runner.md  ← review: 테스트 실행·분류
│   ├── fe-refactor-advisor.md ← review: 리팩토링 분석
│   ├── fe-git-operator.md ← PR: 커밋 분리·스테이징·커밋 본문 작성 (fix=증상·원인·해결 / feat=추가·핵심·영향)
│   └── fe-pr-author.md    ← PR: PR 본문 작성 (성격별 🐛/✨ 블록 + 리뷰 포인트) + `gh pr create`
├── hooks/                 ← SessionStart·Pre/PostToolUse·Stop·Notification 훅 (hooks.json 배선)
│   ├── session-init.sh    ← SessionStart: 원격 버전 체크(하루 1회, GitHub raw) + 권장 권한 미설정 안내
│   ├── guard·write-guard·task-guard·config-protection ← 차단(exit 2): 위험명령·민감파일·인젝션·설정 약화
│   ├── read-guard·lint-fix·nextjs-guard·design-nudge·quality-gate·doc-sync-check ← 경고(stderr)
│   ├── notify.sh          ← Notification(옵션): terminal-notifier 배너 (setup-notifier.sh 로 활성화, hooks.json 미배선)
│   └── scripts/           ← profile-lib(프로파일/토글)·setup-permissions(권장 Bash 권한 → settings.local.json)·setup-notifier(notify 활성화)
├── skills/
│   ├── fe-spec/           ← 기획 → 스펙 변환
│   ├── fe-build/          ← 스펙 → 코드 구현
│   ├── fe-review/         ← 4축 코드 리뷰
│   ├── fe-start/          ← 원스톱 자동화 (spec→PR)
│   └── fe-doc-sync/       ← 설치된 사용자 프로젝트 스캔 → 그 프로젝트의 CLAUDE.md·README.md 동기화
├── eval/
│   └── run.sh             ← 회귀 eval (훅 동작·프로파일·self-lint, 결정적·CI용)
├── docs/ ← framework-rules.md · monorepo.md (CLAUDE.md 가 @import)
└── .claude-plugin/ ← plugin.json · marketplace.json (플러그인 메타데이터)
```

> 권한(Bash 화이트리스트)은 **소비자 프로젝트의 `.claude/settings.json`** 에서 설정한다 — 이 플러그인은 권한 파일을 배포하지 않는다(아래 "권한 및 보안" 참조).

### 레이어별 역할

| 레이어 | 파일 | 역할 |
|--------|------|------|
| **CLAUDE.md** | 이 파일 | 에이전트가 프로젝트를 이해하는 최우선 컨텍스트 |
| **Skills** | `skills/*/SKILL.md` | 작업 유형별 전문화된 지침 (도구 제한 포함) |
| **Agents** | `agents/*.md` | spec·build·review·PR 단계별 격리 서브에이전트 (15개) |
| **Hooks** | `hooks/hooks.json` | SessionStart·Pre/PostToolUse·Stop·Notification 이벤트 자동 실행 사이드이펙트 |
| **Permissions** | 소비자 `.claude/settings.json` | Bash 화이트리스트로 PR 단계 권한 프롬프트 축소 (플러그인엔 미포함) |

### 훅 프로파일 · 회귀 eval

- **프로파일**: `FE_RAIL_HOOK_PROFILE`(`minimal` | `standard`(기본) | `strict`) + `FE_RAIL_DISABLED_HOOKS="a,b"` 로 소비자 환경에서 훅 강도를 조절한다(플러그인 파일 수정 없이). `minimal`=안전 차단기만(guard·write-guard·task-guard·config-protection), `standard`=+품질 경고 전부. **프로파일 하향으로는 차단기가 꺼지지 않으며**, 끄려면 `DISABLED_HOOKS`에 이름을 명시해야 한다. 공유 로직: `hooks/scripts/profile-lib.sh`. 린터·타입체크(tsc) npx 폴백은 기본 꺼짐 — 로컬 바이너리만 쓰고, 필요 시 `FE_RAIL_ALLOW_NPX=1` 로 옵트인한다(자동 훅의 네트워크·미고정 최신버전 부작용 방지). 단 `package.json` 에 `typecheck` 스크립트가 있으면 프로젝트 자신의 lockfile 로 실행되므로 이 옵트인과 무관하게 항상 허용.
- **회귀 eval**: `bash eval/run.sh` — 라이브 모델 없이 훅 동작(차단 사유가 stdout이 아닌 stderr로 전달되는지, 비차단 훅 5개의 안내도 동일하게 stderr로 나가는지 포함)·프로파일·self-lint(agent `model` 별칭·skill frontmatter·`hooks.json` 무결성·위임을 지시하는 스킬의 `allowed-tools`에 Task/Agent 포함 여부·bun `PX` 감지 일관성·`typecheck` 분기의 `references`(tsc -b) 폴백 동반 여부·바이너리+플래그 실행이 `$PM exec` 아닌 `$PX`인지·bare `$PM lint`/`$PM tsc` 금지(→`$PM run lint`/`$PX tsc`)·fe-researcher Context7 이중 접두사(plugin+직접))를 결정적으로 검증(실패 시 exit 1).

---

## 지원 MCP 플러그인

하네스가 최적으로 동작하려면 다음 MCP 플러그인이 설치되어 있어야 한다.
각 플러그인은 특정 에이전트의 `tools` 목록에 등록되어 있으며, 없으면 해당 에이전트가 fallback 동작으로 전환된다.

| MCP | 설치 형태 | 연결 에이전트 | 도구 접두사 | 없을 때 fallback |
|-----|----------|-------------|-----------|----------------|
| **Figma** | claude.ai 계정 커넥터 (`/mcp` → "claude.ai Figma", OAuth) | `fe-vision` | `mcp__claude_ai_Figma__get_design_context`<br>`mcp__claude_ai_Figma__get_screenshot` (외 get_metadata·get_variable_defs) | 로컬 스크린샷(PNG/JPG)만 분석 |
| **Context7** | Claude Code 플러그인 | `fe-researcher` | `mcp__plugin_context7_context7__resolve-library-id`<br>`mcp__plugin_context7_context7__query-docs`<br>(+ `.mcp.json` 등록 대비 `mcp__context7__*` 도 등록) | WebSearch + WebFetch로 문서 조회 |
| **Chrome DevTools** | Claude Code 플러그인 (`ChromeDevTools/chrome-devtools-mcp`) | `fe-perf-auditor`·`fe-a11y-auditor` | `mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace`<br>`mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit` (외 performance_stop_trace·performance_analyze_insight·list_console_messages·list_network_requests·take_snapshot·navigate_page) | 정적 분석(grep 기반 추정치)만 수행 — `--live` 호출 시에만 실측 시도, 미설치면 정적 결과만 |

> Microsoft 365 (선택 보조): OneDrive/SharePoint 의 PPT 기획서를 가져오는 용도. 단 인터랙티브 OAuth 인증이 필요하고 슬라이드를 시각적으로 렌더해 주지 않을 수 있어, 화면 분석에는 PDF 변환이 더 안전하다. 특정 에이전트에 직접 연결하지 않으며, 가져온 파일은 부모 세션이 PDF/이미지로 변환해 fe-deck-reader 에 전달한다.

> 도구 접두사는 설치 형태에 따라 달라진다. 플러그인으로 설치하면 `mcp__plugin_<플러그인>_<서버>__*`, 사용자/프로젝트 `.mcp.json`으로 등록하면 `mcp__<서버>__*`, claude.ai 계정 커넥터(OAuth)는 `mcp__claude_ai_<서버>__*` 형식이다. 에이전트 `tools` 목록의 접두사가 실제 설치 형태와 일치해야 도구가 인식되며, 불일치 시 fallback으로만 동작한다. (Figma·Context7 의 플러그인 접두사는 직접 검증됨. Context7 은 `.mcp.json`/`claude mcp add` 등록 대비 `mcp__context7__*` 도 함께 등록해 뒀는데, 이 형태와 Chrome DevTools 행은 명명 규칙 기반 예상 접두사이므로 최초 사용 시 실제 등록된 도구 이름과 대조 확인 권장.)

### 설치

- **Context7** (플러그인): `/plugin install context7@<marketplace>` → `/reload-plugins`. 도구는 `mcp__plugin_context7_context7__*` 로 등록된다.
- **Figma** (claude.ai 계정 커넥터): `/mcp` 실행 → "claude.ai Figma" 선택 → OAuth 인증. 공식 Figma MCP(mcp.figma.com)를 claude.ai가 프록시하며, 도구는 `mcp__claude_ai_Figma__*` 로 등록된다. (Dev Mode 계열 도구는 Dev/Full seat 필요)
- **Chrome DevTools** (플러그인, 스킬 포함): `/plugin marketplace add ChromeDevTools/chrome-devtools-mcp` → `/plugin install chrome-devtools-mcp@chrome-devtools-plugins`. MCP만 필요하면 `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` 로도 등록 가능(이 경우 접두사는 `mcp__chrome-devtools__*`). Chromium 기반 브라우저 실행 환경이 필요하다.

---

## 모델 티어 정책

각 에이전트의 `model`은 **별칭**(`opus`/`sonnet`/`haiku`)으로 지정한다. 풀 버전 ID를 고정하지 않는다.

| 티어 | 에이전트 | 기준 |
|------|---------|------|
| **opus** | fe-analyst · fe-architect · fe-reviewer · fe-refactor-advisor | 추론·판단 집약, 게이트 역할 (오탐/누락 비용 큼) |
| **sonnet** | 위·아래를 제외한 실행·도구 계열 전부 | 구현·수정·실행 등 |
| **haiku** | fe-explorer | 단순 코드 탐색, 비용 효율 우선 |

- **별칭의 의미**: 모델 패밀리 업데이트(예: Opus 4.7 → 4.8) 시 자동으로 최신 티어를 사용한다. 별도 수정 없이 개선이 반영되지만, 플러그인 버전이 같아도 동작이 변동될 수 있다.
- **재현성 점검**: 안정성이 중요한 경우 릴리스마다 현재 별칭 해상도 기준으로 회귀를 확인한다 (`bash eval/run.sh` 로 훅·self-lint 회귀를 자동 검사).
- **티어 변경 원칙**: "전부 opus화" 금지. 고판단 게이트만 선별 상향하고, 탐색·기계적 작업은 저비용 티어를 유지한다.

---

## 워크플로우

```
사용자 요청
    │
    ▼
fe-spec  →  feature.md 생성 (사용자 승인 필요)
            └─ 에이전트: fe-analyst·fe-deck-reader·fe-vision·fe-researcher·fe-architect
    │
    ▼
fe-build →  타입 → 비즈니스 로직 분리 → 컴포넌트 → 테스트 순서로 구현
            └─ 에이전트: fe-explorer·fe-test-author·fe-build-fixer
    │
    ▼
fe-review → 4축 검토 (타입·성능·a11y·품질)
            └─ 에이전트: fe-reviewer·fe-a11y-auditor·fe-perf-auditor·fe-test-runner·fe-refactor-advisor
    │
    ▼
커밋 & PR  →  git + gh CLI (사용자 승인 필요)
            └─ 에이전트: fe-git-operator·fe-pr-author
```

**원스톱 자동화**: `fe-start` 스킬이 위 전체 흐름을 자동으로 처리한다.
사람 개입은 "구현할까요?"와 "커밋할까요?" 두 번뿐이다.

fe-spec → fe-start 핸드오프: fe-spec 의 "다음 단계" 게이트에서 "풀 자동"을 고르면 fe-start 로 이어진다. 이때 "구현할까요?"는 fe-spec 게이트가 대신하므로 fe-start 는 "커밋할까요?"만 묻는다(전체 승인 2회 유지).

---

## 다른 프로젝트에 적용하기

### 설치 방법

```bash
# Claude Code 내에서
/plugin marketplace add sh5623/fe-rail
/plugin install fe-rail@fe-rail-market
```

### 스킬 호출

```bash
/fe-rail:fe-spec     # 기능 요구사항 → feature.md
/fe-rail:fe-build    # feature.md → 코드 구현
/fe-rail:fe-review   # 코드 리뷰
/fe-rail:fe-start feature.md  # 원스톱 자동화
/fe-rail:fe-doc-sync  # 설치된 프로젝트 스캔 → 그 프로젝트의 CLAUDE.md·README.md 동기화
```

### 설치 후 권장 설정 (소비자 프로젝트)

에이전트는 **소비자 프로젝트의 컨텍스트를 읽어** 추론한다. 설치 직후 아래를 갖추면 출력 품질이 크게 올라간다.

1. **프로젝트 CLAUDE.md 생성** — `fe-analyst`·`fe-architect`는 소비자 프로젝트의 CLAUDE.md에서 스택·규칙을 읽는다. 이 플러그인의 CLAUDE.md는 소비자 세션에 로드되지 않으므로, 소비자가 자체 CLAUDE.md를 두지 않으면 에이전트가 빈손으로 분석한다. → `/init` 또는 `/fe-rail:fe-doc-sync` 실행.
2. **Bash 권한 허용 (권장: 자동)** — 소비자 프로젝트 루트에서 `bash <fe-rail 설치경로>/hooks/scripts/setup-permissions.sh` 실행 → 호스트(GitHub/CodeCommit)를 감지해 `Bash(git *)`·PR 명령 권한을 `.claude/settings.local.json`의 `permissions.allow`에 병합한다(확인 1회, 기존 키·값 보존). 미설정이면 PR 단계 에이전트가 매번 권한 프롬프트를 띄운다. 세션 시작 시 미설정이면 안내가 뜬다(끄기: `FE_RAIL_SKIP_SETUP_NUDGE=1`). 수동으로는 `.claude/settings.json`의 `permissions.allow`에 직접 추가. (위험 git 명령은 `guard.sh`가 계속 차단하므로 광범위 allow 라도 안전.)
3. **MCP (선택)** — Figma·Context7·Chrome DevTools 미설치 시 `fe-vision`·`fe-researcher`·`fe-perf-auditor`·`fe-a11y-auditor`는 각각 fallback(로컬 이미지·WebSearch·정적 분석)으로 동작한다. 미리 다 설치할 필요 없이, 각 에이전트가 폴백할 때 **그 자리에서 활성화 명령을 안내(JIT)**하므로 필요할 때 설치하면 된다. 위 "지원 MCP 플러그인" 참조.

### 대상 프로젝트 유형

이 플러그인은 다음 환경에서 동작한다:

| 환경 | 지원 여부 | 비고 |
|------|----------|------|
| Next.js + TypeScript | ✅ | App Router 기준, RSC 최적화 포함 |
| Vite + React (TanStack Router) | ✅ | 라우트 loader·Zustand 규칙 내장 |
| Vite + React (React Router 7) | ✅ | react-router/react-router-dom 둘 다 인식 · 라우팅/레이아웃 전용 — 서버 데이터는 TanStack Query 단독 소유 |
| Tailwind CSS v3 / v4 (직교) | ✅ | 디자인 토큰·`cn()`·`@apply` 정책·content/purge·대비 점검 — v4 는 CSS-first(`@theme`)·gradient rename·`@reference` 추가 분기 |
| shadcn/ui (직교) | ✅ | UI primitives 격리·`cva()` variant·래핑 패턴 — Tailwind 위에서 동작 |
| 모노레포 | ✅ | 아래 별도 섹션 참조 |

---

## 모노레포 지원

@docs/monorepo.md

---

## 프레임워크별 코딩 규칙

@docs/framework-rules.md

---

## 공통 품질 기준 (프레임워크 무관)

모든 구현은 다음 기준을 충족해야 커밋이 허용된다.

| 항목 | 기준 |
|------|------|
| TypeScript | `any` 타입 0개, strict mode |
| 린트 | 린터(ESLint 또는 Biome) 경고 0개 |
| 테스트 | Vitest + Testing Library, 주요 인터랙션 커버 |
| 접근성 | WCAG AA — `aria-label`, 키보드 네비게이션 |
| 반응형 | 375px / 768px / 1280px 기준 |
| 성능 | 이미지 최적화, 불필요한 리렌더링 없음 |

### 검증 명령어

```bash
# lock 파일로 패키지 매니저를 먼저 감지한 뒤 아래 대응 명령어를 실행
# pnpm-lock.yaml → pnpm / yarn.lock → yarn / bun.lock(b) → bun / 없으면 → npm
#
# 타입 체크는 프로젝트 `typecheck` 스크립트가 있으면 그것을 우선 사용한다.
# (솔루션 스타일 tsconfig — files:[] + references — 에서는 bare `tsc --noEmit` 이
#  아무 파일도 검사하지 않으므로 `typecheck` 스크립트 또는 `tsc -b` 를 써야 한다.)

# 타입 체크
npx tsc --noEmit          # npm
pnpm tsc --noEmit         # pnpm
yarn tsc --noEmit         # yarn
bun tsc --noEmit          # bun

# 린트 (ESLint 또는 Biome — 프로젝트 설정에 따라)
npm run lint              # npm
pnpm lint                 # pnpm
yarn lint                 # yarn
bun run lint              # bun

# 테스트 (vitest 기준)
npm test -- --run         # npm
pnpm test --run           # pnpm
yarn test --run           # yarn
bun run test --run        # bun (bun test 는 Bun 내장 러너 — vitest 를 돌리려면 run 스크립트 경유)
```

---

## 에이전트 행동 원칙

### 반드시 지킬 것

- **스펙 먼저** — `feature.md` 없이 코드 작성 시작 금지
- **사용자 승인 두 번** — 구현 시작 전, 커밋 전
- **타입 먼저** — 구현 순서: 타입 정의 → 훅/서비스 → 컴포넌트 → 테스트
- **검증 후 보고** — 자동 검증(`tsc`, `lint`, `test`) + 완료 기준 게이트(`build`/`e2e` 존재 시 · 고증 화면이면 시각 충실도 대조, fe-start Phase 4.5) 통과 후 완료 선언. "완료"는 `feature.md` 의 완료 기준 충족이다 (리뷰 BLOCK 0 ≠ 완료)

### 하지 말 것

- `any` 타입 사용
- 스펙 없이 "대충 이런 방향으로" 구현
- 테스트 없이 완료 선언
- `console.log`를 코드에 남기기
- 패키지 경계를 무시한 직접 import (모노레포)
- 에이전트가 자신의 격리 범위(`disallowedTools`)를 벗어나 행동

---

## 권한 및 보안

이 플러그인은 권한 설정 파일을 배포하지 않는다. Bash 권한은 소비자 프로젝트에서 설정한다 — 권장은 `hooks/scripts/setup-permissions.sh`(호스트 감지 → `.claude/settings.local.json`의 `permissions.allow`에 병합, 확인 1회)이고, 수동으로는 `.claude/settings.json`에 직접 추가한다. `settings.local.json`을 쓰는 이유는 개인 로컬 설정이고 `.claude`가 `.gitignore` 대상일 수 있어 팀 공유 파일을 건드리지 않기 위함이다.

권장 허용 명령어 (PR 단계 에이전트가 매번 프롬프트 없이 동작):
- `Bash(git *)` — 버전 관리 전 범위 (위험 명령은 `guard.sh`가 exit 2 로 차단 — 광범위 allow 의 백스톱)
- `Bash(gh pr *)` — PR 생성·조회 (fe-pr-author)

> 세션 시작 시 권장 권한이 없으면 `session-init.sh`가 1회 안내한다(끄기: 환경변수 `FE_RAIL_SKIP_SETUP_NUDGE=1`). MCP 는 훅에서 연결 여부를 알 수 없어 세션 안내에 넣지 않고, 각 에이전트가 사용 시점에 JIT 로 안내한다.

---

## 기반 레퍼런스

- [Harness Engineering for Coding Agents — Humanlayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- [Chachamaru127/claude-code-harness](https://github.com/Chachamaru127/claude-code-harness)
- [garrytan/gstack](https://github.com/garrytan/gstack)
