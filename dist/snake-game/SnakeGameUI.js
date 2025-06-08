export class SnakeGameUI {
    constructor(onRestart) {
        this.scoreElement = null;
        this.gameOverElement = null;
        this.finalScoreElement = null;
        this.restartButton = null;
        // These elements would ideally be part of the HTML structure for the Snake game page/modal
        // For now, we'll assume they might be dynamically added or exist in a specific container.
        // This is a simplified UI handler.
    }
    draw(context, gameState, canvasWidth, canvasHeight) {
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
    updateScore(score) {
        if (this.scoreElement) {
            this.scoreElement.textContent = `Score: ${score}`;
        }
    }
    showGameOver(finalScore) {
        if (this.gameOverElement && this.finalScoreElement) {
            this.finalScoreElement.textContent = finalScore.toString();
            this.gameOverElement.style.display = 'flex';
        }
    }
    hideGameOver() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = 'none';
        }
    }
}
