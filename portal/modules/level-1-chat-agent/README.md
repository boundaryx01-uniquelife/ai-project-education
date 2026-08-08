# LEVEL 1 포털 MVP

- 위치: `portal/modules/level-1-chat-agent/`
- 기술: HTML5 + CSS + Vanilla JavaScript + `localStorage`
- 외부 패키지/CDN: 없음

## 화면 구조

### 인트로

`index.html`

- 프로젝트 목적과 에이전트를 짧게 설명한다.
- 초등 / 중·고등 / 성인 중 하나를 선택한다.
- 선택 후 대상별 따라하기 워크숍으로 이동한다.

### 따라하기 워크숍

`workshop.html?audience=elementary|secondary|adult`

워크숍은 두 영역만 사용한다.

- 왼쪽 `SAMPLE`
  - 선택한 대상의 완성 결과 미니 데모
  - 현재 단계 샘플
  - 추가 설명은 접힌 참고 영역
- 오른쪽 `FOLLOW`
  - 웹페이지에서 할 일
  - 생성형 AI에서 할 일
  - 단계 마지막 완료 확인

학습자에게 보이는 단계는 6개다.

1. 목표
2. 판단정보
3. 작동순서
4. 에이전트 생성
5. AI 테스트
6. 완성·개선

내부 교육 생명주기 DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE는 이 6개 화면 안에서 유지한다.

## 대상별 예시

- 초등: 용돈지킴이
- 중·고등: 시험기간 플래너
- 성인: 여행 일정 에이전트

## UX 원칙

- 인트로와 제작 화면 분리
- 워크숍에서 만드는 방식 선택을 다시 묻지 않음
- SAMPLE / FOLLOW 2열
- 한 화면 한 핵심 과제
- 필수 정보만 기본 노출
- 보조 설명은 접기
- WEB 활동과 AI 활동을 별도 강조 블록으로 구분
- 별도 AI 사이드 패널 없음
- 최종 에이전트 지침을 바로 복사

## 핵심 기능

- 대상별 실제 작동 형태를 보여주는 로컬 미니 데모
- 단계별 AI 요청문 자동 조립 및 복사
- 에이전트 지침 자동 조립
- 정상 / 애매 / 실패 테스트 기록
- 최종 에이전트 지침 복사
- 전체 패키지 Markdown 저장
- 브라우저 자동 저장

## 포함하지 않는 기능

- AI API / API Key
- 로그인 / 데이터베이스 / 서버 코드
- MCP / 자동 웹 검색
- 사용자 행동 추적

## 로컬 실행

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

인트로:

`http://localhost:8080/modules/level-1-chat-agent/`

초등 워크숍:

`http://localhost:8080/modules/level-1-chat-agent/workshop.html?audience=elementary`

## 정적 검증

```powershell
Set-Location "C:\DEV\ai-project-education"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tests\Test-Level1Portal.ps1"
```
