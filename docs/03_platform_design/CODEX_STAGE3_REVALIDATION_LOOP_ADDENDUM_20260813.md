# Codex Addendum - Stage 3 Validation / Revision / Revalidation Loop

- Date: 2026-08-13
- Project: ai-project-education
- Target branch: `feature/stage-03-level-1-portal`
- Status: APPROVED_FOR_IMPLEMENTATION
- Applies to: LEVEL 1 individualized workshop, Stage 3 only

## 1. Read first

This addendum extends, but does not replace:

1. `docs/02_curriculum_design/AI_AGENT_EDUCATION_FINAL_BASELINE_20260813.md`
2. `docs/03_platform_design/CODEX_INDIVIDUALIZED_LEVEL1_WORKSHOP_INSTRUCTIONS_20260813.md`
3. current files under `portal/modules/level-1-chat-agent/`
4. `tests/Test-Level1Portal.ps1`

Do not change the locked four-stage model.

Stage 3 remains `User validation + AI validation`, but Stage 3 must support an internal iterative loop rather than a single one-time validation event.

## 2. Core correction

Current educational flow must support:

`validate -> decide -> revise -> revalidate -> pass or revise again`

A learner may discover a problem during user validation or AI validation, revise the MVP, and then need to validate the revised MVP again.

Do not force the learner to leave Stage 3 merely because one validation record exists.

Do not treat the first AI validation response as final proof that the MVP is correct.

## 3. Stage 3 internal states

Implement Stage 3 with understandable learner-facing states. Exact labels may vary, but behavior must support at least:

1. `VALIDATION_READY`
   - current MVP exists
   - learner can perform user validation and/or AI validation

2. `ISSUE_FOUND`
   - learner records one or more issues discovered during validation
   - learner decides whether each issue will be fixed now, rejected, or deferred

3. `REVISION_REQUIRED`
   - at least one accepted issue requires code revision
   - portal generates a revision prompt using the current HTML and accepted issues

4. `REVALIDATION_REQUIRED`
   - revised HTML has been pasted back into the portal
   - previous validation cannot automatically count as validation of the revised version
   - portal generates a revalidation prompt focused on both regression and newly introduced failures

5. `VALIDATION_COMPLETE`
   - learner explicitly confirms that the current version has been rechecked
   - required learner reasoning records exist

These state names do not need to appear literally in the UI, but the workflow behavior must exist.

## 4. Required learner-facing Stage 3 loop

### A. User validation

Allow the learner to record at minimum:

- test situation / input
- what actually happened
- problem or feedback found

Allow more than one record, but do not require a fixed large test count.

### B. AI validation

Manual AI-in-the-loop only.

Portal generates a prompt that includes:

- current HTML
- relevant user test findings
- current known constraints
- request for adversarial / failure-oriented validation

AI validation remains optional according to the canonical baseline.

### C. Learner decision

For AI findings, pasted AI text alone must never complete Stage 3.

The learner must decide:

- accepted finding(s)
- rejected finding(s), where applicable
- reason for the decision

If AI validation is skipped:

- skip reason
- substitute validation evidence

must be recorded.

### D. Revision from validation

If accepted findings require code changes, provide a clear action such as:

`검증 결과 반영하여 수정하기`

The portal must generate a revision prompt containing:

- current complete HTML
- user-validation findings selected for revision
- accepted AI findings selected for revision
- constraints that must remain preserved
- instruction to return one complete revised single-file HTML
- no diff / README / plan / explanation

The learner pastes the revised HTML back into the existing HTML handoff area or an equivalent Stage 3 revision handoff area.

The revised HTML must replace the current executable MVP and immediately run in the LIVE preview using the existing sandbox/CSP rules.

## 5. Revalidation prompt

After revised HTML is accepted, provide a separate `재검증용 프롬프트 생성` action.

The revalidation prompt must not ask AI to rewrite the code.

It should follow this intent:

- this HTML is a revised version after previous validation
- verify whether previously discovered problems are actually resolved
- check whether the revision introduced regressions or new failures
- test missing information
- test boundary values
- test conflicting conditions
- test invalid input
- test forbidden-condition violations
- check whether previously working behavior still works

Preferred response structure requested from AI:

`테스트 항목 | 테스트 방법 | 결과(PASS/FAIL) | 발견 문제 | 수정 필요 여부`

and one final overall judgment:

- `PASS`
- `PASS_WITH_MINOR_FIX`
- `FAIL`

Do not depend on the AI's final judgment alone. The learner must still make the completion decision.

## 6. Validation iteration history

Keep a simple iteration history in Stage 3.

Minimum per iteration:

- iteration number, e.g. V1, V2, V3
- user validation summary
- AI validation used or skipped
- accepted/rejected/deferred findings
- learner reason
- whether revision occurred
- whether revalidation occurred
- current status

Do not make the learner write long reports.

A compact card or accordion per iteration is preferred.

Persist iteration history in localStorage using the existing static-browser approach.

## 7. Version identity

When a revision is pasted during Stage 3, increment an internal MVP version number, for example:

- MVP v1: Stage 1 initial executable version
- MVP v2: Stage 2 behavioral revision
- MVP v3+: Stage 3 validation-driven revisions

The UI does not need Git-like complexity.

The purpose is only to make clear that validation findings belong to a specific MVP version.

A validation record for v2 must not silently be treated as proof that v3 was tested.

## 8. Stage 3 completion gate

Stage 3 completion must not require AI validation if the learner explicitly skips it according to the baseline.

Stage 3 can be considered complete only when:

- at least one user validation record exists
- AI validation path is resolved:
  - AI used -> accept/reject reasoning recorded, or
  - AI skipped -> skip reason and substitute evidence recorded
- if a validation-driven revision occurred, the revised version has a revalidation record
- learner explicitly marks the current version as sufficiently validated for the current MVP scope

The Next button must remain clickable.

If Stage 3 requirements are incomplete, clicking Next must explain exactly what remains, rather than silently disabling the button.

## 9. Educational message

Stage 3 UI must visibly communicate both ideas:

> AI output is also something to validate.

and

> If you change the MVP after validation, validate the changed version again.

This is a core learning objective, not merely implementation plumbing.

## 10. Final project package impact

The exported learning package must summarize the validation loop, not only the latest pasted AI text.

Include:

- MVP version(s) involved in Stage 3
- user validation record(s)
- AI validation used or skipped
- accepted/rejected/deferred findings and reasons
- validation-driven revision summary
- revalidation result
- learner's final validation decision

Keep export concise and readable.

## 11. UX guidance

Avoid turning Stage 3 into a long form.

Prefer a compact loop UI such as:

`① 사용자 테스트 -> ② AI 검증(선택) -> ③ 판단 -> ④ 수정 필요? -> ⑤ 재검증 -> 완료`

Possible controls:

- `사용자 테스트 추가`
- `AI 검증 프롬프트 복사`
- `AI 결과 붙여넣기`
- `채택 / 기각 / 보류`
- `검증 결과 반영하여 수정`
- `수정 HTML 붙여넣기`
- `재검증 프롬프트 복사`
- `재검증 결과 기록`
- `현재 버전 검증 완료`

Do not require all controls to be simultaneously expanded on mobile.

Accordion, cards, or step disclosure are acceptable.

## 12. Preserve constraints

Do not add:

- AI API integration
- server
- database implementation
- authentication
- MCP
- CDN dependencies
- automatic external web access

Generated learner HTML must continue to run in the existing restricted sandboxed iframe with blocked remote network access.

## 13. Tests to add or update

Update `tests/Test-Level1Portal.ps1` to check at minimum that Stage 3 implementation includes signals for:

- validation iteration/history state
- validation-driven revision action
- revalidation prompt generation
- revised HTML handoff back to LIVE MVP
- MVP/version identity or equivalent revision counter
- AI accept/reject/skip reasoning
- revalidation requirement after Stage 3 revision
- Stage 3 completion gate does not make AI validation mandatory
- Next button is not silently disabled
- final export includes revalidation/iteration summary

Keep PowerShell executable code and strings ASCII-only and compatible with Windows PowerShell 5.1.

## 14. Runtime acceptance scenario

Manually verify at least this path:

1. enter Stage 3 with an executable revised MVP
2. record one user test and a real problem
3. generate AI validation prompt
4. paste an AI validation response
5. accept at least one finding and record a reason
6. generate a validation-driven revision prompt
7. receive a complete revised HTML from external AI
8. paste it into the portal and confirm LIVE MVP changes
9. verify the portal marks the new version as requiring revalidation
10. generate the revalidation prompt
11. record revalidation result
12. explicitly mark the current version validation complete
13. move to Stage 4
14. export the project package and verify both original validation and revalidation history are represented

Also verify the AI-skip path separately:

- skip AI validation
- record skip reason
- record substitute validation evidence
- complete Stage 3 without being forced to use AI

## 15. Stop conditions

Stop and report rather than inventing a curriculum change if this implementation would require:

- adding a fifth top-level learner stage
- making AI validation mandatory
- removing user validation
- changing the locked final project package principle
- changing LEVEL 1 to require API/server/DB/MCP

The iteration loop belongs inside Stage 3. It must not become a new top-level stage.

## 16. Git rules

- Work only on `feature/stage-03-level-1-portal`.
- Do not merge PR #5.
- Do not push directly to `main`.
- Keep PR #5 open for user runtime review.
- Prefer focused commits.

## 17. Completion report

When finished, report:

- files changed
- Stage 3 loop UX implemented
- completion-gate behavior
- static test result
- runtime scenarios tested
- remaining limitations
- final commit SHA

Do not claim classroom validation.