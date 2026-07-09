# 모노레포 지원

## 디렉토리 구조 관례

```
my-monorepo/
├── apps/
│   ├── web/          ← Next.js 앱
│   ├── admin/        ← React + Vite 앱
│   └── mobile-web/   ← React Native Web
├── packages/
│   ├── ui/           ← 공유 컴포넌트
│   ├── utils/        ← 공통 유틸
│   └── types/        ← 공유 타입 정의
└── CLAUDE.md         ← 루트 컨텍스트 (프로젝트별로 별도 작성 권장)
```

## 에이전트 행동 규칙

1. **작업 범위 확인 먼저** — 기능을 구현하기 전에 어느 `app` 또는 `package`에 속하는지 명시한다.
2. **공유 패키지 우선 탐색** — `packages/ui`, `packages/utils` 등 이미 존재하는 공통 모듈을 확인한 후 새 코드를 작성한다.
3. **패키지 경계 존중** — 앱 간 직접 import 금지. 공유 로직은 반드시 `packages/`로 분리한다.
4. **각 앱의 package.json 기준** — 기술 스택 확인 시 루트가 아닌 해당 앱의 `package.json`을 참조한다.

## feature.md 위치

```
apps/web/feature.md      ← 앱별로 분리 작성
apps/admin/feature.md
```
