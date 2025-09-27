

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('.photo-container, .photo-caption, .message-container, .signature');
    sections.forEach(section => {
        observer.observe(section);
    });
    const revealBtn = document.getElementById('revealBtn');
    const hiddenMessage = document.getElementById('hiddenMessage');
    
    revealBtn.addEventListener('click', function() {
        hiddenMessage.style.display = 'block';
        hiddenMessage.style.animation = 'fadeIn 1.5s ease-out forwards';
        revealBtn.textContent = 'Gracias por existir';
        createFlowerEffect();
    });
    
    function createFlowerEffect() {
        const flowers = ['🌸', '🌹', '💐', '🌺', '🌷', '🥀', '🌻'];
        const container = document.getElementById('flowersContainer');
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
                flower.style.left = `${Math.random() * 100}vw`;
                flower.style.bottom = '-50px';
                const size = 0.5 + Math.random() * 2;
                flower.style.fontSize = `${size}rem`;
                const duration = 5 + Math.random() * 10;
                flower.style.animationDuration = `${duration}s`;
                flower.style.animationDelay = `${Math.random() * 5}s`;
                
                container.appendChild(flower);
                setTimeout(() => {
                    flower.remove();
                }, duration * 1000);
            }, i * 100);
        }
    }
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.className = 'flower';
            flower.textContent = '🌸';
            flower.style.left = `${Math.random() * 100}vw`;
            flower.style.top = `${Math.random() * 100}vh`;
            const size = 0.5 + Math.random() * 1.5;
            flower.style.fontSize = `${size}rem`;
            const duration = 10 + Math.random() * 20;
            flower.style.animationDuration = `${duration}s`;
            
            document.getElementById('flowersContainer').appendChild(flower);

            setTimeout(() => {
                flower.remove();
            }, duration * 1000);
        }, i * 500);
    }

    revealBtn.addEventListener('click', function() {
        hiddenMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

class IntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observers = [];
    }
    
    observe(element) {
        this.observers.push(element);
        window.addEventListener('scroll', this.check.bind(this));
        this.check();
    }
    
    check() {
        const windowHeight = window.innerHeight;
        const threshold = this.options.threshold || 0;
        
        this.observers.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top <= windowHeight * (1 - threshold) && 
                            rect.bottom >= windowHeight * threshold;
            
            if (isVisible) {
                this.callback([{ isIntersecting: true, target: element }]);
            }
        });
    }
}
