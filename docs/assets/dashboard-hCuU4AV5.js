import{l as x,d as l,a as p,i as c,e as i,C as u,x as f,f as m,v as g}from"./utils-CvC1LC_K.js";import{r as h}from"./layout-CZHZwXwL.js";h("dashboard",{title:"Dashboard",subtitle:"Resumen general de tu hato"});const o=x(),r=o.filter(a=>a.estado==="Activo");function b(){document.getElementById("kpi-total").textContent=l(r.length);const a=r.filter(n=>["vencida","proxima"].includes(p(n.id).status));document.getElementById("kpi-alertas").textContent=l(a.length);const s=r.filter(n=>(Date.now()-new Date(n.fechaNacimiento).getTime())/864e5<182);document.getElementById("kpi-crias").textContent=l(s.length);const t=r.filter(n=>n.pesoKg>0),e=t.length?Math.round(t.reduce((n,d)=>n+d.pesoKg,0)/t.length):0;document.getElementById("kpi-peso").textContent=`${l(e)} kg`}function v(){const a=document.getElementById("alertas-list"),s=r.map(t=>({animal:t,estado:p(t.id)})).filter(t=>["vencida","proxima"].includes(t.estado.status)).sort((t,e)=>(t.estado.diasRestantes??0)-(e.estado.diasRestantes??0));if(s.length===0){a.innerHTML=`
      <div class="px-5 py-8 text-center">
        <span class="inline-grid place-items-center size-11 rounded-full bg-success-soft text-success mb-3">${c("checkCircle","size-5")}</span>
        <p class="text-sm text-text-muted">No hay alertas de vacunación pendientes. ¡Buen trabajo!</p>
      </div>`;return}a.innerHTML=s.slice(0,6).map(({animal:t,estado:e})=>{const n=e.status==="vencida";return`
        <a href="animal.html?id=${encodeURIComponent(t.id)}" class="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-alt focus-ring">
          <span class="shrink-0 grid place-items-center size-9 rounded-full ${n?"bg-danger-soft text-danger":"bg-warning-soft text-warning"}">
            ${c("alertTriangle","size-4.5")}
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-text truncate">${i(t.nombre||t.arete)}${t.nombre?` <span class="text-text-muted font-normal">· ${i(t.arete)}</span>`:""}</span>
            <span class="block text-xs ${n?"text-danger":"text-warning"}">${i(e.label)} · Fiebre Aftosa</span>
          </span>
          <span class="shrink-0 text-text-muted">${c("chevronRight","size-4")}</span>
        </a>`}).join("")}function y(){const a=document.getElementById("composicion-chart"),s=u.map(e=>({cat:e,n:r.filter(n=>n.categoria===e).length})).filter(e=>e.n>0);if(s.length===0){a.innerHTML='<p class="text-sm text-text-muted">Sin animales registrados.</p>';return}const t=Math.max(...s.map(e=>e.n));a.innerHTML=s.map(e=>`
      <div class="flex items-center gap-3 py-1.5">
        <span class="w-16 shrink-0 text-xs text-text-muted">${i(e.cat)}</span>
        <span class="flex-1 h-3 rounded-full bg-surface-alt overflow-hidden">
          <span class="block h-full rounded-full bg-primary" style="width:${Math.max(6,e.n/t*100)}%"></span>
        </span>
        <span class="w-6 shrink-0 text-xs font-semibold text-text tabular text-right">${e.n}</span>
      </div>`).join("")}function $(){const a=document.getElementById("actividad-list"),s=f(),t=[...o.map(e=>({tipo:"animal",fecha:e.fechaRegistro,animal:e})),...s.map(e=>({tipo:"vacuna",fecha:e.fechaRegistro,vacuna:e,animal:o.find(n=>n.id===e.animalId)}))].filter(e=>e.animal).sort((e,n)=>new Date(n.fecha)-new Date(e.fecha)).slice(0,8);if(t.length===0){a.innerHTML='<li class="px-5 py-8 text-center text-sm text-text-muted">Aún no hay actividad registrada.</li>';return}a.innerHTML=t.map(e=>e.tipo==="animal"?`
          <li class="flex items-center gap-3 px-5 py-3.5">
            <span class="shrink-0 grid place-items-center size-9 rounded-full bg-info-soft text-info">${c("tag","size-4.5")}</span>
            <span class="flex-1 min-w-0 text-sm text-text">Se registró <strong class="font-medium">${i(e.animal.nombre||e.animal.arete)}</strong> en el hato</span>
            <span class="shrink-0 text-xs text-text-muted">${m(e.fecha)}</span>
          </li>`:`
        <li class="flex items-center gap-3 px-5 py-3.5">
          <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${c("syringe","size-4.5")}</span>
          <span class="flex-1 min-w-0 text-sm text-text">Se aplicó <strong class="font-medium">${i(g(e.vacuna.tipo))}</strong> a ${i(e.animal.nombre||e.animal.arete)}</span>
          <span class="shrink-0 text-xs text-text-muted">${m(e.fecha)}</span>
        </li>`).join("")}b();v();y();$();
