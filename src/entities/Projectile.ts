// src/entities/Projectile.ts
import { GameObject } from '../types/index.js';

export class Projectile implements GameObject {
    x: number; // Center x of the projectile tip
    y: number; // y of the projectile tip
    width: number; // Collision width
    height: number; // Collision height / visual length
    color: string;
    speed: number;
    isActive: boolean = true;

    constructor(x: number, y: number, width: number, height: number, color: string, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    update(deltaTime: number) {
        if (!this.isActive) return;
        this.y -= this.speed * (deltaTime / 16.67); // Normalize speed
        
        // Mark for removal if it goes off screen (above canvas)
        if (this.y + this.height < 0) {
            this.isActive = false;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (!this.isActive) return;
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
