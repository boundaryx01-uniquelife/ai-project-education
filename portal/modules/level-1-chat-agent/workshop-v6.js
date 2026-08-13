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
  {name:"3. 검증",title:"사용자 검증과 AI 검증으로 MVP를 깨뜨려 본다",web:"왼쪽에서 실제 사용 테스트를 하고 사용자 관점의 문제를 기록합니다.",ai:"현재 HTML 코드를 실패시키는 관점에서 검증하게 하고 취약점과 테스트 케이스를 받습니다.",check:"사용자 검증과 AI 검증 결과가 모두 있어야 다음 개발 판단으로 넘어갑니다."},
  {name:"4. 배포 판단",title:"이 MVP를 로컬로 둘지 웹으로 키울지 결정한다",web:"사용 위치, 공유 범위, 저장 데이터, DB와 외부 API 필요 여부를 판단합니다.",ai:"현재 MVP와 요구조건을 바탕으로 과도한 기술 없이 다음 개발 수준을 추천하게 합니다.",check:"여기서 완성 선언을 하지 않습니다. 다음 개발 범위와 기술 선택을 결정합니다."}
];
function init(){return{stage:0,mvp:{name:profile.name,user:"",problem:"",outcome:"",required:""},artifactHtml:"",refine:{issue:"",must:"",mustNot:"",askAgain:""},validate:{userResult:"",aiResult:""},delivery:{place:"local",share:"personal",data:"none",external:"no"}}}
let state=init();
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);state={...init(),...s,mvp:{...init().mvp,...s.mvp},refine:{...init().refine,...s.refine},validate:{...init().validate,...s.validate},delivery:{...init().delivery,...s.delivery}}}}catch(_){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="자동 저장됨"}catch(_){$("#saveStatus").textContent="저장 사용 불가"}}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function stripFence(v){let t=String(v??"").trim();const m=t.match(/^```(?:html)?\s*([\s\S]*?)\s*```$/i);if(m)t=m[1].trim();return t}
function hasRunnableHtml(){const h=clean(state.artifactHtml).toLowerCase();return h.includes("<html")&&h.includes("<body")&&h.includes("</html>")}
function safeSrcdoc(html){const csp=`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none';">`;let h=stripFence(html);if(/<head[\s>]/i.test(h))return h.replace(/<head([^>]*)>/i,`<head$1>${csp}`);return h.replace(/<html([^>]*)>/i,`<html$1><head>${csp}</head>`)}
function architecture(){const d=state.delivery;if(d.data==="database")return"웹 + 데이터베이스";if(d.external==="yes")return"웹 + 외부 API 연동";if(d.place==="web"||d.share!=="personal")return"정적 웹 우선";return"로컬 단일 HTML 유지"}
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
`반드시 해야 할 것: ${clean(r.must)}`,
`절대 하지 말아야 할 것: ${clean(r.mustNot)}`,
`정보가 부족할 때 다시 질문하거나 안내할 조건: ${clean(r.askAgain)}`,
"",
"--- 현재 HTML ---",
stripFence(state.artifactHtml)
].join("\n");
if(state.stage===2)return[
"아래 단일 HTML MVP를 칭찬하거나 요약하지 말고 실패시키는 관점에서 검증하라.",
"코드를 다시 작성하지 말고 검증 보고만 해라.",
"다음 항목을 짧은 표로 제시하라: 테스트 입력 / 예상 실패 / 실제 위험 / 통과 기준 / 수정 우선순위.",
"반드시 정보 부족, 경계값, 상충 조건, 잘못된 입력, 금지조건 위반 가능성을 포함하라.",
`현재 사용자 검증 메모: ${clean(v.userResult)||"아직 없음"}`,
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
`저장 데이터: ${d.data}`,
`외부 API/실시간 데이터: ${d.external}`,
`현재 사용자 검증: ${clean(v.userResult)||"없음"}`,
`현재 AI 검증: ${clean(v.aiResult)||"없음"}`,
"",
"로컬 단일 HTML 유지 / 정적 웹 배포 / 웹+DB / 외부 API 연동 중 하나를 우선 추천하고, 그 이유와 다음 TASK 3개만 제시하라."
].join("\n")}
function complete(i){if(i===0)return hasRunnableHtml();if(i===1)return["issue","must","mustNot","askAgain"].every(k=>clean(state.refine[k]))&&hasRunnableHtml();if(i===2)return clean(state.validate.userResult)&&clean(state.validate.aiResult);return true}
function gateMessage(i){if(i===0)return hasRunnableHtml()?"":"AI가 만든 실행 가능한 HTML을 붙여넣고 왼쪽 LIVE MVP에서 실제 작동하는지 확인해 주세요.";if(i===1){const missing=[];if(!clean(state.refine.issue))missing.push("고칠 점");if(!clean(state.refine.must))missing.push("반드시 해야 할 것");if(!clean(state.refine.mustNot))missing.push("절대 하지 말아야 할 것");if(!clean(state.refine.askAgain))missing.push("재질문 조건");if(!hasRunnableHtml())missing.push("수정된 실행 HTML");return missing.length?`2단계에서 아직 필요한 항목: ${missing.join(" / ")}`:""}if(i===2){const missing=[];if(!clean(state.validate.userResult))missing.push("사용자 검증 결과");if(!clean(state.validate.aiResult))missing.push("AI 검증 결과");return missing.length?`3단계에서 아직 필요한 항목: ${missing.join(" / ")}`:""}return""}
function renderProgress(){$("#progress").innerHTML=stages.map((x,i)=>`<button type="button" data-step="${i}" class="${i===state.stage?"active":""} ${complete(i)?"done":""}">${x.name}</button>`).join("");all("[data-step]").forEach(b=>b.onclick=()=>{state.stage=+b.dataset.step;render();save()})}
function renderHeader(){$("#audienceChip").textContent=`${profile.audience} · ${profile.name}`;$("#stageCount").textContent=`${state.stage+1} / 4`;$("#stageName").textContent=stages[state.stage].title;$("#webHelp").textContent=stages[state.stage].web;$("#aiHelp").textContent=stages[state.stage].ai;$("#finishState").textContent=stages[state.stage].check}
function renderLive(){const body=$("#liveBody");$("#liveState").textContent=hasRunnableHtml()?"RUNNING":"WAITING FOR HTML";if(!hasRunnableHtml()){body.innerHTML=`<div class="preview-empty"><div><strong>아직 실행할 MVP가 없습니다.</strong><p>오른쪽에서 프롬프트를 AI에 보내고, AI가 만든 단일 HTML 전체 코드를 다시 붙여넣으면 이 자리에 실제 앱이 실행됩니다.</p></div></div>`;return}body.innerHTML=`<iframe id="mvpFrame" class="preview-frame" title="내 MVP 실행 화면" sandbox="allow-scripts"></iframe>`;$("#mvpFrame").srcdoc=safeSrcdoc(state.artifactHtml)}
function field(label,path,value,full=false,rows=2){return`<label class="field ${full?"full":""}">${label}<textarea rows="${rows}" data-bind="${path}">${esc(value)}</textarea></label>`}
function codeArea(label){const status=hasRunnableHtml()?"실행 가능한 HTML이 감지되었습니다. 왼쪽 LIVE MVP에 적용됩니다. 1단계에서는 이제 다음 단계로 이동할 수 있습니다.":"AI가 준 HTML 전체 코드를 여기에 붙여넣으세요. ```html 코드펜스가 있어도 자동 제거합니다.";return`<div class="field full"><label for="artifactHtml">${label}</label><textarea id="artifactHtml" class="codebox" spellcheck="false" placeholder="<!doctype html> ...">${esc(state.artifactHtml)}</textarea><p class="code-status">${status}</p></div>`}
function renderForm(){let h="";if(state.stage===0){const m=state.mvp;h=`<div class="form-grid"><label class="field">에이전트 이름<input data-bind="mvp.name" value="${esc(m.name)}"></label>${field("누가 사용하나","mvp.user",m.user)}${field("어떤 문제를 해결하나","mvp.problem",m.problem,true)}${field("어떤 결과를 받아야 하나","mvp.outcome",m.outcome,true)}${field("꼭 필요한 입력","mvp.required",m.required,true)}${codeArea("AI가 만든 실행 HTML 붙여넣기")}</div>`}else if(state.stage===1){const r=state.refine;h=`<div class="form-grid">${field("써보니 가장 먼저 고칠 점","refine.issue",r.issue,true)}${field("반드시 해야 할 것","refine.must",r.must,true)}${field("절대 하지 말아야 할 것","refine.mustNot",r.mustNot,true)}${field("정보 부족 시 다시 질문·안내할 조건","refine.askAgain",r.askAgain,true)}${codeArea("AI가 수정한 HTML 전체 코드로 교체")}</div>`}else if(state.stage===2){const v=state.validate;h=`<div class="validation-grid">${field("사용자 검증 결과","validate.userResult",v.userResult,true,5)}${field("AI 검증 결과","validate.aiResult",v.aiResult,true,5)}</div>`}else{const d=state.delivery;h=`<div class="decision-grid"><label class="field">사용 위치<select data-bind="delivery.place"><option value="local" ${d.place==="local"?"selected":""}>로컬</option><option value="web" ${d.place==="web"?"selected":""}>웹</option></select></label><label class="field">공유 범위<select data-bind="delivery.share"><option value="personal" ${d.share==="personal"?"selected":""}>나만</option><option value="small" ${d.share==="small"?"selected":""}>소수 공유</option><option value="public" ${d.share==="public"?"selected":""}>공개</option></select></label><label class="field">저장 데이터<select data-bind="delivery.data"><option value="none" ${d.data==="none"?"selected":""}>저장 불필요</option><option value="browser" ${d.data==="browser"?"selected":""}>브라우저 저장이면 충분</option><option value="database" ${d.data==="database"?"selected":""}>여러 기기/사용자 DB 필요</option></select></label><label class="field">외부 API·실시간 데이터<select data-bind="delivery.external"><option value="no" ${d.external==="no"?"selected":""}>불필요</option><option value="yes" ${d.external==="yes"?"selected":""}>필요</option></select></label></div><div class="arch-result"><strong>현재 권장 방향: ${architecture()}</strong>AI 검토 전에 이 판단이 내 실제 요구와 맞는지 먼저 확인합니다.</div>`}$("#webForm").innerHTML=h;bindInputs()}
function renderAI(){$("#aiPrompt").textContent=stagePrompt();const handoff=$("#aiHandoff");if(state.stage===0)handoff.innerHTML=`<strong>AI에서 돌아오는 것은 문서가 아니라 실행 코드입니다.</strong><ol><li>위 프롬프트를 복사해 Claude/ChatGPT 등에 붙여넣기</li><li>AI가 반환한 <b>HTML 전체 코드</b> 복사</li><li>위 WEB 블록의 ‘AI가 만든 실행 HTML 붙여넣기’에 붙여넣기</li><li>왼쪽 LIVE MVP에서 실제 작동 확인</li></ol>`;else if(state.stage===1)handoff.innerHTML=`<strong>수정도 같은 파일을 계속 고칩니다.</strong><ol><li>수정 프롬프트 복사</li><li>AI가 반환한 수정 HTML 전체 코드 복사</li><li>기존 HTML을 새 코드로 교체</li><li>왼쪽에서 금지조건과 재질문 행동이 달라졌는지 직접 시험</li></ol>`;else if(state.stage===2)handoff.innerHTML=`<strong>검증 단계에서는 코드를 만들지 않습니다.</strong><ol><li>왼쪽 MVP를 사람이 직접 여러 입력으로 테스트</li><li>AI 검증 프롬프트로 실패 가능성 탐색</li><li>두 결과를 WEB 블록에 기록</li></ol>`;else handoff.innerHTML=`<strong>배포 판단은 구현 전에 합니다.</strong><ol><li>필요한 사용·공유·데이터 조건 선택</li><li>AI에 최소 기술 수준 검토 요청</li><li>다음 개발 단계만 결정</li></ol>`}
function bindInputs(){all("[data-bind]").forEach(el=>{const [a,b]=el.dataset.bind.split(".");const apply=()=>{state[a][b]=el.value;save();renderLive();renderProgress();$("#aiPrompt").textContent=stagePrompt()};el.addEventListener(el.tagName==="SELECT"?"change":"input",apply)});const code=$("#artifactHtml");if(code)code.addEventListener("input",()=>{state.artifactHtml=stripFence(code.value);save();renderLive();renderProgress();$("#aiPrompt").textContent=stagePrompt();const st=code.parentElement.querySelector(".code-status");if(st)st.textContent=hasRunnableHtml()?"실행 가능한 HTML이 감지되었습니다. 왼쪽 LIVE MVP에 적용됩니다. 다음 단계로 진행할 수 있습니다.":"아직 완전한 HTML 문서가 감지되지 않았습니다."})}
async function copyPrompt(){try{await navigator.clipboard.writeText(stagePrompt());$("#copyAI").textContent="복사됨";setTimeout(()=>$("#copyAI").textContent="AI에 보낼 내용 복사",1000)}catch(_){alert("복사하지 못했습니다. 프롬프트를 직접 선택해 복사해 주세요.")}}
function render(){renderProgress();renderHeader();renderLive();renderForm();renderAI();$("#prev").disabled=state.stage===0;$("#next").textContent=state.stage===3?"다음 개발 단계 확인":"다음 단계";$("#next").disabled=false}
$("#copyAI").onclick=copyPrompt;$("#prev").onclick=()=>{if(state.stage>0){state.stage--;save();render()}};$("#next").onclick=()=>{if(state.stage<3){const msg=gateMessage(state.stage);if(msg){alert(msg);return}state.stage++;save();render()}else alert(`현재 판단: ${architecture()}\n여기서 다음 개발 범위를 정합니다.`)};$("#reset").onclick=()=>{if(confirm("현재 대상의 작업 내용을 모두 지울까요?")){localStorage.removeItem(KEY);state=init();render()}};
load();render();
})();