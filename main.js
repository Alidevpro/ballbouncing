 // Game variables
 const gameVars = {
    ballSpeed: 5,
    ballSpeedIncrement: 1.5,
    ballX: 100,
    ballY: 100,
    ballDirX: 1,
    ballDirY: 1,
    paddleX: 0,
    paddleSpeed: 50,
    score: 0,
    gameTime: 0,
    timerInterval: null,
    isGameOver: false,
    touchStartX: null,
    isTouching: false
};

// DOM elements
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverPopup = document.querySelector('.game-over');
const gameContainer = document.getElementById('game-container');

// Initialize game
function initGame() {
    // Adjust initial positions based on container size
    gameVars.ballX = gameContainer.clientWidth / 4;
    gameVars.ballY = gameContainer.clientHeight / 4;
    gameVars.paddleX = (gameContainer.clientWidth - paddle.clientWidth) / 2;
    paddle.style.bottom = '0px';
    updatePaddlePosition();
    
    // Start timer
    startTimer();
    
    // Start game loop
    requestAnimationFrame(gameLoop);

    // Adjust ball speed based on screen size
    if (window.innerWidth <= 768) {
        gameVars.ballSpeed = 4;
        gameVars.ballSpeedIncrement = 1;
    }
}

// Touch event handlers
paddle.addEventListener('touchstart', handleTouchStart);
paddle.addEventListener('touchmove', handleTouchMove);
paddle.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(e) {
    e.preventDefault();
    gameVars.isTouching = true;
    gameVars.touchStartX = e.touches[0].clientX - gameVars.paddleX;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!gameVars.isTouching) return;

    const touchX = e.touches[0].clientX;
    let newX = touchX - gameVars.touchStartX;

    // Constrain paddle movement within game container
    newX = Math.max(0, Math.min(newX, gameContainer.clientWidth - paddle.clientWidth));
    gameVars.paddleX = newX;
    updatePaddlePosition();
}

function handleTouchEnd(e) {
    e.preventDefault();
    gameVars.isTouching = false;
}

// Timer function
function startTimer() {
    gameVars.timerInterval = setInterval(() => {
        gameVars.gameTime++;
        updateTimerDisplay();
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameVars.gameTime / 60);
    const seconds = gameVars.gameTime % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Game loop
function gameLoop() {
    if (gameVars.isGameOver) return;

    // Move ball
    gameVars.ballX += gameVars.ballSpeed * gameVars.ballDirX;
    gameVars.ballY += gameVars.ballSpeed * gameVars.ballDirY;

    // Check wall collisions
    if (gameVars.ballX <= 0 || gameVars.ballX >= gameContainer.clientWidth - ball.clientWidth) {
        gameVars.ballDirX *= -1;
    }
    if (gameVars.ballY <= 0) {
        gameVars.ballDirY *= -1;
    }

    // Check paddle collision
    if (gameVars.ballY >= gameContainer.clientHeight - paddle.clientHeight - ball.clientHeight) {
        if (gameVars.ballX >= gameVars.paddleX && 
            gameVars.ballX <= gameVars.paddleX + paddle.clientWidth) {
            gameVars.ballDirY *= -1;
            increaseScore();
        } else if (gameVars.ballY >= gameContainer.clientHeight - ball.clientHeight) {
            gameOver();
            return;
        }
    }

    // Update ball position
    updateBallPosition();

    requestAnimationFrame(gameLoop);
}

// Window resize handler
window.addEventListener('resize', () => {
    // Ensure paddle stays within bounds after resize
    gameVars.paddleX = Math.min(
        gameVars.paddleX,
        gameContainer.clientWidth - paddle.clientWidth
    );
    updatePaddlePosition();
});

// Rest of the functions remain the same
function increaseScore() {
    gameVars.score++;
    scoreDisplay.textContent = `Score: ${gameVars.score}`;
    
    if (gameVars.score % 2 === 0) {
        increaseBallSpeed();
    }
}

function increaseBallSpeed() {
    gameVars.ballSpeed += gameVars.ballSpeedIncrement;
}

function updateBallPosition() {
    ball.style.left = `${gameVars.ballX}px`;
    ball.style.top = `${gameVars.ballY}px`;
}

function updatePaddlePosition() {
    paddle.style.left = `${gameVars.paddleX}px`;
}

function gameOver() {
    gameVars.isGameOver = true;
    clearInterval(gameVars.timerInterval);
    
    document.getElementById('final-score').textContent = `Final Score: ${gameVars.score}`;
    document.getElementById('final-time').textContent = timerDisplay.textContent;
    gameOverPopup.style.display = 'block';
}

function restartGame() {
    gameVars.isGameOver = false;
    gameVars.score = 0;
    gameVars.gameTime = 0;
    gameVars.ballSpeed = window.innerWidth <= 768 ? 4 : 5;
    gameVars.ballDirX = 1;
    gameVars.ballDirY = 1;
    
    scoreDisplay.textContent = 'Score: 0';
    updateTimerDisplay();
    gameOverPopup.style.display = 'none';
    
    initGame();
}

// Keyboard controls (kept for desktop users)
document.addEventListener('keydown', (e) => {
    if (gameVars.isGameOver) return;

    if (e.key === 'ArrowLeft') {
        gameVars.paddleX = Math.max(0, gameVars.paddleX - gameVars.paddleSpeed);
    } else if (e.key === 'ArrowRight') {
        gameVars.paddleX = Math.min(
            gameContainer.clientWidth - paddle.clientWidth,
            gameVars.paddleX + gameVars.paddleSpeed
        );
    }
    updatePaddlePosition();
});

// Start the game when the page loads
window.onload = initGame;