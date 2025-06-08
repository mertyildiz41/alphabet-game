export class Food {
    constructor(gridSize, canvasWidthInGrids, canvasHeightInGrids, initialPosition) {
        this.color = '#D9534F'; // Red color for food
        this.gridSize = gridSize;
        this.canvasWidthInGrids = canvasWidthInGrids;
        this.canvasHeightInGrids = canvasHeightInGrids;
        this.position = initialPosition || this.getRandomPosition();
    }
    getRandomPosition(excludePositions = []) {
        let newPosition;
        let excluded = false;
        do {
            newPosition = {
                x: Math.floor(Math.random() * this.canvasWidthInGrids),
                y: Math.floor(Math.random() * this.canvasHeightInGrids),
            };
            excluded = excludePositions.some(p => p.x === newPosition.x && p.y === newPosition.y);
        } while (excluded);
        return newPosition;
    }
    respawn(excludePositions = []) {
        this.position = this.getRandomPosition(excludePositions);
    }
    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x * this.gridSize + this.gridSize / 2, this.position.y * this.gridSize + this.gridSize / 2, this.gridSize / 2.5, // Slightly smaller than the grid cell for a round look
        0, Math.PI * 2);
        context.fill();
        // Adding a little shine to the food
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.beginPath();
        context.arc(this.position.x * this.gridSize + this.gridSize / 2.5, this.position.y * this.gridSize + this.gridSize / 2.5, this.gridSize / 6, 0, Math.PI * 2);
        context.fill();
    }
}
