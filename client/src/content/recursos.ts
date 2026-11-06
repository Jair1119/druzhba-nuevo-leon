/* Recursos, historia y calendario. Enlaces y datos verificados en noviembre de 2026. */

export type ResourceCategory = "becas" | "idioma" | "universidades" | "cultura" | "informacion";

export type Resource = {
  id: string;
  category: ResourceCategory;
  title: string;
  original?: string;
  org: string;
  description: string;
  note?: string;
  url: string;
  access: "Gratis" | "Materiales gratis" | "Con registro" | "Mixto" | "Acceso libre";
  /** Se muestra en la sección principal además del directorio. */
  featured?: boolean;
  language: string;
  level?: string;
};

export const resourceCategories: { id: ResourceCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todo" },
  { id: "becas", label: "Becas para estudiar en Rusia" },
  { id: "idioma", label: "Idioma ruso" },
  { id: "universidades", label: "Universidades abiertas" },
  { id: "cultura", label: "Cultura en línea" },
  { id: "informacion", label: "Fuentes de información" },
];

export const resources: Resource[] = [
  {
    id: "cuota",
    featured: true,
    category: "becas",
    title: "Becas del Gobierno de Rusia (cuota)",
    org: "Sitio oficial de selección de extranjeros",
    description:
      "Cada año Rusia ofrece a estudiantes extranjeros lugares con la colegiatura cubierta y un apoyo mensual para licenciatura, maestría y doctorado en universidades rusas.",
    note: "Postularse es gratis: desconfía de agencias que cobren o «garanticen» un lugar. Las fechas cambian cada año.",
    url: "https://education-in-russia.com/",
    access: "Gratis",
    language: "Ruso · inglés",
    level: "Licenciatura a doctorado",
  },
  {
    id: "open-doors",
    featured: true,
    category: "becas",
    title: "Open Doors: Russian Scholarship Project",
    org: "Asociación Global Universities · 24 universidades",
    description:
      "Concurso 100 % en línea: quienes ganan estudian licenciatura, maestría o doctorado en Rusia con la colegiatura cubierta y un apoyo mensual. Abarca 14 áreas, entre ellas Medicina, Computación y Lengua y cultura rusas.",
    note: "En 2026 el registro abrió el 20 de agosto y cerró el 1 de noviembre.",
    url: "https://od.globaluni.ru/",
    access: "Gratis",
    language: "Inglés · ruso",
    level: "Licenciatura a posdoctorado",
  },
  {
    id: "study-in-russia",
    featured: true,
    category: "becas",
    title: "Estudiar en Rusia",
    original: "Study in Russia",
    org: "Portal para estudiantes internacionales",
    description:
      "Guía en español con universidades, programas, requisitos de admisión, becas y cursos de ruso para extranjeros.",
    url: "https://studyinrussia.ru/es/",
    access: "Gratis",
    language: "Español",
  },
  {
    id: "pushkin",
    featured: true,
    category: "idioma",
    title: "Educación en ruso",
    original: "Образование на русском",
    org: "Instituto Estatal de la Lengua Rusa A. S. Pushkin",
    description:
      "Prueba de nivel, cursos en línea de ruso del A1 al C2 y preparación para la certificación oficial, del instituto de referencia para la enseñanza del ruso como lengua extranjera.",
    url: "https://pushkininstitute.ru/",
    access: "Con registro",
    language: "Interfaz en español",
    level: "A1 – C2",
  },
  {
    id: "openedu",
    featured: true,
    category: "universidades",
    title: "Educación Abierta",
    original: "Открытое образование",
    org: "Plataforma nacional de cursos universitarios",
    description:
      "Más de 1,400 cursos en línea de la Universidad Estatal de Moscú, San Petersburgo, la Escuela Superior de Economía, MISIS, MEPhI y la Universidad Federal de los Urales, entre otras.",
    note: "Muchos cursos tienen materiales gratuitos; el certificado puede tener costo.",
    url: "https://openedu.ru/",
    access: "Materiales gratis",
    language: "Ruso",
  },
  {
    id: "lektorium",
    category: "universidades",
    title: "Lektorium",
    original: "Лекториум",
    org: "Biblioteca de cursos y clases universitarias",
    description:
      "Más de 270 cursos gratuitos y 6,000 clases grabadas con universidades como la de Novosibirsk y la ITMO. Las grabaciones académicas se financian con mecenazgo.",
    url: "https://www.lektorium.tv/",
    access: "Gratis",
    language: "Ruso",
  },
  {
    id: "mosfilm",
    featured: true,
    category: "cultura",
    title: "Mosfilm: cine clásico gratis",
    org: "Canal oficial del estudio Mosfilm",
    description:
      "Más de 1,000 películas soviéticas y rusas con subtítulos, de Tarkovski y Eisenstein a «Dersu Uzala» de Kurosawa y las comedias más queridas.",
    note: "Ver cine con subtítulos es una gran forma de entrenar el oído.",
    url: "https://www.youtube.com/@Mosfilm_eng",
    access: "Gratis",
    language: "Subtítulos en inglés",
  },
  {
    id: "hermitage",
    category: "cultura",
    title: "Visita virtual al Hermitage",
    org: "Museo Estatal del Hermitage · San Petersburgo",
    description:
      "Recorre en 360° las salas del Palacio de Invierno y del Hermitage, uno de los museos más grandes del mundo.",
    url: "https://www.hermitagemuseum.org/wps/portal/hermitage/panorama/?lng=en",
    access: "Gratis",
    language: "Inglés · ruso",
  },
  {
    id: "museo-ruso",
    category: "cultura",
    title: "Museo Ruso Virtual",
    original: "Виртуальный Русский музей",
    org: "Museo Estatal Ruso · San Petersburgo",
    description:
      "Recorridos virtuales y colección digital de uno de los mayores acervos de arte ruso: íconos, Repin, Aivazovski, Kandinsky y más.",
    url: "https://rusmuseumvrm.ru/online_resources/virtual_tours/index.php",
    access: "Gratis",
    language: "Ruso · inglés",
  },
  /* ---------- Idioma ruso ---------- */
  {
    id: "spbu-curso",
    category: "idioma",
    title: "Curso gratuito de ruso en línea",
    org: "Universidad Estatal de San Petersburgo",
    description:
      "64 lecciones para empezar a comunicarte en ruso, con versiones para hablantes de inglés, chino, turco, uzbeko y tayiko. También sirve para repasar gramática si ya entiendes algo.",
    url: "https://migrant.spbu.ru/en",
    access: "Gratis",
    language: "Explicaciones en inglés",
    level: "Principiante",
  },
  {
    id: "tpu-stepik",
    category: "idioma",
    title: "Ruso. Nivel elemental",
    original: "Русский язык. Элементарный уровень",
    org: "Universidad Politécnica de Tomsk · Stepik",
    description:
      "Curso A1 desde cero con videos, ejercicios interactivos, simuladores y diccionarios. Al terminar se obtiene un certificado de la universidad y de Stepik.",
    url: "https://stepik.org/course/89394/info",
    access: "Gratis",
    language: "Ruso",
    level: "A1",
  },
  {
    id: "corpus",
    category: "idioma",
    title: "Corpus Nacional de la Lengua Rusa",
    original: "Национальный корпус русского языка",
    org: "Herramienta lingüística de referencia",
    description:
      "Millones de textos reales para ver cómo se usa de verdad una palabra o una construcción. Ideal para niveles intermedio y avanzado, traductores y docentes.",
    url: "https://ruscorpora.ru/",
    access: "Acceso libre",
    language: "Ruso · inglés",
    level: "B1 en adelante",
  },

  /* ---------- Universidades y ciencia abiertas ---------- */
  {
    id: "teach-in",
    category: "universidades",
    title: "Teach-in: clases de la Universidad de Moscú",
    org: "Universidad Estatal de Moscú (MGU)",
    description:
      "Video clases abiertas de cursos reales de la MGU: física, matemáticas, astronomía, biología, informática, geografía, mecánica y filosofía, sin exámenes de admisión ni límite de edad.",
    url: "https://teach-in.ru/",
    access: "Gratis",
    language: "Ruso",
  },
  {
    id: "stepik",
    category: "universidades",
    title: "Stepik",
    org: "Plataforma rusa de cursos en línea",
    description:
      "Miles de cursos de programación, matemáticas, idiomas y ciencia. En el catálogo puedes filtrar solo los cursos gratuitos.",
    note: "Hay cursos gratuitos y de pago: usa el filtro «Бесплатные».",
    url: "https://stepik.org/catalog",
    access: "Materiales gratis",
    language: "Ruso · inglés",
  },
  {
    id: "intuit",
    category: "universidades",
    title: "INTUIT",
    original: "ИНТУИТ",
    org: "Universidad por internet (desde 2003)",
    description:
      "Programas de informática, matemáticas, ciencias, negocios, humanidades, idiomas y salud, con una sección de programas gratuitos.",
    note: "Estudiar los programas gratuitos no cuesta; el certificado sí tiene costo.",
    url: "https://intuit.ru/",
    access: "Materiales gratis",
    language: "Ruso",
  },
  {
    id: "postnauka",
    category: "universidades",
    title: "PostNauka",
    original: "ПостНаука",
    org: "Divulgación científica",
    description:
      "Videos, artículos y cursos de científicos sobre astronomía, biología, cerebro, química, economía, medicina, física, matemáticas y filosofía.",
    note: "Gran parte del contenido es abierto; algunos cursos requieren suscripción.",
    url: "https://postnauka.org/",
    access: "Mixto",
    language: "Ruso",
  },
  {
    id: "elementy",
    category: "universidades",
    title: "Elementy: la gran ciencia",
    original: "Элементы большой науки",
    org: "Portal de divulgación científica",
    description:
      "Noticias científicas, artículos, conferencias, libros y un problema semanal de física, biología, química, matemáticas y lingüística.",
    url: "https://elementy.ru/",
    access: "Acceso libre",
    language: "Ruso",
  },

  /* ---------- Cultura ---------- */
  {
    id: "rvb",
    category: "cultura",
    title: "Biblioteca Virtual Rusa",
    original: "Русская виртуальная библиотека",
    org: "Literatura clásica rusa en línea",
    description:
      "Ediciones cuidadas de los clásicos de la literatura rusa para leer en el idioma original.",
    url: "https://www.rvb.ru/",
    access: "Gratis",
    language: "Ruso",
  },
  {
    id: "wikisource",
    category: "cultura",
    title: "Wikisource en ruso",
    original: "Викитека",
    org: "Biblioteca libre de textos de dominio público",
    description:
      "Novelas, poesía, documentos históricos y diccionarios en ruso, libres para leer, copiar y compartir.",
    url: "https://ru.wikisource.org/",
    access: "Gratis",
    language: "Ruso",
  },
  {
    id: "arzamas",
    category: "cultura",
    title: "Arzamas",
    org: "Historia, literatura y arte",
    description:
      "Cursos, podcasts, revista y una app de radio sobre cultura rusa y universal: literatura, arte del siglo XX, teatro, cine, música y folclor.",
    note: "Parte del contenido es abierto; el acceso completo a los cursos es con suscripción.",
    url: "https://arzamas.academy/",
    access: "Mixto",
    language: "Ruso",
  },

  /* ---------- Fuentes de información ---------- */
  {
    id: "embajada",
    category: "informacion",
    title: "Embajada de Rusia en México",
    org: "Sitio oficial",
    description:
      "Información consular, visas, trámites y noticias oficiales de la embajada en la Ciudad de México. Es la fuente a consultar antes de viajar.",
    url: "https://mexico.mid.ru/",
    access: "Acceso libre",
    language: "Español · ruso",
  },
  {
    id: "ras",
    category: "informacion",
    title: "Academia Rusa de Ciencias",
    original: "Российская академия наук",
    org: "Máxima institución científica de Rusia",
    description: "Noticias científicas, institutos de investigación, premios y publicaciones oficiales de la Academia.",
    url: "https://www.ras.ru/",
    access: "Acceso libre",
    language: "Ruso · inglés",
  },
  {
    id: "rgo",
    category: "informacion",
    title: "Sociedad Geográfica Rusa",
    original: "Русское географическое общество",
    org: "Geografía, expediciones y naturaleza",
    description:
      "Artículos y reportajes sobre la geografía de Rusia, expediciones, concursos de fotografía y proyectos de conservación.",
    url: "https://www.rgo.ru/",
    access: "Acceso libre",
    language: "Ruso · inglés",
  },
  {
    id: "rbth",
    category: "informacion",
    title: "Russia Beyond en español",
    org: "Revista de cultura y vida cotidiana",
    description: "Artículos en español sobre cultura, historia, viajes, idioma y gastronomía rusa.",
    note: "Medio financiado por el Estado ruso.",
    url: "https://es.rbth.com/",
    access: "Acceso libre",
    language: "Español",
  },
  {
    id: "tass",
    category: "informacion",
    title: "TASS",
    org: "Agencia de noticias",
    description: "Noticias de Rusia y del mundo, con versión en inglés.",
    note: "Agencia de noticias estatal.",
    url: "https://tass.com/",
    access: "Acceso libre",
    language: "Inglés · ruso",
  },
  {
    id: "interfax",
    category: "informacion",
    title: "Interfax",
    org: "Agencia de noticias",
    description: "Noticias de política, economía y negocios de Rusia, con versión en inglés.",
    note: "Agencia de noticias privada.",
    url: "https://interfax.com/",
    access: "Acceso libre",
    language: "Inglés · ruso",
  },
  {
    id: "meduza",
    category: "informacion",
    title: "Meduza",
    org: "Medio de noticias",
    description: "Noticias y reportajes sobre Rusia, con edición en inglés.",
    note: "Medio independiente con sede fuera de Rusia (Letonia).",
    url: "https://meduza.io/en",
    access: "Acceso libre",
    language: "Inglés · ruso",
  },

];

/* Puentes en la historia: México ⟷ Rusia */
export type HistoryItem = { year: string; title: string; text: string; tag: "diplomacia" | "arte" | "cine" | "letras" | "deporte" | "hoy" };

export const history: HistoryItem[] = [
  {
    year: "1890",
    tag: "diplomacia",
    title: "Empieza la relación oficial",
    text: "El 11 de diciembre de 1890 el zar Alejandro III nombró al barón Román Rosen como primer representante del Imperio ruso en México.",
  },
  {
    year: "1919",
    tag: "arte",
    title: "Anna Pávlova baila el jarabe tapatío",
    text: "La gran bailarina rusa presentó en México la «Fantasía mexicana», un ballet con el jarabe tapatío como tema central, y bailó ante más de 16 mil personas en el Toreo de la Condesa.",
  },
  {
    year: "1925",
    tag: "letras",
    title: "Maiakovski descubre México",
    text: "Diego Rivera recibió al poeta Vladímir Maiakovski en la estación de tren. Sus impresiones del país quedaron en «Mi descubrimiento de América».",
  },
  {
    year: "1926",
    tag: "diplomacia",
    title: "Una mujer al frente de la legación",
    text: "Alexandra Kollontái, pionera entre las mujeres diplomáticas del mundo, encabezó la representación soviética en México entre 1926 y 1927.",
  },
  {
    year: "1927",
    tag: "arte",
    title: "Diego Rivera en Moscú",
    text: "El muralista pasó varios meses en Moscú, donde llenó cuadernos con bocetos de la ciudad y sus desfiles.",
  },
  {
    year: "1930",
    tag: "cine",
    title: "Eisenstein filma «¡Que viva México!»",
    text: "El cineasta Serguéi Eisenstein pasó unos 14 meses filmando en México. Su película quedó inconclusa y se montó hasta 1979 con el material original.",
  },
  {
    year: "2018",
    tag: "deporte",
    title: "Un gol que se sintió en Moscú",
    text: "En el Mundial de Rusia 2018, México venció 1–0 a Alemania en el estadio Luzhnikí con gol de Hirving Lozano.",
  },
  {
    year: "Hoy",
    tag: "hoy",
    title: "Druzhba Nuevo León",
    text: "Desde Monterrey, una comunidad independiente para seguir tendiendo puentes entre personas.",
  },
];

/* Calendario que rima: fiestas rusas y su eco en México */
export type Holiday = { date: string; ru: string; es: string; text: string; mx: string };

export const holidays: Holiday[] = [
  {
    date: "1 ene",
    ru: "Новый год",
    es: "Año Nuevo",
    text: "La fiesta más grande del año: Ded Moroz (el Abuelo Frío) y la Snegúrochka dejan regalos bajo el árbol.",
    mx: "Aquí los regalos llegan en Navidad y con los Reyes Magos.",
  },
  {
    date: "7 ene",
    ru: "Рождество",
    es: "Navidad ortodoxa",
    text: "La Iglesia ortodoxa rusa sigue el calendario juliano, por eso su Navidad cae el 7 de enero.",
    mx: "Un día antes, el 6 de enero, partimos la rosca de Reyes.",
  },
  {
    date: "feb – mar",
    ru: "Масленица",
    es: "Maslenitsa",
    text: "Una semana de blinis, trineos y fogatas para despedir el invierno justo antes de la Cuaresma.",
    mx: "Los carnavales de Veracruz y Mazatlán también llegan antes de la Cuaresma.",
  },
  {
    date: "12 abr",
    ru: "День космонавтики",
    es: "Día de la Cosmonáutica",
    text: "Recuerda el vuelo de Yuri Gagarin en 1961, el primer ser humano en el espacio.",
    mx: "En 1985, Rodolfo Neri Vela fue el primer mexicano en viajar al espacio.",
  },
  {
    date: "6 jun",
    ru: "День русского языка",
    es: "Día de la Lengua Rusa",
    text: "Coincide con el nacimiento de Pushkin. La ONU lo celebra desde 2010.",
    mx: "El 23 de abril la ONU celebra el Día de la Lengua Española, en memoria de Cervantes.",
  },
  {
    date: "1 sep",
    ru: "День знаний",
    es: "Día del Conocimiento",
    text: "Primer día de clases: los alumnos llegan con flores para sus maestros.",
    mx: "En México el regreso a clases llega a finales de agosto.",
  },
];

/* Preguntas frecuentes */
export const faqs: { q: string; a: string }[] = [
  {
    q: "¿Qué es Druzhba Nuevo León?",
    a: "Un centro cultural ruso virtual nacido en Monterrey: una comunidad independiente para conocer la ciencia, el idioma y la cultura de Rusia, y tender puentes con Nuevo León.",
  },
  {
    q: "¿Necesito saber ruso para participar?",
    a: "No. Aquí caben quienes apenas descubren el alfabeto cirílico, quienes hablan ruso y quienes simplemente sienten curiosidad.",
  },
  {
    q: "¿Cuesta registrarse en la comunidad?",
    a: "No. Registrarte no tiene costo; solo te escribiremos cuando haya actividades o novedades que compartir.",
  },
  {
    q: "¿Tienen una sede física?",
    a: "Por ahora somos un centro virtual, abierto a todo México. Nuestra meta es abrir una casa en Monterrey para leer, cocinar, estudiar y celebrar juntos.",
  },
  {
    q: "¿Druzhba está afiliado a algún gobierno?",
    a: "No. Druzhba Nuevo León es un proyecto cultural independiente, sin afiliación gubernamental. Los enlaces a becas y cursos son informativos.",
  },
  {
    q: "¿Cómo puedo colaborar?",
    a: "Con voluntariado (traducción, diseño, redes, contenido), alianzas con escuelas y colectivos, ideas de actividades o compartiendo el proyecto. Escríbenos desde el formulario de contacto.",
  },
];
