import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ExternalLink, SendHorizontal, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { answer, starterSuggestions, type BotAnswer } from "@/content/chatbot";
import { BetoFigure, type Hat } from "./Beto";
import { EASE } from "./fx";

type Pose = "walk" | "stand" | "tip" | "wave";
type Msg = { from: "bot" | "user"; text: string; links?: BotAnswer["links"]; suggestions?: string[] };

const wait = (ms: number) => new Promise(r => window.setTimeout(r, ms));
const W = 96; // ancho del personaje en px

/* ------------------------------------------------------------------ */
/* Beto caminando por la parte de abajo de la pantalla                 */
/* ------------------------------------------------------------------ */

export function Mascot() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-W);
  const [dir, setDir] = useState<1 | -1>(1);
  const [pose, setPose] = useState<Pose>("walk");
  const [hat, setHat] = useState<Hat>("sombrero");
  const [bubble, setBubble] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

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
    const run = async () => {
      await wait(2500);
      while (alive) {
        if (openRef.current) {
          setPose("stand");
          await wait(500);
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
        } else {
          await wait(1200 + Math.random() * 1800);
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
      <motion.div className="mascot" style={{ x }} initial={false}>
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
            <BetoFigure hat={hat} pose={open ? "wave" : pose} />
          </span>
        </button>
      </motion.div>
      <AnimatePresence>{open && <ChatPanel hat={hat} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ventana de chat                                                     */
/* ------------------------------------------------------------------ */

function ChatPanel({ hat, onClose }: { hat: Hat; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "¡Quiubo! Soy Beto 🤠 Pregúntame lo que quieras de Rusia, de Nuevo León o de lo que nos une: historia, comida, idioma, becas, lugares, fiestas…",
      suggestions: starterSuggestions,
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || typing) return;
    setText("");
    setMsgs(m => [...m, { from: "user", text: question }]);
    setTyping(true);
    const res = answer(question);
    await wait(450 + Math.min(1100, res.text.length * 4));
    setTyping(false);
    setMsgs(m => [...m, { from: "bot", ...res }]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(text);
  };

  const last = msgs[msgs.length - 1];

  return (
    <motion.section
      className="chat"
      role="dialog"
      aria-label="Chat con Beto, asistente de Druzhba"
      initial={{ opacity: 0, y: 40, scale: 0.92, transformOrigin: "bottom right" }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.94 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <header className="chat-head">
        <span className="chat-avatar" aria-hidden="true">
          <BetoFigure hat={hat} pose="stand" />
        </span>
        <span className="chat-title">
          <strong>Beto</strong>
          <small>
            <i className="chat-dot" /> Asistente Druzhba · Rusia ⟷ Nuevo León
          </small>
        </span>
        <button type="button" className="chat-close" onClick={onClose} aria-label="Cerrar chat">
          <X size={18} />
        </button>
      </header>

      <div className="chat-list" ref={listRef} aria-live="polite">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            className={`chat-msg ${m.from}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <p>{m.text}</p>
            {m.links && m.links.length > 0 && (
              <div className="chat-links">
                {m.links.map(l => {
                  const external = l.href.startsWith("http");
                  return (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      onClick={() => {
                        if (!external) onClose();
                      }}
                    >
                      {l.label} {external && <ExternalLink size={12} />}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
        {typing && (
          <div className="chat-msg bot typing" aria-label="Beto está escribiendo">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {!typing && last.from === "bot" && last.suggestions && (
        <div className="chat-chips">
          {last.suggestions.map(s => (
            <button key={s} type="button" onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="chat-form" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe tu pregunta…"
          aria-label="Tu pregunta para Beto"
          maxLength={300}
        />
        <button type="submit" aria-label="Enviar" disabled={!text.trim() || typing}>
          <SendHorizontal size={18} />
        </button>
      </form>
    </motion.section>
  );
}
