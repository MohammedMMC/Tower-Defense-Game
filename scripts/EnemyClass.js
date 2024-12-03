class Enemy {
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 100;
        this.height = 100;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 50;
        this.health = 100;
        this.velocity = { x: 0, y: 0 };
        this.speed = 13;
    }

    draw() {
        ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.beginPath();
        ctx.arc(
            this.center.x, this.center.y,
            this.radius, 0, Math.PI * 2
        );
        ctx.fill();

        // Health Bar
        ctx.fillStyle = "pink";
        ctx.fillRect(
            this.position.x, this.position.y - 15,
            this.width, 10
        );
        ctx.fillStyle = "green";
        ctx.fillRect(
            this.position.x, this.position.y - 15,
            this.width * this.health / 100, 10
        );
    }

    update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++;
        }
    }
}