(()=>{
"use strict";
const KEY="ai-project-education.level2.foundation.v2";
const initial=()=>({projectName:"",user:"",problem:"",outcome:"",rules:"",userFlow:"",screenDefinition:"",nextFunctions:"",checks:{inputOutput:false,errorHandling:false,refresh:false,guide:false,pages:false}});
let state=initial();
const $=s=>document.querySelector(s);
const clean=v=>String(v??"").trim();
function load(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved)state={...initial(),...saved,checks:{...initial().checks,...saved.checks}}}catch(_){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="이 브라우저에 자동 저장됨"}catch(_){$("#saveStatus").textContent="브라우저 저장을 사용할 수 없음"}}
function bind(){Object.keys(state).filter(k=>k!=="checks").forEach(key=>{const input=$(`[data-bind="${key}"]`);if(input){input.value=state[key];input.addEventListener("input",()=>{state[key]=input.value;save()})}});Object.keys(state.checks).forEach(key=>{const input=$(`[data-check="${key}"]`);if(input){input.checked=state.checks[key];input.addEventListener("change",()=>{state.checks[key]=input.checked;save()})}})}
function context(){return`# PROJECT CONTEXT PACKET\n\n## PROJECT\n- 프로젝트명: ${clean(state.projectName)}\n- 최종 목적: ${clean(state.problem)}\n- 대상 사용자: ${clean(state.user)}\n\n## CURRENT STAGE\n- 현재 단계: LEVEL 2 배포형 웹 에이전트\n- 이번 단계의 목적: 독립된 웹 도구를 구현, 테스트, GitHub Pages에 배포한다.\n\n## INPUTS\n- 사용자 흐름: ${clean(state.userFlow)}\n- 화면별 입력·출력: ${clean(state.screenDefinition)}\n\n## TASK\n- 이번에 구현할 핵심 기능: ${clean(state.nextFunctions)}\n\n## CONSTRAINTS\n- 지켜야 할 규칙·제한: ${clean(state.rules)}\n- 핵심 과정은 API 키 없이 정적 웹과 브라우저 저장만으로 작동해야 한다.\n\n## VALIDATION\n- 두 사용자 선택이 결과에 영향을 주는가: ${state.checks.inputOutput}\n- 빈 입력·오류 처리: ${state.checks.errorHandling}\n- 새로고침 확인: ${state.checks.refresh}\n- 사용 안내·제한 표시: ${state.checks.guide}\n- GitHub Pages 재검증: ${state.checks.pages}\n\n## STOP CONDITION\n- 외부 자료·API·DB·개인정보 처리가 필요하면, 이 LEVEL 2 과정의 범위를 넓히지 말고 별도 LEVEL 3 프로젝트를 검토한다.\n`}
function snapshot(){return`# STATE SNAPSHOT\n\n## COMPLETED\n- LEVEL 2 프로젝트 브리프와 배포형 웹 도구의 기본 설계를 기록했다.\n\n## DECIDED\n- 사용자 흐름: ${clean(state.userFlow)}\n- 구현할 핵심 기능: ${clean(state.nextFunctions)}\n\n## OPEN\n- 웹 도구 구현, 정상·경계·오류 테스트, GitHub Pages 배포가 남아 있다.\n\n## NEXT\n- 컨텍스트 패킷을 기준으로 화면과 입력·출력 흐름을 구현한다.\n\n## DO NOT CHANGE\n- ${clean(state.rules)||"프로젝트 규칙·제한을 기록한 뒤 유지한다."}\n`}
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));a.download=name;document.body.append(a);a.click();const url=a.href;a.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}
$("#downloadContext").onclick=()=>download("level-2-context-packet.md",context());
$("#downloadSnapshot").onclick=()=>download("level-2-state-snapshot.md",snapshot());
load();bind();
})();
