"use strict"


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let frame = 0;
let grav = .5;
let friction = .999;
let playerSpeed = 3;
let time = 10;
let gameLoopInterval = setInterval(gameLoop, 10);
let score = 0;
let bugMoveDist = 50; 
let enemyCount = 0;
let scoreDiv = document.getElementById("score")



//Different classes and functions
class gameObject {
    
}

class ball {
    constructor (radius, x, y, xVel, yVel, density, color) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.density = density;
        this.color = color; 
        

        this.doubleJump = 1;
        this.isTouchingGround = false;
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }
    updatePos() {
        this.y += this.yVel;
        this.x += this.xVel;
    }
    applyFriction() {
        this.yVel *= friction;
        this.xVel *= friction;
    }
    handleYAxis() {
        if (this.y > canvas.height - this.radius - 5) {
            this.isTouchingGround = true;
            this.doubleJump = 1;
        }
        else {
            this.isTouchingGround = false;
            this.yVel += grav;
        }
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.yVel = 0;
            this.yVel *= this.density;
        }
    }
    handleXAxis() {
        if (this.isMovingLeft === true || this.isMovingRight === true) {
            gameTimer.resetTimer();
        }
        if (this.isMovingRight) {
            this.xVel = playerSpeed;
        }
        else if (this.isMovingLeft) {
            this.xVel = -1*playerSpeed;
        }
        else {
            this.xVel = 0;
        }
    
        if (this.x - this.radius < -.001) {
            this.x = 0 + this.radius
        }
        if (this.x + this.radius > canvas.width +1) {
            this.x = canvas.width - this.radius
        }
    }
    update() {
        //Apply friction
        this.applyFriction();
        //Handle y axis
        this.handleYAxis();
        //Handle X Axis
        this.handleXAxis();
        //Apply the changes to the ball1 X and Y
        this.updatePos();
    }
}

const ball1 = new ball(10, canvas.width / 2, canvas.height - (canvas.height - 60),
    0,0,0,"blue");

class bug {
    constructor () {
        this.radius = 5;
        this.x = 0;
        this.y = 0;
        this.homeX = Math.random()*canvas.width + bugMoveDist;
        while (Math.abs(this.homeX-ball1.homeX) < 20 || this.homeX > canvas.width-2*bugMoveDist) {
            this.homeX = Math.random()*canvas.width;
        }
        this.homeY = Math.random()*canvas.height + bugMoveDist;
        while (Math.abs(this.homeY-ball1.homeY) < 20|| this.homeY > canvas.height- 2*bugMoveDist) {
            this.homeY = Math.random()*canvas.height;
        }
        this.density = 1;
        this.color = "green"
    }
    
    update() {
        this.bugMovement();
        this.checkEaten();
    }
    bugMovement() {
        this.x = this.homeX + bugMoveDist*(Math.sin(frame/50))
        this.y = this.homeY + bugMoveDist*(Math.sin(frame/20))
    }
    checkEaten() {
        if (checkCollision(ball1, this)) {
            bugs.pop()
            bugs.push(new bug());
            score++;
        }
    }
}
class Timer {
    constructor() {
        this.width = 200;
        this.height = 20;
        this.timeLeft = 10;
        this.intervalTimer = null;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(20, 50, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.rect(20, 50, (this.width*this.timeLeft/10), this.height);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
    startTimer() {
        this.intervalTimer = setInterval(() => {this.incrementTimer(); }, 10); 
    }
    resetTimer() {
        clearInterval(this.intervalTimer);
        this.time = 10;
    }
    incrementTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft -= .03
        }
    }
}


function updateBug() {
    for (let i = 0; i < bugs.length; i++) {
        let bug = bugs[i];
        bug.update();
    }
}
class enemy {
    static attackIndex = 0;
    constructor () {
        this.radius = 10;
        this.x = Math.random()*canvas.width
        while (Math.abs(this.x-ball1.x) < 20) {
            this.x = Math.random()*canvas.width;
        }
        this.y = Math.random()*canvas.height;
        while (Math.abs(this.y-ball1.y) < 20) {
            this.y = Math.random()*canvas.height;
        }
        this.xVel = 0;
        this.yVel = 0;
        this.density = 1;
        this.speed = .14;
        this.maxSpeed = 5;
        this.color = "red"
    }
    updatePos() {
        this.y += this.yVel;
        this.x += this.xVel;
    }
    checkMaxSpeed() {
        if (this.yVel > this.maxSpeed) {
            this.yVel = this.maxSpeed
        }
        else if (this.yVel < -1*this.maxSpeed) {
            this.yVel = -1*this.maxSpeed
        }
        if (this.xVel > this.maxSpeed) {
            this.xVel = this.maxSpeed
        }
        else if (this.xVel < -1*this.maxSpeed) {
            this.xVel = -1*this.maxSpeed
        }
    }
    applyFriction() {
        this.yVel *= friction;
        this.xVel *= friction;
    }
    checkBoundariesElastic() {
        if (this.x <= 0) {
            this.x = 0;
            this.xVel *= -1*this.density
        }
        if (this.x >= canvas.width) {
            this.x = canvas.width;
            this.xVel *= -1*this.density
        }
        if (this.y <= 0) {
            this.yVel *= -1*this.density
            this.y = 0;
        }
        if (this.y >= canvas.height) {
            this.yVel *= -1*this.density
            this.y = canvas.height;
        }
    }
    getAttackIndex(i) {
        let attackIndex = attackEnemy();
        if (i === attackIndex) {
            followObject(this, ball1);
        }
        else {
            followObjectDistance(this, ball1)
        }
    }
    attackEnemy() {
        let distsBetween = []
        for (let i = 0; i < enemies.length; i++) {
            const element = enemies[i];
            let distBetween = Math.sqrt(Math.pow(ball1.x - element.x, 2) + 
                Math.pow(ball1.y - element.y, 2));
            distsBetween.push(distBetween);
        }
        let minInd = distsBetween.indexOf(Math.min(...distsBetween))
    
        return minInd
    }
}
function updateEnemy() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        
        enemy.applyFriction();
        enemy.getAttackIndex(i);
        enemy.checkBoundariesElastic();
        enemy.checkMaxSpeed();
        enemy.updatePos();
    }
}

//Create all objects for game
let enemies = [];
let bug1 = new bug();
let bugs = [bug1];
let gameTimer = new Timer();


//Create event listeners for player control and player]
addEventListener("keydown", function (event) {
    if (event.key == "ArrowUp") {
        if (ball1.isTouchingGround || ball1.doubleJump === 1) {
            ball1.yVel = 0;
            ball1.yVel -= 19;
            if (ball1.isTouchingGround === false) {
                ball1.doubleJump -= 1;
            }
        }
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

function initGame(enemyCount) {
    clearPreviousGame();
    pushEnemies(enemyCount);
    //Set the timer on its interval
    gameTimer.startTimer();
    
};
function pushEnemies(enemyCount) {
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(new enemy());
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


//List of enemies to draw
function drawEntities() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        drawObject(enemy)
    }
    for (let i = 0; i < bugs.length; i++) {
        const bug = bugs[i];
            drawObject(bug)
    }
    drawObject(ball1)
    gameTimer.draw();
}
//Function to draw any object
function drawObject(object) {
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
    ctx.fillStyle = object.color;
    ctx.fill();
    ctx.closePath();
}
function attackEnemy() {
    let distsBetween = []
    for (let i = 0; i < enemies.length; i++) {
        const element = enemies[i];
        let distBetween = Math.sqrt(Math.pow(ball1.x - element.x, 2) + 
            Math.pow(ball1.y - element.y, 2));
        distsBetween.push(distBetween);
    }
    let minInd = distsBetween.indexOf(Math.min(...distsBetween))

    return minInd
}


//Function that will make one object follow another. Adding less momentum as it gets closer
function followObject(follower, followed) {
    let xDist = followed.x - follower.x;
    let yDist = followed.y - follower.y;


    if ((Math.abs(xDist * .2)) < follower.speed) {
        follower.xVel += xDist *.2
    }
    else if (followed.x > follower.x) {
        follower.xVel += follower.speed
    }
    else {
        follower.xVel -= follower.speed
    }

    if ((Math.abs(yDist * .2)) < follower.speed) {
        follower.yVel += yDist *.2
    }
    else if (followed.y > follower.y) {
        follower.yVel += follower.speed
    }
    else {
        follower.yVel -= follower.speed
    }
}
 function followObjectDistance(follower, followed) {
    let xDist = Math.abs(followed.x - follower.x);
    let yDist = Math.abs(followed.y - follower.y);


    if (xDist < Math.random()*100 + 50) {
        follower.xVel -= -1*(Math.random()*follower.xVel)
    }
    if (followed.x > follower.x) {
        follower.xVel += follower.speed
    }
    else {
        follower.xVel -= follower.speed
    }
    
    if (yDist < Math.random()*100 + 50) {
        follower.yVel -= -1*(Math.random()*follower.yVel)
    }
    if (followed.y > follower.y) {
        follower.yVel += follower.speed
    }
    else {
        follower.yVel -= follower.speed
    }
}
//Function that will check collision between any two objects
function checkCollision(object1, object2) {
    let xDist = Math.abs(object1.x - object2.x);
    let yDist = Math.abs(object1.y - object2.y);

    if (xDist < object1.radius + object2.radius && yDist < object1.radius + object2.radius) {
        return true;
    }
    else {
        return false;
    }
}


//Check to see if the game has ended under any condition
function checkGameEnd() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (checkCollision(ball1, enemy)) {
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
