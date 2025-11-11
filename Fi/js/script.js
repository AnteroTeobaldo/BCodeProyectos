// script.js
document.addEventListener('DOMContentLoaded', function() {
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const noMessage = document.getElementById('noMessage');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalBtn = document.getElementById('modalBtn');
const heartsContainer = document.getElementById('hearts');

btnNo.addEventListener('mouseover', function () {
    const randomX = Math.random() * 100 - 50;
    const randomY = Math.random() * 100 - 50;
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    noMessage.style.display = 'block';
});

btnNo.addEventListener('click', function () {
    noMessage.style.display = 'block';
    noMessage.style.animation = 'shake 0.5s';

    setTimeout(() => {
        noMessage.style.animation = 'none';
        void noMessage.offsetWidth; 
        noMessage.style.animation = 'shake 0.5s';
    }, 10);
});

btnYes.addEventListener('click', function () {
    modal.style.display = 'flex';
    createHearts();
});

closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});

modalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    createHearts();
});

function createHearts() {
    heartsContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';

        heartsContainer.appendChild(heart);
    }
}

createHearts();
});