import { icon } from "./icons.js";

export function openModal({ title, bodyHTML, wide = false }) {
  const previousActive = document.activeElement;
  const backdrop = document.createElement("div");
  backdrop.className = "fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out] no-print overflow-y-auto";

  backdrop.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
         class="w-full ${wide ? "max-w-2xl" : "max-w-lg"} my-8 rounded-card bg-surface border border-border shadow-lifted animate-[scale-in_0.15s_ease-out]">
      <div class="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 id="modal-title" class="font-display text-lg font-semibold text-text">${title}</h2>
        <button type="button" data-action="close-modal" class="focus-ring grid place-items-center size-9 rounded-control text-text-muted hover:bg-surface-alt hover:text-text" aria-label="Cerrar">
          ${icon("x", "size-5")}
        </button>
      </div>
      <div class="px-6 py-5">${bodyHTML}</div>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";

  function close() {
    document.body.style.overflow = "";
    backdrop.remove();
    document.removeEventListener("keydown", onKeydown);
    if (previousActive instanceof HTMLElement) previousActive.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = Array.from(
      backdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled && el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector('[data-action="close-modal"]').addEventListener("click", close);
  document.addEventListener("keydown", onKeydown);

  const firstField = backdrop.querySelector("input, select, textarea, button:not([data-action='close-modal'])");
  if (firstField) firstField.focus();

  return { close, root: backdrop };
}
