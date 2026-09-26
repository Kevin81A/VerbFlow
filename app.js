// ========================================================
// VerbFlow - Application Engine
// Control de Modos (Estudio / Práctica), Pronunciación de Audio,
// Motor de Ejercicios y Persistencia Local
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Estado Global
  const state = {
    currentTenseId: "present-continuous",
    currentMode: "study", // 'study' | 'practice'
    currentStructTab: "affirmative",
    practiceIndex: 0,
    practiceScore: 0,
    practiceTotal: 0,
    isAnswerChecked: false,
    selectedScramble: [],
    availableScramble: [],
    userStats: {
      xp: 0,
      streak: 0,
      completedTenses: {}
    }
  };

  // Cargar estadísticas de LocalStorage
  function loadStats() {
    const saved = localStorage.getItem("verbflow_stats");
    if (saved) {
      try {
        state.userStats = JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar estadísticas", e);
      }
    }
    updateStatsDisplay();
  }

  function saveStats() {
    localStorage.setItem("verbflow_stats", JSON.stringify(state.userStats));
    updateStatsDisplay();
    renderSidebar();
  }

  function updateStatsDisplay() {
    const xpEl = document.getElementById("user-xp");
    const streakEl = document.getElementById("user-streak");
    if (xpEl) xpEl.textContent = `${state.userStats.xp || 0} XP`;
    if (streakEl) streakEl.textContent = `🔥 ${state.userStats.streak || 0}`;
  }

  // Sintetizador de voz en inglés nativo
  function speakEnglish(text, btnElement) {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta reproducción de voz por speech API.");
      return;
    }

    window.speechSynthesis.cancel(); // Detener anteriores
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88; // Velocidad pedagógica clara

    // Seleccionar una voz nativa en inglés si está disponible
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (btnElement) {
      btnElement.classList.add("speaking");
      utterance.onend = () => btnElement.classList.remove("speaking");
      utterance.onerror = () => btnElement.classList.remove("speaking");
    }

    window.speechSynthesis.speak(utterance);
  }

  // Obtener tiempo verbal activo
  function getCurrentTense() {
    return window.TENSES_DATA.find(t => t.id === state.currentTenseId) || window.TENSES_DATA[0];
  }

  // ========================================================
  // RENDERIZADO DEL SIDEBAR
  // ========================================================
  function renderSidebar() {
    const sidebarContent = document.getElementById("sidebar-tenses-list");
    if (!sidebarContent) return;

    sidebarContent.innerHTML = "";

    const categories = [
      { id: "continuous", label: "Tiempos Continuos / Progresivos" },
      { id: "simple", label: "Tiempos Simples" },
      { id: "perfect", label: "Tiempos Perfectos" },
      { id: "challenge", label: "Evaluación Global" }
    ];

    categories.forEach(cat => {
      const items = window.TENSES_DATA.filter(t => t.category === cat.id);
      if (items.length === 0) return;

      const catLabel = document.createElement("div");
      catLabel.className = "sidebar-category-label";
      catLabel.textContent = cat.label;
      sidebarContent.appendChild(catLabel);

      items.forEach(tense => {
        const isCurrent = tense.id === state.currentTenseId;
        const isCompleted = state.userStats.completedTenses[tense.id];

        const btn = document.createElement("button");
        btn.className = `tense-item-btn ${isCurrent ? "active" : ""}`;
        btn.innerHTML = `
          <div class="tense-btn-left">
            <span class="tense-btn-dot" style="background-color: ${tense.tagColor};"></span>
            <div class="tense-btn-info">
              <span class="tense-btn-name">${tense.name}</span>
              <span class="tense-btn-es">${tense.nameEs}</span>
            </div>
          </div>
          <span class="tense-progress-badge ${isCompleted ? "completed" : ""}">
            ${isCompleted ? "✓ Listo" : tense.exercises.length + " ejer."}
          </span>
        `;

        btn.addEventListener("click", () => {
          state.currentTenseId = tense.id;
          state.practiceIndex = 0;
          state.practiceScore = 0;
          state.isAnswerChecked = false;
          renderSidebar();
          renderHeader();
          if (state.currentMode === "study") {
            renderStudyMode();
          } else {
            renderPracticeMode();
          }

          // Cerrar sidebar en móviles
          document.querySelector(".sidebar")?.classList.remove("open");
        });

        sidebarContent.appendChild(btn);
      });
    });
  }

  // ========================================================
  // RENDERIZADO DEL HEADER
  // ========================================================
  function renderHeader() {
    const current = getCurrentTense();
    const titleEl = document.getElementById("header-tense-title");
    const badgeEl = document.getElementById("header-tense-badge");

    if (titleEl) {
      titleEl.innerHTML = `${current.name} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">(${current.nameEs})</span>`;
    }
    if (badgeEl) {
      badgeEl.textContent = current.badge;
      badgeEl.style.backgroundColor = `${current.tagColor}22`;
      badgeEl.style.color = current.tagColor;
      badgeEl.style.border = `1px solid ${current.tagColor}55`;
    }

    // Actualizar tabs de estudio vs práctica
    document.querySelectorAll(".mode-tab-btn").forEach(btn => {
      const mode = btn.dataset.mode;
      if (mode === state.currentMode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // ========================================================
  // MODO ESTUDIO: TEORÍA, LÍNEA DE TIEMPO, FÓRMULAS, REGLAS
  // ========================================================
  function renderStudyMode() {
    const container = document.getElementById("main-view-container");
    const tense = getCurrentTense();
    const study = tense.study;

    container.innerHTML = `
      <div class="fade-in">
        <!-- Hero Card con Concepto -->
        <div class="study-hero-card">
          <div class="study-hero-header">
            <div>
              <h2 class="study-title">${tense.name}</h2>
              <p class="study-subtitle">${study.concept}</p>
            </div>
          </div>

          <!-- Línea de tiempo visual interactiva -->
          <div class="timeline-container">
            <div class="timeline-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Línea Temporal de la Acción
            </div>
            <div class="timeline-track">
              <div class="timeline-line"></div>
              
              <div class="timeline-point ${tense.timeline.highlight === 'past' || tense.timeline.highlight === 'past-now' || tense.timeline.highlight === 'all' ? 'active' : ''}">
                <div class="timeline-node"></div>
                <span class="timeline-label">Pasado</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${tense.timeline.past}</span>
              </div>

              <div class="timeline-point ${tense.timeline.highlight === 'now' || tense.timeline.highlight === 'past-now' || tense.timeline.highlight === 'all' ? 'active' : ''}">
                <div class="timeline-node"></div>
                <span class="timeline-label">Presente (Ahora)</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${tense.timeline.now}</span>
              </div>

              <div class="timeline-point ${tense.timeline.highlight === 'future' || tense.timeline.highlight === 'all' ? 'active' : ''}">
                <div class="timeline-node"></div>
                <span class="timeline-label">Futuro</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${tense.timeline.future}</span>
              </div>
            </div>
            <div class="timeline-action-banner">
              🎯 <strong>Foco:</strong> ${tense.timeline.actionText}
            </div>
          </div>
        </div>

        <!-- Casos de Uso y Ejemplos con Audio -->
        <div class="study-section">
          <h3 class="section-heading">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            ¿Cuándo se usa exactamente?
          </h3>
          <div class="use-cases-grid">
            ${study.whenToUse.map(item => `
              <div class="use-case-card">
                <div>
                  <h4 class="use-case-title">${item.title}</h4>
                  <p class="use-case-desc">${item.desc}</p>
                </div>
                <div class="example-box">
                  <div class="example-text-group">
                    <span class="example-en">${item.example}</span>
                    <span class="example-es">${item.translation}</span>
                  </div>
                  <button class="audio-btn" data-audio="${item.audio}" title="Escuchar pronunciación nativa">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Fórmulas y Estructuras Gramaticales (+ / - / ?) -->
        <div class="study-section">
          <h3 class="section-heading">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Fórmulas y Estructuras Paso a Paso
          </h3>
          
          <div class="structure-cards-tabs">
            <button class="struct-tab-btn ${state.currentStructTab === 'affirmative' ? 'active' : ''}" data-struct="affirmative">
              Afirmativa (+)
            </button>
            <button class="struct-tab-btn ${state.currentStructTab === 'negative' ? 'active' : ''}" data-struct="negative">
              Negativa (-)
            </button>
            <button class="struct-tab-btn ${state.currentStructTab === 'interrogative' ? 'active' : ''}" data-struct="interrogative">
              Pregunta (?)
            </button>
          </div>

          <div id="structure-content-box">
            <!-- Se inyecta dinámicamente según la pestaña seleccionada -->
          </div>
        </div>

        <!-- Reglas Ortográficas y Secretos Clave -->
        <div class="study-section">
          <h3 class="section-heading">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Reglas Clave y Errores Típicos
          </h3>
          <div class="rules-container">
            ${study.rules.map(rule => `
              <div class="rule-box">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  ${rule.title}
                </h4>
                <p>${rule.desc}</p>
                <ul class="rule-list">
                  ${rule.items.map(it => `<li>${formatMarkdownBold(it)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Palabras Clave / Marcadores Temporales -->
        <div class="study-section">
          <h3 class="section-heading">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            Marcadores de Tiempo (Time Markers)
          </h3>
          <p style="color:var(--text-secondary); margin-bottom:12px; font-size:0.9rem;">
            Cuando veas estas palabras en una oración o conversación, sabrás de inmediato qué tiempo verbal usar:
          </p>
          <div class="time-markers-grid">
            ${study.timeMarkers.map(tm => `
              <div class="time-marker-pill">
                <strong>${tm.word}</strong>
                <span>(${tm.trans})</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Comparativa Versus si existe -->
        ${study.versus && study.versus.comparison.length > 0 ? `
          <div class="study-section">
            <h3 class="section-heading">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              ${study.versus.title}
            </h3>
            <div class="versus-card">
              <p style="color:var(--text-secondary);">${study.versus.desc}</p>
              <table class="versus-table">
                <thead>
                  <tr>
                    <th>Aspecto</th>
                    <th>Comparación Directa</th>
                  </tr>
                </thead>
                <tbody>
                  ${study.versus.comparison.map(c => `
                    <tr>
                      <td style="font-weight:700; color:#60a5fa;">${c.aspect}</td>
                      <td>
                        <div style="margin-bottom:4px;">${c.tenseA}</div>
                        <div style="color:var(--text-secondary);">${c.tenseB}</div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- Banner para pasar a la práctica -->
        <div class="go-practice-banner">
          <div>
            <h3 style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin-bottom:4px;">
              ¿Listo para poner a prueba lo aprendido?
            </h3>
            <p style="color:var(--text-secondary); font-size:0.95rem;">
              Tienes ${tense.exercises.length} ejercicios interactivos diseñados para afianzar este tiempo verbal.
            </p>
          </div>
          <button class="go-practice-btn" id="start-practice-btn">
            ¡Ir a la Práctica Ahora!
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    // Renderizar pestaña activa de estructuras
    renderStructureTab();

    // Eventos de botones de audio
    container.querySelectorAll(".audio-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.audio;
        speakEnglish(text, btn);
      });
    });

    // Eventos de pestañas de fórmulas (+, -, ?)
    container.querySelectorAll(".struct-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".struct-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentStructTab = btn.dataset.struct;
        renderStructureTab();
      });
    });

    // Evento botón de inicio de práctica
    const practiceBtn = document.getElementById("start-practice-btn");
    if (practiceBtn) {
      practiceBtn.addEventListener("click", () => {
        switchMode("practice");
      });
    }
  }

  // Renderizar la caja de estructura (+, -, ?)
  function renderStructureTab() {
    const box = document.getElementById("structure-content-box");
    if (!box) return;

    const tense = getCurrentTense();
    const struct = tense.study.structures[state.currentStructTab];
    if (!struct) return;

    box.innerHTML = `
      <div class="formula-card fade-in">
        <div class="formula-banner">
          <div class="formula-text">${struct.formula}</div>
        </div>

        <div class="formula-components-flex">
          ${struct.parts.map(part => `
            <div class="formula-chip ${part.color}">
              <span class="chip-label">${part.label}</span>
              <span class="chip-example">${part.example}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:20px;">
          <h5 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px; font-weight:700;">
            Ejemplos en contexto con audio:
          </h5>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${struct.examples.map(ex => `
              <div class="example-box">
                <div class="example-text-group">
                  <span class="example-en">${ex.text}</span>
                  <span class="example-es">${ex.translation}</span>
                </div>
                <button class="audio-btn" data-audio="${ex.audio}" title="Escuchar pronunciación">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    box.querySelectorAll(".audio-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        speakEnglish(btn.dataset.audio, btn);
      });
    });
  }

  // ========================================================
  // MODO PRÁCTICA: EJERCICIOS INTERACTIVOS CON FEEDBACK
  // ========================================================
  function renderPracticeMode() {
    const container = document.getElementById("main-view-container");
    const tense = getCurrentTense();
    const exercises = tense.exercises;

    // Si ya completó todos los ejercicios de este tiempo verbal
    if (state.practiceIndex >= exercises.length) {
      renderPracticeResults();
      return;
    }

    const currentEx = exercises[state.practiceIndex];
    state.isAnswerChecked = false;
    state.selectedScramble = [];
    state.availableScramble = currentEx.type === "scramble" ? [...currentEx.tokens] : [];

    const progressPercent = Math.round((state.practiceIndex / exercises.length) * 100);

    container.innerHTML = `
      <div class="practice-container fade-in">
        <!-- Barra de Progreso Superior -->
        <div class="practice-header-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="question-counter">
            Pregunta ${state.practiceIndex + 1} de ${exercises.length}
          </span>
        </div>

        <!-- Tarjeta del Ejercicio -->
        <div class="exercise-card">
          <span class="exercise-type-tag">
            ${getExerciseTypeName(currentEx.type)}
          </span>

          <h2 class="exercise-prompt">${currentEx.question}</h2>

          <!-- Área dinámica según el tipo de ejercicio -->
          <div id="exercise-interactive-area"></div>

          <!-- Banner de Feedback / Explicación inmediata -->
          <div class="feedback-banner" id="feedback-banner">
            <div class="feedback-header">
              <span class="feedback-title" id="feedback-title"></span>
              <button class="audio-btn" id="feedback-audio-btn" style="display:none;" title="Escuchar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </button>
            </div>
            <p class="feedback-explanation" id="feedback-explanation"></p>
            <div class="feedback-actions">
              <button class="next-question-btn" id="next-question-btn">
                Siguiente Ejercicio ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    renderExerciseInteraction(currentEx);
  }

  function getExerciseTypeName(type) {
    switch (type) {
      case "multiple-choice": return "Opción Múltiple";
      case "scramble": return "Ordenar la Oración";
      case "fill-blank": return "Completar la Palabra";
      case "spot-mistake": return "Caza de Errores";
      default: return "Ejercicio Práctico";
    }
  }

  function renderExerciseInteraction(ex) {
    const area = document.getElementById("exercise-interactive-area");
    if (!area) return;

    if (ex.type === "multiple-choice" || ex.type === "spot-mistake") {
      area.innerHTML = `
        <div class="options-grid">
          ${ex.options.map((opt, idx) => `
            <button class="option-btn" data-index="${idx}">
              <span>${opt}</span>
              <span class="option-indicator" style="font-size:0.85rem; color:var(--text-muted);">Elegir</span>
            </button>
          `).join('')}
        </div>
      `;

      area.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (state.isAnswerChecked) return;
          const chosenIdx = parseInt(btn.dataset.index, 10);
          checkMultipleChoiceAnswer(chosenIdx, ex);
        });
      });
    } else if (ex.type === "scramble") {
      renderScrambleZones(ex);
    } else if (ex.type === "fill-blank") {
      area.innerHTML = `
        <div class="fill-blank-box">
          <div class="fill-input-row">
            <input type="text" id="fill-blank-input" class="fill-input" placeholder="Escribe tu respuesta aquí..." autocomplete="off" autofocus />
            <button class="fill-submit-btn" id="fill-submit-btn">Comprobar</button>
          </div>
          ${ex.hint ? `
            <div class="fill-hint-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <strong>Pista:</strong> ${ex.hint}
            </div>
          ` : ''}
        </div>
      `;

      const input = document.getElementById("fill-blank-input");
      const submitBtn = document.getElementById("fill-submit-btn");

      const checkFill = () => {
        if (state.isAnswerChecked) return;
        const val = input.value.trim().toLowerCase();
        if (!val) return;
        const isCorrect = ex.accepted.map(a => a.toLowerCase()).includes(val);
        evaluateAnswer(isCorrect, ex);
      };

      submitBtn.addEventListener("click", checkFill);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkFill();
      });
    }
  }

  // Lógica de Ordenar Fichas (Scramble)
  function renderScrambleZones(ex) {
    const area = document.getElementById("exercise-interactive-area");
    if (!area) return;

    area.innerHTML = `
      <div class="scramble-area">
        <div class="scramble-target-zone ${state.selectedScramble.length === 0 ? 'empty' : ''}" id="scramble-target">
          ${state.selectedScramble.map((word, idx) => `
            <button class="word-chip" data-idx="${idx}">${word}</button>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.85rem; color:var(--text-muted);">Banco de palabras:</span>
          <button id="scramble-reset-btn" style="font-size:0.8rem; color:#60a5fa; text-decoration:underline;">Reiniciar orden</button>
        </div>

        <div class="scramble-bank-zone" id="scramble-bank">
          ${state.availableScramble.map((word, idx) => `
            <button class="word-chip" data-idx="${idx}">${word}</button>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:flex-end;">
          <button class="fill-submit-btn" id="scramble-submit-btn" ${state.selectedScramble.length === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            Comprobar Oración
          </button>
        </div>
      </div>
    `;

    // Clic en palabra del banco para agregarla
    area.querySelectorAll("#scramble-bank .word-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.isAnswerChecked) return;
        const idx = parseInt(btn.dataset.idx, 10);
        const [moved] = state.availableScramble.splice(idx, 1);
        state.selectedScramble.push(moved);
        renderScrambleZones(ex);
      });
    });

    // Clic en palabra elegida para devolverla al banco
    area.querySelectorAll("#scramble-target .word-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.isAnswerChecked) return;
        const idx = parseInt(btn.dataset.idx, 10);
        const [returned] = state.selectedScramble.splice(idx, 1);
        state.availableScramble.push(returned);
        renderScrambleZones(ex);
      });
    });

    // Reiniciar
    document.getElementById("scramble-reset-btn")?.addEventListener("click", () => {
      if (state.isAnswerChecked) return;
      state.availableScramble = [...ex.tokens];
      state.selectedScramble = [];
      renderScrambleZones(ex);
    });

    // Comprobar
    document.getElementById("scramble-submit-btn")?.addEventListener("click", () => {
      if (state.isAnswerChecked || state.selectedScramble.length === 0) return;
      const isCorrect = JSON.stringify(state.selectedScramble) === JSON.stringify(ex.solution);
      evaluateAnswer(isCorrect, ex);
    });
  }

  function checkMultipleChoiceAnswer(chosenIdx, ex) {
    const isCorrect = chosenIdx === ex.correct;
    const optionBtns = document.querySelectorAll(".option-btn");

    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === ex.correct) {
        btn.classList.add("correct");
      } else if (idx === chosenIdx) {
        btn.classList.add("incorrect");
      }
    });

    evaluateAnswer(isCorrect, ex);
  }

  function evaluateAnswer(isCorrect, ex) {
    state.isAnswerChecked = true;
    const banner = document.getElementById("feedback-banner");
    const titleEl = document.getElementById("feedback-title");
    const explanationEl = document.getElementById("feedback-explanation");
    const audioBtn = document.getElementById("feedback-audio-btn");
    const nextBtn = document.getElementById("next-question-btn");

    if (!banner) return;

    if (isCorrect) {
      state.practiceScore++;
      state.userStats.xp += 15;
      state.userStats.streak = (state.userStats.streak || 0) + 1;
      banner.className = "feedback-banner correct show";
      titleEl.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ¡Excelente! ¡Respuesta Correcta! (+15 XP)
      `;
    } else {
      state.userStats.streak = 0;
      banner.className = "feedback-banner incorrect show";
      titleEl.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        Respuesta Incorrecta (¡Así se aprende!)
      `;
    }

    explanationEl.innerHTML = formatMarkdownBold(ex.explanation);

    // Audio disponible
    const textToSpeak = ex.audio || (ex.solution ? ex.solution.join(" ") : null);
    if (textToSpeak && audioBtn) {
      audioBtn.style.display = "flex";
      audioBtn.onclick = () => speakEnglish(textToSpeak, audioBtn);
    } else if (audioBtn) {
      audioBtn.style.display = "none";
    }

    saveStats();

    nextBtn.onclick = () => {
      state.practiceIndex++;
      renderPracticeMode();
    };
  }

  // ========================================================
  // RESULTADOS DE LA PRÁCTICA
  // ========================================================
  function renderPracticeResults() {
    const container = document.getElementById("main-view-container");
    const tense = getCurrentTense();
    const total = tense.exercises.length;
    const score = state.practiceScore;
    const percent = Math.round((score / total) * 100);

    // Marcar como completado si sacó más del 60%
    if (percent >= 60) {
      state.userStats.completedTenses[tense.id] = true;
      state.userStats.xp += 50; // Bonus por completar
      saveStats();
    }

    container.innerHTML = `
      <div class="exercise-card results-modal fade-in">
        <div class="results-badge-icon">
          ${percent >= 80 ? "🏆" : percent >= 60 ? "⭐" : "💡"}
        </div>
        <h2 class="results-title">
          ${percent >= 80 ? "¡Extraordinario dominio!" : percent >= 60 ? "¡Buen trabajo, vas por excelente camino!" : "¡Sigue practicando, cada intento cuenta!"}
        </h2>
        
        <div class="results-score-big">${score} / ${total}</div>
        <p style="font-weight:700; color:var(--text-muted); font-size:1.1rem;">${percent}% de aciertos</p>

        <p class="results-feedback-text">
          ${percent >= 60 
            ? `Has consolidado los conceptos esenciales de <strong>${tense.name}</strong>. ¡Ya puedes avanzar al siguiente tiempo verbal!`
            : `Te recomendamos repasar la teoría y las fórmulas en el <strong>Modo Estudio</strong> antes de volver a intentarlo.`}
        </p>

        <div class="results-actions-row">
          <button class="btn-secondary" id="retry-practice-btn">
            🔄 Repetir Ejercicios
          </button>
          <button class="go-practice-btn" id="back-study-btn">
            📖 Volver al Estudio
          </button>
        </div>
      </div>
    `;

    document.getElementById("retry-practice-btn")?.addEventListener("click", () => {
      state.practiceIndex = 0;
      state.practiceScore = 0;
      renderPracticeMode();
    });

    document.getElementById("back-study-btn")?.addEventListener("click", () => {
      switchMode("study");
    });
  }

  // ========================================================
  // CAMBIO DE MODO (ESTUDIO vs PRÁCTICA)
  // ========================================================
  function switchMode(newMode) {
    state.currentMode = newMode;
    renderHeader();
    if (newMode === "study") {
      renderStudyMode();
    } else {
      renderPracticeMode();
    }
  }

  // Tabs superiores de cambio de modo
  document.querySelectorAll(".mode-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchMode(btn.dataset.mode);
    });
  });

  // ========================================================
  // TEMA OSCURO / CLARO
  // ========================================================
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    const savedTheme = localStorage.getItem("verbflow_theme") || "dark";
    if (savedTheme === "light") document.body.classList.add("light-theme");

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      localStorage.setItem("verbflow_theme", isLight ? "light" : "dark");
    });
  }

  // ========================================================
  // MODAL CHEAT SHEET (RESUMEN RÁPIDO)
  // ========================================================
  const cheatBtn = document.getElementById("open-cheat-sheet");
  const modalOverlay = document.getElementById("cheat-sheet-modal");
  const closeModalBtn = document.getElementById("close-cheat-sheet");

  if (cheatBtn && modalOverlay && closeModalBtn) {
    cheatBtn.addEventListener("click", () => {
      renderCheatSheetModal();
      modalOverlay.classList.add("active");
    });

    closeModalBtn.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove("active");
    });
  }

  function renderCheatSheetModal() {
    const body = document.getElementById("cheat-sheet-body");
    if (!body) return;

    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p style="color:var(--text-secondary); font-size:0.95rem;">
          Guarda esta chuleta/resumen para recordar de un vistazo la estructura de cada tiempo:
        </p>

        <table class="versus-table">
          <thead>
            <tr>
              <th>Tiempo Verbal</th>
              <th>Estructura Afirmativa (+)</th>
              <th>Palabras Clave (Signals)</th>
            </tr>
          </thead>
          <tbody>
            ${window.TENSES_DATA.filter(t => t.id !== "master-challenge").map(t => `
              <tr>
                <td style="font-weight:700; color:${t.tagColor};">${t.name}</td>
                <td><code>${t.study.structures.affirmative.formula}</code></td>
                <td><small>${t.study.timeMarkers.map(m => m.word).slice(0, 3).join(", ")}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ========================================================
  // TOGGLE DE SIDEBAR EN MÓVILES
  // ========================================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Utilidad para formatear markdown simple (**negrita**)
  function formatMarkdownBold(str) {
    if (!str) return "";
    return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  // Inicialización
  loadStats();
  renderSidebar();
  renderHeader();
  renderStudyMode();
});
