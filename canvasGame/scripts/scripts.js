"use strict"


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let frame = 0;
let grav = .5;
let friction = .999;
let playerSpeed = 3;
let time = 10;
let intervalTimer = setInterval(timer, 10);
let gameLoopInterval = setInterval(gameLoop, 10);
let score = 0;
let bugMoveDist = 50; 
let countdown = {
    width : 200,
    height : 20,
    timeLeft: time
}
let enemyCount = 0;
let scoreDiv = document.getElementById("score")


//Different Constructor classes and functions
class gameObject {

}

class ball extends gameObject {
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
}
const ball1 = new ball(10, canvas.width / 2, canvas.height - (canvas.height - 60),
    0,0,0,"blue");
class bug {
    constructor (radius, homeX, homeY, density) {
        this.radius = radius;
        this.x = 0;
        this.y = 0;
        this.homeX = homeX;
        this.homeY = homeY;
        this.density = density;
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
            bugs.push(createBug());
            score++;
        }
    }
}
function createBug() {
    let homeX = Math.random()*canvas.width + bugMoveDist;
    let homeY = Math.random()*canvas.height + bugMoveDist;
    while (Math.abs(homeX-ball1.homeX) < 20 || homeX > canvas.width-2*bugMoveDist) {
        homeX = Math.random()*canvas.width;
    }
    while (Math.abs(homeY-ball1.homeY) < 20|| homeY > canvas.height- 2*bugMoveDist) {
        homeY = Math.random()*canvas.height;
    }
    let radius = 5;
    
    let density = 1;
    return new bug(radius, homeX, homeY, density);
}
function updateBug() {
    for (let i = 0; i < bugs.length; i++) {
        let bug = bugs[i];
        bug.update();
    }
}
class enemy {
    constructor (radius, x, y, xVel, yVel, density, speed, maxSpeed) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.density = density;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.color = "red"
    }
    updatePos() {
        this.y += this.yVel;
        this.x += this.xVel;
    }
}
function createEnemy() {
    let radius = 10;
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;
    while (Math.abs(x-ball1.x) < 20) {
        x = Math.random()*canvas.width;
    }
    while (Math.abs(y-ball1.y) < 20) {
        y = Math.random()*canvas.height;
    }
    let xVel = 0;
    let yVel = 0;
    let density = 1;
    let speed = .14;
    let maxSpeed = 5;
    //Find where player is on the array to create onject far from them

    return new enemy(radius, x, y, xVel, yVel, density, speed, maxSpeed)
}
//Create all objects for game
let enemies = [];
let bug1 = createBug();
let bugs = [bug1];



function initGameEasy() {
    enemyCount = 1;
    endGame()
    initGame()
}
function initGameHard() {
    enemyCount = 2;
    endGame()
    initGame();
}

function initGame() {

    clearInterval(intervalTimer);
    
    
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(createEnemy());
    }
    

    //Set the timer on its interval
    intervalTimer = setInterval(timer, 10);
    
    
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
    //Set the game on its loop
    
};


function gameLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateEntities();
    drawEntities();
    frame++;
    scoreDiv.innerText =  score 
    //checkGameEnd();
}



function updateEnemy() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        checkMaxSpeed(enemy);
        applyFriction(enemy);

        let attackIndex = attackEnemy();
        if (i === attackIndex) {
            followObject(enemy, ball1);
        }
        else {
            followObjectDistance(enemy, ball1)
        }
        checkBoundariesElastic(enemy);

        enemy.updatePos();
    }
}

function updateEntities() {
    updateBall();
    updateEnemy();
    updateBug()
}

function updateBall () {
    //Apply friction
    applyFriction(ball1);

    //Handle y axis
    if (ball1.y > canvas.height - ball1.radius - 5) {
        ball1.isTouchingGround = true;
        ball1.doubleJump = 1;
    }
    else {
        ball1.isTouchingGround = false;
        ball1.yVel += grav;
    }
    if (ball1.y > canvas.height - ball1.radius) {
        ball1.y = canvas.height - ball1.radius;
        ball1.yVel = 0;
        ball1.yVel *= ball1.density;
    }

    //Handle X Axis
    if (ball1.isMovingLeft === true || ball1.isMovingRight === true) {
        resetTimer();
    }
    if (ball1.isMovingRight) {
        ball1.xVel = playerSpeed;
    }
    else if (ball1.isMovingLeft) {
        ball1.xVel = -1*playerSpeed;
    }
    else {
        ball1.xVel = 0;
    }

    if (ball1.x - ball1.radius < -.001) {
        ball1.x = 0 + ball1.radius
    }
    if (ball1.x + ball1.radius > canvas.width +1) {
        ball1.x = canvas.width - ball1.radius
    }
    //Apply the changes to the ball1 X and Y
    ball1.updatePos();
}
//enemy1 script


//List of enemies to draw
function drawEntities() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        drawObject(enemy)
    }
    for (let i = 0; i < bugs.length; i++) {
        const element = bugs[i];
            drawObject(element)
    }
    drawObject(ball1)
    drawTimer();
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
//Function that will check the speed of any object and limit to its max speed
function checkMaxSpeed(object) {
    if (object.yVel > object.maxSpeed) {
        object.yVel = object.maxSpeed
    }
    else if (object.yVel < -1*object.maxSpeed) {
        object.yVel = -1*object.maxSpeed
    }
    if (object.xVel > object.maxSpeed) {
        object.xVel = object.maxSpeed
    }
    else if (object.xVel < -1*object.maxSpeed) {
        object.xVel = -1*object.maxSpeed
    }
}
//Function that will apply friction to any object
function applyFriction(object) {
    object.yVel *= friction;
    object.xVel *= friction;
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
//Function to draw the timer
function drawTimer() {
    ctx.beginPath();
    ctx.rect(20, 20, countdown.width, countdown.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(20, 20, (countdown.width*time/10), countdown.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
//Function to reset the timer on movement
function resetTimer() {
    clearInterval(intervalTimer);
    time = 10;
}
//Function to subtract from timer until it is less than 0
function timer() {
    if (time > 0) {
        time -= .03
    }
}
//Function that will check the boundaries of any object
function checkBoundariesElastic(object) {
    if (object.x <= 0) {
        object.x = 0;
        object.xVel *= -1*object.density
    }
    if (object.x >= canvas.width) {
        object.x = canvas.width;
        object.xVel *= -1*object.density
    }
    if (object.y <= 0) {
        object.yVel *= -1*object.density
        object.y = 0;
    }
    if (object.y >= canvas.height) {
        object.yVel *= -1*object.density
        object.y = canvas.height;
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
    if (time < 0) {
        alert("Gave Over")
    }
}

function endGame() {
    enemies = [];
    
}
