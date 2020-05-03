class Line {
    constructor(p1, p2, color = randomColor(), width = 5) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = this.p1.pos.dist(this.p2.pos);
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
            this.length.toFixed(),
            (this.p1.pos.x + this.p2.pos.x) / 2,
            (this.p1.pos.y + this.p2.pos.y) / 2
        );
        ctx.restore();
    }
    update() {}
}
