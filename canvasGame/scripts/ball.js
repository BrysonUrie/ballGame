class ball extends IntelligentGameObject {
    constructor (radius, x, y, xVel, yVel, density, color) {
        super(x, y, radius, color, xVel, yVel, 3, density);
        this.doubleJump = 1;
        this.isTouchingGround = false;
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }

    updatePos() {
        this.y += this.yVel;
        this.x += this.xVel;
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
            this.xVel = this.speed;
        }
        else if (this.isMovingLeft) {
            this.xVel = -1*this.speed;
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
    jump() {
        if (this.isTouchingGround || this.doubleJump === 1) {
            this.yVel = 0;
            this.yVel -= 19;
            if (this.isTouchingGround === false) {
                this.doubleJump -= 1;
            }
        }
    } 
    checkCollision(other) {
        let xDist = Math.abs(other.x - this.x);
        let yDist = Math.abs(other.y - this.y);
    
        if (xDist < other.radius + this.radius && yDist < other.radius + this.radius) {
            return true;
        }
        else {
            return false;
        }
    }
}