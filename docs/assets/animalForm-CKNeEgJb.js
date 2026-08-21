import{e as c,C as x,t as g,E as b,n as v}from"./utils-CvC1LC_K.js";import{s as h}from"./toast-Dsopc036.js";function r(i,e,t,{required:a=!1,error:n}={}){return`
    <div>
      <label for="${e}" class="block text-sm font-medium text-text mb-1.5">${i}${a?' <span class="text-danger">*</span>':""}</label>
      ${t}
      <p id="${e}-error" class="mt-1 text-xs text-danger ${n?"":"hidden"}">${n||""}</p>
    </div>`}const s="focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";function q(i){const e=i||{arete:"",nombre:"",sexo:"H",categoria:"Vaca",raza:"",fechaNacimiento:"",pesoKg:"",potrero:"",estado:"Activo",notas:""};return`
    <form id="animal-form" novalidate class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        ${r("Arete / ID","f-arete",`<input id="f-arete" name="arete" type="text" required class="${s}" value="${c(e.arete)}" placeholder="Ej. COR-0312" autocomplete="off" />`,{required:!0})}
        ${r("Nombre (opcional)","f-nombre",`<input id="f-nombre" name="nombre" type="text" class="${s}" value="${c(e.nombre)}" placeholder="Ej. Lucero" autocomplete="off" />`)}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${r("Sexo","f-sexo",`<select id="f-sexo" name="sexo" required class="${s}">
            <option value="H" ${e.sexo==="H"?"selected":""}>Hembra</option>
            <option value="M" ${e.sexo==="M"?"selected":""}>Macho</option>
          </select>`,{required:!0})}
        ${r("Categoría","f-categoria",`<select id="f-categoria" name="categoria" required class="${s}">
            ${x.map(t=>`<option value="${t}" ${e.categoria===t?"selected":""}>${t}</option>`).join("")}
          </select>`,{required:!0})}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${r("Raza","f-raza",`<input id="f-raza" name="raza" type="text" class="${s}" value="${c(e.raza)}" placeholder="Ej. Cebú, Brahman…" autocomplete="off" />`)}
        ${r("Fecha de nacimiento","f-fecha",`<input id="f-fecha" name="fechaNacimiento" type="date" required max="${g()}" class="${s}" value="${c(e.fechaNacimiento)}" />`,{required:!0})}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${r("Peso actual (kg)","f-peso",`<input id="f-peso" name="pesoKg" type="number" min="0" step="1" inputmode="numeric" class="${s}" value="${c(e.pesoKg)}" placeholder="Ej. 380" />`)}
        ${r("Potrero","f-potrero",`<input id="f-potrero" name="potrero" type="text" class="${s}" value="${c(e.potrero)}" placeholder="Ej. Potrero 1" autocomplete="off" />`)}
      </div>
      ${r("Estado","f-estado",`<select id="f-estado" name="estado" required class="${s}">
          ${b.map(t=>`<option value="${t}" ${e.estado===t?"selected":""}>${t}</option>`).join("")}
        </select>`,{required:!0})}
      ${r("Notas","f-notas",`<textarea id="f-notas" name="notas" rows="2" class="${s} resize-none">${c(e.notas)}</textarea>`)}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" data-action="close-modal" class="focus-ring rounded-control px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt">Cancelar</button>
        <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          ${i?"Guardar cambios":"Agregar animal"}
        </button>
      </div>
    </form>`}function f(i,e,t){const a=i.querySelector(`#f-${e}-error`),n=i.querySelector(`[name="${e}"]`);return a&&(a.textContent=t||"",a.classList.toggle("hidden",!t)),n&&n.setAttribute("aria-invalid",t?"true":"false"),t}function E(i,{animal:e,onSaved:t}){const a=i.querySelector("#animal-form");a.addEventListener("submit",n=>{var m;n.preventDefault();const o=new FormData(a),l=String(o.get("arete")||"").trim(),u=String(o.get("fechaNacimiento")||""),p=o.get("pesoKg");let d=!1;if(d=!!f(a,"arete",l?"":"Ingresa el arete o ID del animal.")||d,d=!!f(a,"fecha",u?"":"Ingresa la fecha de nacimiento.")||d,d){(m=a.querySelector('[aria-invalid="true"]'))==null||m.focus();return}const $={id:(e==null?void 0:e.id)||v("animal"),arete:l,nombre:String(o.get("nombre")||"").trim(),sexo:o.get("sexo"),categoria:o.get("categoria"),raza:String(o.get("raza")||"").trim(),fechaNacimiento:u,pesoKg:p?Number(p):0,potrero:String(o.get("potrero")||"").trim(),estado:o.get("estado"),notas:String(o.get("notas")||"").trim(),fechaRegistro:(e==null?void 0:e.fechaRegistro)||g()};t($),h(e?"Cambios guardados.":"Animal agregado al hato.","success")})}export{q as a,E as b};
