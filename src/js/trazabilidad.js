import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML, formatDate, formatNumber, todayISO } from "./utils.js";
import { getAnimales, getVacunasByAnimal, getEstadoVacunacion, getFinca, vaccineLabel, edadTexto } from "./store.js";
import { vaccinationBadge, estadoBadge } from "./badges.js";
import { showToast } from "./toast.js";

renderLayout("trazabilidad", { title: "Trazabilidad", subtitle: "Reportes para el ICA o compradores" });

const select = document.getElementById("report-scope");
const btnCsv = document.getElementById("btn-csv");
const btnPrint = document.getElementById("btn-print");
const reportEl = document.getElementById("report");

btnCsv.innerHTML = `${icon("download", "size-4.5")} Exportar CSV`;
btnPrint.innerHTML = `${icon("printer", "size-4.5")} Imprimir`;

const activos = getAnimales()
  .filter((a) => a.estado === "Activo")
  .sort((a, b) => a.arete.localeCompare(b.arete));

activos.forEach((a) => {
  select.insertAdjacentHTML("beforeend", `<option value="${a.id}">${escapeHTML(a.arete)}${a.nombre ? " · " + escapeHTML(a.nombre) : ""}</option>`);
});

function fincaHeaderHTML(finca) {
  return `
    <div class="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-border">
      <div>
        <p class="text-xs font-medium text-text-muted uppercase tracking-wide">Reporte de trazabilidad</p>
        <h2 class="font-display text-xl font-semibold text-text mt-1">${escapeHTML(finca.nombre)}</h2>
        <p class="text-sm text-text-muted mt-0.5">${escapeHTML(finca.vereda)}, ${escapeHTML(finca.municipio)}, ${escapeHTML(finca.departamento)}</p>
      </div>
      <div class="text-sm text-right">
        <p class="text-text-muted">Código ICA</p>
        <p class="font-semibold text-text">${escapeHTML(finca.codigoICA) || "—"}</p>
        <p class="text-text-muted mt-2">Generado el ${formatDate(todayISO())}</p>
      </div>
    </div>`;
}

function renderHatoReport() {
  const finca = getFinca();
  const rows = activos
    .map((a) => {
      const estado = getEstadoVacunacion(a.id);
      return `
        <tr class="border-b border-border last:border-0">
          <td class="py-2.5 pr-4 font-medium text-text whitespace-nowrap">${escapeHTML(a.arete)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${escapeHTML(a.nombre) || "—"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${escapeHTML(a.categoria)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${a.sexo === "H" ? "Hembra" : "Macho"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${edadTexto(a.fechaNacimiento)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${escapeHTML(a.potrero) || "—"}</td>
          <td class="py-2.5 whitespace-nowrap">${vaccinationBadge(estado.status)}</td>
        </tr>`;
    })
    .join("");

  reportEl.innerHTML = `
    ${fincaHeaderHTML(finca)}
    <div class="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Total activos</p><p class="font-semibold text-text tabular mt-0.5">${formatNumber(activos.length)}</p></div>
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Al día en Aftosa</p><p class="font-semibold text-success tabular mt-0.5">${formatNumber(activos.filter((a) => getEstadoVacunacion(a.id).status === "al-dia").length)}</p></div>
      <div class="rounded-control bg-surface-alt px-4 py-3"><p class="text-text-muted">Con alerta</p><p class="font-semibold text-danger tabular mt-0.5">${formatNumber(activos.filter((a) => ["vencida", "proxima"].includes(getEstadoVacunacion(a.id).status)).length)}</p></div>
    </div>
    <div class="mt-6 overflow-x-auto scrollbar-thin">
      <table class="w-full text-sm min-w-[700px]">
        <thead>
          <tr class="text-left text-xs font-medium text-text-muted border-b border-border">
            <th class="py-2.5 pr-4">Arete</th><th class="py-2.5 pr-4">Nombre</th><th class="py-2.5 pr-4">Categoría</th>
            <th class="py-2.5 pr-4">Sexo</th><th class="py-2.5 pr-4">Edad</th><th class="py-2.5 pr-4">Potrero</th><th class="py-2.5">Vacunación (Aftosa)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderAnimalReport(animalId) {
  const animal = activos.find((a) => a.id === animalId);
  const finca = getFinca();
  if (!animal) {
    renderHatoReport();
    return;
  }
  const historial = getVacunasByAnimal(animal.id);
  const rows = historial.length
    ? historial
        .map(
          (v) => `
        <tr class="border-b border-border last:border-0">
          <td class="py-2.5 pr-4 text-text whitespace-nowrap">${escapeHTML(vaccineLabel(v.tipo))}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${formatDate(v.fecha)}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${v.fechaProximaDosis ? formatDate(v.fechaProximaDosis) : "—"}</td>
          <td class="py-2.5 pr-4 text-text-muted whitespace-nowrap">${escapeHTML(v.lote) || "—"}</td>
          <td class="py-2.5 text-text-muted whitespace-nowrap">${escapeHTML(v.veterinario) || "—"}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="5" class="py-6 text-center text-text-muted">Sin registros de vacunación.</td></tr>`;

  reportEl.innerHTML = `
    ${fincaHeaderHTML(finca)}
    <div class="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
      <p><span class="text-text-muted">Arete:</span> <span class="font-semibold text-text">${escapeHTML(animal.arete)}</span></p>
      <p><span class="text-text-muted">Nombre:</span> <span class="font-semibold text-text">${escapeHTML(animal.nombre) || "—"}</span></p>
      <p><span class="text-text-muted">Raza:</span> <span class="font-semibold text-text">${escapeHTML(animal.raza) || "—"}</span></p>
      <p><span class="text-text-muted">Categoría:</span> <span class="font-semibold text-text">${escapeHTML(animal.categoria)}</span></p>
      <p><span class="text-text-muted">Sexo:</span> <span class="font-semibold text-text">${animal.sexo === "H" ? "Hembra" : "Macho"}</span></p>
      <p><span class="text-text-muted">Edad:</span> <span class="font-semibold text-text">${edadTexto(animal.fechaNacimiento)}</span></p>
      <p><span class="text-text-muted">Potrero:</span> <span class="font-semibold text-text">${escapeHTML(animal.potrero) || "—"}</span></p>
      <p>${estadoBadge(animal.estado)}</p>
    </div>
    <h3 class="font-display font-semibold text-text mt-6 mb-2">Historial de vacunación</h3>
    <div class="overflow-x-auto scrollbar-thin">
      <table class="w-full text-sm min-w-[600px]">
        <thead>
          <tr class="text-left text-xs font-medium text-text-muted border-b border-border">
            <th class="py-2.5 pr-4">Vacuna</th><th class="py-2.5 pr-4">Fecha</th><th class="py-2.5 pr-4">Próxima dosis</th><th class="py-2.5 pr-4">Lote</th><th class="py-2.5">Veterinario(a)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function render() {
  if (select.value === "hato") renderHatoReport();
  else renderAnimalReport(select.value);
}

function csvEscape(value) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function exportCSV() {
  let header;
  let lines;

  if (select.value === "hato") {
    header = ["Arete", "Nombre", "Categoria", "Sexo", "Edad", "Potrero", "Estado vacunacion Aftosa"];
    lines = activos.map((a) => {
      const estado = getEstadoVacunacion(a.id);
      return [a.arete, a.nombre, a.categoria, a.sexo === "H" ? "Hembra" : "Macho", edadTexto(a.fechaNacimiento), a.potrero, estado.label];
    });
  } else {
    const animal = activos.find((a) => a.id === select.value);
    header = ["Vacuna", "Fecha", "Proxima dosis", "Lote", "Veterinario"];
    lines = getVacunasByAnimal(animal.id).map((v) => [vaccineLabel(v.tipo), v.fecha, v.fechaProximaDosis || "", v.lote, v.veterinario]);
  }

  const csv = [header, ...lines].map((row) => row.map(csvEscape).join(",")).join("\n");
  const BOM = String.fromCharCode(0xfeff);
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const scopeName = select.value === "hato" ? "hato" : activos.find((x) => x.id === select.value)?.arete || "animal";
  a.href = url;
  a.download = `mihato-trazabilidad-${scopeName}-${todayISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Reporte CSV descargado.", "success");
}

select.addEventListener("change", render);
btnCsv.addEventListener("click", exportCSV);
btnPrint.addEventListener("click", () => window.print());

render();
