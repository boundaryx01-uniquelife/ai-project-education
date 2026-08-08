# LEVEL 1 포털 MVP

- 모듈: 생활형 미니 AI 에이전트 따라 만들기
- 위치: `portal/modules/level-1-chat-agent/`
- 기술: HTML5 + CSS + Vanilla JavaScript + `localStorage`
- 외부 패키지/CDN: 없음

## 사용자 흐름

1. `index.html`에서 프로젝트 목적과 에이전트 개념을 짧게 확인한다.
2. 대상별 예시 중 하나를 선택한다.
   - 초등: `용돈지킴이`
   - 중·고등: `시험기간 플래너`
   - 성인: `여행 일정 에이전트`
3. 선택값과 함께 `workshop.html?audience=...`로 이동한다.
4. 선택한 예시가 채워진 상태에서 목표 → 판단 기준 → 작동 방식 → 제작 → AI 테스트 → 완성 → 개선 순서로 따라 만든다.

## 파일 역할

- `index.html`: 인트로와 대상 선택 전용
- `workshop.html`: 실제 따라하기 작업 화면
- `data.js`: 단계와 대상별 예시 데이터
- `app.js`: 저장, 게이트, Context Packet, 테스트, Markdown 생성
- `ux-v2.js`: 친화적 단계명, 대상 선택 전달, 화면 단순화
- `styles.css`, `a11y.css`: 작업 화면 스타일과 접근성

## 핵심 기능

- 목표와 결과물이 먼저 보이는 제작 흐름
- 초등·중고등·성인별 실생활 예시
- 판단 정보·기준 최소 3개 기록
- 4~6단계 작동 순서
- `AI에게 보낼 작업 묶음(Context Packet)` 생성·복사
- `State Snapshot`
- 정상·경계·실패 테스트
- Markdown 패키지 생성·복사·다운로드
- 브라우저 자동 저장·복구 안내
- 전체 데이터 삭제

## 포함하지 않는 기능

- AI API / API Key
- 로그인 / 데이터베이스 / 서버 코드
- MCP / 자동 웹 검색
- 사용자 행동 추적
- LEVEL 2 기능

## 로컬 실행

작업 폴더:

`C:\DEV\ai-project-education\portal`

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

인트로:

`http://localhost:8080/modules/level-1-chat-agent/`

직접 작업화면 예시:

`http://localhost:8080/modules/level-1-chat-agent/workshop.html?audience=elementary`

## 정적 검증

작업 폴더:

`C:\DEV\ai-project-education`

```powershell
Set-Location "C:\DEV\ai-project-education"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tests\Test-Level1Portal.ps1"
```
