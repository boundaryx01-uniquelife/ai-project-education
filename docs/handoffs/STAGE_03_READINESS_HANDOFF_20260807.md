# STAGE 03 구현 준비 핸드오프

- 작성일: 2026-08-07
- 이전 단계: STAGE 02 COMPLETE
- 현재 상태: READY_FOR_IMPLEMENTATION_APPROVAL
- 구현 대상: LEVEL 1 통합 포털 MVP

## 기준

- 저장소: `boundaryx01-uniquelife/ai-project-education`
- 로컬: `C:\DEV\ai-project-education`
- 구현 경로: `portal/modules/level-1-chat-agent/`
- 기본 배포: GitHub Pages
- 로컬 작업 기준: Windows PowerShell

## 준비 완료 항목

- LEVEL 1 180분 교육과정 승인
- 포털 모듈 명세 승인
- D02-01~D02-16 DECIDED
- 문서 기반 데스크 시뮬레이션 완료
- Codex 구현 지시서 작성

## 데스크 검증 반영 사항

- 자료 수집은 기본적으로 교사 제공 자료 묶음을 우선한다.
- `Context Packet`은 화면에서 `AI에게 보낼 작업 묶음`으로 먼저 표현한다.
- State Snapshot은 자동 초안을 제공한다.
- 정상·경계·실패 테스트에는 기준 예시를 제공한다.
- 단계별 현재 산출물만 강조하고 최종 패키지는 자동 합성한다.
- 시작 방식은 기준 예시, 부분 변형, 직접 설계의 3가지로 제공하고 부분 변형을 기본값으로 한다.

## 구현 지시서

`docs/03_platform_design/CODEX_LEVEL_1_PORTAL_MVP_INSTRUCTIONS_20260807.md`

## 구현 전 승인 경계

이 핸드오프는 구현 준비 완료를 의미한다. 실제 코드 수정, 새 feature 브랜치 실행, Push와 PR 생성은 STAGE 03 구현 승인 후 수행한다.

## 구현 완료 후 검증

- 로컬 정적 실행
- localStorage 저장·복구
- Context Packet 생성·복사
- State Snapshot 생성
- 테스트 3종 게이트
- Markdown 내보내기
- 전체 데이터 삭제
- 키보드 기본 접근성
- GitHub Pages 하위 경로 호환

## 실제 수업 후 추가 검증

다음 항목은 `FIELD_VALIDATION_REQUIRED`다.

- DEFINE 실제 평균 소요시간
- 자료 3건 입력 부담
- Context Packet 이해도
- 테스트 3종 완주율
- 학교 PC와 모바일 환경 입력 편의성
- 루브릭 평가자 간 일치도
