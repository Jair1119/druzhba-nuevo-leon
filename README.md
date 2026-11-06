# Druzhba Nuevo León · Дружба Нуэво-Леон

Sitio web de **Druzhba Nuevo León**, centro cultural ruso virtual con sede en Monterrey:
el puente cultural entre Nuevo León y Rusia. Ciencia, idioma, arte y comunidad, desde
Monterrey para todo México.

> Proyecto cultural independiente, sin afiliación gubernamental.

## Qué incluye

- **Portada en video dividido**: Monterrey y Moscú lado a lado, separados por una franja
  tricolor que sigue al cursor, con relojes en vivo de ambas ciudades.
- **El puente**: un arco Monterrey → Moscú que se dibuja con el scroll y cuenta los
  10 123 km que separan a las dos ciudades.
- **Nuevo León ⟷ Rusia**: galería horizontal con siete pares de paisajes que “riman”
  (Cola de Caballo y Peterhof, La Huasteca y el Baikal, Fundidora y el Kremlin…).
- **Ciencia y tecnología**: espacio, ciencia, medicina, energía y tecnología rusas, con
  línea de tiempo y artículos.
- **Videos** de Monterrey y Rusia, que se reproducen al aparecer en pantalla y se abren
  en grande.
- **Cultura rusa** (artículos), **Aprende ruso** (alfabeto interactivo y frases con
  pronunciación en voz), **Comunidad**, **Apoya el proyecto** y **Contacto**.
- Formularios de registro, boletín y contacto guardados en la base de datos.
- Respeta la preferencia de “reducir movimiento” del sistema y funciona en celular.

## Tecnología

React 19 · Vite · Tailwind CSS 4 · framer-motion · Express · tRPC · Drizzle ORM (MySQL).
Basado en la plantilla `web-db-user` de Manus.

## Desarrollo

```bash
pnpm install
pnpm dev        # servidor de desarrollo (puerto PORT, por defecto 3000)
pnpm build      # compila cliente y servidor en dist/
pnpm start      # sirve la versión compilada
pnpm check      # revisión de tipos
pnpm test       # pruebas
```

El servidor lee su configuración de variables de entorno (nunca se suben al repositorio):
`DATABASE_URL`, `MANUS_PROJECT_ID`, `MANUS_JWT_SECRET`, `MANUS_OAUTH_API_URL`,
`MANUS_API_URL`, `MANUS_API_KEY` y, opcionalmente, `OWNER_OPEN_ID`.

## Sitio en GitHub Pages

Versión estática publicada en **https://jair1119.github.io/druzhba-nuevo-leon/**
(rama `github-pages`, carpeta `docs/`).

```bash
pnpm build:pages   # recompila docs/ con vite.pages.config.ts
```

En la versión estática no hay base de datos: los formularios (comunidad, boletín y
contacto) se envían a Formspree (`https://formspree.io/f/mrppdwge`), que los reenvía por
correo. Para usar otro formulario, define `VITE_FORM_ENDPOINT` antes de compilar.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `client/src/pages/Home.tsx` | Página principal y todas sus secciones |
| `client/src/components/druzhba/fx.tsx` | Efectos: textos animados, contadores, cursor, marquesinas, videos |
| `client/src/content/` | Textos (`site.ts`, `ciencia.ts`) y créditos de imágenes (`credits.ts`) |
| `client/src/index.css` | Estilos y paleta (blanco, azul `#0039A6`, rojo `#D52B1E`) |
| `client/public/media/img/` | Fotografías de Nuevo León y Rusia |
| `server/` | API (tRPC), base de datos y servicios de la plataforma |

## Créditos de fotografías y videos

Todas las fotografías y videos provienen de **Wikimedia Commons** con licencias libres
(CC0, CC BY, CC BY-SA y Free Art License). La lista completa, con autor, licencia y enlace
a cada archivo, está en `client/src/content/credits.ts` y en el pie de página del sitio.
Los videos se cargan directamente desde `upload.wikimedia.org`.

## Notas de la plataforma (Manus)

- `server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.
- Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints.
