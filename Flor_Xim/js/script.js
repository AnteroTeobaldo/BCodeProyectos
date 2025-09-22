
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = new Audio();
    audioPlayer.src = 'https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/Flores%20amarillas.mp3';
    audioPlayer.loop = true;
    audioPlayer.volume = 0.4;
    let musicStarted = false;
    let isPlaying = false;

    const controlMusic = document.querySelector('.control-musica');
    const musicIcon = controlMusic.querySelector('i');
    const florInteractiva = document.querySelector('.flor-interactiva');
    const florMensaje = document.querySelector('.flor-mensaje');
    const modal = document.getElementById('modal-regalo');
    const modalCerrar = document.querySelector('.modal-cerrar');

    const startMusic = () => {
        if (!musicStarted) {
            audioPlayer.play().then(() => {
                musicStarted = true;
                isPlaying = true;
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-pause');
            }).catch(e => console.log(e));
        }
    };

    controlMusic.addEventListener('click', () => {
        if (!musicStarted) {
            startMusic();
        } else if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        } else {
            audioPlayer.play();
            isPlaying = true;
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }
    });
    florInteractiva.addEventListener('click', () => {
        modal.classList.add('mostrar');
        crearLluviaPintura();
        florMensaje.classList.add('mostrar');
        setTimeout(() => {
            florMensaje.classList.remove('mostrar');
        }, 3000);
    });
    modalCerrar.addEventListener('click', () => {
        modal.classList.remove('mostrar');
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('mostrar');
        }
    });

    window.addEventListener('scroll', () => {
        if (!musicStarted) {
            startMusic();
        }
    });
    const crearLluviaPintura = () => {
        const colores = ['#D4AF37', '#F9E076', '#B8860B', '#FFD700', '#FFDF00'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.classList.add('paint-drop');
                const left = Math.random() * 100;
                drop.style.left = `${left}%`;
                const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
                drop.style.background = colorAleatorio;
                const size = Math.random() * 15 + 8;
                drop.style.width = `${size}px`;
                drop.style.height = `${size * 1.5}px`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                
                document.body.appendChild(drop);
                setTimeout(() => {
                    drop.remove();
                }, 8000);
            }, i * 200);
        }
    };

    const secciones = document.querySelectorAll('.seccion');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    secciones.forEach(seccion => observer.observe(seccion));

    function crearPetalos() {
        const contenedor = document.querySelector('.flotantes');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const petalo = document.createElement('div');
                petalo.classList.add('petalo');
                petalo.innerHTML = '❀';
                petalo.style.left = `${Math.random() * 100}vw`;
                petalo.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
                petalo.style.animationDuration = `${Math.random() * 4 + 6}s`;
                contenedor.appendChild(petalo);
                setTimeout(() => petalo.remove(), 10000);
            }, i * 400);
        }
    }

    crearPetalos();
    setInterval(crearPetalos, 7000);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                isPlaying = false;
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            }
        }
    });
    setTimeout(() => {
        crearLluviaPintura();
    }, 1000);
    
    setInterval(crearLluviaPintura, 10000);
});
