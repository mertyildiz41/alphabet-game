export class Projectile {
    constructor(x, y, width, height, color, speed) {
        this.isActive = true;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }
    update(deltaTime) {
        if (!this.isActive)
            return;
        this.y -= this.speed * (deltaTime / 16.67); // Normalize speed
        // Mark for removal if it goes off screen (above canvas)
        if (this.y + this.height < 0) {
            this.isActive = false;
        }
    }
    draw(context) {
        if (!this.isActive)
            return;
        context.fillStyle = this.color;
        // Draw as an upward pointing arrow/triangle shape
        context.beginPath();
        context.moveTo(this.x, this.y); // Tip
        context.lineTo(this.x - this.width / 2, this.y + this.height); // Bottom-left base
        context.lineTo(this.x + this.width / 2, this.y + this.height); // Bottom-right base
        context.closePath();
        context.fill();
    }
}
