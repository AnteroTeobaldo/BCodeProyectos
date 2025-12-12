function createDecorations() {
    const container = document.getElementById('decoration-container');
    const heartCount = 30;
    const cakeCount = 20;
    const balloonCount = 15;
    const flakeCount = 60;
    const confettiCount = 80;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 2 + 2.5}rem`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.animationDuration = `${10 + Math.random() * 15}s`;
        container.appendChild(heart);
    }

    for (let i = 0; i < cakeCount; i++) {
        const cake = document.createElement('div');
        cake.classList.add('cake');
        cake.innerHTML = '🎂';
        cake.style.left = `${Math.random() * 100}%`;
        cake.style.fontSize = `${Math.random() * 2 + 2}rem`;
        cake.style.animationDelay = `${Math.random() * 10}s`;
        cake.style.animationDuration = `${15 + Math.random() * 25}s`;
        container.appendChild(cake);
    }

    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.innerHTML = '🎈';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.fontSize = `${Math.random() * 2 + 2}rem`;
        balloon.style.animationDelay = `${Math.random() * 12}s`;
        balloon.style.animationDuration = `${18 + Math.random() * 20}s`;
        container.appendChild(balloon);
    }

    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('gold-flake');
        flake.style.left = `${Math.random() * 100}%`;
        const size = 10 + Math.random() * 25;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        if (Math.random() > 0.5) {
            flake.style.borderRadius = '3px';
            flake.style.transform = 'rotate(45deg)';
        }
        flake.style.animationDelay = `${Math.random() * 10}s`;
        flake.style.animationDuration = `${15 + Math.random() * 25}s`;
        container.appendChild(flake);
    }

    const confettiColors = ['#ff85a2', '#f8c291', '#9c88ff', '#ff6b6b', '#4cd137'];
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        const size = 8 + Math.random() * 15;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDelay = `${Math.random() * 15}s`;
        confetti.style.animationDuration = `${10 + Math.random() * 20}s`;
        container.appendChild(confetti);
    }
}

function createModalHearts() {
    const container = document.getElementById('modalHearts');
    const heartCount = 50;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 3 + 2}rem`;
        const colors = ['#ff85a2', '#f8c291', '#ffffff', '#e55c7b'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.animationDelay = `${Math.random() * 10}s`;
        heart.style.animationDuration = `${8 + Math.random() * 12}s`;
        container.appendChild(heart);
    }
}

function updateDateTime() {
    const birthDate = new Date(2006, 11, 11);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');

    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

let audioStarted = false;
let audio = new Audio("https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/ov7.mp3");

function enableAutoPlay() {
    if (audioStarted) return;
    audioStarted = true;
    audio.load();
    audio.play();
}

document.addEventListener('DOMContentLoaded', function () {
    createDecorations();
    createModalHearts();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    document.addEventListener('click', enableAutoPlay, { once: true });
    document.addEventListener('scroll', enableAutoPlay, { once: true });

    document.getElementById('scrollDown').addEventListener('click', function () {
        window.scrollTo({
            top: document.querySelector('.counter-section').offsetTop,
            behavior: 'smooth'
        });
    });

    const modal = document.getElementById('surpriseModal');
    const btn = document.getElementById('btnSurprise');
    const closeBtn = document.getElementById('closeModal');

    btn.addEventListener('click', function () {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    modal.addEventListener('wheel', function (e) {
        const content = this.querySelector('.modal-content');
        const isAtTop = content.scrollTop === 0;
        const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
        }
    });
});