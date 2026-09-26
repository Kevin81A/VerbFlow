// ========================================================
// VerbFlow - Application Engine (v3.0)
// Modo Examen Estricto (Lockdown anti-trampa), Hub de Bienvenida del Alumno,
// Banco Masivo de 1.050 preguntas con selección ponderada y Boleta Escolar
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Estado Global de la Aplicación
  const state = {
    currentTenseId: "present-continuous",
    currentMode: "study", // 'study' | 'practice'
    currentStructTab: "affirmative",
    practiceIndex: 0,
    practiceScore: 0,
    practiceQuestions: [],
    isCustomExam: false,
    isClassExam: false, // Modo examen estricto de clase
    selectedDifficulty: "weighted", // 'weighted' | 'easy' | 'medium' | 'hard'
    selectedQuestionCount: 10,
    customExamInfo: {
      topics: [],
      topicsLabel: "",
      classCode: null
    },
    isAnswerChecked: false,
    selectedScramble: [],
    availableScramble: [],
    userStats: {
      xp: 0,
      streak: 0,
      completedTenses: {}
    }
  };

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

  function speakEnglish(text, btnElement) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    if (btnElement) {
      btnElement.classList.add("speaking");
      utterance.onend = () => btnElement.classList.remove("speaking");
      utterance.onerror = () => btnElement.classList.remove("speaking");
    }

    window.speechSynthesis.speak(utterance);
  }

  function getCurrentTense() {
    return window.TENSES_DATA.find(t => t.id === state.currentTenseId) || window.TENSES_DATA[0];
  }

  // ========================================================
  // CONTROL DE MODO EXAMEN ESTRICTO (ANTI-TRAMPAS)
  // ========================================================
  function applyLockdownMode(isLockdown) {
    state.isClassExam = isLockdown;
    const banner = document.getElementById("lockdown-exam-banner");
    const sidebar = document.getElementById("app-sidebar");
    const modeTabs = document.getElementById("header-mode-tabs");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");

    if (isLockdown) {
      if (banner) banner.style.display = "block";
      if (sidebar) sidebar.style.display = "none";
      if (modeTabs) modeTabs.style.display = "none";
      if (mobileMenuBtn) mobileMenuBtn.style.display = "none";
    } else {
      if (banner) banner.style.display = "none";
      if (sidebar) sidebar.style.display = "flex";
      if (modeTabs) modeTabs.style.display = "flex";
      if (mobileMenuBtn) mobileMenuBtn.style.display = "block";
    }
  }

  // ========================================================
  // RENDERIZADO DE CABECERA DE USUARIO
  // ========================================================
  function renderUserHeader() {
    const container = document.getElementById("user-auth-container");
    const ownerNotifBtn = document.getElementById("owner-notif-btn");
    const ownerNotifCount = document.getElementById("owner-notif-count");
    const teacherSuiteBtn = document.getElementById("teacher-suite-btn");

    if (!container) return;

    const currentUser = window.AuthManager.getCurrentUser();

    if (!currentUser) {
      container.innerHTML = `
        <button class="login-trigger-btn" id="open-auth-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Ingresar / Registrarse
        </button>
      `;

      if (ownerNotifBtn) ownerNotifBtn.style.display = "none";
      if (teacherSuiteBtn) teacherSuiteBtn.style.display = "none";

      document.getElementById("open-auth-btn")?.addEventListener("click", () => {
        openAuthModal();
      });
      return;
    }

    let roleClass = "role-student";
    let roleText = "🎓 Alumno";

    if (currentUser.role === "owner") {
      roleClass = "role-owner";
      roleText = "👑 Owner";
    } else if (currentUser.role === "teacher") {
      roleClass = "role-teacher";
      roleText = "👨‍🏫 Teacher";
    }

    container.innerHTML = `
      <div class="user-profile-badge">
        <strong>${currentUser.nick}</strong>
        <span class="user-role-tag ${roleClass}">${roleText}</span>
        <button class="logout-icon-btn" id="logout-btn" title="Cerrar sesión">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    `;

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      window.AuthManager.logout();
      renderUserHeader();
      renderSidebar();
    });

    if (currentUser.role === "owner") {
      const pendingTeachers = window.AuthManager.getPendingTeachers();
      if (ownerNotifBtn && ownerNotifCount) {
        ownerNotifBtn.style.display = "flex";
        ownerNotifCount.textContent = pendingTeachers.length;
        ownerNotifCount.style.display = pendingTeachers.length > 0 ? "flex" : "none";
      }
    } else if (ownerNotifBtn) {
      ownerNotifBtn.style.display = "none";
    }

    if (currentUser.role === "teacher" || currentUser.role === "owner") {
      if (teacherSuiteBtn) teacherSuiteBtn.style.display = "flex";
    } else if (teacherSuiteBtn) {
      teacherSuiteBtn.style.display = "none";
    }
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
        const isCurrent = tense.id === state.currentTenseId && !state.isCustomExam && !state.isClassExam;
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
          if (state.isClassExam) {
            alert("No puedes abandonar el examen de clase hasta completarlo.");
            return;
          }
          state.currentTenseId = tense.id;
          state.isCustomExam = false;
          state.isClassExam = false;
          state.practiceIndex = 0;
          state.practiceScore = 0;
          state.isAnswerChecked = false;
          renderSidebar();
          renderHeader();
          if (state.currentMode === "study") {
            renderStudyMode();
          } else {
            initSingleTensePractice();
          }

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

    if (state.isClassExam) {
      if (titleEl) {
        titleEl.innerHTML = `🔒 Examen Oficial de Clase <span style="font-size:0.85rem; font-weight:normal; color:#f87171;">(${state.customExamInfo.classCode})</span>`;
      }
      if (badgeEl) {
        badgeEl.textContent = "Evaluación Calificada (0-100)";
        badgeEl.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        badgeEl.style.color = "#f87171";
        badgeEl.style.border = "1px solid rgba(239, 68, 68, 0.5)";
      }
    } else if (state.isCustomExam) {
      if (titleEl) {
        titleEl.innerHTML = `🎯 Evaluación Personalizada <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">${state.customExamInfo.topicsLabel || ""}</span>`;
      }
      if (badgeEl) {
        badgeEl.textContent = `Práctica (${state.selectedDifficulty})`;
        badgeEl.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
        badgeEl.style.color = "#fbbf24";
        badgeEl.style.border = "1px solid rgba(245, 158, 11, 0.5)";
      }
    } else {
      if (titleEl) {
        titleEl.innerHTML = `${current.name} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">(${current.nameEs})</span>`;
      }
      if (badgeEl) {
        badgeEl.textContent = current.badge;
        badgeEl.style.backgroundColor = `${current.tagColor}22`;
        badgeEl.style.color = current.tagColor;
        badgeEl.style.border = `1px solid ${current.tagColor}55`;
      }
    }

    document.querySelectorAll(".mode-tab-btn").forEach(btn => {
      const mode = btn.dataset.mode;
      if (mode === state.currentMode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    renderUserHeader();
  }

  // ========================================================
  // MODO ESTUDIO
  // ========================================================
  function renderStudyMode() {
    if (state.isClassExam) {
      alert("Acceso a teoría bloqueado durante el examen de clase.");
      return;
    }

    applyLockdownMode(false);
    state.isCustomExam = false;
    const container = document.getElementById("main-view-container");
    const tense = getCurrentTense();
    const study = tense.study;

    container.innerHTML = `
      <div class="fade-in">
        <div class="custom-exam-launch-banner">
          <div>
            <h3 style="font-family:var(--font-display); font-size:1.3rem; font-weight:800; color:#fbbf24; margin-bottom:4px;">
              ¿Quieres medir tu nivel y obtener tu boleta de 0 a 100?
            </h3>
            <p style="color:var(--text-secondary); font-size:0.9rem;">
              Presenta una prueba de este tema o de varios, eligiendo tu nivel de dificultad.
            </p>
          </div>
          <button class="custom-exam-launch-btn" id="study-banner-exam-btn">
            🎯 Configurar Examen a Medida
          </button>
        </div>

        <div class="study-hero-card">
          <div class="study-hero-header">
            <div>
              <h2 class="study-title">${tense.name}</h2>
              <p class="study-subtitle">${study.concept}</p>
            </div>
          </div>

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

          <div id="structure-content-box"></div>
        </div>

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

        <div class="study-section">
          <h3 class="section-heading">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            Marcadores de Tiempo (Time Markers)
          </h3>
          <div class="time-markers-grid">
            ${study.timeMarkers.map(tm => `
              <div class="time-marker-pill">
                <strong>${tm.word}</strong>
                <span>(${tm.trans})</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="go-practice-banner">
          <div>
            <h3 style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin-bottom:4px;">
              ¿Listo para practicar este tema?
            </h3>
            <p style="color:var(--text-secondary); font-size:0.95rem;">
              Ejercicios prácticos con retroalimentación inmediata para ${tense.name}.
            </p>
          </div>
          <button class="go-practice-btn" id="start-practice-btn">
            ¡Practicar ${tense.name}! ➔
          </button>
        </div>
      </div>
    `;

    renderStructureTab();

    container.querySelectorAll(".audio-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        speakEnglish(btn.dataset.audio, btn);
      });
    });

    container.querySelectorAll(".struct-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".struct-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentStructTab = btn.dataset.struct;
        renderStructureTab();
      });
    });

    document.getElementById("start-practice-btn")?.addEventListener("click", () => {
      initSingleTensePractice();
    });

    document.getElementById("study-banner-exam-btn")?.addEventListener("click", () => {
      openCustomExamModal();
    });
  }

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
  // INICIADORES DE EVALUACIONES
  // ========================================================
  function initSingleTensePractice() {
    applyLockdownMode(false);
    const tense = getCurrentTense();
    state.isCustomExam = false;
    state.practiceQuestions = [...tense.exercises];
    state.practiceIndex = 0;
    state.practiceScore = 0;
    state.isAnswerChecked = false;
    switchMode("practice");
  }

  // Inicio de prueba de clase con MODO EXAMEN ESTRICTO (Anti-trampas)
  function startClassroomExam(classroom) {
    applyLockdownMode(true);
    state.isCustomExam = true;
    state.isClassExam = true;

    // Obtener preguntas usando el banco masivo con ponderación exigente
    const questions = window.QuestionsBank.selectQuestionsWeighted({
      topics: classroom.selectedTopics,
      count: classroom.questionCount || 25,
      difficultyMode: "weighted" // Prioriza medias y difíciles
    });

    state.practiceQuestions = questions;
    state.practiceIndex = 0;
    state.practiceScore = 0;
    state.isAnswerChecked = false;

    const topicNames = window.TENSES_DATA.filter(t => classroom.selectedTopics.includes(t.id)).map(t => t.name);
    state.customExamInfo = {
      topics: classroom.selectedTopics,
      topicsLabel: topicNames.join(", "),
      classCode: classroom.code
    };

    switchMode("practice");
    renderHeader();
  }

  // Inicio de examen personalizado libre
  function startCustomExam(topics, questionCount, difficulty = "weighted") {
    applyLockdownMode(false);
    state.isCustomExam = true;
    state.isClassExam = false;
    state.selectedDifficulty = difficulty;

    const questions = window.QuestionsBank.selectQuestionsWeighted({
      topics: topics,
      count: questionCount || 10,
      difficultyMode: difficulty
    });

    state.practiceQuestions = questions;
    state.practiceIndex = 0;
    state.practiceScore = 0;
    state.isAnswerChecked = false;

    const topicNames = window.TENSES_DATA.filter(t => topics.includes(t.id)).map(t => t.name);
    state.customExamInfo = {
      topics: topics,
      topicsLabel: topicNames.join(", "),
      classCode: null
    };

    switchMode("practice");
    renderHeader();
  }

  // ========================================================
  // MOTOR DE PRÁCTICA
  // ========================================================
  function renderPracticeMode() {
    const container = document.getElementById("main-view-container");
    const exercises = state.practiceQuestions;

    if (exercises.length === 0) {
      container.innerHTML = `
        <div class="exercise-card fade-in" style="text-align:center; padding:40px;">
          <h3>No hay preguntas cargadas.</h3>
          <p style="color:var(--text-secondary); margin:12px 0;">Selecciona un tema o configura un examen personalizado.</p>
          <button class="go-practice-btn" onclick="document.getElementById('open-custom-exam').click();">Configurar Examen</button>
        </div>
      `;
      return;
    }

    if (state.practiceIndex >= exercises.length) {
      renderPracticeResults();
      return;
    }

    const currentEx = exercises[state.practiceIndex];
    state.isAnswerChecked = false;
    state.selectedScramble = [];
    state.availableScramble = currentEx.type === "scramble" ? [...currentEx.tokens] : [];

    const progressPercent = Math.round((state.practiceIndex / exercises.length) * 100);

    // Etiqueta de dificultad visual
    let diffBadge = "";
    if (currentEx.difficulty) {
      const color = currentEx.difficulty === "easy" ? "#10b981" : currentEx.difficulty === "medium" ? "#f59e0b" : "#f43f5e";
      const text = currentEx.difficulty === "easy" ? "Fácil" : currentEx.difficulty === "medium" ? "Media" : "Difícil";
      diffBadge = `<span style="font-size:0.75rem; font-weight:800; color:${color}; border:1px solid ${color}66; padding:2px 8px; border-radius:12px; margin-left:8px;">${text}</span>`;
    }

    container.innerHTML = `
      <div class="practice-container fade-in">
        <div class="practice-header-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="question-counter">
            Pregunta ${state.practiceIndex + 1} de ${exercises.length}
          </span>
        </div>

        <div class="exercise-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div style="display:flex; align-items:center;">
              <span class="exercise-type-tag">
                ${getExerciseTypeName(currentEx.type)}
              </span>
              ${diffBadge}
            </div>
            ${currentEx.tenseName ? `<span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${currentEx.tenseName}</span>` : ''}
          </div>

          <h2 class="exercise-prompt">${currentEx.question}</h2>

          <div id="exercise-interactive-area"></div>

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
                Siguiente Pregunta ➔
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
      default: return "Pregunta de Evaluación";
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

    area.querySelectorAll("#scramble-bank .word-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.isAnswerChecked) return;
        const idx = parseInt(btn.dataset.idx, 10);
        const [moved] = state.availableScramble.splice(idx, 1);
        state.selectedScramble.push(moved);
        renderScrambleZones(ex);
      });
    });

    area.querySelectorAll("#scramble-target .word-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.isAnswerChecked) return;
        const idx = parseInt(btn.dataset.idx, 10);
        const [returned] = state.selectedScramble.splice(idx, 1);
        state.availableScramble.push(returned);
        renderScrambleZones(ex);
      });
    });

    document.getElementById("scramble-reset-btn")?.addEventListener("click", () => {
      if (state.isAnswerChecked) return;
      state.availableScramble = [...ex.tokens];
      state.selectedScramble = [];
      renderScrambleZones(ex);
    });

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
        Respuesta Incorrecta
      `;
    }

    explanationEl.innerHTML = formatMarkdownBold(ex.explanation);

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
  // RESULTADOS DE EVALUACIÓN (CALIFICACIÓN 0 - 100 Y BOLETA)
  // ========================================================
  function renderPracticeResults() {
    // Restaurar navegación normal tras culminar examen
    applyLockdownMode(false);

    const container = document.getElementById("main-view-container");
    const total = state.practiceQuestions.length;
    const correct = state.practiceScore;
    const incorrect = Math.max(0, total - correct);
    const score100 = Math.round((correct / total) * 100);

    const currentUser = window.AuthManager.getCurrentUser();
    const studentNick = currentUser ? currentUser.nick : "Estudiante";
    const fullName = currentUser ? (currentUser.fullName || currentUser.nick) : "Estudiante";
    const grade = currentUser ? (currentUser.grade || "1102") : "1102";
    const institution = currentUser ? (currentUser.institution || "Promoción Social") : "Promoción Social";

    const topicsLabel = state.isCustomExam 
      ? state.customExamInfo.topicsLabel 
      : getCurrentTense().name;

    // Registrar en tiempo real en la base de datos
    window.AuthManager.recordSubmission({
      classCode: state.customExamInfo.classCode || (state.isCustomExam ? "PERSONALIZADO" : "PRACTICA_LIBRE"),
      studentNick: studentNick,
      fullName: fullName,
      grade: grade,
      institution: institution,
      score: score100,
      correctCount: correct,
      totalQuestions: total,
      topics: state.isCustomExam ? state.customExamInfo.topics : [state.currentTenseId]
    });

    if (score100 >= 60) {
      if (!state.isCustomExam) {
        state.userStats.completedTenses[state.currentTenseId] = true;
      }
      state.userStats.xp += 50;
      saveStats();
    }

    const badgeIcon = score100 >= 80 ? "🏆" : score100 >= 60 ? "⭐" : "💡";
    const statusFeedback = score100 >= 80 
      ? "¡Extraordinario dominio! Has demostrado un entendimiento profundo." 
      : score100 >= 60 
      ? "¡Aprobado con buen desempeño! Felicitaciones." 
      : "Requiere refuerzo: repasa las fórmulas y vuelve a intentarlo.";

    container.innerHTML = `
      <div class="exercise-card results-modal fade-in">
        <div class="results-badge-icon">${badgeIcon}</div>
        <h2 class="results-title">${statusFeedback}</h2>
        
        <div style="background:var(--bg-primary); border:2px solid ${score100 >= 60 ? '#10b981' : '#f43f5e'}; border-radius:var(--radius-lg); padding:20px 40px; margin:12px 0;">
          <span style="font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:700;">
            Calificación Obtenida:
          </span>
          <div class="results-score-big" style="color:${score100 >= 60 ? '#34d399' : '#fb7185'};">
            ${score100} <span style="font-size:1.6rem; color:var(--text-muted);">/ 100</span>
          </div>
          <span style="font-size:0.95rem; font-weight:800; color:${score100 >= 60 ? '#10b981' : '#f43f5e'};">
            ${score100 >= 60 ? "APROBADO" : "REQUIERE REFUERZO"}
          </span>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:12px;">
          <div class="stat-chip" style="color:#10b981;">✔ Aciertos: <strong>${correct}</strong></div>
          <div class="stat-chip" style="color:#f43f5e;">✘ Fallos: <strong>${incorrect}</strong></div>
          <div class="stat-chip" style="color:#60a5fa;">Total: <strong>${total}</strong></div>
        </div>

        <p class="results-feedback-text">
          Alumno: <strong>${fullName}</strong> (${studentNick}) | Grado: <strong>${grade}</strong> | ${institution}
        </p>

        <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:16px;">
          <button class="download-cert-btn" id="download-cert-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            📥 Descargar Boleta Oficial (.PNG)
          </button>
          <button class="btn-secondary" id="retry-exam-btn">
            🔄 Repetir Prueba
          </button>
          <button class="btn-secondary" id="back-study-menu-btn">
            📖 Volver al Menú Principal
          </button>
        </div>
      </div>
    `;

    document.getElementById("download-cert-btn")?.addEventListener("click", () => {
      window.CertificateGenerator.downloadCertificate({
        studentNick: studentNick,
        fullName: fullName,
        grade: grade,
        institution: institution,
        score: score100,
        correctCount: correct,
        totalQuestions: total,
        topicsName: topicsLabel,
        classCode: state.customExamInfo.classCode
      });
    });

    document.getElementById("retry-exam-btn")?.addEventListener("click", () => {
      state.practiceIndex = 0;
      state.practiceScore = 0;
      renderPracticeMode();
    });

    document.getElementById("back-study-menu-btn")?.addEventListener("click", () => {
      switchMode("study");
    });
  }

  function switchMode(newMode) {
    if (state.isClassExam && newMode === "study") {
      alert("No puedes acceder a la teoría mientras esté en curso la evaluación de clase.");
      return;
    }
    state.currentMode = newMode;
    renderHeader();
    if (newMode === "study") {
      renderStudyMode();
    } else {
      renderPracticeMode();
    }
  }

  document.querySelectorAll(".mode-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      switchMode(btn.dataset.mode);
    });
  });

  // ========================================================
  // MODAL DE AUTENTICACIÓN (LOGIN / REGISTRO)
  // ========================================================
  const authModal = document.getElementById("auth-modal");
  const closeAuthModalBtn = document.getElementById("close-auth-modal");
  const tabLoginBtn = document.getElementById("tab-login-btn");
  const tabRegisterBtn = document.getElementById("tab-register-btn");
  const registerFieldsGroup = document.getElementById("register-fields-group");
  const authRoleSelect = document.getElementById("auth-role");
  const studentGradeGroup = document.getElementById("student-grade-group");
  const teacherIdcardGroup = document.getElementById("teacher-idcard-group");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  const authErrorMsg = document.getElementById("auth-error-msg");
  const authSuccessMsg = document.getElementById("auth-success-msg");
  let isRegisterMode = false;

  function openAuthModal() {
    isRegisterMode = false;
    updateAuthModalTabs();
    authErrorMsg.style.display = "none";
    authSuccessMsg.style.display = "none";
    document.getElementById("auth-nick").value = "";
    document.getElementById("auth-password").value = "";
    authModal.classList.add("active");
  }

  function updateAuthModalTabs() {
    if (isRegisterMode) {
      tabRegisterBtn.classList.add("active");
      tabLoginBtn.classList.remove("active");
      registerFieldsGroup.style.display = "flex";
      authSubmitBtn.textContent = "Crear Cuenta";
      document.getElementById("auth-modal-title").textContent = "Registrar Nueva Cuenta";
    } else {
      tabLoginBtn.classList.add("active");
      tabRegisterBtn.classList.remove("active");
      registerFieldsGroup.style.display = "none";
      authSubmitBtn.textContent = "Iniciar Sesión";
      document.getElementById("auth-modal-title").textContent = "Iniciar Sesión en VerbFlow";
    }
    authErrorMsg.style.display = "none";
    authSuccessMsg.style.display = "none";
  }

  authRoleSelect?.addEventListener("change", (e) => {
    if (e.target.value === "teacher") {
      studentGradeGroup.style.display = "none";
      teacherIdcardGroup.style.display = "flex";
    } else {
      studentGradeGroup.style.display = "flex";
      teacherIdcardGroup.style.display = "none";
    }
  });

  tabLoginBtn?.addEventListener("click", () => {
    isRegisterMode = false;
    updateAuthModalTabs();
  });

  tabRegisterBtn?.addEventListener("click", () => {
    isRegisterMode = true;
    updateAuthModalTabs();
  });

  closeAuthModalBtn?.addEventListener("click", () => {
    authModal.classList.remove("active");
  });

  document.getElementById("auth-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nick = document.getElementById("auth-nick").value.trim();
    const password = document.getElementById("auth-password").value.trim();
    const role = authRoleSelect.value;
    const fullName = document.getElementById("auth-fullname").value.trim();
    const institution = document.getElementById("auth-institution").value.trim();
    const grade = document.getElementById("auth-grade").value.trim();
    const idCard = document.getElementById("auth-idcard").value.trim();

    authErrorMsg.style.display = "none";
    authSuccessMsg.style.display = "none";

    if (isRegisterMode) {
      const res = window.AuthManager.register({
        nick,
        password,
        role,
        fullName,
        institution,
        grade,
        idCard
      });

      if (!res.success) {
        authErrorMsg.textContent = res.message;
        authErrorMsg.style.display = "block";
      } else {
        if (res.pending) {
          authSuccessMsg.textContent = res.message;
          authSuccessMsg.style.display = "block";
        } else {
          authModal.classList.remove("active");
          renderUserHeader();
          renderSidebar();
          openStudentHubModal(res.user);
        }
      }
    } else {
      const res = window.AuthManager.login(nick, password);
      if (!res.success) {
        authErrorMsg.textContent = res.message;
        authErrorMsg.style.display = "block";
      } else {
        authModal.classList.remove("active");
        renderUserHeader();
        renderSidebar();

        if (res.user.role === "student") {
          openStudentHubModal(res.user);
        }
      }
    }
  });

  // ========================================================
  // HUB DE BIENVENIDA DEL ALUMNO (POST-LOGIN)
  // ========================================================
  const studentHubModal = document.getElementById("student-hub-modal");
  const closeStudentHubBtn = document.getElementById("close-student-hub");
  const studentHubName = document.getElementById("student-hub-name");

  function openStudentHubModal(user) {
    if (!studentHubModal) return;
    if (studentHubName) studentHubName.textContent = user.fullName || user.nick;
    studentHubModal.classList.add("active");
  }

  closeStudentHubBtn?.addEventListener("click", () => {
    studentHubModal.classList.remove("active");
  });

  document.getElementById("hub-opt-study")?.addEventListener("click", () => {
    studentHubModal.classList.remove("active");
    switchMode("study");
  });

  document.getElementById("hub-opt-practice")?.addEventListener("click", () => {
    studentHubModal.classList.remove("active");
    openCustomExamModal();
  });

  document.getElementById("hub-btn-start-class")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const code = document.getElementById("hub-input-class-code").value.trim().toUpperCase();
    if (!code) {
      alert("Por favor ingresa el código de la clase.");
      return;
    }
    const classroom = window.AuthManager.getClassByCode(code);
    if (!classroom) {
      alert("No se encontró ninguna clase con el código '" + code + "'. Verifica con tu profesor.");
      return;
    }
    studentHubModal.classList.remove("active");
    startClassroomExam(classroom);
  });

  // ========================================================
  // MODAL OWNER (THEKEAS) - APROBACIÓN DE PROFESORES
  // ========================================================
  const ownerModal = document.getElementById("owner-modal");
  const closeOwnerModalBtn = document.getElementById("close-owner-modal");
  const ownerNotifBtn = document.getElementById("owner-notif-btn");

  ownerNotifBtn?.addEventListener("click", () => {
    renderOwnerApprovals();
    ownerModal.classList.add("active");
  });

  closeOwnerModalBtn?.addEventListener("click", () => {
    ownerModal.classList.remove("active");
  });

  function renderOwnerApprovals() {
    const body = document.getElementById("owner-modal-body");
    if (!body) return;

    const pending = window.AuthManager.getPendingTeachers();

    if (pending.length === 0) {
      body.innerHTML = `
        <div style="text-align:center; padding:30px 20px; color:var(--text-secondary);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:10px; color:#10b981;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <p>No hay solicitudes de profesores pendientes en este momento.</p>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="font-size:0.9rem; color:var(--text-secondary);">
          Los siguientes usuarios se han registrado solicitando rango de Profesor (Teacher). Autorízalos para permitirles crear clases y evaluaciones:
        </p>
        ${pending.map(teacher => `
          <div class="class-card-box" style="flex-direction:row; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:1.1rem; color:#f9fafb;">${teacher.fullName || teacher.nick}</div>
              <div style="font-size:0.85rem; color:#38bdf8;">Nick: ${teacher.nick} | CC: ${teacher.idCard || "N/A"}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${teacher.institution || "Promoción Social"}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="fill-submit-btn approve-teacher-btn" data-nick="${teacher.nick}" style="background:#10b981; padding:8px 16px; font-size:0.85rem;">
                ✔ Autorizar
              </button>
              <button class="btn-secondary reject-teacher-btn" data-nick="${teacher.nick}" style="color:#f43f5e; padding:8px 14px; font-size:0.85rem;">
                ✘ Rechazar
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    body.querySelectorAll(".approve-teacher-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        window.AuthManager.approveTeacher(btn.dataset.nick);
        renderOwnerApprovals();
        renderUserHeader();
      });
    });

    body.querySelectorAll(".reject-teacher-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        window.AuthManager.rejectTeacher(btn.dataset.nick);
        renderOwnerApprovals();
        renderUserHeader();
      });
    });
  }

  // ========================================================
  // PANEL DOCENTE (TEACHER SUITE)
  // ========================================================
  const teacherModal = document.getElementById("teacher-modal");
  const closeTeacherModalBtn = document.getElementById("close-teacher-modal");
  const teacherSuiteBtn = document.getElementById("teacher-suite-btn");

  const tabTeacherClasses = document.getElementById("tab-teacher-classes");
  const tabTeacherCreate = document.getElementById("tab-teacher-create");
  const tabTeacherResults = document.getElementById("tab-teacher-results");

  teacherSuiteBtn?.addEventListener("click", () => {
    openTeacherPanel("classes");
    teacherModal.classList.add("active");
  });

  closeTeacherModalBtn?.addEventListener("click", () => {
    teacherModal.classList.remove("active");
  });

  function openTeacherPanel(tab = "classes") {
    [tabTeacherClasses, tabTeacherCreate, tabTeacherResults].forEach(t => t?.classList.remove("active"));
    const content = document.getElementById("teacher-panel-content");
    if (!content) return;

    if (tab === "classes") {
      tabTeacherClasses?.classList.add("active");
      renderTeacherClasses(content);
    } else if (tab === "create") {
      tabTeacherCreate?.classList.add("active");
      renderTeacherCreateClassForm(content);
    } else if (tab === "results") {
      tabTeacherResults?.classList.add("active");
      renderTeacherRealtimeResults(content);
    }
  }

  tabTeacherClasses?.addEventListener("click", () => openTeacherPanel("classes"));
  tabTeacherCreate?.addEventListener("click", () => openTeacherPanel("create"));
  tabTeacherResults?.addEventListener("click", () => openTeacherPanel("results"));

  function renderTeacherClasses(content) {
    const classes = window.AuthManager.getClasses();

    if (classes.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:30px 20px;">
          <p style="color:var(--text-secondary); margin-bottom:14px;">Aún no has creado ninguna clase.</p>
          <button class="fill-submit-btn" onclick="document.getElementById('tab-teacher-create').click();">
            + Crear Mi Primera Clase
          </button>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="classes-grid">
        ${classes.map(c => `
          <div class="class-card-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="class-code-badge">${c.code}</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">${c.questionCount} preguntas</span>
            </div>
            <h4 style="font-size:1.15rem; font-weight:800; color:#f9fafb;">${c.name}</h4>
            <div style="font-size:0.85rem; color:var(--text-secondary);">
              <strong>Profesor:</strong> ${c.teacherNick} | ${c.institution || "Promoción Social"}
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted);">
              <strong>Temas:</strong> ${c.selectedTopics.map(id => window.TENSES_DATA.find(t=>t.id===id)?.name || id).join(', ')}
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn-secondary copy-class-link-btn" data-code="${c.code}" style="flex:1; font-size:0.8rem; padding:8px;">
                📋 Copiar Código (${c.code})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelectorAll(".copy-class-link-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          const original = btn.textContent;
          btn.textContent = "✔ ¡Código Copiado!";
          setTimeout(() => btn.textContent = original, 2000);
        });
      });
    });
  }

  function renderTeacherCreateClassForm(content) {
    content.innerHTML = `
      <form id="create-class-form">
        <div class="form-group">
          <label class="form-label" for="new-class-name">Nombre de la Clase / Grupo:</label>
          <input type="text" id="new-class-name" class="form-input" placeholder="Ej: Inglés Grado 1102 - Examen Parcial" required />
        </div>

        <div class="form-group">
          <label class="form-label">Temas a incluir en la evaluación:</label>
          <div class="topics-selector-grid" style="grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));">
            ${window.TENSES_DATA.map(tense => `
              <label class="topic-checkbox-label">
                <input type="checkbox" name="teacher-topic" value="${tense.id}" checked />
                <span style="font-size:0.88rem; font-weight:600;">${tense.name}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Cantidad de preguntas para la prueba (Se priorizan preguntas Medias y Difíciles):</label>
          <select id="new-class-qcount" class="form-select">
            <option value="10">10 Preguntas</option>
            <option value="15">15 Preguntas</option>
            <option value="20">20 Preguntas</option>
            <option value="25" selected>25 Preguntas (Recomendado)</option>
            <option value="30">30 Preguntas</option>
            <option value="50">50 Preguntas</option>
          </select>
        </div>

        <div id="create-class-error" style="color:#f43f5e; font-size:0.85rem; margin-bottom:12px; display:none;"></div>

        <div style="display:flex; justify-content:flex-end;">
          <button type="submit" class="fill-submit-btn">
            Guardar Clase y Generar Código 🚀
          </button>
        </div>
      </form>
    `;

    document.getElementById("create-class-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-class-name").value.trim();
      const qcount = document.getElementById("new-class-qcount").value;
      const checkedBoxes = Array.from(content.querySelectorAll("input[name='teacher-topic']:checked"));
      const topics = checkedBoxes.map(cb => cb.value);

      const errEl = document.getElementById("create-class-error");
      if (topics.length === 0) {
        errEl.textContent = "Debes seleccionar al menos un tema.";
        errEl.style.display = "block";
        return;
      }

      const res = window.AuthManager.createClass(name, topics, qcount);
      if (res.success) {
        openTeacherPanel("classes");
      } else {
        errEl.textContent = res.message;
        errEl.style.display = "block";
      }
    });
  }

  function renderTeacherRealtimeResults(content) {
    const submissions = window.AuthManager.getSubmissions();

    if (submissions.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:30px 20px; color:var(--text-secondary);">
          <p>Aún no hay alumnos que hayan completado evaluaciones.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:0.9rem; color:var(--text-secondary);">
          Evaluaciones recibidas en tiempo real (${submissions.length}):
        </span>
        <button id="refresh-subs-btn" style="font-size:0.8rem; color:#60a5fa;">🔄 Actualizar</button>
      </div>

      <div class="submissions-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Grado</th>
              <th>Clase</th>
              <th>Calificación</th>
              <th>Aciertos</th>
              <th>Fecha</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            ${submissions.map(s => {
              const scoreClass = s.score >= 80 ? "high" : s.score >= 60 ? "mid" : "low";
              return `
                <tr>
                  <td>
                    <strong>${s.fullName || s.studentNick}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${s.studentNick}</div>
                  </td>
                  <td>${s.grade || "1102"}</td>
                  <td><code style="color:#60a5fa;">${s.classCode}</code></td>
                  <td><span class="score-badge-pill ${scoreClass}">${s.score} / 100</span></td>
                  <td>${s.correctCount} / ${s.totalQuestions}</td>
                  <td style="color:var(--text-muted); font-size:0.8rem;">${s.date}</td>
                  <td>
                    <button class="download-sub-cert-btn" data-sub='${JSON.stringify(s)}' style="font-size:0.8rem; color:#10b981; font-weight:700;">
                      📥 Boleta
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("refresh-subs-btn")?.addEventListener("click", () => {
      renderTeacherRealtimeResults(content);
    });

    content.querySelectorAll(".download-sub-cert-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const s = JSON.parse(btn.dataset.sub);
        window.CertificateGenerator.downloadCertificate({
          studentNick: s.studentNick,
          fullName: s.fullName || s.studentNick,
          grade: s.grade || "1102",
          institution: s.institution || "Promoción Social",
          score: s.score,
          correctCount: s.correctCount,
          totalQuestions: s.totalQuestions,
          topicsName: "Evaluación Escolar",
          classCode: s.classCode
        });
      });
    });
  }

  // ========================================================
  // PRESENTAR PRUEBA DE CLASE (MODAL DIRECTO)
  // ========================================================
  const joinModal = document.getElementById("join-class-modal");
  const openJoinModalBtn = document.getElementById("open-join-class");
  const closeJoinModalBtn = document.getElementById("close-join-modal");
  const submitJoinBtn = document.getElementById("submit-join-btn");
  const joinCodeInput = document.getElementById("join-class-code");
  const joinErrorMsg = document.getElementById("join-error-msg");

  openJoinModalBtn?.addEventListener("click", () => {
    joinErrorMsg.style.display = "none";
    joinCodeInput.value = "";
    joinModal.classList.add("active");
  });

  closeJoinModalBtn?.addEventListener("click", () => {
    joinModal.classList.remove("active");
  });

  submitJoinBtn?.addEventListener("click", () => {
    const code = joinCodeInput.value.trim().toUpperCase();
    if (!code) {
      joinErrorMsg.textContent = "Por favor ingresa un código de clase.";
      joinErrorMsg.style.display = "block";
      return;
    }

    const classroom = window.AuthManager.getClassByCode(code);
    if (!classroom) {
      joinErrorMsg.textContent = "No se encontró ninguna clase con el código '" + code + "'. Verifica con tu profesor.";
      joinErrorMsg.style.display = "block";
      return;
    }

    joinModal.classList.remove("active");
    startClassroomExam(classroom);
  });

  // ========================================================
  // CONFIGURADOR DE EXAMEN PERSONALIZADO (CON DIFICULTAD)
  // ========================================================
  const customExamModal = document.getElementById("custom-exam-modal");
  const openCustomExamBtn = document.getElementById("open-custom-exam");
  const closeCustomExamBtn = document.getElementById("close-custom-exam-modal");
  const customTopicsGrid = document.getElementById("custom-exam-topics-grid");
  const launchCustomExamBtn = document.getElementById("launch-custom-exam-btn");

  openCustomExamBtn?.addEventListener("click", () => {
    openCustomExamModal();
  });

  closeCustomExamBtn?.addEventListener("click", () => {
    customExamModal.classList.remove("active");
  });

  function openCustomExamModal() {
    renderCustomExamTopics();
    customExamModal.classList.add("active");
  }

  function renderCustomExamTopics() {
    if (!customTopicsGrid) return;
    customTopicsGrid.innerHTML = window.TENSES_DATA.map((t, idx) => `
      <label class="topic-checkbox-label ${idx < 3 ? 'checked' : ''}">
        <input type="checkbox" name="custom-topic" value="${t.id}" ${idx < 3 ? 'checked' : ''} />
        <div>
          <div style="font-weight:700; font-size:0.92rem;">${t.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${t.nameEs}</div>
        </div>
      </label>
    `).join('');

    customTopicsGrid.querySelectorAll("input[name='custom-topic']").forEach(input => {
      input.addEventListener("change", (e) => {
        const label = e.target.closest(".topic-checkbox-label");
        if (e.target.checked) {
          label.classList.add("checked");
        } else {
          label.classList.remove("checked");
        }
      });
    });
  }

  document.getElementById("select-all-topics-btn")?.addEventListener("click", () => {
    customTopicsGrid.querySelectorAll("input[name='custom-topic']").forEach(i => {
      i.checked = true;
      i.closest(".topic-checkbox-label")?.classList.add("checked");
    });
  });

  document.getElementById("deselect-all-topics-btn")?.addEventListener("click", () => {
    customTopicsGrid.querySelectorAll("input[name='custom-topic']").forEach(i => {
      i.checked = false;
      i.closest(".topic-checkbox-label")?.classList.remove("checked");
    });
  });

  // Selector de dificultad
  document.querySelectorAll("#difficulty-pills-container .q-count-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#difficulty-pills-container .q-count-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedDifficulty = btn.dataset.diff;
    });
  });

  // Selector de cantidad de preguntas
  document.querySelectorAll("#q-count-pills-container .q-count-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#q-count-pills-container .q-count-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedQuestionCount = parseInt(btn.dataset.count, 10);
    });
  });

  launchCustomExamBtn?.addEventListener("click", () => {
    const checked = Array.from(customTopicsGrid.querySelectorAll("input[name='custom-topic']:checked"));
    const selectedTopics = checked.map(c => c.value);

    if (selectedTopics.length === 0) {
      alert("Por favor selecciona al menos un tema para la evaluación.");
      return;
    }

    customExamModal.classList.remove("active");
    startCustomExam(selectedTopics, state.selectedQuestionCount, state.selectedDifficulty);
  });

  // ========================================================
  // CHULETA / CHEAT SHEET MODAL
  // ========================================================
  const cheatBtn = document.getElementById("open-cheat-sheet");
  const modalOverlay = document.getElementById("cheat-sheet-modal");
  const closeModalBtn = document.getElementById("close-cheat-sheet");

  if (cheatBtn && modalOverlay && closeModalBtn) {
    cheatBtn.addEventListener("click", () => {
      if (state.isClassExam) {
        alert("Acceso a chuletas y resúmenes bloqueado durante la evaluación.");
        return;
      }
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

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  function formatMarkdownBold(str) {
    if (!str) return "";
    return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  // Comprobar si viene un código de clase en la URL (?class=VF-XXXX)
  const urlParams = new URLSearchParams(window.location.search);
  const classFromUrl = urlParams.get("class");
  if (classFromUrl) {
    const foundClass = window.AuthManager.getClassByCode(classFromUrl);
    if (foundClass) {
      setTimeout(() => {
        startClassroomExam(foundClass);
      }, 300);
    }
  }

  // Inicialización
  loadStats();
  renderSidebar();
  renderHeader();
  renderStudyMode();
});
