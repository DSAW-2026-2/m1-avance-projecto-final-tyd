import{i as f,l as T,e as a,a as l,c as b,b as v,v as y,t as w,o as $,d as x,f as u}from"./utils-CvC1LC_K.js";import{r as R}from"./layout-CZHZwXwL.js";import{v as S,e as V}from"./badges-BpIjWwjw.js";import{s as B}from"./toast-Dsopc036.js";R("trazabilidad",{title:"Trazabilidad",subtitle:"Reportes para el ICA o compradores"});const c=document.getElementById("report-scope"),g=document.getElementById("btn-csv"),L=document.getElementById("btn-print"),E=document.getElementById("report");g.innerHTML=`${f("download","size-4.5")} Exportar CSV`;L.innerHTML=`${f("printer","size-4.5")} Imprimir`;const d=T().filter(t=>t.estado==="Activo").sort((t,e)=>t.arete.localeCompare(e.arete));d.forEach(t=>{c.insertAdjacentHTML("beforeend",`<option value="${t.id}">${a(t.arete)}${t.nombre?" · "+a(t.nombre):""}</option>`)});function C(t){return`
    <div class="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-border">
      <div>
        <p class="text-xs font-medium text-text-muted uppercase tracking-wide">Reporte de trazabilidad</p>
        <h2 class="font-display text-xl font-semibold text-text mt-1">${a(t.nombre)}</h2>
        <p class="text-sm text-text-muted mt-0.5">${a(t.vereda)}, ${a(t.municipio)}, ${a(t.departamento)}</p>
      </div>
      <div class="text-sm text-right">
        <p class="text-text-muted">Código ICA</p>
        <p class="font-semibold text-text">${a(t.codigoICA)||"—"}</p>
        <p class="text-text-muted mt-2">Generado el ${u(w())}</p>
      </div>
    </div>`}function H(){const t=$(),e=d.map(s=>{const p=l(s.id);return`
        <tr class="border-b border-border last:border-0">
          <td class="py-2.5 pr-4 font-medium text-text whitespace-nowrap">${a(s.arete)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${a(s.nombre)||"—"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${a(s.categoria)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${s.sexo==="H"?"Hembra":"Macho"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${b(s.fechaNacimiento)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${a(s.potrero)||"—"}</td>
          <td class="py-2.5 whitespace-nowrap">${S(p.status)}</td>
        </tr>`}).join("");E.innerHTML=`
    ${C(t)}
    <div class="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Total activos</p><p class="font-semibold text-text tabular mt-0.5">${x(d.length)}</p></div>
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Al día en Aftosa</p><p class="font-semibold text-success tabular mt-0.5">${x(d.filter(s=>l(s.id).status==="al-dia").length)}</p></div>
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Con alerta</p><p class="font-semibold text-danger tabular mt-0.5">${x(d.filter(s=>["vencida","proxima"].includes(l(s.id).status)).length)}</p></div>
    </div>
    <div class="mt-6 overflow-x-auto scrollbar-thin">
      <table class="w-full text-sm min-w-[700px]">
        <thead>
          <tr class="text-left text-xs font-medium text-text-muted border-b border-border">
            <th class="py-2.5 pr-4">Arete</th><th class="py-2.5 pr-4">Nombre</th><th class="py-2.5 pr-4">Categoría</th>
            <th class="py-2.5 pr-4">Sexo</th><th class="py-2.5 pr-4">Edad</th><th class="py-2.5 pr-4">Potrero</th><th class="py-2.5">Vacunación (Aftosa)</th>
          </tr>
        </thead>
        <tbody>${e}</tbody>
      </table>
    </div>`}function I(t){const e=d.find(r=>r.id===t),s=$();if(!e){H();return}const p=v(e.id),m=p.length?p.map(r=>`
        <tr class="border-b border-border last:border-0">
          <td class="py-2.5 pr-4 text-text whitespace-nowrap">${a(y(r.tipo))}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${u(r.fecha)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${r.fechaProximaDosis?u(r.fechaProximaDosis):"—"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${a(r.lote)||"—"}</td>
          <td class="py-2.5 text-text-muted whitespace-nowrap">${a(r.veterinario)||"—"}</td>
        </tr>`).join(""):'<tr><td colspan="5" class="py-6 text-center text-text-muted">Sin registros de vacunación.</td></tr>';E.innerHTML=`
    ${C(s)}
    <div class="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
      <p><span class="text-text-muted">Arete:</span> <span class="font-semibold text-text">${a(e.arete)}</span></p>
      <p><span class="text-text-muted">Nombre:</span> <span class="font-semibold text-text">${a(e.nombre)||"—"}</span></p>
      <p><span class="text-text-muted">Raza:</span> <span class="font-semibold text-text">${a(e.raza)||"—"}</span></p>
      <p><span class="text-text-muted">Categoría:</span> <span class="font-semibold text-text">${a(e.categoria)}</span></p>
      <p><span class="text-text-muted">Sexo:</span> <span class="font-semibold text-text">${e.sexo==="H"?"Hembra":"Macho"}</span></p>
      <p><span class="text-text-muted">Edad:</span> <span class="font-semibold text-text">${b(e.fechaNacimiento)}</span></p>
      <p><span class="text-text-muted">Potrero:</span> <span class="font-semibold text-text">${a(e.potrero)||"—"}</span></p>
      <p>${V(e.estado)}</p>
    </div>
    <h3 class="font-display font-semibold text-text mt-6 mb-2">Historial de vacunación</h3>
    <div class="overflow-x-auto scrollbar-thin">
      <table class="w-full text-sm min-w-[600px]">
        <thead>
          <tr class="text-left text-xs font-medium text-text-muted border-b border-border">
            <th class="py-2.5 pr-4">Vacuna</th><th class="py-2.5 pr-4">Fecha</th><th class="py-2.5 pr-4">Próxima dosis</th><th class="py-2.5 pr-4">Lote</th><th class="py-2.5">Veterinario(a)</th>
          </tr>
        </thead>
        <tbody>${m}</tbody>
      </table>
    </div>`}function A(){c.value==="hato"?H():I(c.value)}function P(t){const e=String(t??"");return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function j(){var h;let t,e;if(c.value==="hato")t=["Arete","Nombre","Categoria","Sexo","Edad","Potrero","Estado vacunacion Aftosa"],e=d.map(o=>{const n=l(o.id);return[o.arete,o.nombre,o.categoria,o.sexo==="H"?"Hembra":"Macho",b(o.fechaNacimiento),o.potrero,n.label]});else{const o=d.find(n=>n.id===c.value);t=["Vacuna","Fecha","Proxima dosis","Lote","Veterinario"],e=v(o.id).map(n=>[y(n.tipo),n.fecha,n.fechaProximaDosis||"",n.lote,n.veterinario])}const s=[t,...e].map(o=>o.map(P).join(",")).join(`
`),p="\uFEFF",m=new Blob([p+s],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(m),i=document.createElement("a"),M=c.value==="hato"?"hato":((h=d.find(o=>o.id===c.value))==null?void 0:h.arete)||"animal";i.href=r,i.download=`mihato-trazabilidad-${M}-${w()}.csv`,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r),B("Reporte CSV descargado.","success")}c.addEventListener("change",A);g.addEventListener("click",j);L.addEventListener("click",()=>window.print());A();
