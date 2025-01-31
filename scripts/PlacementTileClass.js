class PlacementTile {
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 65;
        this.color = "rgba(255,255,255, 0.15)";
        this.occupied = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }

    /**
     * @param {{ x: Number, y:Number }} mouse 
     */
    update(mouse) {
        this.draw();

        if (
            mouse.x > this.position.x &&
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y &&
            mouse.y < this.position.y + this.size
        ) {
            this.color = "rgba(255,255,255, 0.5)";
        } else this.color = "rgba(255,255,255, 0.15)";
    }
}