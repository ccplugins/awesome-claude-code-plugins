---
name: fe-doc-sync
description: >
  이 플러그인이 설치된 사용자 프로젝트(예: Vibe App)의 코드 구조·기술 스택·
  워크플로우 변화를 종합 스캔하여 해당 프로젝트의 CLAUDE.md / README.md 를
  최신 상태로 유지합니다. 새 라우트·컴포넌트·의존성·앱/패키지 추가, 폴더 구조
  개편, 프레임워크 전환, npm script 변경, 환경 변수 변동까지 점검 대상입니다.
allowed-tools:
  - Read
  - Bash
  - Edit
  - Write
  - Task
  - Agent
---

# fe-doc-sync — 사용자 프로젝트 문서 동기화 스킬

이 스킬은 **fe-rail 플러그인 자체가 아니라, 이 플러그인을 설치한 사용자 프로젝트**
(예: Vibe App, 모노레포 등)에서 호출됩니다.
호출 시점의 작업 디렉토리(cwd)를 기준으로 프로젝트 전반을 스캔해
해당 프로젝트의 `CLAUDE.md` / `README.md` 가 실제 코드와 일치하도록 동기화합니다.

> **중요**: 사용자 프로젝트에 `CLAUDE.md` 또는 `README.md` 가 없다면 생성을 제안한다.
> 단, 새 파일을 임의로 만들지 말고 Phase 4 수정안 → Phase 5 승인 절차를 거친다.

---

## Phase 1: 프로젝트 식별 및 전체 스캔

### (A) 프로젝트 타입 감지

`package.json` 을 읽어 프레임워크와 구조를 판별한다.

```bash
# 루트 + 모노레포 앱들의 package.json 위치
fd -t f -e json --max-depth 4 --hidden -E node_modules -E .next -E dist 'package.json' . 2>/dev/null \
  || find . -maxdepth 4 -name package.json -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/dist/*'

# 워크스페이스 여부
cat package.json 2>/dev/null | grep -E '"workspaces"|"packageManager"'
```

판별 매트릭스:

| package.json 의존성 | 판별 |
|--------------------|------|
| `next` | Next.js 앱 (App Router 여부는 `app/` vs `pages/` 존재로 추가 판별) |
| `vite` + `@tanstack/react-router` | Vite SPA (TanStack Router) |
| `vite` + (`react-router` 또는 `react-router-dom`) v7 | Vite SPA (React Router 7) — 데이터는 TanStack Query 단독 소유 |
| `vite` + `react-router-dom` v6 이하 | Vite SPA (React Router 레거시) |
| `workspaces` 필드 존재 + `apps/`·`packages/` | 모노레포 |
| `react-native` | RN Web (참고만, fe-rail 주 대상 아님) |

### (B) 프로젝트 구조 스캔

```bash
# 핵심 디렉토리 트리 (깊이 3까지)
fd -t d --max-depth 3 -E node_modules -E .next -E dist -E .git . 2>/dev/null \
  || find . -maxdepth 3 -type d -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/dist/*' -not -path '*/.git/*'

# 라우트 파일 카운트
# - Next App Router
fd 'page\.(tsx|ts|jsx|js)$' app 2>/dev/null | wc -l
# - Next Pages Router
fd '\.(tsx|ts|jsx|js)$' pages 2>/dev/null | wc -l
# - TanStack Router
fd '\.(tsx|ts)$' src/routes 2>/dev/null | wc -l

# 주요 디렉토리 카운트
for d in components hooks lib services stores api features; do
  count=$(fd -t f --max-depth 5 . "$d" 2>/dev/null | wc -l | tr -d ' ')
  [ "$count" != "0" ] && echo "$d: $count"
done

# 모노레포면 apps/ packages/ 목록
ls -1 apps/ packages/ 2>/dev/null
```

### (C) 기술 스택 키 의존성

```bash
# 상태관리·데이터·UI 핵심 라이브러리
cat package.json | grep -oE '"(next|vite|@tanstack/react-router|react-router|@tanstack/react-query|zustand|jotai|redux|@reduxjs/toolkit|tailwindcss|@radix-ui|shadcn|class-variance-authority|vitest|jest|playwright|cypress)[^"]*":\s*"[^"]+"'
```

### (D) 변경 컨텍스트 (보조)

```bash
# 워킹트리 + 최근 커밋의 변경 파일
{ git diff HEAD --name-only 2>/dev/null; git log --name-only --pretty=format: -10 2>/dev/null; } \
  | sort -u | grep -vE '^(node_modules|\.next|dist|build)/'
```

수집할 정보:
- 프로젝트 타입 (Next App/Pages, Vite SPA, 모노레포)
- 라우트·페이지 수 및 주요 경로
- 컴포넌트·훅·서비스 디렉토리 구성
- 핵심 의존성 및 버전
- npm scripts (`build`, `dev`, `test`, `lint`, `typecheck`)
- 환경 변수 (`.env.example` 키 목록)
- 모노레포면 apps/packages 목록과 각각의 역할

---

## Phase 2: 프로젝트의 현재 문서 읽기

`CLAUDE.md`와 `README.md` 가 존재하면 전체를 읽어 **현재 문서화된 내용**을 파악한다.

```bash
ls -la CLAUDE.md README.md AGENTS.md DESIGN.md PRODUCT.md 2>/dev/null
```

> AGENTS.md 단일 소스 패턴 주의: CLAUDE.md 가 @AGENTS.md 만 담은 스텁(몇 줄)이면 컨벤션의 단일 소스는 AGENTS.md 다. 이때 스택표·디렉토리 트리 등을 CLAUDE.md 스텁에 끼워 넣지 말고 AGENTS.md 를 동기화 대상으로 삼는다(스텁은 건드리지 않음). DESIGN.md(디자인 계약)·PRODUCT.md(제품/브랜드)·biome.json 은 있으면 함께 점검, 없으면 건너뛴다.

체크 대상:
- 프로젝트 개요·기술 스택 표
- 디렉토리 구조 설명
- 라우트·페이지 목록
- 핵심 컴포넌트·도메인 모듈
- 실행 방법 (install·dev·build·test)
- 환경 변수 설명
- 모노레포면 apps/packages 매트릭스

**파일이 없으면**: 누락 항목으로 보고하고 Phase 4에서 신규 생성안을 제시한다 (사용자 승인 필요).

---

## Phase 3: 종합 갭 분석

코드 실제 상태와 문서 내용을 대조하여 **불일치 항목**을 식별한다.
사용자 프로젝트 관점에서 다음 차원을 점검한다.

| 차원 | 코드 상태 예시 | 문서 점검 포인트 | 조치 |
|------|---------------|------------------|------|
| 프로젝트 타입 | next 13 → 14 마이그레이션 | README 헤더의 버전·스택 표기 | 동기화 |
| 라우팅 | 새 페이지 `app/products/[id]` 추가 | 페이지 목록·사이트맵 | 추가 |
| 라우팅 | 페이지 삭제 | 문서 잔존 | 삭제 |
| 의존성 | Zustand 추가 | 상태관리 섹션 누락 | 추가 |
| 의존성 | 라이브러리 교체 (redux→zustand) | 구버전 설명 잔존 | 수정 |
| 디렉토리 구조 | `features/` 도입 | 문서의 폴더 트리 구버전 | 동기화 |
| 컴포넌트 | 디자인 시스템 디렉토리 신설 | "UI 컴포넌트" 섹션 누락 | 추가 |
| 환경 변수 | `.env.example` 키 추가/삭제 | README의 ENV 표 | 동기화 |
| npm scripts | 새 `test:e2e` 추가 | 실행 방법 섹션 | 추가 |
| 모노레포 | 새 `apps/admin` 추가 | apps 매트릭스 누락 | 추가 |
| 모노레포 | 새 `packages/ui` 추가 | 공유 패키지 표 누락 | 추가 |
| 테스트 | Vitest→Jest 전환 | 테스트 섹션 도구명 | 수정 |
| 린터 | ESLint→Biome 전환 | lint 도구·명령(`pnpm check`/`biome ci`) | 수정 |
| 빌드 출력 | `out/` → `dist/` | 배포 가이드 경로 | 수정 |

**원칙**: 사용자 프로젝트의 코드가 진실이다. 문서가 다르면 문서를 고친다.
fe-rail 플러그인 자체의 내용(spec→build→review 워크플로우 등)은 사용자 프로젝트 문서에
끼워 넣지 않는다.

---

## Phase 4: 수정안 출력 (승인 전 반드시 먼저 출력)

아래 형식으로 각 파일별 수정 diff 를 출력한다.

```
## 문서 동기화 보고서

### 프로젝트 식별
- 타입: Next.js App Router / Vite SPA / 모노레포
- 라우트 수: N
- 핵심 스택: react@x, next@y, tanstack-query@z, zustand@w
- 모노레포 구성: apps/(web, admin), packages/(ui, utils)  ← 해당 시

### 요약
- 감지된 불일치: N개 항목
- 수정 필요 파일: CLAUDE.md / README.md
- 신규 생성 제안: (해당 시) CLAUDE.md

---

### [CLAUDE.md] 수정안

**이유:** Zustand 의존성이 추가됐으나 상태관리 섹션 없음

\`\`\`diff
  ## 기술 스택
  - Next.js 14 (App Router)
  - TanStack Query
+ - Zustand (클라이언트 상태)
\`\`\`

---

### [README.md] 수정안

**이유:** `pnpm test:e2e` 스크립트 추가됐으나 실행 방법 누락

\`\`\`diff
  ## 실행
  pnpm dev
  pnpm test
+ pnpm test:e2e   # Playwright E2E
\`\`\`
```

---

## Phase 5: 사용자 승인 요청

수정안 출력 후 반드시 묻는다:

> 위 수정안을 CLAUDE.md와 README.md에 적용할까요?

- **승인** → Phase 6 실행
- **거절** → 종료. 파일 수정 없음.
- **일부 승인** → 승인된 항목만 적용

---

## Phase 6: 수정 적용

Edit 도구로 각 파일의 해당 위치에만 최소한으로 삽입·수정한다.

**원칙:**
- 기존 내용 구조는 그대로 유지
- 표 삽입 시 형식(컬럼 너비 등)을 기존 행에 맞춤
- 삭제된 항목은 명시적으로 제거
- 한 번에 한 파일씩 수정하고 결과를 확인
- 신규 생성(파일이 없던 경우)은 Phase 5에서 별도 승인된 경우에만 Write

적용 완료 후:
```
✅ CLAUDE.md 업데이트 완료 (N줄 추가/N줄 삭제)
✅ README.md 업데이트 완료 (N줄 추가/N줄 삭제)
```

---

## 품질 기준

| 항목 | 기준 |
|------|------|
| 완전성 | 모든 라우트·페이지가 문서의 사이트맵/라우트 목록과 일치 |
| 완전성 | package.json 의 핵심 의존성이 문서의 기술 스택 표에 존재 |
| 완전성 | npm scripts 가 README 실행 방법에 모두 기재됨 |
| 완전성 | `.env.example` 키가 README ENV 표에 존재 |
| 완전성 | 모노레포면 apps/packages 가 빠짐없이 표에 존재 |
| 정확성 | 의존성 버전·이름이 package.json 과 일치 |
| 정확성 | 디렉토리 트리가 실제 폴더 구조와 일치 |
| 간결성 | 추가 설명은 1줄 이내 — 자명한 내용 반복 금지 |
| 격리 | fe-rail 플러그인 자체(스킬·훅·에이전트 이름)는 사용자 문서에 끼워 넣지 않음 |

---

## 주의

- **수정 전 반드시 Phase 4 출력 → Phase 5 승인** 순서를 지킨다.
- 승인 없이 파일을 수정하지 않는다.
- 사용자 프로젝트의 비즈니스 도메인(제품명·도메인 용어·정책)은 임의로 만들어내지 않는다.
  코드·기존 문서에서 확인된 내용만 반영한다.
- fe-rail 플러그인 자체의 워크플로우 다이어그램, 스킬·훅·에이전트 표 등은
  사용자 프로젝트 문서에 삽입하지 않는다.
