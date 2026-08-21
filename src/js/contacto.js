import { icon } from "./icons.js";
import { getTheme, setTheme } from "./store.js";
import { todayISO } from "./utils.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function injectIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, el.dataset.iconSize || "size-5");
  });
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  const btn = document.getElementById("theme-toggle");
  btn.setAttribute("aria-pressed", String(isDark));
  btn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  btn.querySelector("[data-icon]").innerHTML = isDark ? icon("sun", "size-5") : icon("moon", "size-5");
}

function initTheme() {
  applyTheme(getTheme());
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  });
}

function saveContacto(entry) {
  const KEY = "mihato:contactos";
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    list = [];
  }
  list.push(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
}

const VALIDATORS = {
  nombre: (value) => (value.trim() ? "" : "Ingresa tu nombre completo."),
  correo: (value) => {
    const v = value.trim();
    if (!v) return "Ingresa tu correo electrónico.";
    if (!v.includes("@")) return "El correo debe incluir una @.";
    if (!EMAIL_RE.test(v)) return "Ingresa un correo con un formato válido, ej. nombre@correo.com.";
    return "";
  },
  finca: (value) => (value.trim() ? "" : "Ingresa el nombre de tu finca."),
  cabezas: (value) => {
    const v = value.trim();
    if (!v) return "Ingresa la cantidad de cabezas de ganado.";
    const n = Number(v);
    if (Number.isNaN(n)) return "Debe ser un número.";
    if (!Number.isInteger(n)) return "Ingresa un número entero de cabezas.";
    if (n <= 0) return "Debe ser un número mayor que cero.";
    return "";
  }
};

function setError(field, message) {
  const errEl = document.getElementById(`f-${field}-error`);
  const inputEl = document.getElementById(`f-${field}`);
  errEl.textContent = message || "";
  errEl.classList.toggle("hidden", !message);
  inputEl.setAttribute("aria-invalid", message ? "true" : "false");
  return message;
}

function validateField(field, form) {
  const value = new FormData(form).get(field) || "";
  return setError(field, VALIDATORS[field](String(value)));
}

function initFieldValidation(form) {
  Object.keys(VALIDATORS).forEach((field) => {
    const input = document.getElementById(`f-${field}`);
    input.addEventListener("blur", () => validateField(field, form));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(field, form);
    });
  });
}

function initForm() {
  const form = document.getElementById("contact-form");
  const successPanel = document.getElementById("contact-success");
  const successName = document.getElementById("success-name");

  initFieldValidation(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errors = Object.keys(VALIDATORS).map((field) => validateField(field, form));
    if (errors.some(Boolean)) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = new FormData(form);
    const nombre = String(data.get("nombre")).trim();

    saveContacto({
      nombre,
      correo: String(data.get("correo")).trim(),
      finca: String(data.get("finca")).trim(),
      cabezas: Number(data.get("cabezas")),
      fecha: todayISO()
    });

    successName.textContent = `, ${nombre.split(" ")[0]}`;
    form.classList.add("hidden");
    successPanel.classList.remove("hidden");
    successPanel.focus();
  });
}

injectIcons();
initTheme();
initForm();
