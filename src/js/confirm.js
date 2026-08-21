import { icon } from "./icons.js";

export function confirmDialog({ title, message, confirmLabel = "Confirmar", cancelLabel = "Cancelar", danger = false }) {
  return new Promise((resolve) => {
    const previousActive = document.activeElement;
    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out] no-print";

    const iconClasses = danger ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary";

    backdrop.innerHTML = `
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc"
           class="w-full max-w-sm rounded-card bg-surface border border-border shadow-lifted p-6 animate-[scale-in_0.15s_ease-out]">
        <div class="flex items-start gap-4">
          <span class="shrink-0 grid place-items-center size-10 rounded-full ${iconClasses}">${icon("alertTriangle", "size-5")}</span>
          <div class="flex-1">
            <h2 id="confirm-title" class="font-display text-lg font-semibold text-text">${title}</h2>
            <p id="confirm-desc" class="mt-1.5 text-sm text-text-muted leading-relaxed">${message}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" data-action="cancel" class="focus-ring rounded-control px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-alt">${cancelLabel}</button>
          <button type="button" data-action="confirm" class="focus-ring rounded-control px-4 py-2 text-sm font-semibold text-white ${danger ? "bg-danger hover:bg-danger/90" : "bg-primary hover:bg-primary-hover"}">${confirmLabel}</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    const confirmBtn = backdrop.querySelector('[data-action="confirm"]');
    const cancelBtn = backdrop.querySelector('[data-action="cancel"]');
    const focusables = [cancelBtn, confirmBtn];
    confirmBtn.focus();

    function close(result) {
      document.body.style.overflow = "";
      backdrop.remove();
      document.removeEventListener("keydown", onKeydown);
      if (previousActive instanceof HTMLElement) previousActive.focus();
      resolve(result);
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        close(false);
      } else if (e.key === "Tab") {
        const idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx === focusables.length - 1 ? 0 : idx + 1);
        focusables[next].focus();
      }
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close(false);
    });
    cancelBtn.addEventListener("click", () => close(false));
    confirmBtn.addEventListener("click", () => close(true));
    document.addEventListener("keydown", onKeydown);
  });
}
