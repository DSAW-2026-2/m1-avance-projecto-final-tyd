import{o as d,s as m,p as s,r as l,i as n,w as g,e as u}from"./utils-CvC1LC_K.js";import{r as p}from"./layout-CZHZwXwL.js";import{c as f}from"./confirm-zDJAw5Fj.js";import{s as c}from"./toast-Dsopc036.js";p("configuracion",{title:"Configuración",subtitle:"Datos de la finca y preferencias"});const b="focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";function o(e,i,r,t="text"){return`
    <div>
      <label for="f-${i}" class="block text-sm font-medium text-text mb-1.5">${e}</label>
      <input id="f-${i}" name="${i}" type="${t}" class="${b}" value="${u(r)}" />
    </div>`}function h(){const e=d(),i=document.getElementById("finca-form");i.innerHTML=`
    ${o("Nombre de la finca","nombre",e.nombre)}
    ${o("Propietario(a)","propietario",e.propietario)}
    <div class="grid sm:grid-cols-2 gap-4">
      ${o("Vereda","vereda",e.vereda)}
      ${o("Municipio","municipio",e.municipio)}
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      ${o("Departamento","departamento",e.departamento)}
      ${o("Código ICA","codigoICA",e.codigoICA)}
    </div>
    <div class="flex justify-end pt-1">
      <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">Guardar cambios</button>
    </div>`,i.addEventListener("submit",r=>{r.preventDefault();const t=new FormData(i);m({nombre:String(t.get("nombre")||"").trim(),propietario:String(t.get("propietario")||"").trim(),vereda:String(t.get("vereda")||"").trim(),municipio:String(t.get("municipio")||"").trim(),departamento:String(t.get("departamento")||"").trim(),codigoICA:String(t.get("codigoICA")||"").trim(),unidadPeso:"kg"}),c("Datos de la finca actualizados.","success")})}function v(){const e=document.getElementById("theme-switch"),i=document.getElementById("theme-switch-thumb");function r(t){const a=t==="dark";e.setAttribute("aria-checked",String(a)),e.classList.toggle("bg-primary",a),e.classList.toggle("bg-surface-alt",!a),i.classList.toggle("translate-x-6",a),i.classList.toggle("translate-x-1",!a)}r(s()),e.addEventListener("click",()=>{const t=s()==="dark"?"light":"dark";l(t),document.documentElement.classList.toggle("dark",t==="dark"),document.querySelectorAll(".theme-toggle").forEach(a=>{a.setAttribute("aria-pressed",String(t==="dark")),a.innerHTML=t==="dark"?n("sun","size-5"):n("moon","size-5")}),r(t)})}function y(){const e=document.getElementById("btn-reset");e.innerHTML=`${n("trash","size-4.5")} Restablecer datos de demostración`,e.addEventListener("click",async()=>{await f({title:"Restablecer datos",message:"Se eliminarán todos los animales, vacunas y datos de la finca actuales, y se restaurará la información de ejemplo.",confirmLabel:"Restablecer",danger:!0})&&(g(),c("Datos restablecidos.","info"),setTimeout(()=>window.location.assign("dashboard.html"),600))})}h();v();y();
