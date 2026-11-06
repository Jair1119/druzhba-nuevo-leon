export type Milestone = { year: string; title: string; text: string };

export type ScienceArea = {
  id: string;
  label: string;
  cyrillic: string;
  headline: string;
  intro: string;
  milestones: Milestone[];
  article: { title: string; minutes: number; body: string[] };
};

export const scienceAreas: ScienceArea[] = [
  {
    id: "espacio",
    label: "Espacio",
    cyrillic: "Космос",
    headline: "El país que abrió el camino al espacio.",
    intro:
      "Casi todos los primeros grandes pasos de la humanidad fuera de la Tierra los dio la Unión Soviética: el primer satélite, el primer ser humano en órbita, la primera mujer, la primera caminata espacial y la primera estación espacial. Hoy Rusia sigue siendo uno de los pilares de la Estación Espacial Internacional.",
    milestones: [
      { year: "1903", title: "La ecuación del cohete", text: "Konstantín Tsiolkovski, un maestro de escuela, publicó las bases matemáticas del vuelo con cohetes. Su fórmula se sigue usando hoy para diseñar cualquier lanzamiento." },
      { year: "1957", title: "Sputnik 1", text: "El 4 de octubre se lanzó el primer satélite artificial de la historia. Su «bip-bip» de radio se escuchó en todo el mundo y dio inicio a la era espacial." },
      { year: "1961", title: "Yuri Gagarin", text: "El 12 de abril, a bordo de la Vostok 1, Gagarin se convirtió en el primer ser humano en viajar al espacio y dar una vuelta completa a la Tierra en 108 minutos." },
      { year: "1963", title: "Valentina Tereshkova", text: "Primera mujer en el espacio. Pasó casi tres días en órbita a bordo de la Vostok 6 y dio 48 vueltas a la Tierra." },
      { year: "1965", title: "Primera caminata espacial", text: "Alexéi Leónov salió de la nave Vosjod 2 y flotó unos 12 minutos en el espacio abierto, unido solo por un cable." },
      { year: "1970", title: "Venera 7 y Lunojod 1", text: "Venera 7 fue la primera sonda en aterrizar en otro planeta (Venus) y enviar datos. Ese mismo año, el Lunojod 1 fue el primer vehículo robótico en recorrer la Luna." },
      { year: "1971", title: "Primera estación espacial", text: "Salyut 1 inauguró la idea de vivir en órbita. Después llegó la estación Mir (1986–2001), donde Valeri Poliakov pasó 437 días seguidos, récord que aún se mantiene." },
      { year: "Hoy", title: "Soyuz y la EEI", text: "El módulo ruso Zvezdá es una parte central de la Estación Espacial Internacional. Entre 2011 y 2020, las naves Soyuz fueron el único medio para llevar astronautas a la estación." },
    ],
    article: {
      title: "Serguéi Koroliov, el ingeniero sin nombre",
      minutes: 4,
      body: [
        "Detrás del Sputnik, de Gagarin y de los primeros éxitos espaciales soviéticos hubo un hombre cuyo nombre fue secreto de Estado mientras vivió: Serguéi Pávlovich Koroliov (1907–1966). En los periódicos solo se le llamaba «el Diseñador Jefe».",
        "Koroliov había sido encarcelado en los años treinta durante las purgas de Stalin y pasó un tiempo en un campo de trabajo en Kolimá. Liberado para trabajar en proyectos militares, terminó dirigiendo el desarrollo del cohete R-7, el primer misil balístico intercontinental, que fue adaptado para lanzar el Sputnik y la nave de Gagarin.",
        "Su legado sigue en uso: los cohetes Soyuz, descendientes directos del R-7, son la familia de lanzadores más utilizada de la historia, con cientos de misiones. Solo después de su muerte, en 1966, el mundo conoció su nombre.",
      ],
    },
  },
  {
    id: "ciencia",
    label: "Ciencia",
    cyrillic: "Наука",
    headline: "Ideas que cambiaron la ciencia mundial.",
    intro:
      "De la tabla periódica a la geometría no euclidiana y al grafeno, científicos rusos y de origen ruso han resuelto algunos de los problemas más difíciles de la física, la química y las matemáticas. Más de una docena han recibido el Premio Nobel en ciencias.",
    milestones: [
      { year: "1829", title: "Geometría de Lobachevski", text: "Nikolái Lobachevski demostró que puede existir una geometría donde las paralelas sí se cruzan. Siglos de certeza euclidiana se rompieron y se abrió el camino a la relatividad de Einstein." },
      { year: "1869", title: "La tabla periódica", text: "Dmitri Mendeléyev ordenó los elementos químicos y dejó huecos para elementos aún desconocidos. Predijo el galio, el escandio y el germanio antes de que se descubrieran." },
      { year: "1933", title: "Probabilidad moderna", text: "Andréi Kolmogórov formuló los axiomas de la teoría de la probabilidad, la base matemática de la estadística, los seguros, las finanzas y la inteligencia artificial." },
      { year: "1958", title: "Radiación de Cherenkov", text: "Pável Cherenkov, Ígor Tamm e Iliá Frank ganaron el Nobel por explicar el brillo azul que aparece en los reactores nucleares cuando las partículas viajan más rápido que la luz en el agua." },
      { year: "1964", title: "Láseres y máseres", text: "Nikolái Básov y Alexandr Prójorov compartieron el Nobel de Física por sus trabajos que hicieron posibles el máser y el láser." },
      { year: "2000", title: "Los chips de tu celular", text: "Zhores Alfiórov ganó el Nobel por las heteroestructuras de semiconductores, presentes en los LED, los lectores láser y las comunicaciones móviles." },
      { year: "2003", title: "La conjetura de Poincaré", text: "Grigori Perelmán resolvió uno de los siete Problemas del Milenio. Rechazó la Medalla Fields y un premio de un millón de dólares." },
      { year: "2010", title: "Grafeno", text: "Andre Geim y Konstantín Novosiólov, formados en Rusia, ganaron el Nobel por aislar el grafeno, el material más delgado y uno de los más resistentes conocidos." },
    ],
    article: {
      title: "Mendeléyev y la tabla que predijo el futuro",
      minutes: 4,
      body: [
        "En 1869, Dmitri Mendeléyev (1834–1907) buscaba la mejor manera de explicar la química a sus alumnos de San Petersburgo. Escribió las propiedades de cada elemento conocido en tarjetas y las ordenó una y otra vez hasta encontrar un patrón: al acomodarlos por peso atómico, sus propiedades se repetían de manera periódica.",
        "Su genialidad no fue solo ordenar, sino atreverse a dejar huecos. Mendeléyev afirmó que faltaban elementos por descubrir y describió cómo serían. En los años siguientes se encontraron el galio (1875), el escandio (1879) y el germanio (1886), con propiedades muy cercanas a las que él había predicho.",
        "Hoy su tabla está en cada salón de química del mundo, y el elemento 101 se llama mendelevio en su honor. Mendeléyev también estudió el petróleo, la agricultura y la industria, y fue de los primeros en advertir que quemar petróleo como simple combustible era desperdiciar una materia prima valiosa.",
      ],
    },
  },
  {
    id: "medicina",
    label: "Medicina",
    cyrillic: "Медицина",
    headline: "Avances que salvan vidas todos los días.",
    intro:
      "Muchos procedimientos que hoy parecen normales, como medir la presión arterial con estetoscopio, operar con anestesia en situaciones de emergencia o alargar un hueso, tienen raíces en la medicina rusa.",
    milestones: [
      { year: "1847", title: "Anestesia en el campo de batalla", text: "Nikolái Pirogov fue de los primeros en usar éter para operar heridos en guerra. También popularizó las férulas de yeso y organizó el triaje de pacientes." },
      { year: "1904", title: "Pávlov y los reflejos", text: "Iván Pávlov fue el primer ruso en ganar un Nobel, por sus estudios de la digestión. Sus experimentos sobre reflejos condicionados marcaron la psicología del siglo XX." },
      { year: "1905", title: "Cómo medir la presión", text: "Nikolái Korotkov descubrió los sonidos que se escuchan con el estetoscopio al desinflar el brazalete. Por eso hoy se habla de los «ruidos de Korotkov»." },
      { year: "1908", title: "El sistema inmune", text: "Iliá Méchnikov ganó el Nobel por descubrir la fagocitosis: células que «se comen» a los microbios. Es una de las bases de la inmunología moderna." },
      { year: "1950s", title: "Aparato de Ilizárov", text: "En Kurgán, Gavriil Ilizárov creó un marco de anillos y varillas que permite reparar fracturas complejas y hasta alargar huesos. Se usa en hospitales de todo el mundo." },
      { year: "1950s", title: "Pionero de los trasplantes", text: "Vladímir Démijov realizó los primeros trasplantes experimentales de corazón y pulmón en animales, trabajos que inspiraron a los cirujanos de los primeros trasplantes humanos." },
      { year: "1959", title: "Vacuna oral contra la polio", text: "Mijaíl Chumakov organizó la producción masiva y los grandes ensayos de la vacuna oral de Sabin, aplicada a millones de personas. Esto ayudó a que se adoptara en todo el mundo." },
      { year: "1970s", title: "Microcirugía ocular", text: "Sviatoslav Fiódorov desarrolló técnicas de cirugía refractiva y organizó clínicas tipo «línea de producción» para operar la vista a miles de pacientes." },
    ],
    article: {
      title: "Ilizárov: el médico de Siberia que alargaba huesos",
      minutes: 3,
      body: [
        "En los años cincuenta, en la pequeña ciudad de Kurgán, en Siberia occidental, el médico Gavriil Ilizárov (1921–1992) tenía pocos recursos y muchos pacientes con fracturas que no sanaban. Con piezas metálicas sencillas, diseñó un marco externo de anillos unidos por varillas y atravesado por alambres finos.",
        "Lo sorprendente fue lo que descubrió: si el hueso se separa muy lentamente, alrededor de un milímetro al día, el cuerpo genera hueso nuevo en el espacio. Esto permitió corregir deformidades, salvar extremidades que estaban condenadas a la amputación e incluso alargar piernas.",
        "Durante años fue poco conocido en Occidente, hasta que en 1980 trató con éxito al explorador italiano Carlo Mauri. Hoy el método Ilizárov se enseña en escuelas de medicina de todo el mundo, y en Kurgán existe un gran centro de ortopedia que lleva su nombre.",
      ],
    },
  },
  {
    id: "energia",
    label: "Energía",
    cyrillic: "Энергия",
    headline: "Del primer reactor nuclear a la fusión del futuro.",
    intro:
      "Rusia tiene las mayores reservas de gas natural del mundo y es uno de los líderes en energía nuclear. Fue pionera en llevar la energía atómica a la red eléctrica y en diseñar el tokamak, el tipo de reactor con el que hoy se busca la energía de fusión.",
    milestones: [
      { year: "1891", title: "El craqueo del petróleo", text: "Vladímir Shújov patentó un proceso de craqueo térmico para transformar el petróleo en combustibles más ligeros. También diseñó las famosas torres hiperboloides de acero." },
      { year: "1954", title: "Obninsk", text: "En Óbninsk, cerca de Moscú, empezó a funcionar la primera central nuclear del mundo conectada a una red eléctrica." },
      { year: "1950s", title: "El tokamak", text: "Ígor Tamm y Andréi Sájarov idearon una cámara en forma de dona que contiene plasma con imanes. La palabra «tokamak» es un acrónimo ruso. El proyecto internacional ITER usa este diseño." },
      { year: "1959", title: "Rompehielos Lenin", text: "Fue el primer barco de superficie con propulsión nuclear. Hoy Rusia tiene la única flota de rompehielos nucleares del mundo, que abre rutas en el Ártico." },
      { year: "2020", title: "Central nuclear flotante", text: "El Akadémik Lomonósov, una central nuclear sobre un barco, empezó a dar electricidad y calefacción a la ciudad ártica de Pevek." },
      { year: "Hoy", title: "Reactores rápidos", text: "En la central de Beloyarsk funcionan reactores de neutrones rápidos (BN-600 y BN-800), una tecnología que puede reaprovechar parte del combustible nuclear usado." },
    ],
    article: {
      title: "Tokamak: la palabra rusa que puede cambiar la energía del mundo",
      minutes: 3,
      body: [
        "La fusión nuclear es la energía que hace brillar al Sol: unir núcleos de átomos ligeros libera cantidades enormes de energía sin las emisiones del carbón o el gas. El problema es que se necesita un gas a más de cien millones de grados, y ningún material lo resiste.",
        "A principios de los años cincuenta, los físicos soviéticos Ígor Tamm y Andréi Sájarov propusieron una solución: encerrar ese plasma con campos magnéticos dentro de una cámara en forma de dona. La llamaron tokamak, acrónimo ruso de «cámara toroidal con bobinas magnéticas».",
        "En 1968, el tokamak T-3 del Instituto Kurchátov de Moscú alcanzó temperaturas tan altas que muchos científicos occidentales no lo creyeron, hasta que un equipo británico viajó a medirlas y las confirmó. Desde entonces, el tokamak se volvió el diseño dominante, y es la base de ITER, el gran reactor experimental que construyen en Francia decenas de países.",
      ],
    },
  },
  {
    id: "tecnologia",
    label: "Tecnología",
    cyrillic: "Технологии",
    headline: "Inventos que usas sin saber que son rusos.",
    intro:
      "La radio, el primer alumbrado eléctrico de París, uno de los videojuegos más vendidos de la historia y el software que sostiene a millones de sitios web tienen algo en común: detrás de ellos hubo ingenieros rusos.",
    milestones: [
      { year: "1876", title: "La vela de Yáblochkov", text: "Pável Yáblochkov inventó una lámpara de arco eléctrico que iluminó avenidas de París y Londres. A esa luz la llamaron «la luz rusa»." },
      { year: "1895", title: "Popov y la radio", text: "Alexandr Popov presentó en San Petersburgo un receptor de ondas de radio. En Rusia, el 7 de mayo se celebra el Día de la Radio en su honor." },
      { year: "1920", title: "El theremín", text: "Lev Termén inventó el primer instrumento electrónico que se toca sin tocarlo: se mueven las manos en el aire. Se escucha en el cine de ciencia ficción y en el rock." },
      { year: "1984", title: "Tetris", text: "Alexéi Pázhitnov creó Tetris en una computadora de la Academia de Ciencias de Moscú. Es uno de los videojuegos más vendidos y reconocidos de la historia." },
      { year: "1997", title: "Yandex y Kaspersky", text: "Nacieron Yandex, el buscador más usado en Rusia, y Kaspersky Lab, una de las empresas de ciberseguridad más conocidas del mundo." },
      { year: "2004", title: "Nginx", text: "Ígor Sýsoev publicó Nginx, un servidor web que hoy hace funcionar a una parte muy grande de los sitios de internet." },
      { year: "2013", title: "Telegram", text: "Los hermanos Pável y Nikolái Dúrov, de origen ruso, crearon Telegram, una de las aplicaciones de mensajería más usadas del mundo." },
    ],
    article: {
      title: "Tetris: el juego que salió de un laboratorio soviético",
      minutes: 3,
      body: [
        "En 1984, Alexéi Pázhitnov trabajaba en el Centro de Cómputo de la Academia de Ciencias de la URSS, en Moscú, investigando inteligencia artificial y reconocimiento de voz. En sus ratos libres programaba rompecabezas para probar las computadoras del centro.",
        "Inspirado en el pentominó, un juego de piezas geométricas, creó un juego en el que figuras de cuatro cuadros caen y hay que acomodarlas para completar líneas. Lo llamó Tetris, mezclando «tetra» (cuatro) y tenis, su deporte favorito. Las copias se pasaron de computadora en computadora por toda Moscú.",
        "Como en la URSS no existía la propiedad privada de software, los derechos quedaron en manos del Estado, y la disputa por licenciarlo en Occidente se volvió una historia digna de película. Pázhitnov empezó a recibir regalías hasta 1996, cuando fundó The Tetris Company. Desde entonces, Tetris se ha publicado en casi todas las consolas y celulares imaginables.",
      ],
    },
  },
];

export const quickFacts: { value: string; label: string }[] = [
  { value: "1957", label: "Primer satélite artificial" },
  { value: "1961", label: "Primer ser humano en el espacio" },
  { value: "1954", label: "Primera central nuclear conectada a la red" },
  { value: "437", label: "Días: récord de permanencia en el espacio" },
];
