// Base de datos de tiempos verbales en inglés para VerbFlow
// Contiene teoría detallada en español, fórmulas, reglas, ejemplos con audio y ejercicios interactivos.

const TENSES_DATA = [
  {
    id: "present-continuous",
    name: "Present Continuous",
    nameEs: "Presente Continuo / Progresivo",
    category: "continuous",
    badge: "Básico - Intermedio",
    tagColor: "#3b82f6",
    icon: "activity",
    summary: "Acciones que están ocurriendo ahora mismo o situaciones temporales en el presente.",
    timeline: {
      past: "Antes",
      now: "AHORA (En progreso)",
      future: "Después",
      actionText: "Estudiando / Jugando...",
      highlight: "now"
    },
    study: {
      concept: "El Presente Continuo se utiliza para hablar de acciones que **están sucediendo en el mismo momento en que hablas**, o para situaciones **temporales** que están en desarrollo en el periodo actual.",
      whenToUse: [
        {
          title: "1. Acciones en el momento exacto",
          desc: "Cosas que ves o haces justo ahora.",
          example: "I am writing an email right now.",
          audio: "I am writing an email right now.",
          translation: "Estoy escribiendo un correo ahora mismo."
        },
        {
          title: "2. Situaciones temporales",
          desc: "Cosas que haces estos días o este mes, aunque no sea exactamente en este segundo.",
          example: "She is living in Madrid this month.",
          audio: "She is living in Madrid this month.",
          translation: "Ella está viviendo en Madrid este mes (temporal)."
        },
        {
          title: "3. Planes futuros ya confirmados",
          desc: "Citas o planes fijados con hora o fecha.",
          example: "We are meeting the boss tomorrow at 10 AM.",
          audio: "We are meeting the boss tomorrow at 10 AM.",
          translation: "Nos vamos a reunir con el jefe mañana a las 10 AM."
        }
      ],
      formulaExplanation: "La clave mágica de TODO tiempo continuo son dos ingredientes obligatorios: el verbo TO BE (en presente: am, is, are) + el verbo principal terminado en -ING.",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + am / is / are + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "She" },
            { label: "Auxiliar TO BE", color: "purple", example: "is" },
            { label: "Verbo + ING", color: "emerald", example: "reading" },
            { label: "Complemento", color: "amber", example: "a book" }
          ],
          examples: [
            { text: "I am studying English.", audio: "I am studying English.", translation: "Yo estoy estudiando inglés." },
            { text: "He is cooking dinner right now.", audio: "He is cooking dinner right now.", translation: "Él está cocinando la cena ahora mismo." },
            { text: "They are playing soccer in the park.", audio: "They are playing soccer in the park.", translation: "Ellos están jugando fútbol en el parque." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + am not / isn't / aren't + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "They" },
            { label: "Auxiliar + NOT", color: "rose", example: "aren't (are not)" },
            { label: "Verbo + ING", color: "emerald", example: "sleeping" },
            { label: "Complemento", color: "amber", example: "at home" }
          ],
          examples: [
            { text: "I am not watching TV.", audio: "I am not watching TV.", translation: "No estoy viendo televisión." },
            { text: "She isn't working today.", audio: "She isn't working today.", translation: "Ella no está trabajando hoy." },
            { text: "We aren't doing anything wrong.", audio: "We aren't doing anything wrong.", translation: "No estamos haciendo nada malo." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Am / Is / Are + Sujeto + Verbo(-ing) + Complemento + ?",
          parts: [
            { label: "Auxiliar TO BE", color: "purple", example: "Are" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "Verbo + ING", color: "emerald", example: "listening" },
            { label: "Complemento", color: "amber", example: "to music?" }
          ],
          examples: [
            { text: "Are you learning English?", audio: "Are you learning English?", translation: "¿Estás aprendiendo inglés?" },
            { text: "Is he sleeping right now?", audio: "Is he sleeping right now?", translation: "¿Él está durmiendo ahora mismo?" },
            { text: "What are they doing outside?", audio: "What are they doing outside?", translation: "¿Qué están haciendo afuera?" }
          ]
        }
      },
      rules: [
        {
          title: "Regla del Auxiliar TO BE según el pronombre",
          desc: "Nunca mezcles los auxiliares:",
          items: [
            "**I** ➔ **am** ('m)",
            "**He / She / It** ➔ **is** ('s) / **isn't**",
            "**You / We / They** ➔ **are** ('re) / **aren't**"
          ]
        },
        {
          title: "Reglas ortográficas para agregar -ING al verbo",
          desc: "Presta mucha atención a la terminación del verbo base:",
          items: [
            "**Regla general**: Solo agrega -ing (read ➔ read**ing**, work ➔ work**ing**).",
            "**Termina en -e muda**: Quita la 'e' y pon -ing (mak**e** ➔ mak**ing**, writ**e** ➔ writ**ing**).",
            "**Consonante + Vocal + Consonante (CVC) de 1 sílaba**: Duplica la última consonante (r**un** ➔ run**ning**, st**op** ➔ stop**ping**, s**it** ➔ sit**ting**).",
            "**Termina en -ie**: Cambia 'ie' por 'y' + ing (d**ie** ➔ d**ying**, l**ie** ➔ l**ying**)."
          ]
        },
        {
          title: "¡CUIDADO! Verbos que NO suelen usar -ING (Stative Verbs)",
          desc: "Los verbos de estado, emoción o pensamiento NO se usan en continuo normalmente:",
          items: [
            "**Incorrecto**: *I am knowing the answer.* ❌",
            "**Correcto**: *I know the answer.* ✔️ (Presente Simple)",
            "Otros: *want, like, love, need, believe, understand, belong*."
          ]
        }
      ],
      timeMarkers: [
        { word: "Now / Right now", trans: "Ahora / Justo ahora" },
        { word: "At the moment", trans: "En este momento" },
        { word: "Currently", trans: "Actualmente" },
        { word: "Today", trans: "Hoy" },
        { word: "This week / month", trans: "Esta semana / mes" },
        { word: "Look! / Listen!", trans: "¡Mira! / ¡Escucha!" }
      ],
      versus: {
        title: "Presente Continuo vs Presente Simple",
        desc: "¿Cuándo usar cuál? Esta es la duda #1 de todo estudiante:",
        comparison: [
          {
            aspect: "¿Qué expresa?",
            tenseA: "Presente Simple: Hábitos, rutinas y verdades universales (I drink coffee every day).",
            tenseB: "Presente Continuo: Acción que está pasando en este preciso instante (I am drinking coffee right now)."
          },
          {
            aspect: "Palabras clave",
            tenseA: "Always, usually, often, never, every day.",
            tenseB: "Now, right now, at the moment, currently."
          }
        ]
      }
    },
    exercises: [
      {
        id: "pc-1",
        type: "multiple-choice",
        question: "Completa la oración: 'Look! The baby _______ right now.'",
        options: ["is sleeping", "are sleeping", "sleeps", "is sleep"],
        correct: 0,
        explanation: "El sujeto es 'The baby' (He/She/It), por lo tanto usa el auxiliar **is**, seguido del verbo con **-ing** ('is sleeping'). Además, 'Look!' y 'right now' indican una acción en curso.",
        audio: "Look! The baby is sleeping right now."
      },
      {
        id: "pc-2",
        type: "scramble",
        question: "Ordena las palabras para formar una oración afirmativa correcta:",
        tokens: ["English", "studying", "are", "We", "together"],
        solution: ["We", "are", "studying", "English", "together"],
        translation: "Nosotros estamos estudiando inglés juntos.",
        explanation: "Estructura afirmativa: Sujeto (We) + Auxiliar (are) + Verbo-ing (studying) + Objeto (English) + Complemento (together)."
      },
      {
        id: "pc-3",
        type: "fill-blank",
        question: "Escribe la forma correcta del verbo 'run' para: 'They are _______ in the park.'",
        accepted: ["running"],
        hint: "Recuerda la regla CVC (Consonante-Vocal-Consonante): duplica la última letra.",
        explanation: "'Run' es un verbo de una sílaba que termina en consonante-vocal-consonante (r-u-n), por eso se duplica la 'n' ➔ **running**.",
        audio: "They are running in the park."
      },
      {
        id: "pc-4",
        type: "multiple-choice",
        question: "¿Cuál de las siguientes oraciones es una PREGUNTA correcta en Presente Continuo?",
        options: [
          "You are listening to the teacher?",
          "Are you listening to the teacher?",
          "Do you listening to the teacher?",
          "Is you listening to the teacher?"
        ],
        correct: 1,
        explanation: "En la pregunta el auxiliar va primero: **Are** + sujeto (**you**) + verbo-ing (**listening**) + complemento.",
        audio: "Are you listening to the teacher?"
      },
      {
        id: "pc-5",
        type: "spot-mistake",
        question: "Encuentra cuál es el error en: 'She is makeing a cake at the moment.'",
        options: [
          "Falta poner 'does'",
          "El verbo 'makeing' está mal escrito; debe ser 'making' sin la 'e'",
          "Debe decir 'are making'",
          "No se puede usar 'at the moment'"
        ],
        correct: 1,
        explanation: "Los verbos que terminan en 'e' muda pierden la 'e' al añadir -ing: make ➔ **making**.",
        audio: "She is making a cake at the moment."
      }
    ]
  },
  {
    id: "past-continuous",
    name: "Past Continuous",
    nameEs: "Pasado Continuo / Progresivo",
    category: "continuous",
    badge: "Intermedio",
    tagColor: "#8b5cf6",
    icon: "clock",
    summary: "Acciones que estaban en desarrollo en un momento específico del pasado.",
    timeline: {
      past: "Acción en progreso en el pasado (was/were studying)",
      now: "Ahora",
      future: "Futuro",
      actionText: "Estaba ocurriendo...",
      highlight: "past"
    },
    study: {
      concept: "El Pasado Continuo describe una acción que **estaba en pleno progreso o desarrollo en un momento determinado del pasado**. Muy frecuentemente se usa cuando **otra acción puntual interrumpe** a la primera.",
      whenToUse: [
        {
          title: "1. Acción en progreso a una hora exacta en el pasado",
          desc: "Lo que estabas haciendo justo en ese momento.",
          example: "Yesterday at 8 PM, I was having dinner.",
          audio: "Yesterday at 8 PM, I was having dinner.",
          translation: "Ayer a las 8 PM, yo estaba cenando."
        },
        {
          title: "2. Acción larga interrumpida por una corta (When)",
          desc: "Estabas haciendo algo cuando de repente pasó otra cosa puntual (en Pasado Simple).",
          example: "I was sleeping when the phone rang.",
          audio: "I was sleeping when the phone rang.",
          translation: "Yo estaba durmiendo cuando sonó el teléfono."
        },
        {
          title: "3. Dos acciones simultáneas en el pasado (While)",
          desc: "Dos cosas que ocurrían al mismo tiempo.",
          example: "While mom was cooking, dad was washing the car.",
          audio: "While mom was cooking, dad was washing the car.",
          translation: "Mientras mamá estaba cocinando, papá estaba lavando el auto."
        }
      ],
      formulaExplanation: "Mantiene la regla de oro continua (verbo TO BE + -ING), pero el verbo TO BE ahora está en pasado: **WAS** o **WERE**.",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + was / were + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "He" },
            { label: "Auxiliar Pasado", color: "purple", example: "was" },
            { label: "Verbo + ING", color: "emerald", example: "watching" },
            { label: "Complemento", color: "amber", example: "a movie" }
          ],
          examples: [
            { text: "I was working until late yesterday.", audio: "I was working until late yesterday.", translation: "Estuve trabajando / Estaba trabajando hasta tarde ayer." },
            { text: "They were playing video games at 10 PM.", audio: "They were playing video games at 10 PM.", translation: "Ellos estaban jugando videojuegos a las 10 PM." },
            { text: "She was driving to work when it started to rain.", audio: "She was driving to work when it started to rain.", translation: "Ella estaba conduciendo al trabajo cuando empezó a llover." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + wasn't / weren't + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "We" },
            { label: "Auxiliar + NOT", color: "rose", example: "weren't" },
            { label: "Verbo + ING", color: "emerald", example: "listening" },
            { label: "Complemento", color: "amber", example: "to him" }
          ],
          examples: [
            { text: "I wasn't paying attention.", audio: "I wasn't paying attention.", translation: "No estaba prestando atención." },
            { text: "He wasn't feeling well last night.", audio: "He wasn't feeling well last night.", translation: "Él no se estaba sintiendo bien anoche." },
            { text: "They weren't expecting any visitors.", audio: "They weren't expecting any visitors.", translation: "Ellos no estaban esperando ninguna visita." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Was / Were + Sujeto + Verbo(-ing) + Complemento + ?",
          parts: [
            { label: "Auxiliar Pasado", color: "purple", example: "Were" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "Verbo + ING", color: "emerald", example: "studying" },
            { label: "Complemento", color: "amber", example: "at midnight?" }
          ],
          examples: [
            { text: "Were you studying when I called?", audio: "Were you studying when I called?", translation: "¿Estabas estudiando cuando llamé?" },
            { text: "What was he doing at 3 PM?", audio: "What was he doing at 3 PM?", translation: "¿Qué estaba haciendo él a las 3 PM?" },
            { text: "Was it raining when you left?", audio: "Was it raining when you left?", translation: "¿Estaba lloviendo cuando saliste?" }
          ]
        }
      },
      rules: [
        {
          title: "Distribución obligatoria de WAS vs WERE",
          desc: "¡Aprende esto de memoria para no dudar jamás!",
          items: [
            "**I / He / She / It** ➔ **WAS** (negativo: **wasn't**)",
            "**You / We / They** ➔ **WERE** (negativo: **weren't**)",
            "*Ojo: Con 'I' se usa WAS en Pasado Continuo (I was studying).*"
          ]
        },
        {
          title: "La pareja clave: WHILE y WHEN",
          desc: "Son los conectores más utilizados con el Pasado Continuo:",
          items: [
            "**WHILE (Mientras)**: Suele ir seguido de Pasado Continuo (*While I was walking...*). Acción en proceso.",
            "**WHEN (Cuando)**: Suele ir seguido de Pasado Simple (*...when my friend arrived*). Acción corta que interrumpe."
          ]
        }
      ],
      timeMarkers: [
        { word: "At [hora] yesterday", trans: "A las [hora] de ayer" },
        { word: "While", trans: "Mientras (acción continua)" },
        { word: "When", trans: "Cuando (interrupción simple)" },
        { word: "All day yesterday", trans: "Todo el día de ayer" },
        { word: "All morning / night", trans: "Toda la mañana / noche" }
      ],
      versus: {
        title: "Pasado Continuo vs Pasado Simple",
        desc: "La diferencia fundamental de duración:",
        comparison: [
          {
            aspect: "Naturaleza",
            tenseA: "Pasado Simple: Acción terminada, puntual o rápida (I broke my leg).",
            tenseB: "Pasado Continuo: Acción que estaba ocurriendo como telón de fondo (I was skiing when I broke my leg)."
          },
          {
            aspect: "Ejemplo clásico",
            tenseA: "The lights went out. (Se fue la luz - momento exacto)",
            tenseB: "We were eating dinner. (Estábamos cenando - proceso que fue interrumpido)"
          }
        ]
      }
    },
    exercises: [
      {
        id: "pac-1",
        type: "multiple-choice",
        question: "Completa la frase: 'At 9 PM last night, we _______ a movie.'",
        options: ["were watching", "was watching", "watched", "are watching"],
        correct: 0,
        explanation: "Con el pronombre 'we' se usa el auxiliar **were**, más el verbo con -ing: **were watching**.",
        audio: "At 9 PM last night, we were watching a movie."
      },
      {
        id: "pac-2",
        type: "multiple-choice",
        question: "Elige la combinación correcta: 'I _______ a shower when the doorbell _______.'",
        options: [
          "was taking / rang",
          "took / was ringing",
          "were taking / rang",
          "was taking / was ringing"
        ],
        correct: 0,
        explanation: "La acción continua (larga) va en Pasado Continuo: 'was taking'. La acción puntual que interrumpe (corta) va en Pasado Simple: 'rang' (pasado de ring).",
        audio: "I was taking a shower when the doorbell rang."
      },
      {
        id: "pac-3",
        type: "scramble",
        question: "Ordena las fichas para formar la pregunta en Pasado Continuo:",
        tokens: ["he", "doing", "What", "was", "yesterday", "?"],
        solution: ["What", "was", "he", "doing", "yesterday", "?"],
        translation: "¿Qué estaba haciendo él ayer?",
        explanation: "En preguntas con Wh-: Wh-word (What) + Auxiliar (was) + Sujeto (he) + Verbo-ing (doing) + Complemento (yesterday) + ?"
      },
      {
        id: "pac-4",
        type: "fill-blank",
        question: "Completa con 'was' o 'were': 'My brother and I _______ cleaning our room.'",
        accepted: ["were"],
        hint: "'My brother and I' equivale al pronombre 'We' (nosotros).",
        explanation: "'My brother and I' somos nosotros (We), por ende el auxiliar correcto en pasado es **were**.",
        audio: "My brother and I were cleaning our room."
      },
      {
        id: "pac-5",
        type: "spot-mistake",
        question: "¿Qué está mal en: 'I were playing tennis when it started raining.'?",
        options: [
          "Debe ser 'I was playing' porque 'I' lleva 'was'",
          "Debe ser 'started to rainning'",
          "Falta poner 'did'",
          "No se puede usar 'when'"
        ],
        correct: 0,
        explanation: "El pronombre 'I' va con el auxiliar **was**, no con 'were': 'I **was** playing...'.",
        audio: "I was playing tennis when it started raining."
      }
    ]
  },
  {
    id: "present-simple",
    name: "Present Simple",
    nameEs: "Presente Simple",
    category: "simple",
    badge: "Básico",
    tagColor: "#10b981",
    icon: "sun",
    summary: "Rutinas, hábitos, hechos permanentes y verdades universales.",
    timeline: {
      past: "Siempre ha sido así",
      now: "Ocurre habitualmente",
      future: "Seguirá ocurriendo",
      actionText: "Rutina / Hábito permanente",
      highlight: "all"
    },
    study: {
      concept: "El Presente Simple se usa para cosas que son **habituales**, que suceden con cierta frecuencia o que son **hechos permanentes y verdades científicas**.",
      whenToUse: [
        {
          title: "1. Hábitos y rutinas diarias",
          desc: "Lo que haces todos los días, semanas o meses.",
          example: "I drink coffee every morning.",
          audio: "I drink coffee every morning.",
          translation: "Bebo café todas las mañanas."
        },
        {
          title: "2. Hechos y verdades generales",
          desc: "Cosas que no cambian.",
          example: "The sun rises in the east.",
          audio: "The sun rises in the east.",
          translation: "El sol sale por el este."
        },
        {
          title: "3. Estados o sentimientos permanentes",
          desc: "Con verbos de estado (like, love, live, want, know).",
          example: "She lives in New York.",
          audio: "She lives in New York.",
          translation: "Ella vive en Nueva York."
        }
      ],
      formulaExplanation: "En afirmativo usamos el verbo en su forma base, pero OJO con la 3ra persona (**He, She, It**), ¡a la cual se le debe agregar **-s** o **-es**! En negativo y pregunta usamos los auxiliares **DO** y **DOES**.",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + Verbo (base o con -s/es en 3ra persona) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "He" },
            { label: "Verbo (+s/es)", color: "emerald", example: "works" },
            { label: "Complemento", color: "amber", example: "in an office" }
          ],
          examples: [
            { text: "I live in Canada.", audio: "I live in Canada.", translation: "Yo vivo en Canadá." },
            { text: "She speaks three languages.", audio: "She speaks three languages.", translation: "Ella habla tres idiomas." },
            { text: "They play soccer on weekends.", audio: "They play soccer on weekends.", translation: "Ellos juegan fútbol los fines de semana." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + don't / doesn't + Verbo en forma base + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "She" },
            { label: "Auxiliar Negativo", color: "rose", example: "doesn't" },
            { label: "Verbo BASE", color: "emerald", example: "eat" },
            { label: "Complemento", color: "amber", example: "meat" }
          ],
          examples: [
            { text: "I don't like horror movies.", audio: "I don't like horror movies.", translation: "No me gustan las películas de terror." },
            { text: "He doesn't work on Sundays.", audio: "He doesn't work on Sundays.", translation: "Él no trabaja los domingos." },
            { text: "We don't need help right now.", audio: "We don't need help right now.", translation: "No necesitamos ayuda ahora." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Do / Does + Sujeto + Verbo en forma base + Complemento + ?",
          parts: [
            { label: "Auxiliar", color: "purple", example: "Does" },
            { label: "Sujeto", color: "blue", example: "she" },
            { label: "Verbo BASE", color: "emerald", example: "live" },
            { label: "Complemento", color: "amber", example: "here?" }
          ],
          examples: [
            { text: "Do you play the guitar?", audio: "Do you play the guitar?", translation: "¿Tocas la guitarra?" },
            { text: "Does he understand Spanish?", audio: "Does he understand Spanish?", translation: "¿Él entiende español?" },
            { text: "Where do they work?", audio: "Where do they work?", translation: "¿Dónde trabajan ellos?" }
          ]
        }
      },
      rules: [
        {
          title: "La regla de oro de la 3ra Persona (He, She, It)",
          desc: "Solo en oraciones AFIRMATIVAS el verbo sufre cambios:",
          items: [
            "**Mayoría de verbos**: agrega **-s** (play ➔ play**s**, work ➔ work**s**).",
            "**Terminan en -ch, -sh, -ss, -x, -o**: agrega **-es** (watch ➔ watch**es**, go ➔ go**es**, fix ➔ fix**es**).",
            "**Consonante + Y**: cambia 'y' por **-ies** (study ➔ stud**ies**, fly ➔ fl**ies**).",
            "*¡Alerta de error!:* En negativo y preguntas, **el verbo VUELVE A SU FORMA BASE** porque el auxiliar 'does/doesn't' ya absorbe la 's'. (She doesn't **plays** ❌ ➔ She doesn't **play** ✔️)."
          ]
        }
      ],
      timeMarkers: [
        { word: "Always", trans: "Siempre (100%)" },
        { word: "Usually", trans: "Usualmente (80%)" },
        { word: "Often", trans: "A menudo (60%)" },
        { word: "Sometimes", trans: "A veces (40%)" },
        { word: "Never", trans: "Nunca (0%)" },
        { word: "Every day / week", trans: "Todos los días / semanas" }
      ],
      versus: {
        title: "Recordatorio Rápido",
        desc: "Diferencia con Presente Continuo:",
        comparison: [
          {
            aspect: "Frecuencia",
            tenseA: "Simple: 'I work from 9 to 5' (Rutina fija diaria).",
            tenseB: "Continuo: 'I am working from home today' (Excepción hoy)."
          }
        ]
      }
    },
    exercises: [
      {
        id: "ps-1",
        type: "multiple-choice",
        question: "Elige la opción correcta: 'My sister _______ to the gym three times a week.'",
        options: ["go", "goes", "is going", "going"],
        correct: 1,
        explanation: "'My sister' es tercera persona (She). Los verbos terminados en 'o' (go) añaden **-es** en afirmativo ➔ **goes**.",
        audio: "My sister goes to the gym three times a week."
      },
      {
        id: "ps-2",
        type: "multiple-choice",
        question: "¿Cuál oración negativa es la gramaticalmente correcta?",
        options: [
          "He doesn't likes broccoli.",
          "He doesn't like broccoli.",
          "He don't like broccoli.",
          "He isn't like broccoli."
        ],
        correct: 1,
        explanation: "Con 'He' se usa el auxiliar negativo **doesn't**, y el verbo principal queda en forma base (**like** sin 's').",
        audio: "He doesn't like broccoli."
      },
      {
        id: "ps-3",
        type: "fill-blank",
        question: "Escribe el auxiliar (Do o Does) para completar: '_______ you have any questions?'",
        accepted: ["Do", "do"],
        hint: "El sujeto es 'you'.",
        explanation: "Con el pronombre 'you' el auxiliar de pregunta en presente es **Do**.",
        audio: "Do you have any questions?"
      },
      {
        id: "ps-4",
        type: "scramble",
        question: "Ordena las palabras para formar una oración correcta:",
        tokens: ["never", "coffee", "He", "at", "drinks", "night"],
        solution: ["He", "never", "drinks", "coffee", "at", "night"],
        translation: "Él nunca toma café en la noche.",
        explanation: "Los adverbios de frecuencia como 'never' van entre el sujeto y el verbo principal: Sujeto (He) + Adverbio (never) + Verbo (drinks) + Objeto (coffee) + (at night)."
      }
    ]
  },
  {
    id: "past-simple",
    name: "Past Simple",
    nameEs: "Pasado Simple",
    category: "simple",
    badge: "Básico - Intermedio",
    tagColor: "#f59e0b",
    icon: "archive",
    summary: "Acciones puntuales que comenzaron y terminaron en el pasado.",
    timeline: {
      past: "Acción completada (X)",
      now: "Ahora",
      future: "Futuro",
      actionText: "Hecho terminado",
      highlight: "past"
    },
    study: {
      concept: "El Pasado Simple se usa para hablar de acciones, eventos o estados que **comenzaron y terminaron definitivamente en el pasado**, en un momento específico.",
      whenToUse: [
        {
          title: "1. Acción puntual terminada",
          desc: "Ya acabó y no continúa en el presente.",
          example: "I visited London in 2021.",
          audio: "I visited London in 2021.",
          translation: "Visité Londres en 2021."
        },
        {
          title: "2. Secuencia de eventos en el pasado",
          desc: "Narrar historias paso a paso.",
          example: "He woke up, brushed his teeth, and left the house.",
          audio: "He woke up, brushed his teeth, and left the house.",
          translation: "Él se despertó, se cepilló los dientes y salió de la casa."
        }
      ],
      formulaExplanation: "En afirmativo usamos verbos regulares (terminados en **-ed**) o irregulares (como *went, ate, bought*). En negativo e interrogativo usamos el comodín mágico **DID**, y el verbo regresa a su forma base.",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + Verbo en pasado (-ed o irregular) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "They" },
            { label: "Verbo Pasado", color: "emerald", example: "watched / went" },
            { label: "Complemento", color: "amber", example: "yesterday" }
          ],
          examples: [
            { text: "I played tennis yesterday.", audio: "I played tennis yesterday.", translation: "Jugué tenis ayer (regular)." },
            { text: "She bought a new car last week.", audio: "She bought a new car last week.", translation: "Ella compró un carro nuevo la semana pasada (irregular)." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + didn't (did not) + Verbo en forma BASE + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "I" },
            { label: "Auxiliar Negativo", color: "rose", example: "didn't" },
            { label: "Verbo BASE", color: "emerald", example: "see" },
            { label: "Complemento", color: "amber", example: "him" }
          ],
          examples: [
            { text: "I didn't see the movie.", audio: "I didn't see the movie.", translation: "No vi la película." },
            { text: "They didn't go to the party.", audio: "They didn't go to the party.", translation: "Ellos no fueron a la fiesta." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Did + Sujeto + Verbo en forma BASE + Complemento + ?",
          parts: [
            { label: "Auxiliar", color: "purple", example: "Did" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "Verbo BASE", color: "emerald", example: "call" },
            { label: "Complemento", color: "amber", example: "me?" }
          ],
          examples: [
            { text: "Did you call me last night?", audio: "Did you call me last night?", translation: "¿Me llamaste anoche?" },
            { text: "Where did they go on vacation?", audio: "Where did they go on vacation?", translation: "¿A dónde fueron de vacaciones?" }
          ]
        }
      },
      rules: [
        {
          title: "La regla de oro del auxiliar DID",
          desc: "'Did' y 'Didn't' se usan para TODOS los pronombres (I, you, he, she, it, we, they):",
          items: [
            "Cuando aparece **did** o **didn't**, el verbo principal **NO** va en pasado, va en su forma base (infinitivo sin to).",
            "**Incorrecto**: *Did you went?* ❌",
            "**Correcto**: *Did you go?* ✔️",
            "**Incorrecto**: *I didn't saw him.* ❌",
            "**Correcto**: *I didn't see him.* ✔️"
          ]
        }
      ],
      timeMarkers: [
        { word: "Yesterday", trans: "Ayer" },
        { word: "Last night / week / year", trans: "Anoche / la semana pasada / el año pasado" },
        { word: "[tiempo] ago (two days ago)", trans: "Hace [tiempo] (hace dos días)" },
        { word: "In 2018", trans: "En 2018 (año pasado)" }
      ],
      versus: {
        title: "Relación con Pasado Continuo",
        desc: "Observa cómo interactúan:",
        comparison: [
          {
            aspect: "Ejemplo",
            tenseA: "Pasado Continuo (Escenario de fondo): 'While I was cooking...'",
            tenseB: "Pasado Simple (Suceso que ocurre): '...I burned my hand.'"
          }
        ]
      }
    },
    exercises: [
      {
        id: "past-1",
        type: "multiple-choice",
        question: "¿Cuál es la forma correcta para completar: 'She _______ to the concert last night.'?",
        options: ["went", "goed", "goes", "was go"],
        correct: 0,
        explanation: "El verbo 'go' es irregular. Su forma en pasado simple afirmativo es **went** (nunca 'goed').",
        audio: "She went to the concert last night."
      },
      {
        id: "past-2",
        type: "multiple-choice",
        question: "Corrige la pregunta: 'Did you _______ your homework?'",
        options: ["finished", "finish", "finishing", "finishes"],
        correct: 1,
        explanation: "Como ya tenemos el auxiliar de pregunta **Did**, el verbo principal debe ir en su forma base: **finish**.",
        audio: "Did you finish your homework?"
      },
      {
        id: "past-3",
        type: "scramble",
        question: "Ordena las palabras para formar una oración negativa en pasado:",
        tokens: ["any", "buy", "didn't", "We", "bread"],
        solution: ["We", "didn't", "buy", "any", "bread"],
        translation: "Nosotros no compramos nada de pan.",
        explanation: "Estructura negativa: Sujeto (We) + Auxiliar (didn't) + Verbo base (buy) + Complemento (any bread)."
      }
    ]
  },
  {
    id: "future-simple",
    name: "Future Simple",
    nameEs: "Futuro Simple (Will & Be Going To)",
    category: "simple",
    badge: "Básico - Intermedio",
    tagColor: "#06b6d4",
    icon: "compass",
    summary: "Predicciones, decisiones espontáneas, promesas y planes futuros.",
    timeline: {
      past: "Pasado",
      now: "Ahora (Toma de decisión)",
      future: "Ocurrirá en el futuro (Will / Going to)",
      actionText: "Ocurrirá después",
      highlight: "future"
    },
    study: {
      concept: "Para hablar del futuro en inglés existen dos herramientas principales: **WILL** (para decisiones espontáneas, predicciones y promesas) y **BE GOING TO** (para planes ya pensados o cosas evidentes).",
      whenToUse: [
        {
          title: "1. WILL: Decisión espontánea tomada en el momento",
          desc: "Nadie lo planeó, lo decides justo ahora.",
          example: "The phone is ringing. I will answer it!",
          audio: "The phone is ringing. I will answer it!",
          translation: "El teléfono está sonando. ¡Yo contestaré!"
        },
        {
          title: "2. WILL: Promesas o predicciones basadas en opinión",
          desc: "Promesas, esperanzas o 'creo que...'",
          example: "I will always love you / I think it will rain.",
          audio: "I will always love you. I think it will rain.",
          translation: "Siempre te amaré / Creo que lloverá."
        },
        {
          title: "3. BE GOING TO: Planes e intenciones previas",
          desc: "Algo que ya decidiste antes de este momento.",
          example: "I am going to visit my grandparents this weekend.",
          audio: "I am going to visit my grandparents this weekend.",
          translation: "Voy a visitar a mis abuelos este fin de semana."
        },
        {
          title: "4. BE GOING TO: Predicciones con evidencia visible",
          desc: "Ves nubes negras en el cielo.",
          example: "Look at those dark clouds! It is going to rain.",
          audio: "Look at those dark clouds! It is going to rain.",
          translation: "¡Mira esas nubes negras! Va a llover."
        }
      ],
      formulaExplanation: "Con 'WILL', el verbo SIEMPRE va en su forma base y no cambia para ningún pronombre. Con 'BE GOING TO', conjugas 'am/is/are' + going to + verbo base.",
      structures: {
        affirmative: {
          title: "Estructuras Afirmativas (+)",
          formula: "WILL: Sujeto + will ('ll) + Verbo Base | GOING TO: Sujeto + am/is/are + going to + Verbo Base",
          parts: [
            { label: "Sujeto", color: "blue", example: "I" },
            { label: "Auxiliar Futuro", color: "cyan", example: "will / am going to" },
            { label: "Verbo BASE", color: "emerald", example: "help" },
            { label: "Complemento", color: "amber", example: "you" }
          ],
          examples: [
            { text: "I will help you with your bags.", audio: "I will help you with your bags.", translation: "Te ayudaré con tus maletas (decisión en el momento)." },
            { text: "She is going to study medicine next year.", audio: "She is going to study medicine next year.", translation: "Ella va a estudiar medicina el próximo año (plan)." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "WILL: Sujeto + won't (will not) + Verbo Base | GOING TO: Sujeto + am not/isn't/aren't + going to + Verbo Base",
          parts: [
            { label: "Sujeto", color: "blue", example: "They" },
            { label: "Negativo Futuro", color: "rose", example: "won't / aren't going to" },
            { label: "Verbo BASE", color: "emerald", example: "come" },
            { label: "Complemento", color: "amber", example: "tomorrow" }
          ],
          examples: [
            { text: "I won't tell anyone your secret.", audio: "I won't tell anyone your secret.", translation: "No le diré a nadie tu secreto (promesa)." },
            { text: "We aren't going to buy that house.", audio: "We aren't going to buy that house.", translation: "No vamos a comprar esa casa (decisión previa)." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Will + Sujeto + Verbo Base + ? | Am/Is/Are + Sujeto + going to + Verbo Base + ?",
          parts: [
            { label: "Auxiliar", color: "purple", example: "Will" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "Verbo BASE", color: "emerald", example: "marry" },
            { label: "Complemento", color: "amber", example: "me?" }
          ],
          examples: [
            { text: "Will you come to my party?", audio: "Will you come to my party?", translation: "¿Vendrás a mi fiesta?" },
            { text: "Are you going to travel this summer?", audio: "Are you going to travel this summer?", translation: "¿Vas a viajar este verano?" }
          ]
        }
      },
      rules: [
        {
          title: "¿WILL o GOING TO? La regla infalible",
          desc: "Hazte esta pregunta rápida:",
          items: [
            "¿Se te acaba de ocurrir ahora mismo? ➔ Usa **WILL**.",
            "¿Es una promesa, oferta de ayuda o amenaza? ➔ Usa **WILL**.",
            "¿Ya lo habías planeado desde ayer o la semana pasada? ➔ Usa **BE GOING TO**.",
            "¿Tienes una prueba visual evidente frente a tus ojos? ➔ Usa **BE GOING TO**."
          ]
        }
      ],
      timeMarkers: [
        { word: "Tomorrow", trans: "Mañana" },
        { word: "Next week / month / year", trans: "La próxima semana / mes / año" },
        { word: "Soon", trans: "Pronto" },
        { word: "In the future", trans: "En el futuro" },
        { word: "Someday", trans: "Algún día" }
      ],
      versus: {
        title: "Will vs Going to frente a frente",
        desc: "Compara el matiz:",
        comparison: [
          {
            aspect: "Espontáneo vs Planeado",
            tenseA: "Will: 'I'm cold. I will close the window' (Decidido al instante).",
            tenseB: "Going to: 'I bought tickets, I am going to see Coldplay' (Plan formal previo)."
          }
        ]
      }
    },
    exercises: [
      {
        id: "fut-1",
        type: "multiple-choice",
        question: "Estás en un restaurante y el camarero te pregunta qué deseas. Tú decides al momento: 'I _______ the pasta, please.'",
        options: ["will have", "am going to have", "have", "am having to have"],
        correct: 0,
        explanation: "Para decisiones tomadas en el mismo momento en que se habla (pedir comida, responder una oferta), se utiliza **will**.",
        audio: "I will have the pasta, please."
      },
      {
        id: "fut-2",
        type: "multiple-choice",
        question: "Ves a una persona corriendo hacia el autobús y las puertas ya están cerrando. ¿Qué dices según la evidencia?",
        options: [
          "He is going to miss the bus!",
          "He will miss the bus!",
          "He misses the bus!",
          "He was missing the bus!"
        ],
        correct: 0,
        explanation: "Cuando hay evidencia visual directa e inminente de lo que va a pasar, usamos **be going to** ('He is going to miss the bus!').",
        audio: "He is going to miss the bus!"
      },
      {
        id: "fut-3",
        type: "scramble",
        question: "Ordena las palabras para formar una promesa en futuro:",
        tokens: ["forget", "never", "I", "you", "will"],
        solution: ["I", "will", "never", "forget", "you"],
        translation: "Nunca te olvidaré.",
        explanation: "Estructura: Sujeto (I) + will + adverbio (never) + verbo base (forget) + objeto (you)."
      },
      {
        id: "fut-4",
        type: "fill-blank",
        question: "Completa la contracción negativa de 'will not': 'Don't worry, I _______ be late.'",
        accepted: ["won't", "wont"],
        hint: "Es una sola palabra que empieza con w y termina con n't.",
        explanation: "La contracción de 'will not' es **won't**.",
        audio: "Don't worry, I won't be late."
      }
    ]
  },
  {
    id: "future-continuous",
    name: "Future Continuous",
    nameEs: "Futuro Continuo / Progresivo",
    category: "continuous",
    badge: "Avanzado",
    tagColor: "#ec4899",
    icon: "fast-forward",
    summary: "Acciones que estarán en pleno desarrollo en un momento específico del futuro.",
    timeline: {
      past: "Pasado",
      now: "Ahora",
      future: "Acción en progreso en un punto futuro (Will be doing)",
      actionText: "Estará ocurriendo allá en el futuro",
      highlight: "future"
    },
    study: {
      concept: "El Futuro Continuo sirve para proyectarte hacia adelante e imaginarte una acción que **estará en pleno proceso en un momento exacto del futuro**.",
      whenToUse: [
        {
          title: "1. Acción en progreso a una hora exacta en el futuro",
          desc: "Qué estarás haciendo en ese momento puntual.",
          example: "Tomorrow at this time, I will be flying to Miami.",
          audio: "Tomorrow at this time, I will be flying to Miami.",
          translation: "Mañana a esta hora, estaré volando hacia Miami."
        },
        {
          title: "2. Preguntar cortesmente por los planes de alguien",
          desc: "Una forma muy educada de indagar sobre planes sin sonar entrometido.",
          example: "Will you be using the computer later?",
          audio: "Will you be using the computer later?",
          translation: "¿Estarás usando la computadora más tarde?"
        }
      ],
      formulaExplanation: "Mantiene la regla de oro: Auxiliar de futuro (**WILL**) + Verbo TO BE en forma base (**BE**) + Verbo principal con **-ING**.",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + will be + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "She" },
            { label: "Auxiliar Continuo", color: "purple", example: "will be" },
            { label: "Verbo + ING", color: "emerald", example: "waiting" },
            { label: "Complemento", color: "amber", example: "for you" }
          ],
          examples: [
            { text: "This time next week, I will be relaxing on the beach.", audio: "This time next week, I will be relaxing on the beach.", translation: "A esta hora la próxima semana, estaré relajándome en la playa." },
            { text: "They will be celebrating all night.", audio: "They will be celebrating all night.", translation: "Ellos estarán celebrando toda la noche." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + won't be + Verbo(-ing) + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "I" },
            { label: "Negativo", color: "rose", example: "won't be" },
            { label: "Verbo + ING", color: "emerald", example: "working" },
            { label: "Complemento", color: "amber", example: "tomorrow" }
          ],
          examples: [
            { text: "I won't be attending the meeting tomorrow.", audio: "I won't be attending the meeting tomorrow.", translation: "No estaré asistiendo a la reunión de mañana." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Will + Sujeto + be + Verbo(-ing) + Complemento + ?",
          parts: [
            { label: "Auxiliar", color: "purple", example: "Will" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "be + ING", color: "emerald", example: "be sleeping" },
            { label: "Complemento", color: "amber", example: "at 11 PM?" }
          ],
          examples: [
            { text: "Will you be sleeping if I call you at 11?", audio: "Will you be sleeping if I call you at 11?", translation: "¿Estarás durmiendo si te llamo a las 11?" }
          ]
        }
      },
      rules: [
        {
          title: "La estructura inamovible 'WILL BE'",
          desc: "¡Nunca conjugues 'be' después de will!",
          items: [
            "**Incorrecto**: *She will is studying.* ❌",
            "**Correcto**: *She will be studying.* ✔️",
            "El 'be' siempre se queda exactamente como 'be' para todos los sujetos."
          ]
        }
      ],
      timeMarkers: [
        { word: "This time tomorrow / next week", trans: "A esta hora mañana / la próxima semana" },
        { word: "At [hora] tomorrow", trans: "A las [hora] de mañana" },
        { word: "In 10 years' time", trans: "De aquí a 10 años" }
      ],
      versus: {
        title: "Comparativa de los 3 Tiempos Continuos",
        desc: "Mira cómo la misma acción cambia a lo largo del tiempo:",
        comparison: [
          {
            aspect: "Pasado Continuo",
            tenseA: "Yesterday at 3 PM, I was studying.",
            tenseB: "Ayer a las 3 PM, estaba estudiando."
          },
          {
            aspect: "Presente Continuo",
            tenseA: "Right now, I am studying.",
            tenseB: "Justo ahora, estoy estudiando."
          },
          {
            aspect: "Futuro Continuo",
            tenseA: "Tomorrow at 3 PM, I will be studying.",
            tenseB: "Mañana a las 3 PM, estaré estudiando."
          }
        ]
      }
    },
    exercises: [
      {
        id: "fc-1",
        type: "multiple-choice",
        question: "Completa la frase: 'Don't call me at 8 PM tonight because I _______ dinner with my family.'",
        options: ["will be having", "will have", "am have", "was having"],
        correct: 0,
        explanation: "A las 8 PM la acción estará en pleno desarrollo (estará ocurriendo), por lo que usamos Futuro Continuo: **will be having**.",
        audio: "Don't call me at 8 PM tonight because I will be having dinner with my family."
      },
      {
        id: "fc-2",
        type: "scramble",
        question: "Ordena las palabras para formar una oración en Futuro Continuo:",
        tokens: ["relaxing", "will", "on", "be", "the", "beach", "We"],
        solution: ["We", "will", "be", "relaxing", "on", "the", "beach"],
        translation: "Estaremos relajándonos en la playa.",
        explanation: "Sujeto (We) + will be + verbo-ing (relaxing) + complemento (on the beach)."
      }
    ]
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    nameEs: "Presente Perfecto",
    category: "perfect",
    badge: "Intermedio",
    tagColor: "#e11d48",
    icon: "check-circle",
    summary: "Experiencias de vida o acciones pasadas con conexión directa en el presente.",
    timeline: {
      past: "Ocurrió en algún momento del pasado",
      now: "El resultado o experiencia importa HOY",
      future: "Futuro",
      actionText: "Conectado al presente",
      highlight: "past-now"
    },
    study: {
      concept: "El Presente Perfecto es un **puente entre el pasado y el presente**. Se utiliza para hablar de experiencias de vida (sin importar la fecha exacta) o de acciones recién ocurridas cuyo resultado es visible hoy.",
      whenToUse: [
        {
          title: "1. Experiencias de vida (alguna vez / nunca)",
          desc: "No importa cuándo fue, importa si lo has vivido o no.",
          example: "I have visited Japan twice.",
          audio: "I have visited Japan twice.",
          translation: "He visitado Japón dos veces."
        },
        {
          title: "2. Acción recién completada (Just)",
          desc: "Acaba de pasar hace instantes.",
          example: "I have just finished my homework.",
          audio: "I have just finished my homework.",
          translation: "Acabo de terminar mi tarea."
        },
        {
          title: "3. Acciones que comenzaron en el pasado y continúan hoy (Since / For)",
          desc: "Llevas tiempo haciéndolo.",
          example: "She has worked here for 5 years.",
          audio: "She has worked here for 5 years.",
          translation: "Ella ha trabajado aquí durante 5 años."
        }
      ],
      formulaExplanation: "Utiliza el auxiliar **HAVE** o **HAS** (según el sujeto) + el verbo en **PARTICIPIO PASADO** (3ra columna de verbos irregulares o terminado en -ed).",
      structures: {
        affirmative: {
          title: "Estructura Afirmativa (+)",
          formula: "Sujeto + have / has + Verbo en Participio + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "She" },
            { label: "Auxiliar", color: "purple", example: "has" },
            { label: "Participio Pasado", color: "emerald", example: "lost" },
            { label: "Complemento", color: "amber", example: "her keys" }
          ],
          examples: [
            { text: "I have seen that movie before.", audio: "I have seen that movie before.", translation: "He visto esa película antes." },
            { text: "He has lived in Paris since 2018.", audio: "He has lived in Paris since 2018.", translation: "Él ha vivido en París desde 2018." }
          ]
        },
        negative: {
          title: "Estructura Negativa (-)",
          formula: "Sujeto + haven't / hasn't + Verbo en Participio + Complemento",
          parts: [
            { label: "Sujeto", color: "blue", example: "They" },
            { label: "Negativo", color: "rose", example: "haven't" },
            { label: "Participio", color: "emerald", example: "arrived" },
            { label: "Complemento", color: "amber", example: "yet" }
          ],
          examples: [
            { text: "I haven't eaten breakfast yet.", audio: "I haven't eaten breakfast yet.", translation: "Aún no he desayunado." }
          ]
        },
        interrogative: {
          title: "Estructura Interrogativa (?)",
          formula: "Have / Has + Sujeto + Verbo en Participio + Complemento + ?",
          parts: [
            { label: "Auxiliar", color: "purple", example: "Have" },
            { label: "Sujeto", color: "blue", example: "you" },
            { label: "Participio", color: "emerald", example: "ever been" },
            { label: "Complemento", color: "amber", example: "to Italy?" }
          ],
          examples: [
            { text: "Have you ever seen a ghost?", audio: "Have you ever seen a ghost?", translation: "¿Alguna vez has visto un fantasma?" }
          ]
        }
      },
      rules: [
        {
          title: "Distribución de HAVE vs HAS",
          desc: "Al igual que con el presente simple:",
          items: [
            "**I / You / We / They** ➔ **HAVE** (haven't)",
            "**He / She / It** ➔ **HAS** (hasn't)",
            "**Participio Pasado**: Recuerda que en verbos regulares termina en -ed (worked, played), pero en irregulares cambia (see ➔ seen, go ➔ gone, do ➔ done)."
          ]
        }
      ],
      timeMarkers: [
        { word: "Ever", trans: "¿Alguna vez? (en preguntas)" },
        { word: "Never", trans: "Nunca" },
        { word: "Already", trans: "Ya (antes de lo previsto)" },
        { word: "Yet", trans: "Aún / todavía (en negativas y preguntas)" },
        { word: "Just", trans: "Acabar de..." },
        { word: "Since / For", trans: "Desde / Por (durante)" }
      ],
      versus: {
        title: "Present Perfect vs Past Simple",
        desc: "La regla de oro para no confundirlos:",
        comparison: [
          {
            aspect: "Tiempo Específico vs Inespecífico",
            tenseA: "Past Simple: Si dices CUÁNDO ocurrió de forma concreta (yesterday, in 2010, last week). 'I visited Rome last year'.",
            tenseB: "Present Perfect: Si NO dices cuándo ocurrió o es una experiencia de vida. 'I have visited Rome'."
          }
        ]
      }
    },
    exercises: [
      {
        id: "pp-1",
        type: "multiple-choice",
        question: "Completa la pregunta típica de experiencia: '_______ you ever _______ sushi?'",
        options: ["Have / eaten", "Did / eat", "Has / eaten", "Have / ate"],
        correct: 0,
        explanation: "Con 'you' usamos el auxiliar **Have**, y el participio pasado del verbo irregular eat es **eaten** ('Have you ever eaten sushi?').",
        audio: "Have you ever eaten sushi?"
      },
      {
        id: "pp-2",
        type: "multiple-choice",
        question: "Observa la oración: 'I _______ my wallet! I can't find it anywhere right now.'",
        options: ["have lost", "lost", "was losing", "am losing"],
        correct: 0,
        explanation: "La acción ocurrió en el pasado pero el resultado afecta el momento presente ('no la encuentro en este momento'). Por eso usamos Presente Perfecto: **have lost**.",
        audio: "I have lost my wallet! I can't find it anywhere right now."
      }
    ]
  },
  {
    id: "master-challenge",
    name: "Duelo de Tiempos",
    nameEs: "Desafío Mixto: Pon a Prueba Todo",
    category: "challenge",
    badge: "Examen / Quiz",
    tagColor: "#f97316",
    icon: "award",
    summary: "¿Sabes distinguir cuándo usar Pasado Continuo, Presente Continuo o Futuro Simple? ¡Demuéstralo aquí!",
    timeline: {
      past: "Pasado",
      now: "Presente",
      future: "Futuro",
      actionText: "Todos los tiempos en acción",
      highlight: "all"
    },
    study: {
      concept: "El secreto para dominar el inglés es saber **reconocer las señales de contexto** que te indican qué tiempo verbal corresponde.",
      whenToUse: [
        {
          title: "Señal 1: ¿Ocurre en este instante?",
          desc: "Usa Present Continuous (am/is/are + -ing).",
          example: "Look! She is dancing.",
          audio: "Look! She is dancing.",
          translation: "¡Mira! Ella está bailando."
        },
        {
          title: "Señal 2: ¿Estaba en curso y otra cosa la interrumpió en el pasado?",
          desc: "Usa Past Continuous + Past Simple (was/were doing... when something happened).",
          example: "I was cooking when the smoke alarm sounded.",
          audio: "I was cooking when the smoke alarm sounded.",
          translation: "Estaba cocinando cuando sonó la alarma de humo."
        },
        {
          title: "Señal 3: ¿Es una decisión tomada en el segundo que hablas?",
          desc: "Usa Future Simple con Will (will + verbo base).",
          example: "I will help you carrying that box.",
          audio: "I will help you carrying that box.",
          translation: "Te ayudaré cargando esa caja."
        },
        {
          title: "Señal 4: ¿Es una rutina habitual de todos los días?",
          desc: "Usa Present Simple (verb o verb-s).",
          example: "He drinks coffee every morning.",
          audio: "He drinks coffee every morning.",
          translation: "Él toma café cada mañana."
        }
      ],
      formulaExplanation: "En este modo no hay una sola fórmula: pondrás a prueba tu capacidad de contraste entre Presente Continuo, Pasado Continuo, Futuro Simple y los demás tiempos.",
      structures: {
        affirmative: {
          title: "Resumen de Fórmulas Clave",
          formula: "Presente Continuo: am/is/are + -ing | Pasado Continuo: was/were + -ing | Futuro Simple: will + base",
          parts: [
            { label: "Pres. Cont", color: "blue", example: "is reading" },
            { label: "Past Cont", color: "purple", example: "was reading" },
            { label: "Fut. Simple", color: "cyan", example: "will read" }
          ],
          examples: [
            { text: "Right now I am studying, yesterday I was studying, and tomorrow I will study.", audio: "Right now I am studying, yesterday I was studying, and tomorrow I will study.", translation: "Justo ahora estoy estudiando, ayer estaba estudiando y mañana estudiaré." }
          ]
        },
        negative: {
          title: "Negaciones Rápidas",
          formula: "isn't/aren't + -ing | wasn't/weren't + -ing | won't + base | don't/doesn't + base | didn't + base",
          parts: [
            { label: "Auxiliares", color: "rose", example: "isn't / wasn't / won't / doesn't / didn't" }
          ],
          examples: [
            { text: "I'm not doing it, I didn't do it, and I won't do it.", audio: "I'm not doing it, I didn't do it, and I won't do it.", translation: "No lo estoy haciendo, no lo hice y no lo haré." }
          ]
        },
        interrogative: {
          title: "Interrogaciones Clave",
          formula: "¿Are you doing? / ¿Were you doing? / ¿Will you do? / ¿Did you do?",
          parts: [
            { label: "Auxiliar al inicio", color: "purple", example: "Are / Were / Will / Did" }
          ],
          examples: [
            { text: "Were you sleeping when I called?", audio: "Were you sleeping when I called?", translation: "¿Estabas durmiendo cuando llamé?" }
          ]
        }
      },
      rules: [
        {
          title: "Consejo para el Examen",
          desc: "Busca siempre el 'time marker' (marcador de tiempo) en la oración:",
          items: [
            "**right now / look! / listen!** ➔ Presente Continuo",
            "**yesterday at [hora] / while / when** ➔ Pasado Continuo o Pasado Simple",
            "**tomorrow / next week / promise / think** ➔ Futuro Simple",
            "**every day / usually / always** ➔ Presente Simple"
          ]
        }
      ],
      timeMarkers: [
        { word: "Context is King", trans: "El contexto es el rey" }
      ],
      versus: {
        title: "¡Listo para el desafío!",
        desc: "Pasa a la pestaña de 'Práctica' para poner a prueba tu dominio de todos los tiempos verbales juntos.",
        comparison: []
      }
    },
    exercises: [
      {
        id: "mc-1",
        type: "multiple-choice",
        question: "¿Qué tiempo verbal corresponde? 'Shh! Be quiet, the teacher _______ the lesson.'",
        options: ["is explaining", "was explaining", "explains", "will explain"],
        correct: 0,
        explanation: "'Be quiet' (¡Guarda silencio!) indica que el hecho está ocurriendo en este preciso instante ➔ **Presente Continuo** ('is explaining').",
        audio: "Be quiet, the teacher is explaining the lesson."
      },
      {
        id: "mc-2",
        type: "multiple-choice",
        question: "'While Maria was reading a book, her brother _______ video games.'",
        options: ["was playing", "played", "is playing", "will play"],
        correct: 0,
        explanation: "Con 'While' expresamos dos acciones simultáneas que estaban en progreso al mismo tiempo en el pasado ➔ **Pasado Continuo** ('was playing').",
        audio: "While Maria was reading a book, her brother was playing video games."
      },
      {
        id: "mc-3",
        type: "multiple-choice",
        question: "'Don't worry about the dishes, I promise I _______ them later.'",
        options: ["will wash", "am washing", "was washing", "washed"],
        correct: 0,
        explanation: "Para promesas ('I promise') sobre hechos posteriores, se utiliza **Futuro Simple con will** ('will wash').",
        audio: "Don't worry about the dishes, I promise I will wash them later."
      },
      {
        id: "mc-4",
        type: "multiple-choice",
        question: "'I was walking home when suddenly a black cat _______ in front of me.'",
        options: ["jumped", "was jumping", "jumps", "is jumping"],
        correct: 0,
        explanation: "La acción de caminar era continua ('was walking'), pero el salto del gato fue una acción repentina y puntual en el pasado ➔ **Pasado Simple** ('jumped').",
        audio: "I was walking home when suddenly a black cat jumped in front of me."
      },
      {
        id: "mc-5",
        type: "scramble",
        question: "Ordena las palabras para formar la frase en Pasado Continuo interrumpido:",
        tokens: ["calling", "was", "He", "you", "when", "arrived", "you"],
        solution: ["He", "was", "calling", "you", "when", "you", "arrived"],
        translation: "Él te estaba llamando cuando tú llegaste.",
        explanation: "Acción en progreso: He was calling you + Conector: when + Acción puntual: you arrived."
      }
    ]
  }
];

// Hacer disponible globalmente
if (typeof window !== "undefined") {
  window.TENSES_DATA = TENSES_DATA;
}
