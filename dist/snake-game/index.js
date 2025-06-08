// src/snake-game/index.ts
import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { SnakeGameUI } from './SnakeGameUI.js';
const GRID_SIZE = 20; // Size of each grid cell in pixels
const GAME_SPEED = 150; // Milliseconds per game tick (snake movement)
export class SnakeGame {
    constructor(canvas, context) {
        this.isMouseActive = false;
        this.isTouchActive = false;
        this.POINTER_CHANGE_THRESHOLD = GRID_SIZE / 3; // Sensitivity for pointer direction change
        this.canvas = canvas;
        this.context = context;
        this.canvasWidthInGrids = Math.floor(this.canvas.width / GRID_SIZE);
        this.canvasHeightInGrids = Math.floor(this.canvas.height / GRID_SIZE);
        const initialSnakePos = {
            x: Math.floor(this.canvasWidthInGrids / 2),
            y: Math.floor(this.canvasHeightInGrids / 2),
        };
        this.snake = new Snake(initialSnakePos, GRID_SIZE);
        this.food = new Food(GRID_SIZE, this.canvasWidthInGrids, this.canvasHeightInGrids);
        this.food.respawn(this.snake.segments); // Ensure food doesn't spawn on snake
        this.gameState = this.getInitialGameState();
        this.gameUI = new SnakeGameUI(() => this.restartGame());
        this.setupInputHandlers();
    }
    getInitialGameState() {
        return {
            score: 0,
            isGameOver: false,
            direction: 'RIGHT',
            snakeSegments: this.snake.segments,
            foodPosition: this.food.position, // Reference, will be updated by Food class
        };
    }
    setupInputHandlers() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (this.gameState.isGameOver)
                return;
            this.handleKeyInput(e.key);
        });
        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.gameState.isGameOver)
                return;
            // Only react to primary mouse button (usually left)
            if (e.button === 0) {
                this.isMouseActive = true;
                this.updateDirectionFromPointer(e.clientX, e.clientY);
                e.preventDefault();
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseActive && !this.gameState.isGameOver) {
                this.updateDirectionFromPointer(e.clientX, e.clientY);
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Only react to primary mouse button
                this.isMouseActive = false;
            }
        });
        this.canvas.addEventListener('mouseleave', (e) => {
            this.isMouseActive = false;
        });
        // Click for Game Over navigation
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState.isGameOver) {
                this.returnToGallery();
            }
            // Movement logic removed from here
        });
        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.gameState.isGameOver)
                return;
            e.preventDefault();
            this.isTouchActive = true;
            const touch = e.touches[0];
            this.updateDirectionFromPointer(touch.clientX, touch.clientY);
        }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isTouchActive && !this.gameState.isGameOver) {
                e.preventDefault();
                const touch = e.touches[0];
                this.updateDirectionFromPointer(touch.clientX, touch.clientY);
            }
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            this.isTouchActive = false;
        });
        this.canvas.addEventListener('touchcancel', (e) => {
            this.isTouchActive = false;
        });
    }
    returnToGallery() {
        const landingPage = document.getElementById('landing-page');
        const gameContainer = document.getElementById('snake-game-container');
        if (landingPage && gameContainer) {
            gameContainer.classList.add('hidden');
            landingPage.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            window.location.reload();
        }
    }
    handleKeyInput(key) {
        const currentDirection = this.gameState.direction;
        switch (key) {
            case 'ArrowUp':
                if (currentDirection !== 'DOWN')
                    this.gameState.direction = 'UP';
                break;
            case 'ArrowDown':
                if (currentDirection !== 'UP')
                    this.gameState.direction = 'DOWN';
                break;
            case 'ArrowLeft':
                if (currentDirection !== 'RIGHT')
                    this.gameState.direction = 'LEFT';
                break;
            case 'ArrowRight':
                if (currentDirection !== 'LEFT')
                    this.gameState.direction = 'RIGHT';
                break;
        }
    }
    updateDirectionFromPointer(clientX, clientY) {
        if (this.gameState.isGameOver || !this.snake.segments.length)
            return;
        const rect = this.canvas.getBoundingClientRect();
        const pointerCanvasX = clientX - rect.left;
        const pointerCanvasY = clientY - rect.top;
        const headPixelX = this.snake.segments[0].x * GRID_SIZE + GRID_SIZE / 2;
        const headPixelY = this.snake.segments[0].y * GRID_SIZE + GRID_SIZE / 2;
        const deltaX = pointerCanvasX - headPixelX;
        const deltaY = pointerCanvasY - headPixelY;
        const currentDirection = this.gameState.direction;
        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal movement preferred
            if (deltaX > this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'LEFT') {
                this.gameState.direction = 'RIGHT';
            }
            else if (deltaX < -this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'RIGHT') {
                this.gameState.direction = 'LEFT';
            }
        }
        else if (Math.abs(deltaY) > Math.abs(deltaX)) { // Vertical movement preferred
            if (deltaY > this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'UP') {
                this.gameState.direction = 'DOWN';
            }
            else if (deltaY < -this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'DOWN') {
                this.gameState.direction = 'UP';
            }
        }
        // If pointer is within threshold or on a perfect diagonal, direction might not change immediately.
    }
    update() {
        if (this.gameState.isGameOver)
            return;
        const head = this.snake.move(this.gameState.direction);
        // Check for collision with food
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.gameState.score++;
            this.snake.move(this.gameState.direction, true); // Grow snake
            this.food.respawn(this.snake.segments);
            this.gameState.foodPosition = this.food.position;
        }
        else {
            // Check for collision with walls or self if no food eaten
            if (this.snake.checkCollision(this.canvasWidthInGrids, this.canvasHeightInGrids)) {
                this.gameState.isGameOver = true;
            }
        }
        this.gameState.snakeSegments = this.snake.segments;
    }
    render() {
        // Clear canvas with a background color
        this.context.fillStyle = '#2C3E50'; // Dark blue-gray background
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw grid (optional, for visual debugging or style)
        // this.drawGrid();
        this.snake.draw(this.context);
        this.food.draw(this.context);
        this.gameUI.draw(this.context, this.gameState, this.canvas.width, this.canvas.height);
    }
    drawGrid() {
        this.context.strokeStyle = '#34495E'; // Slightly lighter grid lines
        for (let x = 0; x < this.canvasWidthInGrids; x++) {
            for (let y = 0; y < this.canvasHeightInGrids; y++) {
                this.context.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }
    gameLoop() {
        this.update();
        this.render();
        if (!this.gameState.isGameOver) {
            this.gameLoopTimeout = window.setTimeout(() => this.gameLoop(), GAME_SPEED);
        }
    }
    start() {
        this.gameState = this.getInitialGameState(); // Reset state before starting
        this.snake = new Snake({ x: Math.floor(this.canvasWidthInGrids / 2), y: Math.floor(this.canvasHeightInGrids / 2) }, GRID_SIZE);
        this.food.respawn(this.snake.segments);
        this.gameState.snakeSegments = this.snake.segments;
        this.gameState.foodPosition = this.food.position;
        this.gameState.direction = 'RIGHT';
        if (this.gameLoopTimeout)
            clearTimeout(this.gameLoopTimeout);
        this.gameLoop();
    }
    restartGame() {
        this.start();
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasWidthInGrids = Math.floor(this.canvas.width / GRID_SIZE);
        this.canvasHeightInGrids = Math.floor(this.canvas.height / GRID_SIZE);
        // Potentially reset game or adjust positions if canvas size changes significantly
        this.restartGame();
    }
}
