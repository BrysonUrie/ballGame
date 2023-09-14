class Timer {
    constructor() {
        this.width = 200;
        this.height = 20;
        this.timeLeft = 10;
        this.maxTime = 10;
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
        this.timeLeft = this.maxTime;
        this.startTimer();
    }
    incrementTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft -= .03
        }
    }
}
