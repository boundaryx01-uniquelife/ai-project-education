# STAGE 03 결정 기록

- 작성일: 2026-08-07
- 상태: `PROPOSED_FOR_APPROVAL`

## D03-01

LEVEL 1 포털 MVP 구현 경로는 `portal/modules/level-1-chat-agent/`로 고정한다.

## D03-02

MVP 기술은 HTML5, CSS, Vanilla JavaScript, localStorage로 유지한다.

## D03-03

LEVEL 1 포털은 AI를 직접 실행하지 않고 채팅형 AI에 전달할 Context Packet을 생성하는 학습 작업대로 유지한다.

## D03-04

완료 게이트는 최소 구조만 자동 판정하며 교육적 품질과 루브릭 점수는 사람이 평가한다.

## D03-05

정상·경계·실패 테스트 3종은 PUBLISH 완료의 필수 선행 조건으로 유지한다.

## D03-06

저장 데이터 파싱 실패 시 자동 초기화·덮어쓰기를 하지 않고 복구 안내를 먼저 제공한다.

## D03-07

포털 홈의 LEVEL 1 카드에서 단일 통합 모듈로 진입하도록 한다. 별도 사이트나 저장소를 만들지 않는다.

## D03-08

AI API, 로그인, 데이터베이스, MCP, 사용자 추적과 LEVEL 2 기능은 STAGE 03 MVP에서 제외한다.

## D03-09

현재 구현 후보의 검증 상태는 `CODE_STATIC_PASS_RUNTIME_LOCAL_REQUIRED`로 기록한다.

## D03-10

실제 브라우저 런타임 검증과 GitHub Pages 배포 검증을 통과한 후에만 STAGE 03을 COMPLETE로 확정한다.
