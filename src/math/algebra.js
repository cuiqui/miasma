export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    scaleBy(n) {
        return new Vector2(this.x * n, this.y * n);
    }

    length() {
        return Math.hypot(this.x, this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    normalize() {
        return this.isZero() ? 0 : this.scaleBy(1 / this.length());
    }

    isZero() {
        return (this.x === 0) && (this.y === 0);
    }

    rotate(theta) {
        // convert to radians & use intuitive coords
        // the (-1) shouldn't be here
        let rad = (theta * (-1)) * (Math.PI / 180);
        // rotation matrix
        let x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
        let y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
        this.x = x;
        this.y = y;
        return this;
    }
}
