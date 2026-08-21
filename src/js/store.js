const KEYS = {
  finca: "mihato:finca",
  animales: "mihato:animales",
  vacunas: "mihato:vacunas",
  theme: "mihato:theme",
  seeded: "mihato:seeded"
};

export const VACCINE_TYPES = [
  { id: "aftosa", nombre: "Fiebre Aftosa", intervaloDias: 182, obligatoriaICA: true },
  { id: "brucelosis", nombre: "Brucelosis", intervaloDias: null, obligatoriaICA: true },
  { id: "carbon", nombre: "Carbón Bacteridiano", intervaloDias: 365, obligatoriaICA: false },
  { id: "ibr", nombre: "IBR-DVB-PI3 (Triple)", intervaloDias: 365, obligatoriaICA: false },
  { id: "rabia", nombre: "Rabia Bovina", intervaloDias: 365, obligatoriaICA: false }
];

export const CATEGORIAS = ["Ternero", "Ternera", "Novillo", "Novilla", "Vaca", "Toro"];
export const ESTADOS = ["Activo", "Vendido", "Muerto"];

export function vaccineLabel(tipoId) {
  return VACCINE_TYPES.find((t) => t.id === tipoId)?.nombre || tipoId;
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFinca() {
  return readJSON(KEYS.finca, {
    nombre: "Finca La Esperanza",
    propietario: "Jorge Tarazona",
    vereda: "Vereda El Progreso",
    municipio: "Montería",
    departamento: "Córdoba",
    codigoICA: "COR-04521",
    unidadPeso: "kg"
  });
}

export function saveFinca(data) {
  writeJSON(KEYS.finca, data);
}

export function getAnimales() {
  return readJSON(KEYS.animales, []);
}

function saveAnimales(list) {
  writeJSON(KEYS.animales, list);
}

export function getAnimal(id) {
  return getAnimales().find((a) => a.id === id) || null;
}

export function upsertAnimal(animal) {
  const list = getAnimales();
  const idx = list.findIndex((a) => a.id === animal.id);
  if (idx === -1) {
    list.push(animal);
  } else {
    list[idx] = animal;
  }
  saveAnimales(list);
  return animal;
}

export function deleteAnimal(id) {
  saveAnimales(getAnimales().filter((a) => a.id !== id));
  saveVacunas(getVacunas().filter((v) => v.animalId !== id));
}

export function getVacunas() {
  return readJSON(KEYS.vacunas, []);
}

function saveVacunas(list) {
  writeJSON(KEYS.vacunas, list);
}

export function getVacunasByAnimal(animalId) {
  return getVacunas()
    .filter((v) => v.animalId === animalId)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function upsertVacuna(vacuna) {
  const list = getVacunas();
  const idx = list.findIndex((v) => v.id === vacuna.id);
  if (idx === -1) {
    list.push(vacuna);
  } else {
    list[idx] = vacuna;
  }
  saveVacunas(list);
  return vacuna;
}

export function deleteVacuna(id) {
  saveVacunas(getVacunas().filter((v) => v.id !== id));
}

export function getTheme() {
  return localStorage.getItem(KEYS.theme) || "light";
}

export function setTheme(theme) {
  localStorage.setItem(KEYS.theme, theme);
}

function daysBetween(a, b) {
  const ms = new Date(b).setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

export function edadTexto(fechaNacimiento) {
  const meses = Math.max(0, Math.floor(daysBetween(fechaNacimiento, new Date()) / 30.44));
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const años = Math.floor(meses / 12);
  const restoMeses = meses % 12;
  return restoMeses === 0 ? `${años} ${años === 1 ? "año" : "años"}` : `${años}a ${restoMeses}m`;
}

export function getEstadoVacunacion(animalId) {
  const registros = getVacunasByAnimal(animalId).filter((v) => v.tipo === "aftosa");
  const hoy = new Date();
  if (registros.length === 0) {
    return { status: "sin-registro", label: "Sin registro", diasRestantes: null };
  }
  const ultima = registros[0];
  if (!ultima.fechaProximaDosis) {
    return { status: "al-dia", label: "Al día", diasRestantes: null };
  }
  const dias = daysBetween(hoy, ultima.fechaProximaDosis);
  if (dias < 0) {
    return { status: "vencida", label: `Vencida hace ${Math.abs(dias)} días`, diasRestantes: dias, fecha: ultima.fechaProximaDosis };
  }
  if (dias <= 30) {
    return { status: "proxima", label: `Próxima en ${dias} días`, diasRestantes: dias, fecha: ultima.fechaProximaDosis };
  }
  return { status: "al-dia", label: "Al día", diasRestantes: dias, fecha: ultima.fechaProximaDosis };
}

export function calcularProximaDosis(tipoId, fecha) {
  const tipo = VACCINE_TYPES.find((t) => t.id === tipoId);
  if (!tipo || !tipo.intervaloDias) return null;
  const d = new Date(fecha);
  d.setDate(d.getDate() + tipo.intervaloDias);
  return d.toISOString().slice(0, 10);
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function seedData() {
  const animales = [
    { arete: "COR-0231", nombre: "Lucero", sexo: "M", raza: "Brahman", categoria: "Toro", estado: "Activo", potrero: "Potrero La Loma", pesoKg: 620, fechaNacimiento: isoDaysAgo(1460), notas: "Reproductor principal." },
    { arete: "COR-0245", nombre: "Canela", sexo: "H", raza: "Cebú", categoria: "Vaca", estado: "Activo", potrero: "Potrero 1", pesoKg: 480, fechaNacimiento: isoDaysAgo(1825), notas: "" },
    { arete: "COR-0246", nombre: "Estrella", sexo: "H", raza: "Gyr", categoria: "Vaca", estado: "Activo", potrero: "Potrero 1", pesoKg: 455, fechaNacimiento: isoDaysAgo(2100), notas: "Buena producción de leche." },
    { arete: "COR-0250", nombre: "", sexo: "H", raza: "Romosinuano", categoria: "Novilla", estado: "Activo", potrero: "Potrero 2", pesoKg: 310, fechaNacimiento: isoDaysAgo(760), notas: "" },
    { arete: "COR-0251", nombre: "", sexo: "M", raza: "Romosinuano", categoria: "Novillo", estado: "Activo", potrero: "Potrero 2", pesoKg: 340, fechaNacimiento: isoDaysAgo(790), notas: "" },
    { arete: "COR-0260", nombre: "Paloma", sexo: "H", raza: "Cebú", categoria: "Vaca", estado: "Activo", potrero: "Potrero Bajo", pesoKg: 470, fechaNacimiento: isoDaysAgo(1900), notas: "" },
    { arete: "COR-0261", nombre: "", sexo: "H", raza: "Cebú", categoria: "Ternera", estado: "Activo", potrero: "Potrero Bajo", pesoKg: 95, fechaNacimiento: isoDaysAgo(120), notas: "Cría de Paloma." },
    { arete: "COR-0270", nombre: "Trueno", sexo: "M", raza: "Angus", categoria: "Toro", estado: "Activo", potrero: "Potrero La Loma", pesoKg: 705, fechaNacimiento: isoDaysAgo(1600), notas: "" },
    { arete: "COR-0281", nombre: "Morena", sexo: "H", raza: "Pardo Suizo", categoria: "Vaca", estado: "Activo", potrero: "Potrero 1", pesoKg: 500, fechaNacimiento: isoDaysAgo(2400), notas: "" },
    { arete: "COR-0282", nombre: "", sexo: "H", raza: "Pardo Suizo", categoria: "Novilla", estado: "Activo", potrero: "Potrero 1", pesoKg: 290, fechaNacimiento: isoDaysAgo(560), notas: "" },
    { arete: "COR-0290", nombre: "Capitán", sexo: "M", raza: "Simmental", categoria: "Novillo", estado: "Activo", potrero: "Potrero 2", pesoKg: 380, fechaNacimiento: isoDaysAgo(900), notas: "En engorde." },
    { arete: "COR-0291", nombre: "", sexo: "M", raza: "Simmental", categoria: "Novillo", estado: "Activo", potrero: "Potrero 2", pesoKg: 365, fechaNacimiento: isoDaysAgo(870), notas: "En engorde." },
    { arete: "COR-0300", nombre: "Reina", sexo: "H", raza: "Holstein", categoria: "Vaca", estado: "Activo", potrero: "Potrero Bajo", pesoKg: 520, fechaNacimiento: isoDaysAgo(2000), notas: "" },
    { arete: "COR-0301", nombre: "", sexo: "H", raza: "Holstein", categoria: "Ternera", estado: "Activo", potrero: "Potrero Bajo", pesoKg: 78, fechaNacimiento: isoDaysAgo(60), notas: "Cría de Reina." },
    { arete: "COR-0188", nombre: "Sultán", sexo: "M", raza: "Brahman", categoria: "Toro", estado: "Vendido", potrero: "—", pesoKg: 680, fechaNacimiento: isoDaysAgo(2600), notas: "Vendido en feria de marzo." },
    { arete: "COR-0310", nombre: "", sexo: "H", raza: "Cebú", categoria: "Novilla", estado: "Activo", potrero: "Corral de manejo", pesoKg: 300, fechaNacimiento: isoDaysAgo(620), notas: "En observación por cojera leve." },
    { arete: "COR-0311", nombre: "Golondrina", sexo: "H", raza: "Romosinuano", categoria: "Vaca", estado: "Activo", potrero: "Potrero 1", pesoKg: 490, fechaNacimiento: isoDaysAgo(2200), notas: "" },
    { arete: "COR-0071", nombre: "Viejo Toro", sexo: "M", raza: "Cebú", categoria: "Toro", estado: "Muerto", potrero: "—", pesoKg: 0, fechaNacimiento: isoDaysAgo(4200), notas: "Falleció por causas naturales, oct 2025." }
  ].map((a) => ({ id: uid("animal"), fechaRegistro: isoDaysAgo(30), ...a }));

  writeJSON(KEYS.animales, animales);

  const vet = "Dra. Camila Restrepo";
  const activos = animales.filter((a) => a.estado === "Activo");
  const vacunas = [];

  activos.forEach((a, i) => {
    const patron = i % 4;
    if (patron === 0) {
      const fecha = isoDaysAgo(200);
      vacunas.push({ id: uid("vac"), animalId: a.id, tipo: "aftosa", fecha, fechaProximaDosis: calcularProximaDosis("aftosa", fecha), lote: "AF-2201", veterinario: vet, notas: "", fechaRegistro: fecha });
    } else if (patron === 1) {
      const fecha = isoDaysAgo(160);
      vacunas.push({ id: uid("vac"), animalId: a.id, tipo: "aftosa", fecha, fechaProximaDosis: calcularProximaDosis("aftosa", fecha), lote: "AF-2214", veterinario: vet, notas: "", fechaRegistro: fecha });
    } else if (patron === 2) {
      const fecha = isoDaysAgo(20);
      vacunas.push({ id: uid("vac"), animalId: a.id, tipo: "aftosa", fecha, fechaProximaDosis: calcularProximaDosis("aftosa", fecha), lote: "AF-2240", veterinario: vet, notas: "", fechaRegistro: fecha });
    }
    if (a.categoria === "Vaca" || a.categoria === "Novilla") {
      const fecha = isoDaysAgo(500);
      vacunas.push({ id: uid("vac"), animalId: a.id, tipo: "brucelosis", fecha, fechaProximaDosis: null, lote: "BR-1187", veterinario: vet, notas: "Dosis única.", fechaRegistro: fecha });
    }
  });

  writeJSON(KEYS.vacunas, vacunas);
}

export function seedIfEmpty() {
  if (localStorage.getItem(KEYS.seeded)) return;
  seedData();
  localStorage.setItem(KEYS.seeded, "1");
}

export function resetDemoData() {
  localStorage.removeItem(KEYS.animales);
  localStorage.removeItem(KEYS.vacunas);
  localStorage.removeItem(KEYS.finca);
  localStorage.removeItem(KEYS.seeded);
  seedIfEmpty();
}
