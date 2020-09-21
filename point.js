class Point {
    constructor(pos = new Vector(), radius = 10, color = randomColor()) {
        this.pos = pos;
        this.vel = new Vector();
        this.radius = radius;
        this.color = color;
        this.hidden = false;
        this.fix = new Vector();
        this.lastFix = new Vector();
    }

    update() {
        this.vel
            .scaleMut(AIR_DENSITY)
            .addMut(GRAVITY)
            .addMut(this.fix.clamp(RIGIDITY))
            .clampMut(MAX_FORCE);
        this.pos.addMut(this.vel);
        this.fix = new Vector();

        if (this.pos.y > floor - this.radius) {
            this.pos.y = floor - this.radius;
            this.vel.y = 0;
            this.vel.x *= FRICTION;
        }
    }

    draw() {
        if (this.hidden) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
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
    activeHighlight() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius + 11, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#ee6600";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}
