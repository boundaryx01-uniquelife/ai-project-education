# STAGE 03 구현 검증 기록

- 작성일: 2026-08-07
- 대상: LEVEL 1 통합 포털 MVP
- 브랜치: `feature/stage-03-level-1-portal`
- 상태: `IMPLEMENTED_PENDING_RUNTIME_VALIDATION`

## 구현 범위

- `portal/modules/level-1-chat-agent/` 신규 구현
- `portal/index.html`에 LEVEL 1 진입 링크 추가
- `portal/assets/styles.css`에 진입 카드 최소 스타일 추가
- `tests/Test-Level1Portal.ps1` 정적 검증 스크립트 추가

## 구현 기능

- INTRO → DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE
- 최소 완료 게이트 자동 확인
- 자료 S1~S3 입력
- 처리 단계 4~6개와 위·아래 순서 이동
- 에이전트 카드 자동 조립
- `AI에게 보낼 작업 묶음(Context Packet)` 생성·복사
- `State Snapshot` 자동 초안·수정
- 정상·경계·실패 테스트
- Markdown 미리보기·복사·다운로드
- localStorage 자동 저장
- 손상 데이터 덮어쓰기 방지와 복구 안내
- 전체 데이터 삭제
- 고대비 라이트 테마와 모바일 순차 레이아웃

## 제외 확인

다음 기능은 추가하지 않았다.

- AI API / API Key
- 로그인
- DB / 서버
- Firebase / Supabase
- MCP
- 자동 웹 검색
- 사용자 행동 추적
- 외부 CDN 의존
- LEVEL 2 기능

## 수행 검증

### PASS

- `data.js`: Node `--check` 문법 검사 통과
- `app.js`: Node `--check` 문법 검사 통과
- Git 비교: 브랜치는 `main` 대비 ahead, behind 0
- 변경 범위: `portal/`, `tests/`와 구현 기록 문서에 한정
- 상대 경로 사용: 모듈의 CSS/JS 및 포털 진입 링크

### CREATED_NOT_EXECUTED_ON_WINDOWS

- `tests/Test-Level1Portal.ps1`
- Windows PowerShell 5.1 로컬 실행 필요

### RUNTIME_VALIDATION_REQUIRED

현재 실행 환경의 Chromium headless가 정상 종료되지 않아 실제 브라우저 클릭 흐름을 자동 검증하지 못했다.

병합 전 로컬에서 최소 다음을 확인한다.

1. 최초 진입 시 INTRO 표시
2. DEFINE 입력 후 새로고침 복구
3. S1~S3 입력 전 COLLECT 미완료
4. STRUCTURE 4개 단계 게이트
5. 정상·경계·실패 TEST 게이트
6. Context Packet 복사
7. State Snapshot 생성
8. Markdown 다운로드
9. 전체 삭제
10. 키보드 단계 이동과 입력

## 판정

`CODE_STATIC_PASS_RUNTIME_LOCAL_REQUIRED`

코드 구현 후보는 준비되었으나 실제 브라우저 런타임 검증 전에는 STAGE 03을 COMPLETE로 선언하지 않는다.
