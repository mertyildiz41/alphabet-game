// src/entities/Player.ts
import { Projectile } from './Projectile.js';
import { GameObject } from '../types/index.js';

export class Player implements GameObject {
    x: number;
    y: number;
    width: number; // Width of the aimer base
    height: number; // Height of the aimer triangle
    color: string = '#FFD700'; // Gold-ish color for aimer
    private canvasWidth: number;
    private aimerTipY: number;

    constructor(canvasWidth: number, canvasHeight: number, roadHeight: number) {
        this.canvasWidth = canvasWidth;
        this.width = 60; // Aimer base width
        this.height = 30; // Aimer height (triangle part)
        this.x = canvasWidth / 2;
        // Position aimer base on the road, tip pointing up
        this.y = canvasHeight - roadHeight + this.height + 10; // Base of the aimer slightly above road bottom edge
        this.aimerTipY = this.y - this.height;
    }

    updateAimerPosition(mouseX: number) {
        this.x = Math.max(this.width / 2, Math.min(mouseX, this.canvasWidth - this.width / 2));
    }

    shoot(speedMultiplier: number = 1): Projectile { // Accept a speed multiplier
        const baseSpeed = 12;
        const finalSpeed = baseSpeed * speedMultiplier;
        // Shoots straight up from the tip of the aimer
        return new Projectile(this.x, this.aimerTipY, 6, 20, 'white', finalSpeed);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw the aimer (triangle part)
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(this.x, this.aimerTipY); // Tip
        context.lineTo(this.x - this.width / 2, this.y); // Bottom-left of triangle
        context.lineTo(this.x + this.width / 2, this.y); // Bottom-right of triangle
        context.closePath();
        context.fill();

        // Draw bow (simple arc representing the bow part from image)
        context.strokeStyle = '#8B4513'; // SaddleBrown
        context.lineWidth = 8;
        context.beginPath();
        // Arc below the triangle aimer base
        context.arc(this.x, this.y + 5, this.width / 1.8, Math.PI * 0.1, Math.PI * 0.9);
        context.stroke();
    }
}
