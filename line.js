class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = this.p1.pos.dist(this.p2.pos);
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.stroke();
        ctx.fillText(
            this.length.toFixed(),
            (this.p1.pos.x + this.p2.pos.x) / 2,
            (this.p1.pos.y + this.p2.pos.y) / 2
        );
    }
    update() {}
}
