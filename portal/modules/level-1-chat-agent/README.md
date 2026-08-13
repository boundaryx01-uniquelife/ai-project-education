# LEVEL 1 에이전트 제작 워크숍

- 위치: `portal/modules/level-1-chat-agent/`
- 기술: HTML5 + CSS + Vanilla JavaScript + localStorage
- 외부 패키지/CDN: 없음

## 인트로

`index.html`

- 프로젝트와 4단계 흐름 설명
- 대상별 서비스 예시 화면
  - 초등: 용돈지킴이
  - 중·고등: 시험기간 플래너
  - 성인: 여행 일정 에이전트

예시는 인트로에서만 보여준다.

## 워크숍

`workshop.html?audience=...`

- 왼쪽: `LIVE MVP`
  - 사용자가 입력한 설계 정보를 요약하는 화면이 아님
  - AI가 실제 생성한 단일 HTML 앱을 sandbox iframe에서 실행
- 오른쪽: `FOLLOW`
  - WEB 활동
  - AI 활동
  - AI가 반환한 HTML 코드 붙여넣기
  - 단계 통과 기준

## 핵심 제작 루프

### 1. MVP 제작

`목표 입력 → 구현 프롬프트 복사 → Claude/ChatGPT가 단일 HTML 생성 → HTML을 포털에 붙여넣기 → LIVE MVP 실행`

1단계의 산출물은 Markdown 문서나 에이전트 설명서가 아니다.
반드시 브라우저에서 실제로 조작 가능한 단일 HTML MVP여야 한다.

### 2. 수정·제약

`LIVE MVP 사용 → 문제·금지조건·재질문조건 기록 → 현재 HTML과 함께 AI에 수정 요청 → 수정 HTML 교체 → 다시 실행`

기존 목표 정보를 다시 작성하지 않는다.

### 3. 검증

- 사용자 검증: LIVE MVP를 직접 조작해 문제 기록
- AI 검증: 선택 사항. 실시하면 제안 채택·기각과 이유를 기록하고, 생략하면 이유와 대체 검증 근거를 기록
- 핵심 메시지: AI 출력도 검증 대상

### 4. 배포 판단

- 로컬 / 웹
- 개인 / 공유
- 브라우저 저장 / DB
- 외부 API·실시간 데이터 필요 여부

마지막은 `완성`이 아니라 다음 개발 범위 결정이다. 최종 HTML과 네 단계 학습 기록 Markdown을 각각 다운로드할 수 있다.

## 실행 안전 경계

AI가 반환한 HTML은 `iframe sandbox="allow-scripts"` 안에서 실행한다.
포털은 srcdoc에 CSP를 주입해 외부 네트워크 연결, 외부 리소스, 객체·프레임 로드를 차단한다.

## 포함하지 않는 기능

- AI API / API Key
- 로그인
- 실제 서버 / DB 구현
- MCP / 자동 웹 검색
- 사용자 행동 추적

## 로컬 실행

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
.\Start-LocalPortal.ps1
```

인트로:

`http://localhost:8080/modules/level-1-chat-agent/`

PowerShell 실행 정책 때문에 차단되면 다음 명령을 사용합니다.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Start-LocalPortal.ps1"
```

## GitHub Pages 배포

`feature/stage-03-level-1-portal` 또는 `main`에 `portal/` 변경이 푸시되면 GitHub Actions가 Pages 배포를 실행합니다.

- 포털: `https://boundaryx01-uniquelife.github.io/ai-project-education/`
- LEVEL 1: `https://boundaryx01-uniquelife.github.io/ai-project-education/modules/level-1-chat-agent/`

처음 한 번은 GitHub 저장소의 **Settings → Pages → Build and deployment**에서 Source를 **GitHub Actions**로 설정해야 합니다.

## 정적 검증

```powershell
Set-Location "C:\DEV\ai-project-education"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tests\Test-Level1Portal.ps1"
```
