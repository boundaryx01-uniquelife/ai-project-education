# AI 프로젝트 교육 통합 프레임워크 기준서

- 작성일: 2026-08-05
- 버전: R03
- 상태: BASELINE_PROPOSED
- 프로젝트명: AI 프로젝트 교육 통합 프레임워크
- 영문명: AI Project Education Framework
- 로컬 기준 경로: `C:\DEV\ai-project-education`
- GitHub 기준 저장소: `foruniquelife00/ai-project-education`

## 1. 정정 사항

이 프로젝트에는 별도의 `_bootstrap`, `_packages`, 임시 프로젝트 폴더를 두지 않는다.

초기화 스크립트도 프로젝트 내부의 다음 경로에 저장한다.

`C:\DEV\ai-project-education\tools\setup`

폴더 생성, 문서 생성, Git 초기화, GitHub 저장소 생성과 배포 설정은 모두 PowerShell로 수행한다.

## 2. 프로젝트의 단일 목적

이 저장소는 여러 개의 독립 교육자료를 모아두는 창고가 아니다.

AI를 활용한 프로젝트 교육의 설계 원리, 단계별 교육과정, 실습형 웹포털, 범용 Skill, 예시 프로젝트, 템플릿, 평가도구와 운영 기록을 하나의 체계로 지속적으로 발전시키는 통합 프레임워크이다.

## 3. 단일 원본 원칙

- 공식 원본은 GitHub 저장소의 `main` 브랜치이다.
- 로컬 폴더는 GitHub 저장소의 작업 사본이다.
- 모든 승인 결정은 Markdown 문서와 커밋으로 남긴다.
- 레벨별 과정마다 새로운 저장소를 만들지 않는다.
- 교육 웹페이지도 하나의 포털 안에서 과정 모듈을 확장한다.
- 플랫폼별 Skill은 공통 핵심을 복제하지 않고 어댑터로 연결한다.

## 4. 전체 구조

```text
C:\DEV\ai-project-education
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
├─ docs/
│  ├─ 00_governance/
│  ├─ 01_architecture/
│  ├─ 02_curriculum_design/
│  ├─ 03_platform_design/
│  ├─ 04_operations/
│  ├─ decisions/
│  └─ handoffs/
├─ curriculum/
│  ├─ shared/
│  ├─ level-1-chat-agent/
│  ├─ level-2-web-agent/
│  ├─ level-3-data-agent/
│  └─ level-4-project-agent/
├─ portal/
│  ├─ assets/
│  ├─ modules/
│  └─ index.html
├─ skills/
│  └─ ai-project-education/
│     ├─ SKILL.md
│     ├─ core/
│     └─ adapters/
├─ templates/
├─ examples/
├─ rubrics/
├─ tools/
│  ├─ setup/
│  ├─ validation/
│  └─ release/
├─ tests/
├─ README.md
├─ LICENSE
├─ .gitignore
└─ .gitattributes
```

## 5. 폴더별 책임

### `docs`

프로젝트 헌장, 구조 설계, 결정 기록, 단계별 핸드오프와 운영 문서를 관리한다.

### `curriculum`

수업 시수와 난이도에 따른 실제 교육과정 콘텐츠를 관리한다. 모든 레벨은 공통 생명주기를 사용한다.

`DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE`

### `portal`

교육자가 배포하고 학습자가 직접 사용하는 단일 웹포털이다. 레벨별 수업은 별도 웹사이트가 아니라 포털의 모듈로 추가한다.

### `skills`

ChatGPT, Codex, Claude Code, Antigravity 등에서 재사용할 공통 작업법을 관리한다. 공통 핵심과 플랫폼 어댑터를 분리한다.

### `templates`, `examples`, `rubrics`

모든 과정이 공동으로 사용하는 템플릿, 완성 예시, 평가표를 관리한다. 과정 폴더 안에 같은 자료를 중복 저장하지 않는다.

### `tools`

PowerShell 기반 초기화, 검증, 배포와 릴리스 도구를 관리한다.

## 6. 교육과 웹포털의 관계

교육과정이 원본이고 포털은 이를 전달하는 실행 환경이다.

```text
교육 철학과 기준
        ↓
공통 프로젝트 생명주기
        ↓
레벨별 교육과정
        ↓
예시·템플릿·평가표
        ↓
단일 학습 포털
        ↓
Skill과 플랫폼 어댑터
```

웹포털이 교육과정과 따로 진화하지 않도록 각 포털 모듈은 반드시 대응하는 교육과정 문서를 가진다.

## 7. 단계별 추진 구조

### STAGE 00. 통합 기반 확정

- 프로젝트 헌장
- 디렉터리 구조
- GitHub 저장·배포 기준
- 문서·버전 규칙
- 공통 생명주기
- 최초 저장소와 포털 골격

### STAGE 01. 전체 교육과정 체계 설계

- 교육 대상
- 레벨 체계
- 시수별 완료 조건
- 공통 역량
- 평가 체계
- 자유도 설계

### STAGE 02. LEVEL 1 시범 과정

- 3시간 채팅형 미니 에이전트
- 교사용 진행안
- 학습자 활동
- 예시 프로젝트
- 평가 루브릭

### STAGE 03. 통합 웹포털 MVP

- 단계형 학습 화면
- 프롬프트 조립
- 결과 기록
- 체크리스트
- 내보내기
- GitHub Pages 배포

### STAGE 04. LEVEL 2 배포형 과정

- 4~6시간 웹 에이전트
- 공통 웹 템플릿
- GitHub 기반 배포 실습
- 오프라인 패키지

### STAGE 05. Skill 패키지

- 공통 `SKILL.md`
- ChatGPT 어댑터
- Codex 어댑터
- Claude Code 어댑터
- Antigravity 어댑터

### STAGE 06. 자료 연결과 MCP 확장

- 파일과 공개 데이터
- 출처와 최신성
- MCP 읽기 전용 실습
- 개인정보와 권한

### STAGE 07. 운영과 확산

- 수업 피드백
- 버전별 Release
- 교사 기여 방식
- 오류·개선 Issue
- 교육사례 축적

## 8. GitHub 운영 규칙

- 기본 브랜치는 `main` 하나로 시작한다.
- 실제 작업은 `feature/<stage-or-topic>` 브랜치를 사용한다.
- `main`에는 승인된 기준과 배포 가능한 자료만 둔다.
- GitHub Issues는 오류, 개선안과 수업 피드백 기록에 사용한다.
- GitHub Releases는 수업 버전과 오프라인 패키지 배포에 사용한다.
- GitHub Pages는 단일 교육포털의 기본 배포처로 사용한다.
- 서버 기능이 필요할 때도 같은 저장소를 유지하고 배포 계층만 확장한다.

## 9. 명명 규칙

프로젝트와 저장소 이름은 앞으로 변경하지 않는다.

- 프로젝트 ID: `ai-project-education`
- 로컬 폴더: `C:\DEV\ai-project-education`
- GitHub 저장소: `foruniquelife00/ai-project-education`
- 포털 폴더: `portal`
- 공통 Skill: `skills/ai-project-education`

문서 파일명은 다음 형식을 사용한다.

`<DOCUMENT_NAME>_YYYYMMDD.md`

같은 날짜의 개정본은 `_R02`, `_R03`을 붙인다.

## 10. 초기 완료 조건

다음 조건이 충족되어야 프로젝트가 시작된 것으로 본다.

- 기준 폴더가 PowerShell로 생성되었다.
- 통합 디렉터리 구조가 생성되었다.
- R03 기준서와 결정 기록이 저장되었다.
- Git 저장소가 `main`으로 초기화되었다.
- `foruniquelife00/ai-project-education` 저장소가 생성되었다.
- 최초 커밋과 Push가 완료되었다.
- 단일 포털 골격이 GitHub Pages로 배포되었다.
- 이후 작업을 STAGE별 문서와 브랜치로 이어갈 수 있다.
