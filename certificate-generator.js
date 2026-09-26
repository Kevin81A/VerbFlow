// ========================================================
// VerbFlow - Certificate & Report Image Generator (v3.0)
// Boleta oficial con Institución Educativa (Promoción Social),
// Grado (ej. 1102), Nombre Completo, Nickname y Calificación (0-100)
// ========================================================

const CertificateGenerator = (() => {

  function createCertificateCanvas({ studentNick, fullName, grade, institution, score, correctCount, totalQuestions, topicsName, classCode }) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext("2d");

    // 1. Fondo elegante degradado
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGradient.addColorStop(0, "#0b0f19");
    bgGradient.addColorStop(0.5, "#111827");
    bgGradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 840);

    // 2. Marcos y esquinas doradas
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(59, 130, 246, 0.45)";
    ctx.strokeRect(30, 30, 1140, 780);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.strokeRect(42, 42, 1116, 756);

    drawCornerAccent(ctx, 42, 42, 1, 1);
    drawCornerAccent(ctx, 1158, 42, -1, 1);
    drawCornerAccent(ctx, 42, 798, 1, -1);
    drawCornerAccent(ctx, 1158, 798, -1, -1);

    // 3. Encabezado de la Institución y Academia
    ctx.textAlign = "center";
    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.fillStyle = "#38bdf8";
    const instText = (institution || "Institución Educativa Promoción Social").toUpperCase();
    ctx.fillText(`🏛️ ${instText}`, 600, 85);

    ctx.font = "800 34px 'Outfit', sans-serif";
    ctx.fillStyle = "#f9fafb";
    ctx.fillText("BOLETA OFICIAL DE EVALUACIÓN DE INGLÉS", 600, 130);

    ctx.font = "600 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("VerbFlow Academy — Sistema de Verificación y Competencias Lingüísticas", 600, 160);

    // Línea divisoria
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.moveTo(120, 185);
    ctx.lineTo(1080, 185);
    ctx.stroke();

    // 4. Nombre Completo del Estudiante y Grado
    ctx.font = "16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Se certifica el desempeño académico y la calificación obtenida por el alumno(a):", 600, 220);

    // Nombre completo destacado
    ctx.font = "bold 40px 'Outfit', sans-serif";
    ctx.fillStyle = "#fbbf24";
    const displayName = fullName || studentNick || "Estudiante";
    ctx.fillText(displayName, 600, 270);

    // Grado y Nick
    ctx.font = "600 17px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    const gradeStr = grade ? `Grado: ${grade}` : "Grado: 1102";
    const nickStr = studentNick ? ` (Nick: ${studentNick})` : "";
    ctx.fillText(`${gradeStr}${nickStr}`, 600, 305);

    // 5. Círculo / Tarjeta Central de Calificación 0 a 100
    const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";
    const statusText = score >= 80 ? "¡EXCELENTE DOMINIO!" : score >= 60 ? "APROBADO CON ÉXITO" : "REQUIERE REFUERZO";

    drawRoundedRect(ctx, 380, 340, 440, 155, 20, "rgba(255, 255, 255, 0.04)", scoreColor);

    ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("CALIFICACIÓN OBTENIDA", 600, 375);

    ctx.font = "800 70px 'Outfit', sans-serif";
    ctx.fillStyle = scoreColor;
    ctx.fillText(`${score}`, 570, 445);

    ctx.font = "bold 26px 'Outfit', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("/ 100", 670, 440);

    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = scoreColor;
    ctx.fillText(statusText, 600, 478);

    // 6. Tarjetas de Métricas Estadísticas
    const incorrect = Math.max(0, totalQuestions - correctCount);
    drawStatCard(ctx, 140, 525, 210, 95, "Total Preguntas", `${totalQuestions}`, "#60a5fa");
    drawStatCard(ctx, 380, 525, 210, 95, "Aciertos", `${correctCount} ✔`, "#10b981");
    drawStatCard(ctx, 620, 525, 210, 95, "Fallos", `${incorrect} ✘`, "#f43f5e");
    drawStatCard(ctx, 860, 525, 210, 95, "Efectividad", `${score}%`, "#fbbf24");

    // 7. Información contextual
    ctx.textAlign = "left";
    ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Temas evaluados:", 140, 665);

    ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#f8fafc";
    const truncatedTopics = (topicsName || "Evaluación General").length > 70 
      ? (topicsName || "").substring(0, 67) + "..." 
      : (topicsName || "Evaluación General");
    ctx.fillText(truncatedTopics, 280, 665);

    if (classCode) {
      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Código de Clase:", 140, 695);

      ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(classCode, 280, 695);
    }

    // 8. Sello de Validación y Fecha
    const dateStr = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    ctx.textAlign = "right";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Fecha de emisión: ${dateStr}`, 1060, 695);

    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    const hash = "VF-" + Math.abs((displayName + score + Date.now()).split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase();
    ctx.fillText(`ID de Verificación: ${hash}`, 1060, 720);

    return canvas;
  }

  function drawCornerAccent(ctx, x, y, dx, dy) {
    ctx.beginPath();
    ctx.moveTo(x, y + 26 * dy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 26 * dx, y);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawRoundedRect(ctx, x, y, w, h, r, bg, border) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawStatCard(ctx, x, y, w, h, label, value, color) {
    drawRoundedRect(ctx, x, y, w, h, 12, "rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)");
    ctx.textAlign = "center";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(label, x + w / 2, y + 34);

    ctx.font = "bold 26px 'Outfit', sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(value, x + w / 2, y + 72);
  }

  function downloadCertificate(data) {
    const canvas = createCertificateCanvas(data);
    const link = document.createElement("a");
    const safeName = (data.fullName || data.studentNick || "Estudiante").replace(/[^a-z0-9]/gi, "_");
    link.download = `VerbFlow_${safeName}_${data.score}pts.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    createCertificateCanvas,
    downloadCertificate
  };
})();

if (typeof window !== "undefined") {
  window.CertificateGenerator = CertificateGenerator;
}
