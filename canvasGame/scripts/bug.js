class bug extends GameObject {
    constructor () {
        super(0, 0, 5, "green")
        this.moveDist = 50
        this.homeX = Math.random()*canvas.width + this.moveDist;
        while (Math.abs(this.homeX-ball1.homeX) < 20 || this.homeX > canvas.width-2*this.moveDist) {
            this.homeX = Math.random()*canvas.width;
        }
        this.homeY = Math.random()*canvas.height + this.moveDist;
        while (Math.abs(this.homeY-ball1.homeY) < 20|| this.homeY > canvas.height- 2*this.moveDist) {
            this.homeY = Math.random()*canvas.height;
        }
    }
    update() {
        this.bugMovement();
        this.checkEaten();
    }
    bugMovement() {
        this.x = this.homeX + this.moveDist*(Math.sin(frame/50))
        this.y = this.homeY + this.moveDist*(Math.sin(frame/20))
    }
    checkEaten() {
        if (this.checkCollision(ball1)) {
            bugs.pop()
            bugs.push(new bug());
            score++;
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