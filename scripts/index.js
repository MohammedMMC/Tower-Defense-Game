const endGameElement = document.getElementById("endGame");

function showEndGame() {
    endGameElement.style.height = "100%";
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gameMapImage = new Image();
gameMapImage.onload = animate;
gameMapImage.src = "./images/gameMap.png";


const mouse = {
    x: undefined,
    y: undefined
};
/** @type {PlacementTile} */
let activeTile = undefined;
let enemyCount = 3;
let hearts = 10;

/** @type {Building[]} */
const buildings = [];

/** @type {Enemy[]} */
const enemies = [];

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 150;
        enemies.push(
            new Enemy({
                position: { x: waypoints[0].x - xOffset, y: waypoints[0].y }
            })
        );
    }
}

spawnEnemies(enemyCount);

/** @type {PlacementTile[]} */
const placementTiles = [];

placementTiles2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            // Add Building Placement tile here
            placementTiles.push(
                new PlacementTile({
                    position: {
                        x: x * 64,
                        y: y * 64
                    }
                })
            );
        }
    });
});

function animate() {
    const animationId = requestAnimationFrame(animate);
    ctx.drawImage(gameMapImage, 0, 0);

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();

        if (enemy.position.x > canvas.width) {
            hearts--;
            enemies.splice(i, 1);

            if (hearts <= 0) {
                showEndGame();
                cancelAnimationFrame(animationId);
            }
        }
    }

    // Tracking total ammount of enemies
    if (enemies.length === 0) {
        enemyCount *= 2;
        spawnEnemies(enemyCount);
    }

    placementTiles.forEach(tile => tile.update(mouse));

    buildings.forEach(building => {
        building.update(mouse);
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.center.x;
            const yDifference = enemy.center.y - building.center.y;
            const distance = Math.hypot(yDifference, xDifference);
            return distance < enemy.radius + building.radius;
        });
        building.target = validEnemies[0];

        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];
            projectile.update();

            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(yDifference, xDifference);

            // This is when a projectile hits an enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                // Enemy health and enemy removal
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => projectile.enemy === enemy);
                    if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
                }
                building.projectiles.splice(i, 1);
            }
        }
    });
}

canvas.addEventListener("click", (e) => {
    if (activeTile && !activeTile.isOccupied) {
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }));
        activeTile.isOccupied = true;
    }
});

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];

        if (
            mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size
        ) {
            activeTile = tile;
            break;
        }
    }
});