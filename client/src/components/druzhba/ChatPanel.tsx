import { motion } from "framer-motion";
import { ExternalLink, SendHorizontal, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { answer, starterSuggestions, type BotAnswer } from "@/content/chatbot";
import { BetoFigure, type Hat } from "./Beto";
import { EASE } from "./fx";

/* Se carga solo cuando alguien abre el chat (junto con la base de conocimiento). */

type Msg = { from: "bot" | "user"; text: string; links?: BotAnswer["links"]; suggestions?: string[] };
const wait = (ms: number) => new Promise(r => window.setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Ventana de chat                                                     */
/* ------------------------------------------------------------------ */

export default function ChatPanel({ hat, onClose }: { hat: Hat; onClose: () => void }) {
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
