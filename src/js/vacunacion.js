import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML, formatDate, formatNumber } from "./utils.js";
import { getAnimales, getVacunas, getEstadoVacunacion, upsertVacuna, vaccineLabel } from "./store.js";
import { vaccinationBadge } from "./badges.js";
import { openModal } from "./modal.js";
import { vaccineFormHTML, bindVaccineForm } from "./vaccineForm.js";

renderLayout("vacunacion", {
  title: "Vacunación",
  subtitle: "Calendario y registro de dosis",
  actions: `
    <button type="button" id="btn-add-desktop" class="hidden lg:inline-flex focus-ring items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
      ${icon("plus", "size-4.5")} Registrar vacuna
    </button>`
});

const fabAdd = document.getElementById("fab-add");
fabAdd.innerHTML = icon("plus", "size-6");

function openVaccineModal() {
  const animals = getAnimales()
    .filter((a) => a.estado === "Activo")
    .sort((a, b) => a.arete.localeCompare(b.arete));
  const modal = openModal({ title: "Registrar vacuna", bodyHTML: vaccineFormHTML({ animals }) });
  bindVaccineForm(modal.root, {
    onSaved: (vacuna) => {
      upsertVacuna(vacuna);
      modal.close();
      render();
    }
  });
}

function render() {
  const activos = getAnimales().filter((a) => a.estado === "Activo");
  const conEstado = activos.map((a) => ({ animal: a, estado: getEstadoVacunacion(a.id) }));

  const vencidas = conEstado.filter((x) => x.estado.status === "vencida");
  const proximas = conEstado.filter((x) => x.estado.status === "proxima");
  const alDia = conEstado.filter((x) => x.estado.status === "al-dia");
  const sinRegistro = conEstado.filter((x) => x.estado.status === "sin-registro");

  document.getElementById("stat-vencidas").textContent = formatNumber(vencidas.length);
  document.getElementById("stat-proximas").textContent = formatNumber(proximas.length);
  document.getElementById("stat-aldia").textContent = formatNumber(alDia.length);

  const pendientesList = document.getElementById("pendientes-list");
  const pendientes = [...vencidas, ...proximas, ...sinRegistro].sort((a, b) => (a.estado.diasRestantes ?? -9999) - (b.estado.diasRestantes ?? -9999));

  if (pendientes.length === 0) {
    pendientesList.innerHTML = `
      <div class="px-5 py-8 text-center">
        <span class="inline-grid place-items-center size-11 rounded-full bg-success-soft text-success mb-3">${icon("checkCircle", "size-5")}</span>
        <p class="text-sm text-text-muted">Todo el hato está al día con la Fiebre Aftosa.</p>
      </div>`;
  } else {
    pendientesList.innerHTML = pendientes
      .map(
        ({ animal, estado }) => `
        <div class="flex items-center gap-3 px-5 py-3.5">
          <a href="animal.html?id=${encodeURIComponent(animal.id)}" class="flex-1 min-w-0 flex items-center gap-3 hover:opacity-80 focus-ring rounded">
            <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${icon("tag", "size-4.5")}</span>
            <span class="min-w-0">
              <span class="block text-sm font-medium text-text truncate">${escapeHTML(animal.nombre || animal.arete)}${animal.nombre ? ` <span class="text-text-muted font-normal">· ${escapeHTML(animal.arete)}</span>` : ""}</span>
              <span class="block text-xs text-text-muted">${escapeHTML(animal.categoria)} · ${escapeHTML(animal.potrero) || "Sin potrero"}</span>
            </span>
          </a>
          ${vaccinationBadge(estado.status)}
          <button type="button" data-quick-vaccinate="${animal.id}" class="focus-ring shrink-0 rounded-control border border-border px-3 py-2 text-xs font-semibold text-text hover:bg-surface-alt">Registrar</button>
        </div>`
      )
      .join("");

    pendientesList.querySelectorAll("[data-quick-vaccinate]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const animal = getAnimales().find((a) => a.id === btn.dataset.quickVaccinate);
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
    });
  }

  const tbody = document.getElementById("historial-tbody");
  const emptyState = document.getElementById("historial-empty");
  const historial = getVacunas().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const animalesById = new Map(getAnimales().map((a) => [a.id, a]));

  if (historial.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    emptyState.textContent = "Aún no se han registrado vacunas.";
  } else {
    emptyState.classList.add("hidden");
    tbody.innerHTML = historial
      .map((v) => {
        const a = animalesById.get(v.animalId);
        return `
          <tr class="hover:bg-surface-alt">
            <td class="px-5 py-3 font-medium text-text whitespace-nowrap">
              ${a ? `<a href="animal.html?id=${encodeURIComponent(a.id)}" class="hover:underline focus-ring rounded">${escapeHTML(a.nombre || a.arete)}</a>` : '<span class="text-text-muted">Animal eliminado</span>'}
            </td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap">${escapeHTML(vaccineLabel(v.tipo))}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap tabular">${formatDate(v.fecha)}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap tabular">${v.fechaProximaDosis ? formatDate(v.fechaProximaDosis) : "—"}</td>
            <td class="px-5 py-3 text-text-muted whitespace-nowrap">${escapeHTML(v.veterinario) || "—"}</td>
          </tr>`;
      })
      .join("");
  }
}

document.getElementById("btn-add-desktop").addEventListener("click", openVaccineModal);
fabAdd.addEventListener("click", openVaccineModal);

render();
