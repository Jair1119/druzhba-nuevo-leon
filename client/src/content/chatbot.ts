/* Cerebro de Beto: responde sin servidor, con una base de conocimiento propia
   y buscando en todo el contenido del sitio. */
import { scienceAreas } from "./ciencia";
import { faqs, history, holidays, resources } from "./recursos";
import { articles, phrases, rhymes } from "./site";

export type BotLink = { label: string; href: string };
export type BotAnswer = { text: string; links?: BotLink[]; suggestions?: string[] };

export const starterSuggestions = [
  "¿Qué es Druzhba?",
  "Becas para estudiar en Rusia",
  "¿Qué hora es en Moscú?",
  "¿Cómo se dice gracias en ruso?",
  "Comida típica de Nuevo León",
  "¿Qué une a México y Rusia?",
];

/* ---------------- utilidades ---------------- */

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9а-яё\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set(
  "a al algo algun alguna como con cual cuales cuando de del donde el ella en era es esa ese eso esta este esto fue ha hay la las le les lo los mas me mi mis muy no nos o para pero por que quien se ser si sin sobre son su sus te tiene tu un una uno y ya yo dime sabes puedes quiero saber cuentame explica explicame hola beto favor".split(
    " ",
  ),
);
const tokens = (s: string) => norm(s).split(" ").filter(t => t.length > 1 && !STOP.has(t));

const clock = (tz: string) =>
  new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date());

/* ---------------- diccionario español → ruso ---------------- */

const dictionary: Record<string, [string, string]> = {
  hola: ["Привет / Здравствуйте", "pri-VIET (informal) · ZDRÁST-vui-tie (formal)"],
  gracias: ["Спасибо", "spa-SÍ-ba"],
  "muchas gracias": ["Большое спасибо", "bal-SHÓ-ie spa-SÍ-ba"],
  "por favor": ["Пожалуйста", "pa-ZHÁ-lus-ta"],
  "de nada": ["Пожалуйста", "pa-ZHÁ-lus-ta"],
  adios: ["До свидания", "da svi-DÁ-ni-ya"],
  "hasta luego": ["До свидания / Пока", "da svi-DÁ-ni-ya · pa-KÁ"],
  "buenos dias": ["Доброе утро", "DÓ-bra-ie Ú-tra"],
  "buenas tardes": ["Добрый день", "DÓ-bryi dien"],
  "buenas noches": ["Спокойной ночи", "spa-KÓI-noi NÓ-chi"],
  "me llamo": ["Меня зовут…", "mi-NIÁ za-VUT"],
  "como estas": ["Как дела?", "kak di-LÁ"],
  amigo: ["Друг", "druk"],
  amiga: ["Подруга", "pa-DRU-ga"],
  amistad: ["Дружба", "DRUZH-ba"],
  si: ["Да", "da"],
  no: ["Нет", "niet"],
  perdon: ["Извините", "iz-vi-NÍ-tie"],
  "te quiero": ["Я тебя люблю", "ya ti-BIÁ liu-BLIÚ"],
  "cuanto cuesta": ["Сколько стоит?", "SKÓL-ka STÓ-it"],
  agua: ["Вода", "va-DÁ"],
  bienvenido: ["Добро пожаловать", "da-BRÓ pa-ZHÁ-la-vat"],
  salud: ["За здоровье!", "za zda-RÓ-vie"],
  mexico: ["Мексика", "MIÉK-si-ka"],
  rusia: ["Россия", "ra-SÍ-ya"],
  monterrey: ["Монтеррей", "man-te-RÉI"],
  "nuevo leon": ["Нуэво-Леон", "nu-É-va le-ÓN"],
  te: ["Чай", "chai"],
  cafe: ["Кофе", "KÓ-fie"],
  pan: ["Хлеб", "jliep"],
  familia: ["Семья", "sim-YÁ"],
  casa: ["Дом", "dom"],
  libro: ["Книга", "KNÍ-ga"],
  invierno: ["Зима", "zi-MÁ"],
  sol: ["Солнце", "SÓN-tse"],
};

function translate(q: string): BotAnswer | null {
  const n = norm(q);
  const m =
    n.match(/como (?:se )?dice[n]? (.+?) en ruso/) ||
    n.match(/(?:traduce|traducir|traduccion de) (.+?)(?: al ruso| en ruso|$)/) ||
    n.match(/(.+?) en ruso$/);
  if (!m) return null;
  const word = m[1].replace(/^(la palabra|el|la|los|las|un|una) /, "").trim();
  const hit = dictionary[word];
  if (hit) {
    return {
      text: `«${word}» en ruso se dice ${hit[0]}. Se pronuncia más o menos: ${hit[1]}.`,
      suggestions: ["¿Cómo se dice amistad en ruso?", "Frases básicas en ruso", "¿Cuántas letras tiene el alfabeto ruso?"],
    };
  }
  return {
    text: `Todavía no tengo «${word}» en mi diccionario. Conozco palabras como hola, gracias, amigo, amistad, perdón, buenos días o «¿cuánto cuesta?». Para más, te recomiendo los cursos gratuitos del Instituto Pushkin.`,
    links: [{ label: "Cursos de ruso gratis", href: "#cursos" }],
  };
}

/* ---------------- base de conocimiento ---------------- */

type Entry = { keys: string[]; answer: BotAnswer | (() => BotAnswer) };

const GENERIC = new Set(["rusia", "rusa", "ruso", "nuevo leon", "monterrey", "mexico", "regia"]);

const DIRECTORY = `${import.meta.env.BASE_URL}recursos.html`;

const kb: Entry[] = [
  {
    keys: ["directorio", "recursos", "fuentes", "fuentes de informacion", "noticias", "medios", "periodicos", "informacion confiable", "educacion gratuita", "universidades abiertas", "cursos gratis"],
    answer: {
      text: "En el Directorio Druzhba reunimos y verificamos educación gratuita de instituciones rusas (becas, cursos de ruso, clases de la Universidad de Moscú, Stepik, bibliotecas, museos) y fuentes de información: la Embajada de Rusia en México, la Academia de Ciencias, la Sociedad Geográfica y varios medios de noticias, indicando quién los financia para que compares con criterio.",
      links: [
        { label: "Abrir el directorio", href: DIRECTORY },
        { label: "Fuentes de información", href: `${DIRECTORY}#informacion` },
      ],
    },
  },
  {
    keys: ["hola", "buenas", "quiubo", "que onda", "saludos", "hey", "privet", "привет"],
    answer: {
      text: "¡Quiubo! Soy Beto, regio de corazón y un poquito ruso de sombrero. Pregúntame de Rusia, de Nuevo León o de lo que nos une. 🇲🇽🤝🇷🇺",
      suggestions: starterSuggestions.slice(0, 4),
    },
  },
  {
    keys: ["gracias", "spasibo", "спасибо", "muy amable", "excelente", "chido"],
    answer: { text: "¡De nada! Bueno, en ruso: Пожалуйста (pa-ZHÁ-lus-ta). ¿Algo más que quieras saber?" },
  },
  {
    keys: ["quien eres", "como te llamas", "tu nombre", "que eres", "eres un robot", "eres ia"],
    answer: {
      text: "Me llamo Beto. Soy el asistente de Druzhba Nuevo León: regio de pura cepa, con mi cotona de gamuza y mi texana… aunque cuando hace frío me pongo la ushanka rusa. Respondo con lo que sé de Rusia, Nuevo León y este proyecto, sin necesidad de internet extra.",
    },
  },
  {
    keys: ["druzhba", "que es druzhba", "este proyecto", "centro cultural", "que significa druzhba", "significado"],
    answer: {
      text: "Druzhba (Дружба, se pronuncia DRUZH-ba) significa «amistad». Druzhba Nuevo León es un centro cultural ruso virtual nacido en Monterrey: una comunidad independiente, sin afiliación gubernamental, para conocer la ciencia, el idioma y la cultura de Rusia y tender puentes con Nuevo León.",
      links: [
        { label: "Quiénes somos", href: "#nosotros" },
        { label: "Únete a la comunidad", href: "#comunidad" },
      ],
    },
  },
  {
    keys: ["unirme", "registrarme", "registro", "participar", "inscribirme", "comunidad", "como me uno"],
    answer: {
      text: "¡Qué bueno! Llena el formulario «Únete a la comunidad» con tu nombre, correo, ciudad e intereses. No cuesta nada y no necesitas saber ruso; te escribiremos cuando haya actividades.",
      links: [{ label: "Ir al formulario", href: "#comunidad" }],
    },
  },
  {
    keys: ["contacto", "contactar", "correo", "escribirles", "hablar con alguien", "colaborar", "voluntario", "voluntariado"],
    answer: {
      text: "Puedes escribirnos desde el formulario de contacto: elige el asunto (colaborar, alianzas, propuesta de actividad o pregunta general) y te respondemos a tu correo. También buscamos voluntarios para traducción, diseño, redes y contenido.",
      links: [
        { label: "Contacto", href: "#contacto" },
        { label: "Apoya el proyecto", href: "#apoya" },
      ],
    },
  },
  {
    keys: ["sede", "donde estan", "ubicacion", "oficina", "fisica", "presencial", "direccion"],
    answer: {
      text: "Por ahora Druzhba es un centro virtual, abierto a todo México, con base en Monterrey. La meta es abrir una casa física en Monterrey para leer, cocinar, estudiar y celebrar juntos.",
    },
  },
  {
    keys: ["gobierno", "afiliado", "politica", "embajada druzhba", "oficial"],
    answer: {
      text: "Druzhba Nuevo León es un proyecto cultural independiente, sin afiliación gubernamental. Hablamos de cultura, ciencia e idioma; los enlaces a becas y cursos son solo informativos.",
    },
  },
  {
    keys: ["beca", "becas", "estudiar en rusia", "universidad en rusia", "estudiar gratis", "cuota", "open doors", "licenciatura", "maestria", "doctorado"],
    answer: {
      text: "Hay dos caminos gratuitos muy conocidos: 1) las becas del Gobierno de Rusia (cuota): colegiatura cubierta y apoyo mensual para licenciatura, maestría y doctorado; 2) Open Doors, un concurso en línea de 24 universidades (en 2026 el registro fue del 20 de agosto al 1 de noviembre). Postularse es gratis: desconfía de agencias que cobren o «garanticen» lugares. Las fechas cambian cada año.",
      links: [
        { label: "Becas del Gobierno de Rusia", href: "https://education-in-russia.com/" },
        { label: "Open Doors", href: "https://od.globaluni.ru/" },
        { label: "Estudiar en Rusia (español)", href: "https://studyinrussia.ru/es/" },
        { label: "Directorio completo", href: DIRECTORY },
      ],
      suggestions: ["Cursos de ruso gratis", "¿Necesito visa para Rusia?"],
    },
  },
  {
    keys: ["curso", "cursos", "aprender ruso", "clases de ruso", "estudiar ruso", "pushkin", "gratis", "en linea"],
    answer: {
      text: "Para aprender ruso gratis o con registro: el portal del Instituto Pushkin (prueba de nivel y cursos A1–C2, con interfaz en español); clases universitarias en Educación Abierta y Lektorium; y cine con subtítulos en el canal oficial de Mosfilm. Abajo en la página tienes la lista completa con filtros.",
      links: [
        { label: "Instituto Pushkin", href: "https://pushkininstitute.ru/" },
        { label: "Directorio de cursos gratis", href: `${DIRECTORY}#idioma` },
      ],
      suggestions: ["Frases básicas en ruso", "¿Cuántas letras tiene el alfabeto ruso?"],
    },
  },
  {
    keys: ["alfabeto", "cirilico", "letras", "abecedario", "cuantas letras"],
    answer: {
      text: "El alfabeto ruso (cirílico) tiene 33 letras. Algunas se parecen al nuestro (А, К, М, О, Т), otras engañan (Р suena «r», В suena «v», Н suena «n») y otras son nuevas (Ж «zh», Ш «sh», Щ «shch», Ы). En la sección «Aprende ruso» puedes tocar cada letra para escucharla.",
      links: [{ label: "Aprende ruso", href: "#aprende" }],
    },
  },
  {
    keys: ["frases", "frases basicas", "palabras en ruso", "saludar en ruso", "vocabulario"],
    answer: () => ({
      text:
        "Frases para empezar:\n" +
        phrases.map(([cyr, es, pron]) => `• ${cyr} — ${es} (${pron})`).join("\n") +
        "\nTip: la «О» sin acento suena casi como «a».",
      links: [{ label: "Escúchalas en la página", href: "#aprende" }],
    }),
  },
  {
    keys: ["hora", "que hora", "horario", "diferencia horaria", "hora en moscu", "huso"],
    answer: () => ({
      text: `Ahora mismo son las ${clock("America/Monterrey")} en Monterrey y las ${clock("Europe/Moscow")} en Moscú. Moscú va 9 horas adelante: cuando aquí es mediodía, allá ya están cenando.`,
      suggestions: ["¿Qué tan lejos está Moscú?", "¿Cuántos husos horarios tiene Rusia?"],
    }),
  },
  {
    keys: ["distancia", "lejos", "kilometros", "km", "cuanto mide el viaje", "vuelo", "vuelos", "volar", "avion"],
    answer: {
      text: "Monterrey y Moscú están a unos 10,123 km en línea recta. No hay vuelos directos: normalmente se viaja con una o dos escalas. Revisa las rutas vigentes con las aerolíneas, porque cambian con frecuencia.",
    },
  },
  {
    keys: ["visa", "pasaporte", "requisitos para viajar", "viajar a rusia", "turismo en rusia"],
    answer: {
      text: "Los requisitos de visa para viajar a Rusia cambian con el tiempo, así que no quiero darte un dato viejo: consulta directamente a la Embajada de Rusia en México antes de comprar boletos. Si vas a estudiar con beca, la universidad te orienta con la visa de estudiante.",
    },
  },
  {
    keys: ["rusia", "datos de rusia", "pais mas grande", "tamano de rusia", "superficie", "capital de rusia", "moneda", "rublo", "husos horarios"],
    answer: {
      text: "Rusia es el país más grande del mundo: unos 17.1 millones de km², con 11 husos horarios. Su capital es Moscú, su moneda el rublo (₽) y su idioma oficial el ruso. Va de Europa del Este hasta el océano Pacífico.",
      suggestions: ["Datos curiosos de Rusia", "¿Qué es el Transiberiano?", "Lago Baikal"],
    },
  },
  {
    keys: ["moscu", "kremlin", "plaza roja", "san basilio", "metro de moscu", "moskva"],
    answer: {
      text: "Moscú es la capital de Rusia. En su corazón están el Kremlin y la Plaza Roja con la catedral de San Basilio y sus cúpulas de colores. Su metro, abierto en 1935, es famoso porque muchas estaciones parecen palacios. En la portada lo ves volando sobre el Puente Zhivopisny, con Moscow City al fondo.",
    },
  },
  {
    keys: ["san petersburgo", "petersburgo", "hermitage", "neva", "noches blancas", "pedro el grande"],
    answer: {
      text: "San Petersburgo fue fundada en 1703 por Pedro el Grande y fue capital del Imperio ruso. Tiene el Museo del Hermitage, en el Palacio de Invierno, puentes levadizos sobre el río Nevá y las «noches blancas» de junio, cuando casi no oscurece.",
      links: [{ label: "Visita virtual al Hermitage", href: "https://www.hermitagemuseum.org/wps/portal/hermitage/panorama/?lng=en" }],
    },
  },
  {
    keys: ["baikal", "lago", "siberia"],
    answer: {
      text: "El lago Baikal, en Siberia, es el lago más profundo del mundo (alrededor de 1,640 m) y uno de los más antiguos. Guarda cerca de una quinta parte del agua dulce superficial no congelada del planeta. En invierno se congela y su hielo es tan transparente que parece vidrio. En la página lo comparamos con La Huasteca.",
      links: [{ label: "Paisajes que riman", href: "#rimas" }],
    },
  },
  {
    keys: ["transiberiano", "tren", "ferrocarril", "vladivostok"],
    answer: {
      text: "El Transiberiano une Moscú con Vladivostok, en el Pacífico: unos 9,289 km, la línea de ferrocarril más larga del mundo. El viaje completo dura alrededor de una semana y cruza 7 husos horarios.",
    },
  },
  {
    keys: ["datos curiosos", "curiosidades", "dato curioso", "sabias que", "fun fact"],
    answer: {
      text: "Algunos datos curiosos: Rusia tiene 11 husos horarios; el Elbrús (5,642 m) es la montaña más alta de Europa; el Volga es el río más largo de Europa; y la «ensalada rusa» que se come en México viene de la ensalada Olivier, creada en Moscú en el siglo XIX por el chef Lucien Olivier. 🥗",
      suggestions: ["Comida rusa", "¿Qué une a México y Rusia?"],
    },
  },
  {
    keys: ["comida", "platillos", "rusia", "rusa", "comida tipica de rusia", "comida rusa", "platillos rusos", "borsch", "borscht", "pelmeni", "blini", "blinis", "pirozhki", "gastronomia rusa", "ensalada rusa", "olivier"],
    answer: {
      text: "Platillos rusos para empezar: borsch (sopa de betabel con crema agria), pelmeni (pequeñas empanaditas hervidas rellenas de carne), blinis (crepas delgadas, estrellas de la Maslenitsa), pirozhki (panecitos rellenos) y la ensalada Olivier, abuela de nuestra «ensalada rusa». Para tomar: té con mermelada o kvas.",
      suggestions: ["Comida típica de Nuevo León", "¿Qué es la Maslenitsa?"],
    },
  },
  {
    keys: ["nuevo leon", "datos de nuevo leon", "neoleones", "estado de nuevo leon"],
    answer: {
      text: "Nuevo León está en el noreste de México y su capital es Monterrey. Su zona metropolitana supera los 5 millones de habitantes. Es un estado industrial y universitario, rodeado por la Sierra Madre Oriental: cerros, cañones y cascadas a minutos de la ciudad.",
      suggestions: ["Lugares para visitar en Nuevo León", "Comida típica de Nuevo León", "Historia de Monterrey"],
    },
  },
  {
    keys: ["monterrey", "historia de monterrey", "fundacion", "fundada", "sultana del norte", "regio", "regios", "regiomontano"],
    answer: {
      text: "Monterrey fue fundada el 20 de septiembre de 1596 por Diego de Montemayor. A sus habitantes se les dice regiomontanos (o «regios», de cariño); a los del estado, neoleoneses. Le dicen «la Sultana del Norte» y su símbolo es el Cerro de la Silla.",
    },
  },
  {
    keys: ["cerro de la silla", "silla", "cerro"],
    answer: {
      text: "El Cerro de la Silla es el símbolo de Monterrey: su silueta de montura se ve desde casi toda la ciudad y alcanza unos 1,820 m sobre el nivel del mar. Es Monumento Natural y tiene senderos muy populares.",
    },
  },
  {
    keys: ["fundidora", "acero", "parque fundidora", "horno 3", "industria"],
    answer: {
      text: "La Fundidora de Fierro y Acero de Monterrey abrió en 1900 y fue la primera siderúrgica de América Latina. Cerró en 1986 y hoy es el Parque Fundidora, con el Museo del Acero Horno 3. En la página lo emparejamos con el Kremlin: patrimonio que se ilumina.",
    },
  },
  {
    keys: ["lugares", "visitar", "turismo", "que hacer en nuevo leon", "paseo", "huasteca", "cola de caballo", "grutas", "chipinque", "santa lucia", "macroplaza"],
    answer: {
      text: "Imperdibles de Nuevo León: la Macroplaza y el Paseo Santa Lucía en el centro de Monterrey, el Parque Fundidora, el Cerro de la Silla, Chipinque, La Huasteca (Santa Catarina), la cascada Cola de Caballo (Santiago) y las Grutas de García.",
      links: [{ label: "Nuevo León ⟷ Rusia", href: "#rimas" }],
    },
  },
  {
    keys: ["comida", "platillos", "nuevo leon", "monterrey", "regia", "comida regia", "comida de nuevo leon", "comida tipica", "cabrito", "machacado", "carne asada", "glorias", "frijoles charros", "gastronomia"],
    answer: {
      text: "La cocina regia es de carne y fuego: cabrito al pastor, carne asada los fines de semana, machacado con huevo en el desayuno, frijoles charros, tortillas de harina y, de postre, glorias de Linares. 🔥",
      suggestions: ["Comida rusa", "Datos curiosos de Rusia"],
    },
  },
  {
    keys: ["traje", "vestimenta", "ropa tipica", "sombrero", "texana", "cotona", "atuendo", "ushanka"],
    answer: {
      text: "Mi atuendo es norteño: sombrero texano, camisa, cotona o chaleco de gamuza con flecos, paliacate, cinto pitiado y botas. La ushanka es el gorro ruso de piel con orejeras: «ushi» significa orejas. ¡Para el frío de Moscú no hay texana que aguante!",
    },
  },
  {
    keys: ["musica", "norteña", "polka", "acordeon", "chaikovski", "tchaikovsky", "rajmaninov", "ballet", "bolshoi"],
    answer: {
      text: "La música norteña de Nuevo León (acordeón y bajo sexto, con polkas, redovas y chotis) tiene raíces en las polkas que trajeron inmigrantes de Europa central. Rusia, por su parte, es tierra de Chaikovski (El lago de los cisnes, El cascanueces), Rajmáninov, Shostakóvich y del ballet Bolshói. Y en 1919 Anna Pávlova bailó el jarabe tapatío en México. 💃",
      links: [{ label: "Puentes en la historia", href: "#historia" }],
    },
  },
  {
    keys: ["mexico y rusia", "une a mexico", "relacion", "relaciones", "conexion", "conexiones", "historia mexico rusia", "puente"],
    answer: () => ({
      text:
        "México y Rusia tienen relación oficial desde el 11 de diciembre de 1890. Algunos encuentros:\n" +
        history
          .filter(h => h.tag !== "hoy")
          .map(h => `• ${h.year}: ${h.title}`)
          .join("\n"),
      links: [{ label: "Ver la línea de tiempo", href: "#historia" }],
    }),
  },
  {
    keys: ["fiestas", "festividades", "celebraciones", "calendario", "navidad rusa", "ano nuevo ruso", "maslenitsa", "dia de la cosmonautica"],
    answer: () => ({
      text:
        "Fiestas rusas y su rima mexicana:\n" + holidays.map(h => `• ${h.date} · ${h.es} (${h.ru}): ${h.mx}`).join("\n"),
      links: [{ label: "Calendario que rima", href: "#calendario" }],
    }),
  },
  {
    keys: ["literatura", "libros", "leer", "pushkin escritor", "dostoievski", "tolstoi", "chejov", "autor"],
    answer: {
      text: "Para empezar con la literatura rusa: los cuentos de Pushkin y de Chéjov, «El capote» de Gógol, «La muerte de Iván Ilich» de Tolstói, «Crimen y castigo» de Dostoievski y «El maestro y Margarita» de Bulgákov. En la sección de cultura tienes un artículo sobre Pushkin.",
      links: [{ label: "Cultura rusa", href: "#cultura" }],
    },
  },
  {
    keys: ["cine", "peliculas", "mosfilm", "tarkovski", "eisenstein"],
    answer: {
      text: "Mosfilm, el gran estudio de cine ruso, tiene un canal oficial con más de 1,000 películas soviéticas y rusas con subtítulos. Dato regio-ruso: Serguéi Eisenstein filmó «¡Que viva México!» en nuestro país entre 1930 y 1932.",
      links: [{ label: "Canal de Mosfilm", href: "https://www.youtube.com/@Mosfilm_eng" }],
    },
  },
  {
    keys: ["espacio", "gagarin", "sputnik", "cosmonauta", "astronauta", "neri vela", "tereshkova"],
    answer: {
      text: "En 1957 la URSS lanzó el Sputnik, el primer satélite artificial, y el 12 de abril de 1961 Yuri Gagarin fue el primer ser humano en el espacio. Su eco mexicano: Rodolfo Neri Vela fue el primer mexicano en viajar al espacio, en 1985.",
      links: [{ label: "Ciencia y tecnología", href: "#ciencia" }],
    },
  },
  {
    keys: ["clima", "frio", "calor", "temperatura", "nieve", "invierno"],
    answer: {
      text: "Contrastes totales: Monterrey tiene veranos muy calurosos (con frecuencia arriba de 35 °C) e inviernos suaves. En Moscú el invierno es largo, con nieve y temperaturas bajo cero, y el verano es templado, alrededor de 20–25 °C. Por eso la ushanka. 🥶",
    },
  },
  {
    keys: ["matrioshka", "matrioska", "muñeca rusa", "artesania", "gzhel"],
    answer: {
      text: "La matrioshka es la muñeca de madera que guarda otras más pequeñas dentro; nació a finales del siglo XIX. Otra artesanía famosa es Gzhel, la cerámica blanca pintada con azul cobalto, prima lejana de nuestra talavera.",
      links: [{ label: "Artículo sobre Gzhel", href: "#cultura" }],
    },
  },
  {
    keys: ["universidades de nuevo leon", "tec de monterrey", "tec", "uanl", "universidad"],
    answer: {
      text: "Nuevo León es un polo universitario: la UANL (Universidad Autónoma de Nuevo León) y el Tecnológico de Monterrey, fundado en 1943, entre muchas otras. Si te interesa estudiar en Rusia, pregúntame por becas.",
      suggestions: ["Becas para estudiar en Rusia"],
    },
  },
  {
    keys: ["divide", "division", "divisiones", "estados", "regiones", "provincias", "oblast", "oblasts", "republicas", "krai", "sujetos federales", "organizacion territorial", "federacion"],
    answer: {
      text: "Rusia no se divide en «estados» como México, sino en «sujetos federales» de varios tipos:\n• Repúblicas (como Tartaristán o Sajá-Yakutia), con idioma y constitución propios.\n• Óblasts (provincias) y krais (territorios), como el óblast de Moscú o el krai de Krasnodar.\n• Ciudades federales: Moscú y San Petersburgo.\n• Distritos autónomos y un óblast autónomo.\nInternacionalmente se reconocen 83. Rusia cuenta además territorios que incorporó desde 2014 y que la mayoría de los países, incluido México en la ONU, no reconoce.\nPara comparar: México tiene 32 entidades federativas y Nuevo León 51 municipios.",
      suggestions: ["¿Cuál es la región más grande de Rusia?", "Ciudades más grandes de Rusia", "Datos de Nuevo León"],
    },
  },
  {
    keys: ["region mas grande", "yakutia", "saja", "tartaristan", "kazan", "chechenia", "daguestan"],
    answer: {
      text: "La región más grande de Rusia es la República de Sajá (Yakutia), en Siberia: unos 3.1 millones de km², más grande que Argentina, con apenas un millón de habitantes. Ahí está Oymyakón, uno de los lugares habitados más fríos del planeta (−67 °C). Otra república famosa es Tartaristán, con capital en Kazán, donde conviven la cultura rusa y la tártara musulmana.",
      suggestions: ["¿Cómo se divide Rusia?", "Clima en Rusia"],
    },
  },
  {
    keys: ["ciudades", "ciudades grandes", "ciudades mas grandes", "ciudades principales", "novosibirsk", "ekaterimburgo", "nizhni", "sochi"],
    answer: {
      text: "Las ciudades más grandes de Rusia: Moscú (~13 millones), San Petersburgo (~5.6 M), Novosibirsk, Ekaterimburgo, Kazán y Nizhni Nóvgorod (más de 1 M cada una). Ekaterimburgo y Cheliábinsk, en los Urales, son ciudades industriales y metalúrgicas: las «Monterreys» de Rusia.",
      suggestions: ["¿Qué tiene Moscú?", "San Petersburgo", "¿Cómo se divide Rusia?"],
    },
  },
  {
    keys: ["poblacion", "habitantes", "cuantas personas", "cuanta gente", "cuantos viven"],
    answer: {
      text: "Rusia tiene unos 146 millones de habitantes, poco más que México (~130 millones), pero en un territorio casi 9 veces mayor; la mayoría vive en la parte europea, al oeste de los Urales. Nuevo León tiene unos 5.8 millones de habitantes y la zona metropolitana de Monterrey más de 5 millones.",
      suggestions: ["Ciudades más grandes de Rusia", "Datos de Nuevo León"],
    },
  },
  {
    keys: ["municipios", "municipios de nuevo leon", "san pedro", "apodaca", "guadalupe", "escobedo", "santa catarina", "san nicolas"],
    answer: {
      text: "Nuevo León tiene 51 municipios. La zona metropolitana de Monterrey incluye, entre otros, Monterrey, Guadalupe, Apodaca, San Nicolás de los Garza, General Escobedo, Santa Catarina, San Pedro Garza García, Juárez, García y Santiago.",
      suggestions: ["Lugares para visitar en Nuevo León", "Historia de Monterrey"],
    },
  },
  {
    keys: ["idioma", "dificil", "es dificil", "cuanto tiempo", "tardo", "aprender rapido", "gramatica", "casos"],
    answer: {
      text: "El ruso tiene fama de difícil, pero para un hispanohablante la pronunciación es bastante amigable: las vocales se parecen mucho a las nuestras y la «r» es vibrante como en español. Lo más retador son los 6 casos gramaticales. Con 20–30 minutos diarios:\n• En 1–2 semanas lees cirílico.\n• En 3–6 meses tienes conversaciones básicas (nivel A2).\nEmpieza por el alfabeto de esta página y sigue con un curso gratuito.",
      links: [{ label: "Alfabeto interactivo", href: "#aprende" }, { label: "Ruta gratuita", href: "#ruta" }],
      suggestions: ["Cursos de ruso gratis", "Frases básicas en ruso"],
    },
  },
  {
    keys: ["deporte", "deportes", "hockey", "ajedrez", "futbol", "rayados", "tigres", "olimpicos", "gimnasia"],
    answer: {
      text: "Rusia es potencia en hockey sobre hielo, ajedrez (Kaspárov, Kárpov), gimnasia y patinaje artístico. El futbol también se vive: en el Mundial 2018, celebrado en Rusia, México le ganó 1-0 a Alemania en Moscú. En Nuevo León el futbol es religión, con el Clásico Regio entre Rayados y Tigres. 🏒⚽",
      suggestions: ["Datos curiosos", "¿Qué une a México y Rusia?"],
    },
  },
  {
    keys: ["historia de rusia", "zar", "zares", "imperio ruso", "urss", "union sovietica", "sovietica", "revolucion", "1917", "1991"],
    answer: {
      text: "En breve:\n• La Rus de Kiev (siglo IX) fue el primer Estado eslavo oriental.\n• Moscú se convirtió en centro del poder y en 1547 Iván IV se coronó zar.\n• Pedro el Grande fundó San Petersburgo en 1703 y abrió Rusia a Europa.\n• La Revolución de 1917 terminó con el zarismo y dio paso a la Unión Soviética (1922–1991).\n• Desde 1991 existe la Federación de Rusia.",
      links: [{ label: "Línea del tiempo México–Rusia", href: "#historia" }],
      suggestions: ["¿Cuándo empezaron las relaciones México–Rusia?", "Literatura rusa"],
    },
  },
  {
    keys: ["religion", "ortodoxa", "iglesia", "iglesias", "cupulas"],
    answer: {
      text: "La religión mayoritaria en Rusia es el cristianismo ortodoxo; por eso sus iglesias tienen cúpulas en forma de bulbo, muchas doradas. También hay grandes comunidades musulmanas (Tartaristán, el Cáucaso), budistas (Buriatia, Kalmukia) y judías. La Navidad ortodoxa se celebra el 7 de enero.",
      suggestions: ["Fiestas rusas", "¿Qué tiene Moscú?"],
    },
  },
];

/* ---------------- búsqueda en el contenido del sitio ---------------- */

type Doc = { text: string; href: string; tokens: Set<string> };
const docs: Doc[] = [];
const addDoc = (text: string, href: string) => docs.push({ text, href, tokens: new Set(tokens(text)) });

scienceAreas.forEach(a => {
  a.milestones.forEach(m => addDoc(`${m.year} · ${m.title}: ${m.text}`, "#ciencia"));
  addDoc(`${a.article.title}. ${a.article.body[0]}`, "#ciencia");
});
history.forEach(h => addDoc(`${h.year} · ${h.title}: ${h.text}`, "#historia"));
holidays.forEach(h => addDoc(`${h.date} · ${h.es} (${h.ru}): ${h.text} En México: ${h.mx}`, "#calendario"));
rhymes.forEach(r => addDoc(`${r.theme}: ${r.nl.name} (${r.nl.place}) y ${r.ru.name} (${r.ru.place}).`, "#rimas"));
resources.forEach(r => addDoc(`${r.title}${r.original ? ` (${r.original})` : ""}: ${r.description}${r.note ? ` ${r.note}` : ""}`, "#cursos"));
articles.forEach(a => addDoc(`${a.title}. ${a.summary} ${a.body[0]}`, "#cultura"));
faqs.forEach(f => addDoc(`${f.q} ${f.a}`, "#preguntas"));

const matches = (qt: string, set: Set<string>) => {
  if (set.has(qt)) return true;
  if (qt.length < 5) return false;
  const stem = qt.slice(0, Math.max(5, qt.length - 2));
  for (const t of set) if (t.startsWith(stem)) return true;
  return false;
};

function searchSite(q: string): BotAnswer | null {
  const qt = tokens(q);
  if (!qt.length) return null;
  let best: { d: Doc; s: number } | null = null;
  for (const d of docs) {
    let s = 0;
    let hits = 0;
    for (const t of qt) if (matches(t, d.tokens)) { s += t.length >= 6 ? 2 : 1; hits++; }
    if (hits < Math.min(2, qt.length)) continue;
    if (!best || s > best.s) best = { d, s };
  }
  if (!best || best.s < 3) return null;
  return {
    text: `No tengo una respuesta exacta, pero esto de la página puede servirte:\n${best.d.text}`,
    links: [{ label: "Ver en la página", href: best.d.href }],
  };
}

/* ---------------- motor principal ---------------- */

function scoreKb(q: string) {
  const n = ` ${norm(q)} `;
  const qt = new Set(tokens(q));
  let best: { e: Entry; s: number } | null = null;
  for (const e of kb) {
    let s = 0;
    for (const k of e.keys) {
      const nk = norm(k);
      // Los nombres de lugar pesan poco: el tema de la pregunta manda.
      if (GENERIC.has(nk)) {
        if (n.includes(` ${nk} `)) s += 1.5;
        continue;
      }
      if (nk.includes(" ")) {
        if (n.includes(` ${nk} `)) s += 3 + nk.split(" ").length;
      } else if (qt.has(nk) || n.includes(` ${nk} `)) s += nk.length >= 5 ? 3 : 2;
      else if (nk.length >= 6 && [...qt].some(t => t.startsWith(nk.slice(0, nk.length - 1)))) s += 2;
    }
    if (!best || s > best.s) best = { e, s };
  }
  return best;
}

const resolve = (e: Entry) => (typeof e.answer === "function" ? e.answer() : e.answer);

// Memoria corta: el tema anterior ayuda con preguntas de seguimiento («¿y su capital?», «¿se divide en estados?»).
let lastTopic = "";

export function answer(question: string): BotAnswer {
  const q = question.trim();
  if (!q) return { text: "¿Qué te gustaría saber?", suggestions: starterSuggestions };

  const tr = translate(q);
  if (tr) return tr;

  const best = scoreKb(q);
  if (best && best.s >= 3) {
    lastTopic = q;
    return resolve(best.e);
  }

  // Pregunta corta y ambigua: se interpreta junto con el tema anterior.
  const followUp = /^(y|e|entonces|ahi|alla|ok|oye)\b|\b(tiene|tienen|su|sus|ahi|alla|ese|esa|eso|estados|capital)\b/.test(norm(q));
  if (lastTopic && tokens(q).length <= 5 && (followUp || (best?.s ?? 0) > 0)) {
    const ctx = scoreKb(`${lastTopic} ${q}`);
    if (ctx && ctx.s > (best?.s ?? 0) + 1.5) return resolve(ctx.e);
  }

  if (best && best.s >= 1.5) {
    lastTopic = q;
    return resolve(best.e);
  }

  const site = searchSite(q);
  if (site) return site;

  return {
    text: "Mmm, esa todavía no me la sé. 🤔 Puedo contarte de geografía e historia de Rusia, el idioma ruso, becas y cursos gratuitos, Nuevo León y lo que une a ambos. ¿Probamos con alguna de estas?",
    links: [{ label: "Escribir al equipo", href: "#contacto" }],
    suggestions: ["¿Cómo se divide Rusia?", "¿Es difícil aprender ruso?", "Becas para estudiar en Rusia", "Lugares para visitar en Nuevo León"],
  };
}
