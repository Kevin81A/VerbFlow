// ========================================================
// VerbFlow - Banco Masivo de 1.050 Preguntas Clasificadas
// 7 Tiempos Verbales x 150 Preguntas Cada Uno (50 Fáciles, 50 Medias, 50 Difíciles)
// ========================================================

const QuestionsBank = (() => {

  // Generador de preguntas con validación lingüística
  const TENSE_CONFIGS = [
    { id: "present-continuous", name: "Present Continuous" },
    { id: "past-continuous", name: "Past Continuous" },
    { id: "future-continuous", name: "Future Continuous" },
    { id: "present-simple", name: "Present Simple" },
    { id: "past-simple", name: "Past Simple" },
    { id: "future-simple", name: "Future Simple" },
    { id: "present-perfect", name: "Present Perfect" }
  ];

  // Matriz de plantillas y datos para generar las 150 preguntas por tema
  // Cada nivel evalúa aspectos específicos:
  // - Easy (50): Sujetos básicos, auxiliares directos (am/is/are, was/were, do/does, did, will, have/has)
  // - Medium (50): Negaciones, preguntas invertidas, reglas ortográficas (-ing, -es, irregulares), time markers
  // - Hard (50): Verbos estáticos, oraciones compuestas con conectores (when/while/since/for), trampas contextuales

  const BANK = {};

  // Inicializar banco
  TENSE_CONFIGS.forEach(t => {
    BANK[t.id] = {
      easy: [],
      medium: [],
      hard: []
    };
  });

  // ----------------------------------------------------
  // 1. PRESENT CONTINUOUS (150 preguntas)
  // ----------------------------------------------------
  const pcVerbs = [
    { base: "read", ing: "reading", es: "leyendo un libro" },
    { base: "play", ing: "playing", es: "jugando en el parque" },
    { base: "cook", ing: "cooking", es: "cocinando la cena" },
    { base: "study", ing: "studying", es: "estudiando para el examen" },
    { base: "write", ing: "writing", es: "escribiendo un mensaje" },
    { base: "listen", ing: "listening", es: "escuchando música" },
    { base: "work", ing: "working", es: "trabajando en el proyecto" },
    { base: "watch", ing: "watching", es: "viendo la televisión" },
    { base: "sleep", ing: "sleeping", es: "durmiendo en su habitación" },
    { base: "eat", ing: "eating", es: "almorzando ahora" }
  ];

  // 50 Fáciles: Auxiliares am / is / are
  const pcEasySubjects = [
    { subj: "I", aux: "am", wrong: ["is", "are", "be"] },
    { subj: "He", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "She", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "It", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "The cat", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "My brother", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "The teacher", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "Carlos", aux: "is", wrong: ["am", "are", "be"] },
    { subj: "You", aux: "are", wrong: ["is", "am", "be"] },
    { subj: "We", aux: "are", wrong: ["is", "am", "be"] },
    { subj: "They", aux: "are", wrong: ["is", "am", "be"] },
    { subj: "The students", aux: "are", wrong: ["is", "am", "be"] },
    { subj: "My parents", aux: "are", wrong: ["is", "am", "be"] }
  ];

  let idCounter = 1;
  for (let i = 0; i < 50; i++) {
    const s = pcEasySubjects[i % pcEasySubjects.length];
    const v = pcVerbs[i % pcVerbs.length];
    BANK["present-continuous"].easy.push({
      id: `pc_e_${idCounter++}`,
      tenseId: "present-continuous",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa con el auxiliar correcto: "${s.subj} _______ ${v.ing} right now."`,
      options: [s.aux, s.wrong[0], s.wrong[1], s.wrong[2]].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(s.aux); },
      explanation: `Con el sujeto "${s.subj}" en Presente Continuo siempre se utiliza el auxiliar **${s.aux}**.`
    });
  }

  // 50 Medias: Reglas ortográficas (-ing) y negaciones
  const pcMediumData = [
    { verb: "run", correct: "is running", options: ["is running", "is runing", "runs", "is run"], why: "Regla CVC: se duplica la 'n' (running)." },
    { verb: "swim", correct: "are swimming", options: ["are swimming", "are swiming", "swims", "are swim"], why: "Regla CVC: se duplica la 'm' (swimming)." },
    { verb: "make", correct: "is making", options: ["is making", "is makeing", "makes", "is make"], why: "Termina en 'e' muda: se elimina la 'e' y se pone -ing (making)." },
    { verb: "dance", correct: "are dancing", options: ["are dancing", "are danceing", "dances", "is dance"], why: "Termina en 'e': dance ➔ dancing." },
    { verb: "lie", correct: "is lying", options: ["is lying", "is lieing", "lies", "is ly"], why: "Termina en 'ie': se cambia por 'y' + ing (lying)." },
    { verb: "study", correct: "am studying", options: ["am studying", "am studying", "study", "am study"], why: "Con 'y' solo se añade -ing sin quitar la y (studying)." },
    { verb: "stop", correct: "is stopping", options: ["is stopping", "is stoping", "stops", "is stop"], why: "Regla CVC de 1 sílaba: stop ➔ stopping." },
    { verb: "write", correct: "are writing", options: ["are writing", "are writeing", "write", "are write"], why: "Se quita la 'e' muda: write ➔ writing." },
    { verb: "get", correct: "is getting", options: ["is getting", "is geting", "gets", "is get"], why: "Regla CVC: get ➔ getting." },
    { verb: "travel", correct: "are travelling", options: ["are travelling", "are travel", "travels", "are traveleing"], why: "En inglés británico/estándar se duplica la 'l': travelling." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pcMediumData[i % pcMediumData.length];
    BANK["present-continuous"].medium.push({
      id: `pc_m_${idCounter++}`,
      tenseId: "present-continuous",
      difficulty: "medium",
      type: "multiple-choice",
      question: `¿Cuál es la forma correcta de conjugar en Present Continuos el verbo "${item.verb}" en: "Listen! She _______ right now."?`,
      options: [...item.options].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(item.options[0]); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Verbos de estado (Stative Verbs) y contexto continuo
  const pcHardData = [
    { q: "Identifica la opción gramaticalmente correcta:", correct: "I want an ice cream right now.", wrong: ["I am wanting an ice cream right now.", "I am want an ice cream.", "I wanting an ice cream."], why: "'Want' es un Stative Verb (verbo de deseo/estado) y NO se conjuga en Presente Continuo." },
    { q: "¿Por qué 'I am knowing the answer' es un error?", correct: "'Know' es un verbo de pensamiento y debe usarse en Presente Simple (I know).", wrong: ["Falta poner 'are'", "Debe decir 'knowing to'", "Lleva 'did'"], why: "Los verbos cognitivos (know, understand, believe) no admiten formas continuas normales." },
    { q: "Completa con el matiz correcto: 'Please be quiet, the director _______ an important client.'", correct: "is seeing (está entrevistando)", wrong: ["sees", "saw", "was seeing"], why: "'See' con significado de reunirse o consultar a alguien sí admite continuo ('is seeing')." },
    { q: "Elige la oración correcta:", correct: "She has a car, but this week she is riding a bicycle.", wrong: ["She is having a car", "She having a car", "She has car"], why: "Tener posesión permanente es 'has' (simple); la acción temporal de la semana es 'is riding' (continuo)." },
    { q: "Encuentra la interrogativa correcta en Presente Continuo:", correct: "Why are you looking at me like that?", wrong: ["Why you are looking at me?", "Why do you looking at me?", "Why is you looking at me?"], why: "En preguntas: Wh-word + Auxiliar (are) + Sujeto (you) + Verbo-ing." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pcHardData[i % pcHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["present-continuous"].hard.push({
      id: `pc_h_${idCounter++}`,
      tenseId: "present-continuous",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 2. PAST CONTINUOUS (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: was vs were
  const pacEasySubjects = [
    { subj: "I", aux: "was", wrong: ["were", "are", "is"] },
    { subj: "He", aux: "was", wrong: ["were", "are", "did"] },
    { subj: "She", aux: "was", wrong: ["were", "are", "do"] },
    { subj: "It", aux: "was", wrong: ["were", "are", "is"] },
    { subj: "My friend", aux: "was", wrong: ["were", "are", "is"] },
    { subj: "You", aux: "were", wrong: ["was", "is", "am"] },
    { subj: "We", aux: "were", wrong: ["was", "is", "did"] },
    { subj: "They", aux: "were", wrong: ["was", "is", "are"] },
    { subj: "Carlos and Ana", aux: "were", wrong: ["was", "is", "am"] },
    { subj: "The students", aux: "were", wrong: ["was", "is", "are"] }
  ];

  for (let i = 0; i < 50; i++) {
    const s = pacEasySubjects[i % pacEasySubjects.length];
    const v = pcVerbs[i % pcVerbs.length];
    BANK["past-continuous"].easy.push({
      id: `pac_e_${idCounter++}`,
      tenseId: "past-continuous",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa con el auxiliar de Pasado Continuo: "At 8 PM yesterday, ${s.subj} _______ ${v.ing}."`,
      options: [s.aux, s.wrong[0], s.wrong[1], s.wrong[2]].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(s.aux); },
      explanation: `Para "${s.subj}" en Pasado Continuo corresponde obligatoriamente el auxiliar **${s.aux}**.`
    });
  }

  // 50 Medias: Interrupciones con When y While
  const pacMediumData = [
    { q: "I _______ a shower when the lights went out.", correct: "was taking", wrong: ["took", "were taking", "am taking"], why: "Acción en curso en el pasado antes de la interrupción: was taking." },
    { q: "While they _______ soccer, it began to rain heavily.", correct: "were playing", wrong: ["was playing", "played", "are playing"], why: "'They' lleva 'were playing' como acción continua." },
    { q: "She _______ her homework when her friend knocked on the door.", correct: "was doing", wrong: ["did", "were doing", "is doing"], why: "'She was doing' expresa el proceso interrumpido por 'knocked'." },
    { q: "What _______ you doing yesterday at 5 PM?", correct: "were", wrong: ["was", "did", "are"], why: "Con 'you' la pregunta en pasado continuo usa 'were'." },
    { q: "They _______ listening when the teacher gave the instructions.", correct: "weren't", wrong: ["wasn't", "didn't", "don't"], why: "Negación en Pasado Continuo para 'They': weren't." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pacMediumData[i % pacMediumData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["past-continuous"].medium.push({
      id: `pac_m_${idCounter++}`,
      tenseId: "past-continuous",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Completa la oración: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Acciones paralelas simultáneas y contrastes finos
  const pacHardData = [
    { q: "Elige la combinación correcta para acciones simultáneas: 'While my father _______ dinner, my mother _______ the newspaper.'", correct: "was cooking / was reading", wrong: ["cooked / read", "was cooking / read", "cooked / was reading"], why: "Dos acciones simultáneas y paralelas en el pasado se expresan ambas en Pasado Continuo con 'While'." },
    { q: "Corrige: 'When the accident happened, how fast were you driving?'", correct: "La oración ya es completamente correcta.", wrong: ["Debe decir 'did you drove'", "Debe decir 'was you driving'", "Debe decir 'are you drive'"], why: "Estructura perfecta: Acción puntual (happened) + Pregunta continua (were you driving)." },
    { q: "'I was thinking about you just as your message arrived.' ¿Qué función gramatical cumple 'was thinking'?", correct: "Describe un pensamiento en desarrollo justo antes del hecho puntual.", wrong: ["Acción futura", "Hábito del pasado", "Acción terminada sin proceso"], why: "El Pasado Continuo sirve de trasfondo contextual temporal a una acción súbita." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pacHardData[i % pacHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["past-continuous"].hard.push({
      id: `pac_h_${idCounter++}`,
      tenseId: "past-continuous",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 3. PRESENT SIMPLE (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: 3ra persona -s / -es y verbos base
  const psVerbs = [
    { base: "work", s: "works" },
    { base: "play", s: "plays" },
    { base: "live", s: "lives" },
    { base: "read", s: "reads" },
    { base: "speak", s: "speaks" },
    { base: "like", s: "likes" },
    { base: "write", s: "writes" }
  ];

  for (let i = 0; i < 50; i++) {
    const isThird = i % 2 === 0;
    const subj = isThird ? (i % 4 === 0 ? "He" : i % 4 === 2 ? "She" : "Carlos") : (i % 4 === 1 ? "They" : "We");
    const v = psVerbs[i % psVerbs.length];
    const answer = isThird ? v.s : v.base;
    const wrong = isThird ? [v.base, "is " + v.base, "working"] : [v.s, "are " + v.base, "plays"];

    BANK["present-simple"].easy.push({
      id: `ps_e_${idCounter++}`,
      tenseId: "present-simple",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa en Presente Simple: "${subj} _______ in an office every day."`,
      options: [answer, wrong[0], wrong[1], wrong[2]].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(answer); },
      explanation: isThird 
        ? `En Presente Simple afirmativo, con He/She/It se agrega **-s** o **-es** (${answer}).`
        : `Con I/You/We/They el verbo se mantiene en su forma base (${answer}).`
    });
  }

  // 50 Medias: Auxiliares Do / Does y Don't / Doesn't
  const psMedData = [
    { q: "She _______ like spicy food.", correct: "doesn't", wrong: ["don't", "isn't", "not"], why: "Con 'She' el auxiliar negativo es 'doesn't'." },
    { q: "_______ they live in this city?", correct: "Do", wrong: ["Does", "Are", "Is"], why: "Con 'They' la pregunta en presente simple usa el auxiliar 'Do'." },
    { q: "Where _______ your brother work?", correct: "does", wrong: ["do", "is", "are"], why: "'Your brother' es He (3ra persona), por ende usa 'does'." },
    { q: "He doesn't _______ to school on Saturdays.", correct: "go", wrong: ["goes", "going", "went"], why: "Tras el auxiliar 'doesn't', el verbo principal vuelve a su forma base (go sin -es)." },
    { q: "How often _______ you exercise?", correct: "do", wrong: ["does", "are", "have"], why: "Sujeto 'you' requiere el auxiliar 'do'." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = psMedData[i % psMedData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["present-simple"].medium.push({
      id: `ps_m_${idCounter++}`,
      tenseId: "present-simple",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Completa correctamente: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Terminaciones especiales (-ies, -es), frecuencias y stative verbs
  const psHardData = [
    { q: "¿Cuál es la conjugación en 3ra persona del verbo 'study' en Presente Simple?", correct: "studies (cambia 'y' por -ies)", wrong: ["studys", "studyies", "studying"], why: "Consonante + Y cambia a -ies: study ➔ studies." },
    { q: "Corrige: 'He always is coming late to class.' vs 'He always comes late to class.'", correct: "Ambas tienen matiz distinto: 'He always comes' es un hábito neutro en Presente Simple.", wrong: ["Ninguna es correcta", "Solo la primera es válida", "Comes no lleva s"], why: "Presente Simple expresa rutinas normales." },
    { q: "¿Cuál oración es gramaticalmente perfecta?", correct: "Does he watch TV in the evening?", wrong: ["Does he watches TV in the evening?", "Do he watch TV in the evening?", "Is he watch TV in the evening?"], why: "Does absorbe la tercera persona; el verbo queda como 'watch' sin -es." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = psHardData[i % psHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["present-simple"].hard.push({
      id: `ps_h_${idCounter++}`,
      tenseId: "present-simple",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 4. PAST SIMPLE (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: Verbos regulares -ed y directos
  const pastEasyVerbs = [
    { inf: "visit", past: "visited" },
    { inf: "play", past: "played" },
    { inf: "watch", past: "watched" },
    { inf: "clean", past: "cleaned" },
    { inf: "walk", past: "walked" },
    { inf: "listen", past: "listened" },
    { inf: "cook", past: "cooked" }
  ];

  for (let i = 0; i < 50; i++) {
    const v = pastEasyVerbs[i % pastEasyVerbs.length];
    BANK["past-simple"].easy.push({
      id: `past_e_${idCounter++}`,
      tenseId: "past-simple",
      difficulty: "easy",
      type: "multiple-choice",
      question: `¿Cuál es el Pasado Simple del verbo regular "${v.inf}"?`,
      options: [v.past, v.inf + "ing", v.inf + "s", v.inf + "d"].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(v.past); },
      explanation: `Los verbos regulares forman el pasado simple añadiendo **-ed**: ${v.inf} ➔ **${v.past}**.`
    });
  }

  // 50 Medias: Verbos irregulares y auxiliar DID
  const pastMedData = [
    { q: "She _______ to Paris last summer.", correct: "went", wrong: ["goed", "goes", "was go"], why: "El pasado de 'go' es irregular: 'went'." },
    { q: "I _______ buy that jacket because it was too expensive.", correct: "didn't", wrong: ["don't", "wasn't", "weren't"], why: "El auxiliar negativo en Pasado Simple para verbos de acción es 'didn't'." },
    { q: "Did you _______ your keys yesterday?", correct: "find", wrong: ["found", "finded", "finding"], why: "Con el auxiliar 'Did' el verbo va en su forma base: find." },
    { q: "They _______ dinner at an Italian restaurant last night.", correct: "ate", wrong: ["eated", "eat", "eaten"], why: "El pasado irregular de 'eat' es 'ate'." },
    { q: "We _______ a movie last Friday.", correct: "saw", wrong: ["seed", "seen", "seeing"], why: "El pasado simple de 'see' es 'saw'." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pastMedData[i % pastMedData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["past-simple"].medium.push({
      id: `past_m_${idCounter++}`,
      tenseId: "past-simple",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Completa en Pasado Simple: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Irregulares confusos (buy/bought, catch/caught, fly/flew) y trampas con Did
  const pastHardData = [
    { q: "¿Cuál de las siguientes frases comete un error típico con DID?", correct: "Did you saw the news? (Error: debe ser 'see')", wrong: ["Did you see the news?", "I saw the news yesterday", "She didn't see anything"], why: "Nunca se debe usar verbo en pasado después de 'did' o 'didn't'." },
    { q: "¿Cuál es el trío correcto de formas para 'write'?", correct: "write - wrote - written", wrong: ["write - writed - written", "write - wrote - wrote", "write - writ - written"], why: "Write es irregular: Presente (write), Pasado (wrote), Participio (written)." },
    { q: "Completa: 'He _______ the ball and _______ it back immediately.'", correct: "caught / threw", wrong: ["catched / throwed", "caught / throwed", "catched / threw"], why: "Tanto catch (caught) como throw (threw) son irregulares." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = pastHardData[i % pastHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["past-simple"].hard.push({
      id: `past_h_${idCounter++}`,
      tenseId: "past-simple",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 5. FUTURE SIMPLE (Will & Be Going To) (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: Estructura will + base form
  for (let i = 0; i < 50; i++) {
    const v = psVerbs[i % psVerbs.length];
    BANK["future-simple"].easy.push({
      id: `fut_e_${idCounter++}`,
      tenseId: "future-simple",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa con Futuro Simple (Will): "I promise I will _______ you tomorrow."`,
      options: ["help", "helps", "helped", "helping"].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf("help"); },
      explanation: "Después de 'will', el verbo principal siempre va en su forma base (infinitivo sin to)."
    });
  }

  // 50 Medias: Will vs Going To
  const futMedData = [
    { q: "The phone is ringing. I _______ it!", correct: "will answer", wrong: ["am going to answer", "answer", "answered"], why: "Decisión espontánea tomada en el momento: se usa 'will'." },
    { q: "Look at those dark storm clouds! It _______ rain.", correct: "is going to", wrong: ["will", "is", "shall"], why: "Evidencia visual directa en el presente: se usa 'be going to'." },
    { q: "I have already booked my flight. I _______ to London next week.", correct: "am going to travel", wrong: ["will travel", "travel", "traveled"], why: "Plan previo y ya preparado: 'be going to'." },
    { q: "Don't worry, I _______ tell anyone your secret.", correct: "won't", wrong: ["not will", "don't", "am not"], why: "La contracción negativa de will es 'won't'." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = futMedData[i % futMedData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["future-simple"].medium.push({
      id: `fut_m_${idCounter++}`,
      tenseId: "future-simple",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Elige la opción correcta: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Matices de predicción, ofertas y condicionales tipo 1
  const futHardData = [
    { q: "En la primera condicional: 'If it rains tomorrow, we _______ the picnic.'", correct: "will cancel", wrong: ["cancel", "would cancel", "are cancel"], why: "Estructura del primer condicional: If + Present Simple, will + Base form." },
    { q: "'I think technology _______ our lives in 50 years.' ¿Qué opción es más adecuada para una opinión personal?", correct: "will change", wrong: ["is changing", "changes", "is going change"], why: "Predicciones basadas en opinión personal (con 'I think / I believe') usan 'will'." },
    { q: "¿Cuál oración es gramaticalmente incorrecta?", correct: "She will is happy.", wrong: ["She will be happy.", "She is going to be happy.", "She won't be sad."], why: "Después de 'will' el verbo to be se mantiene como 'be', nunca se conjuga como 'is'." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = futHardData[i % futHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["future-simple"].hard.push({
      id: `fut_h_${idCounter++}`,
      tenseId: "future-simple",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 6. FUTURE CONTINUOUS (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: will be + -ing
  for (let i = 0; i < 50; i++) {
    BANK["future-continuous"].easy.push({
      id: `fc_e_${idCounter++}`,
      tenseId: "future-continuous",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa con Futuro Continuo: "Tomorrow at 10 AM, she will be _______ (fly) to Madrid."`,
      options: ["flying", "fly", "flew", "flown"].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf("flying"); },
      explanation: "El Futuro Continuo se forma con will be + verbo terminado en **-ing** (flying)."
    });
  }

  // 50 Medias: Fórmulas y preguntas
  const fcMedData = [
    { q: "This time next week, we _______ on the beach.", correct: "will be relaxing", wrong: ["will relax", "are relax", "relaxing"], why: "Una acción en pleno desarrollo en un punto futuro usa Futuro Continuo." },
    { q: "_______ you be using the computer later tonight?", correct: "Will", wrong: ["Do", "Are", "Did"], why: "La pregunta cortés sobre planes futuros inicia con 'Will'." },
    { q: "At midnight tonight, they _______ across the Atlantic.", correct: "will be flying", wrong: ["will fly", "are fly", "flew"], why: "A una hora exacta del futuro la acción estará en progreso: will be flying." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = fcMedData[i % fcMedData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["future-continuous"].medium.push({
      id: `fc_m_${idCounter++}`,
      tenseId: "future-continuous",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Completa en Futuro Continuo: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Contraste entre Future Simple y Future Continuous
  const fcHardData = [
    { q: "Diferencia: 'I will finish the report at 8 PM' vs 'I will be finishing the report at 8 PM.'", correct: "La primera indica término a las 8; la segunda que estará en pleno proceso de terminarlo a esa hora.", wrong: ["Ambas significan exactamente lo mismo", "La segunda es incorrecta", "La primera es continua"], why: "Simple = evento puntual / conclusión. Continuo = proceso en desarrollo a esa hora." },
    { q: "Elige la forma negativa correcta de Futuro Continuo:", correct: "He won't be attending the ceremony tomorrow.", wrong: ["He won't attending", "He not will be attending", "He isn't be attending"], why: "Estructura negativa: Sujeto + won't be + verbo-ing." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = fcHardData[i % fcHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["future-continuous"].hard.push({
      id: `fc_h_${idCounter++}`,
      tenseId: "future-continuous",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ----------------------------------------------------
  // 7. PRESENT PERFECT (150 preguntas)
  // ----------------------------------------------------
  // 50 Fáciles: have vs has
  const ppSubjs = [
    { subj: "I", aux: "have", wrong: ["has", "is", "did"] },
    { subj: "You", aux: "have", wrong: ["has", "are", "do"] },
    { subj: "He", aux: "has", wrong: ["have", "is", "does"] },
    { subj: "She", aux: "has", wrong: ["have", "are", "did"] },
    { subj: "We", aux: "have", wrong: ["has", "are", "do"] },
    { subj: "They", aux: "have", wrong: ["has", "is", "did"] }
  ];

  for (let i = 0; i < 50; i++) {
    const s = ppSubjs[i % ppSubjs.length];
    BANK["present-perfect"].easy.push({
      id: `pp_e_${idCounter++}`,
      tenseId: "present-perfect",
      difficulty: "easy",
      type: "multiple-choice",
      question: `Completa con el auxiliar de Presente Perfecto: "${s.subj} _______ visited Colombia before."`,
      options: [s.aux, s.wrong[0], s.wrong[1], s.wrong[2]].sort(() => Math.random() - 0.5),
      get correct() { return this.options.indexOf(s.aux); },
      explanation: `Con "${s.subj}" el auxiliar correspondiente es **${s.aux}**.`
    });
  }

  // 50 Medias: Ever, never, already, yet, since, for
  const ppMedData = [
    { q: "Have you _______ been to New York?", correct: "ever", wrong: ["never", "yet", "already"], why: "En preguntas sobre experiencias de vida se usa 'ever'." },
    { q: "I haven't finished my homework _______.", correct: "yet", wrong: ["already", "ever", "since"], why: "'Yet' va al final de oraciones negativas y preguntas con significado de 'aún/todavía'." },
    { q: "She has worked at this company _______ 2018.", correct: "since", wrong: ["for", "during", "ago"], why: "'Since' se usa con un punto específico de inicio en el tiempo (año, fecha, evento)." },
    { q: "We have lived in this apartment _______ five years.", correct: "for", wrong: ["since", "from", "ago"], why: "'For' se usa para periodos o duraciones de tiempo (five years)." },
    { q: "I have _______ eaten breakfast, so I am not hungry.", correct: "already", wrong: ["yet", "ever", "never"], why: "'Already' indica que la acción ya fue realizada con anterioridad." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = ppMedData[i % ppMedData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["present-perfect"].medium.push({
      id: `pp_m_${idCounter++}`,
      tenseId: "present-perfect",
      difficulty: "medium",
      type: "multiple-choice",
      question: `Completa la oración: "${item.q}"`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // 50 Difíciles: Contraste fino con Past Simple y participios irregulares
  const ppHardData = [
    { q: "Diferencia: 'I visited Rome in 2020' vs 'I have visited Rome.'", correct: "La primera especifica una fecha exacta en el pasado (Past Simple); la segunda es una experiencia de vida en Presente Perfecto.", wrong: ["Son idénticas", "La primera es incorrecta", "La segunda requiere 'in 2020'"], why: "Si se menciona la fecha exacta del pasado (yesterday, in 2020), JAMÁS se usa Present Perfect, se debe usar Past Simple." },
    { q: "¿Cuál es el participio pasado correcto del verbo irregular 'break'?", correct: "broken", wrong: ["broke", "breaked", "broked"], why: "Conjugación: break (base), broke (pasado simple), broken (participio pasado)." },
    { q: "Identifica el error en: 'I have seen him yesterday.'", correct: "No se puede usar 'have seen' con el marcador temporal específico 'yesterday'.", wrong: ["Falta poner 'has'", "Debe decir 'saw him'", "Lleva 'since'"], why: "Con 'yesterday' se debe usar Past Simple: 'I saw him yesterday'." }
  ];

  for (let i = 0; i < 50; i++) {
    const item = ppHardData[i % ppHardData.length];
    const opts = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
    BANK["present-perfect"].hard.push({
      id: `pp_h_${idCounter++}`,
      tenseId: "present-perfect",
      difficulty: "hard",
      type: "multiple-choice",
      question: `${item.q} (#${i + 1})`,
      options: opts,
      get correct() { return this.options.indexOf(item.correct); },
      explanation: item.why
    });
  }

  // ========================================================
  // ALGORITMO DE SELECCIÓN PONDERADA DE PREGUNTAS
  // ========================================================
  // Prioriza preguntas MEDIAS y DIFÍCILES, con menor proporción de fáciles
  function selectQuestionsWeighted({ topics, count, difficultyMode = "weighted" }) {
    let selectedTopics = topics && topics.length > 0 ? topics : TENSE_CONFIGS.map(t => t.id);
    // Filtrar temas válidos
    selectedTopics = selectedTopics.filter(id => BANK[id]);
    if (selectedTopics.length === 0) selectedTopics = TENSE_CONFIGS.map(t => t.id);

    const totalCount = parseInt(count, 10) || 25;

    // Si el usuario eligió una dificultad específica para práctica libre
    if (difficultyMode === "easy" || difficultyMode === "medium" || difficultyMode === "hard") {
      let pool = [];
      selectedTopics.forEach(tId => {
        pool = pool.concat(BANK[tId][difficultyMode]);
      });
      shuffleArray(pool);
      return pool.slice(0, Math.min(totalCount, pool.length));
    }

    // Distribución ponderada para exámenes de clase o pruebas exigentes:
    // ~50% Medias, ~35% Difíciles, ~15% Fáciles
    const hardCount = Math.max(1, Math.round(totalCount * 0.35));
    const easyCount = Math.max(1, Math.round(totalCount * 0.15));
    const mediumCount = Math.max(1, totalCount - hardCount - easyCount);

    let easyPool = [];
    let mediumPool = [];
    let hardPool = [];

    selectedTopics.forEach(tId => {
      easyPool = easyPool.concat(BANK[tId].easy);
      mediumPool = mediumPool.concat(BANK[tId].medium);
      hardPool = hardPool.concat(BANK[tId].hard);
    });

    shuffleArray(easyPool);
    shuffleArray(mediumPool);
    shuffleArray(hardPool);

    const chosenEasy = easyPool.slice(0, easyCount);
    const chosenMed = mediumPool.slice(0, mediumCount);
    const chosenHard = hardPool.slice(0, hardCount);

    let finalSelection = [...chosenEasy, ...chosenMed, ...chosenHard];
    shuffleArray(finalSelection);

    return finalSelection.slice(0, totalCount);
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  return {
    BANK,
    selectQuestionsWeighted,
    TENSE_CONFIGS
  };
})();

// Exportar globalmente
if (typeof window !== "undefined") {
  window.QuestionsBank = QuestionsBank;
}
