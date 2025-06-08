// src/snake-game/SnakeGameUI.ts
import { SnakeGameState } from './snake-types.js';

export class SnakeGameUI {
    private scoreElement: HTMLElement | null = null;
    private gameOverElement: HTMLElement | null = null;
    private finalScoreElement: HTMLElement | null = null;
    private restartButton: HTMLElement | null = null;

    constructor(onRestart: () => void) {
        // These elements would ideally be part of the HTML structure for the Snake game page/modal
        // For now, we'll assume they might be dynamically added or exist in a specific container.
        // This is a simplified UI handler.
    }

    public draw(context: CanvasRenderingContext2D, gameState: SnakeGameState, canvasWidth: number, canvasHeight: number) {
        // Score display (simple text on canvas)
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'left';
        context.fillText(`Score: ${gameState.score}`, 10, 25);

        if (gameState.isGameOver) {
            context.fillStyle = 'rgba(0, 0, 0, 0.75)';
            context.fillRect(0, 0, canvasWidth, canvasHeight);

            context.fillStyle = 'white';
            context.font = 'bold 48px Arial';
            context.textAlign = 'center';
            context.fillText('Game Over', canvasWidth / 2, canvasHeight / 2 - 40);

            context.font = '24px Arial';
            context.fillText(`Final Score: ${gameState.score}`, canvasWidth / 2, canvasHeight / 2);

            context.font = '20px Arial';
            context.fillText('Click to Return to Gallery', canvasWidth / 2, canvasHeight / 2 + 40);
        }
    }

    // Methods to update HTML elements if they were used (e.g., for a more complex UI)
    public updateScore(score: number) {
        if (this.scoreElement) {
            this.scoreElement.textContent = `Score: ${score}`;
        }
    }

    public showGameOver(finalScore: number) {
        if (this.gameOverElement && this.finalScoreElement) {
            this.finalScoreElement.textContent = finalScore.toString();
            this.gameOverElement.style.display = 'flex';
        }
    }

    public hideGameOver() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = 'none';
        }
    }
}
