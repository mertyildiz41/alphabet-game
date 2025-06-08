// This file is the entry point of the game. It initializes the game loop and sets up the canvas for rendering the game graphics.
import { Game as AlphabetGame } from './game/index.js';
import { SnakeGame } from './snake-game/index.js';
import { AlphabetArrowGame, AlphabetArrowGameUI } from './alphabet-arrow-game/index.js';
const landingPage = document.getElementById('landing-page');
const alphabetShooterGameBox = document.getElementById('alphabet-shooter-game');
const snakeGameBox = document.getElementById('snake-io-game');
const alphabetArrowGameBox = document.getElementById('alphabet-arrow-game'); // New game box
const alphabetGameContainer = document.getElementById('game-container');
const snakeGameContainer = document.getElementById('snake-game-container');
const alphabetArrowGameContainer = document.getElementById('alphabet-arrow-game-container'); // New game container
if (!landingPage || !alphabetShooterGameBox || !snakeGameBox || !alphabetArrowGameBox || !alphabetGameContainer || !snakeGameContainer || !alphabetArrowGameContainer) {
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
function initializeAlphabetArrowGame() {
    if (!alphabetArrowGameContainer)
        return;
    alphabetArrowGameContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    alphabetArrowGameContainer.appendChild(canvas);
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error("Failed to get 2D context for Alphabet Arrow Game.");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ui = new AlphabetArrowGameUI(context, canvas.width, canvas.height); // UI rendering
    const game = new AlphabetArrowGame(canvas, ui); // Game logic
    // This is a simplified game loop for now. You'll need to integrate `game.update()` 
    // and `ui.render()` properly, likely driven by `requestAnimationFrame` in AlphabetArrowGame.ts
    // For now, let's assume AlphabetArrowGame's startGame will kick off its own loop.
    game.startGame();
    // Example of how rendering might be called if not handled internally by game.startGame()
    // function gameLoop() {
    //     game.update(); // Update game state
    //     ui.render(game.getGameState(), game.getPlayer(), game.getLettersOnScreen(), game.getArrows()); // Render UI
    //     if (game.getGameState().isActive) {
    //         requestAnimationFrame(gameLoop);
    //     }
    // }
    // if (game.getGameState().isActive) requestAnimationFrame(gameLoop);
    // Resize handling (basic)
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // ui.updateCanvasSize(canvas.width, canvas.height); // UI might need to know about resize
        // game.resize(canvas.width, canvas.height); // Game logic might need to know
    });
}
if (alphabetShooterGameBox && landingPage && alphabetGameContainer) {
    alphabetShooterGameBox.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        alphabetGameContainer.classList.remove('hidden');
        if (snakeGameContainer)
            snakeGameContainer.classList.add('hidden');
        if (alphabetArrowGameContainer)
            alphabetArrowGameContainer.classList.add('hidden');
        document.body.style.overflow = 'hidden';
        initializeAlphabetGame();
    });
}
if (snakeGameBox && landingPage && snakeGameContainer) {
    snakeGameBox.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        snakeGameContainer.classList.remove('hidden');
        if (alphabetGameContainer)
            alphabetGameContainer.classList.add('hidden');
        if (alphabetArrowGameContainer)
            alphabetArrowGameContainer.classList.add('hidden');
        document.body.style.overflow = 'hidden';
        initializeSnakeGame();
    });
}
if (alphabetArrowGameBox && landingPage && alphabetArrowGameContainer) {
    alphabetArrowGameBox.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        alphabetArrowGameContainer.classList.remove('hidden');
        if (alphabetGameContainer)
            alphabetGameContainer.classList.add('hidden');
        if (snakeGameContainer)
            snakeGameContainer.classList.add('hidden');
        document.body.style.overflow = 'hidden';
        initializeAlphabetArrowGame();
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
