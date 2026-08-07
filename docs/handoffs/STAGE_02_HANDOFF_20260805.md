# STAGE 02 핸드오프

- 작성일: 2026-08-05
- 승인일: 2026-08-07
- 단계 상태: COMPLETE
- 다음 단계: STAGE 03 통합 포털 MVP 구현 준비

## 완료 사항

- 180분 LEVEL 1 시범 과정 구조를 확정했다.
- 교사용 진행안과 학습자 워크플로를 확정했다.
- 과학 탐구 수업 기준 예시 에이전트 패키지를 확정했다.
- LEVEL 1 평가 루브릭과 필수 실패 조건을 확정했다.
- 포털 모듈의 기능 범위와 저장·내보내기 기준을 확정했다.
- D02-01부터 D02-16까지 2026-08-07 사용자 승인으로 DECIDED 처리했다.

## 정식 산출물

- `docs/02_curriculum_design/LEVEL_1_PILOT_COURSE_BASELINE_20260805.md`
- `curriculum/level-1-chat-agent/TEACHER_GUIDE_20260805.md`
- `curriculum/level-1-chat-agent/LEARNER_WORKFLOW_20260805.md`
- `curriculum/level-1-chat-agent/EXAMPLE_AGENT_PACKAGE_20260805.md`
- `rubrics/LEVEL_1_MINI_AGENT_RUBRIC_20260805.md`
- `docs/03_platform_design/LEVEL_1_PORTAL_MODULE_SPEC_20260805.md`
- `docs/decisions/STAGE_02_DECISION_LOG_20260805.md`

## 다음 단계 원칙

권장 순서는 다음과 같다.

1. 문서 기반 데스크 시뮬레이션으로 180분 흐름과 입력 부담을 검증한다.
2. 실제 수업에서만 확인 가능한 항목을 `FIELD_VALIDATION_REQUIRED`로 분리한다.
3. 검증 결과를 Codex 구현 지시서에 반영한다.
4. STAGE 03에서 `portal/modules/level-1-chat-agent/`만 구현한다.
5. 구현 결과를 로컬 정적 실행과 GitHub Pages에서 검증한다.

## STAGE 03 구현 범위

- 7단계 진행 화면
- 단계별 입력 양식
- Context Packet 생성·복사
- State Snapshot 생성
- 정상·경계·실패 테스트 기록
- Markdown 내보내기
- localStorage 저장·복구·전체 삭제
- 교사용 점검 안내
- 키보드 접근성과 고대비 라이트 기본 화면

## 구현 제외 범위

- AI API 직접 호출
- GitHub 로그인
- 데이터베이스
- 실시간 교사 대시보드
- MCP 연결
- 자동 웹 검색
- 공동 편집
- LEVEL 2 기능

## 구현 승인 경계

STAGE 02 승인으로 교육과정과 모듈 명세는 확정되었다. 실제 코드 구현은 STAGE 03 구현 지시서 검토 후 별도로 실행한다.
