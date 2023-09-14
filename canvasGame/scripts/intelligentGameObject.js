class IntelligentGameObject extends GameObject {
    constructor (x, y, radius, color, xVel, yVel, speed, density) {
        super(x,y,radius,color);
        this.xVel = xVel;
        this.yVel = yVel;
        this.speed = speed;
        this.density = density;
    }
    applyFriction() {
        this.yVel *= friction;
        this.xVel *= friction;
    }
}