class Line {
    constructor(p1, p2, color = randomColor(), width = 5) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = this.p1.pos.dist(this.p2.pos);
        this.color = color;
        this.hidden = false;
        this.width = width;
    }
    update() {
        const newLength = this.p1.pos.dist(this.p2.pos);
        const delta = this.length - newLength;
        const angle = this.p2.pos.angleTo(this.p1.pos);
        const fix1 = Vector.fromAngle(angle).scale(delta / 2);
        const fix2 = fix1.scale(-1);
        this.p1.fix.addMut(fix1);
        this.p2.fix.addMut(fix2);
    }
    draw() {
        if (this.hidden) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);

        if (Input.showTension) {
            const realLength = this.p1.pos.dist(this.p2.pos);
            const f = realLength / this.length;
            const r = Math.floor(clamp(f - 0.5, 0, 1) * 256);
            const g = Math.floor(clamp(0.5 - Math.abs(1 - f), 0, 0.5) * 256);
            const b = Math.floor(clamp(1.5 - f, 0, 1) * 256);
            const color = `rgb(${r}, ${g}, ${b})`;
            ctx.strokeStyle = color;
        } else {
            ctx.strokeStyle = this.color;
        }

        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.restore();
    }
    highlight() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.strokeStyle = "orange";
        ctx.lineWidth = this.width + 8;
        ctx.stroke();
        ctx.restore();
    }
}
