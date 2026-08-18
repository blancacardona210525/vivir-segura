(() => {
  "use strict";

  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const $ = (selector, root = document) => root.querySelector(selector);

  const panels = $$(".panel");
  const tabs = $$(".tab");
  const mobileTabs = $$(".mobile-tab");

  function showPanel(id) {
    panels.forEach(panel => panel.classList.toggle("active-panel", panel.id === id));
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.target === id));
    mobileTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.target === id));
    const panel = document.getElementById(id);
    if (panel) {
      panel.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  $$("[data-target]").forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.target)));
  $$("[data-go]").forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.go)));

  const topicSearch = $("#topicSearch");
  const topicCategory = $("#topicCategory");
  const learningCards = $$(".learning-topic");
  const learningEmpty = $("#learningEmpty");

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function filterLearningTopics() {
    if (!topicSearch || !topicCategory) return;
    const term = normalizeText(topicSearch.value);
    const category = topicCategory.value;
    let visible = 0;

    learningCards.forEach(card => {
      const searchable = normalizeText(`${card.dataset.search || ""} ${card.textContent || ""}`);
      const matchesTerm = !term || searchable.includes(term);
      const matchesCategory = category === "all" || card.dataset.category === category;
      const show = matchesTerm && matchesCategory;
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });

    if (learningEmpty) learningEmpty.classList.toggle("hidden", visible !== 0);
  }

  if (topicSearch) topicSearch.addEventListener("input", filterLearningTopics);
  if (topicCategory) topicCategory.addEventListener("change", filterLearningTopics);

  $("#quickExit").addEventListener("click", () => {
    document.title = "Google";
    window.location.replace("https://www.google.com/");
  });

  const discreetCover = $("#discreetCover");
  $("#discreetMode").addEventListener("click", () => {
    discreetCover.classList.remove("hidden");
    discreetCover.setAttribute("aria-hidden", "false");
    document.title = "Mis notas";
  });
  $("#leaveDiscreet").addEventListener("click", () => {
    discreetCover.classList.add("hidden");
    discreetCover.setAttribute("aria-hidden", "true");
    document.title = "Vivir Segura";
  });

  let fontScale = 1;
  function applyFontScale() {
    document.documentElement.style.setProperty("--font-scale", fontScale.toFixed(2));
  }
  $("#fontUp").addEventListener("click", () => { fontScale = Math.min(1.3, fontScale + .1); applyFontScale(); });
  $("#fontDown").addEventListener("click", () => { fontScale = Math.max(.9, fontScale - .1); applyFontScale(); });

  $("#contrastToggle").addEventListener("click", (event) => {
    const enabled = document.body.classList.toggle("high-contrast");
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
  });

  const signalForm = $("#signalForm");
  const signalResult = $("#signalResult");
  signalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = $$('input[name="signal"]:checked', signalForm);
    const score = selected.reduce((sum, input) => sum + Number(input.value), 0);
    const critical = selected.some(input => input.value === "3");

    signalResult.className = "result-card";
    if (critical || score >= 6) {
      signalResult.classList.add("high");
      signalResult.innerHTML = `<h3>Hay señales que pueden representar un riesgo importante</h3>
        <p>Considera priorizar tu seguridad y buscar orientación especializada. Si existe peligro inmediato y puedes hacerlo de manera segura, llama al <strong>911</strong> o a la <strong>Línea 1-1-4</strong>.</p>
        <div class="button-row"><a class="secondary-btn" href="tel:911">Llamar 911</a><a class="primary-btn" href="tel:114">Llamar 1-1-4</a></div>`;
    } else if (score >= 2) {
      signalResult.classList.add("medium");
      signalResult.innerHTML = `<h3>Hay conductas de control o violencia que merecen atención</h3>
        <p>Podría ser útil revisar la evaluación de riesgo, preparar un plan de seguridad y solicitar orientación. No necesitas esperar a que la situación empeore para pedir ayuda.</p>`;
    } else {
      signalResult.classList.add("low");
      signalResult.innerHTML = `<h3>No marcaste varias señales en esta guía</h3>
        <p>Este resultado no descarta violencia. Si una conducta te genera miedo, presión o limita tu libertad, puedes solicitar orientación igualmente.</p>`;
    }
  });

  const riskForm = $("#riskForm");
  const riskResult = $("#riskResult");
  riskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = $$('input[name="risk"]:checked', riskForm);
    const score = selected.reduce((sum, input) => sum + Number(input.value), 0);
    const critical = selected.some(input => input.dataset.critical === "1");

    riskResult.className = "result-card";
    if (critical || score >= 10) {
      riskResult.classList.add("high");
      riskResult.innerHTML = `<h3>Orientación: señales de riesgo alto</h3>
        <p>Se identificaron señales que pueden asociarse con peligro grave. Si existe riesgo inmediato, prioriza un lugar seguro y contacta al <strong>911</strong> cuando sea posible. La <strong>Línea 1-1-4</strong> puede brindar orientación y derivación.</p>
        <div class="button-row"><a class="secondary-btn" href="tel:911">Llamar 911</a><a class="primary-btn" href="tel:114">Llamar 1-1-4</a><button class="ghost-btn" type="button" data-risk-plan>Crear plan de seguridad</button></div>`;
    } else if (score >= 4) {
      riskResult.classList.add("medium");
      riskResult.innerHTML = `<h3>Orientación: hay señales importantes</h3>
        <p>Considera hablar con un servicio especializado y preparar un plan de seguridad. Si la situación aumenta o aparece una señal crítica, busca ayuda inmediata.</p>
        <div class="button-row"><button class="primary-btn" type="button" data-risk-plan>Crear plan de seguridad</button><a class="ghost-btn" href="tel:114">Llamar 1-1-4</a></div>`;
    } else {
      riskResult.classList.add("low");
      riskResult.innerHTML = `<h3>Orientación: no se identificó un puntaje alto en esta guía</h3>
        <p>Esto no significa que una situación de violencia sea menor o que no merezca atención. Tu percepción de miedo, control o inseguridad también importa.</p>`;
    }

    $$("[data-risk-plan]", riskResult).forEach(btn => btn.addEventListener("click", () => showPanel("plan")));
  });

  $("#resetRisk").addEventListener("click", () => {
    riskForm.reset();
    riskResult.className = "result-card hidden";
    riskResult.innerHTML = "";
  });

  function esc(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function data(form) {
    return new FormData(form);
  }

  const safetyForm = $("#safetyForm");
  const safetyResult = $("#safetyResult");
  const safetyText = $("#safetyText");
  let currentSafetyPlain = "";

  safetyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = data(safetyForm);
    const contacto = fd.get("contacto") || "No indicado";
    const clave = fd.get("clave") || "No indicada";
    const lugar = fd.get("lugar") || "No indicado";
    const ruta = fd.get("ruta") || "No indicada";
    const elementos = fd.get("elementos") || "No indicados";
    const acciones = fd.get("acciones") || "No indicadas";

    currentSafetyPlain =
`MI PLAN DE SEGURIDAD
Persona de confianza: ${contacto}
Palabra o señal acordada: ${clave}
Lugar seguro posible: ${lugar}
Transporte o ruta: ${ruta}
Elementos importantes: ${elementos}
Otras acciones: ${acciones}

Este plan es orientativo y debe adaptarse a lo que sea seguro en cada situación.`;

    safetyText.innerHTML = `
      <p><strong>Persona de confianza:</strong> ${esc(contacto)}</p>
      <p><strong>Palabra o señal:</strong> ${esc(clave)}</p>
      <p><strong>Lugar seguro posible:</strong> ${esc(lugar)}</p>
      <p><strong>Transporte o ruta:</strong> ${esc(ruta)}</p>
      <p><strong>Elementos importantes:</strong> ${esc(elementos)}</p>
      <p><strong>Otras acciones:</strong> ${esc(acciones)}</p>`;
    safetyResult.classList.remove("hidden");
  });

  $("#clearSafety").addEventListener("click", () => {
    safetyForm.reset();
    safetyResult.classList.add("hidden");
    safetyText.innerHTML = "";
    currentSafetyPlain = "";
  });

  $("#copySafety").addEventListener("click", async () => {
    if (!currentSafetyPlain) return;
    try {
      await navigator.clipboard.writeText(currentSafetyPlain);
      $("#copySafety").textContent = "Copiado";
      setTimeout(() => $("#copySafety").textContent = "Copiar", 1600);
    } catch {
      alert("El navegador no permitió copiar automáticamente.");
    }
  });

  const reportForm = $("#reportForm");
  const reportResult = $("#reportResult");
  const reportText = $("#reportText");
  let currentReportPlain = "";

  reportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = data(reportForm);
    const alias = fd.get("alias") || "No indicado";
    const edad = fd.get("edad") || "No indicada";
    const departamento = fd.get("departamento") || "No indicado";
    const localidad = fd.get("localidad") || "No indicada";
    const fecha = fd.get("fecha") || "No indicada";
    const relacion = fd.get("relacion") || "No indicada";
    const tipos = fd.getAll("tipo");
    const relato = fd.get("relato") || "No indicado";
    const frecuencia = fd.get("frecuencia") || "No indicada";
    const dependientes = fd.get("dependientes") || "No indicado";
    const evidencias = fd.get("evidencias") || "No indicadas";
    const necesidades = fd.getAll("necesidad");
    const pueblo = fd.get("pueblo") || "No indicado";
    const idioma = fd.get("idioma") || "No indicado";
    const apoyos = fd.getAll("apoyo");

    currentReportPlain =
`RESUMEN PARA ORIENTACIÓN / PRE-DENUNCIA
Nombre o alias: ${alias}
Edad: ${edad}
Departamento: ${departamento}
Municipio/localidad: ${localidad}
Fecha aproximada del hecho más reciente: ${fecha}
Relación con la persona agresora: ${relacion}

Tipos de situación reportados: ${tipos.length ? tipos.join(", ") : "No indicados"}
Frecuencia: ${frecuencia}
Personas dependientes involucradas: ${dependientes}

RELATO:
${relato}

Evidencias o información disponible: ${evidencias}
Necesidades de atención: ${necesidades.length ? necesidades.join(", ") : "No indicadas"}

ATENCIÓN INCLUSIVA (OPCIONAL):
Pueblo/comunidad: ${pueblo}
Lengua o idioma preferido: ${idioma}
Apoyos solicitados: ${apoyos.length ? apoyos.join(", ") : "No indicados"}

NOTA: Este resumen fue generado por una herramienta de demostración y no constituye una denuncia oficial.`;

    reportText.innerHTML = `
      <p><strong>Nombre o alias:</strong> ${esc(alias)} &nbsp; <strong>Edad:</strong> ${esc(edad)}</p>
      <p><strong>Ubicación:</strong> ${esc(departamento)}${localidad !== "No indicada" ? ", " + esc(localidad) : ""}</p>
      <p><strong>Fecha aproximada:</strong> ${esc(fecha)} &nbsp; <strong>Relación:</strong> ${esc(relacion)}</p>
      <p><strong>Tipos:</strong> ${esc(tipos.length ? tipos.join(", ") : "No indicados")}</p>
      <p><strong>Frecuencia:</strong> ${esc(frecuencia)} &nbsp; <strong>Personas dependientes:</strong> ${esc(dependientes)}</p>
      <hr>
      <p><strong>Relato:</strong></p><p>${esc(relato).replace(/\n/g, "<br>")}</p>
      <p><strong>Evidencias:</strong> ${esc(evidencias)}</p>
      <p><strong>Necesidades:</strong> ${esc(necesidades.length ? necesidades.join(", ") : "No indicadas")}</p>
      <hr>
      <p><strong>Atención inclusiva:</strong> Pueblo/comunidad: ${esc(pueblo)}; lengua/idioma: ${esc(idioma)}; apoyos: ${esc(apoyos.length ? apoyos.join(", ") : "No indicados")}.</p>`;
    reportResult.classList.remove("hidden");
    reportResult.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#clearReport").addEventListener("click", () => {
    reportForm.reset();
    reportResult.classList.add("hidden");
    reportText.innerHTML = "";
    currentReportPlain = "";
  });

  $("#copyReport").addEventListener("click", async () => {
    if (!currentReportPlain) return;
    try {
      await navigator.clipboard.writeText(currentReportPlain);
      $("#copyReport").textContent = "Copiado";
      setTimeout(() => $("#copyReport").textContent = "Copiar", 1600);
    } catch {
      alert("El navegador no permitió copiar automáticamente.");
    }
  });

  $("#printReport").addEventListener("click", () => {
    if (!currentReportPlain) return;
    window.print();
  });

  let deferredPrompt = null;
  const installButton = $("#installApp");

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.classList.remove("hidden");
  });

  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.classList.add("hidden");
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
