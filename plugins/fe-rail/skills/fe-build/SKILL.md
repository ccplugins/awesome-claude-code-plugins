---
name: fe-build
description: >-
  React / Next.js / Vite SPA + TypeScript 프로젝트의 프론트엔드 컴포넌트와 페이지를 구현합니다.
  Use when: feature.md 또는 스펙이 승인된 후 구현 시작할 때, 컴포넌트 작성, 페이지 개발.
  Do NOT load for: 스펙 작성, 코드 리뷰, 버그 분석.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Task
  - Agent
---

# FE Build 스킬

승인된 스펙을 기반으로 React/Next.js + Vite SPA + TypeScript 코드를 구현합니다.

## When to Use

- `feature.md` 또는 스펙 문서가 승인된 직후
- 컴포넌트/페이지/훅 신규 개발
- 기존 컴포넌트 기능 추가

## Instructions

### Phase 1 — 사전 확인 + 에이전트 위임

구현 시작 전 반드시 확인:
1. `feature.md` 또는 스펙 문서가 존재하고 승인됐는가?
2. 기술 스택 확인 (package.json 참조)
3. **레포의 정전(canonical) 모범 파일을 먼저 읽고 그 shape 를 복사한다** — 신규 코드는 이 스킬의 산문 예시가 아니라 소비자 레포의 실제 패턴을 1차 소스로 따른다. 데이터 계층은 `src/features/*/api.ts`(쿼리/뮤테이션 형태)·`src/lib/query-keys.ts`(키 팩토리)·`src/lib/api/client.ts`(타입드 클라이언트·인터셉터)를, UI 는 `src/components/ui/*`(shadcn 프리미티브)를 grep·Read 해 동일 컨벤션으로 작성한다. 해당 파일이 없으면 이 스킬의 예시를 폴백으로.

코드베이스 탐색은 직접 하지 않고 에이전트에 위임한다:

| 상황 | 위임 에이전트 |
|------|-------------|
| 3쿼리 이상의 파일·심볼 탐색 필요 | `fe-explorer` — 요약만 반환, 컨텍스트 보호 |
| 테스트 코드 생성 (BDD/TDD) | `fe-test-author` — 시나리오 도출 + 파일 작성 |
| tsc·린터(ESLint/Biome) 오류 수정 | `fe-build-fixer` — 최소 diff 오류 제거 |

### Phase 2 — 구현 순서
반드시 이 순서를 지킵니다:
```

1. 타입 정의 먼저 (types/ 또는 컴포넌트 상단)
2. 비즈니스 로직 분리 (커스텀 훅)
3. 컴포넌트 구현 (UI만 담당, 로직은 분리된 레이어에서)
4. 테스트 작성 (Vitest + RTL)
5. 타입체크 확인 (tsc --noEmit)

```

### Phase 3 — 코딩 규칙

**타입**
```typescript
// ✅ Good
interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (id: string) => void;
}

// ❌ Bad - any 금지
const handleData = (data: any) => {}
```

**데이터 fetch**
```typescript
// ✅ Good - TanStack Query + 중앙 키 팩토리 (인라인 ad-hoc 키 금지)
const { data, isPending, isError } = useQuery({
  queryKey: queryKeys.campaigns.list(params),
  queryFn: () => fetchCampaigns(params),
})

// 생성 API 클라이언트(openapi-fetch) 감지 시 — 자체 백엔드는 타입드 클라이언트 경유:
//   queryFn: async () => { const { data, error } = await api.GET('/campaigns'); if (error) throw ...; return data }

// ❌ Bad - useEffect fetch / 인라인 ad-hoc 키(`['campaigns']`) / 스키마를 as any 로 무마
useEffect(() => {
  fetch('/api/campaigns').then(...)
}, [])
```

**컴포넌트 구조**
```typescript
// ✅ Good - 로직은 훅으로 분리
function CampaignList() {
  const { campaigns, isLoading } = useCampaigns()
  return <Table data={campaigns} />
}

// ❌ Bad - 컴포넌트에 비즈니스 로직 직접 작성
function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const filtered = campaigns.filter(c => c.status === 'active')
  // ... 복잡한 로직들
}
```

**UI 컴포넌트 기준**
- 새 UI 컴포넌트 작성 시 변형 2개 이상 먼저 제안
- **화면 충실도 존중** — feature.md 「화면 흐름」의 등급을 따른다. 와이어프레임/스케치면 배치·구조만 재현하고 색·타이포·간격은 디자인 토큰/시스템 기본값으로(시안에 없는 수치 임의 생성 금지). 고증 시안이면 fe-vision 추출값으로 충실 재현
- 폰트는 프로젝트 DESIGN.md 의 결정을 따른다 (system 폰트 스택을 의도적으로 채택했으면 허용). Next.js 는 next/font 로딩 권장
- shadcn/ui 컴포넌트 우선 활용 — **Vite + shadcn 이면 CLI 실행 전 루트 `tsconfig.json` 에 `baseUrl`+`paths`(`@/*`→`./src/*`) 확인**. 없으면 CLI 가 alias 를 못 풀어 literal `@` 폴더 생성(`paths` 가 `tsconfig.app.json` 에만 있는 게 흔한 원인)
- Tailwind 조건부 클래스는 `cn()` (clsx + tailwind-merge) 사용 — 문자열 직접 조합 금지
- 변수 보간 클래스(`` `bg-${color}-500` ``) 금지 — 정적 매핑 사용

### Phase 4 — 구현 후 자동 검증
구현 완료 후 반드시 실행:
```bash
# PM 감지 (PX=바이너리 실행, npm일 때 npx / PM=스크립트 실행)
PM="npm"; PX="npx"
[ -f "pnpm-lock.yaml" ] && PM="pnpm" && PX="pnpm"
[ -f "yarn.lock" ]      && PM="yarn" && PX="yarn"
{ [ -f "bun.lockb" ] || [ -f "bun.lock" ]; } && PM="bun"  && PX="bun"

# 타입: typecheck 스크립트 우선 (솔루션 tsconfig/references 에서 bare tsc 는 검사 안 함)
if grep -q '"typecheck"' package.json; then $PM run typecheck
elif grep -q '"references"' tsconfig.json 2>/dev/null; then $PX tsc -b
else $PX tsc --noEmit; fi
# 린트: 스크립트가 있을 때만 실행 — 반드시 $PM run lint (npm 에서 'run' 없는 bare lint 호출은 무효)
if grep -q '"lint"' package.json; then $PM run lint; fi
# 테스트: test 스크립트가 있으면 그것만, 없으면 vitest 폴백 (watch 아님 — 비대화형 셸은 run 모드로 동작)
if grep -q '"test"' package.json; then $PM run test; else $PX vitest run; fi
```

**성공 출력은 침묵, 실패만 보고합니다.**

## Anti-patterns
- 타입 먼저 안 잡고 코딩 시작
- 스펙 없이 "대충 이런 방향으로" 구현
- 테스트 없이 완료 선언
- console.log를 코드에 남기기
