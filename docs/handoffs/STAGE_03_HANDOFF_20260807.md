# STAGE 03 구현 핸드오프

- 작성일: 2026-08-07
- 상태: `IMPLEMENTED_PENDING_RUNTIME_VALIDATION`
- 구현 브랜치: `feature/stage-03-level-1-portal`

## 구현 완료 후보

LEVEL 1 정적 포털 MVP 코드가 구현되었다.

주요 파일:

- `portal/modules/level-1-chat-agent/index.html`
- `portal/modules/level-1-chat-agent/styles.css`
- `portal/modules/level-1-chat-agent/a11y.css`
- `portal/modules/level-1-chat-agent/data.js`
- `portal/modules/level-1-chat-agent/app.js`
- `portal/modules/level-1-chat-agent/README.md`
- `tests/Test-Level1Portal.ps1`

포털 홈에는 LEVEL 1 진입 링크가 연결되었다.

## 코드 검증

- JavaScript 문법 검사: PASS
- 저장소 비교: branch ahead / behind 0
- 구현 금지 범위 침범: 확인되지 않음
- 브라우저 실제 실행: `RUNTIME_VALIDATION_REQUIRED`

## 병합 전 로컬 확인

PowerShell:

```powershell
Set-Location "C:\DEV\ai-project-education"
git fetch origin
git switch "feature/stage-03-level-1-portal"
git pull origin "feature/stage-03-level-1-portal"

powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File ".\tests\Test-Level1Portal.ps1"
```

정적 서버:

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

확인 주소:

`http://localhost:8080/modules/level-1-chat-agent/`

## 완료 기준

다음을 확인한 후 STAGE 03 PR을 병합한다.

- 입력 저장·새로고침 복구
- 자료 3건 게이트
- 처리 단계 4개 게이트
- 테스트 3종 게이트
- Context Packet 복사
- State Snapshot 생성
- Markdown 다운로드
- 전체 삭제
- 키보드 기본 사용

병합 후 GitHub Pages에서도 동일한 경로를 다시 확인한다.

## 실제 수업 검증

`FIELD_VALIDATION_REQUIRED` 항목은 유지한다.

- 실제 180분 완주율
- 자료 입력 부담
- Context Packet 이해도
- TEST 완주율
- 학교 PC/모바일 사용성
- 루브릭 평가 일치도
