// script.js

// Configuración Matrix
const LINE_COUNT = 30;
const MATRIX_TEXT = "TE AMO ";
const LOVE_CHARS = ["❤", "💖", "💕", "💞", "💝"];

// Elementos interactivos
const centro = document.querySelector('.centro');
const hiddenImage = document.querySelector('.hidden-image');
const audioElement = document.getElementById('backgroundAudio');

// Controlador de clic para el centro
centro.addEventListener('click', () => {
    hiddenImage.classList.toggle('active');
});

// Inicializar Matrix
function initMatrix() {
    const container = document.getElementById('terminal');
    for (let i = 0; i < LINE_COUNT; i++) {
        const line = document.createElement('div');
        line.className = 'text-container';
        line.style.animation = `scroll ${5 + i / 2}s linear infinite`;
        line.style.animationDelay = `${i * 0.3}s`;
        line.textContent = MATRIX_TEXT.repeat(window.innerWidth / 50);
        container.appendChild(line);
    }
}

// Inicializar Love Effect
function initLoveEffect() {
    const container = document.getElementById('loveContainer');
    setInterval(() => {
        const love = document.createElement('div');
        love.className = 'love-text';
        love.style.left = `${Math.random() * 95}vw`;
        love.style.animationDuration = `${Math.random() * 4 + 6}s`;
        love.textContent = LOVE_CHARS[Math.floor(Math.random() * LOVE_CHARS.length)];
        container.appendChild(love);
        setTimeout(() => love.remove(), 10000);
    }, 100);
}

function handleResize() {
    document.querySelectorAll('.text-container').forEach(line => {
        line.textContent = MATRIX_TEXT.repeat(window.innerWidth / 50);
    });
    const centro = document.querySelector('.centro');
    centro.style.fontSize = `${Math.min(window.innerWidth, window.innerHeight) * 0.1}px`;
}

// Inicialización
window.addEventListener('load', () => {
    initMatrix();
    initLoveEffect();
    handleResize();
    // Intentar iniciar audio después de la interacción del usuario
    document.body.addEventListener('click', () => {
        audioElement.play().catch(() => { });
    }, { once: true });
});

window.addEventListener('resize', handleResize);
