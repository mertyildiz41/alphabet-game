export class Snake {
    constructor(initialPosition, gridSize) {
        this.headColor = '#38761D'; // Darker green for head
        this.bodyColor = '#6AA84F'; // Lighter green for body
        this.segments = [initialPosition];
        this.gridSize = gridSize;
    }
    move(direction, grow = false) {
        const head = Object.assign({}, this.segments[0]); // New head position
        switch (direction) {
            case 'UP':
                head.y -= 1;
                break;
            case 'DOWN':
                head.y += 1;
                break;
            case 'LEFT':
                head.x -= 1;
                break;
            case 'RIGHT':
                head.x += 1;
                break;
        }
        this.segments.unshift(head); // Add new head
        if (!grow) {
            this.segments.pop(); // Remove tail if not growing
        }
        return head;
    }
    checkCollision(canvasWidthInGrids, canvasHeightInGrids) {
        const head = this.segments[0];
        // Wall collision
        if (head.x < 0 || head.x >= canvasWidthInGrids || head.y < 0 || head.y >= canvasHeightInGrids) {
            return true;
        }
        // Self-collision
        for (let i = 1; i < this.segments.length; i++) {
            if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
                return true;
            }
        }
        return false;
    }
    draw(context) {
        this.segments.forEach((segment, index) => {
            context.fillStyle = index === 0 ? this.headColor : this.bodyColor;
            context.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 1, this.gridSize - 1); // -1 for grid line effect
            // Simple eye for the head
            if (index === 0) {
                context.fillStyle = 'white';
                const eyeSize = this.gridSize / 5;
                const eyeOffsetX = this.gridSize / 3;
                const eyeOffsetY = this.gridSize / 3;
                context.beginPath();
                context.arc(segment.x * this.gridSize + eyeOffsetX, segment.y * this.gridSize + eyeOffsetY, eyeSize, 0, Math.PI * 2);
                context.arc(segment.x * this.gridSize + this.gridSize - eyeOffsetX, segment.y * this.gridSize + eyeOffsetY, eyeSize, 0, Math.PI * 2);
                context.fill();
            }
        });
    }
}
