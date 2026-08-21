import { icon } from "./icons.js";
import { getTheme, setTheme } from "./store.js";
import { normalizeText } from "./utils.js";

function injectIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, el.dataset.iconSize || "size-5");
  });
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  const btn = document.getElementById("theme-toggle");
  btn.setAttribute("aria-pressed", String(isDark));
  btn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  btn.querySelector("[data-icon]").innerHTML = isDark ? icon("sun", "size-5") : icon("moon", "size-5");
}

function initTheme() {
  applyTheme(getTheme());
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");

  function close() {
    menu.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector("[data-icon]").innerHTML = icon("menu", "size-5");
  }

  function open() {
    menu.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
    toggle.querySelector("[data-icon]").innerHTML = icon("x", "size-5");
  }

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("hidden")) open();
    else close();
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.classList.contains("hidden")) {
      close();
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
    if (e.matches) close();
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));

  // Red de seguridad: si por lo que sea el observer nunca dispara, el contenido no debe quedar invisible.
  setTimeout(() => targets.forEach((el) => el.classList.add("is-visible")), 1500);
}

function getFaqData() {
  return Array.from(document.querySelectorAll(".faq-item")).map((el) => ({
    el,
    id: el.dataset.faqId,
    question: el.querySelector("summary span").textContent.trim(),
    answer: el.querySelector("p").textContent.trim()
  }));
}

function initFaqInlineSearch(faqItems) {
  const input = document.getElementById("faq-search");
  const emptyMsg = document.getElementById("faq-empty");

  function filter() {
    const query = normalizeText(input.value.trim());
    let visibleCount = 0;

    faqItems.forEach((item) => {
      const matches = !query || normalizeText(`${item.question} ${item.answer}`).includes(query);
      item.el.classList.toggle("hidden", !matches);
      if (matches) visibleCount++;
    });

    emptyMsg.classList.toggle("hidden", visibleCount > 0);
  }

  input.addEventListener("input", filter);
}

function openFaqItem(item) {
  item.el.open = true;
  item.el.scrollIntoView({ block: "center" });
  item.el.querySelector("summary").focus();
}

function initFaqPalette(faqItems) {
  const hintButton = document.getElementById("faq-palette-hint");
  let backdrop = null;
  let paletteInput = null;
  let resultsList = null;
  let activeIndex = 0;
  let currentResults = faqItems;

  function renderResults() {
    resultsList.innerHTML = currentResults.length
      ? currentResults
          .map(
            (item, i) => `
        <button type="button" data-index="${i}"
          class="faq-palette-result w-full text-left px-4 py-3 rounded-control flex items-center justify-between gap-3 ${i === activeIndex ? "bg-primary-soft text-primary" : "text-text hover:bg-surface-alt"}">
          <span class="text-sm font-medium">${item.question}</span>
          <span class="shrink-0 text-xs opacity-70">${icon("arrowRight", "size-3.5")}</span>
        </button>`
          )
          .join("")
      : `<p class="px-4 py-6 text-center text-sm text-text-muted">Sin resultados. Prueba con otra palabra.</p>`;
  }

  function selectResult(index) {
    const item = currentResults[index];
    if (!item) return;
    closePalette();
    openFaqItem(item);
  }

  function filterPalette() {
    const query = normalizeText(paletteInput.value.trim());
    currentResults = !query ? faqItems : faqItems.filter((item) => normalizeText(`${item.question} ${item.answer}`).includes(query));
    activeIndex = 0;
    renderResults();
  }

  function closePalette() {
    if (!backdrop) return;
    document.body.style.overflow = "";
    backdrop.remove();
    backdrop = null;
    document.removeEventListener("keydown", onPaletteKeydown);
  }

  function onPaletteKeydown(e) {
    if (e.key === "Escape") {
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentResults.length - 1);
      renderResults();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderResults();
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectResult(activeIndex);
    }
  }

  function openPalette() {
    if (backdrop) return;
    currentResults = faqItems;
    activeIndex = 0;

    backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 z-[200] flex items-start justify-center bg-black/40 p-4 pt-[10vh] animate-[fade-in_0.15s_ease-out]";
    backdrop.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="Buscar en preguntas frecuentes"
           class="w-full max-w-lg rounded-card bg-surface border border-border shadow-lifted overflow-hidden animate-[scale-in_0.15s_ease-out]">
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <span class="text-text-muted shrink-0">${icon("search", "size-4.5")}</span>
          <input id="faq-palette-input" type="text" placeholder="Busca en las preguntas frecuentes…"
            class="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none" autocomplete="off" />
          <kbd class="font-sans shrink-0">Esc</kbd>
        </div>
        <div id="faq-palette-results" class="max-h-80 overflow-y-auto scrollbar-thin p-2"></div>
      </div>`;

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    paletteInput = backdrop.querySelector("#faq-palette-input");
    resultsList = backdrop.querySelector("#faq-palette-results");
    renderResults();
    paletteInput.focus();

    paletteInput.addEventListener("input", filterPalette);
    resultsList.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-palette-result");
      if (btn) selectResult(Number(btn.dataset.index));
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closePalette();
    });
    document.addEventListener("keydown", onPaletteKeydown);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette();
    }
  });

  hintButton.addEventListener("click", openPalette);
}

function initFaq() {
  const faqItems = getFaqData();
  if (faqItems.length === 0) return;
  initFaqInlineSearch(faqItems);
  initFaqPalette(faqItems);
}

injectIcons();
initTheme();
initMobileMenu();
initScrollReveal();
initFaq();
