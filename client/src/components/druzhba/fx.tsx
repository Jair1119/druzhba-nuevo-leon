import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";
import {
  Fragment,
  ReactNode,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { useLite } from "@/lib/perfMode";
import { useIdle } from "@/lib/idle";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- hooks ---------- */

export function useMedia(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/* ---------- Texto que sube palabra por palabra ---------- */

export function SplitReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-mask" aria-hidden="true">
            <motion.span
              className="split-word"
              initial={{ y: "110%", rotate: 4 }}
              animate={inView ? { y: "0%", rotate: 0 } : undefined}
              transition={{
                duration: 1,
                ease: EASE,
                delay: delay + i * stagger,
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ---------- Aparición genérica ---------- */

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Texto que se "descifra" entre latino y cirílico ---------- */

const GLYPHS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯabcdefghijklmnñopqrstuvwxyz";

export function Scramble({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [text, setText] = useState(words[0]);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    let idx = 0;
    let raf = 0;
    const timer = window.setInterval(() => {
      idx = (idx + 1) % words.length;
      const target = words[idx];
      const from = text;
      const len = Math.max(from.length, target.length);
      const start = performance.now();
      const dur = 900;
      cancelAnimationFrame(raf);
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        let out = "";
        for (let i = 0; i < len; i++) {
          const settle = i / len;
          if (p > settle + 0.25) out += target[i] ?? "";
          else if (p > settle)
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else out += from[i] ?? "";
        }
        setText(out);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setText(target);
      };
      raf = requestAnimationFrame(tick);
    }, interval);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, words.join("|"), interval]);
  return (
    <span className={className} aria-live="off">
      {text}
    </span>
  );
}

/* ---------- Contador animado ---------- */

export function Counter({
  value,
  suffix = "",
  format = false,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  format?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: v => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {format ? n.toLocaleString("es-MX") : n}
      {suffix}
    </span>
  );
}

/* ---------- Botón magnético ---------- */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const fine = useMedia("(pointer: fine)");
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={e => {
        if (!fine || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Tarjeta con inclinación 3D ---------- */

export function Tilt({
  children,
  className,
  max = 8,
  onClick,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  onClick?: () => void;
  as?: "div" | "button";
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const fine = useMedia("(pointer: fine)");
  const Comp = as === "button" ? motion.button : motion.div;
  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      onClick={onClick}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e: React.PointerEvent) => {
        if (!fine || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ---------- Marquesina con inclinación según velocidad de scroll ---------- */

function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

export function VelocityMarquee({
  children,
  baseVelocity = 2,
  className,
}: {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 0, 4], {
    clamp: false,
  });
  const skew = useTransform(smooth, [-3000, 0, 3000], [-8, 0, 8]);
  const x = useTransform(baseX, v => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);
  const lite = useLite();
  const idle = useIdle();
  // Solo se mueve cuando está en pantalla.
  const boxRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(boxRef);
  useAnimationFrame((_, delta) => {
    if (reduce || lite || idle || !onScreen) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });
  return (
    <div ref={boxRef} className={`marquee ${className ?? ""}`} aria-hidden="true">
      <motion.div className="marquee-track" style={{ x, skewX: skew }}>
        <span>{children}</span>
        <span>{children}</span>
      </motion.div>
    </div>
  );
}

/* ---------- Cursor personalizado ---------- */

export function Cursor() {
  const fine = useMedia("(pointer: fine)");
  const lite = useLite();
  const reduce = useReducedMotion() || lite;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [state, setState] = useState<"" | "hover" | "media">("");
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!fine || reduce) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const media = t?.closest<HTMLElement>("[data-cursor]");
      if (media) {
        setState("media");
        setLabel(media.dataset.cursor || "");
      } else if (t?.closest("a, button, input, textarea, select, label")) {
        setState("hover");
        setLabel("");
      } else {
        setState("");
        setLabel("");
      }
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [fine, reduce, x, y]);
  if (!fine || reduce) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring ${state}`}
        style={{ x: sx, y: sy }}
        aria-hidden="true"
      >
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}

/* ---------- Barra de progreso tricolor ---------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/* ---------- Pantalla de carga ---------- */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  // Espera a la tipografía cirílica (máx. 1.5 s) para no mostrar letras de respaldo.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setFontsReady(true);
    };
    const t = window.setTimeout(finish, 700);
    try {
      document.fonts?.load("700 64px Unbounded", "ДРУЖБА").then(finish, finish);
    } catch {
      finish();
    }
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!fontsReady) return;
    const c = animate(0, 100, {
      duration: 1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: v => setCount(Math.round(v)),
      onComplete: () => {
        setLeaving(true);
        window.setTimeout(onDone, 800);
      },
    });
    return () => c.stop();
  }, [onDone, fontsReady]);
  return (
    <div
      className={`preloader ${leaving ? "leaving" : ""}`}
      role="status"
      aria-label="Cargando Druzhba Nuevo León"
    >
      <div className="pre-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="pre-center">
        <motion.div
          className="pre-word"
          initial={{ opacity: 0, y: 30 }}
          animate={fontsReady ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {"ДРУЖБА".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%" }}
              animate={fontsReady ? { y: "0%" } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>
        <div className="pre-meta">
          <span>Monterrey</span>
          <span className="pre-line">
            <i style={{ transform: `scaleX(${count / 100})` }} />
          </span>
          <span>Москва</span>
        </div>
        <div className="pre-count">{String(count).padStart(3, "0")}</div>
      </div>
    </div>
  );
}

/* ---------- Reloj de ciudad ---------- */

export function CityClock({ tz }: { tz: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000 * 15);
    return () => window.clearInterval(t);
  }, []);
  let s = "";
  try {
    s = new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(now);
  } catch {
    s = "";
  }
  return <span className="clock">{s}</span>;
}

/* ---------- Imagen optimizada: WebP (800/1600 px) con JPG de respaldo ---------- */

export const toWebp = (src: string, w: 800 | 1600) => src.replace(/\.jpe?g$/i, `-${w}.webp`);
const webpSet = (src: string) => `${toWebp(src, 800)} 800w, ${toWebp(src, 1600)} 1600w`;

export function Picture({
  src,
  alt,
  sizes = "100vw",
  className,
  loading = "lazy",
  priority = false,
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  style?: React.ComponentProps<typeof motion.img>["style"];
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={webpSet(src)} sizes={sizes} />
      <motion.img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        style={style}
      />
    </picture>
  );
}

/* ---------- Video que se reproduce sólo cuando está en pantalla ---------- */

export function LazyVideo({
  poster,
  sources,
  className,
  alt,
  eager = false,
  start,
  end,
  hoverPlay = false,
  desktopOnly = false,
}: {
  poster: string;
  sources: { src: string; type: string }[];
  className?: string;
  alt: string;
  eager?: boolean;
  start?: number;
  end?: number;
  /** En computadora solo se reproduce al pasar el cursor; en celular, si está bien a la vista. */
  hoverPlay?: boolean;
  /** Solo en computadora; en celular se queda la foto (ahorra datos). */
  desktopOnly?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const fine = useMedia("(pointer: fine)");
  const inView = useInView(ref, { margin: "200px 0px 200px 0px" });
  // Para reproducir exigimos que el video esté realmente visible (60 %).
  const visible = useInView(ref, { amount: 0.6 });
  // El póster se descarga solo cuando el video está cerca de la pantalla.
  const near = useInView(ref, { margin: "800px 0px 800px 0px", once: true });
  const [hovered, setHovered] = useState(false);
  const lite = useLite();
  const hoverMode = hoverPlay && fine;
  // En modo ligero solo se reproduce lo que la persona pide (al pasar el cursor).
  const idle = useIdle();
  const wantPlay = (hoverMode ? hovered : lite || (desktopOnly && !fine) ? false : hoverPlay ? visible : inView) && (!idle || hovered);
  const [armed, setArmed] = useState(eager);

  useEffect(() => {
    if (!hoverMode) return;
    const host = ref.current?.parentElement;
    if (!host) return;
    const on = () => setHovered(true);
    const off = () => setHovered(false);
    host.addEventListener("pointerenter", on);
    host.addEventListener("pointerleave", off);
    host.addEventListener("focus", on);
    host.addEventListener("blur", off);
    return () => {
      host.removeEventListener("pointerenter", on);
      host.removeEventListener("pointerleave", off);
      host.removeEventListener("focus", on);
      host.removeEventListener("blur", off);
    };
  }, [hoverMode]);
  useEffect(() => {
    if (wantPlay) setArmed(true);
  }, [wantPlay]);
  useEffect(() => {
    if (armed && !reduce) ref.current?.load();
  }, [armed, reduce]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !armed || reduce) return;
    if (wantPlay) v.play().catch(() => undefined);
    else v.pause();
  }, [wantPlay, armed, reduce]);
  return (
    <video
      ref={ref}
      className={className}
      poster={eager || near ? poster : undefined}
      muted
      loop={start === undefined}
      playsInline
      preload="none"
      aria-label={alt}
      onLoadedMetadata={e => {
        if (start !== undefined) e.currentTarget.currentTime = start;
      }}
      onTimeUpdate={e => {
        // Repite solo el tramo elegido del video.
        const v = e.currentTarget;
        if (start === undefined) return;
        if ((end !== undefined && v.currentTime >= end) || v.currentTime < start - 0.5) v.currentTime = start;
      }}
      onEnded={e => {
        if (start === undefined) return;
        e.currentTarget.currentTime = start;
        e.currentTarget.play().catch(() => undefined);
      }}
    >
      {armed &&
        !reduce &&
        sources.map(s => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  );
}

export type { MotionValue };
