class Enemy extends IntelligentGameObject {
    constructor () {
        let tempX = Math.random()*canvas.width
        while (Math.abs(tempX-ball1.x) < 20) {
            tempX = Math.random()*canvas.width;
        }
        let tempY = Math.random()*canvas.height;
        while (Math.abs(tempY-ball1.y) < 20) {
            tempY = Math.random()*canvas.height;
        }
        super(tempX, tempY, 10, "red", 0, 0, .14, 1)
        this.maxSpeed = 5;
        this.isClosestToBall = false;
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
    attackEnemy() {
        if (this.isClosestToBall === true) {
            this.followObject(ball1);
        }
        else {
            this.followObjectDistance(ball1);
        }
    }

    followObject(followed) {
        let xDist = followed.x - this.x;
        let yDist = followed.y - this.y;
        if ((Math.abs(xDist * .2)) < this.speed) {
            this.xVel += xDist *.2
        }
        else if (followed.x > this.x) {
            this.xVel += this.speed
        }
        else {
            this.xVel -= this.speed
        }
        if ((Math.abs(yDist * .2)) < this.speed) {
            this.yVel += yDist *.2
        }
        else if (followed.y > this.y) {
            this.yVel += this.speed
        }
        else {
            this.yVel -= this.speed
        }
    }
    followObjectDistance(followed) {
        let xDist = Math.abs(followed.x - this.x);
        let yDist = Math.abs(followed.y - this.y);
    
    
        if (xDist < Math.random()*100 + 50) {
            this.xVel -= -1*(Math.random()*this.xVel)
        }
        if (followed.x > this.x) {
            this.xVel += this.speed
        }
        else {
            this.xVel -= this.speed
        }
        
        if (yDist < Math.random()*100 + 50) {
            this.yVel -= -1*(Math.random()*this.yVel)
        }
        if (followed.y > this.y) {
            this.yVel += this.speed
        }
        else {
            this.yVel -= this.speed
        }
    }
    getDistanceToBall() {
        return Math.sqrt(Math.pow(ball1.x - this.x, 2) + Math.pow(ball1.y - this.y, 2));
    }
    update() {
        this.attackEnemy();
        this.applyFriction();
        this.checkBoundariesElastic();
        this.checkMaxSpeed();
        this.updatePos();
    }
}
