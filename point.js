class Point {
    constructor(pos = new Vector(), radius = 10, color = randomColor()) {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
        this.fix = new Vector();
    }

    update() {
        this.fix.scale(50).draw(this.pos);
        this.pos.addMut(GRAVITY).addMut(this.fix);
        this.fix = new Vector();

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
