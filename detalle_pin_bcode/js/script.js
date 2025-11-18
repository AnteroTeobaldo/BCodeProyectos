
const correctPIN = "2022";
let enteredPIN = "";
const pinDisplay = document.getElementById("pinDisplay");
const keypad = document.getElementById("keypad");
const loginPanel = document.getElementById("loginPanel");
const modal = document.getElementById("romanticModal");
const audio = document.getElementById("romanticAudio");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastEmoji = document.getElementById("toastEmoji");

const errorEmojis = ["🥹", "😢", "😔", "😞", "😓", "😭", "💔"];
const heartEmojis = ["💖", "💗", "💓", "💘", "💕", "💞"];

function createHearts() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
  heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 15000);
}

for (let i = 0; i < 15; i++) {
  setTimeout(createHearts, i * 500);
}

setInterval(createHearts, 1500);

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""];
digits.forEach(d => {
  const btn = document.createElement("button");
  if (d !== "") {
    btn.textContent = d;
    btn.addEventListener("click", () => handleDigit(d));
  } else {
    btn.style.visibility = "hidden";
  }
  keypad.appendChild(btn);
});

function handleDigit(digit) {
  if (enteredPIN.length < 4) {
    enteredPIN += digit;
    pinDisplay.textContent = enteredPIN.padEnd(4, "_");
    if (enteredPIN.length === 4) {
      setTimeout(validatePIN, 300);
    }
  }
}

function validatePIN() {
  if (enteredPIN === correctPIN) {
    createConfetti();
    createHeartBursts();
    
    setTimeout(() => {
      loginPanel.style.opacity = "0";
      loginPanel.style.transform = "scale(0.9)";
      
      setTimeout(() => {
        loginPanel.style.display = "none";
        modal.classList.add("show");
        audio.play().catch(e => console.log("Audio error:", e));
      }, 500);
    }, 800);
  } else {
    const randomEmoji = errorEmojis[Math.floor(Math.random() * errorEmojis.length)];
    toastEmoji.textContent = randomEmoji;
    loginPanel.style.animation = "shake 0.5s";
    toast.classList.add("show");
    
    setTimeout(() => {
      loginPanel.style.animation = "";
      enteredPIN = "";
      pinDisplay.textContent = "____";
      
      setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    }, 500);
  }
}

function createConfetti() {
  const colors = ['#ff4e8b', '#ff85a2', '#ffc1d9', '#ffffff', '#d6005a'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = (Math.random() * 10 + 5) + 'px';
    confetti.style.height = (Math.random() * 10 + 5) + 'px';
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
      { 
        transform: `translateY(-20vh) rotate(0deg)`,
        opacity: 1
      },
      { 
        transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
    });
    
    animation.onfinish = () => confetti.remove();
  }
}

function createHeartBursts() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'heart-burst';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = Math.random() * 80 + 10 + 'vw';
      heart.style.top = Math.random() * 80 + 10 + 'vh';
      document.body.appendChild(heart);
      
      const burstAnimation = heart.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(2.5)', opacity: 0 }
      ], {
        duration: 1500,
        easing: 'ease-out'
      });
      
      burstAnimation.onfinish = () => heart.remove();
    }, i * 100);
  }
}

document.head.innerHTML += `
  <style>
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
      20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
  </style>
`;
