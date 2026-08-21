import{i as r,l as i,k as y,a as B,d as m,e as n,x as T,v as A,f as h}from"./utils-CvC1LC_K.js";import{r as C}from"./layout-CZHZwXwL.js";import{v as H}from"./badges-BpIjWwjw.js";import{o as v}from"./modal-DtY6PnMf.js";import{v as $,b as L}from"./vaccineForm-JDAaR8gl.js";import"./toast-Dsopc036.js";C("vacunacion",{title:"Vacunación",subtitle:"Calendario y registro de dosis",actions:`
    <button type="button" id="btn-add-desktop" class="hidden lg:inline-flex focus-ring items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
      ${r("plus","size-4.5")} Registrar vacuna
    </button>`});const w=document.getElementById("fab-add");w.innerHTML=r("plus","size-6");function k(){const u=i().filter(a=>a.estado==="Activo").sort((a,o)=>a.arete.localeCompare(o.arete)),s=v({title:"Registrar vacuna",bodyHTML:$({animals:u})});L(s.root,{onSaved:a=>{y(a),s.close(),p()}})}function p(){const s=i().filter(t=>t.estado==="Activo").map(t=>({animal:t,estado:B(t.id)})),a=s.filter(t=>t.estado.status==="vencida"),o=s.filter(t=>t.estado.status==="proxima"),E=s.filter(t=>t.estado.status==="al-dia"),I=s.filter(t=>t.estado.status==="sin-registro");document.getElementById("stat-vencidas").textContent=m(a.length),document.getElementById("stat-proximas").textContent=m(o.length),document.getElementById("stat-aldia").textContent=m(E.length);const d=document.getElementById("pendientes-list"),x=[...a,...o,...I].sort((t,e)=>(t.estado.diasRestantes??-9999)-(e.estado.diasRestantes??-9999));x.length===0?d.innerHTML=`
      <div class="px-5 py-8 text-center">
        <span class="inline-grid place-items-center size-11 rounded-full bg-success-soft text-success mb-3">${r("checkCircle","size-5")}</span>
        <p class="text-sm text-text-muted">Todo el hato está al día con la Fiebre Aftosa.</p>
      </div>`:(d.innerHTML=x.map(({animal:t,estado:e})=>`
        <div class="flex items-center gap-3 px-5 py-3.5">
          <a href="animal.html?id=${encodeURIComponent(t.id)}" class="flex-1 min-w-0 flex items-center gap-3 hover:opacity-80 focus-ring rounded">
            <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${r("tag","size-4.5")}</span>
            <span class="min-w-0">
              <span class="block text-sm font-medium text-text truncate">${n(t.nombre||t.arete)}${t.nombre?` <span class="text-text-muted font-normal">· ${n(t.arete)}</span>`:""}</span>
              <span class="block text-xs text-text-muted">${n(t.categoria)} · ${n(t.potrero)||"Sin potrero"}</span>
            </span>
          </a>
          ${H(e.status)}
          <button type="button" data-quick-vaccinate="${t.id}" class="focus-ring shrink-0 rounded-control border border-border px-3 py-2 text-xs font-semibold text-text hover:bg-surface-alt">Registrar</button>
        </div>`).join(""),d.querySelectorAll("[data-quick-vaccinate]").forEach(t=>{t.addEventListener("click",()=>{const e=i().find(l=>l.id===t.dataset.quickVaccinate),b=v({title:`Registrar vacuna · ${e.nombre||e.arete}`,bodyHTML:$()});L(b.root,{fixedAnimalId:e.id,onSaved:l=>{y(l),b.close(),p()}})})}));const f=document.getElementById("historial-tbody"),c=document.getElementById("historial-empty"),g=T().sort((t,e)=>new Date(e.fecha)-new Date(t.fecha)),M=new Map(i().map(t=>[t.id,t]));g.length===0?(f.innerHTML="",c.classList.remove("hidden"),c.textContent="Aún no se han registrado vacunas."):(c.classList.add("hidden"),f.innerHTML=g.map(t=>{const e=M.get(t.animalId);return`
          <tr class="hover:bg-surface-alt">
            <td class="px-5 py-3 font-medium text-text whitespace-nowrap">
              ${e?`<a href="animal.html?id=${encodeURIComponent(e.id)}" class="hover:underline focus-ring rounded">${n(e.nombre||e.arete)}</a>`:'<span class="text-text-muted">Animal eliminado</span>'}
            </td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap">${n(A(t.tipo))}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap tabular">${h(t.fecha)}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap tabular">${t.fechaProximaDosis?h(t.fechaProximaDosis):"—"}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap">${n(t.veterinario)||"—"}</td>
          </tr>`}).join(""))}document.getElementById("btn-add-desktop").addEventListener("click",k);w.addEventListener("click",k);p();
