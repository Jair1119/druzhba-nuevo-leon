import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Atom,
  Check,
  Clock3,
  Cpu,
  Globe2,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Play,
  Rocket,
  Send,
  Sparkles,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FORMS_ENABLED, useSiteForms } from "@/lib/forms";
import { quickFacts, scienceAreas } from "@/content/ciencia";
import { mediaCredits } from "@/content/credits";
import {
  alphabet,
  articles,
  clipById,
  clips,
  img,
  interests,
  marqueeWords,
  navItems,
  nlFacts,
  phrases,
  rhymes,
  type Article,
  type Clip,
} from "@/content/site";
import {
  CityClock,
  Counter,
  Cursor,
  EASE,
  LazyVideo,
  Magnetic,
  Preloader,
  Reveal,
  Scramble,
  ScrollProgress,
  SplitReveal,
  Tilt,
  VelocityMarquee,
  useMedia,
} from "@/components/druzhba/fx";

const areaIcons: Record<string, typeof Rocket> = {
  espacio: Rocket,
  ciencia: Atom,
  medicina: HeartPulse,
  energia: Zap,
  tecnologia: Cpu,
};
const SOON_TEXT =
  "El registro en línea abrirá muy pronto. ¡Gracias por tu interés en Druzhba!";
const ERROR_TEXT =
  "No pudimos enviar el formulario. Revisa tus datos e inténtalo de nuevo.";

const videoSources = (c: Clip, hq = false) => [
  { src: hq ? c.high : c.low, type: "video/webm" },
  { src: c.mov, type: "video/mp4" },
];

/* ------------------------------------------------------------------ */
/* Piezas pequeñas                                                     */
/* ------------------------------------------------------------------ */

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className="brand"
      href="#inicio"
      aria-label="Druzhba Nuevo León, volver al inicio"
    >
      <span className="brand-flag" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        <span className="brand-name">Druzhba</span>
        <span className="brand-cyrillic">Дружба · Nuevo León</span>
        {footer && (
          <span className="brand-sub">Centro Cultural Ruso de Nuevo León</span>
        )}
      </span>
    </a>
  );
}

function Label({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <Reveal y={16} className={light ? "label label-light" : "label"}>
      <span className="label-dot" aria-hidden="true" />
      {children}
    </Reveal>
  );
}

function Status({ ok, children }: { ok: boolean; children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      className={ok ? "form-status" : "form-error"}
      role="status"
    >
      {ok && <Check size={15} strokeWidth={3} />}
      {children}
    </motion.div>
  );
}

function useLockScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);
}

/* ------------------------------------------------------------------ */
/* Encabezado                                                          */
/* ------------------------------------------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", y => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });
  useLockScroll(open);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className={`site-header ${solid ? "solid" : ""}`}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="wrap nav-shell">
          <Brand />
          <nav className="nav-links" aria-label="Navegación principal">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} className="nav-link">
                <span data-text={label}>{label}</span>
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <Magnetic>
              <a href="#comunidad" className="nav-cta">
                Únete <ArrowUpRight size={15} />
              </a>
            </Magnetic>
            <button
              className="menu-btn"
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            aria-label="Navegación móvil"
            initial="closed"
            animate="open"
            exit="closed"
          >
            {["#ffffff", "#0039a6", "#d52b1e"].map((c, i) => (
              <motion.span
                key={c}
                className="mm-curtain"
                style={{ background: c, zIndex: i }}
                variants={{ closed: { scaleY: 0 }, open: { scaleY: 1 } }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              />
            ))}
            <motion.div
              className="mm-inner"
              variants={{
                open: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.35 },
                },
              }}
            >
              {[
                ...navItems,
                ["#videos", "Videos"] as [string, string],
                ["#comunidad", "Únete"] as [string, string],
              ].map(([href, label], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  variants={{
                    closed: { opacity: 0, y: 40 },
                    open: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <small>0{i + 1}</small>
                  {label}
                </motion.a>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: Monterrey y Moscú en pantalla dividida                        */
/* ------------------------------------------------------------------ */

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMedia("(min-width: 900px)");
  const fine = useMedia("(pointer: fine)");
  const reduce = useReducedMotion();
  const split = useSpring(50, { stiffness: 60, damping: 18 });
  const clip = useMotionTemplate`polygon(calc(${split}% + 7vw) 0, 100% 0, 100% 100%, calc(${split}% - 7vw) 100%)`;
  const seamX = useTransform(split, v => `${v}vw`);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48]);

  useEffect(() => {
    if (fine || reduce) return;
    const c = animate(split, [50, 30, 70, 50], {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => c.stop();
  }, [fine, reduce, split]);

  const mx = clipById("macroplaza");
  const ru = clipById("moscow");

  return (
    <section
      ref={ref}
      className="hero"
      id="inicio"
      onPointerMove={e => {
        if (!fine) return;
        const p = (e.clientX / window.innerWidth) * 100;
        split.set(30 + (p / 100) * 40);
      }}
      onPointerLeave={() => split.set(50)}
    >
      <motion.div
        className="hero-media"
        style={{ scale: mediaScale, borderRadius: radius }}
      >
        <div className="hero-layer">
          <LazyVideo
            eager
            className="hero-video"
            poster={mx.poster}
            sources={videoSources(mx, desktop)}
            alt="Video de la Macroplaza de Monterrey"
          />
          <div className="hero-tint mx" />
        </div>
        <motion.div
          className="hero-layer hero-layer-ru"
          style={{ clipPath: clip }}
        >
          <LazyVideo
            eager
            className="hero-video"
            poster={ru.poster}
            sources={videoSources(ru, desktop)}
            alt="Video aéreo de Moscú"
          />
          <div className="hero-tint ru" />
        </motion.div>
        <motion.div
          className="hero-seam"
          style={{ left: seamX }}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </motion.div>
        <div className="hero-shade" />
        <div className="grain" />
      </motion.div>

      <motion.div
        className="wrap hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          <span className="kicker-flag" aria-hidden="true" />
          Centro Cultural Ruso de Nuevo León
        </motion.div>
        <h1 className="hero-title" aria-label="Druzhba">
          {"DRUZHBA".split("").map((ch, i) => (
            <span className="ht-mask" key={i} aria-hidden="true">
              <motion.span
                className="ht-letter"
                initial={{ y: "115%", rotate: 8 }}
                animate={ready ? { y: "0%", rotate: 0 } : undefined}
                transition={{
                  duration: 1.2,
                  ease: EASE,
                  delay: 0.25 + i * 0.06,
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="hero-tag"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        >
          <span className="hero-tag-ru">Дружба</span> significa{" "}
          <Scramble
            className="scramble"
            words={["amistad", "puente", "encuentro", "comunidad", "дружба"]}
          />
        </motion.p>
        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
        >
          <p className="hero-lede">
            El puente cultural entre <strong>Nuevo León</strong> y{" "}
            <strong>Rusia</strong>: ciencia, idioma, arte y comunidad, desde
            Monterrey para todo México.
          </p>
          <div className="hero-actions">
            <Magnetic>
              <a className="btn btn-red" href="#comunidad">
                Únete a la comunidad <ArrowRight size={17} />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-glass" href="#puente">
                Cruza el puente
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-cities wrap"
        style={{ opacity: contentOpacity }}
      >
        <div className="city">
          <span className="city-flag mx" aria-hidden="true" />
          <div>
            <strong>Monterrey</strong>
            <small>25.68° N · 100.31° O</small>
          </div>
          <CityClock tz="America/Monterrey" />
        </div>
        <a
          href="#puente"
          className="scroll-cue"
          aria-label="Bajar a la siguiente sección"
        >
          <ArrowDown size={16} />
        </a>
        <div className="city city-right">
          <CityClock tz="Europe/Moscow" />
          <div>
            <strong>Москва</strong>
            <small>55.75° N · 37.61° E</small>
          </div>
          <span className="city-flag ru" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* El puente: arco Monterrey → Moscú dibujado con el scroll            */
/* ------------------------------------------------------------------ */

function Bridge() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const draw = useTransform(p, [0.05, 0.75], [0, 1]);
  const planeX = useMotionValue(170);
  const planeY = useMotionValue(330);
  const km = useTransform(draw, v =>
    Math.round(v * 10123).toLocaleString("es-MX")
  );
  const [kmText, setKmText] = useState("0");
  useMotionValueEvent(km, "change", setKmText);
  useMotionValueEvent(draw, "change", v => {
    const path = pathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(path.getTotalLength() * v);
    planeX.set(pt.x);
    planeY.set(pt.y);
  });
  const s1 = useTransform(p, [0.12, 0.22], [0, 1]);
  const s2 = useTransform(p, [0.38, 0.48], [0, 1]);
  const s3 = useTransform(p, [0.62, 0.72], [0, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-30%"]);
  const glow = useTransform(draw, [0.95, 1], [0, 1]);

  return (
    <section ref={ref} className="bridge" id="puente">
      <div className="bridge-sticky">
        <div className="bridge-grid" aria-hidden="true" />
        <div className="wrap bridge-inner">
          <motion.div className="bridge-copy" style={{ y: titleY }}>
            <Label light>El puente</Label>
            <SplitReveal
              className="display light"
              text="De la Sierra Madre al Kremlin."
            />
            <Reveal delay={0.2}>
              <p className="lede light">
                Nuevo León y Rusia parecen estar en extremos opuestos del mapa.
                Druzhba existe para acortar esa distancia con lo único que la
                vuelve pequeña: personas con curiosidad.
              </p>
            </Reveal>
          </motion.div>

          <div className="bridge-map">
            <svg
              viewBox="0 0 1000 520"
              role="img"
              aria-label="Arco que une Monterrey con Moscú"
            >
              <defs>
                <linearGradient id="arc" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset=".5" stopColor="#3d7bff" />
                  <stop offset="1" stopColor="#ff4a3d" />
                </linearGradient>
                <radialGradient id="glow">
                  <stop offset="0" stopColor="#fff" stopOpacity="1" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path
                d="M170 360 C 330 30, 640 -30, 830 190"
                fill="none"
                stroke="rgba(255,255,255,.12)"
                strokeWidth="2"
                strokeDasharray="4 10"
              />
              <motion.path
                ref={pathRef}
                d="M170 360 C 330 30, 640 -30, 830 190"
                fill="none"
                stroke="url(#arc)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: draw }}
              />
              <motion.circle
                r="26"
                fill="url(#glow)"
                style={{ cx: planeX, cy: planeY }}
                opacity={0.5}
              />
              <motion.circle
                r="7"
                fill="#fff"
                style={{ cx: planeX, cy: planeY }}
              />
              <g className="pin">
                <circle cx="170" cy="360" r="10" fill="#fff" />
                <circle cx="170" cy="360" r="10" className="pulse" />
                <text x="170" y="410" textAnchor="middle">
                  MONTERREY
                </text>
                <text x="170" y="436" textAnchor="middle" className="sub">
                  Nuevo León
                </text>
              </g>
              <g className="pin">
                <circle cx="830" cy="190" r="10" fill="#ff4a3d" />
                <motion.circle
                  cx="830"
                  cy="190"
                  r="34"
                  fill="none"
                  stroke="#ff4a3d"
                  strokeWidth="2"
                  style={{ opacity: glow }}
                />
                <circle cx="830" cy="190" r="10" className="pulse red" />
                <text x="830" y="240" textAnchor="middle">
                  МОСКВА
                </text>
                <text x="830" y="266" textAnchor="middle" className="sub">
                  Rusia
                </text>
              </g>
            </svg>
            <div className="bridge-km" aria-live="off">
              <strong>{kmText}</strong>
              <span>km en línea recta</span>
            </div>
          </div>

          <div className="bridge-stats">
            <motion.div
              style={{ opacity: s1, y: useTransform(s1, [0, 1], [30, 0]) }}
            >
              <strong>10 123 km</strong>
              <span>separan Monterrey de Moscú</span>
            </motion.div>
            <motion.div
              style={{ opacity: s2, y: useTransform(s2, [0, 1], [30, 0]) }}
            >
              <strong>+9 horas</strong>
              <span>de diferencia: cuando aquí es mediodía, allá ya cenan</span>
            </motion.div>
            <motion.div
              style={{ opacity: s3, y: useTransform(s3, [0, 1], [30, 0]) }}
            >
              <strong>1 comunidad</strong>
              <span>para encontrarnos a la mitad del camino</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rimas visuales: scroll horizontal                                    */
/* ------------------------------------------------------------------ */

function Rhymes() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktop = useMedia("(min-width: 900px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const t = trackRef.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const intro = (
    <div className="rhymes-intro">
      <Label light>Nuevo León ⟷ Россия</Label>
      <SplitReveal className="display light" text="Dos paisajes que riman." />
      <p className="lede light">
        Montañas, ríos, plazas y luces de ciudad. A 10 mil kilómetros de
        distancia, Nuevo León y Rusia se parecen más de lo que imaginas. Desliza
        y compruébalo.
      </p>
      <div className="rhymes-hint" aria-hidden="true">
        <span /> {pinned ? "Sigue bajando" : "Desliza"} <ArrowRight size={15} />
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`rhymes ${pinned ? "pinned" : ""}`}
      id="rimas"
      style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}
    >
      <div className="rhymes-sticky">
        {!pinned && <div className="wrap">{intro}</div>}
        <motion.div
          ref={trackRef}
          className="rhymes-track"
          style={pinned ? { x: sx } : undefined}
        >
          {pinned && intro}
          {rhymes.map((r, i) => (
            <article className="rhyme" key={r.theme}>
              <header>
                <span className="rhyme-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{r.theme}</h3>
                <span className="rhyme-ru">{r.themeRu}</span>
              </header>
              <div className="rhyme-pair">
                <figure className="rhyme-img mx" data-cursor="Nuevo León">
                  <img
                    src={r.nl.src}
                    alt={`${r.nl.name}, ${r.nl.place}`}
                    loading="lazy"
                  />
                  <figcaption>
                    <span className="tag mx">MX</span>
                    <strong>{r.nl.name}</strong>
                    <small>{r.nl.place}</small>
                  </figcaption>
                </figure>
                <figure className="rhyme-img ru" data-cursor="Россия">
                  <img
                    src={r.ru.src}
                    alt={`${r.ru.name}, ${r.ru.place}`}
                    loading="lazy"
                  />
                  <figcaption>
                    <span className="tag ru">RU</span>
                    <strong>{r.ru.name}</strong>
                    <small>{r.ru.place}</small>
                  </figcaption>
                </figure>
              </div>
            </article>
          ))}
        </motion.div>
        {pinned && (
          <div className="rhymes-bar" aria-hidden="true">
            <motion.i style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Panorama de Monterrey                                               */
/* ------------------------------------------------------------------ */

function Panorama() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const inset = useTransform(scrollYProgress, [0, 0.35], [12, 0]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round 28px)`;
  const wordX = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  return (
    <section ref={ref} className="panorama" aria-labelledby="pano-title">
      <motion.div className="pano-frame" style={{ clipPath: clip }}>
        <motion.img
          src={img("nl-panorama")}
          alt="Panorámica de Monterrey con el Cerro de la Silla"
          style={{ scale, x }}
        />
        <div className="pano-shade" />
        <motion.div
          className="pano-word"
          style={{ x: wordX }}
          aria-hidden="true"
        >
          NUEVO LEÓN · НУЭВО-ЛЕОН ·
        </motion.div>
        <div className="wrap pano-copy">
          <Label light>Nuestra casa</Label>
          <SplitReveal
            as="h2"
            className="display light"
            text="Monterrey, donde empieza el puente."
          />
          <div className="pano-facts">
            {nlFacts.map(f => (
              <div key={f.label}>
                <strong>
                  <Counter
                    value={f.value}
                    suffix={f.suffix}
                    format={f.format}
                  />
                </strong>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ciencia y tecnología                                                */
/* ------------------------------------------------------------------ */

function Science({ onRead }: { onRead: (a: Article) => void }) {
  const [areaId, setAreaId] = useState(scienceAreas[0].id);
  const area = scienceAreas.find(a => a.id === areaId) ?? scienceAreas[0];
  const AreaIcon = areaIcons[area.id] ?? Rocket;
  return (
    <section className="science section" id="ciencia">
      <div className="orb orb-blue" aria-hidden="true" />
      <div className="orb orb-red" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label light>Ciencia y tecnología</Label>
            <SplitReveal
              className="display light"
              text="La Rusia que cambió el mundo."
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lede light">
              Del primer satélite a la tabla periódica: descubrimientos e
              inventos que hoy forman parte de tu vida diaria.
            </p>
          </Reveal>
        </div>

        <div className="facts">
          {quickFacts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08} className="fact">
              <strong>
                <Counter value={Number(f.value)} />
              </strong>
              <span>{f.label}</span>
            </Reveal>
          ))}
        </div>

        <LayoutGroup>
          <div
            className="area-tabs"
            role="tablist"
            aria-label="Áreas de ciencia y tecnología"
          >
            {scienceAreas.map(a => {
              const Icon = areaIcons[a.id] ?? Rocket;
              const active = a.id === area.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={active ? "area-tab active" : "area-tab"}
                  onClick={() => setAreaId(a.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="tab-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="tab-content">
                    <Icon size={16} /> {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={area.id}
            className="area-panel"
            role="tabpanel"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="area-intro">
              <span className="area-cyr">{area.cyrillic}</span>
              <h3>
                <AreaIcon size={22} /> {area.headline}
              </h3>
              <p>{area.intro}</p>
              <button
                type="button"
                className="btn btn-red"
                onClick={() =>
                  onRead({
                    id: area.id,
                    category: area.label,
                    title: area.article.title,
                    summary: "",
                    minutes: area.article.minutes,
                    body: area.article.body,
                  })
                }
              >
                Leer: {area.article.title} <ArrowRight size={15} />
              </button>
            </div>
            <ol className="milestones">
              {area.milestones.map((m, i) => (
                <motion.li
                  className="milestone"
                  key={m.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.1 + i * 0.05,
                  }}
                >
                  <span className="milestone-year">{m.year}</span>
                  <div>
                    <h4>{m.title}</h4>
                    <p>{m.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Videos                                                              */
/* ------------------------------------------------------------------ */

function Videos({ onPlay }: { onPlay: (c: Clip) => void }) {
  return (
    <section className="videos section" id="videos">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label>En movimiento</Label>
            <SplitReveal
              className="display"
              text="Dos países, una misma mirada."
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lede">
              Monterrey y Rusia vistos desde el aire, el río y la calle. Toca
              cualquier video para verlo en grande.
            </p>
          </Reveal>
        </div>
        <div className="bento">
          {clips.map((c, i) => (
            <Reveal
              key={c.id}
              delay={i * 0.06}
              className={`bento-cell b${i + 1}`}
            >
              <button
                type="button"
                className="clip"
                onClick={() => onPlay(c)}
                data-cursor="Ver"
                aria-label={`Reproducir video: ${c.title}, ${c.place}`}
              >
                <LazyVideo
                  className="clip-video"
                  poster={c.poster}
                  sources={videoSources(c)}
                  alt={c.title}
                />
                <span className="clip-shade" />
                <span className={`tag ${c.country}`}>
                  {c.country === "mx" ? "Nuevo León" : "Россия"}
                </span>
                <span className="clip-play" aria-hidden="true">
                  <Play size={18} fill="currentColor" />
                </span>
                <span className="clip-text">
                  <small>{c.titleRu}</small>
                  <strong>{c.title}</strong>
                  <em>{c.place}</em>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quiénes somos                                                       */
/* ------------------------------------------------------------------ */

function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const wordX = useTransform(scrollYProgress, [0, 1], ["10%", "-25%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="about section" id="nosotros">
      <motion.div
        className="about-word"
        style={{ x: wordX }}
        aria-hidden="true"
      >
        Дружба · Amistad · Дружба · Amistad
      </motion.div>
      <div className="wrap about-grid">
        <div className="about-visual">
          <div className="about-img" data-cursor="Cerro de la Silla">
            <motion.img
              src={img("nl-silla")}
              alt="El Cerro de la Silla, símbolo de Monterrey"
              style={{ y: imgY }}
            />
          </div>
          <Reveal className="about-badge" delay={0.2}>
            <strong>[DRUZH-ba]</strong>
            <span>amistad, en ruso</span>
          </Reveal>
        </div>
        <div className="about-content">
          <Label>Quiénes somos</Label>
          <SplitReveal
            className="display"
            text="Una sede digital para encontrarnos."
          />
          <Reveal delay={0.1}>
            <p className="lede">
              Druzhba Nuevo León nace en Monterrey como un centro cultural ruso
              virtual: un espacio abierto para conocer los aportes de Rusia a la
              ciencia, la tecnología y la cultura del mundo, con curiosidad y
              sin estereotipos.
            </p>
            <p className="lede">
              Comenzamos en línea, con la mirada puesta en una futura sede
              física. Aquí caben quienes apenas descubren el alfabeto cirílico,
              quienes hablan ruso y extrañan su cultura, y quienes simplemente
              sienten curiosidad.
            </p>
          </Reveal>
          <div className="values">
            {[
              [
                "01",
                "Diálogo cultural",
                "Escuchar otras perspectivas y construir puentes desde la curiosidad.",
              ],
              [
                "02",
                "Educación abierta",
                "Compartir contenido claro para aprender a tu ritmo.",
              ],
              [
                "03",
                "Amistad entre pueblos",
                "Reconocer lo que nos acerca, con respeto por nuestras diferencias.",
              ],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <Tilt className="value">
                  <span className="value-no">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cultura                                                             */
/* ------------------------------------------------------------------ */

function Culture({ onOpen }: { onOpen: (a: Article) => void }) {
  return (
    <section className="culture section" id="cultura">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label light>Cultura rusa</Label>
            <SplitReveal
              className="display light"
              text="Arte, letras y tradición."
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lede light">
              Textos breves para entrar a Rusia por sus ideas, sus voces y sus
              formas de celebrar.
            </p>
          </Reveal>
        </div>
        <div className="article-grid">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1}>
              <Tilt
                as="button"
                className="article-card"
                onClick={() => onOpen(a)}
                data-cursor="Leer"
                max={6}
              >
                <motion.div
                  className="article-image"
                  layoutId={`art-img-${a.id}`}
                >
                  <img src={a.image} alt={a.alt} loading="lazy" />
                </motion.div>
                <div className="article-body">
                  <span className="article-category">{a.category}</span>
                  <h3>{a.title}</h3>
                  <p>{a.summary}</p>
                  <div className="article-meta">
                    <span>
                      <Clock3 size={13} /> {a.minutes} min
                    </span>
                    <span className="article-read">
                      Leer <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
                <span className="card-glow" aria-hidden="true" />
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Aprende ruso                                                        */
/* ------------------------------------------------------------------ */

function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace("…", ""));
    u.lang = "ru-RU";
    u.rate = 0.85;
    const voice = synth
      .getVoices()
      .find(v => v.lang.toLowerCase().startsWith("ru"));
    if (voice) u.voice = voice;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

function Learn() {
  const [flipped, setFlipped] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  return (
    <section className="learn section" id="aprende">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Label>Aprende ruso</Label>
            <SplitReveal
              className="display"
              text="Las primeras palabras abren la puerta."
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lede">
              El alfabeto ruso tiene 33 letras. Pasa el cursor o toca cada una
              para descubrir cómo suena.
            </p>
          </Reveal>
        </div>
        <div className="learn-grid">
          <div className="alphabet" aria-label="Alfabeto cirílico">
            {alphabet.map(([letter, sound], i) => (
              <motion.button
                type="button"
                key={letter}
                className={`letter ${flipped === letter ? "flipped" : ""}`}
                onClick={() => {
                  setFlipped(flipped === letter ? null : letter);
                  if (canSpeak) speak(letter.toLowerCase());
                }}
                aria-label={`Letra ${letter}, suena como ${sound}`}
                initial={{ opacity: 0, scale: 0.6, rotateX: -60 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: (i % 11) * 0.03 + Math.floor(i / 11) * 0.08,
                }}
              >
                <span className="letter-inner">
                  <span className="letter-front">
                    {letter}
                    <small>{letter.toLowerCase()}</small>
                  </span>
                  <span className="letter-back">{sound}</span>
                </span>
              </motion.button>
            ))}
          </div>
          <div className="phrases">
            <h3 className="learn-sub">Frases para empezar</h3>
            {phrases.map(([cyr, meaning, pron], i) => (
              <Reveal key={cyr} delay={i * 0.06} y={20}>
                <div className="phrase">
                  <div>
                    <span className="phrase-cyr">{cyr}</span>
                    <span className="phrase-translation">
                      {meaning}
                      <small>{pron}</small>
                    </span>
                  </div>
                  {canSpeak && (
                    <button
                      type="button"
                      className={`speak ${speaking === cyr ? "on" : ""}`}
                      aria-label={`Escuchar «${cyr}»`}
                      onClick={() => {
                        if (speak(cyr)) {
                          setSpeaking(cyr);
                          window.setTimeout(() => setSpeaking(null), 1600);
                        }
                      }}
                    >
                      <Volume2 size={17} />
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
            <p className="learn-tip">
              <strong>Tip:</strong> en ruso la «О» sin acento suena casi como
              «a». Por eso Спасибо se dice «spa-SÍ-ba» y no «spa-sí-bo».
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function Home() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem("druzhba-intro");
    } catch {
      return true;
    }
  });
  const [ready, setReady] = useState(!loading);
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [clip, setClip] = useState<Clip | null>(null);
  useLockScroll(!!openArticle || privacyOpen || !!clip || loading);

  const { join, newsletter, contact } = useSiteForms();

  const finishIntro = useCallback(() => {
    setLoading(false);
    setReady(true);
    try {
      sessionStorage.setItem("druzhba-intro", "1");
    } catch {
      /* sin almacenamiento */
    }
  }, []);

  useEffect(() => {
    if (reduce && loading) finishIntro();
  }, [reduce, loading, finishIntro]);

  useEffect(() => {
    document.title = "Druzhba Nuevo León — Centro Cultural Ruso";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenArticle(null);
        setPrivacyOpen(false);
        setClip(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress: footP } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const footY = useTransform(footP, [0, 1], ["60%", "0%"]);

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    join.mutate(
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        city: String(data.get("city") || ""),
        interests: data.getAll("interest").map(String),
      },
      { onSuccess: () => form.reset() }
    );
  };

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    contact.mutate(
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        subject: String(data.get("subject") || "Pregunta general"),
        message: String(data.get("message") || ""),
      },
      { onSuccess: () => form.reset() }
    );
  };

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    newsletter.mutate(
      { email: String(data.get("newsletter") || "") },
      { onSuccess: () => form.reset() }
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="site">
        <AnimatePresence>
          {loading && !reduce && <Preloader onDone={finishIntro} />}
        </AnimatePresence>
        <Cursor />
        <ScrollProgress />
        <Header />

        <main>
          <Hero ready={ready} />

          <div className="marquees">
            <VelocityMarquee baseVelocity={-2.2} className="mq-outline">
              {marqueeWords.map(w => (
                <em key={w}>
                  {w} <i>✦</i>{" "}
                </em>
              ))}
            </VelocityMarquee>
            <VelocityMarquee baseVelocity={1.6} className="mq-solid">
              {marqueeWords
                .slice()
                .reverse()
                .map(w => (
                  <em key={w}>
                    {w} <i>✦</i>{" "}
                  </em>
                ))}
            </VelocityMarquee>
          </div>

          <Bridge />
          <Rhymes />
          <Panorama />
          <Science onRead={setOpenArticle} />
          <Videos onPlay={setClip} />
          <About />
          <Culture onOpen={setOpenArticle} />
          <Learn />

          {/* COMUNIDAD */}
          <section className="community section" id="comunidad">
            <div className="community-bg" aria-hidden="true">
              <img src={img("nl-skyline")} alt="" loading="lazy" />
            </div>
            <div className="wrap community-grid">
              <div className="community-copy">
                <Label light>Comunidad</Label>
                <SplitReveal
                  className="display light"
                  text="Tu curiosidad también tiene un lugar aquí."
                />
                <Reveal delay={0.1}>
                  <p className="lede light">
                    Estamos preparando las primeras actividades. Regístrate y
                    cuéntanos qué te interesa: tus respuestas nos ayudan a
                    decidir por dónde empezar, y serás de las primeras personas
                    en enterarse.
                  </p>
                  <ul className="community-points">
                    <li>
                      <Sparkles size={16} /> No necesitas saber ruso.
                    </li>
                    <li>
                      <Globe2 size={16} /> Formato virtual, abierto a todo
                      México.
                    </li>
                    <li>
                      <Mail size={16} /> Solo te escribiremos cuando haya algo
                      que compartir.
                    </li>
                  </ul>
                </Reveal>
              </div>
              <Reveal delay={0.15}>
                <div className="form-card glass">
                  <h3>Únete a la comunidad</h3>
                  <p>Te tomará menos de un minuto.</p>
                  {join.isSuccess && (
                    <Status ok>
                      Gracias por sumarte. ¡Tu registro quedó guardado!
                    </Status>
                  )}
                  {join.isError && <Status ok={false}>{FORMS_ENABLED ? ERROR_TEXT : SOON_TEXT}</Status>}
                  <form onSubmit={handleJoin}>
                    <div className="form-grid">
                      <div className="field">
                        <input
                          id="join-name"
                          name="name"
                          placeholder=" "
                          minLength={2}
                          required
                        />
                        <label htmlFor="join-name">Nombre</label>
                      </div>
                      <div className="field">
                        <input
                          id="join-email"
                          name="email"
                          type="email"
                          placeholder=" "
                          required
                        />
                        <label htmlFor="join-email">Correo electrónico</label>
                      </div>
                      <div className="field full">
                        <input
                          id="join-city"
                          name="city"
                          placeholder=" "
                          minLength={2}
                          required
                        />
                        <label htmlFor="join-city">Ciudad</label>
                      </div>
                      <fieldset className="full">
                        <legend>¿Qué te interesa?</legend>
                        <div className="interests">
                          {interests.map(interest => (
                            <label className="chip" key={interest}>
                              <input
                                type="checkbox"
                                name="interest"
                                value={interest}
                              />
                              <span>{interest}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <p className="full form-legal">
                        Al registrarte aceptas nuestro{" "}
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => setPrivacyOpen(true)}
                        >
                          aviso de privacidad
                        </button>
                        .
                      </p>
                      <div className="full">
                        <button
                          className="btn btn-red btn-block"
                          type="submit"
                          disabled={join.isPending}
                        >
                          {join.isPending ? (
                            "Enviando…"
                          ) : (
                            <>
                              Quiero ser parte <ArrowRight size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          </section>

          {/* APOYA */}
          <section className="support" id="apoya">
            <div className="wrap support-inner">
              <div>
                <Label light>Apoya el proyecto</Label>
                <SplitReveal
                  className="display light"
                  text="Ayúdanos a abrir la próxima puerta."
                />
                <Reveal delay={0.1}>
                  <p className="lede light">
                    Druzhba empieza en una pantalla, pero sueña con una casa en
                    Monterrey: un espacio para leer, cocinar, estudiar y
                    celebrar juntos. Si quieres sumar, escríbenos.
                  </p>
                  <Magnetic>
                    <a className="btn btn-white" href="#contacto">
                      Quiero colaborar <ArrowUpRight size={16} />
                    </a>
                  </Magnetic>
                </Reveal>
              </div>
              <div className="support-options">
                {[
                  [
                    HandHeart,
                    "Voluntariado",
                    "Traducción, diseño, redes, contenido",
                  ],
                  [
                    HeartHandshake,
                    "Alianzas",
                    "Escuelas, universidades y colectivos",
                  ],
                  [Sparkles, "Ideas", "Propón una actividad o un tema"],
                  [
                    Send,
                    "Difusión",
                    "Comparte el proyecto con quien le interese",
                  ],
                ].map(([Icon, t, d], i) => {
                  const I = Icon as typeof Send;
                  return (
                    <Reveal key={t as string} delay={i * 0.08}>
                      <Tilt className="support-option" max={10}>
                        <I size={22} />
                        <span>
                          {t as string}
                          <small>{d as string}</small>
                        </span>
                      </Tilt>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CONTACTO */}
          <section className="contact section" id="contacto">
            <div className="wrap contact-grid">
              <div className="contact-copy">
                <Label>Contacto</Label>
                <SplitReveal
                  className="display"
                  text="Hablemos. Давайте поговорим."
                />
                <Reveal delay={0.1}>
                  <p className="lede">
                    ¿Tienes una propuesta, una pregunta o quieres colaborar?
                    Escríbenos con el formulario y te responderemos al correo
                    que nos dejes.
                  </p>
                  <div className="contact-details">
                    <div className="contact-detail">
                      <MapPin size={18} />
                      <p>
                        <small>Desde</small>Monterrey, Nuevo León, México
                      </p>
                    </div>
                    <div className="contact-detail">
                      <Globe2 size={18} />
                      <p>
                        <small>Modalidad</small>Virtual, por ahora
                      </p>
                    </div>
                  </div>
                  <form className="newsletter" onSubmit={handleNewsletter}>
                    <label
                      className="newsletter-label"
                      htmlFor="newsletter-email"
                    >
                      Recibe novedades por correo
                    </label>
                    {newsletter.isSuccess && (
                      <Status ok>Listo, te avisaremos de las novedades.</Status>
                    )}
                    {newsletter.isError && (
                      <Status ok={false}>{FORMS_ENABLED ? ERROR_TEXT : SOON_TEXT}</Status>
                    )}
                    <div className="newsletter-row">
                      <input
                        id="newsletter-email"
                        name="newsletter"
                        type="email"
                        required
                        placeholder="tu@correo.com"
                      />
                      <button
                        className="btn btn-blue"
                        type="submit"
                        disabled={newsletter.isPending}
                      >
                        Suscribirme
                      </button>
                    </div>
                  </form>
                </Reveal>
              </div>
              <Reveal delay={0.15}>
                <div className="form-card light-card">
                  <h3>Escríbenos</h3>
                  <p>Todos los campos son obligatorios.</p>
                  {contact.isSuccess && (
                    <Status ok>
                      Mensaje enviado. Gracias por escribirnos.
                    </Status>
                  )}
                  {contact.isError && <Status ok={false}>{FORMS_ENABLED ? ERROR_TEXT : SOON_TEXT}</Status>}
                  <form onSubmit={handleContact}>
                    <div className="form-grid">
                      <div className="field">
                        <input
                          id="contact-name"
                          name="name"
                          minLength={2}
                          required
                          placeholder=" "
                        />
                        <label htmlFor="contact-name">Nombre</label>
                      </div>
                      <div className="field">
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder=" "
                        />
                        <label htmlFor="contact-email">Correo</label>
                      </div>
                      <div className="field full select">
                        <select
                          id="contact-subject"
                          name="subject"
                          defaultValue=""
                          required
                        >
                          <option value="" disabled>
                            Elige una opción
                          </option>
                          <option>Quiero colaborar</option>
                          <option>Propuesta de actividad</option>
                          <option>Alianzas</option>
                          <option>Pregunta general</option>
                        </select>
                        <label htmlFor="contact-subject">Asunto</label>
                      </div>
                      <div className="field full">
                        <textarea
                          id="contact-message"
                          name="message"
                          minLength={3}
                          required
                          placeholder=" "
                        />
                        <label htmlFor="contact-message">Mensaje</label>
                      </div>
                      <div className="full">
                        <button
                          className="btn btn-red btn-block"
                          type="submit"
                          disabled={contact.isPending}
                        >
                          {contact.isPending ? (
                            "Enviando…"
                          ) : (
                            <>
                              Enviar mensaje <Send size={15} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="site-footer" ref={footerRef}>
          <div className="wrap">
            <div className="footer-top">
              <div>
                <Brand footer />
                <p className="footer-about">
                  Centro cultural ruso virtual desde Nuevo León. Una comunidad
                  para aprender, conversar y celebrar la amistad entre culturas.
                </p>
              </div>
              <div>
                <div className="footer-heading">Explora</div>
                <div className="footer-links">
                  <a href="#puente">El puente</a>
                  <a href="#rimas">Nuevo León ⟷ Rusia</a>
                  <a href="#ciencia">Ciencia y tecnología</a>
                  <a href="#cultura">Cultura rusa</a>
                  <a href="#aprende">Aprende ruso</a>
                </div>
              </div>
              <div>
                <div className="footer-heading">Participa</div>
                <div className="footer-links">
                  <a href="#comunidad">Únete a la comunidad</a>
                  <a href="#apoya">Apoya el proyecto</a>
                  <a href="#contacto">Contacto</a>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setPrivacyOpen(true)}
                  >
                    Aviso de privacidad
                  </button>
                </div>
              </div>
            </div>
            <details className="credits">
              <summary>Créditos de fotografías y videos</summary>
              <ul>
                {mediaCredits.map(c => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noreferrer">
                      {c.label}
                    </a>{" "}
                    — {c.author} · {c.license} · Wikimedia Commons
                  </li>
                ))}
              </ul>
            </details>
            <div className="footer-bottom">
              <span>
                Druzhba Nuevo León — Proyecto cultural independiente, sin
                afiliación gubernamental.
              </span>
              <a href="#inicio">Volver arriba ↑</a>
            </div>
          </div>
          <div className="footer-giant" aria-hidden="true">
            <motion.span style={{ y: footY }}>ДРУЖБА</motion.span>
          </div>
        </footer>

        {/* Artículo completo */}
        <AnimatePresence>
          {openArticle && (
            <motion.div
              className="modal-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={e => {
                if (e.target === e.currentTarget) setOpenArticle(null);
              }}
            >
              <motion.article
                className="modal modal-article"
                role="dialog"
                aria-modal="true"
                aria-labelledby="article-title"
                initial={{ y: 80, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <button
                  className="modal-close"
                  type="button"
                  aria-label="Cerrar artículo"
                  onClick={() => setOpenArticle(null)}
                >
                  <X size={20} />
                </button>
                {openArticle.image && (
                  <motion.div
                    className="modal-hero"
                    layoutId={`art-img-${openArticle.id}`}
                  >
                    <img src={openArticle.image} alt={openArticle.alt ?? ""} />
                  </motion.div>
                )}
                <div
                  className={
                    openArticle.image
                      ? "modal-content"
                      : "modal-content no-image"
                  }
                >
                  <span className="article-category">
                    {openArticle.category}
                  </span>
                  <h3 id="article-title">{openArticle.title}</h3>
                  {openArticle.body.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video en grande */}
        <AnimatePresence>
          {clip && (
            <motion.div
              className="modal-backdrop video-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={e => {
                if (e.target === e.currentTarget) setClip(null);
              }}
            >
              <motion.div
                className={`video-modal ${clip.vertical ? "vertical" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label={clip.title}
                initial={{ clipPath: "inset(50% 50% 50% 50% round 24px)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
                exit={{ clipPath: "inset(50% 50% 50% 50% round 24px)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <video
                  key={clip.id}
                  controls
                  autoPlay
                  playsInline
                  poster={clip.poster}
                >
                  {videoSources(clip, true).map(s => (
                    <source key={s.src} src={s.src} type={s.type} />
                  ))}
                </video>
                <div className="video-caption">
                  <strong>{clip.title}</strong>
                  <span>{clip.place} · Wikimedia Commons</span>
                </div>
              </motion.div>
              <button
                className="modal-close floating"
                type="button"
                aria-label="Cerrar video"
                onClick={() => setClip(null)}
              >
                <X size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aviso de privacidad */}
        <AnimatePresence>
          {privacyOpen && (
            <motion.div
              className="modal-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={e => {
                if (e.target === e.currentTarget) setPrivacyOpen(false);
              }}
            >
              <motion.div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-title"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <button
                  className="modal-close"
                  type="button"
                  aria-label="Cerrar aviso"
                  onClick={() => setPrivacyOpen(false)}
                >
                  <X size={20} />
                </button>
                <div className="modal-content no-image">
                  <h3 id="privacy-title">Aviso de privacidad simplificado</h3>
                  <p>
                    Druzhba Nuevo León, proyecto cultural independiente con sede
                    en Monterrey, Nuevo León, es responsable de los datos
                    personales que nos compartes en este sitio.
                  </p>
                  <p>
                    Usamos tu nombre, correo, ciudad e intereses únicamente para
                    responder tus mensajes, avisarte de actividades y conocer
                    qué temas interesan a la comunidad. No vendemos ni
                    compartimos tus datos con terceros.
                  </p>
                  <p>
                    Puedes pedir en cualquier momento que corrijamos o
                    eliminemos tus datos, o dejar de recibir correos,
                    escribiéndonos desde el formulario de contacto.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
