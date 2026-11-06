import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown, Info, RotateCcw } from "lucide-react";
import { ResourceCard, catIcon, disclaimer } from "./ResourceCard";
import { useRef, useState } from "react";
import {
  faqs,
  history,
  holidays,
  resourceCategories,
  resources,
  type HistoryItem,
  type ResourceCategory,
} from "@/content/recursos";
import { EASE, Reveal, SplitReveal } from "./fx";

function Label({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <Reveal y={16} className={light ? "label label-light" : "label"}>
      <span className="label-dot" aria-hidden="true" />
      {children}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Puentes en la historia                                              */
/* ------------------------------------------------------------------ */

const tagLabel: Record<HistoryItem["tag"], string> = {
  diplomacia: "Diplomacia",
  arte: "Arte",
  cine: "Cine",
  letras: "Letras",
  deporte: "Deporte",
  hoy: "Hoy",
};

export function History() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  return (
    <section className="history section rounded-top" id="historia">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label>México ⟷ Россия</Label>
            <SplitReveal className="display" text="Puentes que ya existían." />
          </div>
          <Reveal delay={0.15}>
            <p className="lede">
              Mucho antes de Druzhba, bailarinas, poetas, cineastas y diplomáticos ya cruzaban el océano entre México y
              Rusia. Estos son algunos de esos encuentros.
            </p>
          </Reveal>
        </div>
        <div className="timeline" ref={ref}>
          <span className="timeline-track" aria-hidden="true">
            <motion.span className="timeline-line" style={{ scaleY: line }} />
          </span>
          <ol>
            {history.map((h, i) => (
              <li key={h.year + h.title} className={`tl-item ${i % 2 ? "right" : "left"} ${h.tag}`}>
                <span className="tl-dot" aria-hidden="true" />
                <Reveal y={50} className="tl-card">
                  <div className="tl-head">
                    <span className="tl-year">{h.year}</span>
                    <span className="tl-tag">{tagLabel[h.tag]}</span>
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Calendario que rima                                                 */
/* ------------------------------------------------------------------ */

export function Holidays() {
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <section className="holidays section" id="calendario">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label>Calendario que rima</Label>
            <SplitReveal className="display" text="Fiestas rusas con eco mexicano." />
          </div>
          <Reveal delay={0.15}>
            <p className="lede">
              Seis fechas del calendario ruso y su rima en México. Pasa el cursor o toca cada tarjeta para darle la vuelta.
            </p>
          </Reveal>
        </div>
        <div className="hol-grid">
          {holidays.map((h, i) => {
            const isFlipped = flipped === h.ru;
            return (
              <motion.button
                type="button"
                key={h.ru}
                className={`hol-card ${isFlipped ? "flipped" : ""}`}
                aria-pressed={isFlipped}
                onClick={() => setFlipped(isFlipped ? null : h.ru)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <span className="hol-inner">
                  <span className="hol-face hol-ru">
                    <span className="hol-date">{h.date}</span>
                    <span className="hol-cyr" lang="ru">
                      {h.ru}
                    </span>
                    <strong>{h.es}</strong>
                    <span className="hol-text">{h.text}</span>
                    <span className="hol-hint">
                      <RotateCcw size={13} /> Su rima en México
                    </span>
                  </span>
                  <span className="hol-face hol-mx">
                    <span className="hol-flag" aria-hidden="true" />
                    <span className="hol-mx-label">En México</span>
                    <span className="hol-mx-text">{h.mx}</span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cursos, becas y cultura gratuitos                                    */
/* ------------------------------------------------------------------ */

export const DIRECTORY_URL = `${import.meta.env.BASE_URL}recursos.html`;

export function Courses() {
  const featured = resources.filter(r => r.featured);
  return (
    <section className="courses section" id="cursos">
      <div className="orb orb-blue" aria-hidden="true" />
      <div className="orb orb-red" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label light>Aprende gratis</Label>
            <SplitReveal className="display light" text="Cursos, becas y cultura rusa a un clic." />
          </div>
          <Reveal delay={0.15}>
            <p className="lede light">
              Somos tu puente: reunimos y verificamos educación gratuita en línea de instituciones rusas y fuentes de
              información confiables. Estos son algunos destacados; en el directorio están todos, con buscador.
            </p>
          </Reveal>
        </div>

        <div className="res-cats">
          {resourceCategories
            .filter(c => c.id !== "todos")
            .map(c => {
              const Icon = catIcon[c.id as ResourceCategory];
              const n = resources.filter(r => r.category === c.id).length;
              return (
                <a key={c.id} className="res-cat-link" href={`${DIRECTORY_URL}#${c.id}`}>
                  <Icon size={18} />
                  <span>{c.label}</span>
                  <em>{n}</em>
                </a>
              );
            })}
        </div>

        <div className="res-grid">
          {featured.map(r => (
            <ResourceCard key={r.id} r={r} />
          ))}
        </div>

        <div className="res-cta">
          <a className="btn btn-red" href={DIRECTORY_URL}>
            Ver el directorio completo ({resources.length} recursos) <ArrowUpRight size={16} />
          </a>
        </div>

        <p className="res-disclaimer">
          <Info size={15} /> {disclaimer}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                */
/* ------------------------------------------------------------------ */

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq section" id="preguntas">
      <div className="wrap faq-grid">
        <div className="faq-intro">
          <Label>Preguntas frecuentes</Label>
          <SplitReveal className="display" text="Lo que más nos preguntan." />
          <Reveal delay={0.1}>
            <p className="lede">¿Te quedó alguna duda? Escríbenos desde el formulario de contacto y te respondemos.</p>
          </Reveal>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05} y={20}>
                <div className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-q"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        className="faq-a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
    </section>
  );
}
