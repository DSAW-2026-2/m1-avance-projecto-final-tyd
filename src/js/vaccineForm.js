import { escapeHTML, todayISO } from "./utils.js";
import { VACCINE_TYPES, uid, calcularProximaDosis } from "./store.js";
import { showToast } from "./toast.js";

const inputCls =
  "focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";

function fieldWrap(label, id, inputHTML, required = false) {
  return `
    <div>
      <label for="${id}" class="block text-sm font-medium text-text mb-1.5">${label}${required ? ' <span class="text-danger">*</span>' : ""}</label>
      ${inputHTML}
      <p id="${id}-error" class="mt-1 text-xs text-danger hidden"></p>
    </div>`;
}

export function vaccineFormHTML({ animals } = {}) {
  const animalField = animals
    ? fieldWrap(
        "Animal",
        "v-animal",
        `<select id="v-animal" name="animalId" required class="${inputCls}">
          <option value="">Selecciona un animal…</option>
          ${animals.map((a) => `<option value="${a.id}">${escapeHTML(a.arete)}${a.nombre ? " · " + escapeHTML(a.nombre) : ""}</option>`).join("")}
        </select>`,
        true
      )
    : "";

  return `
    <form id="vaccine-form" novalidate class="space-y-4">
      ${animalField}
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap(
          "Tipo de vacuna",
          "v-tipo",
          `<select id="v-tipo" name="tipo" required class="${inputCls}">
            ${VACCINE_TYPES.map((t) => `<option value="${t.id}">${t.nombre}${t.obligatoriaICA ? " (ICA)" : ""}</option>`).join("")}
          </select>`,
          true
        )}
        ${fieldWrap(
          "Fecha de aplicación",
          "v-fecha",
          `<input id="v-fecha" name="fecha" type="date" required max="${todayISO()}" value="${todayISO()}" class="${inputCls}" />`,
          true
        )}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap("Lote", "v-lote", `<input id="v-lote" name="lote" type="text" class="${inputCls}" placeholder="Ej. AF-2240" autocomplete="off" />`)}
        ${fieldWrap("Veterinario(a)", "v-vet", `<input id="v-vet" name="veterinario" type="text" class="${inputCls}" placeholder="Ej. Dra. Camila Restrepo" autocomplete="off" />`)}
      </div>
      ${fieldWrap("Notas", "v-notas", `<textarea id="v-notas" name="notas" rows="2" class="${inputCls} resize-none"></textarea>`)}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" data-action="close-modal" class="focus-ring rounded-control px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt">Cancelar</button>
        <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">Registrar vacuna</button>
      </div>
    </form>`;
}

function setError(form, field, message) {
  const errEl = form.querySelector(`#v-${field}-error`);
  const inputEl = form.querySelector(`[name="${field}"]`);
  if (errEl) {
    errEl.textContent = message || "";
    errEl.classList.toggle("hidden", !message);
  }
  if (inputEl) inputEl.setAttribute("aria-invalid", message ? "true" : "false");
  return message;
}

export function bindVaccineForm(root, { fixedAnimalId, onSaved }) {
  const form = root.querySelector("#vaccine-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const animalId = fixedAnimalId || data.get("animalId");
    const tipo = data.get("tipo");
    const fecha = data.get("fecha");

    let hasError = false;
    if (!fixedAnimalId) {
      hasError = Boolean(setError(form, "animal", animalId ? "" : "Selecciona un animal.")) || hasError;
    }
    hasError = Boolean(setError(form, "fecha", fecha ? "" : "Ingresa la fecha de aplicación.")) || hasError;

    if (hasError) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const vacuna = {
      id: uid("vac"),
      animalId,
      tipo,
      fecha,
      fechaProximaDosis: calcularProximaDosis(tipo, fecha),
      lote: String(data.get("lote") || "").trim(),
      veterinario: String(data.get("veterinario") || "").trim(),
      notas: String(data.get("notas") || "").trim(),
      fechaRegistro: todayISO()
    };

    onSaved(vacuna);
    showToast("Vacuna registrada correctamente.", "success");
  });
}
