class Line {
    constructor(p1, p2, color = randomColor(), width = 5) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = this.p1.pos.dist(this.p2.pos);
        this.currentLength = this.length;
        this.color = color;
        this.width = width;
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.fillText(
            this.currentLength.toFixed(),
            (this.p1.pos.x + this.p2.pos.x) / 2,
            (this.p1.pos.y + this.p2.pos.y) / 2
        );
        ctx.restore();
    }
    update() {
        const newLength = this.p1.pos.dist(this.p2.pos);
        const delta = this.length - newLength;
        const angle = this.p2.pos.angleTo(this.p1.pos);
        const fix1 = Vector.fromAngle(angle).scale(delta / 2);
        const fix2 = fix1.scale(-1);
        this.p1.fix.addMut(fix1);
        this.p2.fix.addMut(fix2);
        this.currentLength = newLength;
    }
}
