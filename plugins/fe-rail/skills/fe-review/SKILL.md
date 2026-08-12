---
name: fe-review
description: >-
  구현된 프론트엔드 코드를 다각도로 검토합니다.
  Use when: 구현 완료 후 커밋 전, PR 생성 전, 코드 품질 확인이 필요할 때.
  Do NOT load for: 스펙 작성, 신규 기능 구현.
allowed-tools:
  - Read
  - Bash
  - Task
  - Agent
---

# FE Review 스킬

구현된 코드를 타입·성능·a11y·품질 4개 축으로 병렬 검토합니다.

## When to Use

- 구현 완료 직후
- 커밋 전 마지막 품질 게이트
- PR 생성 전

## Instructions

### Phase 1 — 에이전트 위임

리뷰는 직접 수행하지 않고 전담 에이전트에 위임한다:

| 에이전트 | 역할 | 위임 조건 |
|---------|------|---------|
| `fe-reviewer` | 타입·성능·a11y·품질 4축 기본 리뷰 | 항상 |
| `fe-a11y-auditor` | WCAG AA 정밀 감사 | fe-reviewer에서 접근성(a11y) BLOCK/WARN 발생 시 |
| `fe-perf-auditor` | 번들·Image·Font·Tailwind purge 정밀 감사 (Next.js / Vite SPA 공통) | fe-reviewer에서 성능 BLOCK/WARN 발생 시 |
| `fe-test-runner` | 테스트 실행·실패 분류 | 항상 (스택트레이스는 에이전트 내부에서 처리) |
| `fe-refactor-advisor` | 리팩토링 방향 분석 | 명시적 요청 시 |

모든 에이전트는 READ-ONLY — 메인 세션이 결과를 받아 수정 여부를 결정한다.

### Phase 2 — 리뷰 결과 보고

`fe-reviewer` 에이전트의 출력을 그대로 전달한다. 형식:

```
## 코드 리뷰 결과

### BLOCK (커밋 전 반드시 수정)
- [축] file:line — 문제
  - Before: ...
  - After: ...

### WARN (권장 수정)
- [축] file:line — 문제

### INFO (참고)
- [축] file:line — 내용

---
요약: BLOCK N개 / WARN N개 / INFO N개
BLOCK 0이면 "커밋 준비 완료", 있으면 "N개 수정 후 재검토"
```

BLOCK 항목이 있으면 수정 후 에이전트 재위임합니다.
