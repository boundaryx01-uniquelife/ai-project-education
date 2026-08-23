# STAGE 03 구현 검증 기록

- 작성일: 2026-08-07
- UX 개정일: 2026-08-08
- 대상: LEVEL 1 통합 포털 MVP
- 브랜치: `feature/stage-03-level-1-portal`
- 상태: `USER_FEEDBACK_APPLIED_PENDING_RUNTIME_REVIEW`

## 현재 구현 구조

- 인트로: `portal/modules/level-1-chat-agent/index.html`
- 따라하기: `portal/modules/level-1-chat-agent/workshop.html`
- 단순화 스타일: `workshop-v3.css`
- 단순화 로직: `workshop-v3.js`
- 대상별 예시 데이터: `data.js`
- 정적 검증: `tests/Test-Level1Portal.ps1`

## 사용자 피드백 반영

- 첫 화면과 실제 제작 화면 분리
- 초등 / 중·고등 / 성인 선택 후 바로 따라하기 진입
- 작업 화면은 SAMPLE / FOLLOW 2열
- 선택 방식 재질문 제거
- 필수 정보만 기본 노출
- 보조 설명은 접힌 참고 영역
- 각 단계에서 WEB 활동과 AI 활동을 별도 강조 블록으로 구분
- AI 상호작용용 별도 사이드 패널 제거
- 최종 에이전트 지침을 바로 복사 가능
- 단계별 마지막 완료 확인 유지

## 완성 결과 미니 데모

워크숍 왼쪽 SAMPLE 영역에서 대상별 완성 결과의 형태를 직접 조작해 볼 수 있다.

- 초등: 용돈·가격·필수지출을 넣고 구매 판단 결과 확인
- 중·고등: 시험까지 남은 날·공부 가능 시간·과목을 넣고 계획 형태 확인
- 성인: 여행 일수·예산·인원·취향을 넣고 일정 형태 확인

이 데모는 AI 자체를 흉내 내는 것이 아니라, 학습자가 최종 산출물의 지향점을 먼저 이해하게 하는 로컬 정적 예시다.

## 학습자 화면 6단계

1. 목표
2. 판단정보
3. 작동순서
4. 에이전트 생성
5. AI 테스트
6. 완성·개선

내부 교육 생명주기 DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE는 유지한다.

## 제외 확인

- AI API / API Key 없음
- 로그인 없음
- DB / 서버 없음
- MCP 없음
- 자동 웹 검색 없음
- 사용자 행동 추적 없음
- 외부 CDN 필수 의존 없음
- LEVEL 2 기능 없음

## 정적 검증 범위

`Test-Level1Portal.ps1`은 다음을 확인하도록 개정했다.

- 인트로의 3개 대상별 워크숍 링크
- `workshop-v3.css`, `workshop-v3.js`, `data.js` 상대 경로
- SAMPLE / FOLLOW 구조
- WEB / AI 구분 블록
- 미니 데모 함수
- 6단계 학습자 구조
- 에이전트 지침 생성
- AI 요청문 생성·복사
- 최종 패키지 생성
- localStorage
- 외부 fetch 호출 없음

PowerShell 스크립트는 ASCII-only로 유지한다.

## RUNTIME_VALIDATION_REQUIRED

브라우저 실제 사용 검토는 로컬에서 수행한다.

주요 검토 포인트:

1. 인트로에서 대상 선택이 즉시 이해되는가
2. 워크숍 진입 후 SAMPLE / FOLLOW 구조가 한눈에 보이는가
3. 왼쪽 미니 데모가 최종 결과물의 지향점을 보여주는가
4. 한 화면에서 작성할 내용이 과도하지 않은가
5. WEB과 AI 활동이 혼동되지 않는가
6. 최종 에이전트 복사가 자연스러운가

## 판정

`USER_FEEDBACK_APPLIED_PENDING_RUNTIME_REVIEW`

로컬 검토와 이후 GitHub Pages 검증 전에는 STAGE 03을 COMPLETE로 선언하지 않는다.
