const slides = [...document.querySelectorAll("[data-slide]")];
const labels = ["OPENING", "AGREEMENT", "COMPARE", "COMPARE", "COMPARE", "CORE IDEA", "EXTENSION", "DISTINCTION", "PROJECT WORDS", "EXIT"];
const current = document.querySelector("#current");
const total = document.querySelector("#total");
const label = document.querySelector("#slideLabel");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
let activeIndex = 0;

total.textContent = slides.length;

function render(index) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.hidden = !isActive;
    slide.classList.toggle("is-active", isActive);
  });
  current.textContent = activeIndex + 1;
  label.textContent = labels[activeIndex];
  previous.disabled = activeIndex === 0;
  next.disabled = activeIndex === slides.length - 1;
}

previous.addEventListener("click", () => render(activeIndex - 1));
next.addEventListener("click", () => render(activeIndex + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") render(activeIndex - 1);
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    render(activeIndex + 1);
  }
  if (event.key.toLowerCase() === "f") document.querySelector("#fullscreen").click();
});

document.querySelector("#fullscreen").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    document.querySelector("#fullscreen").textContent = "브라우저 전체 화면 사용";
  }
});

render(0);
