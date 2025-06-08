// This file is the entry point of the game. It initializes the game loop and sets up the canvas for rendering the game graphics.
import { Game } from './game/index.js';
const landingPage = document.getElementById('landing-page');
const alphabetShooterGameBox = document.getElementById('alphabet-shooter-game'); // Changed from startGameButton
const gameContainer = document.getElementById('game-container');
// Adjusted the condition to check for the new element ID
if (!landingPage || !alphabetShooterGameBox || !gameContainer) {
    throw new Error('Failed to find landing page or game elements.');
}
function initializeGame() {
    if (!gameContainer)
        return;
    const canvas = document.createElement('canvas');
    gameContainer.appendChild(canvas); // Append canvas to the game container
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("Failed to get 2D rendering context for the game canvas.");
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const game = new Game(canvas, context);
    window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
    });
    game.start();
}
// Attach event listener to the game box instead of a button
alphabetShooterGameBox.addEventListener('click', () => {
    if (landingPage && gameContainer) {
        landingPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        // Ensure body overflow is hidden when game is active for proper canvas display
        document.body.style.overflow = 'hidden';
        initializeGame();
    }
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}
