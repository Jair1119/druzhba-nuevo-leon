import { ArrowLeft, Info, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ResourceCard, catIcon, disclaimer } from "@/components/druzhba/ResourceCard";
import { resourceCategories, resources, type ResourceCategory } from "@/content/recursos";

type Cat = ResourceCategory | "todos";
const HOME = import.meta.env.BASE_URL;
const FREE = new Set(["Gratis", "Acceso libre", "Materiales gratis"]);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const fromHash = (): Cat => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return resourceCategories.some(c => c.id === h) ? (h as Cat) : "todos";
};

/** Directorio: Druzhba como intermediario entre la comunidad y la educación y las fuentes de Rusia. */
export default function Directory() {
  const [cat, setCat] = useState<Cat>(fromHash);
  const [q, setQ] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);

  useEffect(() => {
    const onHash = () => setCat(fromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const choose = (c: Cat) => {
    setCat(c);
    history.replaceState(null, "", c === "todos" ? window.location.pathname : `#${c}`);
  };

  const list = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    return resources.filter(r => {
      if (cat !== "todos" && r.category !== cat) return false;
      if (onlyFree && !FREE.has(r.access)) return false;
      if (!terms.length) return true;
      const hay = norm([r.title, r.original, r.org, r.description, r.note, r.language, r.level].filter(Boolean).join(" "));
      return terms.every(t => hay.includes(t));
    });
  }, [cat, q, onlyFree]);

  return (
    <div className="dir">
      <header className="dir-bar">
        <div className="wrap dir-bar-in">
          <a className="brand" href={HOME} title="Volver al inicio de Druzhba Nuevo León">
            <span className="brand-flag" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <span className="brand-name">Druzhba</span>
              <span className="brand-cyrillic">Дружба · Nuevo León</span>
            </span>
          </a>
          <a className="dir-back" href={HOME}>
            <ArrowLeft size={16} /> <span className="dir-back-long">Volver a la página principal</span>
            <span className="dir-back-short">Inicio</span>
          </a>
        </div>
      </header>

      <main className="wrap dir-main">
        <section className="dir-intro">
          <span className="label label-light">
            <span className="label-dot" aria-hidden="true" />
            Directorio Druzhba
          </span>
          <h1>Educación gratuita y fuentes de Rusia, en un solo lugar.</h1>
          <p>
            Somos tu puente: buscamos, verificamos y explicamos en español recursos de instituciones rusas — becas,
            cursos de idioma, universidades abiertas, cultura y fuentes de información — para que llegues directo al
            sitio oficial.
          </p>
        </section>

        <div className="dir-tools">
          <label className="dir-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Busca: beca, ruso, física, literatura, noticias…"
              aria-label="Buscar en el directorio"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Borrar búsqueda">
                <X size={16} />
              </button>
            )}
          </label>
          <button type="button" className="lite-toggle dir-free" aria-pressed={onlyFree} onClick={() => setOnlyFree(v => !v)}>
            <i aria-hidden="true" /> Solo acceso gratuito
          </button>
        </div>

        <div className="res-filters dir-filters" role="group" aria-label="Filtrar por tipo">
          {resourceCategories.map(c => {
            const active = c.id === cat;
            const n = c.id === "todos" ? resources.length : resources.filter(r => r.category === c.id).length;
            const Icon = c.id === "todos" ? null : catIcon[c.id as ResourceCategory];
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                className={`res-filter ${active ? "active" : ""}`}
                onClick={() => choose(c.id)}
              >
                {active && <span className="res-pill" />}
                <span className="res-filter-text">
                  {Icon && <Icon size={15} />} {c.label} <em>{n}</em>
                </span>
              </button>
            );
          })}
        </div>

        <p className="dir-count" aria-live="polite">
          {list.length === 1 ? "1 recurso" : `${list.length} recursos`}
          {q && ` para «${q}»`}
        </p>

        {list.length > 0 ? (
          <div className="res-grid">
            {list.map(r => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <div className="dir-empty">
            <p>No encontramos recursos con esa búsqueda.</p>
            <button
              type="button"
              className="btn btn-white"
              onClick={() => {
                setQ("");
                setOnlyFree(false);
                choose("todos");
              }}
            >
              Ver todo el directorio
            </button>
          </div>
        )}

        <div className="dir-legend">
          <h2>¿Qué significa cada etiqueta?</h2>
          <ul>
            <li>
              <b>Gratis</b> — se estudia o se usa sin pagar.
            </li>
            <li>
              <b>Acceso libre</b> — contenido abierto para leer o consultar.
            </li>
            <li>
              <b>Materiales gratis</b> — puedes estudiar gratis; el certificado puede tener costo.
            </li>
            <li>
              <b>Con registro</b> — requiere crear una cuenta.
            </li>
            <li>
              <b>Mixto</b> — parte del contenido es abierto y parte requiere suscripción.
            </li>
          </ul>
          <p>
            En los medios de noticias indicamos quién los financia o dónde están, para que compares fuentes con
            criterio.
          </p>
        </div>

        <p className="res-disclaimer">
          <Info size={15} /> {disclaimer}
        </p>
        <p className="dir-suggest">
          ¿Conoces otro recurso gratuito? <a href={`${HOME}#contacto`}>Sugiérelo aquí</a> y lo revisamos.
        </p>
      </main>

      <footer className="dir-foot">
        <div className="wrap">Druzhba Nuevo León — Proyecto cultural independiente, sin afiliación gubernamental.</div>
      </footer>
    </div>
  );
}
