const EXAMPLES = {
  study: { id: "study", number: "01", name: "시험 집중 플래너", short: "STUDY FLOW", purpose: "과목과 오늘 가능한 시간을 기록하고, 오늘 할 일을 세 개까지 관리합니다.", label: "오늘 집중할 과목 또는 할 일", chips: ["과목", "가능 시간", "완료 체크"] },
  project: { id: "project", number: "02", name: "수행평가·모둠 프로젝트 보드", short: "PROJECT BOARD", purpose: "수행평가와 모둠 프로젝트의 준비물·역할·마감 일을 한곳에 기록합니다.", label: "준비할 일 또는 역할", chips: ["마감", "준비물", "역할"] },
  career: { id: "career", number: "03", name: "나의 진로 선택 기준 카드", short: "MY COMPASS", purpose: "관심, 강점, 중요하게 여기는 가치를 카드로 적고 탐색 주제를 정리합니다.", label: "나에게 중요한 관심·강점·가치", chips: ["관심", "강점", "가치"] }
};

const state = { example: "study", file: "index.html", files: {}, originals: {}, tests: {} };
const STORAGE_KEY = "ai-project-education-level1-practice-v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#saveNotice").textContent = "자동 저장됨";
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && EXAMPLES[saved.example]) Object.assign(state, saved);
  } catch { /* Keep the starter example when storage is unavailable. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
}

function indexFile(config) {
  const safeConfig = JSON.stringify(config);
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ff705a">
  <link rel="manifest" href="./manifest.webmanifest">
  <title>${escapeHtml(config.name)}</title>
  <style>
    :root { font-family: Arial, "Malgun Gothic", sans-serif; color: #17192d; background: #f8f7f3; }
    * { box-sizing: border-box; } body { margin: 0; } main { width: min(100% - 32px, 620px); margin: 0 auto; padding: 28px 0 56px; }
    .eyebrow { color: #d85741; font-size: .72rem; font-weight: 800; letter-spacing: .12em; } h1 { margin: 8px 0; font-size: clamp(2rem, 8vw, 3.3rem); line-height: 1.05; letter-spacing: -.06em; }
    .lead { color: #666b7c; } form, li { background: #fff; border: 1px solid #dfded9; border-radius: 14px; } form { display: grid; gap: 9px; padding: 15px; margin-top: 25px; }
    label { font-size: .82rem; font-weight: 800; } input { width: 100%; margin-top: 5px; border: 1px solid #cfd0d4; border-radius: 9px; padding: 11px; font: inherit; }
    button { border: 0; border-radius: 999px; background: #17192d; color: #fff; padding: 11px 15px; font: inherit; font-weight: 800; cursor: pointer; }
    ul { display: grid; gap: 9px; margin: 14px 0 0; padding: 0; list-style: none; } li { display: flex; align-items: center; gap: 10px; padding: 12px; } li.done { opacity: .56; text-decoration: line-through; }
    li button { flex: 0 0 auto; width: 29px; height: 29px; padding: 0; background: #ff705a; } li span { flex: 1; } .empty { display: block; padding: 18px; color: #777c8d; text-align: center; }
    .notice { margin-top: 22px; color: #777c8d; font-size: .76rem; }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow" id="short"></p><h1 id="title"></h1><p class="lead" id="purpose"></p>
    <form id="entryForm"><label id="entryLabel" for="entry"></label><input id="entry" required autocomplete="off"><button type="submit">목록에 추가</button></form>
    <ul id="list"></ul><p class="notice">이 기록은 이 브라우저에만 저장됩니다.</p>
  </main>
  <script>
    const config = ${safeConfig};
    const key = "pwa-" + config.id + "-items";
    let fallbackItems = [];
    const read = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return fallbackItems; } };
    const write = (items) => { fallbackItems = items; try { localStorage.setItem(key, JSON.stringify(items)); } catch {} };
    const el = (id) => document.getElementById(id);
    el("short").textContent = config.short; el("title").textContent = config.name; el("purpose").textContent = config.purpose; el("entryLabel").textContent = config.label;
    function render() { const items = read(); const list = el("list"); list.innerHTML = ""; if (!items.length) { list.innerHTML = '<li class="empty">첫 항목을 추가해 보세요.</li>'; return; }
      items.forEach((item, index) => { const row = document.createElement("li"); if (item.done) row.className = "done"; const toggle = document.createElement("button"); toggle.textContent = item.done ? "✓" : "○"; toggle.setAttribute("aria-label", "완료 상태 바꾸기"); toggle.onclick = () => { items[index].done = !items[index].done; write(items); render(); }; const text = document.createElement("span"); text.textContent = item.text; const remove = document.createElement("button"); remove.textContent = "×"; remove.setAttribute("aria-label", "항목 삭제"); remove.onclick = () => { items.splice(index, 1); write(items); render(); }; row.append(toggle, text, remove); list.append(row); }); }
    el("entryForm").onsubmit = (event) => { event.preventDefault(); const input = el("entry"); const text = input.value.trim(); if (!text) return; const items = read(); items.unshift({ text, done: false }); write(items); input.value = ""; render(); }; render();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  <\/script>
</body>
</html>`;
}

function manifestFile(config) {
  return JSON.stringify({ name: config.name, short_name: config.short, start_url: "./", display: "standalone", background_color: "#f8f7f3", theme_color: "#ff705a", icons: [{ src: "./icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] }, null, 2);
}

function workerFile() {
  return `const CACHE_NAME = "my-life-pwa-v1";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./service-worker.js", "./icon.svg"];

self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => event.respondWith(caches.match(event.request).then((saved) => saved || fetch(event.request))));`;
}

function iconFile() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#ff705a"/><path d="M36 38h56v52H36z" fill="#fff"/><path d="M47 31h8v16h-8zm26 0h8v16h-8zM47 59h34v7H47zm0 15h24v7H47z" fill="#17192d"/></svg>`;
}

function starterFiles(config) {
  return { "index.html": indexFile(config), "manifest.webmanifest": manifestFile(config), "service-worker.js": workerFile(), "icon.svg": iconFile() };
}

function currentConfig() { return state.config || EXAMPLES[state.example]; }

function renderExamples() {
  const grid = $("#exampleGrid");
  grid.innerHTML = "";
  Object.values(EXAMPLES).forEach((example) => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "example-card" + (state.example === example.id && !state.custom ? " selected" : "");
    card.innerHTML = `<span class="example-number">EXAMPLE ${example.number}</span><span class="check">✓</span><h3>${escapeHtml(example.name)}</h3><p>${escapeHtml(example.purpose)}</p><div class="chips">${example.chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}</div>`;
    card.addEventListener("click", () => selectExample(example)); grid.append(card);
  });
}

function selectExample(config, custom = false) {
  state.example = config.id; state.config = config; state.custom = custom; state.files = starterFiles(config); state.originals = { ...state.files }; state.file = "index.html";
  renderExamples(); renderPrompt(); renderEditor(); refreshPreview(); saveState();
}

function renderPrompt() {
  const config = currentConfig();
  $("#promptText").textContent = `고등학생이 쓰는 ‘${config.name}’ PWA를 만들어줘.

사용자가 기록할 내용: ${config.label}
앱이 도울 일: ${config.purpose}
필수 기능: 새 항목 추가, 완료 표시, 항목 삭제, 브라우저 새로고침 뒤 기록 유지(localStorage), 휴대폰 화면 대응.

외부 라이브러리, CDN, API, 서버, 로그인, DB는 사용하지 마.
PWA 설치를 위해 index.html, manifest.webmanifest, service-worker.js, icon.svg의 전체 코드를 파일명별 Markdown 코드 블록으로 출력해줘.
설명은 짧게 하고, 바로 실행 가능한 파일 전체 코드를 빠뜨리지 마.`;
}

function renderEditor() {
  $$("[data-file]").forEach((button) => button.classList.toggle("active", button.dataset.file === state.file));
  $("#codeEditor").value = state.files[state.file] || "";
}

function refreshPreview() {
  $("#previewFrame").srcdoc = state.files["index.html"] || "<p>index.html 파일을 넣어 주세요.</p>";
}

function setStep(number) {
  $$(".step").forEach((section) => section.classList.toggle("active", Number(section.dataset.step) === number));
  $$("[data-step-link]").forEach((button) => button.classList.toggle("active", Number(button.dataset.stepLink) === number));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function copyPrompt() {
  const text = $("#promptText").textContent;
  try { await navigator.clipboard.writeText(text); } catch { const helper = document.createElement("textarea"); helper.value = text; document.body.append(helper); helper.select(); document.execCommand("copy"); helper.remove(); }
  const button = $("[data-copy='promptText']"); button.textContent = "복사됨"; setTimeout(() => { button.textContent = "복사"; }, 1400);
}

function download(filename, text, type) {
  const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

function downloadReadme() {
  const config = currentConfig();
  download("README-DEPLOY.txt", `${config.name} PWA 배포 안내

1. 이 폴더의 index.html, manifest.webmanifest, service-worker.js, icon.svg를 같은 GitHub 저장소의 최상위에 올립니다.
2. GitHub 저장소 Settings > Pages에서 배포 브랜치와 폴더를 선택합니다.
3. 배포 주소를 휴대폰 Chrome으로 열고 메뉴에서 '홈 화면에 추가' 또는 '설치'를 선택합니다.
4. 설치한 앱을 열어 기록 추가, 완료 표시, 새로고침 후 저장을 다시 확인합니다.

주의: service worker는 HTTPS 배포 주소에서만 정상 동작합니다. API 키나 개인정보를 이 PWA 코드에 넣지 마세요.`, "text/plain;charset=utf-8");
}

function bindEvents() {
  $$("[data-step-link]").forEach((button) => button.addEventListener("click", () => setStep(Number(button.dataset.stepLink))));
  $$("[data-next]").forEach((button) => button.addEventListener("click", () => { const now = Number($(".step.active").dataset.step); setStep(Math.min(4, now + 1)); }));
  $$("[data-prev]").forEach((button) => button.addEventListener("click", () => { const now = Number($(".step.active").dataset.step); setStep(Math.max(1, now - 1)); }));
  $("[data-copy='promptText']").addEventListener("click", copyPrompt);
  $$("[data-file]").forEach((button) => button.addEventListener("click", () => { state.file = button.dataset.file; renderEditor(); saveState(); }));
  $("#codeEditor").addEventListener("input", (event) => { state.files[state.file] = event.target.value; $("#saveNotice").textContent = "수정 저장됨"; saveState(); });
  $("#refreshPreview").addEventListener("click", () => { refreshPreview(); $("#saveNotice").textContent = "미리보기를 갱신했습니다"; });
  $("#resetFile").addEventListener("click", () => { state.files[state.file] = state.originals[state.file]; renderEditor(); refreshPreview(); saveState(); });
  $("#useCustom").addEventListener("click", () => { const name = $("#customName").value.trim(); const label = $("#customLabel").value.trim(); const purpose = $("#customPurpose").value.trim(); if (!name || !label || !purpose) { alert("앱 이름, 기록할 한 가지, 앱이 도울 일을 모두 적어 주세요."); return; } selectExample({ id: "custom", number: "ME", name, short: "MY APP", label, purpose, chips: ["나의 기록", "완료", "저장"] }, true); });
  $$("[data-test]").forEach((checkbox) => { checkbox.checked = Boolean(state.tests[checkbox.dataset.test]); checkbox.addEventListener("change", () => { state.tests[checkbox.dataset.test] = checkbox.checked; saveState(); }); });
  $("#downloadIndex").addEventListener("click", () => download("index.html", state.files["index.html"], "text/html;charset=utf-8"));
  $("#downloadManifest").addEventListener("click", () => download("manifest.webmanifest", state.files["manifest.webmanifest"], "application/manifest+json;charset=utf-8"));
  $("#downloadWorker").addEventListener("click", () => download("service-worker.js", state.files["service-worker.js"], "text/javascript;charset=utf-8"));
  $("#downloadIcon").addEventListener("click", () => download("icon.svg", state.files["icon.svg"], "image/svg+xml;charset=utf-8"));
  $("#downloadReadme").addEventListener("click", downloadReadme);
}

loadState();
if (!state.files || !state.files["index.html"]) selectExample(state.config || EXAMPLES[state.example]);
else { renderExamples(); renderPrompt(); renderEditor(); refreshPreview(); }
bindEvents();
