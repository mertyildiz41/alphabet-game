// This file is the entry point of the game. It initializes the game loop and sets up the canvas for rendering the game graphics.
import { Game as AlphabetGame } from './game/index.js';
import { SnakeGame } from './snake-game/index.js';
const landingPage = document.getElementById('landing-page');
const alphabetShooterGameBox = document.getElementById('alphabet-shooter-game');
const snakeGameBox = document.getElementById('snake-io-game');
const alphabetGameContainer = document.getElementById('game-container');
const snakeGameContainer = document.getElementById('snake-game-container');
if (!landingPage || !alphabetShooterGameBox || !snakeGameBox || !alphabetGameContainer || !snakeGameContainer) {
    console.error('Failed to find one or more essential page elements for game selection or initialization.');
    // Depending on the desired behavior, you might throw an error or just log it.
    // For now, we log it and let the script continue, listeners might not attach properly.
}
function initializeAlphabetGame() {
    if (!alphabetGameContainer)
        return;
    // Clear previous canvas if any
    alphabetGameContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    alphabetGameContainer.appendChild(canvas);
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error("Failed to get 2D context for Alphabet Shooter.");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const game = new AlphabetGame(canvas, context);
    window.addEventListener('resize', () => game.resize(window.innerWidth, window.innerHeight));
    game.start();
}
function initializeSnakeGame() {
    if (!snakeGameContainer)
        return;
    // Clear previous canvas if any
    snakeGameContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    snakeGameContainer.appendChild(canvas);
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error("Failed to get 2D context for Snake Game.");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const game = new SnakeGame(canvas, context);
    window.addEventListener('resize', () => game.resize(window.innerWidth, window.innerHeight));
    game.start();
}
if (alphabetShooterGameBox && landingPage && alphabetGameContainer) {
    alphabetShooterGameBox.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        alphabetGameContainer.classList.remove('hidden');
        if (snakeGameContainer)
            snakeGameContainer.classList.add('hidden'); // Hide other game container
        document.body.style.overflow = 'hidden';
        initializeAlphabetGame();
    });
}
if (snakeGameBox && landingPage && snakeGameContainer) {
    snakeGameBox.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        snakeGameContainer.classList.remove('hidden');
        if (alphabetGameContainer)
            alphabetGameContainer.classList.add('hidden'); // Hide other game container
        document.body.style.overflow = 'hidden';
        initializeSnakeGame();
    });
}
// Keep service worker logic if it was there
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}
