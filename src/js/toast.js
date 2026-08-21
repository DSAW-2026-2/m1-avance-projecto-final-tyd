import { icon } from "./icons.js";

let container = null;

function ensureContainer() {
  if (container) return container;
  container = document.createElement("div");
  container.id = "toast-region";
  container.className = "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm no-print";
  container.setAttribute("aria-live", "polite");
  container.setAttribute("role", "status");
  document.body.appendChild(container);
  return container;
}

const VARIANTS = {
  success: { icon: "checkCircle", classes: "border-primary/30 text-primary" },
  danger: { icon: "alertTriangle", classes: "border-danger/30 text-danger" },
  info: { icon: "info", classes: "border-info/30 text-info" }
};

export function showToast(message, type = "success") {
  const region = ensureContainer();
  const v = VARIANTS[type] || VARIANTS.info;
  const el = document.createElement("div");
  el.className =
    "flex items-start gap-3 rounded-control bg-surface border border-border shadow-lifted px-4 py-3 text-sm text-text animate-[toast-in_0.2s_ease-out]";
  el.innerHTML = `
    <span class="shrink-0 ${v.classes}">${icon(v.icon, "size-5")}</span>
    <p class="flex-1 leading-snug">${message}</p>
    <button type="button" class="shrink-0 text-text-muted hover:text-text focus-ring rounded" aria-label="Cerrar notificación">${icon("x", "size-4")}</button>
  `;
  const closeBtn = el.querySelector("button");
  const remove = () => {
    el.style.opacity = "0";
    el.style.transform = "translateX(8px)";
    setTimeout(() => el.remove(), 150);
  };
  closeBtn.addEventListener("click", remove);
  el.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  region.appendChild(el);
  const timer = setTimeout(remove, 4000);
  el.addEventListener("mouseenter", () => clearTimeout(timer));
}
