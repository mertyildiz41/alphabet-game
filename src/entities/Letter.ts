// src/entities/Letter.ts
import { GameLetter, GameObject } from '../types/index.js';

export class Letter implements GameObject, GameLetter {
    value: string;
    x: number;
    y: number;
    color: string;
    size: number;
    speed: number;
    isHit: boolean = false;
    isActive: boolean = true; // To manage if it's in play

    constructor(value: string, x: number, y: number, color: string, size: number, speed: number) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speed = speed;
    }

    update(deltaTime: number, canvasWidth?: number, canvasHeight?: number) {
        if (!this.isActive) return;
        this.y += this.speed * (deltaTime / 16.67); // Normalize speed (assuming ~60fps target)
        
        // Mark for removal if it goes off screen (below canvas)
        if (canvasHeight && this.y - this.size / 2 > canvasHeight) {
            this.isActive = false;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (!this.isActive && !this.isHit) return; // Don't draw if inactive and not just hit
        if (!this.isActive && this.isHit) { // If hit and now inactive (fading out)
             // Potentially reduce opacity or size over time before full removal
        }


        context.fillStyle = this.isHit ? 'rgba(128, 128, 128, 0.5)' : this.color; // Gray out and slightly transparent if hit
        context.font = `bold ${this.size}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle'; // Vertically center the text
        context.fillText(this.value, this.x, this.y);

        // Simple 3D effect by drawing a shadow offset
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.fillText(this.value, this.x + this.size * 0.03, this.y + this.size * 0.03);
    }
}
