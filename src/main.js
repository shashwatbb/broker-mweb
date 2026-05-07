import "./styles/main.css";

const PANEL_GAP = 16;

const track = document.getElementById("tabTrack");
const tabs = document.querySelectorAll(".bottom-nav__tab");
const panels = document.querySelectorAll(".tab-panel");
const chips = document.querySelectorAll(".chip");

function layoutTrack() {
  if (!track?.parentElement) return;
  const viewport = track.parentElement;
  const w = viewport.clientWidth;
  if (w <= 0) return;

  panels.forEach((panel) => {
    panel.style.flexBasis = `${w}px`;
    panel.style.width = `${w}px`;
  });

  const count = panels.length;
  const trackWidth = count * w + (count - 1) * PANEL_GAP;
  track.style.width = `${trackWidth}px`;

  const i = Number(track.dataset.active ?? 0);
  const offset = i * (w + PANEL_GAP);
  track.style.transform = `translateX(-${offset}px)`;
}

function setActiveTab(index) {
  if (!track) return;
  const i = Math.max(0, Math.min(2, Number(index)));
  track.dataset.active = String(i);

  tabs.forEach((tab, j) => {
    const active = j === i;
    tab.classList.toggle("bottom-nav__tab--active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel, j) => {
    const active = j === i;
    panel.setAttribute("aria-hidden", active ? "false" : "true");
  });

  layoutTrack();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.index);
  });
});

document.addEventListener("keydown", (e) => {
  if (!track) return;
  const current = Number(track.dataset.active || 0);
  if (e.key === "ArrowLeft" && current > 0) {
    e.preventDefault();
    setActiveTab(current - 1);
    tabs[current - 1].focus();
  }
  if (e.key === "ArrowRight" && current < 2) {
    e.preventDefault();
    setActiveTab(current + 1);
    tabs[current + 1].focus();
  }
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
  });
});

document.querySelector(".btn--add")?.addEventListener("click", () => {
  console.info("Add lead or listing");
});

window.addEventListener("resize", layoutTrack);

const viewport = track?.parentElement;
if (viewport && typeof ResizeObserver !== "undefined") {
  const ro = new ResizeObserver(() => layoutTrack());
  ro.observe(viewport);
}

requestAnimationFrame(() => {
  setActiveTab(Number(track?.dataset.active ?? 0));
});
