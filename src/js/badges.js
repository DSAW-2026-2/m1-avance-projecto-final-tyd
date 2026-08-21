import { icon } from "./icons.js";

const STYLES = {
  vencida: { cls: "bg-danger-soft text-danger", ic: "alertTriangle", label: "Vencida" },
  proxima: { cls: "bg-warning-soft text-warning", ic: "calendar", label: "Próxima" },
  "al-dia": { cls: "bg-success-soft text-success", ic: "checkCircle", label: "Al día" },
  "sin-registro": { cls: "bg-surface-alt text-text-muted", ic: "info", label: "Sin registro" }
};

export function vaccinationBadge(status, customLabel) {
  const s = STYLES[status] || STYLES["sin-registro"];
  return `<span class="inline-flex items-center gap-1.5 rounded-full ${s.cls} px-2.5 py-1 text-xs font-medium">${icon(s.ic, "size-3.5")}${customLabel || s.label}</span>`;
}

export function estadoBadge(estado) {
  const map = {
    Activo: "bg-success-soft text-success",
    Vendido: "bg-info-soft text-info",
    Muerto: "bg-surface-alt text-text-muted"
  };
  return `<span class="inline-flex items-center rounded-full ${map[estado] || map.Muerto} px-2.5 py-1 text-xs font-medium">${estado}</span>`;
}
