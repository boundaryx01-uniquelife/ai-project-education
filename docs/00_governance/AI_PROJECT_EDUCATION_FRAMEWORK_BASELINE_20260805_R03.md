# AI 프로젝트 교육 통합 프레임워크 기준서

- 작성일: 2026-08-05
- 버전: R03
- 상태: BASELINE_DECIDED
- 프로젝트명: AI 프로젝트 교육 통합 프레임워크
- 영문명: AI Project Education Framework
- 프로젝트 ID: `ai-project-education`
- 로컬 기준 경로: `C:\DEV\ai-project-education`
- GitHub 기준 저장소: `boundaryx01-uniquelife/ai-project-education`
- 기본 배포: GitHub Pages

## 1. 프로젝트 목적

이 저장소는 여러 개의 독립 교육자료를 모아두는 창고가 아니다.

AI를 활용한 프로젝트 교육의 설계 원리, 단계별 교육과정, 실습형 웹포털, 범용 Skill, 예시 프로젝트, 템플릿, 평가도구와 운영 기록을 하나의 체계로 지속적으로 발전시키는 통합 프레임워크이다.

## 2. 교육 목표

학습자가 단순 프롬프트 작성이나 일회성 바이브 코딩을 넘어 다음 전 과정을 경험하도록 한다.

`DEFINE → COLLECT → STRUCTURE → BUILD → TEST → PUBLISH → IMPROVE`

- 문제와 사용자를 정의한다.
- 필요한 자료를 수집하고 출처를 확인한다.
- 자료와 작업 흐름을 구조화한다.
- AI와 템플릿을 활용해 결과물을 제작한다.
- 정상·예외·실패 사례로 검증한다.
- 웹 또는 로컬 패키지로 배포한다.
- 피드백과 오류 기록을 다음 버전에 반영한다.

## 3. 단일 원본 원칙

- 공식 원본은 GitHub 저장소의 `main` 브랜치이다.
- 로컬 폴더는 GitHub 저장소의 작업 사본이다.
- 승인된 결정은 Markdown 문서와 커밋으로 남긴다.
- 레벨별 과정마다 별도 저장소를 만들지 않는다.
- 교육 웹페이지는 하나의 포털 안에서 과정 모듈로 확장한다.
- 플랫폼별 Skill은 공통 핵심을 복제하지 않고 어댑터로 연결한다.
- `_bootstrap`, `_packages` 또는 임시 프로젝트 폴더를 공식 구조에 두지 않는다.

## 4. 통합 저장소 구조

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

## 5. 구성 요소의 역할

### `docs`

프로젝트 헌장, 구조 설계, 결정 기록, 단계별 핸드오프와 운영 문서를 관리한다.

### `curriculum`

수업 시수와 난이도에 따른 실제 교육과정을 관리한다. 모든 레벨은 같은 공통 생명주기와 품질 기준을 사용한다.

### `portal`

교육자가 배포하고 학습자가 직접 사용하는 단일 웹포털이다. 레벨별 수업은 별도 사이트가 아니라 포털 모듈로 추가한다.

### `skills`

ChatGPT, Codex, Claude Code, Antigravity 등에서 재사용할 공통 작업법과 플랫폼별 어댑터를 관리한다.

### `templates`, `examples`, `rubrics`

모든 과정에서 공동으로 사용하는 템플릿, 완성 예시와 평가표를 관리한다.

### `tools`

PowerShell 기반 초기화, 검증, 배포와 릴리스 도구를 관리한다.

## 6. 교육 단계

- LEVEL 1: 3시간 채팅형 미니 에이전트
- LEVEL 2: 4~6시간 배포형 웹 에이전트
- LEVEL 3: 8~12시간 자료 연결형 에이전트
- LEVEL 4: 15시간 이상의 운영형 장기 프로젝트

입문 과정은 공통 구조 70%, 선택 20%, 자유 설계 10%를 기본으로 하며 단계가 높아질수록 자유도를 확대한다.

## 7. 기본 학습 환경

- 정규 수업은 채팅형 AI를 기본으로 한다.
- 공통 설명과 예시는 웹포털에서 제공한다.
- 학습자는 웹포털이 조립한 컨텍스트 패킷을 채팅 AI에 전달한다.
- Codex, Claude Code와 Antigravity는 교사용 제작, 시연 또는 고급 확장에 사용한다.
- MCP는 기본 과정의 필수가 아니라 자료·도구 연결을 다루는 확장 과정으로 둔다.

## 8. GitHub 운영 및 배포

- 기본 브랜치는 `main`이다.
- 실제 변경은 `feature/<topic>` 또는 `docs/<topic>` 브랜치에서 수행한다.
- `main`에는 승인된 기준과 배포 가능한 자료만 둔다.
- GitHub Issues는 오류, 개선안과 수업 피드백 기록에 사용한다.
- GitHub Releases는 수업 버전과 오프라인 패키지 배포에 사용한다.
- GitHub Pages는 단일 교육포털의 기본 배포처로 사용한다.
- 서버 기능이 필요해도 같은 저장소를 유지하고 배포 계층만 확장한다.

## 9. PowerShell 원칙

- 기준 작업 경로는 `C:\DEV\ai-project-education`이다.
- 실행용 `.ps1`의 코드와 문자열은 ASCII 문자만 사용한다.
- 한국어 문서는 UTF-8 파일 또는 Base64 UTF-8 payload로 생성한다.
- Windows PowerShell 5.1과 PowerShell 7 파서 검사를 수행한다.
- 스크립트는 기존 파일을 자동으로 덮어쓰지 않는다.

## 10. 단계별 로드맵

### STAGE 00. 통합 기반 확정

프로젝트 헌장, 저장소 구조, 운영 원칙, 문서 규칙과 최초 포털 배포를 확정한다.

### STAGE 01. 전체 교육과정 체계 설계

교육 대상, 역량, 레벨, 시수, 평가와 자유도 체계를 확정한다.

### STAGE 02. LEVEL 1 시범 과정

3시간 채팅형 미니 에이전트 과정과 교사용·학습자용 자료를 제작한다.

### STAGE 03. 통합 웹포털 MVP

단계형 학습, 프롬프트 조립, 결과 기록, 검사표와 내보내기를 구현한다.

### STAGE 04. LEVEL 2 배포형 과정

4~6시간 웹 에이전트 과정과 GitHub 기반 배포 실습을 제작한다.

### STAGE 05. Skill 패키지

공통 Skill과 ChatGPT, Codex, Claude Code, Antigravity 어댑터를 완성한다.

### STAGE 06. 자료 연결과 MCP 확장

파일, 공개 데이터, 출처, 개인정보, 권한과 MCP 읽기 전용 실습을 설계한다.

### STAGE 07. 운영과 확산

수업 피드백, Release, 기여 방식과 사례 축적 체계를 운영한다.

## 11. 명명 규칙

프로젝트와 저장소 이름은 변경하지 않는다.

- 프로젝트 ID: `ai-project-education`
- 로컬 폴더: `C:\DEV\ai-project-education`
- GitHub 저장소: `boundaryx01-uniquelife/ai-project-education`
- 포털 폴더: `portal`
- 공통 Skill: `skills/ai-project-education`

문서 파일명은 `<DOCUMENT_NAME>_YYYYMMDD.md`를 사용한다. 같은 날짜의 개정본은 `_R02`, `_R03` 순서로 붙인다.

## 12. STAGE 00 완료 조건

- 기준 폴더와 통합 디렉터리 구조가 생성되었다.
- Git 저장소와 GitHub 원격 저장소가 연결되었다.
- `main` 브랜치에 최초 기준 문서와 포털 골격이 저장되었다.
- GitHub Pages 배포가 성공했다.
- 프로젝트 헌장, 결정 기록, 문서 규칙과 STAGE 01 핸드오프가 존재한다.
- 저장소 소유자와 문서 내 기준 계정이 모두 `boundaryx01-uniquelife`로 일치한다.
