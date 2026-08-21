import{i as m}from"./utils-CvC1LC_K.js";function v({title:c,bodyHTML:u,wide:f=!1}){const a=document.activeElement,e=document.createElement("div");e.className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out] no-print overflow-y-auto",e.innerHTML=`
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
         class="w-full ${f?"max-w-2xl":"max-w-lg"} my-8 rounded-card bg-surface border border-border shadow-lifted animate-[scale-in_0.15s_ease-out]">
      <div class="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 id="modal-title" class="font-display text-lg font-semibold text-text">${c}</h2>
        <button type="button" data-action="close-modal" class="focus-ring grid place-items-center size-9 rounded-control text-text-muted hover:bg-surface-alt hover:text-text" aria-label="Cerrar">
          ${m("x","size-5")}
        </button>
      </div>
      <div class="px-6 py-5">${u}</div>
    </div>`,document.body.appendChild(e),document.body.style.overflow="hidden";function o(){document.body.style.overflow="",e.remove(),document.removeEventListener("keydown",r),a instanceof HTMLElement&&a.focus()}function r(t){if(t.key==="Escape"){o();return}if(t.key!=="Tab")return;const n=Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(s=>!s.disabled&&s.offsetParent!==null);if(n.length===0)return;const l=n[0],d=n[n.length-1];t.shiftKey&&document.activeElement===l?(t.preventDefault(),d.focus()):!t.shiftKey&&document.activeElement===d&&(t.preventDefault(),l.focus())}e.addEventListener("click",t=>{t.target===e&&o()}),e.querySelector('[data-action="close-modal"]').addEventListener("click",o),document.addEventListener("keydown",r);const i=e.querySelector("input, select, textarea, button:not([data-action='close-modal'])");return i&&i.focus(),{close:o,root:e}}export{v as o};
