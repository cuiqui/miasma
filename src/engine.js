/* Smol engine class */

export class Engine {
    constructor(width, height, canvasId, maxSprites) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        this.maxSprites = maxSprites;
        this.lastTimestamp = 0;
        this.spriteCount = 0;
        this.spriteGroups = {};
        this.running = false;
        this.clearCanvasBetweenFrames = true;
        this.debug = false;
    }

    canPushSprite() {
        return this.spriteCount < this.maxSprites;
    }

    pushSprite(sprite, group) {
        if (!this.canPushSprite) {
            return false;
        }
        this.spriteCount++;
        group = group || 'general';
        if (!(group in this.spriteGroups)) {
            this.spriteGroups[group] = [sprite];
        } else {
            this.spriteGroups[group].push(sprite);
        }
        return true;
    }

    removeSprite(sprite, group) {
        group = group || 'general';
        let idx = this.spriteGroups[group].indexOf(sprite);
        this.spriteGroups[group].splice(idx, 1);
        this.spriteCount--;
    }

    update(deltaTime) {
        for (let group in this.spriteGroups) {
            this.spriteGroups[group].forEach(sprite => {
                sprite.update(deltaTime);
            });
        }
    }

    draw(timestamp) {
        // calculate delta time between frames in miliseconds
        let dt = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        // update sprite positions in canvas
        this.update(dt);

        // clear canvas and draw everything
        if (this.clearCanvasBetweenFrames) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        for (let group in this.spriteGroups) {
            this.spriteGroups[group].forEach(sprite => {
                this.ctx.save();
                sprite.draw(this.ctx, this.debug);
                this.ctx.restore();
            });
        }

        if (this.running) {
            requestAnimationFrame((ts) => this.draw(ts));
        }
    }

    start() {
        this.running = true;
        this.lastTimestamp = window.performance.now();
        requestAnimationFrame((ts) => this.draw(ts));
    }

    stop() {
        this.running = false;
    }
}


