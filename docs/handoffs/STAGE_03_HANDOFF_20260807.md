# STAGE 03 구현 핸드오프

- 작성일: 2026-08-07
- UX 개정일: 2026-08-08
- 상태: `USER_FEEDBACK_APPLIED_PENDING_RUNTIME_REVIEW`
- 구현 브랜치: `feature/stage-03-level-1-portal`

## 현재 사용자 흐름

1. `index.html`에서 프로젝트 설명을 본다.
2. 초등 / 중·고등 / 성인 중 하나를 선택한다.
3. `workshop.html?audience=...`로 이동한다.
4. 왼쪽 SAMPLE을 보고 오른쪽 FOLLOW만 작성한다.
5. 각 단계에서 WEB 활동과 AI 활동을 구분해 진행한다.
6. 최종 에이전트 지침을 복사하고 테스트·개선 기록을 포함한 패키지를 저장한다.

## 주요 파일

- `portal/modules/level-1-chat-agent/index.html`
- `portal/modules/level-1-chat-agent/workshop.html`
- `portal/modules/level-1-chat-agent/workshop-v3.css`
- `portal/modules/level-1-chat-agent/workshop-v3.js`
- `portal/modules/level-1-chat-agent/data.js`
- `portal/modules/level-1-chat-agent/README.md`
- `tests/Test-Level1Portal.ps1`

이전 복잡한 작업 화면용 `app.js`, `styles.css`, `ux-v2.js`, `a11y.css`는 제거했다.

## 대상별 따라하기

- 초등: 용돈지킴이
- 중·고등: 시험기간 플래너
- 성인: 여행 일정 에이전트

## 화면 원칙

- 인트로와 실제 작업 분리
- SAMPLE / FOLLOW 2열
- 한 화면 한 핵심 과제
- 필수 정보만 기본 노출
- 보조 설명은 접기
- 만드는 방식 선택 없음
- WEB / AI 활동을 색과 블록으로 분리
- 별도 AI 사이드패널 없음
- 단계 마지막 완료 확인 강조
- 최종 에이전트 지침 바로 복사 가능

## 병합 전 로컬 확인

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

인트로:

`http://localhost:8080/modules/level-1-chat-agent/`

초등 워크숍:

`http://localhost:8080/modules/level-1-chat-agent/workshop.html?audience=elementary`

중·고등 워크숍:

`http://localhost:8080/modules/level-1-chat-agent/workshop.html?audience=secondary`

성인 워크숍:

`http://localhost:8080/modules/level-1-chat-agent/workshop.html?audience=adult`

## 병합 전 판단 질문

- 완성 결과 미니 데모가 제작 목표를 바로 보여주는가
- 왼쪽 샘플을 보고 오른쪽 작성에 집중할 수 있는가
- 한 화면의 정보량이 충분히 줄었는가
- WEB 활동과 AI 활동의 경계가 명확한가
- 최종 에이전트 지침을 복사해 실제 새 채팅에서 쓸 수 있는가

병합 후 GitHub Pages에서도 동일 흐름을 다시 확인한다.
