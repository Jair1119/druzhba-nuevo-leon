import { useInView } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Coins,
  CalendarDays,
  Languages,
  Newspaper,
  RefreshCw,
  ThermometerSun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CityClock, Reveal, SplitReveal } from "./fx";

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */

type NewsItem = {
  title: string;
  link: string;
  date: string | null;
  summary: string;
  image: string;
};
type NewsSource = {
  id: string;
  name: string;
  lang: string;
  label: string;
  site: string;
  ok: boolean;
  items: NewsItem[];
};
type NewsData = {
  updated: string;
  sources: NewsSource[];
  fx: {
    rubPerMxn: number;
    mxnPerRub: number;
    date: string;
    provider: string;
    providerUrl: string;
  } | null;
};

// El robot de GitHub Actions actualiza este archivo cada 30 minutos.
const LIVE_URL =
  "https://raw.githubusercontent.com/Jair1119/druzhba-nuevo-leon/news-data/news.json";
const SNAPSHOT_URL = `${import.meta.env.BASE_URL}news.json`;

async function loadNews(): Promise<NewsData> {
  try {
    const r = await fetch(`${LIVE_URL}?t=${Math.floor(Date.now() / 300000)}`, {
      cache: "no-store",
    });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    const r = await fetch(SNAPSHOT_URL);
    return r.json();
  }
}

type Weather = { temp: number; code: number; wind: number; isDay: boolean };
async function loadWeather(): Promise<[Weather, Weather]> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=25.6866,55.7558&longitude=-100.3161,37.6173&current=temperature_2m,weather_code,wind_speed_10m,is_day&timezone=auto";
  const j = await (await fetch(url)).json();
  const pick = (x: {
    current: {
      temperature_2m: number;
      weather_code: number;
      wind_speed_10m: number;
      is_day: number;
    };
  }) => ({
    temp: Math.round(x.current.temperature_2m),
    code: x.current.weather_code,
    wind: Math.round(x.current.wind_speed_10m),
    isDay: x.current.is_day === 1,
  });
  return [pick(j[0]), pick(j[1])];
}

const weatherText = (c: number, day: boolean): [string, string] => {
  if (c === 0) return [day ? "☀️" : "🌙", "Despejado"];
  if (c <= 2) return [day ? "🌤️" : "☁️", "Poco nublado"];
  if (c === 3) return ["☁️", "Nublado"];
  if (c <= 48) return ["🌫️", "Niebla"];
  if (c <= 57) return ["🌦️", "Llovizna"];
  if (c <= 67) return ["🌧️", "Lluvia"];
  if (c <= 77) return ["❄️", "Nieve"];
  if (c <= 82) return ["🌧️", "Chubascos"];
  if (c <= 86) return ["🌨️", "Chubascos de nieve"];
  return ["⛈️", "Tormenta"];
};

const words: [string, string, string][] = [
  ["Дружба", "DRUZH-ba", "amistad"],
  ["Привет", "pri-VIET", "hola"],
  ["Спасибо", "spa-SÍ-ba", "gracias"],
  ["Мост", "most", "puente"],
  ["Город", "GÓ-rad", "ciudad"],
  ["Гора", "ga-RÁ", "montaña"],
  ["Река", "ri-KÁ", "río"],
  ["Солнце", "SÓN-tse", "sol"],
  ["Снег", "sniek", "nieve"],
  ["Зима", "zi-MÁ", "invierno"],
  ["Лето", "LIÉ-ta", "verano"],
  ["Книга", "KNÍ-ga", "libro"],
  ["Музыка", "MÚ-zy-ka", "música"],
  ["Хлеб", "jliep", "pan"],
  ["Чай", "chai", "té"],
  ["Семья", "sim-YÁ", "familia"],
  ["Друг", "druk", "amigo"],
  ["Дом", "dom", "casa"],
  ["Звезда", "zviz-DÁ", "estrella"],
  ["Космос", "KÓS-mas", "espacio (cosmos)"],
  ["Мечта", "mich-TÁ", "sueño, anhelo"],
  ["Счастье", "SHÁS-tie", "felicidad"],
  ["Праздник", "PRÁZ-nik", "fiesta"],
  ["Урок", "u-RÓK", "lección"],
  ["Вкусно", "FKÚS-na", "¡qué rico!"],
  ["Добро пожаловать", "da-BRÓ pa-ZHÁ-la-vat", "bienvenido"],
  ["Удачи", "u-DÁ-chi", "¡suerte!"],
  ["Здорово", "zdó-ra-va", "¡genial!"],
  ["Вместе", "VMIÉS-tie", "juntos"],
  ["Путешествие", "pu-ti-SHÉST-vi-ye", "viaje"],
];

const fiestas: { m: number; d: number; es: string; ru: string }[] = [
  { m: 1, d: 1, es: "Año Nuevo", ru: "Новый год" },
  { m: 1, d: 7, es: "Navidad ortodoxa", ru: "Рождество" },
  { m: 4, d: 12, es: "Día de la Cosmonáutica", ru: "День космонавтики" },
  { m: 6, d: 6, es: "Día de la Lengua Rusa", ru: "День русского языка" },
  { m: 9, d: 1, es: "Día del Conocimiento", ru: "День знаний" },
];

function nextFiesta(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const list = fiestas.flatMap(f =>
    [0, 1].map(y => ({
      ...f,
      at: new Date(now.getFullYear() + y, f.m - 1, f.d),
    }))
  );
  const next = list.filter(f => f.at >= today).sort((a, b) => +a.at - +b.at)[0];
  return { ...next, days: Math.round((+next.at - +today) / 86400000) };
}

const ago = (iso: string | null) => {
  if (!iso) return "";
  const min = Math.max(1, Math.round((Date.now() - +new Date(iso)) / 60000));
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
};
const langName: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  ru: "Ruso",
};
const translate = (url: string) =>
  `https://translate.google.com/translate?sl=auto&tl=es&u=${encodeURIComponent(url)}`;

/* ------------------------------------------------------------------ */
/* Sección                                                             */
/* ------------------------------------------------------------------ */

export function RusiaHoy() {
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { margin: "600px 0px 600px 0px", once: true });
  const [news, setNews] = useState<NewsData | null>(null);
  const [weather, setWeather] = useState<[Weather, Weather] | null>(null);
  const [src, setSrc] = useState("tass");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!near) return;
    let alive = true;
    const refresh = () => {
      if (document.hidden) return;
      loadNews()
        .then(d => alive && (setNews(d), setError(false)))
        .catch(() => alive && setError(true));
      loadWeather()
        .then(w => alive && setWeather(w))
        .catch(() => undefined);
    };
    refresh();
    const t = window.setInterval(refresh, 15 * 60 * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive = false;
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [near]);

  const source = news?.sources.find(s => s.id === src) ?? news?.sources[0];
  const word = words[Math.floor(Date.now() / 86400000) % words.length];
  const fiesta = nextFiesta();

  return (
    <section
      ref={ref}
      className="hoy section"
      id="hoy"
      aria-labelledby="hoy-title"
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label label-light">
              <span className="label-dot" aria-hidden="true" />
              Rusia hoy · Россия сегодня
            </span>
            <SplitReveal
              as="h2"
              className="display light"
              text="Lo que pasa en Rusia, en vivo."
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lede light">
              Noticias que se actualizan solas cada 30 minutos desde fuentes
              rusas, con su financiamiento a la vista, más clima, hora y tipo de
              cambio entre Monterrey y Moscú.
            </p>
          </Reveal>
        </div>

        <div className="hoy-grid">
          {/* Noticias */}
          <article className="w w-news" aria-labelledby="w-news-t">
            <header className="w-head">
              <h3 id="w-news-t">
                <Newspaper size={16} /> Noticias
              </h3>
              {news && (
                <span className="w-updated">
                  <RefreshCw size={12} /> Actualizado {ago(news.updated)}
                </span>
              )}
            </header>
            <div
              className="w-tabs"
              role="group"
              aria-label="Fuentes de noticias"
            >
              {(news?.sources ?? []).map(s => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={source?.id === s.id}
                  className={source?.id === s.id ? "on" : ""}
                  onClick={() => setSrc(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
            {source && (
              <p className="w-source">
                {source.label} · {langName[source.lang] ?? source.lang}
              </p>
            )}
            <ul className="w-list" aria-live="polite">
              {!news &&
                !error &&
                [0, 1, 2, 3].map(i => (
                  <li key={i} className="w-skeleton" aria-hidden="true" />
                ))}
              {error && !news && (
                <li className="w-empty">
                  No pudimos cargar las noticias. Intenta más tarde.
                </li>
              )}
              {source && !source.ok && (
                <li className="w-empty">
                  Esta fuente no respondió en la última actualización.
                </li>
              )}
              {source?.items.slice(0, 6).map(it => (
                <li key={it.link}>
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-item"
                  >
                    <strong lang={source.lang}>{it.title}</strong>
                    {it.summary && <span lang={source.lang}>{it.summary}</span>}
                    <em>
                      <Clock3 size={11} /> {ago(it.date)}
                    </em>
                  </a>
                  {source.lang !== "es" && (
                    <a
                      className="w-tr"
                      href={translate(it.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Languages size={12} /> Traducir al español
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {source && (
              <a
                className="w-more"
                href={source.site}
                target="_blank"
                rel="noopener noreferrer"
              >
                Más en {source.name} <ArrowUpRight size={14} />
              </a>
            )}
          </article>

          <div className="hoy-side">
            {/* Clima */}
            <article className="w w-weather" aria-labelledby="w-weather-t">
              <header className="w-head">
                <h3 id="w-weather-t">
                  <ThermometerSun size={16} /> Clima ahora
                </h3>
              </header>
              <div className="w-cities">
                {(["Monterrey", "Москва"] as const).map((city, i) => {
                  const w = weather?.[i];
                  const [icon, txt] = w
                    ? weatherText(w.code, w.isDay)
                    : ["·", "Cargando…"];
                  return (
                    <div key={city} className="w-city">
                      <span className="w-city-name">{city}</span>
                      <span className="w-temp">
                        <span aria-hidden="true">{icon}</span>{" "}
                        {w ? `${w.temp}°` : "—"}
                      </span>
                      <span className="w-cond">
                        {txt}
                        {w ? ` · viento ${w.wind} km/h` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              {weather && (
                <p className="w-note">
                  Diferencia: {Math.abs(weather[0].temp - weather[1].temp)}° ·{" "}
                  <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open-Meteo
                  </a>
                </p>
              )}
            </article>

            {/* Hora */}
            <article className="w w-time" aria-labelledby="w-time-t">
              <header className="w-head">
                <h3 id="w-time-t">
                  <Clock3 size={16} /> Hora
                </h3>
              </header>
              <div className="w-clocks">
                <div>
                  <small>Monterrey</small>
                  <CityClock tz="America/Monterrey" />
                </div>
                <div>
                  <small>Москва</small>
                  <CityClock tz="Europe/Moscow" />
                </div>
              </div>
              <p className="w-note">Moscú va 9 horas adelante.</p>
            </article>

            {/* Tipo de cambio */}
            <article className="w w-fx" aria-labelledby="w-fx-t">
              <header className="w-head">
                <h3 id="w-fx-t">
                  <Coins size={16} /> Peso ⟷ rublo
                </h3>
              </header>
              {news?.fx ? (
                <>
                  <p className="w-big">
                    $1 MXN = <b>{news.fx.rubPerMxn.toFixed(2)} ₽</b>
                  </p>
                  <p className="w-small">
                    100 ₽ = ${(news.fx.mxnPerRub * 100).toFixed(2)} MXN
                  </p>
                  <p className="w-note">
                    Referencia informativa ·{" "}
                    <a
                      href={news.fx.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {news.fx.provider}
                    </a>
                  </p>
                </>
              ) : (
                <p className="w-small">Cargando…</p>
              )}
            </article>

            {/* Palabra del día */}
            <article className="w w-word" aria-labelledby="w-word-t">
              <header className="w-head">
                <h3 id="w-word-t">
                  <Languages size={16} /> Palabra del día
                </h3>
              </header>
              <p className="w-ru" lang="ru">
                {word[0]}
              </p>
              <p className="w-small">
                [{word[1]}] · {word[2]}
              </p>
            </article>

            {/* Próxima fiesta */}
            <article className="w w-fiesta" aria-labelledby="w-fiesta-t">
              <header className="w-head">
                <h3 id="w-fiesta-t">
                  <CalendarDays size={16} /> Próxima fiesta rusa
                </h3>
              </header>
              <p className="w-big">
                {fiesta.days === 0 ? (
                  "¡Es hoy!"
                ) : (
                  <>
                    <b>{fiesta.days}</b> {fiesta.days === 1 ? "día" : "días"}
                  </>
                )}
              </p>
              <p className="w-small">
                {fiesta.es} · <span lang="ru">{fiesta.ru}</span>
              </p>
              <a className="w-more" href="#calendario">
                Ver calendario que rima
              </a>
            </article>
          </div>
        </div>
        <p className="w-disclaimer">
          Druzhba muestra titulares de fuentes rusas e indica quién las
          financia; no editamos ni respaldamos su contenido. Compara fuentes y
          forma tu propio criterio.
        </p>
      </div>
    </section>
  );
}
