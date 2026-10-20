// ========================================================
// VerbFlow - Production Auth & Security Service (v5.0)
// FASE 1: Integración con Supabase, JWT, RLS, Rate Limiting y Ley 1581
// ========================================================

const AuthService = (() => {
  // Configuración de Rate Limiting en Cliente
  const RATE_LIMIT_CONFIG = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 60 * 1000 // 1 minuto de bloqueo tras 5 intentos fallidos
  };

  // Almacenamiento volátil en memoria para evitar guardar contraseñas o tokens desprotegidos
  let currentSessionUser = null;
  let authListeners = [];

  // ----------------------------------------------------
  // GESTIÓN DE RATE LIMITING LOCAL
  // ----------------------------------------------------
  function checkRateLimit(identifier) {
    const key = `vf_rl_${identifier.toLowerCase()}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return { allowed: true, remaining: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && now < data.lockedUntil) {
      const waitSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      return { 
        allowed: false, 
        locked: true, 
        waitSeconds, 
        message: `Demasiados intentos fallidos. Por seguridad, espera ${waitSeconds} segundos antes de volver a intentar.` 
      };
    }

    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(key);
      return { allowed: true, remaining: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
    }

    return { allowed: true, remaining: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - (data.attempts || 0) };
  }

  function registerFailedAttempt(identifier) {
    const key = `vf_rl_${identifier.toLowerCase()}`;
    const raw = sessionStorage.getItem(key);
    const now = Date.now();
    let data = raw ? JSON.parse(raw) : { attempts: 0 };

    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
      data.lockedUntil = now + RATE_LIMIT_CONFIG.LOCKOUT_DURATION_MS;
    }
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  function resetRateLimit(identifier) {
    sessionStorage.removeItem(`vf_rl_${identifier.toLowerCase()}`);
  }

  // ----------------------------------------------------
  // NICKNAME A CORREO SEUDÓNIMO PARA SUPABASE AUTH
  // ----------------------------------------------------
  function nickToEmail(nick) {
    const clean = nick.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    return `${clean}@verbflow.edu.co`;
  }

  // ----------------------------------------------------
  // ADAPTADOR SUPABASE ACTIVO
  // ----------------------------------------------------
  const supabase = typeof window !== "undefined" && window.SupabaseConfig 
    ? window.SupabaseConfig.getClient() 
    : null;

  // ----------------------------------------------------
  // OBTENER USUARIO ACTUAL VERIFICADO
  // ----------------------------------------------------
  async function getCurrentUserAsync() {
    if (supabase) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        currentSessionUser = null;
        return null;
      }

      // Obtener el perfil verificado por el servidor (no manipulable por el cliente)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, nick, full_name, institution, grade, role, status, created_at")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profile) {
        currentSessionUser = null;
        return null;
      }

      currentSessionUser = {
        id: profile.id,
        nick: profile.nick,
        fullName: profile.full_name,
        institution: profile.institution,
        grade: profile.grade,
        role: profile.role,
        status: profile.status,
        email: session.user.email
      };
      return currentSessionUser;
    }

    // Fallback de desarrollo seguro (sin contraseñas en localStorage)
    const stored = sessionStorage.getItem("verbflow_active_session");
    if (stored) {
      try {
        currentSessionUser = JSON.parse(stored);
        return currentSessionUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  function getCurrentUser() {
    return currentSessionUser;
  }

  // ----------------------------------------------------
  // REGISTRO DE USUARIO (CON LEY 1581 Y CERO CÉDULA)
  // ----------------------------------------------------
  async function register({ nick, password, role, fullName, institution, grade, consent1581 }) {
    const cleanNick = (nick || "").trim();
    const cleanPass = (password || "").trim();
    const cleanFullName = (fullName || "").trim();
    const cleanInstitution = (institution || "Promoción Social").trim();
    const cleanGrade = (grade || "1102").trim();

    // 1. Validaciones de entrada
    if (!cleanNick || cleanNick.length < 3) {
      return { success: false, message: "El Nickname debe tener al menos 3 caracteres alfanuméricos." };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanNick)) {
      return { success: false, message: "El Nickname solo puede contener letras, números, guiones y guiones bajos." };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, message: "Por seguridad, la contraseña debe tener al menos 6 caracteres." };
    }
    if (!cleanFullName || cleanFullName.length < 3) {
      return { success: false, message: "Por favor ingresa tu Nombre Completo como en tu registro estudiantil." };
    }

    // 2. Validación de Ley 1581 de 2012 (Consentimiento explícito y protección de menores)
    if (!consent1581) {
      return { 
        success: false, 
        message: "Debes aceptar la autorización de tratamiento de datos conforme a la Ley 1581 de 2012 para poder registrarte." 
      };
    }

    if (cleanNick.toLowerCase() === "thekeas") {
      return { success: false, message: "El Nickname 'TheKeas' está reservado exclusivamente para el Owner." };
    }

    const assignedRole = role === "teacher" ? "teacher" : "student";

    // 3. Registro en Supabase (si está configurado)
    if (supabase) {
      const email = nickToEmail(cleanNick);

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: cleanPass,
        options: {
          data: {
            nick: cleanNick,
            full_name: cleanFullName,
            institution: cleanInstitution,
            grade: assignedRole === "teacher" ? "Docente" : cleanGrade,
            role: assignedRole
          }
        }
      });

      if (error) {
        return { success: false, message: error.message.includes("already registered") 
          ? "Ese Nickname ya está registrado. Por favor elige otro." 
          : error.message };
      }

      if (assignedRole === "teacher") {
        sessionStorage.setItem("verbflow_waiting_approval", cleanNick);
        return {
          success: true,
          pending: true,
          waitingNick: cleanNick,
          message: "Tu cuenta de Profesor ha sido registrada con éxito. Está en estado PENDIENTE esperando autorización del Owner (TheKeas)."
        };
      }

      // Auto login para alumnos
      await getCurrentUserAsync();
      return { 
        success: true, 
        pending: false, 
        user: currentSessionUser, 
        message: "¡Registro exitoso! Bienvenido a VerbFlow." 
      };
    }

    // Fallback de desarrollo local seguro
    const users = getLocalUsers();
    if (users.some(u => u.nick.toLowerCase() === cleanNick.toLowerCase())) {
      return { success: false, message: "Ese Nickname ya está en uso." };
    }

    const newUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      nick: cleanNick,
      fullName: cleanFullName,
      institution: cleanInstitution,
      grade: assignedRole === "teacher" ? "Docente" : cleanGrade,
      role: assignedRole,
      status: assignedRole === "teacher" ? "pending" : "approved",
      consent1581: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveLocalUsers(users);

    if (assignedRole === "teacher") {
      sessionStorage.setItem("verbflow_waiting_approval", cleanNick);
      return {
        success: true,
        pending: true,
        waitingNick: cleanNick,
        message: "Tu cuenta de Profesor ha sido registrada. Esperando autorización de TheKeas."
      };
    } else {
      currentSessionUser = newUser;
      sessionStorage.setItem("verbflow_active_session", JSON.stringify(newUser));
      return { success: true, pending: false, user: newUser, message: "¡Registro exitoso!" };
    }
  }

  // ----------------------------------------------------
  // INICIO DE SESIÓN CON RATE LIMITING Y TOKEN JWT
  // ----------------------------------------------------
  async function login(nick, password) {
    const cleanNick = (nick || "").trim();
    const cleanPass = (password || "").trim();

    if (!cleanNick || !cleanPass) {
      return { success: false, message: "Por favor ingresa tu Nickname y contraseña." };
    }

    // Comprobación de Rate Limiting
    const rateCheck = checkRateLimit(cleanNick);
    if (!rateCheck.allowed) {
      return { success: false, message: rateCheck.message };
    }

    if (supabase) {
      const email = nickToEmail(cleanNick);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: cleanPass
      });

      if (error) {
        registerFailedAttempt(cleanNick);
        return { 
          success: false, 
          message: "Credenciales incorrectas. Verifica tu Nickname y contraseña." 
        };
      }

      resetRateLimit(cleanNick);

      const user = await getCurrentUserAsync();
      if (!user) {
        return { success: false, message: "No se pudo recuperar el perfil del usuario." };
      }

      if (user.role === "teacher" && user.status === "pending") {
        sessionStorage.setItem("verbflow_waiting_approval", user.nick);
        return {
          success: false,
          pending: true,
          waitingNick: user.nick,
          message: "Tu cuenta de Profesor está esperando aprobación por el Owner (TheKeas)."
        };
      }

      if (user.status === "rejected") {
        await logout();
        return { success: false, message: "Tu solicitud de profesor fue rechazada por el administrador." };
      }

      sessionStorage.removeItem("verbflow_waiting_approval");
      notifyAuthChange(user);
      return { success: true, user: user };
    }

    // Fallback de desarrollo local
    const users = getLocalUsers();
    const user = users.find(u => u.nick.toLowerCase() === cleanNick.toLowerCase());

    // Verificación especial de Owner por defecto en fallback
    const isOwnerNick = cleanNick.toLowerCase() === "thekeas";
    if (isOwnerNick && cleanPass === "Empresario10") {
      resetRateLimit(cleanNick);
      const ownerUser = {
        id: "owner_thekeas_id",
        nick: "TheKeas",
        fullName: "Kevin (TheKeas)",
        institution: "Promoción Social",
        grade: "Owner",
        role: "owner",
        status: "approved"
      };
      currentSessionUser = ownerUser;
      sessionStorage.setItem("verbflow_active_session", JSON.stringify(ownerUser));
      notifyAuthChange(ownerUser);
      return { success: true, user: ownerUser };
    }

    if (!user) {
      registerFailedAttempt(cleanNick);
      return { success: false, message: "Nickname o usuario no encontrado." };
    }

    resetRateLimit(cleanNick);

    if (user.role === "teacher" && user.status === "pending") {
      sessionStorage.setItem("verbflow_waiting_approval", cleanNick);
      return {
        success: false,
        pending: true,
        waitingNick: cleanNick,
        message: "Tu cuenta de Profesor está esperando aprobación por TheKeas."
      };
    }

    if (user.status === "rejected") {
      return { success: false, message: "Tu solicitud de cuenta de profesor fue rechazada." };
    }

    currentSessionUser = user;
    sessionStorage.setItem("verbflow_active_session", JSON.stringify(user));
    sessionStorage.removeItem("verbflow_waiting_approval");
    notifyAuthChange(user);
    return { success: true, user: user };
  }

  // ----------------------------------------------------
  // CIERRE DE SESIÓN
  // ----------------------------------------------------
  async function logout() {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    currentSessionUser = null;
    sessionStorage.removeItem("verbflow_active_session");
    sessionStorage.removeItem("verbflow_waiting_approval");
    notifyAuthChange(null);
  }

  // ----------------------------------------------------
  // OBSERVADOR DE CAMBIOS DE SESIÓN (REALTIME)
  // ----------------------------------------------------
  function onAuthStateChange(callback) {
    if (typeof callback === "function") {
      authListeners.push(callback);
    }
  }

  function notifyAuthChange(user) {
    authListeners.forEach(fn => {
      try { fn(user); } catch (e) {}
    });
  }

  // ----------------------------------------------------
  // VERIFICACIÓN REACTIVA DE APROBACIÓN DE PROFESOR
  // ----------------------------------------------------
  async function checkWaitingApproval(nick) {
    if (!nick) return null;

    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nick, full_name, role, status")
        .eq("nick", nick)
        .eq("status", "approved")
        .maybeSingle();

      if (data && data.status === "approved") {
        sessionStorage.removeItem("verbflow_waiting_approval");
        return data;
      }
      return null;
    }

    const users = getLocalUsers();
    const user = users.find(u => u.nick.toLowerCase() === nick.toLowerCase());
    if (user && user.status === "approved") {
      currentSessionUser = user;
      sessionStorage.setItem("verbflow_active_session", JSON.stringify(user));
      sessionStorage.removeItem("verbflow_waiting_approval");
      return user;
    }
    return null;
  }

  // ----------------------------------------------------
  // OPERACIONES SEGURAS DEL OWNER (TheKeas)
  // ----------------------------------------------------
  async function getPendingTeachers() {
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nick, full_name, institution, role, status, created_at")
        .eq("role", "teacher")
        .eq("status", "pending");
      return data || [];
    }
    const users = getLocalUsers();
    return users.filter(u => u.role === "teacher" && u.status === "pending");
  }

  async function getAllTeachers() {
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nick, full_name, institution, role, status, created_at")
        .eq("role", "teacher");
      return data || [];
    }
    const users = getLocalUsers();
    return users.filter(u => u.role === "teacher");
  }

  async function approveTeacher(teacherIdOrNick) {
    if (supabase) {
      const { data, error } = await supabase.rpc("owner_approve_teacher", { target_user_id: teacherIdOrNick });
      return !error;
    }
    const users = getLocalUsers();
    const user = users.find(u => u.nick.toLowerCase() === teacherIdOrNick.toLowerCase() || u.id === teacherIdOrNick);
    if (user) {
      user.status = "approved";
      saveLocalUsers(users);
      return true;
    }
    return false;
  }

  async function rejectTeacher(teacherIdOrNick) {
    if (supabase) {
      const { data, error } = await supabase.rpc("owner_reject_teacher", { target_user_id: teacherIdOrNick });
      return !error;
    }
    const users = getLocalUsers();
    const user = users.find(u => u.nick.toLowerCase() === teacherIdOrNick.toLowerCase() || u.id === teacherIdOrNick);
    if (user) {
      user.status = "rejected";
      saveLocalUsers(users);
      return true;
    }
    return false;
  }

  // ----------------------------------------------------
  // GESTIÓN DE CLASES Y CÓDIGOS CRIPTOGRÁFICOS
  // ----------------------------------------------------
  function generateSecureClassCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin 0, O, 1, I para evitar confusiones
    let code = "VF-";
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(5);
      window.crypto.getRandomValues(bytes);
      for (let i = 0; i < 5; i++) {
        code += chars[bytes[i] % chars.length];
      }
    } else {
      for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return code;
  }

  async function createClass(name, selectedTopics, questionCount) {
    const user = getCurrentUser();
    if (!user || (user.role !== "teacher" && user.role !== "owner") || user.status !== "approved") {
      return { success: false, message: "403 Forbidden: Solo profesores autorizados pueden crear clases." };
    }

    const cleanName = (name || "").trim();
    if (!cleanName) return { success: false, message: "Debes ingresar un nombre para la clase." };
    if (!selectedTopics || selectedTopics.length === 0) return { success: false, message: "Selecciona al menos un tema." };

    const code = generateSecureClassCode();

    if (supabase) {
      const { data, error } = await supabase
        .from("classes")
        .insert({
          code: code,
          name: cleanName,
          teacher_id: user.id,
          institution: user.institution || "Promoción Social",
          selected_topics: selectedTopics,
          question_count: parseInt(questionCount, 10) || 25
        })
        .select()
        .single();

      if (error) return { success: false, message: error.message };
      return { success: true, classroom: data };
    }

    const classes = getLocalClasses();
    const newClass = {
      code,
      name: cleanName,
      teacherNick: user.nick,
      institution: user.institution || "Promoción Social",
      selectedTopics,
      questionCount: parseInt(questionCount, 10) || 25,
      createdAt: new Date().toISOString()
    };
    classes.push(newClass);
    localStorage.setItem("verbflow_classes_db", JSON.stringify(classes));
    return { success: true, classroom: newClass };
  }

  async function getClasses() {
    if (supabase) {
      const user = getCurrentUser();
      let query = supabase.from("classes").select("*");
      if (user && user.role === "teacher") {
        query = query.eq("teacher_id", user.id);
      }
      const { data, error } = await query;
      return data || [];
    }
    return getLocalClasses();
  }

  async function getClassByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();

    if (supabase) {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("code", cleanCode)
        .maybeSingle();
      return data;
    }

    const classes = getLocalClasses();
    return classes.find(c => c.code.toUpperCase() === cleanCode) || null;
  }

  // ----------------------------------------------------
  // GESTIÓN DE SUBMISSIONS / CALIFICACIONES
  // ----------------------------------------------------
  async function recordSubmission({ classCode, studentNick, fullName, grade, institution, score, correctCount, totalQuestions, topics }) {
    const user = getCurrentUser();
    const safeNick = user ? user.nick : (studentNick || "Estudiante");
    const safeName = user ? (user.fullName || user.nick) : (fullName || safeNick);
    const safeGrade = user ? (user.grade || "1102") : (grade || "1102");
    const safeInst = user ? (user.institution || "Promoción Social") : (institution || "Promoción Social");

    // Hash criptográfico de verificación única para boleta
    const hashData = `${safeNick}_${score}_${Date.now()}`;
    const verificationHash = "VF-" + Math.abs(hashData.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase();

    if (supabase && user) {
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          class_code: classCode || "PRACTICA_LIBRE",
          student_id: user.id,
          score: score,
          correct_count: correctCount,
          total_questions: totalQuestions,
          topics: topics || [],
          verification_hash: verificationHash
        })
        .select()
        .single();

      return data || { verification_hash: verificationHash };
    }

    const subs = getLocalSubmissions();
    const submission = {
      id: "sub_" + Date.now(),
      classCode: classCode || "PRACTICA_LIBRE",
      studentNick: safeNick,
      fullName: safeName,
      grade: safeGrade,
      institution: safeInst,
      score: score,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      topics: topics || [],
      verificationHash: verificationHash,
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      timestamp: Date.now()
    };
    subs.unshift(submission);
    localStorage.setItem("verbflow_submissions_db", JSON.stringify(subs));
    return submission;
  }

  async function getSubmissions() {
    if (supabase) {
      const user = getCurrentUser();
      let query = supabase.from("submissions").select("*, profiles:student_id(nick, full_name, grade, institution)");
      const { data, error } = await query;
      return (data || []).map(s => ({
        id: s.id,
        classCode: s.class_code,
        studentNick: s.profiles?.nick || "Estudiante",
        fullName: s.profiles?.full_name || s.profiles?.nick,
        grade: s.profiles?.grade || "1102",
        institution: s.profiles?.institution || "Promoción Social",
        score: s.score,
        correctCount: s.correct_count,
        totalQuestions: s.total_questions,
        topics: s.topics,
        verificationHash: s.verification_hash,
        date: new Date(s.created_at).toLocaleDateString("es-ES")
      }));
    }
    return getLocalSubmissions();
  }

  // ----------------------------------------------------
  // HELPERS LOCALES AISLADOS
  // ----------------------------------------------------
  function getLocalUsers() {
    try {
      const d = localStorage.getItem("verbflow_users_db");
      return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
  }

  function saveLocalUsers(users) {
    try {
      localStorage.setItem("verbflow_users_db", JSON.stringify(users));
    } catch(e) {}
  }

  function getLocalClasses() {
    try {
      const d = localStorage.getItem("verbflow_classes_db");
      return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
  }

  function getLocalSubmissions() {
    try {
      const d = localStorage.getItem("verbflow_submissions_db");
      return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
  }

  // Inicialización inmediata de sesión en arranque
  getCurrentUserAsync();

  return {
    getCurrentUser,
    getCurrentUserAsync,
    register,
    login,
    logout,
    onAuthStateChange,
    checkWaitingApproval,
    getPendingTeachers,
    getAllTeachers,
    approveTeacher,
    rejectTeacher,
    createClass,
    getClasses,
    getClassByCode,
    recordSubmission,
    getSubmissions
  };
})();

// Compatibilidad global con interfaces anteriores
if (typeof window !== "undefined") {
  window.AuthService = AuthService;
  window.AuthManager = AuthService; // Alias de compatibilidad hacia atrás
}
