// ========================================================
// VerbFlow - Certificate & Report Image Generator
// Genera boletas oficiales de calificación (0-100) en formato
// imagen PNG de alta resolución usando HTML5 Canvas nativo
// ========================================================

const CertificateGenerator = (() => {

  function createCertificateCanvas({ studentNick, score, correctCount, totalQuestions, topicsName, classCode }) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // 1. Fondo degradado de alta gama (Navy Dark a Midnight Blue)
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGradient.addColorStop(0, "#0b0f19");
    bgGradient.addColorStop(0.5, "#111827");
    bgGradient.addColorStop(1, "#1f2937");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 800);

    // 2. Borde decorativo exterior dorado / cian
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.strokeRect(40, 40, 1120, 720);

    // Esquinas doradas
    drawCornerAccent(ctx, 40, 40, 1, 1);
    drawCornerAccent(ctx, 1160, 40, -1, 1);
    drawCornerAccent(ctx, 40, 760, 1, -1);
    drawCornerAccent(ctx, 1160, 760, -1, -1);

    // 3. Encabezado de la Academia
    ctx.textAlign = "center";
    ctx.font = "bold 22px 'Outfit', sans-serif";
    ctx.fillStyle = "#60a5fa";
    ctx.letterSpacing = "2px";
    ctx.fillText("⚡ VERBFLOW ACADEMY — ENGLISH LANGUAGE PROGRAM", 600, 95);

    ctx.font = "800 38px 'Outfit', sans-serif";
    ctx.fillStyle = "#f9fafb";
    ctx.fillText("BOLETA OFICIAL DE EVALUACIÓN", 600, 145);

    ctx.font = "16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Certificación de rendimiento y evaluación de tiempos verbales", 600, 175);

    // Línea divisoria
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(1050, 200);
    ctx.stroke();

    // 4. Nombre del Estudiante
    ctx.font = "18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Se otorga la presente constancia de calificación a:", 600, 235);

    ctx.font = "bold 44px 'Outfit', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(studentNick || "Estudiante", 600, 290);

    // 5. Círculo / Tarjeta de Calificación Central (Escala 0 - 100)
    const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";
    const statusText = score >= 80 ? "¡EXCELENTE DOMINIO!" : score >= 60 ? "APROBADO" : "NECESITA REFUERZO";

    // Fondo tarjeta de puntuación
    drawRoundedRect(ctx, 400, 320, 400, 150, 20, "rgba(255, 255, 255, 0.04)", scoreColor);

    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("CALIFICACIÓN OBTENIDA", 600, 355);

    ctx.font = "800 68px 'Outfit', sans-serif";
    ctx.fillStyle = scoreColor;
    ctx.fillText(`${score}`, 575, 425);

    ctx.font = "bold 26px 'Outfit', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("/ 100", 670, 420);

    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = scoreColor;
    ctx.fillText(statusText, 600, 455);

    // 6. Tarjetas de Métricas Estadísticas
    const incorrect = Math.max(0, totalQuestions - correctCount);
    drawStatCard(ctx, 160, 500, 200, 95, "Total Preguntas", `${totalQuestions}`, "#60a5fa");
    drawStatCard(ctx, 390, 500, 200, 95, "Aciertos", `${correctCount} ✔`, "#10b981");
    drawStatCard(ctx, 620, 500, 200, 95, "Fallos", `${incorrect} ✘`, "#f43f5e");
    drawStatCard(ctx, 850, 500, 200, 95, "Efectividad", `${score}%`, "#fbbf24");

    // 7. Información contextual (Temas y Clase)
    ctx.textAlign = "left";
    ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Temas evaluados:", 160, 640);

    ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#f3f4f6";
    const truncatedTopics = (topicsName || "Evaluación General").length > 70 
      ? (topicsName || "").substring(0, 67) + "..." 
      : (topicsName || "Evaluación General");
    ctx.fillText(truncatedTopics, 300, 640);

    if (classCode) {
      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText("Código de Clase:", 160, 670);

      ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#60a5fa";
      ctx.fillText(classCode, 300, 670);
    }

    // 8. Sello de Validación y Fecha
    const dateStr = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    ctx.textAlign = "right";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Fecha de emisión: ${dateStr}`, 1040, 670);

    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    const hash = "VF-" + Math.abs((studentNick + score + Date.now()).split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase();
    ctx.fillText(`ID de Verificación: ${hash}`, 1040, 695);

    return canvas;
  }

  function drawCornerAccent(ctx, x, y, dx, dy) {
    ctx.beginPath();
    ctx.moveTo(x, y + 25 * dy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 25 * dx, y);
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
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(label, x + w / 2, y + 34);

    ctx.font = "bold 26px 'Outfit', sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(value, x + w / 2, y + 72);
  }

  // Descarga directa del archivo .PNG en el dispositivo
  function downloadCertificate(data) {
    const canvas = createCertificateCanvas(data);
    const link = document.createElement("a");
    const safeNick = (data.studentNick || "Estudiante").replace(/[^a-z0-9]/gi, "_");
    link.download = `VerbFlow_Calificacion_${safeNick}_${data.score}pts.png`;
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

// Exportar globalmente
if (typeof window !== "undefined") {
  window.CertificateGenerator = CertificateGenerator;
}
