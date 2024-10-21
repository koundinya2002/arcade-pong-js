// Create JS representation from the DOM
const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");


// Game Variables
let gameRunning = false;
let keysPressed = {};
let paddle1speed = 0;
let paddle1Y = 150;
let paddle2speed = 0;
let paddle2Y = 150;
let ballX = 290;
let ballSpeedX = 2;
let ballY = 190;
let ballSpeedY = 2;
let player1Score = 0;
let player2Score = 0;


// Game Constants
const paddleAcceleration = 1;
const maxPaddleSpeed = 5;
const paddleDeceleration = 1;
const gameHeight = 400;
const gameWidth = 600;
const ball = document.getElementById('ball');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');


document.addEventListener('keydown', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


// start game
function startGame() {
    gameRunning = true;
    console.log('started');
    startText.style.display = 'none';
    document.removeEventListener('keydown', startGame);
    gameLoop();
}


function gameLoop() {
    if(gameRunning) {
        updatePaddle1();
        updatePaddle2();
        moveBall();
        setTimeout(gameLoop, 8);
    }
}


function handleKeyDown(e) {
    keysPressed[e.key] = true;
}

function handleKeyUp(e) {
    keysPressed[e.key] = false;
}


function updatePaddle1() {
    if (keysPressed['w'] || keysPressed['W']) {
        paddle1speed = Math.max(paddle1speed - paddleAcceleration, -maxPaddleSpeed);
    } else if (keysPressed['s'] || keysPressed['S']) {
        paddle1speed = Math.min(paddle1speed + paddleAcceleration, maxPaddleSpeed);
    } else {
        if (paddle1speed > 0) {
            paddle1speed = Math.max(paddle1speed - paddleDeceleration, 0);
        }
        else if (paddle1speed < 0){
            paddle1speed = Math.min(paddle1speed + paddleDeceleration, 0);
        }
    }

    paddle1Y += paddle1speed;

    if (paddle1Y < 0) {
        paddle1Y = 0;
    }

    if (paddle1Y > gameHeight - paddle1.clientHeight) {
        paddle1Y = gameHeight - paddle1.clientHeight;
    }

    paddle1.style.top = paddle1Y + 'px';
}


function updatePaddle2() {
    if (keysPressed['ArrowUp'] || keysPressed['8']) {
        paddle2speed = Math.max(paddle2speed - paddleAcceleration, -maxPaddleSpeed);
    } else if (keysPressed['ArrowDown'] || keysPressed['2']) {
        paddle2speed = Math.min(paddle2speed + paddleAcceleration, maxPaddleSpeed);
    } else {
        if (paddle2speed > 0) {
            paddle2speed = Math.max(paddle2speed - paddleDeceleration, 0);
        }
        else if (paddle2speed < 0){
            paddle2speed = Math.min(paddle2speed + paddleDeceleration, 0);
        }
    }

    paddle2Y += paddle2speed;

    if (paddle2Y < 0) {
        paddle2Y = 0;
    }

    if (paddle2Y > gameHeight - paddle2.clientHeight) {
        paddle2Y = gameHeight - paddle2.clientHeight;
    }

    paddle2.style.top = paddle2Y + 'px';
}


function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
        ballSpeedY = -ballSpeedY;
        playSound(wallSound);
    }

    // Paddle 1 impact
    if (ballX <= paddle1.clientWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddle1.clientHeight) {
        ballSpeedX = -ballSpeedX;
        playSound(paddleSound);
    }

    // Paddle 2 impact
    if (ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddle2.clientHeight) {
        ballSpeedX = -ballSpeedX;
        playSound(paddleSound);
    }


    // out of gameArea collision
    if (ballX <=0 ) {
        player2Score++;
        playSound(lossSound);
        updateScoreBoard(); 
        resetBall();
        pauseGame();
    } else if(ballX >= gameWidth - ball.clientWidth) {
        player1Score++;
        playSound(lossSound);
        updateScoreBoard();
        resetBall();
        pauseGame();
    }


    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}


function updateScoreBoard() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}


function resetBall() {
    ballX = gameWidth/2 - ball.clientWidth/2;
    ballY = gameHeight/2 - ball.clientHeight/2;
    ballSpeedX = Math.random > 0.5 ? 2 : -2 ;
    ballSpeedY = Math.random > 0.5 ? 2 : -2 ;
}


function pauseGame() {
    gameRunning = false;
    document.addEventListener('keydown', startGame);
}


function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}