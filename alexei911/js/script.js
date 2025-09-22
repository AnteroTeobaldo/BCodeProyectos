let audio = null;
let estaReproduciendo = false;
let controlPausa = null;

function inicializarMusica() {
  audio = new Audio('https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/Flores%20amarillas.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  function iniciarReproduccion() {
    if (!estaReproduciendo) {
      audio.play();
      estaReproduciendo = true;
      crearControlPausa();
      document.removeEventListener('click', iniciarReproduccion);
      document.removeEventListener('scroll', iniciarReproduccion);
    }
  }

  document.addEventListener('click', iniciarReproduccion);
  document.addEventListener('scroll', iniciarReproduccion);
}
function crearControlPausa() {
  controlPausa = document.createElement('div');
  controlPausa.innerHTML = '🌻';
  controlPausa.style.cssText = `
        position: fixed; top: 20px; left: 20px; width: 50px; height: 50px;
        background: transparent !important; border: 3px solid #FFD700; border-radius: 50%;
        display: flex; justify-content: center; align-items: center; font-size: 24px;
        cursor: pointer; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
  controlPausa.addEventListener('click', toggleReproduccion);
  document.body.appendChild(controlPausa);
}
function toggleReproduccion() {
  if (estaReproduciendo) {
    audio.pause();
    controlPausa.innerHTML = '🌻';
  } else {
    audio.play();
    controlPausa.innerHTML = '🌻';
  }
  estaReproduciendo = !estaReproduciendo;
}
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = Math.random() * 2 + 'px';
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 5 + 's';
      starsContainer.appendChild(star);
    }


    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.opacity = Math.random() * 0.5;
      particlesContainer.appendChild(particle);
    }

    function createShootingStar() {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.top = Math.random() * 60 + '%';
      star.style.animationDelay = '0s';
      star.style.animationDuration = (Math.random() * 1.5 + 2) + 's';

      document.querySelector('.shooting-stars').appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 4000);
    }

    setInterval(() => {
      if (Math.random() > 0.3) {
        createShootingStar();
      }
    }, Math.random() * 5000 + 3000);
    clearTimeout(c);
  }, 1000);
};


document.addEventListener('DOMContentLoaded', function() {
    inicializarMusica();
});
