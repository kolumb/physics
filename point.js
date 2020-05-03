class Point {
    constructor(pos = new Vector(), radius = 10, color = randomColor()) {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
    }

    update() {
        this.pos.addMut(GRAVITY);
        if (this.pos.y > FLOOR - this.radius) {
            this.pos.y = FLOOR - this.radius;
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}
