const giftContainer = document.getElementById('gift-container');
const content = document.getElementById('content');
const finalMessage = document.getElementById('final-message');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// 1. Abrir el regalo
function openGift() {
    giftContainer.classList.add('hidden');
    content.classList.remove('hidden');
}

// 2. Hacer que el botón "No" escape (Interactivo)
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
});

// 3. Acción al decir que SÍ
yesBtn.addEventListener('click', () => {
    content.classList.add('hidden');
    finalMessage.classList.remove('hidden');
    
    // Lanzar corazones continuamente
    setInterval(createHeart, 150);
});

// 4. Generador de corazones y detalles
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-drop');
    
    const icons = ['❤️', '💖', '🌸', '✨', '💕'];
    heart.innerText = icons[Math.floor(Math.random() * icons.length)];
    
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 20 + "px";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    heart.style.opacity = Math.random();
    
    document.body.appendChild(heart);
    
    // Limpiar el DOM eliminando corazones viejos
    setTimeout(() => {
        heart.remove();
    }, 4000);
}