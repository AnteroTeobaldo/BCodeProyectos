
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
    const imagenHero = document.querySelector('.imagen-hero');
    const imagenHeroImg = document.querySelector('.imagen-hero img');
    const ajustarImagenAlScroll = () => {
        const scrollY = window.scrollY;
        const alturaVentana = window.innerHeight;
        const proporcion = 1 + (scrollY / (alturaVentana * 2)); 
        const escala = Math.min(proporcion, 1.5);
        
        imagenHero.style.transform = `scale(${escala})`;
        imagenHeroImg.style.transform = `scale(${1 + (escala - 1) * 0.5})`; 
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
        crearParticulasDoradas();
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
    const crearParticulasDoradas = () => {
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

    function crearPetalos() {
        const contenedor = document.querySelector('.flotantes');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const petalo = document.createElement('div');
                petalo.classList.add('petalo');
                petalo.innerHTML = '❀';
                petalo.style.left = `${Math.random() * 100}vw`;
                petalo.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
                petalo.style.animationDuration = `${Math.random() * 4 + 8}s`;
                contenedor.appendChild(petalo);
                setTimeout(() => petalo.remove(), 12000);
            }, i * 400);
        }
    }

    crearPetalos();
    setInterval(crearPetalos, 8000);

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
        crearParticulasDoradas();
    }, 1000);
    setInterval(crearParticulasDoradas, 12000);
});
