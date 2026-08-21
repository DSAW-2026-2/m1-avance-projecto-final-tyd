import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML, formatNumber, formatDate, qs } from "./utils.js";
import { getAnimal, upsertAnimal, deleteAnimal, getVacunasByAnimal, upsertVacuna, deleteVacuna, getEstadoVacunacion, vaccineLabel, edadTexto } from "./store.js";
import { vaccinationBadge, estadoBadge } from "./badges.js";
import { openModal } from "./modal.js";
import { confirmDialog } from "./confirm.js";
import { animalFormHTML, bindAnimalForm } from "./animalForm.js";
import { vaccineFormHTML, bindVaccineForm } from "./vaccineForm.js";
import { showToast } from "./toast.js";

renderLayout("animales", { title: "Detalle del animal" });

const pageBody = document.getElementById("page-body");
const animalId = qs("id");

function notFound() {
  pageBody.innerHTML = `
    <div class="mt-10 rounded-card border border-border bg-surface shadow-soft p-10 text-center">
      <span class="inline-grid place-items-center size-12 rounded-full bg-warning-soft text-warning mb-3">${icon("alertTriangle", "size-5")}</span>
      <p class="font-display text-lg font-semibold text-text">Animal no encontrado</p>
      <p class="text-sm text-text-muted mt-1">Puede que haya sido eliminado o el enlace sea incorrecto.</p>
      <a href="animales.html" class="focus-ring inline-flex items-center gap-2 mt-5 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
        ${icon("arrowLeft", "size-4")} Volver al listado
      </a>
    </div>`;
}

function infoRow(label, value) {
  return `
    <div class="py-2.5 flex items-center justify-between gap-4 border-b border-border last:border-0">
      <span class="text-sm text-text-muted">${label}</span>
      <span class="text-sm font-medium text-text text-right">${value}</span>
    </div>`;
}

function render() {
  const animal = getAnimal(animalId);
  if (!animal) {
    notFound();
    return;
  }

  document.title = `${animal.nombre || animal.arete} · MiHato`;
  const estadoVac = getEstadoVacunacion(animal.id);
  const historial = getVacunasByAnimal(animal.id);

  pageBody.innerHTML = `
    <a href="animales.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text focus-ring rounded">
      ${icon("arrowLeft", "size-4")} Volver a Animales
    </a>

    <div class="mt-4 rounded-card border border-border bg-surface shadow-soft p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="grid place-items-center size-14 rounded-full bg-primary-soft text-primary shrink-0">${icon("tag", "size-6")}</span>
          <div>
            <h2 class="font-display text-xl sm:text-2xl font-semibold text-text">${escapeHTML(animal.nombre || animal.arete)}</h2>
            <p class="text-sm text-text-muted">${escapeHTML(animal.arete)} · ${escapeHTML(animal.raza) || "Raza no registrada"}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${estadoBadge(animal.estado)}
              ${animal.estado === "Activo" ? vaccinationBadge(estadoVac.status) : ""}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" id="btn-edit" class="focus-ring inline-flex items-center gap-2 rounded-control border border-border px-3.5 py-2.5 text-sm font-medium text-text hover:bg-surface-alt">
            ${icon("pencil", "size-4")} Editar
          </button>
          <button type="button" id="btn-delete" class="focus-ring grid place-items-center size-10 rounded-control border border-border text-danger hover:bg-danger-soft" aria-label="Eliminar animal">
            ${icon("trash", "size-4.5")}
          </button>
        </div>
      </div>

      <div class="mt-5 grid sm:grid-cols-2 gap-x-8">
        <div>
          ${infoRow("Sexo", animal.sexo === "H" ? "Hembra" : "Macho")}
          ${infoRow("Categoría", escapeHTML(animal.categoria))}
          ${infoRow("Edad", edadTexto(animal.fechaNacimiento))}
        </div>
        <div>
          ${infoRow("Fecha de nacimiento", formatDate(animal.fechaNacimiento))}
          ${infoRow("Peso actual", animal.pesoKg ? `${formatNumber(animal.pesoKg)} kg` : "—")}
          ${infoRow("Potrero", escapeHTML(animal.potrero) || "—")}
        </div>
      </div>
      ${animal.notas ? `<p class="mt-4 text-sm text-text-muted bg-surface-alt rounded-control px-4 py-3">${escapeHTML(animal.notas)}</p>` : ""}
    </div>

    <div class="mt-6 rounded-card border border-border bg-surface shadow-soft">
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 class="font-display font-semibold text-text">Historial de vacunación</h2>
        <button type="button" id="btn-add-vacuna" class="focus-ring inline-flex items-center gap-2 rounded-control bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          ${icon("plus", "size-4")} Registrar
        </button>
      </div>
      <div id="historial-list" class="divide-y divide-border"></div>
    </div>`;

  const historialList = document.getElementById("historial-list");
  if (historial.length === 0) {
    historialList.innerHTML = `<p class="px-5 py-8 text-center text-sm text-text-muted">Aún no hay vacunas registradas para este animal.</p>`;
  } else {
    historialList.innerHTML = historial
      .map(
        (v) => `
        <div class="flex items-start gap-3 px-5 py-3.5">
          <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary mt-0.5">${icon("syringe", "size-4.5")}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text">${escapeHTML(vaccineLabel(v.tipo))}</p>
            <p class="text-xs text-text-muted mt-0.5">Aplicada el ${formatDate(v.fecha)}${v.veterinario ? ` · ${escapeHTML(v.veterinario)}` : ""}${v.lote ? ` · Lote ${escapeHTML(v.lote)}` : ""}</p>
            ${v.fechaProximaDosis ? `<p class="text-xs text-text-muted mt-0.5">Próxima dosis: ${formatDate(v.fechaProximaDosis)}</p>` : ""}
            ${v.notas ? `<p class="text-xs text-text-muted mt-1">${escapeHTML(v.notas)}</p>` : ""}
          </div>
          <button type="button" data-delete-vacuna="${v.id}" class="focus-ring shrink-0 grid place-items-center size-8 rounded-control text-text-muted hover:bg-surface-alt hover:text-danger" aria-label="Eliminar registro de vacuna">
            ${icon("trash", "size-4")}
          </button>
        </div>`
      )
      .join("");
  }

  document.getElementById("btn-edit").addEventListener("click", () => {
    const modal = openModal({ title: "Editar animal", bodyHTML: animalFormHTML(animal) });
    bindAnimalForm(modal.root, {
      animal,
      onSaved: (data) => {
        upsertAnimal(data);
        modal.close();
        render();
      }
    });
  });

  document.getElementById("btn-delete").addEventListener("click", async () => {
    const ok = await confirmDialog({
      title: "Eliminar animal",
      message: `Esta acción eliminará a "${animal.nombre || animal.arete}" y todo su historial de vacunación. No se puede deshacer.`,
      confirmLabel: "Eliminar",
      danger: true
    });
    if (!ok) return;
    deleteAnimal(animal.id);
    showToast("Animal eliminado del hato.", "info");
    window.location.href = "animales.html";
  });

  document.getElementById("btn-add-vacuna").addEventListener("click", () => {
    const modal = openModal({ title: `Registrar vacuna · ${animal.nombre || animal.arete}`, bodyHTML: vaccineFormHTML() });
    bindVaccineForm(modal.root, {
      fixedAnimalId: animal.id,
      onSaved: (vacuna) => {
        upsertVacuna(vacuna);
        modal.close();
        render();
      }
    });
  });

  historialList.querySelectorAll("[data-delete-vacuna]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog({
        title: "Eliminar registro de vacuna",
        message: "Se eliminará este registro del historial de vacunación.",
        confirmLabel: "Eliminar",
        danger: true
      });
      if (!ok) return;
      deleteVacuna(btn.dataset.deleteVacuna);
      render();
    });
  });
}

if (!animalId) {
  notFound();
} else {
  render();
}
