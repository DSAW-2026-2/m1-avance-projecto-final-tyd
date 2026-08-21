import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML } from "./utils.js";
import { getFinca, saveFinca, getTheme, setTheme, resetDemoData } from "./store.js";
import { confirmDialog } from "./confirm.js";
import { showToast } from "./toast.js";

renderLayout("configuracion", { title: "Configuración", subtitle: "Datos de la finca y preferencias" });

const inputCls =
  "focus-ring w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted";

function field(label, name, value, type = "text") {
  return `
    <div>
      <label for="f-${name}" class="block text-sm font-medium text-text mb-1.5">${label}</label>
      <input id="f-${name}" name="${name}" type="${type}" class="${inputCls}" value="${escapeHTML(value)}" />
    </div>`;
}

function renderFincaForm() {
  const finca = getFinca();
  const form = document.getElementById("finca-form");
  form.innerHTML = `
    ${field("Nombre de la finca", "nombre", finca.nombre)}
    ${field("Propietario(a)", "propietario", finca.propietario)}
    <div class="grid sm:grid-cols-2 gap-4">
      ${field("Vereda", "vereda", finca.vereda)}
      ${field("Municipio", "municipio", finca.municipio)}
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      ${field("Departamento", "departamento", finca.departamento)}
      ${field("Código ICA", "codigoICA", finca.codigoICA)}
    </div>
    <div class="flex justify-end pt-1">
      <button type="submit" class="focus-ring rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">Guardar cambios</button>
    </div>`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    saveFinca({
      nombre: String(data.get("nombre") || "").trim(),
      propietario: String(data.get("propietario") || "").trim(),
      vereda: String(data.get("vereda") || "").trim(),
      municipio: String(data.get("municipio") || "").trim(),
      departamento: String(data.get("departamento") || "").trim(),
      codigoICA: String(data.get("codigoICA") || "").trim(),
      unidadPeso: "kg"
    });
    showToast("Datos de la finca actualizados.", "success");
  });
}

function renderThemeSwitch() {
  const btn = document.getElementById("theme-switch");
  const thumb = document.getElementById("theme-switch-thumb");

  function paint(theme) {
    const isDark = theme === "dark";
    btn.setAttribute("aria-checked", String(isDark));
    btn.classList.toggle("bg-primary", isDark);
    btn.classList.toggle("bg-surface-alt", !isDark);
    thumb.classList.toggle("translate-x-6", isDark);
    thumb.classList.toggle("translate-x-1", !isDark);
  }

  paint(getTheme());

  btn.addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.querySelectorAll(".theme-toggle").forEach((t) => {
      t.setAttribute("aria-pressed", String(next === "dark"));
      t.innerHTML = next === "dark" ? icon("sun", "size-5") : icon("moon", "size-5");
    });
    paint(next);
  });
}

function renderReset() {
  const btn = document.getElementById("btn-reset");
  btn.innerHTML = `${icon("trash", "size-4.5")} Restablecer datos de demostración`;
  btn.addEventListener("click", async () => {
    const ok = await confirmDialog({
      title: "Restablecer datos",
      message: "Se eliminarán todos los animales, vacunas y datos de la finca actuales, y se restaurará la información de ejemplo.",
      confirmLabel: "Restablecer",
      danger: true
    });
    if (!ok) return;
    resetDemoData();
    showToast("Datos restablecidos.", "info");
    setTimeout(() => window.location.assign("dashboard.html"), 600);
  });
}

renderFincaForm();
renderThemeSwitch();
renderReset();
