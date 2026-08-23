const CASES = [
  { text: "급식 잔반량을 입력하면 합계와 그래프를 보여 준다.", answer: "일반 웹앱", reason: "입력값을 정해진 규칙으로 계산하지만 AI가 판단하지는 않습니다." },
  { text: "‘우유팩은 어디에 버려?’라는 질문에 AI가 분리배출 방법을 설명한다.", answer: "AI 웹앱", reason: "AI가 질문에 대한 답을 만들지만, 여러 단계의 일을 처리하지는 않습니다." },
  { text: "문장을 넣으면 비속어 검사 → 바른 표현 만들기 → 결과 출력 순서로 처리한다.", answer: "AI Workflow", reason: "여러 단계지만 순서가 미리 정해져 있습니다." },
  { text: "시험일과 현재 실력을 보고 부족한 과목과 시간 배분을 판단해 계획을 만든다.", answer: "AI Agent", reason: "목표와 상황을 보고 무엇을 우선할지 판단합니다." },
  { text: "행사 준비 상태를 확인하고, 부족한 일을 찾아 다음 계획을 다시 수정한다.", answer: "Agentic AI", reason: "결과를 확인한 뒤 다음 행동을 바꾸는 단계가 있습니다." }
];

const OPTIONS = ["일반 웹앱", "AI 웹앱", "AI Workflow", "AI Agent", "Agentic AI"];
const quiz = document.querySelector("#quiz");

CASES.forEach((item, index) => {
  const card = document.createElement("article");
  card.className = "quiz-card";
  card.innerHTML = `<p><b>${index + 1}.</b> ${item.text}</p><div class="quiz-options">${OPTIONS.map((option) => `<button type="button" data-answer="${option}">${option}</button>`).join("")}</div><div class="quiz-feedback" aria-live="polite"></div>`;
  card.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    card.querySelectorAll("button").forEach((candidate) => candidate.classList.remove("selected"));
    button.classList.add("selected");
    const feedback = card.querySelector(".quiz-feedback");
    if (button.dataset.answer === item.answer) {
      feedback.textContent = `맞아요. ${item.reason}`;
      feedback.className = "quiz-feedback correct";
    } else {
      feedback.textContent = `다시 생각해 보세요. 힌트: ${item.reason}`;
      feedback.className = "quiz-feedback";
    }
  }));
  quiz.append(card);
});

document.querySelector("#copyTicket").addEventListener("click", async () => {
  const lines = [...document.querySelectorAll("[data-ticket]")].map((field) => `${field.previousSibling.textContent.trim()}: ${field.value.trim() || "(아직 생각 중)"}`);
  const text = `AI 프로젝트 시작 전 생각\n\n${lines.join("\n")}`;
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector("#ticketNotice").textContent = "복사했습니다. 다음 실습에서 붙여 넣어도 됩니다.";
  } catch {
    document.querySelector("#ticketNotice").textContent = "내용을 직접 선택해 복사해 주세요.";
  }
});
