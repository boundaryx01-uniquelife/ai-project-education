# LEVEL 1 포털 MVP

- 모듈: 근거 기반 수업 프로젝트 설계 미니 에이전트
- 위치: `portal/modules/level-1-chat-agent/`
- 기술: HTML5 + CSS + Vanilla JavaScript + `localStorage`
- 외부 패키지/CDN: 없음

## 구현 기능

1. INTRO → DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE 흐름
2. 단계별 최소 완료 게이트 자동 확인
3. `AI에게 보낼 작업 묶음(Context Packet)` 생성·복사
4. `State Snapshot` 자동 초안·수정
5. 정상·경계·실패 테스트 기록
6. 전체 Markdown 생성·복사·다운로드
7. 브라우저 자동 저장·복구 안내
8. 전체 데이터 삭제
9. 데스크톱 3영역, 작은 화면 순차 레이아웃
10. 키보드 탐색과 기본 접근성

## 의도적으로 포함하지 않은 기능

- AI API / API Key
- 로그인 / 데이터베이스 / 서버 코드
- MCP / 자동 웹 검색
- 사용자 행동 추적
- LEVEL 2 기능

## 로컬 실행

PowerShell 작업 폴더:

`C:\DEV\ai-project-education\portal`

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

브라우저:

`http://localhost:8080/modules/level-1-chat-agent/`

Python이 없다면 새 런타임을 임의 설치하지 않고 현재 환경에서 사용 가능한 정적 서버를 사용한다.

## 정적 검증

작업 폴더:

`C:\DEV\ai-project-education`

```powershell
Set-Location "C:\DEV\ai-project-education"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tests\Test-Level1Portal.ps1"
```
