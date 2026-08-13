(()=>{
"use strict";
const D=window.LEVEL1_DATA;
const qs=new URLSearchParams(location.search);
const audience=["elementary","secondary","adult"].includes(qs.get("audience"))?qs.get("audience"):"elementary";
const profile=D.audienceExamples[audience];
const KEY=`ai-project-education.level1.v6.${audience}`;
const $=s=>document.querySelector(s);
const all=s=>[...document.querySelectorAll(s)];
const clean=v=>String(v??"").trim();
const stages=[
  {name:"1. MVP 제작",title:"AI에게 실제로 실행되는 첫 MVP를 만들게 한다",web:"목표와 최소 기능을 정합니다. 그 뒤 AI가 만든 단일 HTML 코드를 아래에 붙여넣으면 왼쪽에서 즉시 실행됩니다.",ai:"설명서나 MD가 아니라 HTML/CSS/JS가 모두 포함된 단일 실행 파일을 만들도록 요청합니다.",check:"왼쪽 LIVE MVP에서 버튼·입력·결과가 실제로 작동하면 2단계 수정·제약으로 넘어갑니다."},
  {name:"2. 수정·제약",title:"작동하는 MVP를 써보고 행동 규칙을 고친다",web:"왼쪽 MVP를 직접 사용해 문제를 찾고, 반드시 할 일·금지조건·재질문 조건을 적습니다.",ai:"현재 HTML 전체와 수정 조건을 함께 보내 수정된 단일 HTML 파일 전체를 다시 받습니다.",check:"수정된 HTML을 다시 붙여넣어 왼쪽 MVP의 행동이 실제로 달라졌는지 확인합니다."},
  {name:"3. 검증",title:"사용자 검증과 선택적 AI 검증으로 판단한다",web:"최소 한 번 실제로 사용한 상황과 결과, 문제나 피드백을 기록합니다. AI 검증은 선택입니다.",ai:"AI 검증을 한다면 현재 HTML을 실패시키는 관점에서 검토받고, 제안을 채택하거나 기각한 이유를 직접 판단합니다.",check:"사용자 테스트 1건과 AI 제안에 대한 판단 또는 AI 검증 생략 이유·대체 근거가 필요합니다. AI 출력도 검증 대상입니다."},
  {name:"4. 다음 개발 판단",title:"다음 개발 경계를 결정하고 프로젝트를 내보낸다",web:"로컬/웹, 공유 범위, 브라우저 저장, DB, 외부 API와 원하는 다음 기능을 판단합니다.",ai:"현재 MVP와 결정사항으로 간결한 다음 개발 프롬프트를 만듭니다.",check:"추가 코딩은 하지 않습니다. 다음 개발 경계를 결정하고 최종 HTML과 학습 기록을 내보냅니다."}
];
function init(){return{stage:0,mvpVersion:1,mvp:{name:profile.name,user:"",problem:"",outcome:"",required:"",rules:""},selfCheck:{inputChanges:false,ruleBased:false,notEcho:false},artifactHtml:"",refine:{issue:"",change:"",constraintConfirmed:false},refinementHistory:[],lastRefinement:"",validate:{testSituation:"",testOutcome:"",feedback:"",userTests:[],aiMode:"skip",aiResponse:"",accepted:"",rejected:"",deferred:"",decisionReason:"",skipReason:"",substituteEvidence:"",revisionNeeded:"",revisionPlan:"",revisionApplied:false,revalidationRequired:false,retestSituation:"",retestOutcome:"",retestFeedback:"",retestPassed:false,currentVersionComplete:false},validationHistory:[],lastValidation:"",delivery:{place:"local",share:"personal",browserStorage:"no",database:"no",external:"no",nextFunctions:""}}}
let state=init();
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);state={...init(),...s,mvp:{...init().mvp,...s.mvp},selfCheck:{...init().selfCheck,...s.selfCheck},refine:{...init().refine,...s.refine},validate:{...init().validate,...s.validate,userTests:Array.isArray(s.validate?.userTests)?s.validate.userTests:[]},refinementHistory:Array.isArray(s.refinementHistory)?s.refinementHistory:[],validationHistory:Array.isArray(s.validationHistory)?s.validationHistory:[],delivery:{...init().delivery,...s.delivery}}}}catch(_){} }
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="자동 저장됨"}catch(_){$("#saveStatus").textContent="저장 사용 불가"}}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function stripFence(v){let t=String(v??"").trim();const m=t.match(/^```(?:html)?\s*([\s\S]*?)\s*```$/i);if(m)t=m[1].trim();return t}
function extractHtmlDocument(v){const t=stripFence(v);const starts=[t.search(/<!doctype\s+html\b/i),t.search(/<html[\s>]/i)].filter(i=>i>=0);if(!starts.length)return"";const start=Math.min(...starts);const end=t.lastIndexOf("</html>");return end>=start?t.slice(start,end+7).trim():""}
function hasRunnableHtml(){const h=extractHtmlDocument(state.artifactHtml).toLowerCase();return h.includes("<html")&&h.includes("<body")&&h.includes("</html>")}
function safeSrcdoc(html){const csp=`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none';">`;let h=extractHtmlDocument(html);if(/<head[\s>]/i.test(h))return h.replace(/<head([^>]*)>/i,`<head$1>${csp}`);return h.replace(/<html([^>]*)>/i,`<html$1><head>${csp}</head>`)}
function architecture(){const d=state.delivery;if(d.database==="yes")return"웹 + 데이터베이스 검토";if(d.external==="yes")return"웹 + 외부 API 검토";if(d.place==="web"||d.share!=="personal")return"정적 웹 우선";return"로컬 단일 HTML 유지"}
function stagePrompt(){const m=state.mvp,r=state.refine,v=state.validate,d=state.delivery;if(state.stage===0)return[
"너는 지금 문서나 기획서를 작성하는 것이 아니라 실제로 실행되는 작은 웹앱 MVP를 제작한다.",
"반드시 HTML/CSS/JavaScript를 모두 포함한 단일 HTML 파일 하나를 만들어라.",
"Markdown 설명서, 구현 계획, README, 코드 설명을 만들지 마라.",
"응답은 실행 가능한 완전한 HTML 코드 하나만 제공하라. 가능하면 ```html 코드블록 하나만 출력하라.",
"외부 라이브러리, CDN, API, 서버, 데이터베이스는 사용하지 마라. 브라우저에서 파일 하나만 열어 작동해야 한다.",
"입력값을 바꾸고 버튼을 누르면 실제 결과가 변하는 최소 기능을 반드시 구현하라.",
"",
`앱 이름: ${clean(m.name)||profile.name}`,
`사용자: ${clean(m.user)}`,
`해결할 문제: ${clean(m.problem)}`,
`사용자가 얻어야 할 결과: ${clean(m.outcome)}`,
`필수 입력: ${clean(m.required)}`,
`규칙/조건: ${clean(m.rules)}`,
"",
`참고 처리 흐름: ${profile.steps.slice(0,4).join(" → ")}`,
"UI는 보기 좋은 카드형 단일 화면으로 만들되 기능을 과도하게 늘리지 마라.",
"중요: 이것은 에이전트 설명문이 아니라 지금 바로 브라우저에서 조작 가능한 MVP 웹앱이어야 한다."
].join("\n");
if(state.stage===1)return[
"아래는 현재 실제로 작동 중인 단일 HTML MVP다. 설명서를 만들지 말고 이 HTML 자체를 수정하라.",
"응답은 수정된 완전한 HTML 파일 전체 코드만 제공하라. Markdown 문서나 변경 설명은 출력하지 마라.",
"외부 라이브러리/CDN/API/서버/DB는 새로 추가하지 마라.",
"",
"--- 수정해야 할 조건 ---",
`사용하면서 발견한 문제: ${clean(r.issue)}`,
`행동 또는 제약 변경: ${clean(r.change)}`,
"위 문제를 해결하도록 입력 처리, 경계조건, 누락·상충 입력, 금지 규칙 또는 안전한 fallback 중 적절한 행동을 바꿔라. 디자인만 바꾸지 마라.",
"",
"--- 현재 HTML ---",
stripFence(state.artifactHtml)
].join("\n");
if(state.stage===2&&v.revalidationRequired)return[
"아래 HTML은 검증 결과를 반영해 수정된 MVP v"+state.mvpVersion+"다. 코드를 다시 작성하지 말고 재검증만 하라.",
"이전 문제의 해결 여부와 수정으로 생긴 회귀·새 실패를 함께 확인하라.",
"정보 부족, 경계값, 상충 조건, 잘못된 입력, 금지 조건 위반, 기존 정상 동작을 점검하라.",
"응답 형식: 테스트 항목 | 테스트 방법 | 결과(PASS/FAIL) | 발견 문제 | 수정 필요 여부.",
"마지막 줄에 전체 판단 PASS / PASS_WITH_MINOR_FIX / FAIL 중 하나를 제시하라.",
"",
"--- 이전 검증에서 반영한 내용 ---",
clean(v.revisionPlan),
"",
"--- 재검증할 현재 HTML ---",
extractHtmlDocument(state.artifactHtml)
].join("\n");
if(state.stage===2&&v.revisionNeeded==="yes")return[
"아래는 실제 사용·AI 검증에서 발견한 문제를 반영해야 하는 단일 HTML MVP다.",
"설명, diff, README를 만들지 말고 검증 결과를 반영한 완전한 HTML 파일 하나만 출력하라.",
"외부 라이브러리, CDN, API, 서버, DB는 추가하지 마라.",
"",
"--- 검증 결과 요약 ---",
`테스트 상황: ${clean(v.testSituation)}`,
`실제 결과: ${clean(v.testOutcome)}`,
`문제·피드백: ${clean(v.feedback)}`,
`채택한 AI 발견: ${clean(v.accepted)}`,
`보류한 발견: ${clean(v.deferred)}`,
`유지할 제약: ${clean(m.rules)} / ${clean(r.change)}`,
`반영할 수정: ${clean(v.revisionPlan)}`,
"",
"--- 현재 HTML ---",
extractHtmlDocument(state.artifactHtml)
].join("\n");
if(state.stage===2)return[
"아래 단일 HTML MVP를 칭찬하거나 요약하지 말고 실패시키는 관점에서 검증하라.",
"코드를 다시 작성하지 말고 검증 보고만 해라.",
"다음 항목을 짧은 표로 제시하라: 테스트 입력 / 예상 실패 / 실제 위험 / 통과 기준 / 수정 우선순위.",
"반드시 정보 부족, 경계값, 상충 조건, 잘못된 입력, 금지조건 위반 가능성을 포함하라.",
`사용자 테스트 상황: ${clean(v.testSituation)||"아직 없음"}`,
`실제로 일어난 일: ${clean(v.testOutcome)||"아직 없음"}`,
`문제 또는 피드백: ${clean(v.feedback)||"아직 없음"}`,
`기존 사용자 테스트: ${v.userTests.map(t=>t.situation).join(" / ")||"없음"}`,
"",
"--- 검증할 HTML ---",
stripFence(state.artifactHtml)
].join("\n");
return[
"다음은 브라우저에서 실제 작동하는 단일 HTML MVP의 다음 개발 범위를 판단하는 단계다.",
"과도한 기술을 권하지 말고 현재 요구에 필요한 최소 수준만 추천하라.",
`앱: ${clean(m.name)||profile.name}`,
`사용 위치: ${d.place}`,
`공유 범위: ${d.share}`,
`브라우저 저장 필요: ${d.browserStorage}`,
`데이터베이스 필요: ${d.database}`,
`외부 API/실시간 데이터: ${d.external}`,
`원하는 다음 기능: ${clean(d.nextFunctions)}`,
"",
"로컬 단일 HTML 유지 / 정적 웹 배포 / 웹+DB / 외부 API 연동 중 하나를 우선 추천하고, 그 이유와 다음 TASK 3개만 제시하라."
].join("\n")}
function complete(i){if(i===0)return hasRunnableHtml()&&Object.values(state.selfCheck).every(Boolean);if(i===1)return clean(state.refine.issue)&&clean(state.refine.change)&&state.refine.constraintConfirmed&&hasRunnableHtml();if(i===2){const user=state.validate.userTests.length>0||["testSituation","testOutcome","feedback"].every(k=>clean(state.validate[k]));const ai=state.validate.aiMode==="use"?(clean(state.validate.aiResponse)&&clean(state.validate.accepted)&&clean(state.validate.decisionReason)):(clean(state.validate.skipReason)&&clean(state.validate.substituteEvidence));const revalidated=state.validate.revisionNeeded==="yes"?(state.validate.revisionApplied&&state.validate.revalidationRequired&&["retestSituation","retestOutcome","retestFeedback"].every(k=>clean(state.validate[k]))&&state.validate.retestPassed):state.validate.revisionNeeded==="no";return user&&ai&&revalidated&&state.validate.currentVersionComplete}return clean(state.delivery.nextFunctions)}
function gateMessage(i){const missing=[];if(i===0){if(!hasRunnableHtml())missing.push("실행 가능한 HTML");if(!state.selfCheck.inputChanges)missing.push("입력 변경 시 출력 변경 확인");if(!state.selfCheck.ruleBased)missing.push("규칙·조건에 따른 변화 확인");if(!state.selfCheck.notEcho)missing.push("단순 입력 반복이 아님을 확인")}if(i===1){if(!clean(state.refine.issue))missing.push("실사용에서 발견한 문제");if(!clean(state.refine.change))missing.push("행동·제약 변경 내용");if(!state.refine.constraintConfirmed)missing.push("의미 있는 제약 기반 수정 확인");if(!hasRunnableHtml())missing.push("수정된 실행 HTML")}if(i===2){const user=state.validate.userTests.length>0||["testSituation","testOutcome","feedback"].every(k=>clean(state.validate[k]));if(!user)missing.push("사용자 테스트 1건");if(state.validate.aiMode==="use"){if(!clean(state.validate.aiResponse))missing.push("AI 검증 응답");if(!clean(state.validate.accepted))missing.push("채택한 발견(없으면 없음과 이유)");if(!clean(state.validate.decisionReason))missing.push("채택·기각·보류 판단 이유")}else{if(!clean(state.validate.skipReason))missing.push("AI 검증 생략 이유");if(!clean(state.validate.substituteEvidence))missing.push("대체 검증 근거")}if(!clean(state.validate.revisionNeeded))missing.push("검증 결과 판단");if(state.validate.revisionNeeded==="yes"){if(!clean(state.validate.revisionPlan))missing.push("수정할 발견");if(!state.validate.revisionApplied)missing.push("수정 HTML 반영");["retestSituation","retestOutcome","retestFeedback"].forEach((k,n)=>{if(!clean(state.validate[k]))missing.push(["재검증 상황","재검증 결과","재검증 피드백"][n])});if(!state.validate.retestPassed)missing.push("재검증 통과 확인")}if(!state.validate.currentVersionComplete)missing.push("현재 MVP 버전 검증 완료 확인")}if(i===3&&!clean(state.delivery.nextFunctions))missing.push("원하는 다음 기능");return missing.length?`${i+1}단계에서 아직 필요한 항목: ${missing.join(" / ")}`:""}
function archiveRefinement(){const r=state.refine;const record={issue:clean(r.issue),change:clean(r.change)};const fingerprint=JSON.stringify(record);if(fingerprint!==state.lastRefinement){state.refinementHistory.push(record);state.lastRefinement=fingerprint}}
function archiveValidation(){const v=state.validate;const record={iteration:`V${state.validationHistory.length+1}`,mvpVersion:`MVP v${state.mvpVersion}`,userTests:[...v.userTests,{situation:clean(v.testSituation),outcome:clean(v.testOutcome),feedback:clean(v.feedback)}].filter(t=>t.situation||t.outcome||t.feedback),aiMode:v.aiMode,accepted:clean(v.accepted),rejected:clean(v.rejected),deferred:clean(v.deferred),decisionReason:clean(v.decisionReason),skipReason:clean(v.skipReason),substituteEvidence:clean(v.substituteEvidence),revisionNeeded:v.revisionNeeded,revisionPlan:clean(v.revisionPlan),retestSituation:clean(v.retestSituation),retestOutcome:clean(v.retestOutcome),retestFeedback:clean(v.retestFeedback),retestPassed:v.retestPassed,status:v.revisionNeeded==="yes"?"VALIDATION_COMPLETE_AFTER_REVALIDATION":"VALIDATION_COMPLETE"};const fingerprint=JSON.stringify(record);if(fingerprint!==state.lastValidation){state.validationHistory.push(record);state.lastValidation=fingerprint}}
function validationStatus(){const v=state.validate;if(v.currentVersionComplete)return"VALIDATION_COMPLETE";if(v.revalidationRequired)return"REVALIDATION_REQUIRED";if(v.revisionNeeded==="yes")return"REVISION_REQUIRED";if(clean(v.feedback)||clean(v.accepted))return"ISSUE_FOUND";return"VALIDATION_READY"}
function renderProgress(){$("#progress").innerHTML=stages.map((x,i)=>`<button type="button" data-step="${i}" class="${i===state.stage?"active":""} ${complete(i)?"done":""}">${x.name}</button>`).join("");all("[data-step]").forEach(b=>b.onclick=()=>{state.stage=+b.dataset.step;render();save()})}
function renderHeader(){$("#audienceChip").textContent=`${profile.audience} · ${profile.name}`;$("#stageCount").textContent=`${state.stage+1} / 4`;$("#stageName").textContent=stages[state.stage].title;$("#webHelp").textContent=stages[state.stage].web;$("#aiHelp").textContent=stages[state.stage].ai;$("#finishState").textContent=stages[state.stage].check}
function renderLive(){const body=$("#liveBody");$("#liveState").textContent=hasRunnableHtml()?"RUNNING":"WAITING FOR HTML";if(!hasRunnableHtml()){body.innerHTML=`<div class="preview-empty"><div><strong>아직 실행할 MVP가 없습니다.</strong><p>오른쪽에서 프롬프트를 AI에 보내고, AI가 만든 단일 HTML 전체 코드를 다시 붙여넣으면 이 자리에 실제 앱이 실행됩니다.</p></div></div>`;return}body.innerHTML=`<iframe id="mvpFrame" class="preview-frame" title="내 MVP 실행 화면" sandbox="allow-scripts"></iframe>`;$("#mvpFrame").srcdoc=safeSrcdoc(state.artifactHtml)}
function field(label,path,value,full=false,rows=2){return`<label class="field ${full?"full":""}">${label}<textarea rows="${rows}" data-bind="${path}">${esc(value)}</textarea></label>`}
function codeArea(label,stageThree=false){const status=hasRunnableHtml()?"실행 가능한 HTML만 추출되어 왼쪽 LIVE MVP에 적용됩니다. 실제 동작을 직접 확인하세요.":"완전한 HTML 문서(<!doctype html>부터 </html>까지)를 붙여넣으세요. 프롬프트·설명 문장은 자동으로 제외합니다.";const confirm=stageThree?check("validate.revisionApplied","수정 HTML을 붙여넣고 왼쪽 LIVE MVP에서 검증 결과가 반영됐는지 확인했다.",state.validate.revisionApplied):"";const visibleHtml=extractHtmlDocument(state.artifactHtml)||state.artifactHtml;return`<div class="field full"><label for="artifactHtml">${label}</label><textarea id="artifactHtml" class="codebox" spellcheck="false" placeholder="<!doctype html> ...">${esc(visibleHtml)}</textarea><p class="code-status">${status}</p>${confirm}</div>`}
function check(path,label,checked){return`<label class="check"><input type="checkbox" data-check="${path}" ${checked?"checked":""}> <span>${label}</span></label>`}
function select(path,label,value,options){return`<label class="field">${label}<select data-bind="${path}">${options.map(([v,t])=>`<option value="${v}" ${value===v?"selected":""}>${t}</option>`).join("")}</select></label>`}
function renderValidationForm(){const v=state.validate;const history=state.validationHistory.length?`<details class="iteration-history full"><summary>이전 검증 이력 ${state.validationHistory.length}건</summary>${state.validationHistory.map(x=>`<p><b>${esc(x.iteration)} · ${esc(x.mvpVersion)}</b> · ${esc(x.status)}<br>${esc(x.revisionNeeded==="yes"?"수정 및 재검증":"현재 버전 통과")}</p>`).join("")}</details>`:"";const revision=v.revisionNeeded==="yes"?`<section class="validation-loop full"><strong>④ 검증 결과 반영하여 수정하기 · ${validationStatus()}</strong><p>수정 프롬프트를 복사해 완전한 HTML을 받은 뒤 아래에 붙여넣으세요. 새 HTML은 LIVE MVP를 즉시 교체하고 MVP 버전을 올립니다.</p>${field("수정할 발견과 변경 규칙","validate.revisionPlan",v.revisionPlan,true)}${codeArea("검증 결과를 반영한 수정 HTML 전체 코드",true)}<button id="copyRevalidation" class="btn secondary small" type="button">재검증용 프롬프트 복사</button><div class="retest-grid">${field("수정 후 재검증 상황","validate.retestSituation",v.retestSituation,true)}${field("수정 후 실제 결과","validate.retestOutcome",v.retestOutcome,true)}${field("수정 후 피드백","validate.retestFeedback",v.retestFeedback,true)}${check("validate.retestPassed","수정한 MVP가 이번 재검증을 통과했다.",v.retestPassed)}</div></section>`:"";$("#webForm").innerHTML=`<div class="validation-grid"><section class="validation-loop full"><strong>① 사용자 테스트 · ${validationStatus()} · 현재 MVP v${state.mvpVersion}</strong>${field("테스트 상황 또는 입력","validate.testSituation",v.testSituation,true,2)}${field("실제로 일어난 일","validate.testOutcome",v.testOutcome,true,2)}${field("문제 또는 피드백","validate.feedback",v.feedback,true,2)}<button id="addUserTest" class="btn secondary small" type="button">사용자 테스트 추가</button><p>저장된 사용자 테스트: ${v.userTests.length}건</p></section><section class="validation-loop full"><strong>② AI 검증 (선택)</strong><p class="validation-message"><b>AI 출력도 검증 대상입니다.</b> AI 판단을 그대로 믿지 말고 채택·기각·보류를 직접 결정하세요.</p>${select("validate.aiMode","AI 검증 선택",v.aiMode,[["skip","생략하고 대체 검증 기록"],["use","외부 AI로 검증"]])}${v.aiMode==="use"?`${field("AI 검증 응답","validate.aiResponse",v.aiResponse,true,3)}${field("채택한 발견","validate.accepted",v.accepted,true)}${field("기각한 발견","validate.rejected",v.rejected,true)}${field("보류한 발견","validate.deferred",v.deferred,true)}${field("채택·기각·보류 판단 이유","validate.decisionReason",v.decisionReason,true)}`:`${field("AI 검증을 생략한 이유","validate.skipReason",v.skipReason,true)}${field("대체 검증 근거","validate.substituteEvidence",v.substituteEvidence,true)}`}</section><section class="validation-loop full"><strong>③ 판단</strong>${select("validate.revisionNeeded","현재 MVP 판단",v.revisionNeeded,[["","선택하세요"],["yes","발견을 반영해 수정하고 재검증"],["no","현재 MVP는 이 범위에서 통과"]])}</section>${revision}<section class="validation-loop full"><strong>⑤ 현재 버전 검증 완료</strong><p>검증 뒤 MVP를 바꾸었다면, 바뀐 버전을 반드시 다시 검증해야 합니다.</p>${check("validate.currentVersionComplete","현재 MVP 버전이 이 범위에서 충분히 검증되었다고 판단한다.",v.currentVersionComplete)}</section>${history}</div>`;bindInputs();const add=$("#addUserTest");if(add)add.onclick=()=>{const item={situation:clean(v.testSituation),outcome:clean(v.testOutcome),feedback:clean(v.feedback)};if(!item.situation||!item.outcome||!item.feedback){alert("사용자 테스트의 상황, 실제 결과, 문제·피드백을 모두 기록해 주세요.");return}v.userTests.push(item);v.testSituation="";v.testOutcome="";v.feedback="";save();render()};const re=$("#copyRevalidation");if(re)re.onclick=copyPrompt}
function renderForm(){let h="";if(state.stage===0){const m=state.mvp;h=`<div class="form-grid"><label class="field">에이전트·프로젝트 이름<input data-bind="mvp.name" value="${esc(m.name)}"></label>${field("누가 사용하나","mvp.user",m.user)}${field("어떤 문제를 해결하나","mvp.problem",m.problem,true)}${field("어떤 결과를 받아야 하나","mvp.outcome",m.outcome,true)}${field("꼭 필요한 입력","mvp.required",m.required,true)}${field("적용할 규칙·조건","mvp.rules",m.rules,true)}${codeArea("AI가 만든 실행 HTML 붙여넣기")}<fieldset class="self-check full"><legend>입력 → 판단/규칙 → 출력 자가 확인</legend>${check("selfCheck.inputChanges","입력을 바꾸면 출력이 실제로 바뀐다.",state.selfCheck.inputChanges)}${check("selfCheck.ruleBased","그 변화는 규칙이나 조건에 따른다.",state.selfCheck.ruleBased)}${check("selfCheck.notEcho","결과가 입력을 그대로 반복하는 것 이상이다.",state.selfCheck.notEcho)}</fieldset></div>`}else if(state.stage===1){const r=state.refine;const fromValidation=state.validationHistory.length?`<p class="loop-note full"><strong>검증 결과를 반영하는 수정입니다.</strong> 아래 내용이 검증 단계에서 가져온 초안입니다. 필요하면 구체화한 뒤 새 HTML 전체를 다시 받으세요.</p>`:"";h=`<div class="form-grid">${fromValidation}${field("실제로 써보며 발견한 문제","refine.issue",r.issue,true)}${field("바꾼 행동 또는 제약","refine.change",r.change,true)}<div class="self-check full">${check("refine.constraintConfirmed","디자인만 바꾼 것이 아니라 규칙·경계·누락·상충·fallback 등 행동을 수정했다.",r.constraintConfirmed)}</div>${codeArea("AI가 수정한 완전한 HTML 전체 코드로 교체")}</div>`}else if(state.stage===2){const v=state.validate;h=`<div class="validation-grid">${field("실제 테스트 또는 사용 상황","validate.testSituation",v.testSituation,true,3)}${field("실제로 일어난 일","validate.testOutcome",v.testOutcome,true,3)}${field("발견한 문제 또는 피드백","validate.feedback",v.feedback,true,3)}${select("validate.aiMode","AI 검증 선택",v.aiMode,[["skip","생략하고 대체 검증 기록"],["use","외부 AI로 검증"]])}<p class="validation-message full"><strong>AI 출력도 검증 대상입니다.</strong> 붙여넣은 답보다 학습자의 채택·기각 판단이 중요합니다.</p>${v.aiMode==="use"?`${field("외부 AI 검증 응답","validate.aiResponse",v.aiResponse,true,4)}${field("채택한 제안 (없으면 '없음'과 이유)","validate.accepted",v.accepted,true)}${field("기각한 제안 (해당하는 경우)","validate.rejected",v.rejected,true)}${field("채택·기각 판단 이유","validate.decisionReason",v.decisionReason,true)}`:`${field("AI 검증을 생략한 이유","validate.skipReason",v.skipReason,true)}${field("대신 사용한 검증 방법 또는 근거","validate.substituteEvidence",v.substituteEvidence,true)}`}<div class="validation-loop full"><strong>검증 결과를 최종 HTML에 반영할까요?</strong>${select("validate.revisionNeeded","반영 여부",v.revisionNeeded,[["","선택하세요"],["yes","예 — 2단계로 돌아가 HTML을 수정하고 다시 검증"],["no","아니오 — 현재 MVP는 이 검증을 통과함"]])}${v.revisionNeeded==="yes"?field("반영할 수정 내용","validate.revisionPlan",v.revisionPlan,true):""}</div></div>`}else{const d=state.delivery;h=`<div class="decision-grid">${select("delivery.place","보관·공개 위치",d.place,[["local","로컬 단일 HTML 유지"],["web","웹에 게시"]])}${select("delivery.share","공유 범위",d.share,[["personal","나만"],["small","소수 공유"],["public","공개"]])}${select("delivery.browserStorage","브라우저 저장 필요",d.browserStorage,[["no","불필요"],["yes","필요"]])}${select("delivery.database","데이터베이스 필요",d.database,[["no","불필요"],["yes","필요"]])}${select("delivery.external","외부 API·현재 데이터 필요",d.external,[["no","불필요"],["yes","필요"]])}${field("다음에 추가하고 싶은 기능(1개 이상)","delivery.nextFunctions",d.nextFunctions,true,3)}</div><div class="arch-result"><strong>현재 권장 방향: ${architecture()}</strong>추가 구현이 아니라 다음 개발 경계를 정하는 단계입니다.</div>`}$("#webForm").innerHTML=h;bindInputs()}
function renderAI(){$("#aiPrompt").textContent=stagePrompt();const handoff=$("#aiHandoff");if(state.stage===0)handoff.innerHTML=`<strong>AI에서 돌아오는 것은 문서가 아니라 실행 코드입니다.</strong><ol><li>위 프롬프트를 복사해 Claude/ChatGPT 등에 붙여넣기</li><li>AI가 반환한 <b>HTML 전체 코드</b> 복사</li><li>위 WEB 블록의 ‘AI가 만든 실행 HTML 붙여넣기’에 붙여넣기</li><li>왼쪽 LIVE MVP에서 실제 작동 확인</li></ol>`;else if(state.stage===1)handoff.innerHTML=`<strong>수정도 같은 파일을 계속 고칩니다.</strong><ol><li>수정 프롬프트 복사</li><li>AI가 반환한 수정 HTML 전체 코드 복사</li><li>기존 HTML을 새 코드로 교체</li><li>왼쪽에서 바뀐 행동을 실제 시험</li><li>3단계에서 다시 검증</li></ol>`;else if(state.stage===2)handoff.innerHTML=`<strong>검증은 완성 선언이 아니라 다음 행동을 정하는 단계입니다.</strong><ol><li>왼쪽 MVP를 사람이 직접 여러 입력으로 테스트</li><li>AI 검증 프롬프트로 실패 가능성 탐색</li><li>문제가 있으면 ‘예’를 선택해 2단계로 돌아가 HTML 전체를 수정</li><li>수정한 MVP를 다시 이 단계에서 검증</li><li>통과했을 때만 4단계로 이동</li></ol>`;else handoff.innerHTML=`<strong>배포 판단은 구현 전에 합니다.</strong><ol><li>필요한 사용·공유·데이터 조건 선택</li><li>AI에 최소 기술 수준 검토 요청</li><li>다음 개발 단계만 결정</li></ol>`}
function renderStageThreeAI(){if(state.validate.revisionNeeded!=="yes")return;$("#aiHelp").textContent="검증 기록과 현재 HTML을 함께 보내 수정된 단일 HTML 전체를 받고, 이 화면에서 바로 실행·재검증합니다.";$("#aiHandoff").innerHTML=`<strong>검증 결과를 같은 화면에서 반영합니다.</strong><ol><li>검증 결과 요약 프롬프트를 복사</li><li>AI가 준 수정된 HTML 전체 코드 복사</li><li>왼쪽 WEB 블록의 ‘검증 결과를 반영한 수정 HTML’에 붙여넣기</li><li>LIVE MVP에서 실제 동작 확인</li><li>수정 후 재검증 기록을 남기고 통과 확인</li></ol>`}
function bindInputs(){all("[data-bind]").forEach(el=>{const [a,b]=el.dataset.bind.split(".");const apply=()=>{state[a][b]=el.value;save();if(el.tagName==="SELECT"){render();return}renderLive();renderProgress();$("#aiPrompt").textContent=stagePrompt()};el.addEventListener(el.tagName==="SELECT"?"change":"input",apply)});all("[data-check]").forEach(el=>el.addEventListener("change",()=>{const [a,b]=el.dataset.check.split(".");state[a][b]=el.checked;save();renderProgress()}));const code=$("#artifactHtml");if(code)code.addEventListener("input",()=>{const nextHtml=extractHtmlDocument(code.value);const changed=nextHtml&&nextHtml!==state.artifactHtml;state.artifactHtml=nextHtml;if(changed&&state.stage===1){state.mvpVersion++}if(changed&&state.stage===2&&state.validate.revisionNeeded==="yes"){state.mvpVersion++;state.validate.revisionApplied=true;state.validate.revalidationRequired=true;state.validate.currentVersionComplete=false;state.validate.retestSituation="";state.validate.retestOutcome="";state.validate.retestFeedback="";state.validate.retestPassed=false}if(code.value!==state.artifactHtml)code.value=state.artifactHtml;save();if(changed&&(state.stage===1||state.stage===2)){render();return}renderLive();renderProgress();$("#aiPrompt").textContent=stagePrompt();const st=code.parentElement.querySelector(".code-status");if(st)st.textContent=hasRunnableHtml()?`실행 가능한 HTML만 추출해 MVP v${state.mvpVersion}로 적용했습니다.`:"완전한 HTML 문서가 감지되지 않았습니다. <!doctype html>부터 </html>까지 붙여넣으세요."})}
async function copyPrompt(){try{await navigator.clipboard.writeText(stagePrompt());$("#copyAI").textContent="복사됨";setTimeout(()=>$("#copyAI").textContent="AI에 보낼 내용 복사",1000)}catch(_){alert("복사하지 못했습니다. 프롬프트를 직접 선택해 복사해 주세요.")}}
function historyLines(records,formatter,empty){return records.length?records.map(formatter).join("\n"):empty}
function projectMarkdown(){const m=state.mvp,d=state.delivery;const refinement=historyLines(state.refinementHistory,(r,i)=>`${i+1}. 발견한 문제: ${r.issue}\n   - 행동·제약 변경: ${r.change}`,"기록 없음");const validation=historyLines(state.validationHistory,v=>`${v.iteration} · ${v.mvpVersion} · ${v.status}\n   - 사용자 테스트: ${v.userTests.map(t=>`${t.situation} / ${t.outcome} / ${t.feedback}`).join("; ")}\n   - AI 검증: ${v.aiMode==="use"?`실시 / 채택: ${v.accepted} / 기각: ${v.rejected||"해당 없음"} / 보류: ${v.deferred||"없음"} / 이유: ${v.decisionReason}`:`생략 / 이유: ${v.skipReason} / 대체 근거: ${v.substituteEvidence}`}\n   - 수정: ${v.revisionNeeded==="yes"?`${v.revisionPlan} / 재검증: ${v.retestSituation} / ${v.retestOutcome} / ${v.retestFeedback}`:"없음"}`,"기록 없음");return`# ${clean(m.name)||"LEVEL 1 프로젝트"} 학습 패키지

## 1. 프로젝트 정체성과 목표
- 사용자: ${clean(m.user)}
- 문제: ${clean(m.problem)}
- 원하는 결과: ${clean(m.outcome)}
- 필수 입력: ${clean(m.required)}
- 규칙/조건: ${clean(m.rules)}

## 2. 최종 실행 HTML
별도 .html 파일로 함께 내보냄.

## 3. 수정·제약 기록
${refinement}

## 4. 검증 기록
${validation}

## 5. 다음 개발 결정
- 위치: ${d.place}
- 공유 범위: ${d.share}
- 브라우저 저장: ${d.browserStorage}
- 데이터베이스: ${d.database}
- 외부 API/현재 데이터: ${d.external}
- 다음 기능: ${clean(d.nextFunctions)}
- 권장 경계: ${architecture()}
`}
function download(name,content,type){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.append(a);a.click();const url=a.href;a.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}catch(_){alert("파일을 만들지 못했습니다. 내용을 복사해 직접 저장해 주세요.")}}
function safeName(){return(clean(state.mvp.name)||"level1-mvp").replace(/[^a-z0-9가-힣_-]+/gi,"-")}
function render(){renderProgress();renderHeader();renderLive();if(state.stage===2)renderValidationForm();else renderForm();renderAI();if(state.stage===2)renderStageThreeAI();$("#prev").disabled=state.stage===0;$("#next").textContent=state.stage===3?"다음 개발 경계 확인":"다음 단계";$("#next").disabled=false;$("#exportPanel").classList.toggle("hidden",state.stage!==3)}
$("#copyAI").onclick=copyPrompt;$("#prev").onclick=()=>{if(state.stage>0){state.stage--;save();render()}};$("#next").onclick=()=>{const msg=gateMessage(state.stage);if(msg){alert(msg);return}if(state.stage===1){archiveRefinement();state.stage=2}else if(state.stage===2){archiveValidation();state.stage=3}else if(state.stage<3)state.stage++;else{alert(`현재 판단: ${architecture()}\n다음 개발 경계가 기록되었습니다. 프로젝트 패키지를 내보내세요.`);return}save();render()};$("#reset").onclick=()=>{if(confirm("현재 대상의 작업 내용을 모두 지울까요?")){localStorage.removeItem(KEY);state=init();render()}};
$("#downloadMarkdown").onclick=()=>download(`${safeName()}-learning-package.md`,projectMarkdown(),"text/markdown;charset=utf-8");
$("#downloadHtml").onclick=()=>{if(!hasRunnableHtml()){alert("먼저 실행 가능한 최종 HTML을 붙여넣어 주세요.");return}download(`${safeName()}.html`,extractHtmlDocument(state.artifactHtml),"text/html;charset=utf-8")};
load();render();
})();
