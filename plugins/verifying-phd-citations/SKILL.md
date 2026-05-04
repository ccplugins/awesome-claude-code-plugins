---
name: verifying-phd-citations
description: Verifies and formats APA 7 Korean academic citations across 14 source types, augments DOIs via CrossRef, and applies CopyKiller 99-rule avoidance. Use when the user requests APA 인용 검증, 참고문헌 양식 확인, CrossRef DOI 보강, 박사 논문 인용, or CopyKiller 회피.
type: skill
---

# PhD Citation Verifier (APA 7 한국어 + CrossRef)

## 0단계 사전 확인
- 자료 종류 (학술논문·단행본·학위논문·웹문서·정부보고서 등 14종)
- 본문 인용 vs 참고문헌 vs 둘 다
- 학회 (KCI 표준 vs APA 공식 7판 — 약간 차이)

## 1단계 — 입력 파싱
- 사용자가 입력한 인용 1건 → 저자·연도·제목·출처 추출

## 2단계 — CrossRef DOI 검증
- `https://api.crossref.org/works?query.bibliographic=...`
- DOI 자동 보강 (APA 7 의무)
- 저자 수 3+ → et al. 즉시 적용

## 3단계 — 14종 양식 정확 출력
- 학술논문 / 단행본 / 단행본 챕터 / 학위논문 / 학회발표 / 보고서 / 웹문서 / 신문기사 / 법령 / 통계 / 영상 / 인터뷰 / 데이터셋 / AI 생성

## 4단계 — CopyKiller 회피 99 룰 검증
- 직접 인용 6어절+ 따옴표 + 페이지
- 패러프레이즈 (저자, 연도)
- 재인용 (원저, 연도, 재인용: 저자, 연도)
- 블록 인용 40단어+ 들여쓰기

## 5단계 — 검토 요청
- 누락 정보 (DOI·페이지·출판사) 한 줄 후속 질문

## 추측 금지
- DOI 없으면 "CrossRef 미발견" 명시 / 임의 생성 X
- 출판사·연도 불명 자료는 사용자 확인 요청

## 무기고 페어
- memory/reference_apa7_korean_citation_2026.md
- memory/feedback_phd_copykiller_avoidance.md
- skills/content-creation/academic-citation-verifier.md
