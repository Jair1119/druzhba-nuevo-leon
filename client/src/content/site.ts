/* Contenido editorial de Druzhba Nuevo León */

export type Article = {
  id: string;
  category: string;
  title: string;
  summary: string;
  minutes: number;
  image?: string;
  alt?: string;
  body: string[];
};

const BASE = import.meta.env.BASE_URL;
const IMG = `${BASE}media/img`;
export const img = (key: string) => `${IMG}/${key}.jpg`;

export const articles: Article[] = [
  {
    id: "pushkin",
    category: "Literatura",
    title: "Pushkin y la invención de una voz moderna",
    summary:
      "Por qué Alexandr Pushkin sigue siendo la puerta de entrada a la literatura rusa.",
    minutes: 4,
    image: `${BASE}images/saint-basil.jpg`,
    alt: "Cúpulas de la catedral de San Basilio, Moscú",
    body: [
      "Alexandr Serguéievich Pushkin (1799–1837) es para Rusia lo que Cervantes es para el español: el escritor a partir del cual se mide todo lo demás. Antes de él, la literatura rusa culta se escribía muchas veces imitando modelos franceses o con un lenguaje solemne y lejano. Pushkin mezcló el habla cotidiana con la tradición literaria y demostró que el ruso podía ser ligero, irónico y profundo al mismo tiempo.",
      "Su obra más conocida, Eugenio Oneguin, es una novela en verso sobre un joven aburrido de la vida en sociedad y Tatiana, una muchacha de provincia que se enamora de él. Detrás de la historia hay un retrato de toda una época, y de ella salieron personajes y temas que después retomarían Lérmontov, Turguénev, Tolstói y Dostoievski.",
      "Pushkin también escribió cuentos (La dama de picas), teatro (Borís Godunov) y una novela histórica (La hija del capitán). Murió a los 37 años tras un duelo, y desde entonces se convirtió en un símbolo nacional. Si quieres empezar a leer literatura rusa, sus relatos breves son un excelente primer paso.",
    ],
  },
  {
    id: "gzhel",
    category: "Arte · Tradición",
    title: "Gzhel: el azul que cuenta historias",
    summary:
      "La cerámica azul y blanca que se volvió una de las firmas visuales de Rusia.",
    minutes: 3,
    image: `${BASE}images/gzhel.jpg`,
    alt: "Patrón decorativo azul y blanco inspirado en la cerámica de Gzhel",
    body: [
      "Gzhel es el nombre de una zona de pueblos al sureste de Moscú con una larga tradición alfarera, gracias a la calidad de sus arcillas. Con el tiempo, el nombre pasó a designar un estilo: piezas de porcelana o loza blanca pintadas a mano con azul cobalto.",
      "Lo característico de Gzhel es la pincelada: un solo trazo que va del azul intenso al azul claro y forma pétalos, rosas, hojas y escenas de la vida cotidiana. Se pintan teteras, platos, figuras y adornos, y cada pieza es ligeramente distinta.",
      "Para quienes vivimos en México hay un parentesco curioso: la talavera poblana también combina el blanco con el azul. Son tradiciones distintas, pero ambas muestran cómo un oficio local puede convertirse en parte de la identidad de un país.",
    ],
  },
  {
    id: "maslenitsa",
    category: "Festividades",
    title: "Maslenitsa: despedir el invierno con alegría",
    summary: "Blinis, juegos y una semana entera para decirle adiós al frío.",
    minutes: 3,
    image: `${BASE}images/maslenitsa.jpg`,
    alt: "Celebración de Maslenitsa con vestimenta y música tradicional",
    body: [
      "Maslenitsa es una de las fiestas populares más antiguas de Rusia. Dura una semana y se celebra justo antes de la Gran Cuaresma ortodoxa, por lo que su fecha cambia cada año, normalmente entre febrero y marzo. Su origen es anterior al cristianismo: era una forma de despedir el invierno y recibir al sol.",
      "El gran protagonista es el blin, una crepa delgada que, por su forma redonda y dorada, se asocia con el sol. Se come con mantequilla, crema agria, mermelada, miel o caviar. De hecho, el nombre de la fiesta viene de maslo, que significa mantequilla.",
      "Durante la semana hay paseos en trineo, juegos, música y visitas familiares. El último día, conocido como Domingo del Perdón, las personas se piden perdón mutuamente, y en muchos lugares se quema un muñeco de paja que representa al invierno.",
    ],
  },
];

export const alphabet: [string, string][] = [
  ["А", "a"],
  ["Б", "b"],
  ["В", "v"],
  ["Г", "g"],
  ["Д", "d"],
  ["Е", "ye"],
  ["Ё", "yo"],
  ["Ж", "zh"],
  ["З", "z"],
  ["И", "i"],
  ["Й", "i breve"],
  ["К", "k"],
  ["Л", "l"],
  ["М", "m"],
  ["Н", "n"],
  ["О", "o"],
  ["П", "p"],
  ["Р", "r"],
  ["С", "s"],
  ["Т", "t"],
  ["У", "u"],
  ["Ф", "f"],
  ["Х", "j"],
  ["Ц", "ts"],
  ["Ч", "ch"],
  ["Ш", "sh"],
  ["Щ", "shch"],
  ["Ъ", "signo duro"],
  ["Ы", "y"],
  ["Ь", "signo suave"],
  ["Э", "e"],
  ["Ю", "yu"],
  ["Я", "ya"],
];

export const phrases: [string, string, string][] = [
  ["Привет!", "¡Hola! (informal)", "pri-VIET"],
  ["Здравствуйте", "Buenos días / Hola (formal)", "ZDRÁST-vui-tie"],
  ["Спасибо", "Gracias", "spa-SÍ-ba"],
  ["Пожалуйста", "Por favor / De nada", "pa-ZHÁ-lus-ta"],
  ["Меня зовут…", "Me llamo…", "mi-NIÁ za-VUT"],
  ["До свидания", "Hasta luego", "da svi-DÁ-ni-ya"],
];

export const interests = [
  "Espacio",
  "Ciencia",
  "Tecnología",
  "Medicina",
  "Energía",
  "Idioma ruso",
  "Literatura",
  "Música",
  "Cine",
  "Gastronomía",
  "Historia y arte",
];

export const navItems: [string, string][] = [
  ["#puente", "El puente"],
  ["#rimas", "Nuevo León ⟷ Rusia"],
  ["#ciencia", "Ciencia"],
  ["#cultura", "Cultura"],
  ["#aprende", "Aprende ruso"],
  ["#contacto", "Contacto"],
];

/* Dos paisajes que riman: Nuevo León ⟷ Rusia */
export type Rhyme = {
  theme: string;
  themeRu: string;
  nl: { src: string; name: string; place: string };
  ru: { src: string; name: string; place: string };
};

export const rhymes: Rhyme[] = [
  {
    theme: "Puentes que desafían la gravedad",
    themeRu: "Мосты",
    nl: {
      src: img("nl-puente"),
      name: "Puente Atirantado",
      place: "Monterrey · San Pedro, N. L.",
    },
    ru: { src: img("v-moscow"), name: "Puente Zhivopisny", place: "Moscú" },
  },
  {
    theme: "Agua que cae y canta",
    themeRu: "Водопады",
    nl: {
      src: img("nl-cola"),
      name: "Cascada Cola de Caballo",
      place: "Santiago, N. L.",
    },
    ru: {
      src: img("ru-peterhof"),
      name: "Gran Cascada de Peterhof",
      place: "San Petersburgo",
    },
  },
  {
    theme: "Naturaleza monumental",
    themeRu: "Природа",
    nl: {
      src: img("nl-huasteca"),
      name: "La Huasteca",
      place: "Santa Catarina, N. L.",
    },
    ru: { src: img("ru-baikal"), name: "Lago Baikal", place: "Siberia" },
  },
  {
    theme: "Ciudades que viven junto al agua",
    themeRu: "Набережные",
    nl: {
      src: img("nl-santalucia"),
      name: "Paseo Santa Lucía",
      place: "Monterrey",
    },
    ru: {
      src: img("ru-spb"),
      name: "Puente del Palacio",
      place: "San Petersburgo",
    },
  },
  {
    theme: "Plazas que cuentan historia",
    themeRu: "Площади",
    nl: { src: img("nl-macroplaza"), name: "Macroplaza", place: "Monterrey" },
    ru: { src: img("ru-kazan"), name: "Kremlin de Kazán", place: "Tatarstán" },
  },
  {
    theme: "Rascacielos que encienden la noche",
    themeRu: "Небоскрёбы",
    nl: {
      src: img("nl-skyline"),
      name: "Monterrey de noche",
      place: "Valle Oriente",
    },
    ru: { src: img("ru-mcity"), name: "Moscow City", place: "Moscú" },
  },
  {
    theme: "Patrimonio que se ilumina",
    themeRu: "Наследие",
    nl: {
      src: img("nl-fundidora"),
      name: "Parque Fundidora",
      place: "Monterrey",
    },
    ru: { src: img("ru-kremlin"), name: "Kremlin de Moscú", place: "Moscú" },
  },
];

/* Videos (Wikimedia Commons, licencias libres) */
const T = "https://upload.wikimedia.org/wikipedia/commons/transcoded";
export type Clip = {
  id: string;
  title: string;
  titleRu: string;
  place: string;
  country: "mx" | "ru";
  poster: string;
  low: string;
  high: string;
  mov: string;
  vertical?: boolean;
};

const clip = (
  id: string,
  path: string,
  file: string,
  meta: Omit<Clip, "id" | "poster" | "low" | "high" | "mov">
): Clip => ({
  id,
  poster: img(`v-${id}`),
  low: `${T}/${path}/${file}/${file}.480p.vp9.webm`,
  high: `${T}/${path}/${file}/${file}.1080p.vp9.webm`,
  mov: `${T}/${path}/${file}/${file}.360p.mpeg4.mov`,
  ...meta,
});

export const clips: Clip[] = [
  clip("moscow", "b/b6", "Aerial_views_of_Moscow%2C_Russia_in_May_2018.webm", {
    title: "Moscú desde el aire",
    titleRu: "Москва",
    place: "Rusia",
    country: "ru",
  }),
  clip("macroplaza", "e/ee", "Macroplaza_de_Monterrey_y_alrededores.webm", {
    title: "Macroplaza y alrededores",
    titleRu: "Монтеррей",
    place: "Monterrey, Nuevo León",
    country: "mx",
  }),
  clip("spb", "4/4c", "Bridges_in_Saint_Petersburg_MVI_3927.webm", {
    title: "Puentes del Nevá",
    titleRu: "Санкт-Петербург",
    place: "San Petersburgo",
    country: "ru",
  }),
  clip(
    "obispado",
    "d/dd",
    "Vista_desde_el_Mirador_del_Museo_Regional_de_Nuevo_Le%C3%B3n_el_Obispado.webm",
    {
      title: "Vista desde el Obispado",
      titleRu: "Епископский дворец",
      place: "Monterrey, Nuevo León",
      country: "mx",
      vertical: true,
    }
  ),
  clip("taiga", "6/6e", "Aerial_views_of_Taiga_in_Russia.webm", {
    title: "La taiga infinita",
    titleRu: "Тайга",
    place: "Rusia",
    country: "ru",
  }),
];

export const clipById = (id: string) => clips.find(c => c.id === id)!;

export const nlFacts: {
  value: number;
  suffix?: string;
  label: string;
  format?: boolean;
}[] = [
  { value: 1596, label: "Año de fundación de Monterrey" },
  {
    value: 1820,
    suffix: " m",
    label: "Altura del Cerro de la Silla",
    format: true,
  },
  { value: 5, suffix: "+ M", label: "Habitantes en la zona metropolitana" },
];

export const marqueeWords = [
  "Дружба",
  "Amistad",
  "Monterrey",
  "Москва",
  "Nuevo León",
  "Санкт-Петербург",
  "Cerro de la Silla",
  "Байкал",
  "Puente",
  "Мост",
];
