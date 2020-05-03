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
}
