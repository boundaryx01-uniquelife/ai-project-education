# Codex Instructions - Individualized LEVEL 1 Workshop

- Date: 2026-08-13
- Project: ai-project-education
- Target branch: feature/stage-03-level-1-portal
- Status: APPROVED_FOR_IMPLEMENTATION

## 1. Read first

Use these as the implementation baseline, in this priority order:

1. `docs/02_curriculum_design/AI_AGENT_EDUCATION_FINAL_BASELINE_20260813.md` — canonical implementation baseline
2. `docs/02_curriculum_design/claude_reference_20260813/HANDOFF_CLAUDE_TO_CODEX_20260813.md` — Claude handoff/reference
3. `docs/02_curriculum_design/claude_reference_20260813/AI_AGENT_EDUCATION_CLAUDE_FINAL_20260813.md` — Claude final-structure reference
4. `docs/02_curriculum_design/claude_reference_20260813/AI_AGENT_LESSON_PLANNING_CLAUDE_NOTES_20260813.md` — earlier planning context
5. `docs/03_platform_design/CODEX_LEVEL_1_PORTAL_MVP_INSTRUCTIONS_20260807.md`
6. current files under `portal/modules/level-1-chat-agent/`
7. `tests/Test-Level1Portal.ps1`

If any Claude reference wording conflicts with the canonical baseline, follow `AI_AGENT_EDUCATION_FINAL_BASELINE_20260813.md`.

In particular, Stage 3 is locked as follows:
- AI validation is optional.
- If AI validation is performed, accept/reject decisions and reasons are required.
- If AI validation is skipped, skip reason and substitute validation evidence are required.

Do not silently rewrite historical STAGE 02 decision documents.

## 2. Goal

Refactor the current LEVEL 1 portal so that it supports individualized learner projects while preserving the four-stage flow:

1. MVP production
2. Refinement and constraints
3. User validation and AI validation
4. Next-development decision

The learner must be able to begin from a representative example or their own topic, then produce and iterate one runnable single-file HTML MVP.

## 3. Stage 1 completion gate

The current gate must not accept a document merely because it contains valid HTML.

The portal must teach and check the intended concept:

`input -> decision/rule -> output`

### Required UX

Add a learner self-check near the Stage 1 completion area:

- changing an input changes the output
- the change follows a rule or condition
- the MVP does more than echo the input

Do not attempt brittle static code analysis to prove semantic correctness.

Use learner confirmation plus the existing runnable-HTML gate.

Suggested gate:

- runnable HTML detected
- learner explicitly confirms all three self-check items

The Next button must remain clickable. If requirements are missing, show a clear message describing exactly what is missing. Do not silently disable the button.

## 4. Stage 2 requirements

Stage 2 must focus on behavioral refinement, not design polish.

Required learner record:

- problem discovered while actually using the MVP
- behavioral or constraint change made

At least one meaningful constraint-based revision must be confirmed before Stage 2 completion.

Examples of valid changes:

- must-do rule
- must-not-do rule
- missing-input behavior
- boundary condition
- conflicting-input handling
- safer fallback behavior

A cosmetic-only change must not be presented as satisfying the learning requirement.

The AI refinement prompt must include the current complete HTML and request one complete revised HTML file, not a diff, README, design note, or Markdown specification.

## 5. Stage 3 requirements

Stage 3 has two tracks.

### A. User validation

Provide a simple record for at least one actual use/test:

- test or situation
- what happened
- problem or feedback

The exact number of user tests must remain flexible.

### B. AI validation

Keep manual AI-in-the-loop.

Do not add AI API integration.

Flow:

1. portal generates validation prompt
2. learner copies it to a free external AI chat
3. learner receives a validation response
4. learner records what to accept or reject
5. learner records why

AI validation is optional.

If AI validation is used, require:

- accepted suggestion(s)
- rejected suggestion(s), where applicable
- decision reason

If AI validation is skipped, require:

- skip reason
- substitute validation method or evidence

The UI must visibly teach:

`AI output is also something to validate.`

Do not treat pasted AI text itself as completion. The learner decision is the important artifact.

## 6. Stage 4 requirements

Stage 4 is not another coding stage.

Provide clear decisions for:

- keep local or publish to web
- sharing scope
- browser storage need
- database need
- external API/current-data need
- one or more desired next functions

Generate a concise architecture/development prompt from these decisions.

The learner only needs to decide the next development boundary. They do not need to implement it.

## 7. Individualization UX

The portal must support both:

- example modification
- free-topic project

Representative examples remain:

- elementary: allowance guard
- secondary: exam planner
- adult: travel itinerary agent

Do not force every learner to build one of these.

Add or preserve a clear path that allows the learner to replace the example with their own:

- agent/project name
- intended user
- problem
- desired result
- required inputs
- rules/conditions

The prompt generated in Stage 1 must reflect only the learner's current project information, with example processing hints used as optional scaffolding rather than hidden fixed behavior.

## 8. Final project package

Add a final export/summary that contains:

1. project identity and goal
2. final runnable HTML source or a clear way to export it
3. Stage 2 refinement record
4. Stage 3 validation record and AI accept/reject reasoning or skip record
5. Stage 4 next-development decision

Prefer Markdown export for the learning record.

If practical within the existing static scope, also provide a separate `.html` download/export for the runnable MVP.

No ZIP generation is required unless it is trivial and dependency-free.

## 9. Preserve current constraints

Do not add:

- server
- authentication
- database implementation
- Firebase/Supabase
- AI API key
- MCP
- automatic web search
- remote CDN/library dependency
- analytics/tracking

Generated learner HTML must continue to execute in a sandboxed iframe with restrictive CSP and no remote network access.

## 10. Implementation scope

Allowed primary files:

- `portal/modules/level-1-chat-agent/workshop.html`
- active workshop CSS/JS assets
- `portal/modules/level-1-chat-agent/data.js`
- module README
- `tests/Test-Level1Portal.ps1`
- implementation report under docs if useful

Keep changes focused. Do not redesign the entire portal shell unless necessary for the four-stage UX.

## 11. Testing

Update `tests/Test-Level1Portal.ps1` to check at minimum:

- four stages remain present
- active workshop asset references are valid
- runnable HTML preview remains sandboxed
- network CSP remains blocked
- no portal `fetch(` call
- no external CDN dependency
- Stage 1 self-check exists
- Next button is not silently disabled by completion gates
- Stage 2 behavioral revision fields exist
- Stage 3 AI accept/reject or skip reasoning exists
- Stage 4 next-development decisions exist
- project-package export exists
- individualized/free-topic fields exist

Keep the PowerShell test script Windows PowerShell 5.1 compatible and ASCII-only in executable code and strings.

## 12. Runtime acceptance scenario

Before calling the implementation complete, manually test at least one full path:

1. choose the secondary exam-planner example
2. modify it into a personally defined project or continue with the example
3. generate Stage 1 prompt
4. get complete HTML from an external AI chat
5. paste HTML into the portal
6. verify the live MVP responds to input and produces rule-based output
7. confirm Stage 1 self-check and move to Stage 2
8. record a real behavioral problem
9. generate refinement prompt and replace with revised HTML
10. verify behavior changed
11. record one user test
12. run or skip AI validation and record the required reasoning
13. complete Stage 4 decision
14. export the final learning package

## 13. Stop conditions

Stop and report rather than inventing a new curriculum decision if implementation would require:

- changing the locked four-stage model
- making AI validation mandatory
- changing final free-topic principle
- adding API/server/DB/MCP to LEVEL 1
- removing the final project package
- redefining historical STAGE 02 decisions

## 14. Git rules

- Work only on `feature/stage-03-level-1-portal` unless explicitly instructed otherwise.
- Do not merge PR #5.
- Do not push changes to `main` directly.
- Keep PR #5 open for user runtime review.
- Prefer focused commits with clear messages.

## 15. Completion report

When finished, report:

- files changed
- major UX changes
- static test result
- runtime checks performed
- remaining known limitations
- latest commit SHA

Do not claim classroom validation. Real learner validation remains a later step.
