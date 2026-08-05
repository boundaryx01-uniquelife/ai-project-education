# STAGE 02 핸드오프

- 작성일: 2026-08-05
- 단계 상태: DESIGN_COMPLETE_PENDING_APPROVAL
- 다음 단계: LEVEL 1 포털 모듈 구현 또는 시범 수업 검증 준비

## 작성된 산출물

- `docs/02_curriculum_design/LEVEL_1_PILOT_COURSE_BASELINE_20260805.md`
- `curriculum/level-1-chat-agent/TEACHER_GUIDE_20260805.md`
- `curriculum/level-1-chat-agent/LEARNER_WORKFLOW_20260805.md`
- `curriculum/level-1-chat-agent/EXAMPLE_AGENT_PACKAGE_20260805.md`
- `rubrics/LEVEL_1_MINI_AGENT_RUBRIC_20260805.md`
- `docs/03_platform_design/LEVEL_1_PORTAL_MODULE_SPEC_20260805.md`
- `docs/decisions/STAGE_02_DECISION_LOG_20260805.md`

## 제안된 핵심 기준

- 180분 안에 공통 7단계 생명주기를 한 번 완주한다.
- 산출물은 문제 정의서부터 테스트·공유 패키지까지 연결한다.
- 기준 예시는 과학 탐구 수업이지만 참가자는 교과와 문제를 바꾼다.
- 자료 3건 이상과 출처 기록을 필수로 한다.
- 정상·경계·실패 테스트를 모두 수행한다.
- 평가 점수와 별도로 개인정보, 가짜 출처, 테스트 생략과 단일 프롬프트 제출을 필수 실패 조건으로 둔다.
- 포털은 AI를 직접 호출하지 않고 채팅에 전달할 Context Packet을 만든다.
- 초기 포털은 정적 웹과 localStorage만 사용한다.

## 승인 후 선택할 다음 작업

### 경로 A. 포털 MVP 구현

`portal/modules/level-1-chat-agent/`에 다음 기능을 구현한다.

- 7단계 진행 화면
- 단계별 입력 양식
- Context Packet 조립과 복사
- State Snapshot
- 테스트 3종 기록
- Markdown 내보내기
- 로컬 저장·삭제

이 경로는 Codex 구현 지시서와 테스트 기준을 먼저 작성한 후 실행한다.

### 경로 B. 웹 구현 전 수업자료 검증

Markdown과 간단한 입력 양식으로 1차 모의 수업을 진행해 다음을 검증한다.

- 180분 시간 배분
- 학습자의 입력 부담
- 자료 3건 비교의 난이도
- Context Packet 이해도
- 테스트 3종 수행 가능성
- 루브릭 판정의 일관성

권장 순서는 `간이 모의 검증 → 포털 MVP 구현`이다.

## 구현 전 금지 사항

- 승인 없이 포털에 AI API를 연결하지 않는다.
- 사용자 로그인 또는 데이터베이스를 추가하지 않는다.
- LEVEL 2 기능을 LEVEL 1 모듈에 미리 넣지 않는다.
- 학습자 개인정보를 수집하는 교사용 대시보드를 만들지 않는다.
- 특정 채팅 서비스 UI에 맞춰 자료 구조를 고정하지 않는다.

## 승인 방법

STAGE 02 결정안 D02-01부터 D02-16까지 검토 후 승인한다. 승인되면 단계 상태를 `COMPLETE`로 바꾸고 간이 모의 검증 자료 또는 포털 MVP 구현 지시서를 제작한다.
