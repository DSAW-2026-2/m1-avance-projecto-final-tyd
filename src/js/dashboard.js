import { renderLayout } from "./layout.js";
import { icon } from "./icons.js";
import { escapeHTML, formatDate, formatNumber } from "./utils.js";
import { getAnimales, getVacunas, getEstadoVacunacion, CATEGORIAS, vaccineLabel } from "./store.js";

renderLayout("dashboard", { title: "Dashboard", subtitle: "Resumen general de tu hato" });

const animales = getAnimales();
const activos = animales.filter((a) => a.estado === "Activo");

function renderKPIs() {
  document.getElementById("kpi-total").textContent = formatNumber(activos.length);

  const alertas = activos.filter((a) => ["vencida", "proxima"].includes(getEstadoVacunacion(a.id).status));
  document.getElementById("kpi-alertas").textContent = formatNumber(alertas.length);

  const crias = activos.filter((a) => {
    const dias = (Date.now() - new Date(a.fechaNacimiento).getTime()) / 86400000;
    return dias < 182;
  });
  document.getElementById("kpi-crias").textContent = formatNumber(crias.length);

  const conPeso = activos.filter((a) => a.pesoKg > 0);
  const promedio = conPeso.length ? Math.round(conPeso.reduce((sum, a) => sum + a.pesoKg, 0) / conPeso.length) : 0;
  document.getElementById("kpi-peso").textContent = `${formatNumber(promedio)} kg`;
}

function renderAlertas() {
  const container = document.getElementById("alertas-list");
  const alertas = activos
    .map((a) => ({ animal: a, estado: getEstadoVacunacion(a.id) }))
    .filter((x) => ["vencida", "proxima"].includes(x.estado.status))
    .sort((a, b) => (a.estado.diasRestantes ?? 0) - (b.estado.diasRestantes ?? 0));

  if (alertas.length === 0) {
    container.innerHTML = `
      <div class="px-5 py-8 text-center">
        <span class="inline-grid place-items-center size-11 rounded-full bg-success-soft text-success mb-3">${icon("checkCircle", "size-5")}</span>
        <p class="text-sm text-text-muted">No hay alertas de vacunación pendientes. ¡Buen trabajo!</p>
      </div>`;
    return;
  }

  container.innerHTML = alertas
    .slice(0, 6)
    .map(({ animal, estado }) => {
      const vencida = estado.status === "vencida";
      return `
        <a href="animal.html?id=${encodeURIComponent(animal.id)}" class="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-alt focus-ring">
          <span class="shrink-0 grid place-items-center size-9 rounded-full ${vencida ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning"}">
            ${icon("alertTriangle", "size-4.5")}
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-text truncate">${escapeHTML(animal.nombre || animal.arete)}${animal.nombre ? ` <span class="text-text-muted font-normal">· ${escapeHTML(animal.arete)}</span>` : ""}</span>
            <span class="block text-xs ${vencida ? "text-danger" : "text-warning"}">${escapeHTML(estado.label)} · Fiebre Aftosa</span>
          </span>
          <span class="shrink-0 text-text-muted">${icon("chevronRight", "size-4")}</span>
        </a>`;
    })
    .join("");
}

function renderComposicion() {
  const container = document.getElementById("composicion-chart");
  const counts = CATEGORIAS.map((cat) => ({
    cat,
    n: activos.filter((a) => a.categoria === cat).length
  })).filter((c) => c.n > 0);

  if (counts.length === 0) {
    container.innerHTML = `<p class="text-sm text-text-muted">Sin animales registrados.</p>`;
    return;
  }

  const max = Math.max(...counts.map((c) => c.n));
  container.innerHTML = counts
    .map(
      (c) => `
      <div class="flex items-center gap-3 py-1.5">
        <span class="w-16 shrink-0 text-xs text-text-muted">${escapeHTML(c.cat)}</span>
        <span class="flex-1 h-3 rounded-full bg-surface-alt overflow-hidden">
          <span class="block h-full rounded-full bg-primary" style="width:${Math.max(6, (c.n / max) * 100)}%"></span>
        </span>
        <span class="w-6 shrink-0 text-xs font-semibold text-text tabular text-right">${c.n}</span>
      </div>`
    )
    .join("");
}

function renderActividad() {
  const container = document.getElementById("actividad-list");
  const vacunas = getVacunas();

  const eventos = [
    ...animales.map((a) => ({ tipo: "animal", fecha: a.fechaRegistro, animal: a })),
    ...vacunas.map((v) => ({ tipo: "vacuna", fecha: v.fechaRegistro, vacuna: v, animal: animales.find((a) => a.id === v.animalId) }))
  ]
    .filter((e) => e.animal)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 8);

  if (eventos.length === 0) {
    container.innerHTML = `<li class="px-5 py-8 text-center text-sm text-text-muted">Aún no hay actividad registrada.</li>`;
    return;
  }

  container.innerHTML = eventos
    .map((e) => {
      if (e.tipo === "animal") {
        return `
          <li class="flex items-center gap-3 px-5 py-3.5">
            <span class="shrink-0 grid place-items-center size-9 rounded-full bg-info-soft text-info">${icon("tag", "size-4.5")}</span>
            <span class="flex-1 min-w-0 text-sm text-text">Se registró <strong class="font-medium">${escapeHTML(e.animal.nombre || e.animal.arete)}</strong> en el hato</span>
            <span class="shrink-0 text-xs text-text-muted">${formatDate(e.fecha)}</span>
          </li>`;
      }
      return `
        <li class="flex items-center gap-3 px-5 py-3.5">
          <span class="shrink-0 grid place-items-center size-9 rounded-full bg-primary-soft text-primary">${icon("syringe", "size-4.5")}</span>
          <span class="flex-1 min-w-0 text-sm text-text">Se aplicó <strong class="font-medium">${escapeHTML(vaccineLabel(e.vacuna.tipo))}</strong> a ${escapeHTML(e.animal.nombre || e.animal.arete)}</span>
          <span class="shrink-0 text-xs text-text-muted">${formatDate(e.fecha)}</span>
        </li>`;
    })
    .join("");
}

renderKPIs();
renderAlertas();
renderComposicion();
renderActividad();
