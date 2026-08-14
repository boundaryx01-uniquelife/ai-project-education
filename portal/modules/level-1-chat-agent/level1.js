(()=>{
"use strict";
const KEY="ai-project-education.level1.chat-agent.v1";
const initial=()=>({name:"",user:"",role:"",sources:"",topics:"",boundaries:"",testQuestion:"",testResponse:"",testFinding:"",checks:{stayedInRole:false,usedSources:false,askedAgain:false}});
let state=initial();
const $=s=>document.querySelector(s);
const clean=v=>String(v??"").trim();
function load(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved)state={...initial(),...saved,checks:{...initial().checks,...saved.checks}}}catch(_){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="이 브라우저에 자동 저장됨"}catch(_){$("#saveStatus").textContent="브라우저 저장을 사용할 수 없음"}}
function prompt(){return[`너는 '${clean(state.name)||"대화봇"}'이다.`,`사용자: ${clean(state.user)||"아직 정하지 않음"}`,`역할: ${clean(state.role)||"아직 정하지 않음"}`,`답변 근거·자료 범위: ${clean(state.sources)||"아직 정하지 않음"}`,`답변 주제: ${clean(state.topics)||"아직 정하지 않음"}`,`금지·재질문 규칙: ${clean(state.boundaries)||"아직 정하지 않음"}`,"", "위 범위를 벗어난 사실·인용·출처를 만들지 마라. 근거가 부족하면 모른다고 말하고, 필요한 정보를 짧게 재질문하라.","답변은 대화 상대의 말투를 쓰되, 사용자가 스스로 생각할 수 있는 질문을 하나 포함하라."].join("\n")}
function refresh(){ $("#agentPreview").textContent=clean(state.name)||"나의 대화봇"; $("#rolePreview").textContent=clean(state.role)||"아직 정하지 않음"; $("#sourcePreview").textContent=clean(state.sources)||"아직 정하지 않음"; $("#boundaryPreview").textContent=clean(state.boundaries)||"아직 정하지 않음"; $("#prompt").textContent=prompt() }
function bind(){Object.keys(state).filter(k=>k!=="checks").forEach(key=>{const input=$(`[data-bind="${key}"]`);if(input){input.value=state[key];input.addEventListener("input",()=>{state[key]=input.value;save();refresh()})}});Object.keys(state.checks).forEach(key=>{const input=$(`[data-check="${key}"]`);if(input){input.checked=state.checks[key];input.addEventListener("change",()=>{state.checks[key]=input.checked;save()})}})}
function packageMarkdown(){return`# ${clean(state.name)||"LEVEL 1 대화형 미니 에이전트"}\n\n## 프로젝트\n- 사용자: ${clean(state.user)}\n- 역할: ${clean(state.role)}\n- 답변 근거·자료 범위: ${clean(state.sources)}\n- 답변 주제: ${clean(state.topics)}\n- 금지·재질문 규칙: ${clean(state.boundaries)}\n\n## 대화 프롬프트\n\`\`\`\n${prompt()}\n\`\`\`\n\n## 테스트 기록\n- 질문: ${clean(state.testQuestion)}\n- 실제 응답 요약: ${clean(state.testResponse)}\n- 발견한 문제·수정할 규칙: ${clean(state.testFinding)}\n- 역할·주제 준수: ${state.checks.stayedInRole}\n- 출처 꾸며내지 않음: ${state.checks.usedSources}\n- 재질문·답변 범위 표시: ${state.checks.askedAgain}\n\n## 알려진 제한\n- 이 패키지는 외부 채팅 AI에 수동으로 붙여 넣어 사용한다.\n- 실제 문서 검색, 출처 자동 연결, 파일 업로드, API 호출은 포함하지 않는다.\n- AI 응답은 사람이 근거와 규칙 준수 여부를 검토한다.\n`}
function download(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([packageMarkdown()],{type:"text/markdown;charset=utf-8"}));a.download="level-1-chat-agent-package.md";document.body.append(a);a.click();const url=a.href;a.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}
$("#copyPrompt").onclick=async()=>{try{await navigator.clipboard.writeText(prompt());$("#copyPrompt").textContent="복사됨";setTimeout(()=>$("#copyPrompt").textContent="프롬프트 복사",1200)}catch(_){alert("복사할 수 없습니다. 프롬프트 영역을 직접 선택해 복사하세요.")}};
$("#downloadPackage").onclick=download;
load();bind();refresh();
})();
