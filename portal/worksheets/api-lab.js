(() => {
  const lab = document.querySelector("[data-api-lab]");
  if (!lab) return;
  const endpoint = lab.querySelector("[data-api-endpoint]");
  const philosopher = lab.querySelector("[data-api-philosopher]");
  const question = lab.querySelector("[data-api-question]");
  const preview = lab.querySelector("[data-api-preview]");
  const status = lab.querySelector("[data-api-status]");
  const request = () => ({
    endpoint: `${endpoint.value.trim().replace(/\/$/, "") || "https://교사가-제공한-주소"}/api/chat`,
    method: "POST",
    body: { philosopher_id: philosopher.value, message: question.value.trim() || "질문을 입력하세요.", chat_history: [] }
  });
  const render = () => { preview.textContent = JSON.stringify(request(), null, 2); };
  [endpoint, philosopher, question].forEach(field => field.addEventListener("input", render));
  lab.querySelector("[data-copy-request]").addEventListener("click", () => {
    navigator.clipboard?.writeText(JSON.stringify(request(), null, 2)).then(() => {
      status.textContent = "요청 예시를 복사했습니다. 실제 전송은 교사가 배포 주소를 확인한 뒤에만 진행합니다.";
    }).catch(() => { status.textContent = "복사 권한을 사용할 수 없습니다. 아래 요청 예시를 직접 복사하세요."; });
  });
  lab.querySelector("[data-check-endpoint]").addEventListener("click", () => {
    status.textContent = endpoint.value.trim()
      ? "주소가 입력되었습니다. 실제 호출 전에 교사가 CORS·키 보관·오류 안내를 확인하세요."
      : "아직 교사용 API 주소가 없습니다. 이 실습에서는 실제 요청을 보내지 않습니다.";
  });
  render();
})();
