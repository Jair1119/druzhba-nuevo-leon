import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * Versión estática del sitio para GitHub Pages (sin servidor ni Manus).
 * Compila con: pnpm build:pages  →  carpeta docs/
 * Se publica en https://druzhba-nl.com/
 */

const BASE = process.env.PAGES_BASE ?? "/";

// Formulario de Formspree que reenvía los registros por correo (público, no es secreto).
const FORM_ENDPOINT = process.env.VITE_FORM_ENDPOINT ?? "https://formspree.io/f/mrppdwge";

// Dirección pública del sitio (para redes sociales, buscadores y el mapa del sitio).
const SITE_URL = (process.env.PAGES_URL ?? "https://druzhba-nl.com/").replace(/\/?$/, "/");

const orgJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Druzhba Nuevo León",
  alternateName: ["Дружба Нуэво-Леон", "Centro Cultural Ruso de Nuevo León"],
  url: SITE_URL,
  logo: `${SITE_URL}logo.svg`,
  description:
    "Centro cultural ruso virtual e independiente en Monterrey: el puente cultural entre Nuevo León y Rusia.",
  areaServed: "MX",
  address: { "@type": "PostalAddress", addressLocality: "Monterrey", addressRegion: "Nuevo León", addressCountry: "MX" },
});

// Ajustes del HTML solo para GitHub Pages: sin script de Manus y con metadatos absolutos.
const pagesHtml: Plugin = {
  name: "pages-html",
  transformIndexHtml(html) {
    return html
      .replace(/\s*<script src="\/api\/platform\/config\.js"><\/script>/, "")
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${SITE_URL}media/img/nl-silla.jpg" />\n    <meta property="og:url" content="${SITE_URL}" />\n    <meta name="twitter:image" content="${SITE_URL}media/img/nl-silla.jpg" />\n    <link rel="canonical" href="${SITE_URL}" />`,
      )
      .replace("</head>", `  <script type="application/ld+json">${orgJsonLd}</script>\n  </head>`);
  },
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n` });
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n  <url><loc>${SITE_URL}recursos.html</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
    });
    this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
  },
};

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), pagesHtml],
  define: {
    "import.meta.env.VITE_STATIC": JSON.stringify("1"),
    "import.meta.env.VITE_FORM_ENDPOINT": JSON.stringify(FORM_ENDPOINT),
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
    rollupOptions: {
      // Dos páginas: la principal y el directorio de recursos (más ligero).
      input: {
        main: path.resolve(import.meta.dirname, "client", "index.html"),
        recursos: path.resolve(import.meta.dirname, "client", "recursos.html"),
      },
      output: {
        // Librerías en archivos aparte: cambian poco y el navegador las conserva en caché.
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client", "scheduler"],
          motion: ["framer-motion"],
          data: ["@tanstack/react-query", "@trpc/client", "@trpc/react-query", "superjson"],
        },
      },
    },
  },
});
