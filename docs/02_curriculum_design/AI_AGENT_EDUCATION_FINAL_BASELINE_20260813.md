# AI Agent Education Final Baseline

- Date: 2026-08-13
- Project: ai-project-education
- Status: LOCKED_FOR_IMPLEMENTATION
- Scope: LEVEL 1 individualized AI agent learning flow

## 1. Core learning model

Every learner does not complete the same example.

Learners first learn a common creation method, then apply that method to a personally chosen problem and build an individualized AI agent.

Representative examples such as exam planner, allowance guard, and travel itinerary agent are learning examples only. The final learner project is a free topic.

## 2. Locked four-stage workflow

1. MVP production
2. Refinement and constraints
3. User validation and AI validation
4. Next-development decision

The four stages are common across age groups. Entry point, scaffolding, vocabulary, and amount of teacher support may vary by age and experience.

## 3. Stage 1 - MVP production

### Required pass condition

A runnable HTML file alone is not sufficient.

The learner MVP must visibly demonstrate:

`input -> decision/rule -> output`

Changing the input must cause a meaningful output change according to a defined rule or condition.

Simply echoing the input back to the learner is not accepted as a functioning agent MVP.

### Learner self-check

- Does changing an input actually change the output?
- Is that change caused by a rule or condition?
- Is the result more than simple input substitution?

## 4. Stage 2 - Refinement and constraints

The number of revisions is flexible.

At least one revision must be based on a constraint or problem discovered while actually using the MVP.

Purely cosmetic changes such as button color changes do not satisfy this requirement.

Minimum record:

- problem discovered
- change made

The learner should be able to explain how the behavior changed before and after the revision.

## 5. Stage 3 - User validation and AI validation

### User validation

The learner or another person should actually use the MVP and leave at least one feedback record. The exact number of test cases may vary by class context.

### AI validation

Use manual AI-in-the-loop rather than integrated API access:

`generate validation prompt -> copy -> run in an external free AI chat -> receive response -> review -> record decision`

AI validation is optional.

If AI validation is performed, the learner must record:

- which AI suggestion was accepted
- which AI suggestion was rejected
- why each decision was made

If AI validation is skipped, the learner must record:

- why it was skipped
- what user validation or internal-rule validation was used instead

Core message:

> AI output is also something to validate.

## 6. Stage 4 - Next-development decision

The learner does not need to continue implementation.

The goal is to decide what would be needed if the MVP were developed further.

Possible decisions include:

- keep as local single HTML
- publish as static web
- save browser data
- require a database
- require an external API or current data
- add specific functions

The assessment target is the learner's ability to judge the next development boundary, not the amount of extra code produced.

## 7. Topic freedom

Default path:

`example modification -> free topic`

The point at which free-topic work begins is flexible by age and experience.

Adults or experienced learners may begin with a free topic from the first lesson.

## 8. Final project package

Every learner project should leave four artifacts:

1. final runnable HTML MVP
2. refinement record
3. validation record
4. next-development decision

These may be packaged as one project document or recorded in a four-stage worksheet. The final format will be adapted by age-group worksheet design.

## 9. Assessment principle

Assessment should prioritize the process of making, testing, constraining, validating, and deciding over visual polish.

A visually polished HTML file is not sufficient if the learner cannot demonstrate the four-stage process.

## 10. Implementation constraints

For the current LEVEL 1 implementation:

- single HTML MVP is the default artifact
- no server required
- no database required
- no AI API key required
- no MCP required
- no external CDN required
- manual AI-in-the-loop is allowed and preferred for AI validation
- portal may use localStorage and static browser features

## 11. Governance note

This document is the implementation baseline for the new individualized four-stage learner flow.

Historical STAGE 02 documents remain historical records and must not be silently rewritten. If this baseline is later promoted into the canonical curriculum baseline, create an explicit addendum or revision record.