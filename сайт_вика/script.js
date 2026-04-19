// Создание пузырьков
function createBubbles() {
    const container = document.getElementById('bubbles');
    if(!container) return;
    for(let i = 0; i < 40; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        const size = Math.random() * 40 + 10;
        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.animationDuration = Math.random() * 15 + 8 + 's';
        b.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(b);
    }
}

// Дыхание
let breathingActive = false;
let breathIntervalId = null;
let breathPhase = 0;
const breathPatterns = [
    { text: 'Вдох', duration: 4000, scale: 1.3 },
    { text: 'Задержка', duration: 4000, scale: 1.3 },
    { text: 'Выдох', duration: 6000, scale: 1 }
];

function toggleBreathing() {
    if(breathingActive) {
        if(breathIntervalId) clearInterval(breathIntervalId);
        breathingActive = false;
        const breathText = document.getElementById('breathText');
        if(breathText) breathText.innerText = 'Готов';
    } else {
        breathingActive = true;
        breathPhase = 0;
        runBreathCycle();
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
    let timeLeft = pattern.duration / 1000;
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

// Метод 5-4-3-2-1
let senseItems = [];
function addSense(item) {
    if(!senseItems.includes(item)) {
        senseItems.push(item);
        const feedback = document.getElementById('senseFeedback');
        if(feedback) {
            feedback.innerHTML = `✓ Найдено: ${senseItems.join(', ')}<br>Отлично! Ты заземляешься.`;
            if(senseItems.length >= 5) {
                feedback.innerHTML += '<br>🎉 Молодец! Тревога снижается!';
            }
        }
    }
}

// Расслабление
function relaxBody(part) {
    const feedback = document.getElementById('relaxFeedback');
    if(feedback) {
        feedback.innerHTML = `✨ Расслабь ${part}... Чувствуешь тепло? ✨`;
        setTimeout(() => { feedback.innerHTML = ''; }, 2000);
    }
}

// Таймер
let timerInterval = null;
function startTimer(seconds) {
    if(timerInterval) clearInterval(timerInterval);
    let remaining = seconds;
    const display = document.getElementById('timerDisplay');
    if(display) {
        display.innerText = `⏱️ ${remaining} сек`;
        timerInterval = setInterval(() => {
            remaining--;
            display.innerText = `⏱️ ${remaining} сек`;
            if(remaining <= 0) {
                clearInterval(timerInterval);
                display.innerText = '✅ Время вышло! Ты справился.';
            }
        }, 1000);
    }
}

// Слова поддержки
const moreSupport = [
    { emoji: '🌈', text: 'Ты сильнее, чем думаешь' },
    { emoji: '🌅', text: 'Каждая буря заканчивается' },
    { emoji: '💪', text: 'У тебя уже есть всё, чтобы справиться' },
    { emoji: '🌸', text: 'Позволь себе чувствовать - это нормально' }
];

// Шкала настроения
function initMoodScale() {
    const scale = document.getElementById('moodScale');
    const scaleVal = document.getElementById('scaleValue');
    if(scale && scaleVal) {
        scale.oninput = () => {
            const val = scale.value;
            const emoji = val < 20 ? '😊' : val < 40 ? '🙂' : val < 60 ? '😐' : val < 80 ? '😟' : '😰';
            scaleVal.innerText = `${emoji} ${val}%`;
            localStorage.setItem('lastMood', val);
        };
        if(localStorage.getItem('lastMood')) scale.value = localStorage.getItem('lastMood');
    }
}

// Заметки
function initJournal() {
    const notes = document.getElementById('journalNotes');
    if(notes) {
        if(localStorage.getItem('journalNotes')) notes.value = localStorage.getItem('journalNotes');
        notes.oninput = () => localStorage.setItem('journalNotes', notes.value);
    }
}

// Инфо о тревоге
function showInfo(msg) {
    const display = document.getElementById('infoDisplay');
    if(display) display.innerText = msg;
}

// Игра
let found = 0;
function initGame() {
    const items = document.querySelectorAll('.game-item');
    items.forEach(el => {
        el.classList.remove('found');
        el.onclick = () => {
            if(!el.classList.contains('found')) {
                el.classList.add('found');
                found++;
                const countSpan = document.getElementById('foundCount');
                if(countSpan) countSpan.innerText = found;
                if(found === 5) alert('🎉 Отлично! Ты отвлекся и справился!');
            }
        };
    });
}

function resetGame() {
    found = 0;
    const countSpan = document.getElementById('foundCount');
    if(countSpan) countSpan.innerText = '0';
    const items = document.querySelectorAll('.game-item');
    items.forEach(el => el.classList.remove('found'));
}

// Звуки (имитация)
let currentAudio = null;
function playSound(type) {
    if(currentAudio) currentAudio.pause();
    const sounds = { rain: '🌧️ Шум дождя...', forest: '🌲 Пение птиц...', ocean: '🌊 Шум прибоя...' };
    const status = document.getElementById('soundStatus');
    if(status) {
        status.innerHTML = `🎵 Играет: ${sounds[type]} (представь этот звук)`;
        setTimeout(() => {
            if(status.innerHTML.includes('Играет')) status.innerHTML = '';
        }, 3000);
    }
}

function stopSound() { 
    if(currentAudio) currentAudio.pause();
    const status = document.getElementById('soundStatus');
    if(status) status.innerHTML = '🔇 Звук выключен'; 
}

// Навигация
function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) element.scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if(navLinks) navLinks.classList.toggle('active');
}

// Инициализация дополнительных кнопок
function initSupportButton() {
    const btn = document.getElementById('moreSupportBtn');
    const extraDiv = document.getElementById('extraSupport');
    if(btn && extraDiv) {
        btn.onclick = () => {
            if(extraDiv.style.display === 'none') {
                extraDiv.innerHTML = '<div class="support-grid">' + moreSupport.map(s => `<div class="support-card"><div class="support-emoji">${s.emoji}</div><h3>${s.text}</h3></div>`).join('') + '</div>';
                extraDiv.style.display = 'block';
                btn.innerText = 'Скрыть';
            } else {
                extraDiv.style.display = 'none';
                btn.innerText = 'Показать еще слова поддержки';
            }
        };
    }
}

// Запуск всех инициализаций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    initMoodScale();
    initJournal();
    initGame();
    initSupportButton();
});