import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        dashboard: resolve(root, "dashboard.html"),
        contacto: resolve(root, "contacto.html"),
        animales: resolve(root, "animales.html"),
        animal: resolve(root, "animal.html"),
        vacunacion: resolve(root, "vacunacion.html"),
        trazabilidad: resolve(root, "trazabilidad.html"),
        configuracion: resolve(root, "configuracion.html")
      }
    }
  }
});
