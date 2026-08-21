import{A as g,p as d,i as s,r as x,l as b,a as h}from"./utils-CvC1LC_K.js";const p=[{id:"dashboard",href:"dashboard.html",label:"Dashboard",icon:"home"},{id:"animales",href:"animales.html",label:"Animales",icon:"tag"},{id:"vacunacion",href:"vacunacion.html",label:"Vacunación",icon:"syringe"},{id:"trazabilidad",href:"trazabilidad.html",label:"Trazabilidad",icon:"clipboard"},{id:"configuracion",href:"configuracion.html",label:"Config.",icon:"gear"}];function u(){return b().filter(e=>e.estado==="Activo").filter(e=>{const o=h(e.id).status;return o==="vencida"||o==="proxima"}).length}function f(t){document.documentElement.classList.toggle("dark",t==="dark"),document.querySelectorAll(".theme-toggle").forEach(e=>{e.setAttribute("aria-pressed",String(t==="dark")),e.innerHTML=t==="dark"?s("sun","size-5"):s("moon","size-5")})}function v(){const t=d()==="dark"?"light":"dark";x(t),f(t)}function y(t){const e=u(),o=p.map(a=>{const n=a.id===t,r=a.id==="vacunacion"&&e>0;return`
      <a href="${a.href}"
         class="group flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors focus-ring
                ${n?"bg-primary-soft text-primary":"text-text-muted hover:bg-surface-alt hover:text-text"}"
         ${n?'aria-current="page"':""}>
        <span class="shrink-0">${s(a.icon,"size-5")}</span>
        <span class="flex-1">${a.label}</span>
        ${r?`<span class="grid place-items-center min-w-5 h-5 rounded-full bg-danger text-white text-[11px] font-semibold px-1">${e}</span>`:""}
      </a>`}).join("");return`
    <aside class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 border-r border-border bg-surface no-print">
      <a href="index.html" class="flex items-center gap-2.5 px-5 h-16 border-b border-border focus-ring">
        <span class="grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${s("logo","size-5")}</span>
        <div class="leading-tight">
          <p class="font-display font-semibold text-text">MiHato</p>
          <p class="text-[11px] text-text-muted">Control de hato</p>
        </div>
      </a>
      <nav class="flex-1 px-3 py-4 space-y-1" aria-label="Navegación principal">${o}</nav>
      <div class="p-3 border-t border-border">
        <button type="button" class="theme-toggle focus-ring w-full flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-text" aria-pressed="false">
          ${s("moon","size-5")}
          <span>Modo oscuro</span>
        </button>
      </div>
    </aside>`}function $({title:t,subtitle:e,actions:o}){return`
    <header class="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 sm:px-6 border-b border-border bg-surface/95 backdrop-blur no-print">
      <a href="index.html" class="flex items-center gap-2 lg:hidden focus-ring rounded-control">
        <span class="grid place-items-center size-8 rounded-full bg-primary-soft text-primary">${s("logo","size-4")}</span>
        <span class="font-display font-semibold text-text">MiHato</span>
      </a>
      <div class="hidden lg:block flex-1 min-w-0">
        <h1 class="font-display text-xl font-semibold text-text truncate">${t}</h1>
        ${e?`<p class="text-sm text-text-muted truncate">${e}</p>`:""}
      </div>
      <div class="flex-1 lg:hidden"></div>
      <div class="flex items-center gap-2 shrink-0">
        ${o||""}
        <button type="button" class="theme-toggle lg:hidden focus-ring grid place-items-center size-10 rounded-control text-text-muted hover:bg-surface-alt hover:text-text" aria-pressed="false" aria-label="Cambiar a modo oscuro">
          ${s("moon","size-5")}
        </button>
      </div>
    </header>
    <div class="lg:hidden px-4 sm:px-6 pt-4">
      <h1 class="font-display text-lg font-semibold text-text">${t}</h1>
      ${e?`<p class="text-sm text-text-muted mt-0.5">${e}</p>`:""}
    </div>`}function z(t){const e=u();return`
    <nav aria-label="Navegación principal" class="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] no-print">
      ${p.map(a=>{const n=a.id===t,r=a.id==="vacunacion"&&e>0;return`
      <a href="${a.href}" ${n?'aria-current="page"':""}
         class="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium focus-ring rounded-control
                ${n?"text-primary":"text-text-muted"}">
        <span class="relative">
          ${s(a.icon,"size-5")}
          ${r?'<span class="absolute -top-1 -right-1.5 size-2.5 rounded-full bg-danger ring-2 ring-surface"></span>':""}
        </span>
        ${a.label}
      </a>`}).join("")}
    </nav>`}function T(t,{title:e,subtitle:o="",actions:a=""}={}){g();const n=document.createElement("a");n.href="#main-content",n.className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-control",n.textContent="Saltar al contenido principal",document.body.prepend(n);const r=document.getElementById("sidebar-root"),i=document.getElementById("topbar-root"),l=document.getElementById("bottomnav-root");r&&(r.innerHTML=y(t)),i&&(i.innerHTML=$({title:e,subtitle:o,actions:a})),l&&(l.innerHTML=z(t)),f(d()),document.querySelectorAll(".theme-toggle").forEach(m=>m.addEventListener("click",v));const c=document.getElementById("main-content");c&&c.setAttribute("tabindex","-1")}export{T as r};
