// script.js
const cardValues = ['🍎', '🍌', '🍇', '🍉', '🍋', '🍓', '🍒', '🍍'];
let cards = [...cardValues, ...cardValues]; // Duas cópias de cada carta
let flippedCards = [];
let matchedCards = [];
let gameStarted = false;
let startTime, timerInterval;
let bestTime = localStorage.getItem('bestTime') || null; // Recupera o recorde salvo

const startButton = document.getElementById('start-button');
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('best-time');

// Função para embaralhar as cartas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para criar o tabuleiro
function createBoard() {
    gameBoard.innerHTML = ''; // Limpa o tabuleiro
    shuffle(cards);
    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Função para formatar o tempo no formato mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função para atualizar o cronômetro
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
}

// Função para parar o cronômetro
function stopTimer() {
    clearInterval(timerInterval);
}

// Função para virar uma carta
function flipCard() {
    if (!gameStarted || flippedCards.length === 2) return; // Impede ações antes do início ou de virar mais de 2 cartas

    const card = this;
    if (card.classList.contains('flipped') || matchedCards.includes(card)) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.value;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Função para verificar se há uma correspondência
function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            stopTimer();
            setTimeout(() => {
                alert('Você ganhou!');
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                checkBestTime(elapsedTime);
                startButton.style.display = 'block'; // O botão reaparece
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

// Função para verificar e atualizar o melhor tempo
function checkBestTime(elapsedTime) {
    if (!bestTime || elapsedTime < bestTime) {
        bestTime = elapsedTime;
        localStorage.setItem('bestTime', bestTime);
        alert(`Novo recorde: ${formatTime(bestTime)}!`);
    }
    updateBestTimeDisplay();
}

// Função para revelar todas as cartas e depois escondê-las
function revealCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
        card.textContent = card.dataset.value;
    });

    setTimeout(() => {
        allCards.forEach(card => {
            card.classList.remove('flipped');
            card.textContent = '';
        });
        gameStarted = true;
        startTimer(); // Inicia o cronômetro
    }, 3000); // As cartas são mostradas por 3 segundos antes de voltarem para o estado inicial
}

// Função para iniciar o jogo
function startGame() {
    gameStarted = false;
    matchedCards = [];
    flippedCards = [];
    createBoard();
    gameBoard.style.visibility = 'visible'; // Mostra o tabuleiro
    revealCards();
    updateBestTimeDisplay();
}

// Atualiza a exibição do melhor tempo
function updateBestTimeDisplay() {
    if (bestTime) {
        bestTimeDisplay.textContent = formatTime(bestTime);
    } else {
        bestTimeDisplay.textContent = '--:--';
    }
}

// Adiciona evento ao botão de iniciar
startButton.addEventListener('click', startGame);

// Carrega o melhor tempo quando a página carrega
updateBestTimeDisplay();
