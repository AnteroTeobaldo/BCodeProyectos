/* ---------- 10 FRASES DE AMOR ---------- */
const frases = [
  "Contigo el tiempo vuela y los segundos se vuelven eternos.",
  "Eres mi lugar favorito en todo el universo.",
  "Amarte es como respirar: natural, necesario y constante.",
  "Tu sonrisa es el atardecer que ilumina mis días.",
  "En cada latido llevo tu nombre grabado.",
  "Eres la calma y el huracán que mi alma necesita.",
  "Mi mapa del tesoro termina siempre en tu corazón.",
  "Contigo hasta las tormentas saben a dulce.",
  "Eres la historia bonita que siempre querré releer.",
  "Tu amor es el único destino al que quiero llegar."
];

/* ---------- CREAR BOTONES INDIVIDUALES ---------- */
const contenedor = document.getElementById('botonesFrases');
frases.forEach((texto, i) => {
  const btn = document.createElement('button');
  btn.className = 'btn-frase';
  btn.textContent = 'Frase ' + (i + 1);
  btn.onclick = () => mostrarFrase(texto);
  contenedor.appendChild(btn);
});

/* ---------- MOSTRAR FRASE CON EFECTO ---------- */
function mostrarFrase(texto) {
  const p = document.getElementById('fraseActiva');
  p.textContent = texto;
  p.classList.remove('mostrar');
  void p.offsetWidth; // fuerza reflujo
  p.classList.add('mostrar');
}

/* ---------- CONTROL PLAY / PAUSA ---------- */
const btnMusica = document.getElementById('btnMusica');
const audio = document.getElementById('musica');
let playing = false;

btnMusica.addEventListener('click', () => {
  if (playing) {
    audio.pause();
    btnMusica.textContent = '▶️ Play / Pausa';
  } else {
    audio.play();
    btnMusica.textContent = '⏸️ Play / Pausa';
  }
  playing = !playing;
});

/* ---------- GENERAR BURBUJAS ---------- */
for (let i = 0; i < 6; i++) {
  const b = document.createElement("span");
  b.className = "burbuja";
  b.style.width = b.style.height = Math.random() * 40 + 20 + "px";
  b.style.left = Math.random() * 100 + "%";
  b.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(b);
}
/* ... (todo el JS anterior sin tocar) ... */

/* ===== GENERAR PETALOS DE ROSA ===== */
function crearPetalo() {
  const p = document.createElement("span");
  p.className = "petalo";
  p.style.left = Math.random() * 100 + "%";
  p.style.animationDuration = (Math.random() * 4 + 8) + "s";
  p.style.animationDelay = Math.random() * 2 + "s";
  document.body.appendChild(p);

  // eliminar después de la animación
  setTimeout(() => p.remove(), 14000);
}

// lanzar un pétalo cada 400 ms
setInterval(crearPetalo, 400);
// Crear estrellas
for (let i = 0; i < 150; i++) {
  const s = document.createElement("span");
  s.className = "estrella";
  s.style.width = s.style.height = Math.random() * 3 + 1 + "px";
  s.style.top = Math.random() * 100 + "%";
  s.style.left = Math.random() * 100 + "%";
  s.style.animationDelay = Math.random() * 3 + "s";
  document.body.appendChild(s);
}

// Crear estrella fugaz cada 4 segundos
setInterval(() => {
  const f = document.createElement("span");
  f.className = "fugaz";
  f.style.top = Math.random() * 50 + "%";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 3000);
}, 4000);