const TOPICS = [
  { id: "price", number: "01", name: "부산 생활필수품 가격 비교", description: "품목·시장별 가격 정보를 찾아 비교하는 화면을 만듭니다.", source: "부산광역시 생활필수품 가격 정보", docs: "https://www.data.go.kr/data/15034041/openapi.do", sample: [{ title: "우유", detail: "부산 지역 가격 정보", value: "결과 확인" }] },
  { id: "good-price", number: "02", name: "부산 착한가격업소 찾기", description: "가격과 메뉴 정보를 바탕으로 동네의 가게 정보를 정리합니다.", source: "부산광역시 착한가격업소 메뉴 정보", docs: "https://www.data.go.kr/data/15145474/openapi.do", sample: [{ title: "착한가격업소", detail: "메뉴·가격 정보", value: "결과 확인" }] },
  { id: "traffic", number: "03", name: "부산 도로 통행속도 보기", description: "도로 구간의 통행속도 정보를 읽기 쉬운 상태 카드로 바꿉니다.", source: "부산광역시 구간통행속도 정보", docs: "https://www.data.go.kr/data/15121074/openapi.do", sample: [{ title: "부산 도로 구간", detail: "통행 속도 정보", value: "실시간 확인" }] }
];

const KEY = "level3-data-practice-v2";
const state = { topic: "price", url: "", query: "", keyParam: "serviceKey", queryParam: "", result: null, tests: {} };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {} }
function topic() { return TOPICS.find(item => item.id === state.topic) || TOPICS[0]; }
function esc(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char])); }
function now() { return new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "short" }).format(new Date()); }

function renderTopics() {
  const root = $("#choices");
  root.innerHTML = "";
  TOPICS.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice" + (item.id === state.topic ? " selected" : "");
    button.innerHTML = `<small>PROJECT ${item.number} · AUTO APPROVAL</small><span class="check">✓</span><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p>`;
    button.onclick = () => { state.topic = item.id; state.result = null; renderAll(); save(); };
    root.append(button);
  });
}

function prompt() {
  const item = topic();
  return `부산 생활 데이터 앱 ‘${item.name}’의 결과 화면을 만들어줘.

공공데이터포털 API 설명서: ${item.docs}
입력: 사용자가 API 설명서에 맞게 넣는 검색어 또는 조건
결과: 실제 응답에서 필요한 정보만 골라 카드로 보여주고, 데이터 출처와 확인 시각을 표시한다.

정상 결과, 검색 결과 없음, 데이터 연결 오류를 각각 분명하게 보여줘.
개인 개발키는 실행 중 입력칸에서만 받고, JavaScript 코드·localStorage·GitHub 저장소·배포본에는 절대 저장하지 마.
개발키가 비어 있을 때는 API를 호출하지 말고 입력 방법을 안내해줘.
API 설명서의 실제 요청값과 응답 필드 이름을 확인한 뒤, 바뀐 파일의 전체 코드를 파일명별로 출력해줘.`;
}

function renderPrompt() { $("#promptText").textContent = prompt(); }

function renderResult() {
  const list = $("#resultList");
  list.innerHTML = "";
  const data = state.result;
  if (!data) { $("#resultTitle").textContent = "아직 데이터를 요청하지 않았습니다."; $("#resultMeta").textContent = "정상 결과, 검색 결과 없음, 연결 오류를 각각 확인해 보세요."; return; }
  if (data.error) { $("#resultTitle").textContent = "데이터 연결 오류"; $("#resultMeta").textContent = data.error; return; }
  const rows = Array.isArray(data.rows) ? data.rows : [];
  if (!rows.length) { $("#resultTitle").textContent = "검색 결과가 없습니다."; $("#resultMeta").textContent = "검색어·필수 요청값·API 설명서를 다시 확인해 보세요."; return; }
  rows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "plan-item";
    item.innerHTML = `<b>${index + 1}</b><span><strong>${esc(row.title)}</strong> · ${esc(row.detail)} · ${esc(row.value)}</span>`;
    list.append(item);
  });
  $("#resultTitle").textContent = `${topic().name} · ${rows.length}건`;
  $("#resultMeta").textContent = `출처: ${data.source || topic().source} · 확인 시각: ${data.updatedAt || now()}`;
}

function renderAll() {
  renderTopics();
  $("#apiUrl").value = state.url;
  $("#keyParam").value = state.keyParam;
  $("#queryParam").value = state.queryParam;
  $("#query").value = state.query;
  $("#apiKey").value = "";
  renderPrompt();
  renderResult();
  $$('[data-test]').forEach(input => { input.checked = Boolean(state.tests[input.dataset.test]); });
}

function setStage(stage) {
  $$(".stage").forEach(section => section.classList.toggle("active", Number(section.dataset.stage) === stage));
  $$('[data-step-link]').forEach(button => button.classList.toggle("active", Number(button.dataset.stepLink) === stage));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function copy() {
  try { await navigator.clipboard.writeText(prompt()); } catch {}
  $("#copyPrompt").textContent = "복사됨";
  setTimeout(() => { $("#copyPrompt").textContent = "복사"; }, 1200);
}

function buildRequestUrl() {
  const rawUrl = $("#apiUrl").value.trim();
  const apiKey = $("#apiKey").value.trim();
  const keyParam = $("#keyParam").value.trim();
  const queryParam = $("#queryParam").value.trim();
  const query = $("#query").value.trim();
  if (!rawUrl || !apiKey || !keyParam) throw new Error("서비스 URL, 내 개발키, 키 요청값 이름을 모두 입력하세요.");
  const requestUrl = new URL(rawUrl);
  requestUrl.searchParams.set(keyParam, apiKey);
  if (queryParam && query) requestUrl.searchParams.set(queryParam, query);
  return requestUrl.toString();
}

function firstArray(value, depth = 0) {
  if (depth > 5 || value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "object") return [];
  for (const key of ["item", "items", "data", "results", "body", "response"]) {
    if (key in value) { const found = firstArray(value[key], depth + 1); if (found.length) return found; }
  }
  for (const child of Object.values(value)) { const found = firstArray(child, depth + 1); if (found.length) return found; }
  return [];
}

function toRows(payload) {
  return firstArray(payload).slice(0, 8).map((item, index) => {
    if (item == null || typeof item !== "object") return { title: `결과 ${index + 1}`, detail: "응답 값", value: String(item) };
    const values = Object.entries(item).filter(([, value]) => value != null && typeof value !== "object").slice(0, 3);
    return { title: values[0] ? `${values[0][0]}: ${values[0][1]}` : `결과 ${index + 1}`, detail: values[1] ? `${values[1][0]}: ${values[1][1]}` : "API 응답", value: values[2] ? `${values[2][0]}: ${values[2][1]}` : "확인" };
  });
}

async function fetchData() {
  let requestUrl;
  try { requestUrl = buildRequestUrl(); }
  catch (error) { $("#requestStatus").textContent = error.message; return; }
  $("#requestStatus").textContent = "내 개발키로 API에 직접 요청하는 중입니다…";
  try {
    const response = await fetch(requestUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("json")) throw new Error("JSON 응답이 아닙니다. API 설명서에서 JSON 요청 옵션과 응답 형식을 확인하세요.");
    const payload = await response.json();
    state.result = { source: topic().source, updatedAt: now(), rows: toRows(payload) };
    $("#requestStatus").textContent = "직접 API 응답을 받았습니다. 필요한 항목 이름을 확인해 결과 화면을 다듬으세요.";
  } catch (error) {
    const corsHint = /Failed to fetch|NetworkError/i.test(String(error)) ? " 브라우저 직접 호출을 허용하지 않는(CORS) API일 수 있습니다. 문서의 테스트 화면에서 먼저 확인하고 다른 자동승인 API로 바꿔 보세요." : "";
    state.result = { error: `연결하지 못했습니다: ${error.message}.${corsHint}` };
    $("#requestStatus").textContent = "연결 오류 상태를 표시했습니다.";
  }
  renderResult();
  save();
}

function download() {
  const text = `LEVEL 3 · ${topic().name}\n\n[공공데이터포털 문서]\n${topic().docs}\n\n[서비스 URL]\n${state.url || "미입력"}\n\n[키 요청값 이름]\n${state.keyParam || "serviceKey"}\n\n[검색 요청값 이름]\n${state.queryParam || "미입력"}\n\n[검색어 또는 값]\n${state.query || "미입력"}\n\n[결과 화면에 표시할 항목]\n출처 · 확인 시각 · 정상/빈 결과/연결 오류\n\n[개발키 규칙]\n개발키 값은 이 기록, 코드, 저장소, 배포본에 넣지 않는다.`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  link.download = "level3-api-connection-note.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

load();
renderAll();
$$('[data-step-link]').forEach(button => { button.onclick = () => setStage(Number(button.dataset.stepLink)); });
$$('[data-next]').forEach(button => { button.onclick = () => setStage(Math.min(4, Number($(".stage.active").dataset.stage) + 1)); });
$$('[data-prev]').forEach(button => { button.onclick = () => setStage(Math.max(1, Number($(".stage.active").dataset.stage) - 1)); });
$("#copyPrompt").onclick = copy;
$("#apiUrl").oninput = event => { state.url = event.target.value; save(); };
$("#keyParam").oninput = event => { state.keyParam = event.target.value; save(); };
$("#queryParam").oninput = event => { state.queryParam = event.target.value; save(); };
$("#query").oninput = event => { state.query = event.target.value; renderPrompt(); save(); };
$("#useSample").onclick = () => { state.result = { source: `${topic().source} (수업용 예시)`, updatedAt: now(), rows: topic().sample }; $("#requestStatus").textContent = "수업용 샘플 정상 결과를 표시했습니다."; renderResult(); save(); };
$("#fetchData").onclick = fetchData;
$$('[data-test]').forEach(input => { input.onchange = () => { state.tests[input.dataset.test] = input.checked; save(); }; });
$("#downloadContract").onclick = download;
