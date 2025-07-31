// script.js
const card = document.querySelector('.card-inner');
        const openBtn = document.querySelector('.open-btn');
        const closeBtn = document.querySelector('.close-btn');
        const body = document.body;
        
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('is-flipped');
            createHearts(20);
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.remove('is-flipped');
        });
        
        document.addEventListener('click', (e) => {
            if (!card.contains(e.target)) {
                card.classList.remove('is-flipped');
            }
        });
        
        function createHearts(count) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.classList.add('heart');
                    heart.innerHTML = '❤️';
                    heart.style.left = Math.random() * 100 + 'vw';
                    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
                    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
                    heart.style.animationDelay = Math.random() * 2 + 's';
                    body.appendChild(heart);
                    
                    setTimeout(() => {
                        heart.remove();
                    }, 6000);
                }, i * 200);
            }
        }
        
        // Corazones inicial iniciales
        createHearts(8);
