# Codex 구현 지시서: LEVEL 1 포털 MVP

- 작성일: 2026-08-07
- 프로젝트: `ai-project-education`
- 로컬 기준 경로: `C:\DEV\ai-project-education`
- GitHub: `boundaryx01-uniquelife/ai-project-education`
- 구현 대상: `portal/modules/level-1-chat-agent/`
- 상태: READY_FOR_IMPLEMENTATION_APPROVAL

## 1. 작업 목적

STAGE 00~02에서 확정된 교육체계를 변경하지 않고, LEVEL 1 `근거 기반 수업 프로젝트 설계 미니 에이전트`를 학습자가 직접 수행할 수 있는 정적 웹 모듈로 구현한다.

이 모듈은 AI를 대신 실행하는 서비스가 아니다. 학습자가 7단계 프로젝트 생명주기를 따라 입력하고, 채팅형 AI에 전달할 작업 묶음을 만들고, 테스트·수정·공유 패키지를 기록하는 **학습 작업대**다.

## 2. 구현 전 읽을 기준 문서

반드시 아래 파일을 먼저 읽고 서로 충돌할 경우 더 최근의 승인 문서와 결정 기록을 우선한다.

1. `docs/00_governance/AI_PROJECT_EDUCATION_FRAMEWORK_BASELINE_20260805_R03.md`
2. `docs/02_curriculum_design/AI_PROJECT_EDUCATION_CURRICULUM_BASELINE_20260805.md`
3. `docs/02_curriculum_design/LEVEL_1_PILOT_COURSE_BASELINE_20260805.md`
4. `curriculum/level-1-chat-agent/TEACHER_GUIDE_20260805.md`
5. `curriculum/level-1-chat-agent/LEARNER_WORKFLOW_20260805.md`
6. `curriculum/level-1-chat-agent/EXAMPLE_AGENT_PACKAGE_20260805.md`
7. `rubrics/LEVEL_1_MINI_AGENT_RUBRIC_20260805.md`
8. `docs/03_platform_design/LEVEL_1_PORTAL_MODULE_SPEC_20260805.md`
9. `docs/04_operations/LEVEL_1_MOCK_LESSON_DESK_VALIDATION_20260807.md`
10. `docs/decisions/STAGE_02_DECISION_LOG_20260805.md`

## 3. 권한과 작업 경계

### 허용

- `C:\DEV\ai-project-education` 내부 읽기
- 승인 후 `portal/modules/level-1-chat-agent/` 내부 생성·수정
- 필요 시 `portal/index.html`, `portal/assets/`에 LEVEL 1 진입 링크와 공용 스타일의 최소 수정
- `tests/`에 LEVEL 1 정적 검증 스크립트 또는 체크 파일 추가
- PowerShell을 이용한 로컬 실행·검증

### 금지

- 교육과정 결정 D00/D01/D02 임의 변경
- AI API 연결
- API Key 입력 UI
- 서버 코드
- 로그인
- 데이터베이스
- Firebase/Supabase 등 외부 백엔드
- MCP 연결
- 자동 웹 검색
- 사용자 행동 추적
- 외부 분석 스크립트
- 외부 CDN에 필수 기능 의존
- LEVEL 2 기능 선구현
- 다른 프로젝트 또는 저장소 수정

## 4. Git 작업 원칙

PowerShell을 기준으로 한다.

구현 승인 후 시작 명령의 기준은 다음과 같다.

```powershell
Set-Location "C:\DEV\ai-project-education"
git switch main
git pull origin main
git switch -c "feature/stage-03-level-1-portal"
```

기존 브랜치가 있으면 임의 삭제하거나 강제 재생성하지 않는다.

구현 완료 후 로컬 검증과 `git diff`를 제시한다. Push와 PR 생성은 실행 지시 범위에 포함된 경우에만 수행한다.

## 5. 구현 기술

최초 MVP는 가능한 단순하게 유지한다.

- HTML5
- CSS
- Vanilla JavaScript
- 브라우저 `localStorage`
- Markdown 문자열 생성

빌드 시스템은 필수가 아니다. 현재 저장소의 정적 GitHub Pages 배포 구조에서 그대로 작동해야 한다.

새 프레임워크나 패키지를 도입하려면 구현 전에 필요성을 설명하고 중단한다.

## 6. 파일 구조 권장안

```text
portal/modules/level-1-chat-agent/
├─ index.html
├─ styles.css
├─ app.js
├─ data.js
└─ README.md
```

과도한 파일 분리는 피한다. 모듈이 커질 때만 기능 단위 분리를 검토한다.

## 7. 화면 구조

데스크톱 기준 3영역 구조를 사용한다.

### 왼쪽

- INTRO
- DEFINE
- COLLECT
- STRUCTURE
- BUILD
- TEST
- PUBLISH
- IMPROVE
- 단계 완료 상태

### 가운데

- 현재 단계 목적
- 짧은 설명
- 기준 예시
- 잘못된 예시
- 입력 필드
- 완료 조건

### 오른쪽

- `AI에게 보낼 작업 묶음 (Context Packet)`
- 복사 버튼
- State Snapshot
- 현재 산출물 미리보기
- 교사용 점검 카드

작은 화면에서는 세 영역을 탭 또는 순차 영역으로 전환한다.

## 8. 시작 방식

첫 화면에서 다음을 선택하게 한다.

1. 기준 예시 체험
2. 교과·학년·문제만 바꾸기
3. 직접 주제 설계

기본 선택은 2번이다.

## 9. 단계별 최소 구현

### INTRO

- 단일 프롬프트 방식과 단계형 프로젝트 방식 비교
- 차이점 3개를 체크 또는 짧게 기록

### DEFINE

필드:

- 사용자
- 사용 장면
- 해결할 문제
- 제약
- 성공 조건

범위가 너무 넓은 입력을 기계적으로 판단하는 AI 기능은 만들지 않는다. 대신 범위 축소 체크리스트를 제공한다.

### COLLECT

S1, S2, S3 자료 카드를 기본 제공한다.

각 자료:

- 제목
- 작성 주체
- 작성일 또는 확인일
- 출처 위치
- 핵심 근거
- 제한 또는 주의점

3건 미만이면 완료 처리하지 않는다.

항상 개인정보·민감정보 입력 금지 안내를 표시한다.

### STRUCTURE

- 필수 입력
- 처리 단계 4~6개
- 출력 형식
- 검증 기준
- 중단 조건

처리 단계는 위·아래 이동으로 순서를 조정할 수 있게 한다. 복잡한 드래그 라이브러리는 사용하지 않아도 된다.

### BUILD

현재 입력을 이용해 에이전트 카드를 자동 조립한다.

포함 항목:

- 목적
- 입력
- 근거 자료
- 처리 순서
- 출력 형식
- 검증 규칙
- 중단 조건

동시에 현재 단계용 Context Packet을 생성한다.

### TEST

세 탭을 고정한다.

- 정상
- 경계
- 실패

각 테스트:

- 입력
- 예상 행동
- 실제 행동
- 발견한 문제
- 수정 내용

실패 테스트 기본 예시는 `가짜 출처`, `개인정보`, `근거 부족` 중 선택할 수 있게 한다.

세 종류가 모두 작성되지 않으면 PUBLISH 완료 게이트를 통과시키지 않는다.

### PUBLISH

다음 Markdown을 자동 생성한다.

- 프로젝트 브리프
- 자료 비교표
- 에이전트 카드
- 테스트 기록
- 개선 기록
- 전체 공유 패키지

기능:

- 미리보기
- 클립보드 복사
- `.md` 다운로드

### IMPROVE

- 동료 피드백 3문장
- 수정 전
- 수정 후
- 다음 개선 과제

최종 완료 게이트를 보여준다.

## 10. Context Packet 규칙

사용자에게 문법 작성을 요구하지 않는다.

화면 제목:

`AI에게 보낼 작업 묶음`

작은 보조 문구:

`Context Packet`

최소 구조:

```text
[현재 목표]
[확정된 정보]
[사용할 근거]
[해야 할 작업]
[출력 형식]
[검증 기준]
[금지/중단 조건]
```

현재 단계에 필요하지 않은 과거 원문을 반복 포함하지 않는다.

## 11. State Snapshot 규칙

현재 입력을 이용해 초안을 자동 생성한다.

```text
[확정 결정]
[남은 문제]
[다음 입력]
```

학습자가 수정할 수 있어야 한다.

## 12. localStorage 데이터 모델

단일 프로젝트 객체를 사용한다.

최상위 권장 필드:

```text
version
projectMeta
mode
define
sources
structure
agentCard
tests
publish
improve
progress
updatedAt
```

요구사항:

- 새로고침 후 복구
- 데이터 버전 필드 존재
- 손상된 데이터가 있으면 초기화 강제 대신 복구 안내
- 전체 데이터 삭제 버튼
- 삭제 전 확인
- 개인정보를 저장하지 말라는 상시 안내

## 13. 상태와 완료 게이트

완료 상태는 사용자가 임의 체크하는 방식만 사용하지 않는다.

최소 조건을 코드로 확인한다.

예:

- DEFINE 필수 필드 완료
- 자료 3건 이상
- 처리 단계 4개 이상
- 정상·경계·실패 테스트 각각 존재
- 수정 기록 존재

하지만 교육적 판단을 자동 점수화하지 않는다. 루브릭 평가는 사람의 판단 영역으로 남긴다.

## 14. 접근성

필수:

- 키보드 탐색
- 명확한 `<label>`
- focus 표시
- 충분한 대비
- 버튼에 텍스트 이름
- 색상만으로 상태 구분 금지
- 모바일 최소 대응
- 브라우저 확대 200%에서 핵심 기능 사용 가능

기본 테마는 고대비 라이트다.

## 15. 오류와 복구 UX

다음 상황을 처리한다.

- 필수 입력 누락
- 자료 3건 미만
- 테스트 누락
- 클립보드 권한 실패
- localStorage 사용 불가
- 저장 데이터 파싱 실패
- Markdown 다운로드 실패

오류가 나더라도 입력 데이터를 가능한 유지한다.

## 16. 검증

최소 검증 시나리오:

### T01 최초 진입

빈 저장소에서 정상 초기화되고 INTRO가 보인다.

### T02 저장 복구

DEFINE 입력 후 새로고침해도 값이 유지된다.

### T03 자료 게이트

자료 2건에서는 COLLECT 완료가 되지 않고 3건에서 완료된다.

### T04 단계 구조

처리 단계 3개에서는 미완료, 4개 이상이면 조건을 충족한다.

### T05 테스트 게이트

정상·경계·실패 중 하나라도 없으면 최종 완료가 되지 않는다.

### T06 Context Packet

현재 프로젝트 입력이 반영되고 불필요한 전체 대화 내용은 포함하지 않는다.

### T07 Markdown

내보낸 Markdown에 브리프, 자료, 에이전트 카드, 테스트와 개선 기록이 포함된다.

### T08 전체 삭제

확인 후 저장 데이터가 삭제되고 초기 상태로 돌아간다.

### T09 정적 실행

로컬 정적 서버와 GitHub Pages 하위 경로에서 모두 상대경로가 깨지지 않는다.

### T10 접근성 기본

키보드만으로 주요 단계 이동, 입력, 복사와 내보내기가 가능하다.

## 17. PowerShell 로컬 검증

외부 도구 없이 가능한 검증은 PowerShell로 수행한다.

예시 정적 서버가 필요한 경우 Python이 설치되어 있다면:

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

브라우저에서:

```text
http://localhost:8080/modules/level-1-chat-agent/
```

Python이 없다면 새 런타임을 임의 설치하지 말고 현재 환경에서 가능한 정적 실행 방법을 보고한다.

## 18. 완료 보고 형식

구현 후 다음만 간결하게 보고한다.

1. 생성·수정 파일
2. 구현 기능
3. 수행한 테스트와 결과
4. 미해결 문제
5. `git status --short`
6. `git diff --stat`
7. 다음 승인 필요 항목

## 19. 중단 조건

다음이 필요해지면 임의 구현하지 말고 중단 보고한다.

- 교육과정 기준 변경
- 외부 패키지 설치
- 서버 기능
- 로그인
- DB
- API Key
- 새로운 외부 서비스
- `portal/modules/level-1-chat-agent/` 밖의 광범위한 구조 변경

## 20. 구현 완료 정의

다음이 모두 충족되어야 MVP 구현 완료 후보로 본다.

- 7단계 전체 입력 흐름 작동
- 자동 저장·복구
- Context Packet 생성·복사
- State Snapshot 생성
- 테스트 3종 게이트
- Markdown 전체 내보내기
- 데이터 전체 삭제
- 키보드 기본 접근
- 로컬 정적 실행 성공
- GitHub Pages 경로 호환
- AI API·로그인·DB 없음

이 문서는 구현 지시서이며, 실제 코드 변경은 별도의 STAGE 03 구현 승인 후 시작한다.
