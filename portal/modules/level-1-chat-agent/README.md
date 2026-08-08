# LEVEL 1 에이전트 제작 워크숍

- 위치: `portal/modules/level-1-chat-agent/`
- 기술: HTML5 + CSS + Vanilla JavaScript + localStorage
- 외부 패키지/CDN: 없음

## 화면 구조

### `index.html`

인트로 전용.

- 프로젝트 설명
- 에이전트 개념 설명
- 대상 선택
  - 초등: 용돈지킴이
  - 중·고등: 시험기간 플래너
  - 성인: 여행 일정 에이전트

### `workshop.html?audience=...`

실제 따라하기 전용.

- 왼쪽: SAMPLE
- 오른쪽: FOLLOW
- 각 단계에서 웹페이지 활동과 생성형 AI 활동을 시각적으로 분리

## 학습자용 4단계

1. MVP 제작
   - 사용자, 문제, 원하는 결과, 필수 입력만 정해 첫 작동 버전 제작
2. 수정·제약
   - 실제 사용 후 고칠 점, 반드시 할 일, 금지 조건, 재질문 조건 추가
3. 검증
   - 사용자 검증과 AI 기반 실패 검증을 분리
4. 배포 판단
   - 로컬/웹, 공유 범위, 저장 방식, DB·외부 API 필요 여부 판단

마지막 단계는 '완성'이 아니라 다음 개발 단계의 범위와 기술을 결정하는 단계다.

## 샘플 원칙

왼쪽 상단은 단순 입력 예시가 아니라 실제 제품처럼 조작해 볼 수 있는 미니 프리뷰를 제공한다.

각 단계의 이전 입력을 다시 작성하지 않는다. MVP 이후에는 수정 내용과 검증 결과만 추가한다.

## 내부 공통 생명주기

`DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE`

학습자 화면에서는 실전 제작 경험에 맞게 4개의 큰 단계로 묶어 제시한다.

## 포함하지 않는 기능

- AI API / API Key
- 로그인
- 서버 / 데이터베이스 실제 구현
- MCP / 자동 웹 검색
- 사용자 행동 추적
- LEVEL 2 기능

## 로컬 실행

```powershell
Set-Location "C:\DEV\ai-project-education\portal"
python -m http.server 8080
```

인트로:

`http://localhost:8080/modules/level-1-chat-agent/`

## 정적 검증

```powershell
Set-Location "C:\DEV\ai-project-education"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tests\Test-Level1Portal.ps1"
```
