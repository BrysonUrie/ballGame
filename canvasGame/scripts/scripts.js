"use strict"

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let frame = 0;
let grav = .5;
let friction = .999;
let score = 0;
let scoreDiv = document.getElementById("score")
let ball1 = new ball(10, canvas.width / 2, canvas.height - (canvas.height - 60), 0,0,0,"blue");
addPlayerControls();
let enemies = [];
let bugs = [];
let gameTimer = new Timer();
let gameLoopInterval = setInterval(gameLoop, 10);

function initGame(enemyCount) {
    let bug1 = new bug();
    bugs = [bug1];
    clearPreviousGame();
    pushEnemies(enemyCount);
    //Set the timer on its interval
    gameTimer.startTimer();
    
};

function updateEnemy() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        setClosestEnemy();
        
    }
}
function updateBug() {
    for (let i = 0; i < bugs.length; i++) {
        let bug = bugs[i];
        bug.update();
    }
}

function pushEnemies(enemyCount) {
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(new Enemy());
    }
}
function clearPreviousGame() {
    clearEnemies();
}
function gameLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateEntities();
    drawEntities();
    frame++;
    scoreDiv.innerText =  score 
    //checkGameEnd();
}
function updateEntities() {
    ball1.update();
    updateEnemy();
    updateBug()
}
function drawEntities() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.draw()
    }
    for (let i = 0; i < bugs.length; i++) {
        const bug = bugs[i];
        bug.draw()
    }
    ball1.draw()
    gameTimer.draw();
}
function checkGameEnd() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (ball1.checkCollision(enemy)) {
            alert("GameOver")
        }
    }
    if (gameTimer.timeLeft < 0) {
        alert("Gave Over")
    }
}

function clearEnemies() {
    enemies = [];
}
function getClosestEnemyIndex() {
    let distBetween = []
    for (let i = 0; i < enemies.length; i++) {
        distBetween.push(enemies[i].getDistanceToBall());
    }
    return distBetween.indexOf(Math.min(...distBetween))
}
function setClosestEnemy() {
    let closestEnemyIndex = getClosestEnemyIndex();
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (i === closestEnemyIndex) {
            enemy.isClosestToBall = true;
        }
        else {
            enemy.isClosestToBall = false;
        }
    }
}

function addPlayerControls() {
    addEventListener("keydown", function (event) {
        if (event.key == "ArrowUp") {
            ball1.jump();
        }
        if (event.key == "ArrowRight") {
            ball1.isMovingRight = true;
        }
        if (event.key == "ArrowLeft") {
            ball1.isMovingLeft = true;
        }
    });
    addEventListener("keyup", function (event) {
        if (event.key == "ArrowRight") {
            ball1.isMovingRight = false;
        }
        if (event.key == "ArrowLeft") {
            ball1.isMovingLeft = false;
        }
    });
    
}