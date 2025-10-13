
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = new Audio();
    audioPlayer.src = 'https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/those%20eyes%20.mp3';
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
    const imagenFondo = document.getElementById('imagen-fondo');
    const ajustarImagenAlScroll = () => {
        const scrollY = window.scrollY;
        const alturaVentana = window.innerHeight;
        const proporcion = 1 + (scrollY / (alturaVentana * 3));
        const escala = Math.min(proporcion, 1.3);

        imagenFondo.style.transform = `scale(${escala})`;
    };

    window.addEventListener('scroll', ajustarImagenAlScroll);
    ajustarImagenAlScroll();

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
        crearParticulasRosas();
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

    const crearParticulasRosas = () => {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particula = document.createElement('div');
                particula.classList.add('particula');
                const size = Math.random() * 8 + 2;
                particula.style.width = `${size}px`;
                particula.style.height = `${size}px`;
                const left = Math.random() * 100;
                particula.style.left = `${left}%`;
                particula.style.animationDuration = `${Math.random() * 3 + 5}s`;
                document.body.appendChild(particula);
                setTimeout(() => {
                    particula.remove();
                }, 8000);
            }, i * 100);
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

    function crearElementosNocturnos() {
        const contenedor = document.querySelector('.flotantes');

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const elemento = document.createElement('div');
                elemento.classList.add(Math.random() > 0.5 ? 'estrella' : 'petalo');
                elemento.innerHTML = Math.random() > 0.5 ? '✨' : '🌸';
                elemento.style.left = `${Math.random() * 100}vw`;
                elemento.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
                elemento.style.animationDuration = `${Math.random() * 4 + 8}s`;
                contenedor.appendChild(elemento);
                setTimeout(() => elemento.remove(), 12000);
            }, i * 400);
        }
    }

    crearElementosNocturnos();
    setInterval(crearElementosNocturnos, 8000);

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
        crearParticulasRosas();
    }, 1000);

    setInterval(crearParticulasRosas, 12000);
});
