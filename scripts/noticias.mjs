// Robot de noticias de Druzhba: lee fuentes rusas (RSS) y el tipo de cambio,
// y escribe un JSON pequeño que la página lee para sus widgets.
// Uso: node scripts/noticias.mjs ruta/salida/news.json
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = process.argv[2] || "news.json";
const PER_SOURCE = 8;
const UA = "DruzhbaNuevoLeonBot/1.0 (+https://druzhba-nl.com/)";

// Fuentes con transparencia: quién las financia o dónde están.
const SOURCES = [
  { id: "tass", name: "TASS", lang: "en", label: "Agencia de noticias estatal", site: "https://tass.com/", feed: "https://tass.com/rss/v2.xml" },
  { id: "interfax", name: "Interfax", lang: "ru", label: "Agencia de noticias privada", site: "https://www.interfax.ru/", feed: "https://www.interfax.ru/rss.asp" },
  { id: "moscowtimes", name: "The Moscow Times", lang: "en", label: "Independiente · sede en Países Bajos", site: "https://www.themoscowtimes.com/", feed: "https://www.themoscowtimes.com/rss/news" },
  { id: "meduza", name: "Meduza", lang: "en", label: "Independiente · sede en Letonia", site: "https://meduza.io/en", feed: "https://meduza.io/rss/en/all" },
  { id: "elementy", name: "Elementy", lang: "ru", label: "Ciencia · divulgación", site: "https://elementy.ru/", feed: "https://elementy.ru/rss/news" },
];

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»", mdash: "—", ndash: "–", hellip: "…" };
const decode = s =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m);
const strip = s => decode(decode(s)).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};
const attr = (xml, name, a) => {
  const m = xml.match(new RegExp(`<${name}\\s[^>]*${a}=["']([^"']+)["']`, "i"));
  return m ? decode(m[1]) : "";
};
const cut = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

async function get(url, type = "text") {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return type === "json" ? res.json() : res.text();
}

async function readSource(src) {
  const xml = await get(src.feed);
  const items = [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map(([it]) => {
    const title = strip(tag(it, "title"));
    const link = strip(tag(it, "link")) || attr(it, "link", "href");
    const date = new Date(strip(tag(it, "pubDate")) || strip(tag(it, "dc:date")) || Date.now());
    const desc = cut(strip(tag(it, "description")), 220);
    const image =
      attr(it, "enclosure", "url") || attr(it, "media:content", "url") || attr(it, "media:thumbnail", "url") || (decode(tag(it, "description")).match(/<img[^>]+src=["']([^"']+)/i) || [])[1] || "";
    return { title, link, date: isNaN(+date) ? null : date.toISOString(), summary: desc && desc !== title ? desc : "", image: /^https:\/\//.test(image) ? image : "" };
  });
  return items
    .filter(i => i.title && /^https?:\/\//.test(i.link))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, PER_SOURCE);
}

const out = { updated: new Date().toISOString(), sources: [], fx: null };

for (const src of SOURCES) {
  const { feed, ...meta } = src;
  try {
    out.sources.push({ ...meta, ok: true, items: await readSource(src) });
  } catch (e) {
    console.error("Fuente con error:", src.id, e.message);
    out.sources.push({ ...meta, ok: false, items: [] });
  }
}

try {
  const fx = await get("https://open.er-api.com/v6/latest/MXN", "json");
  if (fx.result === "success" && fx.rates?.RUB) {
    out.fx = { rubPerMxn: +fx.rates.RUB.toFixed(4), mxnPerRub: +(1 / fx.rates.RUB).toFixed(4), usdPerMxn: +fx.rates.USD.toFixed(5), date: fx.time_last_update_utc, provider: "ExchangeRate-API", providerUrl: "https://www.exchangerate-api.com" };
  }
} catch (e) {
  console.error("Tipo de cambio con error:", e.message);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out));
console.log(`OK ${OUT}: ${out.sources.map(s => `${s.id}=${s.items.length}`).join(" ")} fx=${out.fx ? out.fx.rubPerMxn : "—"}`);
