// ========================================================
// VerbFlow - Auth & Classroom Manager (v3.0)
// Sesión volátil con sessionStorage (se cierra al cerrar pestaña)
// Registro completo con Institución ("Promoción Social"), Grado, Cédula y Nombre Completo
// ========================================================

const AuthManager = (() => {
  const STORAGE_KEYS = {
    USERS: "verbflow_users_db",
    CURRENT_USER: "verbflow_active_session", // Almacenado en sessionStorage para cerrarse al cerrar pestaña
    CLASSES: "verbflow_classes_db",
    SUBMISSIONS: "verbflow_submissions_db"
  };

  // Limpiar cualquier sesión antigua persistente en localStorage para asegurar que no quede abierta
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch(e) {}

  // Inicializar Base de Datos con el Owner por defecto
  function initDB() {
    let users = getUsers();
    // Asegurar que TheKeas exista como Owner
    const ownerExists = users.some(u => u.nick.toLowerCase() === "thekeas");
    if (!ownerExists) {
      users.push({
        nick: "TheKeas",
        password: "Empresario10",
        fullName: "Kevin (TheKeas)",
        institution: "Promoción Social",
        grade: "Owner",
        role: "owner",
        status: "approved",
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
    }
  }

  function getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // USO DE SESSIONSTORAGE: Se cierra automáticamente al cerrar la pestaña o el navegador
  function getCurrentUser() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Registro de usuarios con nuevos campos solicitados
  function register({ nick, password, role, fullName, institution, grade, idCard }) {
    initDB();
    const cleanNick = (nick || "").trim();
    const cleanPass = (password || "").trim();
    const cleanFullName = (fullName || "").trim();
    const cleanInstitution = (institution || "Promoción Social").trim();
    const cleanGrade = (grade || "").trim();
    const cleanIdCard = (idCard || "").trim();

    if (!cleanNick || cleanNick.length < 3) {
      return { success: false, message: "El Nickname debe tener al menos 3 caracteres." };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, message: "La contraseña debe tener al menos 4 caracteres." };
    }
    if (!cleanFullName || cleanFullName.length < 3) {
      return { success: false, message: "Por favor ingresa tu Nombre Completo como en tu documento." };
    }

    const isTeacher = role === "teacher";

    if (!isTeacher && !cleanGrade) {
      return { success: false, message: "Por favor ingresa el grado que cursas (ej: 1102)." };
    }

    if (isTeacher && !cleanIdCard) {
      return { success: false, message: "Por favor ingresa tu Cédula de Ciudadanía o Documento de Identidad." };
    }

    // No permitir registrar 'TheKeas' con otro rol o si ya existe
    if (cleanNick.toLowerCase() === "thekeas") {
      return { success: false, message: "El nick 'TheKeas' es reservado exclusivamente para el Owner." };
    }

    const users = getUsers();
    if (users.some(u => u.nick.toLowerCase() === cleanNick.toLowerCase())) {
      return { success: false, message: "Ese Nickname ya está en uso. Por favor elige otro." };
    }

    const newUser = {
      nick: cleanNick,
      password: cleanPass,
      fullName: cleanFullName,
      institution: cleanInstitution || "Promoción Social",
      grade: isTeacher ? "Docente" : cleanGrade,
      idCard: isTeacher ? cleanIdCard : "",
      role: isTeacher ? "teacher" : "student",
      status: isTeacher ? "pending" : "approved",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    if (isTeacher) {
      return {
        success: true,
        pending: true,
        message: "Tu cuenta de Profesor ha sido registrada. Está pendiente de aprobación por el Owner (TheKeas)."
      };
    } else {
      // Auto-login en sessionStorage para alumnos
      setCurrentUser(newUser);
      return { success: true, pending: false, user: newUser, message: "¡Registro exitoso! Bienvenido." };
    }
  }

  // Inicio de sesión por Nickname + Password
  function login(nick, password) {
    initDB();
    const cleanNick = (nick || "").trim();
    const cleanPass = (password || "").trim();

    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === cleanNick.toLowerCase());

    if (!user) {
      return { success: false, message: "Nickname o usuario no encontrado." };
    }
    if (user.password !== cleanPass) {
      return { success: false, message: "Contraseña incorrecta." };
    }

    if (user.role === "teacher" && user.status === "pending") {
      return {
        success: false,
        message: "Tu cuenta de Profesor todavía está pendiente de verificación y aprobación por el Owner (TheKeas)."
      };
    }

    if (user.status === "rejected") {
      return {
        success: false,
        message: "Tu solicitud de cuenta de profesor fue rechazada."
      };
    }

    // Guardar en sessionStorage para que expire al cerrar la pestaña
    setCurrentUser(user);
    return { success: true, user: user };
  }

  function logout() {
    setCurrentUser(null);
  }

  // Métodos del Owner (TheKeas)
  function getPendingTeachers() {
    initDB();
    const users = getUsers();
    return users.filter(u => u.role === "teacher" && u.status === "pending");
  }

  function getAllTeachers() {
    initDB();
    const users = getUsers();
    return users.filter(u => u.role === "teacher");
  }

  function approveTeacher(teacherNick) {
    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === teacherNick.toLowerCase());
    if (user) {
      user.status = "approved";
      saveUsers(users);
      return true;
    }
    return false;
  }

  function rejectTeacher(teacherNick) {
    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === teacherNick.toLowerCase());
    if (user) {
      user.status = "rejected";
      saveUsers(users);
      return true;
    }
    return false;
  }

  // ========================================================
  // GESTIÓN DE CLASES
  // ========================================================
  function getClasses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveClasses(classes) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }

  function createClass(name, selectedTopics, questionCount) {
    const user = getCurrentUser();
    if (!user || (user.role !== "teacher" && user.role !== "owner")) {
      return { success: false, message: "Solo profesores autorizados o el Owner pueden crear clases." };
    }

    const cleanName = (name || "").trim();
    if (!cleanName) {
      return { success: false, message: "Debes ingresar un nombre para la clase." };
    }

    if (!selectedTopics || selectedTopics.length === 0) {
      return { success: false, message: "Debes seleccionar al menos un tema para la evaluación." };
    }

    const code = "VF-" + Math.floor(1000 + Math.random() * 9000);
    const classes = getClasses();

    const newClass = {
      code: code,
      name: cleanName,
      teacherNick: user.nick,
      institution: user.institution || "Promoción Social",
      selectedTopics: selectedTopics,
      questionCount: parseInt(questionCount, 10) || 25,
      createdAt: new Date().toISOString()
    };

    classes.push(newClass);
    saveClasses(classes);
    return { success: true, classroom: newClass };
  }

  function getClassByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const classes = getClasses();
    return classes.find(c => c.code.toUpperCase() === cleanCode) || null;
  }

  // ========================================================
  // REGISTRO Y CONSULTA DE EVALUACIONES
  // ========================================================
  function getSubmissions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSubmissions(subs) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
  }

  function recordSubmission({ classCode, studentNick, fullName, grade, institution, score, correctCount, totalQuestions, topics }) {
    const subs = getSubmissions();
    const currentUser = getCurrentUser();

    const submission = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      classCode: classCode || "LIBRE",
      studentNick: studentNick || (currentUser ? currentUser.nick : "Anónimo"),
      fullName: fullName || (currentUser ? currentUser.fullName : studentNick) || "Estudiante",
      grade: grade || (currentUser ? currentUser.grade : "1102"),
      institution: institution || (currentUser ? currentUser.institution : "Promoción Social"),
      score: score, // Escala 0 a 100
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      topics: topics || [],
      date: new Date().toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: Date.now()
    };

    subs.unshift(submission);
    saveSubmissions(subs);
    return submission;
  }

  function getSubmissionsForClass(classCode) {
    const subs = getSubmissions();
    if (!classCode) return subs;
    return subs.filter(s => s.classCode.toUpperCase() === classCode.toUpperCase());
  }

  initDB();

  return {
    getCurrentUser,
    setCurrentUser,
    register,
    login,
    logout,
    getPendingTeachers,
    getAllTeachers,
    approveTeacher,
    rejectTeacher,
    createClass,
    getClasses,
    getClassByCode,
    recordSubmission,
    getSubmissionsForClass,
    getSubmissions
  };
})();

if (typeof window !== "undefined") {
  window.AuthManager = AuthManager;
}
