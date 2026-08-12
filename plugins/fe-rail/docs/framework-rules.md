# 코딩 규칙 (React / Next.js / Vite SPA + Tailwind / shadcn/ui)

> **프레임워크 감지**: 에이전트는 `package.json`을 먼저 읽어 프레임워크를 확인한 후
> 해당 섹션의 규칙만 적용한다. Next.js(`next`) ↔ Vite SPA(`vite`) 섹션이 다르다.
> Vite SPA 의 라우터는 `@tanstack/react-router`(TanStack Router) **또는** React Router 7(`react-router` / `react-router-dom` — 둘 다 v7 유효) 을 지원하며, 설치된 쪽 라우팅 규칙을 적용한다(상태·에셋 규칙은 공통).
> 스타일링(Tailwind + shadcn/ui)은 두 프레임워크 모두에 동일하게 적용되는 **공통 규칙**이다.
> 감지 기준: `tailwindcss` 의존성이 있으면 Tailwind 규칙(`tailwindcss` major 버전으로 **v3 ↔ v4 분기**), `class-variance-authority` + `components/ui/` 가 있으면 shadcn/ui 규칙을 함께 적용한다.

---

## 공통 규칙 (프레임워크 무관)

### 컴포넌트 구조

```typescript
// ✅ 로직은 커스텀 훅으로 분리
function ProductList() {
  const { products, isLoading } = useProducts()
  return <Table data={products} loading={isLoading} />
}

// ❌ 컴포넌트에 비즈니스 로직 직접 작성 금지
function ProductList() {
  const [products, setProducts] = useState([])
  const filtered = products.filter(p => p.status === 'active')
  // ...
}
```

### 데이터 Fetch

```typescript
// ✅ 클라이언트 사이드 데이터 페치는 TanStack Query. 쿼리 키는 중앙 키 팩토리에서 (인라인 ad-hoc 배열 금지)
const { data, isPending, isError } = useQuery({
  queryKey: queryKeys.products.list(params), // 계층형 팩토리 — 무효화 cascade 보장
  queryFn: () => fetchProducts(params),
})

// ❌ useEffect fetch 금지
useEffect(() => {
  fetch('/api/products').then(...)
}, [])

// ❌ 인라인 ad-hoc 키 — 무효화 시 키 불일치
useQuery({ queryKey: ['products'], queryFn: fetchProducts })
```

> 생성된 API 클라이언트 패턴 (감지 시): `package.json` 에 `openapi-fetch`(+`openapi-typescript`) 와 생성된 `schema.d.ts`·클라이언트 모듈이 있으면, 자체 백엔드 호출은 생성 클라이언트 경유가 원칙이다.
>
> ```typescript
> // ✅ 타입드 클라이언트 + 키 팩토리 (canonical shape)
> queryFn: async () => {
>   const { data, error } = await api.GET('/products', { params: { query } })
>   if (error) throw new Error('products 요청 실패')
>   return data
> }
> ```
>
> - 스키마 불일치를 `as any`/`as unknown as T`/`@ts-expect-error` 로 무마 금지 → `pnpm gen:api` 재생성. (경로·필드는 생성 타입이 컴파일타임 검증)
> - 자체 백엔드에 손수 `fetch`/`axios` 지양. 단 외부 API·파일 업로드·SSE/스트리밍은 정당한 예외.
>
> 인증·세션은 `client.use()` 미들웨어 한곳에서 처리한다 — 호출부마다 토큰 부착/401 처리를 재발명하지 않는다. 토큰 부착은 onRequest, 만료(401)는 onResponse:
>
> ```typescript
> // ✅ 클라이언트 생성 직후 1회 등록 — 모든 호출에 적용 (호출부는 api.GET/POST 만)
> api.use({
>   onRequest({ request }) {
>     const token = getToken() // 토큰 저장은 전용 모듈(@/lib/auth/token)로 격리 — 호출부에서 localStorage 직접 접근 금지
>     if (token) request.headers.set('Authorization', `Bearer ${token}`)
>     return request
>   },
>   onResponse({ response }) {
>     if (response.status === 401) { clearToken(); /* 로그인 라우트로 redirect */ }
>     return response
>   },
> })
> ```
>
> - 401 redirect 대상 라우트는 실재해야 한다 — 없는 경로(/login 미정의 등)로 보내면 dead-link. 라우트를 먼저 만들고 연결한다.

### 타입

```typescript
// ✅ 명시적 인터페이스
interface ProductCardProps {
  product: Product
  onSelect: (id: string) => void
}

// ❌ any 타입 금지
const handleData = (data: any) => {}
```

### 환경 변수 (검증 모듈 감지 시)

> 프로젝트에 검증된 env 모듈(예: `src/lib/env.ts`, Zod 파싱)이 있을 때 적용.

```typescript
// ✅ 앱 코드는 검증 모듈의 env 만 사용
import { env } from '@/lib/env'
const base = env.VITE_API_BASE_URL

// ❌ import.meta.env 직접 접근 (검증 우회) — env 모듈 자신은 예외
const base = import.meta.env.VITE_API_BASE_URL
```

### 폼 (React Hook Form + Zod 감지 시)

> `react-hook-form` + `zod`(+`@hookform/resolvers`) 가 있을 때 적용.

```typescript
// ✅ 폼은 RHF + Zod 스키마 (zodResolver) — 검증을 한곳에
const form = useForm<FormValues>({ resolver: zodResolver(schema) })

// ❌ useState 흩뿌린 수동 폼 + 검증 로직 분산
```

### 스타일링 — Tailwind CSS

> `package.json` 에 `"tailwindcss"` 의존성이 있을 때 적용. Next.js / Vite SPA 모두에 동일하게 적용된다.

```typescript
// ✅ 조건부 클래스는 cn() (clsx + tailwind-merge) 으로 조합
import { cn } from '@/lib/utils' // 경로는 components.json 의 aliases.utils 를 따름 (예: '@/lib/cn')

<button
  className={cn(
    'rounded font-medium',
    isActive ? 'bg-primary text-white' : 'bg-transparent text-primary',
    className, // 외부 override 가능
  )}
/>

// ❌ 문자열 직접 조합 — 충돌 시 어떤 클래스가 이기는지 불명확
<button className={`rounded ${isActive ? 'bg-primary' : ''} ${className}`} />

// ❌ 인라인 style 과 Tailwind 혼용 — 우선순위 추적 불가
<div style={{ padding: 16 }} className="p-2" />
```

```typescript
// ✅ 디자인 토큰 우선 — tailwind.config.* 의 theme 확장 사용
<div className="bg-primary text-foreground p-4 rounded-lg" />

// ❌ 임의값 남용 — 토큰이 있는데도 사용
<div className="bg-[#2563EB] text-[#0F172A] p-[16px] rounded-[8px]" />

// ✅ 예외: 디자인 시스템에 없는 일회성 값에만 임의값 허용 (주석으로 사유 명시)
<div className="grid-cols-[200px_1fr_auto]" />
```

```typescript
// ✅ 변수형 클래스는 정적 매핑 — Tailwind JIT 가 인식 가능
const variantClass = {
  primary: 'bg-primary text-white',
  ghost: 'bg-transparent text-primary',
} as const

<button className={variantClass[variant]} />

// ❌ 보간으로 클래스 생성 금지 — Tailwind JIT 가 감지 못 함
<button className={`bg-${color}-500`} />
```

```typescript
// ✅ 반응형은 모바일 우선 (sm → md → lg → xl)
<div className="text-sm md:text-base lg:text-lg" />

// ❌ 데스크탑 기준으로 작성한 뒤 모바일 override
<div className="text-lg md:text-base sm:text-sm" />
```

```typescript
// ✅ dark mode 클래스는 한 줄에 묶어 의도 명확화
<div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" />

// ❌ dark mode 토큰을 별도 컴포넌트로 분기 (런타임 비용)
```

**`@apply` 사용 기준**:
- ✅ 디자인 시스템 전역 패턴(`.btn`, `.card` 등 베이스 클래스)에만 제한적 사용
- ❌ 컴포넌트 내부 1회성 스타일에 사용 금지 — Tailwind 의 의도와 충돌
- ❌ shadcn/ui 컴포넌트를 `@apply` 로 재구성 금지

**content / purge 경로**:
- ✅ 모노레포에서는 `tailwind.config.*` 의 `content` 가 사용처(`apps/*/src/**`, `packages/ui/src/**`) 를 모두 포함해야 한다
- ❌ 동적 문자열로만 사용된 클래스는 purge 됨 — safelist 또는 정적 매핑 필요

> 위 규칙은 v3·v4 공통. 아래는 v4 전용 추가 규칙이다.

### 스타일링 — Tailwind v4 추가 규칙 (감지 시)

> `package.json` 의 `tailwindcss` 가 **major 4 이상**일 때, 위 Tailwind 규칙에 더해 적용한다.
> v4 는 **CSS-first 설정**이라 `tailwind.config.js` 가 아예 없을 수 있다 — 설정·토큰은 CSS 의 `@theme` 에 있다. 먼저 진입 CSS 와 `tailwindcss` 버전을 확인하고 v3/v4 를 판별한 뒤 지적한다.

```css
/* ✅ CSS 진입점 — 단일 import */
@import "tailwindcss";

/* ❌ v3 디렉티브 — v4 에서 동작하지 않음 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```css
/* ✅ 테마 토큰은 CSS @theme 에 정의 (디자인 토큰의 단일 소스) */
@theme {
  --color-primary: oklch(0.62 0.19 260);
  --font-sans: "Pretendard", sans-serif;
}
/* JS config 가 꼭 필요하면 명시적 로드: @config "../tailwind.config.js"; */

/* ❌ v4 인데 tailwind.config.js 의 theme.extend 에만 의존 — 자동 로드 안 됨 */
```

```typescript
// ✅ 그라디언트 유틸 — v4 새 이름
<div className="bg-linear-to-r from-primary to-accent" />
<div className="bg-radial" />  // bg-conic 도 동일

// ❌ v3 이름 — v4 에서 deprecated (마이그레이션 시 rename 대상)
<div className="bg-gradient-to-r from-primary to-accent" />
```

```typescript
// ✅ 이름·스케일 변경된 유틸 (v4 기준)
<div className="shadow-xs rounded-xs outline-hidden shrink-0 grow" />

// ❌ v3 이름 그대로 — 스케일이 한 칸 이동·rename 되어 의도와 다른 결과
//   shadow-sm→shadow-xs, shadow→shadow-sm, rounded-sm→rounded-xs,
//   outline-none→outline-hidden, flex-shrink-0→shrink-0, flex-grow→grow
<div className="shadow-sm rounded-sm outline-none flex-shrink-0 flex-grow" />
```

**content 경로 (v4)**:
- ✅ v4 는 소스를 **자동 감지** — `content` 배열 불필요. 추가 소스는 CSS 에서 `@source "../../packages/ui/src";`
- ❌ v4 인데 v3 식 `content: [...]` 를 `tailwind.config` 에 적고 동작할 거라 가정

**`@apply` (v4 에서 더 제한적)**:
- ✅ 별도 CSS 파일·CSS Module·SFC `<style>` 에서 `@apply` 를 쓰려면 먼저 `@reference "../app.css";` 로 테마를 참조해야 토큰이 인식된다
- ❌ `@reference` 없이 모듈 CSS 에서 `@apply` — 테마 토큰 인식 실패. 애초에 v4 는 유틸 직접 사용을 권장

**빌드 플러그인 (v4)**:
- ✅ Vite: `@tailwindcss/vite` 플러그인 / PostCSS: `@tailwindcss/postcss`
- ❌ v4 에서 `tailwindcss` 를 PostCSS 플러그인으로 직접 등록 (v3 방식 — v4 에서 분리됨)

### 스타일링 — shadcn/ui

> `package.json` 에 `"class-variance-authority"` + `components/ui/` 디렉토리가 있을 때 적용.
> shadcn/ui 는 Tailwind 위에서 동작하므로 위의 **Tailwind 규칙을 상속**한다.

```typescript
// ✅ shadcn 컴포넌트(components/ui/)는 CLI로 추가 후 프로젝트가 소유 — 도메인 확장은 래핑 권장
// 외부에서 래핑하여 도메인별 컴포넌트로 확장
import { Button as ShadcnButton } from '@/components/ui/button'

export function PrimaryButton({ children, ...props }: Props) {
  return (
    <ShadcnButton variant="default" size="lg" {...props}>
      {children}
    </ShadcnButton>
  )
}

// △ 재테마 목적의 무분별한 소스 수정은 지양(CLI 재추가 시 충돌). 단 의도적 커스터마이징은 프로젝트 재량
```

```typescript
// ✅ variant 정의는 cva() 로 — 타입 추론 + Tailwind 클래스 정적 분석 가능
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('rounded font-medium transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-primary/90',
      ghost: 'bg-transparent text-primary hover:bg-primary/10',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

type ButtonProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// ❌ variant 마다 if-else / switch 로 클래스 분기 — cva() 사용
```

> **Vite 환경 설치 시 주의**: shadcn CLI 의 `@/` alias 해석은 split tsconfig 함정이 있다 — 루트 `tsconfig.json` 에 `paths` 가 없으면 CLI 가 alias 를 못 풀고 literal `@` 폴더를 만든다. → 아래 **Vite + React SPA 전용 규칙 › shadcn/ui CLI — alias 해석** 참조.

---

## Next.js App Router 전용 규칙

> `package.json`에 `"next"` 의존성이 있을 때만 적용한다.

### RSC / Client 경계

```typescript
// ✅ 인터랙션 없는 컴포넌트는 Server Component 기본
async function ProductPage() {
  const products = await fetchProducts()
  return <ProductList products={products} />
}

// ✅ 상태·이벤트 필요할 때만 'use client'
'use client'
function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  return <button onClick={() => setAdded(true)}>...</button>
}

// ❌ 필요 없는데 'use client' 남용 금지
```

### 이미지 / 폰트

```typescript
// ✅ next/image priority 설정 (LCP 요소)
<Image src="/hero.webp" alt="..." priority width={1200} height={600} />

// ✅ next/font로 폰트 로드
import localFont from 'next/font/local'
const pretendard = localFont({ src: './fonts/pretendard.woff2' })

// ❌ <img> 태그 직접 사용 금지
// △ 폰트: next/font 로딩 권장. 단 프로젝트 DESIGN.md 가 system 폰트 스택을 의도적으로 채택했다면 그 결정을 따른다 (일괄 금지 아님)
```

---

## Vite + React SPA 전용 규칙

> `package.json`에 `"vite"` 의존성이 있을 때 적용한다.
> 라우터는 `@tanstack/react-router`(TanStack Router) **또는** React Router 7(`react-router` 또는 `react-router-dom`) — **설치된 쪽 라우팅 규칙만** 적용한다. 상태 관리(Zustand)·에셋 규칙은 라우터와 무관한 공통 규칙이다.

### 라우팅 (TanStack Router)

> `package.json` 에 `"@tanstack/react-router"` 가 있을 때 적용.

```typescript
// ✅ createRootRoute / createRoute로 타입 안전 라우트 정의
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: RootLayout })
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$id',
  component: ProductPage,
})

// ✅ useParams는 라우트 객체에서 직접 — 타입 추론 보장
const { id } = productRoute.useParams()

// ❌ react-router-dom의 useParams 사용 금지 (타입 손실)
// ❌ 라우트 파일에 비즈니스 로직 직접 작성 금지 (컴포넌트로 분리)
```

```typescript
// ✅ 라우트 loader로 데이터 사전 로드 (waterfall 방지)
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$id',
  loader: ({ params }) => queryClient.ensureQueryData(productQueryOptions(params.id)),
  component: ProductPage,
})

// ❌ 컴포넌트 마운트 후 fetch (loader 대신 useEffect)
```

### 라우팅 (React Router 7)

> `package.json` 에 `"react-router"` **또는** `"react-router-dom"` 의 major 가 **7 이상**이고 `"@tanstack/react-router"` 가 **없을 때** 적용. (`react-router-dom` 이 v6 이하면 레거시 — 이 섹션 대상 아님)
> **핵심 원칙: React Router 는 라우팅·레이아웃만 담당, 서버 데이터는 TanStack Query 가 단독 소유한다.**

```typescript
// ✅ 라우팅은 RR7, 서버 데이터는 컴포넌트/훅에서 useQuery — 단일 소스
import { useParams } from 'react-router'

function ProductPage() {
  const { id } = useParams()
  const { data, isLoading } = useQuery(productQueryOptions(id))
  return <ProductDetail product={data} loading={isLoading} />
}

// ❌ RR7 loader/action 에서 직접 데이터 fetch — TQ 캐시와 소유권이 갈려 이중 캐시·동기화 문제
const router = createBrowserRouter([
  { path: '/products/:id', loader: ({ params }) => fetchProduct(params.id) },
])
// loader 를 꼭 써야 하면 TanStack Query 에 위임만:
//   loader: ({ params }) => queryClient.ensureQueryData(productQueryOptions(params.id))
```

```typescript
// ✅ v7 은 react-router(정식 단일 패키지) 또는 react-router-dom(이를 재export 하는 호환 패키지) 둘 다 유효.
//    프로젝트가 쓰는 한 쪽으로 일관되게 import. 신규 코드는 기존 코드의 import 출처를 따른다.
import { useParams, Link, Outlet } from 'react-router-dom' // 프로젝트가 react-router-dom 을 쓰면 이대로
// 또는: import { useParams, Link, Outlet } from 'react-router'   // react-router 를 쓰면 이대로

// ❌ 한 프로젝트/파일에서 react-router 와 react-router-dom 을 혼용 (import 출처 혼선)
import { Link } from 'react-router'
import { useParams } from 'react-router-dom'
```

```typescript
// ✅ 데이터 모드(createBrowserRouter)로 중첩 라우트·Outlet 레이아웃 구성, 로직은 컴포넌트로 분리
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Outlet 으로 자식 렌더
    children: [{ path: 'products/:id', element: <ProductPage /> }],
  },
])

// ❌ 라우트 정의 파일에 비즈니스 로직 직접 작성 (컴포넌트로 분리)
```

```typescript
// ✅ RR7 useParams 는 string | undefined — 사용처에서 좁혀 검증
const { id } = useParams()
if (!id) return <NotFound />

// ❌ non-null 단언으로 무검증 사용
const { id } = useParams()
useQuery(productQueryOptions(id!)) // 런타임에 undefined 가능
```

### 상태 관리 (Zustand)

```typescript
// ✅ 도메인별 slice로 분리, devtools 미들웨어 적용
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'cart' }
  )
)

// ✅ 셀렉터로 구독 범위 최소화 (불필요한 리렌더링 방지)
const items = useCartStore((s) => s.items)

// ❌ 스토어 전체 구독
const store = useCartStore()

// ❌ 서버 상태(API 응답)를 Zustand에 저장 — TanStack Query 캐시 사용
```

### 이미지 / 에셋

```typescript
// ✅ Vite의 정적 에셋 import — 번들 해시 자동 적용
import heroImage from '@/assets/hero.webp'
<img src={heroImage} alt="..." loading="lazy" decoding="async" />

// ✅ LCP 이미지는 fetchpriority="high"
<img src={heroImage} alt="..." fetchpriority="high" />

// ❌ public/ 경로 하드코딩 (캐시 무효화 불가)
<img src="/assets/hero.webp" alt="..." />
```

### shadcn/ui CLI — alias 해석 (vite + shadcn 감지 시)

> `vite` + shadcn(`class-variance-authority` + `components/ui/`) 환경에서 적용. **Next.js 는 단일 `tsconfig.json` 에 `paths` 가 있어 해당 없음.**
> shadcn CLI(`npx shadcn add ...`)는 `components.json` 의 alias(`@/components` 등)를 실제 경로로 풀 때 **루트 `tsconfig.json` 의 `compilerOptions.paths` 를 읽고, `references` 로 연결된 `tsconfig.app.json` 까지 따라가지 않는다.** Vite `react-ts` 템플릿의 루트 tsconfig 는 `files: []` + `references` 만 있고 `paths` 가 없어, CLI 가 alias 를 못 풀고 **literal `@/` 폴더**(`./@/components/ui/...`)에 파일을 생성한다.

```jsonc
// ✅ 루트 tsconfig.json — shadcn 리졸버가 읽도록 baseUrl + paths 추가
//    (files: [] 라 실제 컴파일엔 영향 없음 — 순전히 CLI 의 alias 해석용)
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}

// ❌ 루트엔 references 만, paths 는 tsconfig.app.json 에만 → CLI 가 @/ 못 풀고 literal @ 폴더 생성
```

```typescript
// ✅ @/ → ./src 매핑은 세 곳이 모두 정렬되어야 일관 (shadcn 공식 vite 가이드 기준)
//   1) 루트 tsconfig.json : shadcn CLI 리졸버용 (위 — 흔히 빠지는 조각)
//   2) tsconfig.app.json  : tsc 타입 체크용 (보통 이미 있음 → 그래서 앱은 빌드됨)
//   3) vite.config.ts     : 번들러 런타임 해석용
import path from 'path' // @types/node 필요
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

**증상·복구**:
- literal `@` 폴더가 생겼다면 → 내용물을 `src/` 하위 대응 경로로 이동(`@/components/ui/*` → `src/components/ui/*`, 같이 생긴 `@/lib/utils.ts` → `src/lib/utils.ts`)하고 `@` 폴더 삭제. import 는 `@/...` 그대로라 코드 수정 불필요.
- ❌ 루트 tsconfig 에 `paths` 를 넣지 않고 CLI 만 재실행 — 같은 증상 반복.
