
        document.addEventListener('DOMContentLoaded', function() {
            const loginScreen = document.querySelector('.login-screen');
            const mainContent = document.querySelector('.main-content');
            const cube = document.querySelector('.cube');
            const scareImages = document.querySelectorAll('.scare-image');
            const loveMessage = document.querySelector('.love-message');
            const scareOverlay = document.querySelector('.scare-overlay');
            const body = document.body;
            const audioControl = document.querySelector('.audio-control');
            const audio = document.getElementById('halloweenAudio');
            
            let isMouseDown = false;
            let startX, startY;
            let rotateX = -15, rotateY = 15;
            let animationId = null;
            let scareTriggered = false;
            let audioStarted = false;
            let isAudioPlaying = false;
            
            const phrases = [
                "TE AMO MÁS QUE TODO",
                "ERES MI LUZ",
                "MI CORAZÓN ES TUYO",
                "ESTAR CONTIGO ES UN REGALO",
                "TU SONRISA ME MUEVE",
                "ERES MI SUEÑO",
                "SOMOS ALMAS GEMELAS",
                "CONTIGO SIEMPRE",
                "TU AMOR ME INSPIRA",
                "JUNTOS POR SIEMPRE"
            ];

            
            let nextScareTime = getRandomTime(8000, 15000);
            let scareTimer;

            function getRandomTime(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function getRandomPhrase() {
                return phrases[Math.floor(Math.random() * phrases.length)];
            }

            function startAudio() {
                if (!audioStarted) {
                    audio.play().then(() => {
                        audioStarted = true;
                        isAudioPlaying = true;
                        audioControl.style.display = 'flex';
                        audioControl.textContent = '🎃';
                    }).catch(e => console.log('Audio necesita interacción del usuario'));
                }
            }

            function toggleAudio() {
                if (isAudioPlaying) {
                    audio.pause();
                    isAudioPlaying = false;
                    audioControl.textContent = '🔇';
                } else {
                    audio.play();
                    isAudioPlaying = true;
                    audioControl.textContent = '🎃';
                }
            }

            function pauseAudio() {
                if (isAudioPlaying) {
                    audio.pause();
                    isAudioPlaying = false;
                    audioControl.textContent = '🔇';
                }
            }

            function resumeAudio() {
                if (audioStarted && !isAudioPlaying) {
                    audio.play();
                    isAudioPlaying = true;
                    audioControl.textContent = '🎃';
                }
            }

            function updateRotation() {
                cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                animationId = null;
            }

            function startScareTimer() {
                scareTimer = setTimeout(() => {
                    triggerScare();
                }, nextScareTime);
            }

            function triggerScare() {
                if (scareTriggered) return;
                
                scareTriggered = true;
                
                pauseAudio();
                
                const randomImage = scareImages[Math.floor(Math.random() * scareImages.length)];
                const randomPhrase = getRandomPhrase();
                
                body.classList.add('scare-mode', 'screen-shake');
                scareOverlay.classList.add('active');
                
                randomImage.classList.add('pop-out');
                loveMessage.textContent = randomPhrase;
                loveMessage.classList.add('show');

                playTerrorSound();

                setTimeout(() => {
                    scareOverlay.classList.remove('active');
                    body.classList.remove('screen-shake');
                }, 2000);
                
                setTimeout(() => {
                    randomImage.classList.remove('pop-out');
                    loveMessage.classList.remove('show');
                    body.classList.remove('scare-mode');
                    
                    setTimeout(() => {
                        resumeAudio();
                        scareTriggered = false;
                        nextScareTime = getRandomTime(10000, 20000);
                        startScareTimer();
                    }, 2000);
                }, 4000);
            }

            function playTerrorSound() {
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator1 = audioContext.createOscillator();
                    const oscillator2 = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    const filter = audioContext.createBiquadFilter();

                    oscillator1.type = 'sawtooth';
                    oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);
                    oscillator1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.8);

                    oscillator2.type = 'triangle';
                    oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);
                    oscillator2.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.6);

                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(800, audioContext.currentTime);
                    filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1);

                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);

                    oscillator1.connect(filter);
                    oscillator2.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator1.start();
                    oscillator2.start();

                    setTimeout(() => {
                        oscillator1.stop();
                        oscillator2.stop();
                    }, 1500);

                } catch (error) {
                    console.log('Error creando sonido:', error);
                }
            }

            loginScreen.addEventListener('click', function() {
                loginScreen.style.display = 'none';
                mainContent.style.display = 'block';
                startAudio();
                startScareTimer();
            });

            audioControl.addEventListener('click', toggleAudio);

            cube.addEventListener('mousedown', function(e) {
                isMouseDown = true;
                startX = e.clientX;
                startY = e.clientY;
                cube.style.transition = 'none';
            });

            document.addEventListener('mousemove', function(e) {
                if (!isMouseDown) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                rotateY += deltaX * 0.5;
                rotateX -= deltaY * 0.5;
                
                if (!animationId) {
                    animationId = requestAnimationFrame(updateRotation);
                }
                
                startX = e.clientX;
                startY = e.clientY;
            });

            document.addEventListener('mouseup', function() {
                isMouseDown = false;
                cube.style.transition = 'transform 0.1s';
            });

            cube.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                cube.style.transition = 'none';
            });

            cube.addEventListener('touchmove', function(e) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                rotateY += deltaX * 0.5;
                rotateX -= deltaY * 0.5;
                
                if (!animationId) {
                    animationId = requestAnimationFrame(updateRotation);
                }
                
                startX = touch.clientX;
                startY = touch.clientY;
            });

            cube.addEventListener('touchend', function() {
                cube.style.transition = 'transform 0.1s';
            });

            document.body.addEventListener('touchmove', function(e) {
                if (e.target === cube || cube.contains(e.target)) {
                    e.preventDefault();
                }
            }, { passive: false });

            window.addEventListener('beforeunload', function() {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                if (scareTimer) {
                    clearTimeout(scareTimer);
                }
            });
        });
 