import { icon } from "./icons.js";
import { getTheme, setTheme, seedIfEmpty, getAnimales, getEstadoVacunacion } from "./store.js";

const NAV_ITEMS = [
  { id: "dashboard", href: "dashboard.html", label: "Dashboard", icon: "home" },
  { id: "animales", href: "animales.html", label: "Animales", icon: "tag" },
  { id: "vacunacion", href: "vacunacion.html", label: "Vacunación", icon: "syringe" },
  { id: "trazabilidad", href: "trazabilidad.html", label: "Trazabilidad", icon: "clipboard" },
  { id: "configuracion", href: "configuracion.html", label: "Config.", icon: "gear" }
];

function alertCount() {
  const animales = getAnimales().filter((a) => a.estado === "Activo");
  return animales.filter((a) => {
    const s = getEstadoVacunacion(a.id).status;
    return s === "vencida" || s === "proxima";
  }).length;
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.innerHTML = theme === "dark" ? icon("sun", "size-5") : icon("moon", "size-5");
  });
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  applyTheme(next);
}

function sidebarHTML(active) {
  const badge = alertCount();
  const items = NAV_ITEMS.map((item) => {
    const isActive = item.id === active;
    const showBadge = item.id === "vacunacion" && badge > 0;
    return `
      <a href="${item.href}"
         class="group flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors focus-ring
                ${isActive ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-alt hover:text-text"}"
         ${isActive ? 'aria-current="page"' : ""}>
        <span class="shrink-0">${icon(item.icon, "size-5")}</span>
        <span class="flex-1">${item.label}</span>
        ${showBadge ? `<span class="grid place-items-center min-w-5 h-5 rounded-full bg-danger text-white text-[11px] font-semibold px-1">${badge}</span>` : ""}
      </a>`;
  }).join("");

  return `
    <aside class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 border-r border-border bg-surface no-print">
      <a href="index.html" class="flex items-center gap-2.5 px-5 h-16 border-b border-border focus-ring">
        <span class="grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${icon("logo", "size-5")}</span>
        <div class="leading-tight">
          <p class="font-display font-semibold text-text">MiHato</p>
          <p class="text-[11px] text-text-muted">Control de hato</p>
        </div>
      </a>
      <nav class="flex-1 px-3 py-4 space-y-1" aria-label="Navegación principal">${items}</nav>
      <div class="p-3 border-t border-border">
        <button type="button" class="theme-toggle focus-ring w-full flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-text" aria-pressed="false">
          ${icon("moon", "size-5")}
          <span>Modo oscuro</span>
        </button>
      </div>
    </aside>`;
}

function topbarHTML({ title, subtitle, actions }) {
  return `
    <header class="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 sm:px-6 border-b border-border bg-surface/95 backdrop-blur no-print">
      <a href="index.html" class="flex items-center gap-2 lg:hidden focus-ring rounded-control">
        <span class="grid place-items-center size-8 rounded-full bg-primary-soft text-primary">${icon("logo", "size-4")}</span>
        <span class="font-display font-semibold text-text">MiHato</span>
      </a>
      <div class="hidden lg:block flex-1 min-w-0">
        <h1 class="font-display text-xl font-semibold text-text truncate">${title}</h1>
        ${subtitle ? `<p class="text-sm text-text-muted truncate">${subtitle}</p>` : ""}
      </div>
      <div class="flex-1 lg:hidden"></div>
      <div class="flex items-center gap-2 shrink-0">
        ${actions || ""}
        <button type="button" class="theme-toggle lg:hidden focus-ring grid place-items-center size-10 rounded-control text-text-muted hover:bg-surface-alt hover:text-text" aria-pressed="false" aria-label="Cambiar a modo oscuro">
          ${icon("moon", "size-5")}
        </button>
      </div>
    </header>
    <div class="lg:hidden px-4 sm:px-6 pt-4">
      <h1 class="font-display text-lg font-semibold text-text">${title}</h1>
      ${subtitle ? `<p class="text-sm text-text-muted mt-0.5">${subtitle}</p>` : ""}
    </div>`;
}

function bottomNavHTML(active) {
  const badge = alertCount();
  const items = NAV_ITEMS.map((item) => {
    const isActive = item.id === active;
    const showBadge = item.id === "vacunacion" && badge > 0;
    return `
      <a href="${item.href}" ${isActive ? 'aria-current="page"' : ""}
         class="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium focus-ring rounded-control
                ${isActive ? "text-primary" : "text-text-muted"}">
        <span class="relative">
          ${icon(item.icon, "size-5")}
          ${showBadge ? `<span class="absolute -top-1 -right-1.5 size-2.5 rounded-full bg-danger ring-2 ring-surface"></span>` : ""}
        </span>
        ${item.label}
      </a>`;
  }).join("");

  return `
    <nav aria-label="Navegación principal" class="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] no-print">
      ${items}
    </nav>`;
}

export function renderLayout(active, { title, subtitle = "", actions = "" } = {}) {
  seedIfEmpty();

  const skip = document.createElement("a");
  skip.href = "#main-content";
  skip.className =
    "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-control";
  skip.textContent = "Saltar al contenido principal";
  document.body.prepend(skip);

  const sidebarRoot = document.getElementById("sidebar-root");
  const topbarRoot = document.getElementById("topbar-root");
  const bottomNavRoot = document.getElementById("bottomnav-root");

  if (sidebarRoot) sidebarRoot.innerHTML = sidebarHTML(active);
  if (topbarRoot) topbarRoot.innerHTML = topbarHTML({ title, subtitle, actions });
  if (bottomNavRoot) bottomNavRoot.innerHTML = bottomNavHTML(active);

  applyTheme(getTheme());
  document.querySelectorAll(".theme-toggle").forEach((btn) => btn.addEventListener("click", toggleTheme));

  const main = document.getElementById("main-content");
  if (main) main.setAttribute("tabindex", "-1");
}

export { NAV_ITEMS };
