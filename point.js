class Point {
    constructor(pos = new Vector(), radius = 10, color = randomColor()) {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.fix = new Vector();
        this.lastFix = new Vector();
    }

    update() {
        this.lastFix = this.fix.copy();
        this.pos.addMut(GRAVITY).addMut(this.fix);
        this.fix = new Vector();

        if (this.pos.y > floor - this.radius) {
            this.pos.y = floor - this.radius;
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        this.lastFix.scale(50).draw(this.pos);
    }
    highlight() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.arc(this.pos.x, this.pos.y, this.radius + 10, 0, Math.PI * 2, true);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.restore();
    }
}
