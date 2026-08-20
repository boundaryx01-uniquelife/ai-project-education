(() => {
  const key = "ai-project-education.learner-worksheets.v1";
  let values = {};
  try { values = JSON.parse(localStorage.getItem(key)) || {}; } catch (_) {}
  document.querySelectorAll("[data-field]").forEach(field => {
    const id = `${location.pathname}:${field.dataset.field}`;
    if (values[id] !== undefined) {
      if (field.type === "checkbox") field.checked = values[id];
      else field.value = values[id];
    }
    field.addEventListener("input", () => {
      values[id] = field.type === "checkbox" ? field.checked : field.value;
      try { localStorage.setItem(key, JSON.stringify(values)); } catch (_) {}
    });
    field.addEventListener("change", () => {
      values[id] = field.type === "checkbox" ? field.checked : field.value;
      try { localStorage.setItem(key, JSON.stringify(values)); } catch (_) {}
    });
  });
  document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
})();
