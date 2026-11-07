import { useState } from "react";
import { DIRECTORY_URL } from "./sections";

/**
 * «Reto regio»: trivia corta que conecta Nuevo León con Rusia, seguida de una
 * ruta de aprendizaje gratuita en 4 pasos. Pensada para enganchar a quien llega
 * por curiosidad y llevarlo a un curso real.
 */

type Q = { q: string; opts: string[]; ok: number; why: string };

const QUIZ: Q[] = [
  {
    q: "¿Cuántas letras tiene el alfabeto ruso?",
    opts: ["27", "33", "40"],
    ok: 1,
    why: "33 letras. Muchas ya las conoces: А, К, М, О y Т suenan casi igual que en español.",
  },
  {
    q: "La palabra rusa «спасибо» (spasíba) significa…",
    opts: ["Hola", "Gracias", "Salud"],
    ok: 1,
    why: "«Spasíba» es gracias. Para decir «muchas gracias»: «bolshóie spasíba».",
  },
  {
    q: "¿Qué tienen en común Monterrey y muchas ciudades rusas?",
    opts: ["Tradición industrial y del acero", "Están al nivel del mar", "Tienen metro desde 1900"],
    ok: 0,
    why: "Monterrey nació industrial con la Fundidora; Rusia tiene ciudades del acero como Magnitogorsk y Cheliábinsk.",
  },
  {
    q: "¿Cuánto cuesta estudiar en Rusia con la beca del gobierno ruso (cuota estatal)?",
    opts: ["Nada de colegiatura", "La mitad", "Solo es para rusos"],
    ok: 0,
    why: "La cuota estatal cubre la colegiatura completa, e incluye un año preparatorio de idioma ruso. Se solicita en education-in-russia.com.",
  },
  {
    q: "«Привет» se lee…",
    opts: ["Privet (¡quiubo!)", "Prúbet", "Pivo"],
    ok: 0,
    why: "Privet = ¡hola! informal, el «¡quiubo!» ruso. (Pivo es cerveza 🍺).",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Lee el cirílico en un fin de semana",
    d: "Aprende las 33 letras con el alfabeto interactivo de esta página. En 2 o 3 días ya lees letreros.",
    href: "#aprende",
    cta: "Ir al alfabeto",
  },
  {
    n: "02",
    t: "Toma un curso gratuito con certificado",
    d: "Cursos en línea del Instituto Pushkin y de universidades rusas, desde nivel cero.",
    href: "https://pushkininstitute.ru/",
    cta: "Instituto Pushkin",
  },
  {
    n: "03",
    t: "Practica con cultura real",
    d: "Películas completas y gratis de Mosfilm con subtítulos, y museos rusos en recorrido virtual.",
    href: DIRECTORY_URL,
    cta: "Ver directorio",
  },
  {
    n: "04",
    t: "Da el salto: beca para estudiar en Rusia",
    d: "Licenciatura, maestría o doctorado sin pagar colegiatura, mediante la cuota del gobierno ruso.",
    href: "https://education-in-russia.com/",
    cta: "Convocatoria",
  },
];

export function Ruta() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  const cur = QUIZ[Math.min(i, QUIZ.length - 1)];

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (k === cur.ok) setScore(s => s + 1);
  };
  const next = () => {
    setPick(null);
    setI(v => v + 1);
  };
  const reset = () => {
    setI(0);
    setPick(null);
    setScore(0);
  };

  const level =
    score === QUIZ.length ? "¡Ya eres medio ruso, compa! 🇷🇺" : score >= 3 ? "¡Nada mal, regio! Vas bien." : "Todos empezamos en cero. ¡Arránquese!";

  return (
    <section className="ruta section" id="ruta">
      <div className="wrap">
        <div className="ruta-head">
          <span className="ruta-label">De Nuevo León a Rusia</span>
          <h2 className="display">¿Qué tanto sabes de Rusia, regio?</h2>
          <p className="lede">
            Contesta el reto de 5 preguntas y sigue la ruta gratuita para aprender ruso,
            desde leer tu primera palabra hasta una beca para estudiar allá.
          </p>
        </div>

        <div className="ruta-grid">
          <div className="quiz" aria-live="polite">
            {!done ? (
              <>
                <div className="quiz-top">
                  <span>Pregunta {i + 1} de {QUIZ.length}</span>
                  <span className="quiz-bar"><span style={{ width: `${(i / QUIZ.length) * 100}%` }} /></span>
                </div>
                <h3 className="quiz-q">{cur.q}</h3>
                <div className="quiz-opts">
                  {cur.opts.map((o, k) => (
                    <button
                      key={o}
                      type="button"
                      className={pick === null ? "" : k === cur.ok ? "ok" : k === pick ? "bad" : "dim"}
                      onClick={() => choose(k)}
                      disabled={pick !== null}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {pick !== null && (
                  <div className="quiz-why">
                    <p><strong>{pick === cur.ok ? "¡Correcto! " : "Casi. "}</strong>{cur.why}</p>
                    <button type="button" className="quiz-next" onClick={next}>
                      {i + 1 < QUIZ.length ? "Siguiente →" : "Ver resultado"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="quiz-end">
                <span className="quiz-score">{score}/{QUIZ.length}</span>
                <h3 className="quiz-q">{level}</h3>
                <p>El siguiente paso es tuyo: la ruta de al lado es 100 % gratuita.</p>
                <div className="quiz-actions">
                  <a className="quiz-next" href="#comunidad">Únete a la comunidad</a>
                  <button type="button" className="quiz-again" onClick={reset}>Repetir reto</button>
                </div>
              </div>
            )}
          </div>

          <ol className="ruta-steps">
            {STEPS.map(s => (
              <li key={s.n}>
                <span className="ruta-n">{s.n}</span>
                <div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {s.cta} →
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
