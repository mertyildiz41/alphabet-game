export class AlphabetArrowGameUI {
    // Assets or image elements for player, letters, background etc. can be loaded here
    // private playerImage: HTMLImageElement;
    // private arrowImage: HTMLImageElement;
    // private letterImages: { [key: string]: HTMLImageElement } = {};
    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // this.loadAssets();
    }
    // private async loadAssets() {
    // Load images for letters, player, arrow, background etc.
    // Example:
    // this.playerImage = await this.loadImage('path/to/player_avatar.png');
    // this.arrowImage = await this.loadImage('path/to/arrow.png');
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(async char => {
    //     this.letterImages[char] = await this.loadImage(`path/to/letter_${char}.png`);
    // });
    // }
    // private loadImage(src: string): Promise<HTMLImageElement> {
    //     return new Promise((resolve, reject) => {
    //         const img = new Image();
    //         img.onload = () => resolve(img);
    //         img.onerror = reject;
    //         img.src = src;
    //     });
    // }
    render(gameState, player, letters, arrows) {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (!gameState.isActive && gameState.lives <= 0) {
            this.showGameOver(gameState.score);
        }
        else if (!gameState.isActive && gameState.currentLevelLetter === 'Z' && letters.length === 0) { // A simple win condition check, assuming Z is the last letter and it's cleared
            // This win condition might need to be more robust, e.g. checking currentLevelIndex against alphabet.length
            this.showWinScreen(gameState.score);
        }
        else {
            // Draw background
            this.drawBackground();
            // Draw player
            this.drawPlayer(player);
            // Draw letters
            letters.forEach(letter => this.drawLetter(letter));
            // Draw arrows
            arrows.forEach(arrow => this.drawArrow(arrow));
            // Draw UI elements
            this.drawHUD(gameState);
        }
    }
    drawBackground() {
        // Placeholder for background drawing
        this.context.fillStyle = '#87CEEB'; // Sky blue
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        // Simple road
        this.context.fillStyle = '#666'; // Dark grey for road
        this.context.fillRect(0, this.canvasHeight * 0.7, this.canvasWidth, this.canvasHeight * 0.3);
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 5;
        this.context.setLineDash([20, 25]); // Dashed lines for road markings
        this.context.beginPath();
        this.context.moveTo(this.canvasWidth / 2, this.canvasHeight * 0.7);
        this.context.lineTo(this.canvasWidth / 2, this.canvasHeight);
        this.context.stroke();
        this.context.setLineDash([]); // Reset line dash
    }
    // }
    drawPlayer(player) {
        // Draw the aimer (triangle part) - using player's own draw method
        player.draw(this.context);
    }
    drawLetter(letterObj) {
        // Placeholder - draw letter
        this.context.fillStyle = letterObj.isTarget ? 'red' : 'blue'; // Different color for target
        this.context.font = '48px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText(letterObj.letter, letterObj.position.x, letterObj.position.y);
    }
    drawArrow(arrow) {
        // Placeholder - draw arrow
        this.context.fillStyle = 'black';
        // arrow.x, arrow.y is the tip. Draw rectangle extending back from tip.
        this.context.fillRect(arrow.x - arrow.width / 2, arrow.y, arrow.width, arrow.height);
    }
    drawHUD(gameState) {
        this.context.fillStyle = 'black';
        this.context.font = '24px sans-serif';
        this.context.textAlign = 'left';
        // Target Letter and Progress (like screenshot)
        this.context.fillText(`Target: ${gameState.currentLevelLetter}`, 20, 40);
        // Simple progress bar
        const barWidth = 100;
        const barHeight = 20;
        // const progress = (this.alphabet.indexOf(gameState.currentLevelLetter) + 1) / this.alphabet.length; // Placeholder
        this.context.strokeStyle = 'black';
        this.context.strokeRect(130, 20, barWidth, barHeight);
        this.context.fillStyle = 'red';
        this.context.fillRect(130, 20, barWidth * gameState.levelProgress, barHeight);
        // Score (star icon + score)
        this.context.fillText(`⭐ Score: ${gameState.score}`, 20, 70);
        // Lives (heart icons)
        let hearts = '';
        for (let i = 0; i < gameState.lives; i++) {
            hearts += '❤️';
        }
        this.context.fillText(hearts, this.canvasWidth - 100, 40);
        // Bow and Arrow icon (like screenshot, static for now)
        this.context.fillText('🏹', this.canvasWidth - 50, 70);
    }
    showGameOver(score) {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'white';
        this.context.font = '48px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('Game Over!', this.canvasWidth / 2, this.canvasHeight / 2 - 70);
        this.context.font = '24px sans-serif';
        this.context.fillText(`Final Score: ${score}`, this.canvasWidth / 2, this.canvasHeight / 2 - 20);
        this.context.fillText('Press R to Restart', this.canvasWidth / 2, this.canvasHeight / 2 + 30);
        this.context.fillText('Press Esc to Return to Gallery', this.canvasWidth / 2, this.canvasHeight / 2 + 70);
    }
    showWinScreen(score) {
        this.context.fillStyle = 'rgba(0, 128, 0, 0.7)'; // Greenish overlay
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = 'white';
        this.context.font = '48px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('You Win!', this.canvasWidth / 2, this.canvasHeight / 2 - 70);
        this.context.font = '24px sans-serif';
        this.context.fillText(`Final Score: ${score}`, this.canvasWidth / 2, this.canvasHeight / 2 - 20);
        this.context.fillText('Press Esc to Return to Gallery', this.canvasWidth / 2, this.canvasHeight / 2 + 30);
    }
}
