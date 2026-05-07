import "./styles/main.css";

const mqMobile = window.matchMedia("(max-width: 768px)");

if (!mqMobile.matches) {
  mqMobile.addEventListener("change", () => {
    if (mqMobile.matches) window.location.reload();
  });
} else {
  initBrokerApp();
}

/** Short vibration on supported devices (bottom nav, sheets). */
function haptic(ms = 14) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {
    /* ignore */
  }
}

const LEADS = {
  "rahul-verma": {
    name: "Rahul Verma",
    status: "New",
    added: "6 May 2026",
    channel: "WhatsApp Business · saved thread",
    interests: ["The Oberoi Sky Villas · 3 BHK", "Embassy Lake Terraces · Plot"],
    analysis: [
      "High intent: asked for floor plates and payment schedule in first hour.",
      "Budget signals align with luxury corridor; comparing two micro-markets.",
      "Reply latency ~12 minutes avg — engaged buyer persona.",
      "Suggested next step: send Oberoi comparison deck + slot two live voice notes.",
    ],
  },
  "karan-malhotra": {
    name: "Karan Malhotra",
    status: "New",
    added: "6 May 2026",
    channel: "WhatsApp · referral from Priya Shah",
    interests: ["Brigade Northridge Estate · Villa", "Mahindra Lifespaces · 3 BHK"],
    analysis: [
      "Early funnel but warm intro — trusts mutual connection.",
      "Asking about villa maintenance costs → serious lifestyle buyer.",
      "Likely weekend-only visits; optimise for Sat AM slots.",
      "Suggested next step: clubhouse walk-through video + plot vs villa matrix.",
    ],
  },
  "neha-krishnan": {
    name: "Neha Krishnan",
    status: "Follow-up",
    added: "4 May 2026",
    channel: "WhatsApp · organic inquiry",
    interests: ["Prestige Lakeside Habitat · 2 BHK"],
    analysis: [
      "Repeat viewer on lake-facing inventory — sentiment positive after site visit.",
      "Sensitive to commute time; maps screenshots shared twice.",
      "Risk: comparing resale vs primary — arm with registry timeline clarity.",
      "Suggested next step: soft hold on shortlisted tower + loan partner intro.",
    ],
  },
  "priya-shah": {
    name: "Priya Shah",
    status: "Follow-up",
    added: "3 May 2026",
    channel: "WhatsApp · investor circle",
    interests: ["The Oberoi Sky Villas · 4 BHK", "Embassy Boulevard · Penthouse"],
    analysis: [
      "Portfolio buyer language — ROI and rental yield mentioned early.",
      "Higher ticket comfort; may negotiate on payment milestones not price.",
      "Prefers written summaries over voice — keep PDF briefs tight.",
      "Suggested next step: cap-rate snapshot + penthouse inventory snapshot.",
    ],
  },
  "arjun-mehta": {
    name: "Arjun Mehta",
    status: "Qualified",
    added: "1 May 2026",
    channel: "WhatsApp · conference intro",
    interests: ["Salarpuria Sattva · Commercial", "Whitefield micro-market · Land"],
    analysis: [
      "Commercial + land mix suggests expansion / HQ relocation use-case.",
      "Asked about FAR and sanction timelines — involve technical FAQ once.",
      "Decision cadence monthly — stay on calendar with milestone reminders.",
      "Suggested next step: shell vs fitted TCO sheet + traffic pulse ORR.",
    ],
  },
  "vikram-rao": {
    name: "Vikram Rao",
    status: "Qualified",
    added: "30 Apr 2026",
    channel: "WhatsApp · repeat client",
    interests: ["Mahindra Lifespaces · 2 BHK", "Brigade Northridge · Plot + villa"],
    analysis: [
      "Historically closes after 2–3 nudges — maintain polite persistence.",
      "Cross-shopping Mahindra vs Brigade — differentiation should be lifestyle + commute.",
      "Low ghost risk; acknowledges messages even when busy.",
      "Suggested next step: side-by-side amenity scorecard + loan sanction checklist.",
    ],
  },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderLeadDetail(data) {
  const interests = data.interests.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const bullets = data.analysis.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  return `
    <div class="lead-detail">
      <p class="lead-detail__meta">
        <span class="lead-detail__pill">${escapeHtml(data.status)}</span>
        <span class="lead-detail__dot">·</span>
        <span>Added ${escapeHtml(data.added)}</span>
      </p>
      <p class="lead-detail__channel">${escapeHtml(data.channel)}</p>

      <section class="lead-detail__section">
        <h3 class="lead-detail__h">Property interests</h3>
        <ul class="lead-detail__list">${interests}</ul>
      </section>

      <section class="lead-detail__section lead-detail__section--analysis">
        <h3 class="lead-detail__h">Profile analysis</h3>
        <p class="lead-detail__intro">Light-weight read based on WhatsApp behaviour — refine after your next call.</p>
        <ul class="lead-detail__bullets">${bullets}</ul>
      </section>
    </div>
  `;
}

function initBrokerApp() {
  const PANEL_GAP = 16;

  const track = document.getElementById("tabTrack");
  const tabs = document.querySelectorAll(".bottom-nav__tab");
  const panels = document.querySelectorAll(".tab-panel");
  const chips = document.querySelectorAll(".chip");

  const leadSheet = document.getElementById("leadDetailSheet");
  const leadBody = document.getElementById("leadDetailBody");
  const leadTitle = document.getElementById("leadDetailTitle");
  const leadBack = document.getElementById("leadDetailBack");

  const pdfSheet = document.getElementById("pdfSheet");
  const pdfFrame = document.getElementById("pdfFrame");
  const pdfTitle = document.getElementById("pdfSheetTitle");
  const pdfBack = document.getElementById("pdfSheetBack");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      haptic(12);
      setActiveTab(tab.dataset.index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (pdfSheet?.classList.contains("is-open")) {
        closePdfViewer();
        return;
      }
      if (leadSheet?.classList.contains("is-open")) {
        closeLeadDetail();
        return;
      }
    }
    if (!track) return;
    const current = Number(track.dataset.active || 0);
    if (e.key === "ArrowLeft" && current > 0) {
      e.preventDefault();
      haptic(8);
      setActiveTab(current - 1);
      tabs[current - 1].focus();
    }
    if (e.key === "ArrowRight" && current < 2) {
      e.preventDefault();
      haptic(8);
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

  function openLeadDetail(id) {
    const data = LEADS[id];
    if (!data || !leadSheet || !leadBody || !leadTitle) return;
    haptic(16);
    leadTitle.textContent = data.name;
    leadBody.innerHTML = renderLeadDetail(data);
    leadSheet.hidden = false;
    leadSheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (prefersReducedMotion) {
      leadSheet.classList.add("is-open");
    } else {
      requestAnimationFrame(() => leadSheet.classList.add("is-open"));
    }
  }

  function closeLeadDetail() {
    if (!leadSheet) return;
    leadSheet.classList.remove("is-open");
    document.body.style.overflow = "";
    const done = () => {
      leadSheet.hidden = true;
      leadSheet.setAttribute("aria-hidden", "true");
      if (leadBody) leadBody.innerHTML = "";
    };
    if (prefersReducedMotion) {
      done();
    } else {
      window.setTimeout(done, 320);
    }
  }

  function openPdfViewer(relativePath, title) {
    if (!pdfSheet || !pdfFrame || !pdfTitle) return;
    haptic(14);
    let absolute;
    try {
      absolute = new URL(relativePath, window.location.href).href;
    } catch {
      absolute = relativePath;
    }
    pdfTitle.textContent = title || "Property brief";
    pdfFrame.src = absolute;
    pdfSheet.hidden = false;
    pdfSheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (prefersReducedMotion) {
      pdfSheet.classList.add("is-open");
    } else {
      requestAnimationFrame(() => pdfSheet.classList.add("is-open"));
    }
  }

  function closePdfViewer() {
    if (!pdfSheet || !pdfFrame) return;
    pdfSheet.classList.remove("is-open");
    const done = () => {
      pdfSheet.hidden = true;
      pdfSheet.setAttribute("aria-hidden", "true");
      pdfFrame.src = "";
      document.body.style.overflow = "";
    };
    if (prefersReducedMotion) {
      done();
    } else {
      window.setTimeout(done, 320);
    }
  }

  const panelLeads = document.getElementById("panel-leads");
  panelLeads?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-lead-id]");
    if (!card) return;
    openLeadDetail(card.dataset.leadId);
  });

  panelLeads?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-lead-id]");
    if (!card || e.target !== card) return;
    e.preventDefault();
    openLeadDetail(card.dataset.leadId);
  });

  leadBack?.addEventListener("click", () => closeLeadDetail());
  pdfBack?.addEventListener("click", () => closePdfViewer());

  document.querySelectorAll("a.js-open-pdf").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pdf = link.dataset.pdf;
      const title = link.dataset.listingTitle || "Property brief";
      if (pdf) openPdfViewer(pdf, title);
    });
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
}
