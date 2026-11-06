import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * Versión estática del sitio para GitHub Pages (sin servidor ni Manus).
 * Compila con: pnpm build:pages  →  carpeta docs/
 * Se publica en https://jair1119.github.io/druzhba-nuevo-leon/
 */

const BASE = process.env.PAGES_BASE ?? "/druzhba-nuevo-leon/";

// Quita el script de configuración de la plataforma Manus, que aquí no existe.
const stripPlatformScript: Plugin = {
  name: "strip-platform-script",
  transformIndexHtml(html) {
    return html.replace(/\s*<script src="\/api\/platform\/config\.js"><\/script>/, "");
  },
};

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), stripPlatformScript],
  define: {
    "import.meta.env.VITE_STATIC": JSON.stringify("1"),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true,
  },
});
