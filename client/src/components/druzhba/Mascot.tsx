import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BetoFigure, type Hat } from "./Beto";
import { EASE } from "./fx";
import { useLite } from "@/lib/perfMode";
import { useIdle } from "@/lib/idle";

type Pose = "walk" | "stand" | "tip" | "wave";
const ChatPanel = lazy(() => import("./ChatPanel"));

const wait = (ms: number) => new Promise(r => window.setTimeout(r, ms));
const W = 96; // ancho del personaje en px

/* ------------------------------------------------------------------ */
/* Beto caminando por la parte de abajo de la pantalla                 */
/* ------------------------------------------------------------------ */

export function Mascot() {
  const lite = useLite();
  const reduce = useReducedMotion() || lite;
  const x = useMotionValue(-W);
  const [dir, setDir] = useState<1 | -1>(1);
  const [pose, setPose] = useState<Pose>("walk");
  const [hat, setHat] = useState<Hat>("sombrero");
  const [bubble, setBubble] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Cambio de sombrero con su propio reloj: cada 8 s, camine o no.
  const [swapPose, setSwapPose] = useState<Pose | null>(null);
  useEffect(() => {
    let alive = true;
    let current: Hat = "sombrero";
    const id = window.setInterval(async () => {
      if (document.hidden) return;
      setSwapPose("tip");
      await wait(600);
      if (!alive) return;
      current = current === "sombrero" ? "ushanka" : "sombrero";
      setHat(current);
      await wait(450);
      if (!alive) return;
      setSwapPose("wave");
      setBubble(current === "ushanka" ? "Привет! 🇷🇺" : "¡Quiubo, raza! 🇲🇽");
      await wait(1800);
      if (!alive) return;
      setBubble(null);
      setSwapPose(null);
    }, 8000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);
  const openRef = useRef(open);
  openRef.current = open;
  const idle = useIdle();
  const idleRef = useRef(idle);
  idleRef.current = idle;
  // Parpadeo puntual (en vez de una animación infinita que obliga a redibujar siempre).
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (reduce) return;
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        if (!idleRef.current && !document.hidden) {
          setBlink(true);
          window.setTimeout(() => setBlink(false), 150);
        }
        loop();
      }, 3500 + Math.random() * 3000);
    };
    loop();
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Rutina: camina, se detiene, a veces cambia de sombrero y saluda.
  useEffect(() => {
    if (reduce) {
      x.set(window.innerWidth - W - 16);
      setPose("stand");
      return;
    }
    let alive = true;
    let ctrl: ReturnType<typeof animate> | null = null;
    let hatNow: Hat = "sombrero";
    let steps = 0;
    let idleTicks = 0;
    const swapHat = async () => {
      // Se quita el sombrero… y aparece el otro.
      setPose("tip");
      await wait(650);
      hatNow = hatNow === "sombrero" ? "ushanka" : "sombrero";
      setHat(hatNow);
      await wait(500);
      setPose("wave");
      setBubble(hatNow === "ushanka" ? "Привет! 🇷🇺" : "¡Quiubo, raza! 🇲🇽");
      await wait(2200);
      setBubble(null);
    };
    const run = async () => {
      await wait(2500);
      while (alive) {
        if (openRef.current) {
          setPose("stand");
          await wait(500);
          continue;
        }
        if (idleRef.current) {
          // En pausa no camina (ahorra CPU), pero cada ~8 s cambia de sombrero en su lugar.
          setPose("stand");
          idleTicks++;
          if (idleTicks % 16 === 0) await wait(500);
          else await wait(500);
          continue;
        }
        const max = Math.max(40, window.innerWidth - W - 16);
        const from = x.get();
        let to = 16 + Math.random() * (max - 16);
        if (Math.abs(to - from) < 140) to = from < max / 2 ? Math.min(max, from + 260) : Math.max(16, from - 260);
        setDir(to > from ? 1 : -1);
        setPose("walk");
        ctrl = animate(x, to, { duration: Math.abs(to - from) / 55, ease: "linear" });
        await ctrl;
        if (!alive) return;
        steps++;
        setPose("stand");
        if (steps === 1) {
          setBubble("¿Dudas de Rusia o Nuevo León? ¡Pícale!");
          await wait(3200);
          setBubble(null);
        } else if (steps % 2 === 0) {
          await wait(500);
        } else {
          await wait(3000 + Math.random() * 4000);
        }
      }
    };
    run();
    const onResize = () => {
      const max = window.innerWidth - W - 16;
      if (x.get() > max) x.set(max);
    };
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      ctrl?.stop();
      window.removeEventListener("resize", onResize);
    };
  }, [reduce, x]);

  return (
    <>
      <motion.div className={`mascot ${blink ? "blink" : ""}`} style={{ x }} initial={false}>
        <AnimatePresence>
          {bubble && !open && (
            <motion.div
              className="mascot-bubble"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          className="mascot-btn"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Cerrar el chat con Beto" : "Abrir el chat con Beto, el asistente de Druzhba"}
          aria-expanded={open}
          data-cursor="¡Pícale!"
        >
          <span className="mascot-flip" style={{ transform: `scaleX(${dir})` }}>
            <BetoFigure hat={hat} pose={open ? "wave" : (swapPose ?? pose)} />
          </span>
        </button>
      </motion.div>
      <Suspense fallback={null}>
        <AnimatePresence>{open && <ChatPanel hat={hat} onClose={() => setOpen(false)} />}</AnimatePresence>
      </Suspense>
    </>
  );
}

