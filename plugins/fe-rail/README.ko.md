# fe-rail

<div align="right">
  <a href="README.ko.md"><img src="https://img.shields.io/badge/lang-한국어-blue?style=flat-square" alt="한국어"/></a>
  <a href="README.md"><img src="https://img.shields.io/badge/lang-English-lightgrey?style=flat-square" alt="English"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License"/></a>
</div>

> 프론트엔드 프로젝트 전용 Claude Code 플러그인
> spec → build → review → PR 자동화 워크플로우. Next.js App Router / Vite SPA(TanStack Router·React Router 7) + TypeScript, Tailwind v3/v4 / shadcn/ui 정식 지원.

## 설치

```bash
claude

/plugin marketplace add sh5623/fe-rail
/plugin install fe-rail@fe-rail-market
```

![fe-rail 워크플로우: spec, build, review, PR](docs/assets/workflow.svg)

## 사용 예시

```
$ claude
> /fe-rail:fe-spec

[fe-spec] 요구사항 분석 중... (fe-analyst, fe-architect)
✔ feature.md 생성 완료 — 7개 섹션, 미해결 질문 3건 해소

다음 단계?
  ❯ 풀 자동 (추천) — fe-start 파이프라인으로 자동 연결
    구현만 — 스펙 먼저 검토
    스펙 수정

> 풀 자동

[fe-start] Phase 2 — 타입 → 훅 → 컴포넌트 → 테스트 구현 중
✔ 12개 파일 생성, tsc 통과, lint 통과, 테스트 8개 통과

커밋하고 PR을 열까요?
  ❯ 예 — type별로 분리해서 드래프트 PR 생성
    아니오 — 변경사항만 남기고 종료

> 예

✔ 커밋 2개 생성
✔ feat/product-search-autocomplete 브랜치로 푸시
✔ 드래프트 PR: https://github.com/you/your-app/pull/42
```

사람이 개입하는 지점은 **"구현할까요?"**와 **"커밋할까요?"** 단 두 번 — 나머지는 전부 자동으로 진행됩니다.

## 포함된 스킬

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| fe-spec | `/fe-rail:fe-spec` | 기능 요구사항 → 구조화된 스펙 문서 생성. Phase 3 에서 다음 단계(풀 자동·구현만·스펙 수정)를 라디오 UI로 선택 — "풀 자동" 선택 시 fe-start 파이프라인으로 자동 연결 |
| fe-build | `/fe-rail:fe-build` | 프론트엔드 코드 구현 (타입→로직 분리→컴포넌트→테스트) |
| fe-review | `/fe-rail:fe-review` | 타입·성능·a11y·품질 4축 리뷰 |
| fe-start | `/fe-rail:fe-start feature.md` | 위 3개를 하나로 — PR까지 자동화. Phase 1·5 가 라디오 UI로 진행 여부·커밋 방식 확인 |
| fe-doc-sync | `/fe-rail:fe-doc-sync` | **설치된 사용자 프로젝트** 스캔 (라우트·의존성·구조·ENV) → 그 프로젝트의 CLAUDE.md·README.md 수정안 제안 |

## 포함된 Hooks

정책: **위험은 차단(exit 2), 품질은 경고(stderr)**.

| Hook | 이벤트 | 역할 | 차단 |
|------|--------|------|------|
| `session-init.sh` | SessionStart | 원격 버전 체크 + 새 버전 알림 (GitHub, 하루 1회) | — |
| `guard.sh` | PreToolUse:Bash | `git add .`, force push, `--no-verify`, `rm -rf /`, `DROP TABLE`, `git reset --hard`, `git checkout/restore .` 등 차단 | ✅ |
| `write-guard.sh` | PreToolUse:Write\|Edit\|MultiEdit | `.env*`·인증서(`*.pem`/`*.key` 등)·시크릿 페이로드 파일(`*.secret`·`*credentials*.json` 등) 생성·수정 차단 (`.env.example`·`CredentialForm.tsx` 같은 소스 파일은 허용) | ✅ |
| `config-protection.sh` | PreToolUse:Write\|Edit\|MultiEdit | 린터/포매터/TS 설정 **약화** 편집만 차단 — `strict:false`·`@ts-nocheck`·린터 `recommended:false`·기존 `strict:true` 제거. 경로 alias·플러그인 추가 등 정상 편집은 통과 | ✅ |
| `read-guard.sh` | PreToolUse:Read | 민감 파일 읽기 시도 경고 출력 (`.env*`·`.envrc`, `*.pem`/`*.key`/`id_rsa` 등 키, `.npmrc`·`*credential*` — write-guard 차단 목록과 대칭) | — |
| `task-guard.sh` | PreToolUse:Task\|Agent | 서브에이전트 프롬프트 내 인젝션 패턴·위험 명령 위임 차단 | ✅ |
| `lint-fix.sh` | PostToolUse:Edit\|Write\|MultiEdit | 소비자 환경 감지 → Biome `check --write` **또는** ESLint `--fix`(+Prettier) 자동 적용 (로컬 바이너리 우선 · npx 폴백은 `FE_RAIL_ALLOW_NPX=1` 옵트인) | — |
| `nextjs-guard.sh` | PostToolUse:Edit\|Write\|MultiEdit | Server Component에서 React 훅/브라우저 API/DOM 이벤트 사용 감지, app router의 `page`/`layout`에 `'use client'` 경고 | — |
| `design-nudge.sh` | PostToolUse:Edit\|Write\|MultiEdit | 프론트 편집에 제네릭/템플릿틱(AI slop) 신호(무거운·임의 그림자, 기본 보라/인디고 그라디언트) 감지 시 경고. **DESIGN.md 있으면 침묵**(fe-reviewer 의 DESIGN Bans 가 정본) | — |
| `quality-gate.sh` | Stop | 변경 파일에 린터(Biome **또는** ESLint) + 타입체크(프로젝트 `typecheck` 스크립트 우선 / 솔루션 tsconfig면 `tsc -b`) 실행 후 경고 출력. 타입체크는 종료코드로 판정(성공 배너 오탐 없음) · 소스 변경이 없어도 `tsconfig*.json`/`package.json` 변경 시 트리거 | — |
| `doc-sync-check.sh` | Stop | 사용자 프로젝트의 코드(src/app/pages/components 등)·package.json·설정 파일 변경 감지 시 `/fe-rail:fe-doc-sync` 실행 안내 (최근 커밋 5개 포함) | — |
| `notify.sh` | (옵션) Notification | macOS terminal-notifier 배너 알림 — `bash hooks/scripts/setup-notifier.sh` 로 활성화 | — |

### 훅 프로파일 · 토글 (강도 조절)

훅 강도를 **환경변수로** 조절할 수 있습니다(플러그인 파일 수정 불필요 — 소비자 프로젝트의 셸/`.claude` 환경에서 설정).

| 환경변수 | 값 | 효과 |
|---|---|---|
| `FE_RAIL_HOOK_PROFILE` | `minimal` | 비가역 위험 **차단기만** (`guard`·`write-guard`·`task-guard`·`config-protection`). 품질 경고·자동정리·문서동기화 안내는 끔 |
| | `standard` (기본) | 위 + 품질 경고·자동정리·문서동기화 전부 |
| | `strict` | `standard` 상위 티어(현재는 상위집합, 향후 더 엄격한 동작 예약) |
| `FE_RAIL_DISABLED_HOOKS` | `"a,b"` | 특정 훅만 콕 집어 비활성 (예: `"doc-sync-check,design-nudge"`) |
| `FE_RAIL_ALLOW_NPX` | `1` | 로컬 린터·`tsc` 바이너리가 없을 때 npx 폴백 허용 (기본은 로컬 전용 — 자동 훅의 네트워크 다운로드·미고정 최신버전 실행 방지). 프로젝트 자체 `typecheck` 스크립트는 패키지 매니저로 실행되므로 이 옵트인과 무관하게 항상 허용 |

> **프로파일 하향(minimal)으로는 안전 차단기가 꺼지지 않습니다** — 차단기를 끄려면 `FE_RAIL_DISABLED_HOOKS` 에 이름을 명시해야 합니다("타협 없는 차단" + 명시적 탈출구). 세션 시작 시 기본이 아닌 프로파일/비활성 목록이 있으면 안내됩니다.

### 회귀 eval

```bash
bash eval/run.sh   # 실패 시 exit 1 (CI 용)
```

라이브 모델 없이 **결정적으로** 검증합니다: 훅 동작(fixture 주입 → exit code/경고 단언, 차단 사유가 stdout이 아닌 stderr로 전달되는지·비차단 훅 5개의 안내도 동일하게 stderr로 나가는지 포함)·프로파일 토글·플러그인 self-lint(agent `model` 별칭 ∈ {opus,sonnet,haiku}·skill frontmatter·`hooks.json` 무결성·프로파일 배선·위임을 지시하는 스킬의 `allowed-tools`에 Task/Agent 포함 여부·bun `PX` 감지 일관성·`typecheck` 분기의 `references`(tsc -b) 폴백 동반 여부·바이너리+플래그 실행이 `$PM exec` 아닌 `$PX`인지). 별칭 티어가 모델 업데이트로 바뀌거나 훅/설정을 고칠 때 회귀를 잡는 용도입니다.

## 포함된 Agents

각 agent는 별도 컨텍스트에서 동작하여 메인 세션을 노이즈로부터 보호합니다.
frontmatter(`tools`/`disallowedTools`/`model`/`maxTurns`) + XML 태그 구조(`<purpose>`/`<forbidden>`/`<required>`/`<workflow>`/`<output>`)로 구성됩니다.

> **모델 티어는 별칭입니다.** 각 agent의 `model`은 `opus`/`sonnet`/`haiku` **별칭**으로 지정되어, 모델 패밀리 업데이트(예: Opus 4.7 → 4.8) 시 자동으로 최신 티어를 사용합니다. 별도 수정 없이 개선이 반영되는 대신, 플러그인 버전이 동일해도 동작이 변동될 수 있습니다. 재현성이 중요한 경우 릴리스마다 현재 별칭 해상도 기준으로 회귀를 점검하세요.
> 티어 배분: **opus**(고판단 — `fe-analyst`·`fe-architect`·`fe-reviewer`·`fe-refactor-advisor`) / **haiku**(저비용 탐색 — `fe-explorer`) / **sonnet**(나머지 실행·도구 계열).

### spec 단계
| Agent | 위임 시점 | 모델 | 격리 |
|-------|----------|------|------|
| `fe-analyst` | 요구사항 갭 분석 (6갭 / 7섹션); CLAUDE.md·DESIGN.md·PRODUCT.md·AGENTS.md 병렬 탐색 | opus | 책임 (read-only) |
| `fe-deck-reader` | PPT/기획서 분해 — 다중 슬라이드를 정책·화면·흐름으로 (PDF/PNG 변환 경유) | sonnet | 책임 (read-only) |
| `fe-vision` | (추출) Figma·UI 스크린샷·PDF·PPT(변환) 개별 화면 분석 (Figma URL → `get_metadata`·`get_design_context`·`get_variable_defs`·`get_screenshot`; DESIGN.md Bans anti-slop 점검) · (대조) 구현 스크린샷 ↔ 레퍼런스 시각 충실도 판정 (visual-verdict — Figma=픽셀/PPT=구조, fe-start Phase 4.5) | sonnet | 책임 (read-only) |
| `fe-researcher` | 외부 문서·라이브러리 조사 (Context7 MCP 우선, WebSearch/WebFetch fallback) | sonnet | 도구 (Context7/WebSearch/WebFetch) |
| `fe-architect` | React/TS 아키텍처 자문 — Next.js(RSC 경계) / Vite SPA(TanStack Router·React Router 7·Zustand) + Tailwind v3/v4·shadcn·openapi-fetch (직교 감지) | opus | 책임 (read-only) |

### build 단계
| Agent | 위임 시점 | 모델 | 격리 |
|-------|----------|------|------|
| `fe-explorer` | 코드베이스 탐색 3쿼리 이상 | haiku | 컨텍스트 |
| `fe-test-author` | BDD 시나리오 도출 + TDD Red-Green-Refactor | sonnet | 책임 (구현) |
| `fe-build-fixer` | tsc·린터(ESLint/Biome) 오류 최소 diff 수정 | sonnet | 도구 (Edit+Grep, Write/MultiEdit 금지) |

### review 단계
| Agent | 위임 시점 | 모델 | 격리 |
|-------|----------|------|------|
| `fe-reviewer` | 4축 리뷰 (타입·성능·a11y·품질 — 성능 축에 React 훅 런타임 버그(cleanup 누락·async 경쟁조건·무한루프) 포함, Tailwind 안티패턴·openapi-fetch 패턴·DESIGN.md 디자인 계약(존재 시) 포함) | opus | 책임 (read-only) |
| `fe-a11y-auditor` | a11y 8축 감사 (Color Contrast — Tailwind 팔레트 기준 포함). `--live` 시 Chrome DevTools MCP로 실제 Lighthouse a11y 감사·접근성 트리 스냅샷 병행, 미설치면 정적 분석만 | sonnet | 책임 (read-only) |
| `fe-perf-auditor` | 성능 정밀 감사 — Next.js(RSC·next/image·next/font) / Vite SPA(TanStack loader·RR7 TQ prefetch·fetchpriority·번들) / Tailwind v3/v4(purge·@source·@apply). `--live` 시 Chrome DevTools MCP로 dev 서버 실측(LCP 분해·콘솔·네트워크) 병행, 미설치면 정적 분석만 | sonnet | 책임 (read-only) |
| `fe-test-runner` | 테스트 실행 + 실패 분류 | sonnet | 컨텍스트 |
| `fe-refactor-advisor` | 6차원 리팩토링 분석 + Before/After | opus | 책임 (read-only) |

### PR 단계
| Agent | 위임 시점 | 모델 | 격리 |
|-------|----------|------|------|
| `fe-git-operator` | 커밋 분리·안전한 스테이징 + 본문 작성 (fix=증상·원인·해결 / feat=추가·핵심·영향) | sonnet | 도구 (Write/Edit 금지) |
| `fe-pr-author` | PR 본문 작성 (성격별 🐛/✨ 블록 + 리뷰 포인트 위험순) + `gh pr create` | sonnet | 컨텍스트 + 도구 |

## 워크플로우

**원스톱 자동화**
```
feature.md 작성 → /fe-rail:fe-start feature.md → "구현할까요?" 승인 → "커밋할까요?" 승인 → PR 생성 완료
```

> 재위임이 같은 항목을 3회 반복해도 안 풀리면 자동 진행을 멈추고 진단을 보고하는 예외 STOP 이 한 번 더 걸릴 수 있습니다.

**fe-spec 에서 이어가기 (핸드오프)**
```
/fe-rail:fe-spec → "다음 단계"에서 "풀 자동" 선택 → fe-start 자동 실행 → "커밋할까요?" 승인 → PR
```

> fe-spec 의 "다음 단계" 게이트가 첫 승인("구현할까요?")을 대신하므로 fe-start 는 "커밋할까요?"만 묻습니다 (전체 승인 2회 유지).

**단계별 수동 제어**
```
/fe-rail:fe-spec → /fe-rail:fe-build → /fe-rail:fe-review → git commit && gh pr create
```

## 전제 조건

- Claude Code
- 패키지 매니저 (pnpm / npm / yarn / bun — lock 파일로 자동 감지)
- gh CLI (PR 자동 생성 시)
- TypeScript strict mode (Next.js / Vite SPA)

## 설치 후 권장 설정 (소비자 프로젝트)

플러그인의 agent들은 **소비자 프로젝트의 컨텍스트를 읽어** 동작합니다. 설치 직후 아래를 갖추면 품질이 크게 올라갑니다.

| 항목 | 이유 | 방법 |
|------|------|------|
| **프로젝트 CLAUDE.md** | `fe-analyst`·`fe-architect` 등이 스택·규칙·금지사항을 읽어 추론 — 없으면 빈손으로 분석 (플러그인의 CLAUDE.md는 소비자 세션에 로드되지 않음) | `/init` 또는 `/fe-rail:fe-doc-sync` |
| **Bash 권한** | `fe-git-operator`·`fe-pr-author` 흐름에서 매번 권한 프롬프트 방지 | 자동: 프로젝트 루트에서 `bash <설치경로>/hooks/scripts/setup-permissions.sh`(호스트 감지 → `.claude/settings.local.json` 병합, 확인 1회) · 수동: `.claude/settings.json`의 `permissions.allow`에 `Bash(git *)`·`Bash(gh pr *)` 추가 |
| **MCP (선택)** | `fe-vision`의 Figma 직접 조회, `fe-researcher`의 Context7 문서 조회, `fe-perf-auditor`/`fe-a11y-auditor`의 `--live` 실측 활성화 (미설치 시 각각 로컬 이미지·WebSearch·정적 분석으로 fallback) | Figma: claude.ai 커넥터(`/mcp` → "claude.ai Figma", OAuth) · Context7: 플러그인 설치 · Chrome DevTools: 플러그인 설치. 미설치 시 각 에이전트가 폴백하며 활성화 명령을 그 자리에서 안내(JIT) |
| **검증 스크립트** | Phase 3 자동 검증이 `typecheck`/`lint`/`test` 를, Phase 4.5 완료기준 게이트가 `build`/`e2e`(존재 시)를 사용 | 해당 스크립트 정의 권장 |

## 라이선스

[MIT](LICENSE) © 2026 이승호

## 기반 레퍼런스

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- [Chachamaru127/claude-code-harness](https://github.com/Chachamaru127/claude-code-harness)
- [garrytan/gstack](https://github.com/garrytan/gstack)
