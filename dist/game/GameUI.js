export class GameUI {
    constructor(assetsLoaded) {
        let loadedCount = 0;
        const totalAssets = 4; // Adjust if more assets
        const onAssetLoad = () => {
            loadedCount++;
            if (loadedCount === totalAssets) {
                assetsLoaded();
            }
        };
        // Placeholder: In a real game, load images and call assetsLoaded upon completion
        // For now, we'll use unicode or draw shapes.
        // Simulating async load for structure
        this.avatarImage = new Image();
        this.avatarImage.onload = onAssetLoad;
        this.avatarImage.onerror = onAssetLoad; // Count errors as "loaded" to not block
        this.avatarImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234CAF50'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Cpath d='M30 60 Q50 75 70 60' stroke='white' stroke-width='5' fill='none'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='30' fill='white' text-anchor='middle' dominant-baseline='middle'%3ET%3C/text%3E%3C/svg%3E"; // Simple green circle with T
        this.starImage = new Image();
        this.starImage.onload = onAssetLoad;
        this.starImage.onerror = onAssetLoad;
        this.starImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E";
        this.heartImage = new Image();
        this.heartImage.onload = onAssetLoad;
        this.heartImage.onerror = onAssetLoad;
        this.heartImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='red'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E";
        this.bowImage = new Image();
        this.bowImage.onload = onAssetLoad;
        this.bowImage.onerror = onAssetLoad;
        this.bowImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D2691E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s-8-4.5-8-10S12 2 12 2s8 4.5 8 10-8 10-8 10zM2 12h20M12 2v20'/%3E%3C/svg%3E"; // Simple bow shape
        // Fallback if images are not used or fail to load quickly
        setTimeout(assetsLoaded, 100); // Ensure it eventually calls back
    }
    draw(context, gameState, canvasWidth, canvasHeight) {
        const uiMargin = 20;
        const iconSize = 30;
        // Player Avatar (Top-Left)
        if (this.avatarImage && this.avatarImage.complete && this.avatarImage.naturalHeight !== 0) {
            context.drawImage(this.avatarImage, uiMargin, uiMargin, iconSize * 1.5, iconSize * 1.5);
        }
        else { // Fallback drawing
            context.fillStyle = '#4CAF50';
            context.beginPath();
            context.arc(uiMargin + iconSize * 0.75, uiMargin + iconSize * 0.75, iconSize * 0.75, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = 'white';
            context.font = 'bold 20px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText("P", uiMargin + iconSize * 0.75, uiMargin + iconSize * 0.75);
        }
        // Coins (Star icon - Top-Right) - Changed from Score to Coins
        const coinsX = canvasWidth - uiMargin;
        const coinsText = gameState.coins.toString();
        const textWidth = context.measureText(coinsText).width;
        if (this.starImage && this.starImage.complete && this.starImage.naturalHeight !== 0) {
            context.drawImage(this.starImage, coinsX - iconSize - 5 - textWidth, uiMargin, iconSize, iconSize);
        }
        else {
            context.fillStyle = 'gold'; // Fallback for star/coin icon
            context.font = 'bold 24px Arial'; // Ensure font is set for fallback text icon
            context.textAlign = 'right'; // Align icon text to the right of its position
            context.fillText("★", coinsX - textWidth - 5, uiMargin + iconSize / 1.5);
        }
        context.fillStyle = 'white';
        context.font = 'bold 24px Arial';
        context.textAlign = 'right';
        context.fillText(coinsText, coinsX, uiMargin + iconSize / 1.5);
        // Bow icon (Right side, below coins)
        const bowIconY = uiMargin + iconSize + 15;
        if (this.bowImage && this.bowImage.complete && this.bowImage.naturalHeight !== 0) {
            context.drawImage(this.bowImage, canvasWidth - uiMargin - iconSize, bowIconY, iconSize, iconSize);
        }
        else {
            context.strokeStyle = '#D2691E';
            context.lineWidth = 2;
            context.strokeRect(canvasWidth - uiMargin - iconSize, bowIconY, iconSize, iconSize);
            context.fillText("B", canvasWidth - uiMargin - iconSize / 2, bowIconY + iconSize / 2);
        }
        // Lives (Hearts - Right side, below bow)
        const livesY = bowIconY + iconSize + 15;
        for (let i = 0; i < gameState.lives; i++) {
            const heartX = canvasWidth - uiMargin - iconSize + (i * -(iconSize + 5));
            if (this.heartImage && this.heartImage.complete && this.heartImage.naturalHeight !== 0) {
                context.drawImage(this.heartImage, heartX, livesY, iconSize, iconSize);
            }
            else {
                context.fillStyle = 'red';
                context.font = 'bold 24px Arial'; // Ensure font is set for fallback text icon
                context.textAlign = 'center'; // Center fallback text icon
                context.fillText("♥", heartX + iconSize / 2, livesY + iconSize / 1.5);
            }
        }
        if (gameState.isGameOver) {
            context.fillStyle = 'rgba(0, 0, 0, 0.75)';
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.fillStyle = 'white';
            context.font = 'bold 48px Arial';
            context.textAlign = 'center';
            context.fillText('Game Over', canvasWidth / 2, canvasHeight / 2 - 60);
            context.font = '24px Arial';
            // Changed from Final Score to Final Coins
            context.fillText(`Final Coins: ${gameState.coins}`, canvasWidth / 2, canvasHeight / 2);
            context.font = '20px Arial';
            context.fillText('Click to Return to Gallery', canvasWidth / 2, canvasHeight / 2 + 60);
        }
    }
}
