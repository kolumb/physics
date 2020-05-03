class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.stroke();
    }
}
