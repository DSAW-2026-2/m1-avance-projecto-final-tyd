import{q as b,i,g,a as v,b as h,e as a,c as y,f as l,d as $,v as w,h as E,j as L,u as z,k}from"./utils-CvC1LC_K.js";import{r as A}from"./layout-CZHZwXwL.js";import{e as H,v as M}from"./badges-BpIjWwjw.js";import{o as m}from"./modal-DtY6PnMf.js";import{c as p}from"./confirm-zDJAw5Fj.js";import{a as T,b as B}from"./animalForm-CKNeEgJb.js";import{v as V,b as I}from"./vaccineForm-JDAaR8gl.js";import{s as F}from"./toast-Dsopc036.js";A("animales",{title:"Detalle del animal"});const u=document.getElementById("page-body"),x=b("id");function f(){u.innerHTML=`
    <div class="mt-10 rounded-card border border-border bg-surface shadow-soft p-10 text-center">
      <span class="inline-grid place-items-center size-12 rounded-full bg-warning-soft text-warning mb-3">${i("alertTriangle","size-5")}</span>
      <p class="font-display text-lg font-semibold text-text">Animal no encontrado</p>
      <p class="text-sm text-text-muted mt-1">Puede que haya sido eliminado o el enlace sea incorrecto.</p>
      <a href="animales.html" class="focus-ring inline-flex items-center gap-2 mt-5 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
        ${i("arrowLeft","size-4")} Volver al listado
      </a>
    </div>`}function s(e,n){return`
    <div class="py-2.5 flex items-center justify-between gap-4 border-b border-border last:border-0">
      <span class="text-sm text-text-muted">${e}</span>
      <span class="text-sm font-medium text-text text-right">${n}</span>
    </div>`}function o(){const e=g(x);if(!e){f();return}document.title=`${e.nombre||e.arete} · MiHato`;const n=v(e.id),c=h(e.id);u.innerHTML=`
    <a href="animales.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text focus-ring rounded">
      ${i("arrowLeft","size-4")} Volver a Animales
    </a>

    <div class="mt-4 rounded-card border border-border bg-surface shadow-soft p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="grid place-items-center size-14 rounded-full bg-primary-soft text-primary shrink-0">${i("tag","size-6")}</span>
          <div>
            <h2 class="font-display text-xl sm:text-2xl font-semibold text-text">${a(e.nombre||e.arete)}</h2>
            <p class="text-sm text-text-muted">${a(e.arete)} · ${a(e.raza)||"Raza no registrada"}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${H(e.estado)}
              ${e.estado==="Activo"?M(n.status):""}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" id="btn-edit" class="focus-ring inline-flex items-center gap-2 rounded-control border border-border px-3.5 py-2.5 text-sm font-medium text-text hover:bg-surface-alt">
            ${i("pencil","size-4")} Editar
          </button>
          <button type="button" id="btn-delete" class="focus-ring grid place-items-center size-10 rounded-control border border-border text-danger hover:bg-danger-soft" aria-label="Eliminar animal">
            ${i("trash","size-4.5")}
          </button>
        </div>
      </div>

      <div class="mt-5 grid sm:grid-cols-2 gap-x-8">
        <div>
          ${s("Sexo",e.sexo==="H"?"Hembra":"Macho")}
          ${s("Categoría",a(e.categoria))}
          ${s("Edad",y(e.fechaNacimiento))}
        </div>
        <div>
          ${s("Fecha de nacimiento",l(e.fechaNacimiento))}
          ${s("Peso actual",e.pesoKg?`${$(e.pesoKg)} kg`:"—")}
          ${s("Potrero",a(e.potrero)||"—")}
        </div>
      </div>
      ${e.notas?`<p class="mt-4 text-sm text-text-muted bg-surface-alt rounded-control px-4 py-3">${a(e.notas)}</p>`:""}
    </div>

    <div class="mt-6 rounded-card border border-border bg-surface shadow-soft">
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 class="font-display font-semibold text-text">Historial de vacunación</h2>
        <button type="button" id="btn-add-vacuna" class="focus-ring inline-flex items-center gap-2 rounded-control bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          ${i("plus","size-4")} Registrar
        </button>
      </div>
      <div id="historial-list" class="divide-y divide-border"></div>
    </div>`;const d=document.getElementById("historial-list");c.length===0?d.innerHTML='<p class="px-5 py-8 text-center text-sm text-text-muted">Aún no hay vacunas registradas para este animal.</p>':d.innerHTML=c.map(t=>`
        <div class="flex items-start gap-3 px-5 py-3.5">
          <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary mt-0.5">${i("syringe","size-4.5")}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text">${a(w(t.tipo))}</p>
            <p class="text-xs text-text-muted mt-0.5">Aplicada el ${l(t.fecha)}${t.veterinario?` · ${a(t.veterinario)}`:""}${t.lote?` · Lote ${a(t.lote)}`:""}</p>
            ${t.fechaProximaDosis?`<p class="text-xs text-text-muted mt-0.5">Próxima dosis: ${l(t.fechaProximaDosis)}</p>`:""}
            ${t.notas?`<p class="text-xs text-text-muted mt-1">${a(t.notas)}</p>`:""}
          </div>
          <button type="button" data-delete-vacuna="${t.id}" class="focus-ring shrink-0 grid place-items-center size-8 rounded-control text-text-muted hover:bg-surface-alt hover:text-danger" aria-label="Eliminar registro de vacuna">
            ${i("trash","size-4")}
          </button>
        </div>`).join(""),document.getElementById("btn-edit").addEventListener("click",()=>{const t=m({title:"Editar animal",bodyHTML:T(e)});B(t.root,{animal:e,onSaved:r=>{z(r),t.close(),o()}})}),document.getElementById("btn-delete").addEventListener("click",async()=>{await p({title:"Eliminar animal",message:`Esta acción eliminará a "${e.nombre||e.arete}" y todo su historial de vacunación. No se puede deshacer.`,confirmLabel:"Eliminar",danger:!0})&&(E(e.id),F("Animal eliminado del hato.","info"),window.location.href="animales.html")}),document.getElementById("btn-add-vacuna").addEventListener("click",()=>{const t=m({title:`Registrar vacuna · ${e.nombre||e.arete}`,bodyHTML:V()});I(t.root,{fixedAnimalId:e.id,onSaved:r=>{k(r),t.close(),o()}})}),d.querySelectorAll("[data-delete-vacuna]").forEach(t=>{t.addEventListener("click",async()=>{await p({title:"Eliminar registro de vacuna",message:"Se eliminará este registro del historial de vacunación.",confirmLabel:"Eliminar",danger:!0})&&(L(t.dataset.deleteVacuna),o())})})}x?o():f();
