import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML, formatNumber, debounce } from "./utils.js";
import { getAnimales, upsertAnimal, deleteAnimal, getEstadoVacunacion, CATEGORIAS, ESTADOS, edadTexto } from "./store.js";
import { vaccinationBadge, estadoBadge } from "./badges.js";
import { openModal } from "./modal.js";
import { confirmDialog } from "./confirm.js";
import { animalFormHTML, bindAnimalForm } from "./animalForm.js";
import { showToast } from "./toast.js";

renderLayout("animales", {
  title: "Animales",
  subtitle: "Listado y gestión del hato",
  actions: `
    <button type="button" id="btn-add-desktop" class="hidden lg:inline-flex focus-ring items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
      ${icon("plus", "size-4.5")} Agregar animal
    </button>`
});

const tbody = document.getElementById("animales-tbody");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const searchInput = document.getElementById("search-input");
const filterCategoria = document.getElementById("filter-categoria");
const filterEstado = document.getElementById("filter-estado");
const fabAdd = document.getElementById("fab-add");
const btnAddDesktop = document.getElementById("btn-add-desktop");

fabAdd.innerHTML = icon("plus", "size-6");

CATEGORIAS.forEach((c) => filterCategoria.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
ESTADOS.forEach((e) => filterEstado.insertAdjacentHTML("beforeend", `<option value="${e}">${e}</option>`));
filterEstado.value = "Activo";

function currentFilters() {
  return {
    q: searchInput.value.trim().toLowerCase(),
    categoria: filterCategoria.value,
    estado: filterEstado.value
  };
}

function rowHTML(a) {
  const estadoVac = getEstadoVacunacion(a.id);
  return `
    <tr class="hover:bg-surface-alt cursor-pointer" data-id="${a.id}" tabindex="0">
      <td class="px-4 py-3 font-medium text-text whitespace-nowrap">${escapeHTML(a.arete)}</td>
      <td class="px-4 py-3 text-text">${escapeHTML(a.nombre) || '<span class="text-text-muted">—</span>'}</td>
      <td class="px-4 py-3 text-text-muted whitespace-nowrap">${escapeHTML(a.categoria)}</td>
      <td class="px-4 py-3 text-text-muted whitespace-nowrap tabular">${edadTexto(a.fechaNacimiento)}</td>
      <td class="px-4 py-3 text-text-muted whitespace-nowrap tabular">${a.pesoKg ? `${formatNumber(a.pesoKg)} kg` : "—"}</td>
      <td class="px-4 py-3 text-text-muted whitespace-nowrap">${escapeHTML(a.potrero) || "—"}</td>
      <td class="px-4 py-3 whitespace-nowrap">${a.estado === "Activo" ? vaccinationBadge(estadoVac.status) : estadoBadge(a.estado)}</td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1">
          <button type="button" data-action="edit" data-id="${a.id}" class="focus-ring grid place-items-center size-9 rounded-control text-text-muted hover:bg-surface hover:text-primary" aria-label="Editar ${escapeHTML(a.arete)}">${icon("pencil", "size-4.5")}</button>
          <button type="button" data-action="delete" data-id="${a.id}" class="focus-ring grid place-items-center size-9 rounded-control text-text-muted hover:bg-surface hover:text-danger" aria-label="Eliminar ${escapeHTML(a.arete)}">${icon("trash", "size-4.5")}</button>
        </div>
      </td>
    </tr>`;
}

function render() {
  const { q, categoria, estado } = currentFilters();
  const all = getAnimales();
  const filtered = all
    .filter((a) => (categoria ? a.categoria === categoria : true))
    .filter((a) => (estado ? a.estado === estado : true))
    .filter((a) => (q ? `${a.arete} ${a.nombre}`.toLowerCase().includes(q) : true))
    .sort((a, b) => a.arete.localeCompare(b.arete));

  resultsCount.textContent = `${formatNumber(filtered.length)} de ${formatNumber(all.length)} animales`;

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    emptyState.innerHTML = `
      <span class="inline-grid place-items-center size-12 rounded-full bg-surface-alt text-text-muted mb-3">${icon("tag", "size-5")}</span>
      <p class="text-sm font-medium text-text">No se encontraron animales</p>
      <p class="text-sm text-text-muted mt-1">Ajusta la búsqueda o los filtros, o agrega un nuevo animal al hato.</p>`;
    return;
  }

  emptyState.classList.add("hidden");
  tbody.innerHTML = filtered.map(rowHTML).join("");
}

function openAnimalModal(animal) {
  const modal = openModal({
    title: animal ? "Editar animal" : "Agregar animal",
    bodyHTML: animalFormHTML(animal)
  });
  bindAnimalForm(modal.root, {
    animal,
    onSaved: (data) => {
      upsertAnimal(data);
      modal.close();
      render();
    }
  });
}

async function handleDelete(id) {
  const animal = getAnimales().find((a) => a.id === id);
  if (!animal) return;
  const ok = await confirmDialog({
    title: "Eliminar animal",
    message: `Esta acción eliminará a "${animal.nombre || animal.arete}" y todo su historial de vacunación. No se puede deshacer.`,
    confirmLabel: "Eliminar",
    danger: true
  });
  if (!ok) return;
  deleteAnimal(id);
  render();
  showToast("Animal eliminado del hato.", "info");
}

tbody.addEventListener("click", (e) => {
  const editBtn = e.target.closest('[data-action="edit"]');
  const deleteBtn = e.target.closest('[data-action="delete"]');
  if (editBtn) {
    openAnimalModal(getAnimales().find((a) => a.id === editBtn.dataset.id));
    return;
  }
  if (deleteBtn) {
    handleDelete(deleteBtn.dataset.id);
    return;
  }
  const row = e.target.closest("tr[data-id]");
  if (row) window.location.href = `animal.html?id=${encodeURIComponent(row.dataset.id)}`;
});

tbody.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const row = e.target.closest("tr[data-id]");
  if (row) window.location.href = `animal.html?id=${encodeURIComponent(row.dataset.id)}`;
});

searchInput.addEventListener("input", debounce(render, 200));
filterCategoria.addEventListener("change", render);
filterEstado.addEventListener("change", render);
fabAdd.addEventListener("click", () => openAnimalModal(null));
btnAddDesktop.addEventListener("click", () => openAnimalModal(null));

render();
