(()=>{
  "use strict";

  const D=window.LEVEL1_DATA;
  const audienceKey="ai-project-education.level1.audience";
  const friendly=[
    "완성 예시 확인",
    "1. 목표 정하기",
    "2. 판단 기준 넣기",
    "3. 작동 방식 만들기",
    "4. 에이전트 만들기",
    "5. AI로 시험하기",
    "6. 완성본 받기",
    "7. 개선하기"
  ];
  const titles=[
    "선택한 예시의 완성 모습을 확인합니다.",
    "에이전트의 목표를 한 장면으로 확정합니다.",
    "에이전트가 판단할 때 필요한 정보와 기준을 넣습니다.",
    "입력을 받은 뒤 무엇을 어떤 순서로 할지 정합니다.",
    "앞의 내용을 실제 에이전트 카드로 조립합니다.",
    "생성형 AI에 보내 실제로 작동하는지 시험합니다.",
    "다른 사람이 다시 쓸 수 있는 완성 패키지를 받습니다.",
    "테스트 결과를 반영해 한 번 개선하고 끝냅니다."
  ];
  const missions=[
    "선택한 완성 예시의 입력 → 판단 → 결과 흐름을 먼저 확인하세요.",
    "누가 언제 쓰며, 어떤 문제가 해결되면 성공인지 정하세요.",
    "판단에 꼭 필요한 사실·조건·규칙을 최소 3개 정하세요.",
    "사용자 입력 → 처리 순서 → 출력 → 검증·중단 조건을 연결하세요.",
    "자동 조립된 에이전트 카드를 읽고 실제로 쓸 수 있는지 확인하세요.",
    "정상·애매·실패 입력을 생성형 AI에 보내고 실제 답을 기록하세요.",
    "목표·판단 기준·에이전트 카드·테스트가 한 패키지로 묶였는지 확인하세요.",
    "테스트나 동료 의견을 근거로 수정 전후를 남기세요."
  ];
  const internal=["INTRO","DEFINE","COLLECT","STRUCTURE","BUILD","TEST","PUBLISH","IMPROVE"];
  const $=s=>document.querySelector(s);
  const all=s=>[...document.querySelectorAll(s)];

  function currentIndex(){
    const buttons=all("#stageButtons .stage-button");
    const idx=buttons.findIndex(b=>b.getAttribute("aria-current")==="step");
    return idx<0?0:idx;
  }

  function relabelButtons(){
    all("#stageButtons .stage-button").forEach((button,index)=>{
      const children=[...button.children];
      const name=children.find(el=>!el.classList.contains("stage-index")&&!el.classList.contains("stage-state"));
      if(name) name.textContent=friendly[index]||name.textContent;
      button.setAttribute("aria-label",friendly[index]||internal[index]);
    });
  }

  function renderFocus(){
    const i=currentIndex();
    relabelButtons();
    if($("#stageMission")) $("#stageMission").textContent=missions[i];
    if($("#stageTitle")) $("#stageTitle").textContent=titles[i];
    if($("#stageKicker")) $("#stageKicker").textContent=`에이전트 제작 단계 ${i+1} · ${internal[i]}`;
    const next=$("#nextStage");
    if(next) next.textContent=i>=7?"최종 확인":"확인하고 다음으로";
    const completion=$(".focus-completion");
    if(completion) completion.classList.toggle("final-zone",i>=6);
  }

  function setBound(path,value){
    all(`[data-bind="${path}"]`).forEach(el=>{
      el.value=value;
      el.dispatchEvent(new Event("input",{bubbles:true}));
    });
  }

  function setMode(value){
    const el=$(`input[type="radio"][name="mode"][value="${value}"]`);
    if(el){
      el.checked=true;
      el.dispatchEvent(new Event("change",{bubbles:true}));
    }
  }

  function renderAudience(key,applyFields){
    const profile=D.audienceExamples?.[key]||D.audienceExamples?.elementary;
    if(!profile) return;
    if($("#previewAudience")) $("#previewAudience").textContent=`${profile.audience} 예시`;
    if($("#previewName")) $("#previewName").textContent=profile.name;
    if($("#previewTagline")) $("#previewTagline").textContent=profile.tagline;
    if($("#previewInput")) $("#previewInput").textContent=profile.input;
    if($("#previewOutput")) $("#previewOutput").textContent=profile.output;
    if($("#previewSteps")) $("#previewSteps").innerHTML=profile.steps.map(step=>`<span>${step}</span>`).join("");
    all("[data-audience]").forEach(button=>{
      const selected=button.dataset.audience===key;
      button.setAttribute("aria-pressed",String(selected));
      button.classList.toggle("secondary",!selected);
    });
    try{localStorage.setItem(audienceKey,key)}catch(_){ }
    if(applyFields){
      setBound("define.user",profile.define.user);
      setBound("define.scene",profile.define.scene);
      setBound("define.problem",profile.define.problem);
      setBound("define.constraints",profile.define.constraints);
      setBound("define.success",profile.define.success);
      setBound("structure.outputFormat",profile.outputFormat);
      setBound("structure.requiredInput",profile.input);
      profile.steps.slice(0,6).forEach((step,index)=>setBound(`structure.steps.${index}`,step));
      setBound("structure.validationRules","계산·날짜·예산·우선순위 등 입력 조건을 다시 확인하고, 추측한 정보는 사실처럼 확정하지 않는다.");
      setBound("structure.stopRules","필수 입력이 부족하거나 서로 충돌하면 임의로 결정하지 말고 사용자에게 다시 질문한다.");
      setMode("modify");
    }
  }

  function bindAudience(){
    all("[data-audience]").forEach(button=>{
      button.setAttribute("aria-pressed","false");
      button.addEventListener("click",()=>renderAudience(button.dataset.audience,true));
    });

    const queryAudience=new URLSearchParams(location.search).get("audience");
    const queryValid=!!D.audienceExamples?.[queryAudience];
    let selected=queryValid?queryAudience:"elementary";
    if(!queryValid){
      try{selected=localStorage.getItem(audienceKey)||"elementary"}catch(_){ }
      if(!D.audienceExamples?.[selected]) selected="elementary";
    }

    renderAudience(selected,queryValid);

    if(queryValid){
      const chooser=$("#audienceChoices")?.closest("fieldset");
      if(chooser) chooser.hidden=true;
      const topActions=$(".top-actions");
      if(topActions&&!$("#changeExample")){
        const link=document.createElement("a");
        link.id="changeExample";
        link.className="btn secondary";
        link.href="./index.html";
        link.textContent="예시 다시 선택";
        topActions.prepend(link);
      }
    }

    $("#resetAll")?.addEventListener("click",()=>{
      try{localStorage.removeItem(audienceKey)}catch(_){ }
    });
  }

  function removeIntroGateNoise(){
    all("[data-diff]").forEach(el=>{
      if(!el.checked){
        el.checked=true;
        el.dispatchEvent(new Event("change",{bubbles:true}));
      }
    });
    const details=$(".promise-details");
    if(details) details.querySelector("summary").textContent="이 활동에서 지킬 3가지 원칙 보기";
  }

  function watch(){
    const nav=$("#stageButtons");
    if(nav){
      const observer=new MutationObserver(()=>requestAnimationFrame(renderFocus));
      observer.observe(nav,{subtree:true,attributes:true,attributeFilter:["aria-current","class"],childList:true});
    }
    ["#prevStage","#nextStage"].forEach(selector=>{
      $(selector)?.addEventListener("click",()=>setTimeout(renderFocus,0));
    });
    document.addEventListener("click",event=>{
      if(event.target.closest(".stage-button")) setTimeout(renderFocus,0);
    });
  }

  removeIntroGateNoise();
  bindAudience();
  renderFocus();
  watch();
})();
