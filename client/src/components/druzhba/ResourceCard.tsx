import { ArrowUpRight, Film, GraduationCap, Info, Landmark, Languages, Newspaper } from "lucide-react";
import type { Resource, ResourceCategory } from "@/content/recursos";

export const catIcon: Record<ResourceCategory, typeof Film> = {
  becas: GraduationCap,
  idioma: Languages,
  universidades: Landmark,
  cultura: Film,
  informacion: Newspaper,
};

export const catShort: Record<ResourceCategory, string> = {
  becas: "Beca",
  idioma: "Idioma",
  universidades: "Universidad abierta",
  cultura: "Cultura",
  informacion: "Información",
};

/** Tarjeta de un recurso externo: Druzhba funciona como puente hacia el sitio oficial. */
export function ResourceCard({ r }: { r: Resource }) {
  const Icon = catIcon[r.category];
  const accessClass = r.access === "Con registro" || r.access === "Mixto" ? "reg" : "";
  return (
    <article className={`res-card ${r.category}`}>
      <div className="res-top">
        <span className="res-cat">
          <Icon size={15} /> {catShort[r.category]}
        </span>
        <span className={`res-access ${accessClass}`}>{r.access}</span>
      </div>
      <h3>{r.title}</h3>
      {r.original && (
        <span className="res-original" lang={/[а-яё]/i.test(r.original) ? "ru" : undefined}>
          {r.original}
        </span>
      )}
      <span className="res-org">{r.org}</span>
      <p className="res-desc">{r.description}</p>
      {r.note && (
        <p className="res-note">
          <Info size={14} /> <span>{r.note}</span>
        </p>
      )}
      <div className="res-meta">
        <span>{r.language}</span>
        {r.level && <span>{r.level}</span>}
      </div>
      <a
        className="res-link"
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar sitio de ${r.title} (se abre en una pestaña nueva)`}
      >
        Visitar sitio <ArrowUpRight size={15} />
      </a>
    </article>
  );
}

export const disclaimer =
  "Druzhba Nuevo León no está afiliado a estas instituciones ni a estos medios: los reunimos como puente informativo. Revisamos cada enlace en noviembre de 2026; requisitos, costos y fechas pueden cambiar, así que confirma siempre en el sitio oficial.";
