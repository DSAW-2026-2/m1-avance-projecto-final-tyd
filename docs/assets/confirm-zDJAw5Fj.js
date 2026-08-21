import{i as x}from"./utils-CvC1LC_K.js";function g({title:l,message:f,confirmLabel:m="Confirmar",cancelLabel:u="Cancelar",danger:s=!1}){return new Promise(b=>{const c=document.activeElement,e=document.createElement("div");e.className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out] no-print";const p=s?"bg-danger-soft text-danger":"bg-primary-soft text-primary";e.innerHTML=`
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc"
           class="w-full max-w-sm rounded-card bg-surface border border-border shadow-lifted p-6 animate-[scale-in_0.15s_ease-out]">
        <div class="flex items-start gap-4">
          <span class="shrink-0 grid place-items-center size-10 rounded-full ${p}">${x("alertTriangle","size-5")}</span>
          <div class="flex-1">
            <h2 id="confirm-title" class="font-display text-lg font-semibold text-text">${l}</h2>
            <p id="confirm-desc" class="mt-1.5 text-sm text-text-muted leading-relaxed">${f}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" data-action="cancel" class="focus-ring rounded-control px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-alt">${u}</button>
          <button type="button" data-action="confirm" class="focus-ring rounded-control px-4 py-2 text-sm font-semibold text-white ${s?"bg-danger hover:bg-danger/90":"bg-primary hover:bg-primary-hover"}">${m}</button>
        </div>
      </div>
    `,document.body.appendChild(e),document.body.style.overflow="hidden";const i=e.querySelector('[data-action="confirm"]'),r=e.querySelector('[data-action="cancel"]'),n=[r,i];i.focus();function o(t){document.body.style.overflow="",e.remove(),document.removeEventListener("keydown",d),c instanceof HTMLElement&&c.focus(),b(t)}function d(t){if(t.key==="Escape")o(!1);else if(t.key==="Tab"){const a=n.indexOf(document.activeElement);t.preventDefault();const v=t.shiftKey?a<=0?n.length-1:a-1:a===n.length-1?0:a+1;n[v].focus()}}e.addEventListener("click",t=>{t.target===e&&o(!1)}),r.addEventListener("click",()=>o(!1)),i.addEventListener("click",()=>o(!0)),document.addEventListener("keydown",d)})}export{g as c};
