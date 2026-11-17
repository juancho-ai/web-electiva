// Navegación entre pestañas
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const targetPanel = document.getElementById(tabId);
  const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (targetPanel) targetPanel.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  document.getElementById('tabNav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('tabNav').classList.toggle('open');
});

// Selector de biografías
function showBio(person, btn) {
  document.querySelectorAll('.bio-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.bio-tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`bio-${person}`).classList.add('active');
  btn.classList.add('active');
}

// Laboratorio 1: Regla de Merton / Gráfica de Nicole Oresme
function updateOresmeLab() {
  const t = Number(document.getElementById('rangeTime').value);
  const vf = Number(document.getElementById('rangeVel').value);
  document.getElementById('valTime').textContent = t;
  document.getElementById('valVel').textContent = vf;

  const vMedia = vf / 2;
  const distancia = 0.5 * t * vf;

  document.getElementById('oresmeResult').innerHTML =
    `Área Triángulo (1/2 · ${t}s · ${vf}m/s) = <strong>${distancia} m</strong><br>` +
    `Área Rectángulo (${t}s · ${vMedia}m/s) = <strong>${distancia} m</strong>`;

  const canvas = document.getElementById('oresmeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 30;
  const w = (t / 12) * (canvas.width - pad * 2);
  const h = (vf / 20) * (canvas.height - pad * 2);
  const baseY = canvas.height - pad;

  // Triángulo de aceleración uniforme
  ctx.beginPath();
  ctx.moveTo(pad, baseY);
  ctx.lineTo(pad + w, baseY);
  ctx.lineTo(pad + w, baseY - h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rectángulo de velocidad media (vf / 2)
  ctx.strokeStyle = '#f59e0b';
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(pad, baseY - h / 2, w, h / 2);
  ctx.setLineDash([]);
}

// Laboratorio 2: Divina Proporción de Luca Pacioli
function updatePacioliLab() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = Number(document.getElementById('rangeA').value);
  document.getElementById('valA').textContent = a;

  const b = a / phi;
  const total = a + b;

  document.getElementById('pacioliResult').innerHTML =
    `Parte mayor (a) = <strong>${a.toFixed(2)} cm</strong> | Parte menor (b) = <strong>${b.toFixed(2)} cm</strong><br>` +
    `Razón (a + b) / a = ${(total / a).toFixed(5)} ≈ <strong>Φ (1.61803)</strong>`;
}

// Podcast con Web Speech API
let isPlayingPodcast = false;

function togglePodcast() {
  if (!('speechSynthesis' in window)) {
    document.getElementById('podcastStatus').textContent = 'Tu navegador no soporta voz sintetizada; lee el guion abajo.';
    return;
  }

  if (isPlayingPodcast) {
    stopPodcast();
    return;
  }

  const lines = Array.from(document.querySelectorAll('#podcastScript p'));
  let index = 0;
  isPlayingPodcast = true;
  document.getElementById('equalizer').classList.add('playing');
  document.getElementById('playPodcastBtn').textContent = '⏸ Pausar / Detener';
  document.getElementById('podcastStatus').textContent = 'Reproduciendo episodio...';

  function speakNext() {
    if (!isPlayingPodcast || index >= lines.length) {
      stopPodcast();
      return;
    }
    lines.forEach(l => l.classList.remove('speaking'));
    lines[index].classList.add('speaking');

    const utter = new SpeechSynthesisUtterance(lines[index].innerText);
    utter.lang = 'es-ES';
    utter.rate = 1.02;
    utter.onend = () => {
      index++;
      speakNext();
    };
    window.speechSynthesis.speak(utter);
  }

  window.speechSynthesis.cancel();
  speakNext();
}

function stopPodcast() {
  isPlayingPodcast = false;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  document.getElementById('equalizer').classList.remove('playing');
  document.getElementById('playPodcastBtn').textContent = '▶ Reproducir Episodio';
  document.getElementById('podcastStatus').textContent = 'Detenido.';
  document.querySelectorAll('#podcastScript p').forEach(l => l.classList.remove('speaking'));
}

// Juego 1: Calibrador Áureo
function checkPhiGame() {
  const val = Number(document.getElementById('phiGameSlider').value) / 100;
  document.getElementById('phiUserRatio').textContent = val.toFixed(3);
  const diff = Math.abs(val - 1.618);
  const fb = document.getElementById('phiGameFeedback');

  if (diff <= 0.01) {
    fb.textContent = '🎉 ¡Exacto! Has encontrado la Divina Proporción (Φ ≈ 1.618).';
    fb.style.color = '#4ade80';
  } else if (diff <= 0.06) {
    fb.textContent = '🔥 ¡Muy cerca! Ajusta suavemente.';
    fb.style.color = '#fbbf24';
  } else {
    fb.textContent = 'Sigue ajustando hasta llegar a 1.618.';
    fb.style.color = '#94a3b8';
  }
}

// Juego 2: Trivia
const quizData = [
  {
    q: '¿Cómo llamó Nicole Oresme a los ejes precursoras de las coordenadas cartesianas?',
    opts: ['Abscisa y Ordenada', 'Longitudo y Latitudo', 'Debe y Haber'],
    ans: 1
  },
  {
    q: '¿En qué año publicó Luca Pacioli su famosa Summa de Arithmetica?',
    opts: ['1494', '1382', '1543'],
    ans: 0
  },
  {
    q: '¿Qué artista célebre ilustró los poliedros del libro De Divina Proportione de Pacioli?',
    opts: ['Miguel Ángel', 'Rafael Sanzio', 'Leonardo da Vinci'],
    ans: 2
  },
  {
    q: '¿Qué serie matemática demostró Oresme que diverge al infinito?',
    opts: ['La serie armónica (1 + 1/2 + 1/3 + ...)', 'La sucesión de Fibonacci', 'La serie geométrica'],
    ans: 0
  },
  {
    q: '¿Qué sistema contable estandarizó Luca Pacioli?',
    opts: ['El interés compuesto binario', 'La contabilidad por partida doble', 'El cálculo diferencial'],
    ans: 1
  }
];

let currentQ = 0;
let score = 0;

function renderQuiz() {
  const box = document.getElementById('quizBox');
  if (currentQ >= quizData.length) {
    box.innerHTML = `<h4>¡Trivia completada!</h4><p>Obtuviste <strong>${score} de ${quizData.length}</strong> respuestas correctas.</p>` +
      `<button class="btn-primary mt-24" onclick="restartQuiz()">Volver a jugar ↺</button>`;
    return;
  }

  const item = quizData[currentQ];
  document.getElementById('quizProgress').textContent = `Pregunta ${currentQ + 1} de ${quizData.length}`;
  document.getElementById('quizQuestion').textContent = item.q;
  document.getElementById('quizFeedback').textContent = '';

  const optsDiv = document.getElementById('quizOptions');
  optsDiv.innerHTML = '';
  item.opts.forEach((opt, idx) => {
    const b = document.createElement('button');
    b.className = 'quiz-opt';
    b.textContent = opt;
    b.onclick = () => {
      if (idx === item.ans) {
        score++;
        document.getElementById('quizFeedback').textContent = '✅ ¡Correcto!';
      } else {
        document.getElementById('quizFeedback').textContent = `❌ Incorrecto. Era: ${item.opts[item.ans]}`;
      }
      setTimeout(() => {
        currentQ++;
        renderQuiz();
      }, 950);
    };
    optsDiv.appendChild(b);
  });
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  document.getElementById('quizBox').innerHTML = `
    <p class="quiz-progress" id="quizProgress"></p>
    <h4 id="quizQuestion"></h4>
    <div id="quizOptions" class="quiz-options"></div>
    <p id="quizFeedback" class="quiz-feedback"></p>`;
  renderQuiz();
}

// Chatbot simulado
const botReplies = {
  oresme: {
    intro: 'Saludos desde París. Soy Nicole Oresme. ¿Qué deseas saber sobre mis gráficas del movimiento o mis estudios?',
    aporte: 'Representé la velocidad y el tiempo usando figuras geométricas (longitudo y latitudo), demostrando la regla de la velocidad media.',
    obra: 'Mi obra más célebre en matemáticas es Tractatus de configurationibus qualitatum et motuum (c. 1350).',
    hoy: 'Mis diagramas fueron la semilla de las gráficas estadísticas y del cálculo integral que hoy usas en ciencia y programación.'
  },
  pacioli: {
    intro: '¡Buen día! Soy Luca Pacioli. Pregúntame sobre la Divina Proporción, mi amigo Leonardo o la partida doble.',
    aporte: 'Sistematice la contabilidad por partida doble y estudié las propiedades geométricas de la razón áurea (Φ ≈ 1.618).',
    obra: 'Publiqué la Summa de Arithmetica (1494) y De Divina Proportione (1509), ilustrada por Leonardo da Vinci.',
    hoy: 'Cada sistema contable moderno usa mi principio de Debe y Haber, y los diseñadores aplican Φ en interfaces y arquitectura.'
  }
};

function toggleChat() {
  document.getElementById('chatBox').classList.toggle('open');
}

function resetChat() {
  const who = document.getElementById('personaSelect').value;
  document.getElementById('chatMessages').innerHTML = `<div class="msg-bot">${botReplies[who].intro}</div>`;
}

function askBot(topic) {
  const who = document.getElementById('personaSelect').value;
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML += `<div class="msg-bot">${botReplies[who][topic]}</div>`;
  msgs.scrollTop = msgs.scrollHeight;
}

// Fondo animado sutil de partículas matemáticas
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  const symbols = ['Φ', '∑', '∫', 'π', 'Δ', '∞'];
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 24; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: 0.2 + Math.random() * 0.4,
      sym: symbols[i % symbols.length]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.font = '16px Cinzel, serif';
    particles.forEach(p => {
      ctx.fillText(p.sym, p.x, p.y);
      p.y -= p.vy;
      if (p.y < -20) p.y = canvas.height + 20;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Inicialización al cargar
window.addEventListener('DOMContentLoaded', () => {
  updateOresmeLab();
  updatePacioliLab();
  renderQuiz();
  resetChat();
  initBgCanvas();
});
