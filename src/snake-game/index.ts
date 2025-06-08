// src/snake-game/index.ts
import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { SnakeGameState, Position } from './snake-types.js';
import { SnakeGameUI } from './SnakeGameUI.js';

const GRID_SIZE = 20; // Size of each grid cell in pixels
const GAME_SPEED = 150; // Milliseconds per game tick (snake movement)

export class SnakeGame {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private snake: Snake;
    private food: Food;
    private gameState: SnakeGameState;
    private gameUI: SnakeGameUI;
    private gameLoopTimeout?: number;
    private canvasWidthInGrids: number;
    private canvasHeightInGrids: number;
    private isMouseActive: boolean = false;
    private isTouchActive: boolean = false;
    private readonly POINTER_CHANGE_THRESHOLD = GRID_SIZE / 3; // Sensitivity for pointer direction change

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.canvasWidthInGrids = Math.floor(this.canvas.width / GRID_SIZE);
        this.canvasHeightInGrids = Math.floor(this.canvas.height / GRID_SIZE);

        const initialSnakePos: Position = {
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

    private getInitialGameState(): SnakeGameState {
        return {
            score: 0,
            isGameOver: false,
            direction: 'RIGHT',
            snakeSegments: this.snake.segments, // Reference, will be updated by Snake class
            foodPosition: this.food.position, // Reference, will be updated by Food class
        };
    }

    private setupInputHandlers(): void {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (this.gameState.isGameOver) return;
            this.handleKeyInput(e.key);
        });

        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.gameState.isGameOver) return;
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
            if (this.gameState.isGameOver) return;
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

    private returnToGallery(): void {
        const landingPage = document.getElementById('landing-page');
        const gameContainer = document.getElementById('snake-game-container');
        if (landingPage && gameContainer) {
            gameContainer.classList.add('hidden');
            landingPage.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            window.location.reload();
        }
    }

    private handleKeyInput(key: string): void {
        const currentDirection = this.gameState.direction;
        switch (key) {
            case 'ArrowUp':
                if (currentDirection !== 'DOWN') this.gameState.direction = 'UP';
                break;
            case 'ArrowDown':
                if (currentDirection !== 'UP') this.gameState.direction = 'DOWN';
                break;
            case 'ArrowLeft':
                if (currentDirection !== 'RIGHT') this.gameState.direction = 'LEFT';
                break;
            case 'ArrowRight':
                if (currentDirection !== 'LEFT') this.gameState.direction = 'RIGHT';
                break;
        }
    }

    private updateDirectionFromPointer(clientX: number, clientY: number): void {
        if (this.gameState.isGameOver || !this.snake.segments.length) return;

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
            } else if (deltaX < -this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'RIGHT') {
                this.gameState.direction = 'LEFT';
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX)) { // Vertical movement preferred
            if (deltaY > this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'UP') {
                this.gameState.direction = 'DOWN';
            } else if (deltaY < -this.POINTER_CHANGE_THRESHOLD && currentDirection !== 'DOWN') {
                this.gameState.direction = 'UP';
            }
        }
        // If pointer is within threshold or on a perfect diagonal, direction might not change immediately.
    }

    private update(): void {
        if (this.gameState.isGameOver) return;

        const head = this.snake.move(this.gameState.direction);

        // Check for collision with food
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.gameState.score++;
            this.snake.move(this.gameState.direction, true); // Grow snake
            this.food.respawn(this.snake.segments);
            this.gameState.foodPosition = this.food.position;
        } else {
            // Check for collision with walls or self if no food eaten
            if (this.snake.checkCollision(this.canvasWidthInGrids, this.canvasHeightInGrids)) {
                this.gameState.isGameOver = true;
            }
        }
        this.gameState.snakeSegments = this.snake.segments;
    }

    private render(): void {
        // Clear canvas with a background color
        this.context.fillStyle = '#2C3E50'; // Dark blue-gray background
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (optional, for visual debugging or style)
        // this.drawGrid();

        this.snake.draw(this.context);
        this.food.draw(this.context);
        this.gameUI.draw(this.context, this.gameState, this.canvas.width, this.canvas.height);
    }

    private drawGrid(): void {
        this.context.strokeStyle = '#34495E'; // Slightly lighter grid lines
        for (let x = 0; x < this.canvasWidthInGrids; x++) {
            for (let y = 0; y < this.canvasHeightInGrids; y++) {
                this.context.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    public gameLoop(): void {
        this.update();
        this.render();

        if (!this.gameState.isGameOver) {
            this.gameLoopTimeout = window.setTimeout(() => this.gameLoop(), GAME_SPEED);
        }
    }

    public start(): void {
        this.gameState = this.getInitialGameState(); // Reset state before starting
        this.snake = new Snake({ x: Math.floor(this.canvasWidthInGrids / 2), y: Math.floor(this.canvasHeightInGrids / 2) }, GRID_SIZE);
        this.food.respawn(this.snake.segments);
        this.gameState.snakeSegments = this.snake.segments;
        this.gameState.foodPosition = this.food.position;
        this.gameState.direction = 'RIGHT';

        if (this.gameLoopTimeout) clearTimeout(this.gameLoopTimeout);
        this.gameLoop();
    }

    public restartGame(): void {
        this.start();
    }

    public resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasWidthInGrids = Math.floor(this.canvas.width / GRID_SIZE);
        this.canvasHeightInGrids = Math.floor(this.canvas.height / GRID_SIZE);
        // Potentially reset game or adjust positions if canvas size changes significantly
        this.restartGame(); 
    }
}
