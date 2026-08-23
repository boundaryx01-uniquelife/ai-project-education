(() => {
  let root = document.querySelector("[data-change-experiment]");
  const level = location.pathname.match(/level-(\d)/)?.[1];
  const presets = {
    "3": { title: "부산 생활 데이터 에이전트", preserve: "출처, 확인 시각, 정상·빈 결과·연결 오류 안내", choices: [["empty", "검색 결과가 없을 때 다음 검색 방법을 안내하는 기능", "01 · 빈 결과", "검색어 다시 안내", "결과가 없을 때도 다음 행동을 알 수 있을지 확인합니다."], ["field", "결과 카드에 학생에게 필요한 정보 항목 하나를 더 표시하는 기능", "02 · 정보 하나", "결과 항목 하나 추가", "실제 응답에서 무엇을 더 보여 줄지 확인합니다."], ["source", "출처와 확인 시각을 더 눈에 띄게 표시하는 기능", "03 · 믿을 수 있게", "근거 표시 강화", "데이터를 믿을 근거가 분명한지 확인합니다."]] },
    "4": { title: "AI 모델 활용 서비스", preserve: "자료 범위, 근거·한계 표시, 비밀키 보호", choices: [["source", "각 답변에 사용한 자료 제목을 더 분명하게 표시하는 기능", "01 · 근거", "자료 제목 강조", "답변의 근거를 사용자가 찾을 수 있을지 확인합니다."], ["limit", "답할 수 없는 질문에서 서비스의 한계와 다음 행동을 안내하는 기능", "02 · 한계", "답할 수 없을 때 안내", "무리한 답변 대신 안전한 안내가 되는지 확인합니다."], ["feedback", "사용자가 답변이 도움이 되었는지 남기는 간단한 피드백 기능", "03 · 다음 버전", "도움 여부 피드백", "다음 개선에 쓸 신호를 얻을 수 있을지 확인합니다."]] }
  };
  if (!root && presets[level]) {
    const preset = presets[level];
    const lastStage = document.querySelector('[data-stage="4"]');
    const lastLink = document.querySelector('[data-step-link="4"]');
    if (lastStage && lastLink) {
      lastStage.dataset.stage = "5";
      lastStage.querySelector(".eyebrow").textContent = "STEP 05";
      lastLink.dataset.stepLink = "5";
      lastLink.innerHTML = "<b>05</b> 테스트·내보내기";
      const navButton = document.createElement("button");
      navButton.type = "button";
      navButton.dataset.stepLink = "4";
      navButton.innerHTML = "<b>04</b> 작은 변경 실험";
      lastLink.before(navButton);
      root = document.createElement("section");
      root.className = "stage";
      root.dataset.stage = "4";
      root.dataset.changeExperiment = `level${level}`;
      root.dataset.changeTitle = preset.title;
      root.dataset.changePreserve = preset.preserve;
      root.innerHTML = `<div class="heading"><p class="eyebrow">STEP 04</p><h2>될까? 작은 변경을 먼저 실험합니다.</h2><p>현재 MVP를 보며 바꾸고 싶은 점 하나를 고릅니다. 같은 AI 대화에서 가능 여부와 최소 변경 방법을 먼저 묻고, 가능할 때만 수정합니다.</p></div><div class="experiment-grid">${preset.choices.map(([id,text,number,name,description], index) => `<button class="experiment-choice${index === 0 ? " selected" : ""}" type="button" data-experiment="${id}" data-experiment-text="${text}"><b>${number}</b><strong>${name}</strong><span>${description}</span></button>`).join("")}</div><label class="experiment-note" for="experimentNote"><b>내가 확인하고 싶은 점</b><textarea id="experimentNote" placeholder="예: 기존 결과 카드와 오류 안내는 그대로 유지되어야 해."></textarea></label><div class="experiment-prompt"><div class="prompt-head"><strong>AI에 보낼 작은 변경 실험 요청</strong><button class="copy" type="button" id="copyExperiment">복사</button></div><pre id="experimentPrompt"></pre></div><aside class="experiment-note-box"><strong>먼저 ‘될까?’를 묻습니다.</strong>AI가 어렵다고 판단하면 더 작은 대안으로 바꿉니다. 한 번에 여러 기능을 묶지 않습니다.</aside><div class="next-row"><button class="previous" type="button" data-prev>← 현재 MVP 다시 보기</button><p><b>다음 행동:</b> 바뀐 MVP와 기존 기준을 함께 확인합니다.</p><button class="next" type="button" data-next>STEP 05로 →</button></div>`;
      lastStage.before(root);
    }
  }
  if (!root) return;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const title = root.dataset.changeTitle;
  const preserve = root.dataset.changePreserve;
  const storageKey = `ai-project-change-experiment-${root.dataset.changeExperiment}`;
  const defaults = { choice: root.querySelector("[data-experiment]")?.dataset.experiment || "", note: "" };
  let state = { ...defaults };
  try { state = { ...state, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch {}

  function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function selectedText() { return root.querySelector(`[data-experiment="${state.choice}"]`)?.dataset.experimentText || ""; }
  function prompt() {
    const note = state.note.trim();
    return `이전 대화에서 만든 ‘${title}’ MVP를 이어서 고치고 있어.

이번에 해 보고 싶은 작은 변경: ${selectedText()}
${note ? `내가 덧붙이는 조건: ${note}` : ""}

먼저 이 변경이 현재 MVP에서 가능한지 짧게 판단해줘.
가능하다면 무엇을 최소로 바꾸면 되는지와 주의할 점을 먼저 알려줘.
그 다음 ${preserve}은 유지한 채, 바뀌는 파일의 전체 코드를 출력해줘.
어렵거나 현재 범위에 맞지 않다면 억지로 만들지 말고 더 작은 대안을 제안해줘.`;
  }
  function render() {
    $$('[data-experiment]').forEach((button) => button.classList.toggle("selected", button.dataset.experiment === state.choice));
    $("#experimentNote").value = state.note;
    $("#experimentPrompt").textContent = prompt();
  }
  function setStage(number) {
    $$(".stage").forEach((section) => section.classList.toggle("active", Number(section.dataset.stage) === number));
    $$('[data-step-link]').forEach((button) => button.classList.toggle("active", Number(button.dataset.stepLink) === number));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function copy() {
    const text = $("#experimentPrompt").textContent;
    try { await navigator.clipboard.writeText(text); } catch { const helper = document.createElement("textarea"); helper.value = text; document.body.append(helper); helper.select(); document.execCommand("copy"); helper.remove(); }
    const button = $("#copyExperiment"); button.textContent = "복사됨"; setTimeout(() => { button.textContent = "복사"; }, 1200);
  }

  $$('[data-step-link]').forEach((button) => { button.onclick = () => setStage(Number(button.dataset.stepLink)); });
  $$('[data-next]').forEach((button) => { button.onclick = () => setStage(Math.min(5, Number($(".stage.active").dataset.stage) + 1)); });
  $$('[data-prev]').forEach((button) => { button.onclick = () => setStage(Math.max(1, Number($(".stage.active").dataset.stage) - 1)); });
  $$('[data-experiment]').forEach((button) => { button.onclick = () => { state.choice = button.dataset.experiment; save(); render(); }; });
  $("#experimentNote").oninput = (event) => { state.note = event.target.value; save(); render(); };
  $("#copyExperiment").onclick = copy;
  render();
})();
