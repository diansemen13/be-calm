// ========== ЖИВОЙ ФОН ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;
let animationId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(123, 158, 135, ${Math.random() * 0.3 + 0.1})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 1500;
            this.x -= Math.cos(angle) * force;
            this.y -= Math.sin(angle) * force;
        }
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animateParticles);
}

function createClouds() {
    const container = document.getElementById('clouds');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        const size = Math.random() * 180 + 80;
        cloud.style.width = size + 'px';
        cloud.style.height = (size * 0.6) + 'px';
        cloud.style.top = Math.random() * 100 + '%';
        cloud.style.left = Math.random() * 100 + '%';
        cloud.style.animationDelay = Math.random() * 10 + 's';
        cloud.style.animationDuration = Math.random() * 20 + 20 + 's';
        container.appendChild(cloud);
    }
}

function createBubbles() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-particle';
        const size = Math.random() * 50 + 15;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.setProperty('--duration', Math.random() * 15 + 10 + 's');
        bubble.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(bubble);
    }
}

function showNotification(message, emoji = '✨') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `${emoji} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 2500);
}

// ========== ИГРА: ЛОВИ СПОКОЙНЫЕ МЫСЛИ ==========
let gameActive = true;
let gameScore = 0;
let gameLives = 3;
let gameInterval = null;
let gameThoughts = [];

const calmThoughts = [
    "✨ Я в безопасности", "🌸 Всё хорошо", "💪 Я справлюсь", 
    "🌊 Это пройдет", "🍃 Дыши спокойно", "🌟 Я сильнее тревоги",
    "💖 Я себя люблю", "🌙 Сейчас здесь и сейчас", "🕊️ Отпускаю страх",
    "🌈 Всё наладится", "🌿 Я спокойна", "⭐ Я достойна счастья"
];

const anxiousThoughts = [
    "😰 Вдруг случится что-то плохое?", "😥 Я не справлюсь", 
    "😨 Всё идет не так", "😞 Я недостаточно хороша", 
    "😖 А если они обо мне плохо подумают?", "😩 Я не вывожу",
    "😭 Всё бессмысленно"
];

function getRandomThought() {
    const isCalm = Math.random() > 0.5;
    const list = isCalm ? calmThoughts : anxiousThoughts;
    const thought = list[Math.floor(Math.random() * list.length)];
    return { text: thought, type: isCalm ? 'calm' : 'anxious' };
}

function createDustExplosion(element, isCalm) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    element.classList.add('dust-effect');
    
    const dustColor = isCalm ? 
        ['#7B9E87', '#A8C3B2', '#8BAB97', '#6B8E77', '#9BC0A8'] : 
        ['#c87a7a', '#e8a0a0', '#b86565', '#d48a8a'];
    
    const particleCount = Math.min(isCalm ? 25 : 20, 30);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 70;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 30;
        
        const size = 3 + Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = `radial-gradient(circle, ${dustColor[Math.floor(Math.random() * dustColor.length)]}, ${dustColor[0]})`;
        particle.style.left = (centerX - size/2) + 'px';
        particle.style.top = (centerY - size/2) + 'px';
        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');
        
        const duration = 0.4 + Math.random() * 0.3;
        particle.style.animation = `dustFly ${duration}s ease-out forwards`;
        particle.style.animationDelay = (Math.random() * 0.1) + 's';
        
        document.body.appendChild(particle);
        setTimeout(() => { if (particle.parentNode) particle.remove(); }, duration * 1000);
    }
}

function createFallingThought() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    
    const thought = getRandomThought();
    const thoughtEl = document.createElement('div');
    thoughtEl.className = 'falling-thought';
    if (thought.type === 'anxious') {
        thoughtEl.classList.add('anxious');
    }
    thoughtEl.textContent = thought.text;
    const maxLeft = Math.max(0, gameArea.clientWidth - 150);
    thoughtEl.style.left = Math.random() * maxLeft + 'px';
    thoughtEl.style.top = '-50px';
    
    thoughtEl.onclick = (e) => {
        e.stopPropagation();
        if (!gameActive) return;
        
        createDustExplosion(thoughtEl, thought.type === 'calm');
        
        if (thought.type === 'calm') {
            gameScore += 10;
            updateGameUI();
            showGameMessage('+10 🌟', '#7B9E87');
        } else {
            gameLives--;
            updateGameUI();
            showGameMessage('❌ -1 жизнь', '#c87a7a');
            if (gameLives <= 0) {
                setTimeout(() => endGame(), 200);
            }
        }
        
        if (thoughtEl.fallInterval) clearInterval(thoughtEl.fallInterval);
        setTimeout(() => {
            if (thoughtEl.parentNode) thoughtEl.remove();
            const index = gameThoughts.indexOf(thoughtEl);
            if (index > -1) gameThoughts.splice(index, 1);
        }, 300);
    };
    
    gameArea.appendChild(thoughtEl);
    gameThoughts.push(thoughtEl);
    
    let posY = -50;
    const speed = 1.2 + Math.random() * 1.2;
    const fallInterval = setInterval(() => {
        if (!thoughtEl.parentNode) {
            clearInterval(fallInterval);
            return;
        }
        posY += speed;
        thoughtEl.style.top = posY + 'px';
        
        if (posY > gameArea.clientHeight - 60) {
            clearInterval(fallInterval);
            if (thoughtEl.parentNode) {
                if (thoughtEl.classList.contains('anxious')) {
                    gameLives--;
                    updateGameUI();
                    showGameMessage('⚠️ Тревожная мысль упала -1 жизнь', '#c87a7a');
                    if (gameLives <= 0) endGame();
                } else {
                    showGameMessage('😔 Ты пропустила поддержку...', '#e8a87c');
                }
                thoughtEl.remove();
                const index = gameThoughts.indexOf(thoughtEl);
                if (index > -1) gameThoughts.splice(index, 1);
            }
        }
    }, 16);
    
    thoughtEl.fallInterval = fallInterval;
}

function updateGameUI() {
    const scoreEl = document.getElementById('gameScore');
    const livesEl = document.getElementById('gameLives');
    if (scoreEl) scoreEl.innerText = gameScore;
    if (livesEl) livesEl.innerText = gameLives;
}

function showGameMessage(text, color = '#7B9E87') {
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    const msg = document.createElement('div');
    msg.className = 'game-message';
    msg.textContent = text;
    msg.style.color = color;
    gameArea.appendChild(msg);
    setTimeout(() => {
        if (msg.parentNode) msg.remove();
    }, 1500);
}

function endGame() {
    gameActive = false;
    if (gameInterval) clearInterval(gameInterval);
    
    gameThoughts.forEach(thought => {
        if (thought.fallInterval) clearInterval(thought.fallInterval);
        if (thought.parentNode) thought.remove();
    });
    gameThoughts = [];
    
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        let message = '';
        let advice = '';
        if (gameScore >= 100) {
            message = '🎉 Отличный результат! 🎉';
            advice = 'Ты хорошо умеешь отличать тревожные мысли от спокойных. Помни, что мысли — это не факты. Продолжай в том же духе! 💪';
        } else if (gameScore >= 50) {
            message = '👍 Хороший результат! 👍';
            advice = 'Ты на правильном пути. Попробуй обращать больше внимания на спокойные, поддерживающие мысли. 🌿';
        } else {
            message = '🌱 Ты справилась! 🌱';
            advice = 'Тревога часто заставляет нас верить негативным мыслям. Тренируйся замечать спокойные мысли — это важный навык. 💚';
        }
        
        const existingPanel = document.querySelector('.game-over-panel');
        if (existingPanel) existingPanel.remove();
        
        const panel = document.createElement('div');
        panel.className = 'game-over-panel';
        panel.innerHTML = `
            <h3>${message}</h3>
            <div class="final-score">Твой счёт: ${gameScore} очков</div>
            <p>💭 ${advice}</p>
            <button class="restart-btn" onclick="restartGame()">🎮 Играть снова</button>
        `;
        gameContainer.appendChild(panel);
    }
}

function restartGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameThoughts.forEach(thought => {
        if (thought.fallInterval) clearInterval(thought.fallInterval);
        if (thought.parentNode) thought.remove();
    });
    gameThoughts = [];
    
    gameActive = true;
    gameScore = 0;
    gameLives = 3;
    updateGameUI();
    
    const panel = document.querySelector('.game-over-panel');
    if (panel) panel.remove();
    
    startGameLoop();
}

function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (gameActive) {
            createFallingThought();
        }
    }, 1800);
}

// ========== ВИДЕО СО ЗВУКАМИ ПРИРОДЫ ==========
const videoUrls = {
    rain: 'https://rutube.ru/play/embed/da2ad72a4458ca5c96c512af707bd0e9',
    forest: 'https://rutube.ru/play/embed/69a8e2aefcce232c75ab9be722f450af',
    ocean: 'https://rutube.ru/play/embed/130c28ad909609c2ae4bb3e319a27542',
    birds: 'https://rutube.ru/play/embed/deff4c5ee576ab9fd08efc08d5e5ea06'
};

const videoTitles = {
    rain: '🌧️ Шум дождя',
    forest: '🌲 Звуки леса',
    ocean: '🌊 Шум океана',
    birds: '🐦 Пение птиц'
};

const videoIframe = document.getElementById('rutubeFrame');

function playVideo(type) {
    const videoUrl = videoUrls[type];
    if (!videoUrl || !videoIframe) return;
    videoIframe.src = videoUrl + '?autoplay=1&loop=1';
    const status = document.getElementById('soundStatus');
    if (status) {
        status.innerHTML = `🎵 Играет: ${videoTitles[type]} 🎵`;
        status.style.color = '#7B9E87';
    }
    showNotification(`Включено: ${videoTitles[type]}`, '🎵');
}

function stopVideo() {
    if (videoIframe) {
        videoIframe.src = 'https://rutube.ru/play/embed/da2ad72a4458ca5c96c512af707bd0e9';
    }
    const status = document.getElementById('soundStatus');
    if (status) {
        status.innerHTML = '🔇 Видео остановлено';
        status.style.color = '';
    }
    showNotification('Видео остановлено', '🔇');
}

// ========== ОСТАЛЬНЫЕ ФУНКЦИИ ==========
let senseItems = [];
let timerInterval = null;
let findCount = 0;

function addSense(item) {
    if(!senseItems.includes(item)) {
        senseItems.push(item);
        const feedback = document.getElementById('senseFeedback');
        if(feedback) {
            feedback.innerHTML = `✓ Найдено: ${senseItems.join(', ')}<br>Отлично! Ты заземляешься.`;
            showNotification(`+ ${item}`, '👁️');
            if(senseItems.length >= 5) {
                feedback.innerHTML += '<br>🎉 Молодец! Тревога снижается!';
                showNotification('Ты справилась! Тревога отступает!', '🎉');
            }
        }
    }
}

function relaxBody(part) {
    const feedback = document.getElementById('relaxFeedback');
    if(feedback) {
        feedback.innerHTML = `✨ Расслабь ${part}... Чувствуешь тепло? ✨`;
        showNotification(`Расслабь ${part}`, '🧘');
        setTimeout(() => { feedback.innerHTML = ''; }, 2000);
    }
}

function showInfo(msg) {
    const display = document.getElementById('infoDisplay');
    if(display) {
        display.innerText = msg;
        showNotification(msg, '💡');
    }
}

function showRandomFact() {
    const facts = [
        'Тревога - это способ организма защитить тебя',
        'Глубокое дыхание активирует парасимпатическую нервную систему',
        'Физическая активность помогает снизить тревогу',
        'Ты не одна, многие люди испытывают тревогу'
    ];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    showInfo(randomFact);
}

function startTimer(seconds) {
    if(timerInterval) clearInterval(timerInterval);
    let remaining = seconds;
    const display = document.getElementById('timerDisplay');
    if(display) {
        display.innerText = `⏱️ ${remaining} сек`;
        showNotification(`Таймер на ${seconds/60} минуту запущен`, '⏱️');
        timerInterval = setInterval(() => {
            remaining--;
            display.innerText = `⏱️ ${remaining} сек`;
            if(remaining <= 0) {
                clearInterval(timerInterval);
                display.innerText = '✅ Время вышло! Ты справилась.';
                showNotification('Время вышло! Ты молодец!', '✅');
            }
        }, 1000);
    }
}

function initFindGame() {
    const items = document.querySelectorAll('.game-item');
    findCount = 0;
    items.forEach(el => {
        el.classList.remove('found');
        el.onclick = () => {
            if(!el.classList.contains('found')) {
                el.classList.add('found');
                findCount++;
                const countSpan = document.getElementById('foundCount');
                if(countSpan) countSpan.innerText = findCount;
                showNotification(`Найден предмет: ${el.getAttribute('data-item')}`, '🔍');
                if(findCount === 5) {
                    showNotification('Поздравляю! Ты отлично справилась!', '🏆');
                }
            }
        };
    });
    const countSpan = document.getElementById('foundCount');
    if(countSpan) countSpan.innerText = '0';
}

function resetFindGame() {
    findCount = 0;
    const countSpan = document.getElementById('foundCount');
    if(countSpan) countSpan.innerText = '0';
    const items = document.querySelectorAll('.game-item');
    items.forEach(el => el.classList.remove('found'));
    showNotification('Игра перезапущена!', '🔄');
}

function initMoodScale() {
    const scale = document.getElementById('moodScale');
    const scaleVal = document.getElementById('scaleValue');
    if(scale && scaleVal) {
        scale.oninput = () => {
            const val = scale.value;
            let emoji;
            if(val < 20) emoji = '😊';
            else if(val < 40) emoji = '🙂';
            else if(val < 60) emoji = '😐';
            else if(val < 80) emoji = '😟';
            else emoji = '😰';
            scaleVal.innerText = `${emoji} ${val}%`;
            localStorage.setItem('lastMood', val);
            if(val < 30) showNotification('Ты можешь справиться, я рядом', '💪');
        };
        const savedMood = localStorage.getItem('lastMood');
        if(savedMood) {
            scale.value = savedMood;
            const val = savedMood;
            let emoji;
            if(val < 20) emoji = '😊';
            else if(val < 40) emoji = '🙂';
            else if(val < 60) emoji = '😐';
            else if(val < 80) emoji = '😟';
            else emoji = '😰';
            scaleVal.innerText = `${emoji} ${val}%`;
        }
    }
}

function initJournal() {
    const notes = document.getElementById('journalNotes');
    if(notes) {
        const savedNotes = localStorage.getItem('journalNotes');
        if(savedNotes) notes.value = savedNotes;
        notes.oninput = () => {
            localStorage.setItem('journalNotes', notes.value);
            showNotification('Мысли сохранены', '📝');
        };
    }
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) element.scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if(navLinks) navLinks.classList.toggle('active');
}

// Дыхательная практика
let breathingActive = false;
let breathIntervalId = null;
let breathPhase = 0;

const breathPatterns = [
    { text: 'Вдох', duration: 4, scale: 1.3 },
    { text: 'Задержка', duration: 4, scale: 1.3 },
    { text: 'Выдох', duration: 6, scale: 1 }
];

function toggleBreathing() {
    if(breathingActive) {
        if(breathIntervalId) clearInterval(breathIntervalId);
        breathingActive = false;
        const breathText = document.getElementById('breathText');
        if(breathText) breathText.innerText = 'Готов';
        showNotification('Дыхание остановлено', '🌬️');
    } else {
        breathingActive = true;
        breathPhase = 0;
        runBreathCycle();
        showNotification('Начинаем дыхательную практику', '🌬️');
    }
}

function runBreathCycle() {
    if(!breathingActive) return;
    const pattern = breathPatterns[breathPhase];
    const circle = document.getElementById('breathCircle');
    const textEl = document.getElementById('breathText');
    const timerEl = document.getElementById('breathTimer');
    
    if(textEl) textEl.innerText = pattern.text;
    if(circle) circle.style.transform = `scale(${pattern.scale})`;
    let timeLeft = pattern.duration;
    if(timerEl) timerEl.innerText = timeLeft;
    
    const interval = setInterval(() => {
        if(!breathingActive) { clearInterval(interval); return; }
        timeLeft--;
        if(timerEl) timerEl.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(interval);
            breathPhase = (breathPhase + 1) % breathPatterns.length;
            runBreathCycle();
        }
    }, 1000);
    breathIntervalId = interval;
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initParticles();
    animateParticles();
    createClouds();
    createBubbles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    initMoodScale();
    initJournal();
    initFindGame();
    
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    startGameLoop();
    
    setTimeout(() => {
        showNotification('Добро пожаловать! Я здесь, чтобы помочь ✨', '🌿');
    }, 1000);
});
