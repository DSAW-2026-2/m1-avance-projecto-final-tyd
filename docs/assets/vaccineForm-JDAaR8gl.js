import{e as v,V as x,t as d,z as $,n as b}from"./utils-CvC1LC_K.js";import{s as h}from"./toast-Dsopc036.js";const i="focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";function n(a,o,e,t=!1){return`
    <div>
      <label for="${o}" class="block text-sm font-medium text-text mb-1.5">${a}${t?' <span class="text-danger">*</span>':""}</label>
      ${e}
      <p id="${o}-error" class="mt-1 text-xs text-danger hidden"></p>
    </div>`}function E({animals:a}={}){return`
    <form id="vaccine-form" novalidate class="space-y-4">
      ${a?n("Animal","v-animal",`<select id="v-animal" name="animalId" required class="${i}">
          <option value="">Selecciona un animal…</option>
          ${a.map(e=>`<option value="${e.id}">${v(e.arete)}${e.nombre?" · "+v(e.nombre):""}</option>`).join("")}
        </select>`,!0):""}
      <div class="grid sm:grid-cols-2 gap-4">
        ${n("Tipo de vacuna","v-tipo",`<select id="v-tipo" name="tipo" required class="${i}">
            ${x.map(e=>`<option value="${e.id}">${e.nombre}${e.obligatoriaICA?" (ICA)":""}</option>`).join("")}
          </select>`,!0)}
        ${n("Fecha de aplicación","v-fecha",`<input id="v-fecha" name="fecha" type="date" required max="${d()}" value="${d()}" class="${i}" />`,!0)}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${n("Lote","v-lote",`<input id="v-lote" name="lote" type="text" class="${i}" placeholder="Ej. AF-2240" autocomplete="off" />`)}
        ${n("Veterinario(a)","v-vet",`<input id="v-vet" name="veterinario" type="text" class="${i}" placeholder="Ej. Dra. Camila Restrepo" autocomplete="off" />`)}
      </div>
      ${n("Notas","v-notas",`<textarea id="v-notas" name="notas" rows="2" class="${i} resize-none"></textarea>`)}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" data-action="close-modal" class="focus-ring rounded-control px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt">Cancelar</button>
        <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">Registrar vacuna</button>
      </div>
    </form>`}function f(a,o,e){const t=a.querySelector(`#v-${o}-error`),c=a.querySelector(`[name="${o}"]`);return t&&(t.textContent=e||"",t.classList.toggle("hidden",!e)),c&&c.setAttribute("aria-invalid",e?"true":"false"),e}function C(a,{fixedAnimalId:o,onSaved:e}){const t=a.querySelector("#vaccine-form");t.addEventListener("submit",c=>{var p;c.preventDefault();const r=new FormData(t),u=o||r.get("animalId"),m=r.get("tipo"),l=r.get("fecha");let s=!1;if(o||(s=!!f(t,"animal",u?"":"Selecciona un animal.")||s),s=!!f(t,"fecha",l?"":"Ingresa la fecha de aplicación.")||s,s){(p=t.querySelector('[aria-invalid="true"]'))==null||p.focus();return}const g={id:b("vac"),animalId:u,tipo:m,fecha:l,fechaProximaDosis:$(m,l),lote:String(r.get("lote")||"").trim(),veterinario:String(r.get("veterinario")||"").trim(),notas:String(r.get("notas")||"").trim(),fechaRegistro:d()};e(g),h("Vacuna registrada correctamente.","success")})}export{C as b,E as v};
