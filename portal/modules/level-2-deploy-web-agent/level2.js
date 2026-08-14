(()=>{
"use strict";
const KEY="ai-project-education.level2.foundation.v1";
const initial=()=>({projectName:"",user:"",problem:"",rules:"",limitations:"",nextFunctions:"",handoffText:"",checks:{inputOutput:false,errorHandling:false,refresh:false,guide:false,pages:false}});
let state=initial();
const $=s=>document.querySelector(s);
const clean=v=>String(v??"").trim();
function load(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved)state={...initial(),...saved,checks:{...initial().checks,...saved.checks}}}catch(_){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="이 브라우저에 자동 저장됨"}catch(_){$("#saveStatus").textContent="브라우저 저장을 사용할 수 없음"}}
function setField(name,value){state[name]=value;const input=$(`[data-bind="${name}"]`);if(input)input.value=value}
function line(text,label){const match=text.match(new RegExp(`^- ${label}:\\s*(.*)$`,`m`));return match?clean(match[1]):""}
function applyHandoff(){const text=$("#handoffText").value;state.handoffText=text;setField("projectName",line(text,"프로젝트명"));setField("user",line(text,"사용자"));setField("problem",line(text,"해결할 문제"));setField("rules",line(text,"MVP 규칙·조건"));setField("limitations",line(text,"학습자가 기록한 제한·유의 사항"));setField("nextFunctions",line(text,"원하는 다음 기능"));save()}
function bind(){Object.keys(state).filter(k=>!['checks','handoffText'].includes(k)).forEach(key=>{const input=$(`[data-bind="${key}"]`);if(input){input.value=state[key];input.addEventListener("input",()=>{state[key]=input.value;save()})}});Object.keys(state.checks).forEach(key=>{const input=$(`[data-check="${key}"]`);if(input){input.checked=state.checks[key];input.addEventListener("change",()=>{state.checks[key]=input.checked;save()})}});$("#handoffText").value=state.handoffText;$("#handoffText").addEventListener("input",e=>{state.handoffText=e.target.value;save()});$("#applyHandoff").onclick=applyHandoff}
function context(){return`# PROJECT CONTEXT PACKET\n\n## PROJECT\n- 프로젝트명: ${clean(state.projectName)}\n- 최종 목적: ${clean(state.problem)}\n- 대상 사용자: ${clean(state.user)}\n\n## CURRENT STAGE\n- 현재 단계: LEVEL 2 배포형 웹 에이전트\n- 이번 단계의 목적: LEVEL 1 MVP를 정적 웹 도구로 구현·테스트·배포한다.\n\n## FIXED DECISIONS\n- 현재 MVP 규칙·조건: ${clean(state.rules)}\n- 알려진 제한·유의 사항: ${clean(state.limitations)}\n\n## TASK\n- 우선 구현할 기능: ${clean(state.nextFunctions)}\n\n## CONSTRAINTS\n- 핵심 과정은 API 키 없이 정적 웹과 브라우저 저장만으로 작동해야 한다.\n- LEVEL 1의 검증 결과를 더 넓은 기능 범위의 통과 증거로 사용하지 않는다.\n\n## VALIDATION\n- 두 사용자 선택이 결과에 영향을 주는가: ${state.checks.inputOutput}\n- 빈 입력·오류 처리: ${state.checks.errorHandling}\n- 새로고침 확인: ${state.checks.refresh}\n- 사용 안내·제한 표시: ${state.checks.guide}\n- GitHub Pages 재검증: ${state.checks.pages}\n\n## STOP CONDITION\n- 외부 자료·API·DB·개인정보 처리가 필요하면 LEVEL 3 범위를 검토하고 멈춘다.\n`}
function snapshot(){return`# STATE SNAPSHOT\n\n## COMPLETED\n- LEVEL 1 인계 자료를 LEVEL 2 시작 작업대에 기록했다.\n\n## DECIDED\n- 우선 기능: ${clean(state.nextFunctions)}\n\n## OPEN\n- LEVEL 2 구현·테스트·GitHub Pages 배포가 남아 있다.\n\n## NEXT\n- 컨텍스트 패킷을 기준으로 정적 웹 화면과 입력·출력 흐름을 구현한다.\n\n## DO NOT CHANGE\n- ${clean(state.rules)||"LEVEL 1 규칙·조건을 기록한 뒤 유지한다."}\n- ${clean(state.limitations)||"알려진 제한을 기록한 뒤 재검증한다."}\n`}
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),0)}
$("#downloadContext").onclick=()=>download("level-2-context-packet.md",context());
$("#downloadSnapshot").onclick=()=>download("level-2-state-snapshot.md",snapshot());
load();bind();
})();
