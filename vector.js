class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        let x = this.x + v.x;
        let y = this.y + v.y;
        return new Vector(x, y);
    }
    addMut(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    dist(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    angleTo(v) {
        const dx = v.x - this.x;
        const dy = v.y - this.y;
        return Math.atan2(dy, dx);
    }
    scale(f) {
        return new Vector(this.x * f, this.y * f);
    }
    scaleMut(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    static fromAngle(a) {
        return new Vector(Math.cos(a), Math.sin(a));
    }
    draw(v) {
        ctx.save();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x + this.x, v.y + this.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
    }
}
