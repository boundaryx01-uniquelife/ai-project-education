(()=>{
  "use strict";

  const friendly=[
    "완성 모습 먼저 보기",
    "1. 목표 정하기",
    "2. 근거 넣기",
    "3. 작동 방식 만들기",
    "4. 에이전트 만들기",
    "5. AI로 시험하기",
    "6. 완성본 받기",
    "7. 개선하기"
  ];

  const titles=[
    "먼저 완성될 에이전트의 모습을 확인합니다.",
    "에이전트의 목표를 한 장면으로 확정합니다.",
    "에이전트가 믿고 사용할 근거를 넣습니다.",
    "입력을 받은 뒤 무엇을 어떤 순서로 할지 정합니다.",
    "앞의 내용을 실제 에이전트 카드로 조립합니다.",
    "생성형 AI에 보내 실제로 작동하는지 시험합니다.",
    "다른 사람이 다시 쓸 수 있는 완성 패키지를 받습니다.",
    "테스트 결과를 반영해 한 번 개선하고 끝냅니다."
  ];

  const missions=[
    "완성 예시를 보고 ‘누가 / 어떤 문제 / 어떤 결과’를 만들지 잡으세요.",
    "누가 언제 쓰며, 어떤 문제가 해결되면 성공인지 정하세요.",
    "에이전트가 답을 꾸며내지 않도록 확인 가능한 자료 3건을 넣으세요.",
    "사용자 입력 → 처리 순서 → 출력 → 검증·중단 조건을 연결하세요.",
    "자동 조립된 에이전트 카드를 읽고 실제로 쓸 수 있는지 확인하세요.",
    "정상·애매·실패 입력을 생성형 AI에 보내고 실제 답을 기록하세요.",
    "목표·근거·에이전트 카드·테스트가 한 패키지로 묶였는지 확인하세요.",
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

  function removeIntroGateNoise(){
    const diffs=all("[data-diff]");
    if(diffs.length===3&&diffs.every(el=>!el.checked)){
      diffs.forEach(el=>{
        el.checked=true;
        el.dispatchEvent(new Event("change",{bubbles:true}));
      });
    }
    const details=$(".promise-details");
    if(details){
      details.querySelector("summary").textContent="이 활동에서 지킬 3가지 원칙 보기";
    }
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
  renderFocus();
  watch();
})();
