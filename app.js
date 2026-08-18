const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.panel')];

function goToPanel(id) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.target === id));
  panels.forEach((panel) => panel.classList.toggle('active-panel', panel.id === id));
  const target = document.getElementById(id);
  if (target) {
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

tabs.forEach((tab) => tab.addEventListener('click', () => goToPanel(tab.dataset.target)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => goToPanel(button.dataset.go)));

document.getElementById('quickExit').addEventListener('click', () => {
  document.body.innerHTML = '<main style="font-family:system-ui;padding:2rem"><h1>Página de inicio</h1><p>Contenido cerrado.</p></main>';
  history.replaceState(null, '', 'about:blank');
  window.location.replace('https://www.google.com');
});

const riskForm = document.getElementById('riskForm');
const riskResult = document.getElementById('riskResult');

riskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const checked = [...riskForm.querySelectorAll('input[name="risk"]:checked')];
  const score = checked.reduce((total, input) => total + Number(input.value), 0);
  const hasCritical = checked.some((input) => input.value === '3');

  riskResult.className = 'card result-card';

  if (hasCritical || score >= 6) {
    riskResult.classList.add('result-high');
    riskResult.innerHTML = `
      <h3>Hay señales de riesgo alto</h3>
      <p>Algunas respuestas indican peligro que puede requerir atención inmediata. Si hacerlo es seguro, contacta al <strong>911</strong> o a la <strong>Línea 1-1-4</strong> y busca un lugar seguro.</p>
      <div class="button-row"><a class="primary-btn" href="tel:911">Llamar 911</a><a class="secondary-btn" href="tel:114">Llamar 1-1-4</a></div>`;
  } else if (score >= 2) {
    riskResult.classList.add('result-medium');
    riskResult.innerHTML = `
      <h3>Hay señales que merecen atención</h3>
      <p>Considera hablar con un servicio especializado, preparar un plan de seguridad y registrar los hechos de forma segura. Puedes llamar al <strong>1-1-4</strong> para orientación.</p>`;
  } else {
    riskResult.classList.add('result-low');
    riskResult.innerHTML = `
      <h3>No se identificaron señales altas en esta guía</h3>
      <p>Esto no significa que una situación de violencia sea menor o que no merezca apoyo. Si algo te preocupa, puedes solicitar orientación igualmente.</p>`;
  }
});

const reportForm = document.getElementById('reportForm');
const reportResult = document.getElementById('reportResult');

document.getElementById('clearReport').addEventListener('click', () => {
  reportForm.reset();
  reportResult.classList.add('hidden');
});

function formDataToObject(form) {
  const fd = new FormData(form);
  return {
    alias: fd.get('alias') || null,
    edad: fd.get('edad') ? Number(fd.get('edad')) : null,
    departamento: fd.get('departamento'),
    localidad: fd.get('localidad') || null,
    tipos: fd.getAll('tipo'),
    relato: fd.get('relato'),
    fecha: fd.get('fecha') || null,
    relacion: fd.get('relacion') || null,
    necesidades: fd.getAll('necesidad'),
    evidencias: fd.get('evidencias') || null,
    consentimiento: fd.get('consentimiento') === 'on'
  };
}

reportForm.addEventListener('submit', (event) => {
  event.preventDefault();
  reportResult.className = 'card result-card result-medium';
  reportResult.innerHTML = `
    <h3>Formulario de demostración</h3>
    <p><strong>La información no fue enviada ni almacenada.</strong></p>
    <p>Esta versión permite organizar los datos para una posible denuncia, pero todavía no está conectada oficialmente con SEMUJER, 911, Policía Nacional ni Ministerio Público.</p>
    <div class="button-row"><a class="primary-btn" href="tel:114">Llamar 1-1-4</a><a class="secondary-btn" href="tel:911">Llamar 911</a></div>`;
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
