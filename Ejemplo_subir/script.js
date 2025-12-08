
document.addEventListener('DOMContentLoaded', function () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('es-ES', options);
    const audioControl = document.getElementById('audioControl');
    const audioPlayer = new Audio('https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/Buenos%20dias.mp3');
    audioPlayer.loop = true;
    audioPlayer.volume = 0.4;

    let isPlaying = false;

    audioControl.addEventListener('click', function () {
        if (isPlaying) {
            audioPlayer.pause();
            audioControl.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audioPlayer.play();
            audioControl.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.message-container, .quote, .image-container');
    animatedElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});
    