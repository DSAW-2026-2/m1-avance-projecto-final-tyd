import { escapeHTML, todayISO } from "./utils.js";
import { CATEGORIAS, ESTADOS, uid } from "./store.js";
import { showToast } from "./toast.js";

function fieldWrap(label, id, inputHTML, { required = false, error } = {}) {
  return `
    <div>
      <label for="${id}" class="block text-sm font-medium text-text mb-1.5">${label}${required ? ' <span class="text-danger">*</span>' : ""}</label>
      ${inputHTML}
      <p id="${id}-error" class="mt-1 text-xs text-danger ${error ? "" : "hidden"}">${error || ""}</p>
    </div>`;
}

const inputCls =
  "focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";

export function animalFormHTML(animal) {
  const a = animal || {
    arete: "",
    nombre: "",
    sexo: "H",
    categoria: "Vaca",
    raza: "",
    fechaNacimiento: "",
    pesoKg: "",
    potrero: "",
    estado: "Activo",
    notas: ""
  };

  return `
    <form id="animal-form" novalidate class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap(
          "Arete / ID",
          "f-arete",
          `<input id="f-arete" name="arete" type="text" required class="${inputCls}" value="${escapeHTML(a.arete)}" placeholder="Ej. COR-0312" autocomplete="off" />`,
          { required: true }
        )}
        ${fieldWrap(
          "Nombre (opcional)",
          "f-nombre",
          `<input id="f-nombre" name="nombre" type="text" class="${inputCls}" value="${escapeHTML(a.nombre)}" placeholder="Ej. Lucero" autocomplete="off" />`
        )}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap(
          "Sexo",
          "f-sexo",
          `<select id="f-sexo" name="sexo" required class="${inputCls}">
            <option value="H" ${a.sexo === "H" ? "selected" : ""}>Hembra</option>
            <option value="M" ${a.sexo === "M" ? "selected" : ""}>Macho</option>
          </select>`,
          { required: true }
        )}
        ${fieldWrap(
          "Categoría",
          "f-categoria",
          `<select id="f-categoria" name="categoria" required class="${inputCls}">
            ${CATEGORIAS.map((c) => `<option value="${c}" ${a.categoria === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>`,
          { required: true }
        )}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap(
          "Raza",
          "f-raza",
          `<input id="f-raza" name="raza" type="text" class="${inputCls}" value="${escapeHTML(a.raza)}" placeholder="Ej. Cebú, Brahman…" autocomplete="off" />`
        )}
        ${fieldWrap(
          "Fecha de nacimiento",
          "f-fecha",
          `<input id="f-fecha" name="fechaNacimiento" type="date" required max="${todayISO()}" class="${inputCls}" value="${escapeHTML(a.fechaNacimiento)}" />`,
          { required: true }
        )}
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        ${fieldWrap(
          "Peso actual (kg)",
          "f-peso",
          `<input id="f-peso" name="pesoKg" type="number" min="0" step="1" inputmode="numeric" class="${inputCls}" value="${escapeHTML(a.pesoKg)}" placeholder="Ej. 380" />`
        )}
        ${fieldWrap(
          "Potrero",
          "f-potrero",
          `<input id="f-potrero" name="potrero" type="text" class="${inputCls}" value="${escapeHTML(a.potrero)}" placeholder="Ej. Potrero 1" autocomplete="off" />`
        )}
      </div>
      ${fieldWrap(
        "Estado",
        "f-estado",
        `<select id="f-estado" name="estado" required class="${inputCls}">
          ${ESTADOS.map((e) => `<option value="${e}" ${a.estado === e ? "selected" : ""}>${e}</option>`).join("")}
        </select>`,
        { required: true }
      )}
      ${fieldWrap(
        "Notas",
        "f-notas",
        `<textarea id="f-notas" name="notas" rows="2" class="${inputCls} resize-none">${escapeHTML(a.notas)}</textarea>`
      )}
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" data-action="close-modal" class="focus-ring rounded-control px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt">Cancelar</button>
        <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          ${animal ? "Guardar cambios" : "Agregar animal"}
        </button>
      </div>
    </form>`;
}

function setError(form, field, message) {
  const errEl = form.querySelector(`#f-${field}-error`);
  const inputEl = form.querySelector(`[name="${field}"]`);
  if (errEl) {
    errEl.textContent = message || "";
    errEl.classList.toggle("hidden", !message);
  }
  if (inputEl) inputEl.setAttribute("aria-invalid", message ? "true" : "false");
  return message;
}

export function bindAnimalForm(root, { animal, onSaved }) {
  const form = root.querySelector("#animal-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const arete = String(data.get("arete") || "").trim();
    const fechaNacimiento = String(data.get("fechaNacimiento") || "");
    const pesoRaw = data.get("pesoKg");

    let hasError = false;
    hasError = Boolean(setError(form, "arete", arete ? "" : "Ingresa el arete o ID del animal.")) || hasError;
    hasError = Boolean(setError(form, "fecha", fechaNacimiento ? "" : "Ingresa la fecha de nacimiento.")) || hasError;

    if (hasError) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const result = {
      id: animal?.id || uid("animal"),
      arete,
      nombre: String(data.get("nombre") || "").trim(),
      sexo: data.get("sexo"),
      categoria: data.get("categoria"),
      raza: String(data.get("raza") || "").trim(),
      fechaNacimiento,
      pesoKg: pesoRaw ? Number(pesoRaw) : 0,
      potrero: String(data.get("potrero") || "").trim(),
      estado: data.get("estado"),
      notas: String(data.get("notas") || "").trim(),
      fechaRegistro: animal?.fechaRegistro || todayISO()
    };

    onSaved(result);
    showToast(animal ? "Cambios guardados." : "Animal agregado al hato.", "success");
  });
}
