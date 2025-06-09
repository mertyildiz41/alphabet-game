// src/alphabet-arrow-game/AlphabetArrowGame.ts
import { Player } from '../entities/Player.js';
import { Projectile } from '../entities/Projectile.js';
import { GameState, LetterDrop } from './types.js';
import { AlphabetArrowGameUI } from './AlphabetArrowGameUI.js';

export class AlphabetArrowGame {
    private gameState: GameState;
    private player: Player;
    private lettersOnScreen: LetterDrop[];
    private arrows: Projectile[];
    private canvas: HTMLCanvasElement;
    private ui: AlphabetArrowGameUI;

    private alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    private currentLevelIndex: number = 0;
    private lastFrameTime: number = 0;
    private isMouseDown: boolean = false;
    private mouseDownTime: number = 0;
    private readonly MIN_LETTER_SPACING: number = 50; // Min horizontal pixels between letters

    constructor(canvas: HTMLCanvasElement, ui: AlphabetArrowGameUI) {
        this.canvas = canvas;
        this.ui = ui;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const roadHeight = canvasHeight * 0.3;

        this.player = new Player(canvasWidth, canvasHeight, roadHeight);
        this.lettersOnScreen = [];
        this.arrows = [];
        this.gameState = {
            currentLevelLetter: this.alphabet[this.currentLevelIndex],
            score: 0,
            lives: 3,
            isActive: false,
            levelProgress: (this.currentLevelIndex + 1) / this.alphabet.length,
            isWin: false // Initialize isWin
        };
        this.keydownHandler = () => {}; // Initialize with a no-op function
        this.init();
    }

    private keydownHandler: (event: KeyboardEvent) => void;

    private init() {
        console.log(`Alphabet Arrow Game initialized. Target: ${this.gameState.currentLevelLetter}`);
        this.canvas.addEventListener('mousemove', (event) => {
            if (!this.gameState.isActive) return;
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            this.player.updateAimerPosition(mouseX);
        });

        this.canvas.addEventListener('mousedown', () => {
            if (!this.gameState.isActive) return;
            this.isMouseDown = true;
            this.mouseDownTime = performance.now();
        });

        this.canvas.addEventListener('mouseup', () => {
            if (!this.gameState.isActive || !this.isMouseDown) return;
            this.isMouseDown = false;
            const holdDuration = performance.now() - this.mouseDownTime;
            // Increase speed multiplier for longer holds, e.g., up to 2x speed for a 1-second hold
            const speedMultiplier = Math.min(1 + (holdDuration / 1000), 2); 
            this.handlePlayerShoot(speedMultiplier);
        });

        // Replace previous click listener if any, or ensure this is the primary shoot trigger
        // this.canvas.addEventListener('click', () => { ... }); // Remove old click listener if it only called publicShoot without multiplier

        // Add keydown listener for restart or returning to gallery
        // Store the handler so it can be removed later if necessary
        this.keydownHandler = (event: KeyboardEvent) => {
            if (!this.gameState.isActive) { // Only listen if game is over or won
                if (event.key === 'r' || event.key === 'R') {
                    this.removeKeydownListener(); // Clean up listener before restarting
                    this.startGame(); // Restart the game
                } else if (event.key === 'Escape') {
                    this.removeKeydownListener(); // Clean up listener before navigating
                    // Logic to return to gallery
                    console.log('Returning to gallery...');
                    window.location.reload(); // Reload the page to go back to the gallery
                }
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
    }

    private removeKeydownListener() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }

    startGame() {
        this.gameState.isActive = true;
        this.currentLevelIndex = 0;
        this.gameState.currentLevelLetter = this.alphabet[this.currentLevelIndex];
        this.gameState.score = 0;
        this.gameState.lives = 3;
        this.gameState.levelProgress = (this.currentLevelIndex + 1) / this.alphabet.length;
        this.gameState.isWin = false; // Reset win state
        this.lettersOnScreen = [];
        this.arrows = [];
        this.spawnLetters();
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    private spawnLetters() {
        this.lettersOnScreen = [];
        const targetLetter = this.gameState.currentLevelLetter;
        const lettersToSpawnDetails: { letter: string, isTarget: boolean }[] = [];

        lettersToSpawnDetails.push({ letter: targetLetter, isTarget: true });

        const distractorCount = 2;
        const availableLetters = this.alphabet.filter(l => l !== targetLetter);
        for (let i = 0; i < distractorCount; i++) {
            if (availableLetters.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableLetters.length);
            const distractor = availableLetters.splice(randomIndex, 1)[0];
            lettersToSpawnDetails.push({ letter: distractor, isTarget: false });
        }

        // Shuffle to randomize order before assigning positions
        for (let i = lettersToSpawnDetails.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lettersToSpawnDetails[i], lettersToSpawnDetails[j]] = [lettersToSpawnDetails[j], lettersToSpawnDetails[i]];
        }
        
        const occupiedXPositions: number[] = [];
        const letterVisualWidth = 30; // Approximate visual width of a letter for spacing
        // Ensure letters don't spawn off-screen if canvas is too narrow
        const actualSpawnableWidth = Math.max(0, this.canvas.width - letterVisualWidth);


        lettersToSpawnDetails.forEach(detail => {
            // Initialize newXPosition within the valid spawnable width
            let newXPosition: number = Math.random() * actualSpawnableWidth;
            let positionOK = false;
            let attempts = 0;
            
            // Try to find a non-overlapping position
            while(!positionOK && attempts < 20) { 
                const potentialX = Math.random() * actualSpawnableWidth;
                let currentPositionOK = true; 
                for(const occupiedX of occupiedXPositions) {
                    if (Math.abs(potentialX - occupiedX) < this.MIN_LETTER_SPACING) {
                        currentPositionOK = false;
                        break;
                    }
                }
                if (currentPositionOK) {
                    newXPosition = potentialX;
                    positionOK = true; // Mark that a suitable position was found
                }
                attempts++;
            }
            // If loop finishes and positionOK is still false, newXPosition retains its initial random value.

            occupiedXPositions.push(newXPosition); // newXPosition is guaranteed to be a number

            this.lettersOnScreen.push({
                letter: detail.letter,
                isTarget: detail.isTarget,
                position: { x: newXPosition, y: Math.random() * 50 + 20 }, // newXPosition is a number
                speed: 0.5 + Math.random() * 0.5
            });
        });
    }

    private handlePlayerShoot(speedMultiplier: number = 1) { // Accept speed multiplier
        if (!this.gameState.isActive) return;
        const newArrow = this.player.shoot(speedMultiplier); // Pass multiplier to player
        if (newArrow) {
            this.arrows.push(newArrow);
        }
    }

    private update(deltaTime: number) {
        if (!this.gameState.isActive) return;

        this.lettersOnScreen.forEach(letter => {
            letter.position.y += letter.speed * (deltaTime / 10); // Adjust speed scaling
        });

        this.arrows.forEach(arrow => {
            arrow.update(deltaTime);
        });
        this.arrows = this.arrows.filter(arrow => arrow.isActive);

        this.arrows.forEach((arrow, arrowIndex) => {
            this.lettersOnScreen.forEach((letter, letterIndex) => {
                const letterWidth = 30; // Approximate visual/collision width of a letter
                const letterHeight = 30; // Approximate visual/collision height of a letter
                if (
                    arrow.x - arrow.width / 2 < letter.position.x + letterWidth &&
                    arrow.x + arrow.width / 2 > letter.position.x &&
                    arrow.y - arrow.height < letter.position.y + letterHeight && // arrow.y is tip, height extends downwards
                    arrow.y > letter.position.y // arrow.y is tip
                ) {
                    if (letter.isTarget) {
                        this.gameState.score += 10;
                        this.nextLevel();
                    } else {
                        this.gameState.lives -= 1;
                        if (this.gameState.lives <= 0) {
                            this.gameOver();
                        }
                    }
                    this.arrows.splice(arrowIndex, 1);
                    this.lettersOnScreen.splice(letterIndex, 1);
                    if (this.lettersOnScreen.filter(l => l.isTarget).length === 0 && this.gameState.isActive) {
                        this.spawnLetters(); // Spawn new set if target was hit and cleared
                    }
                    return;
                }
            });
        });

        this.lettersOnScreen.forEach((letter, index) => {
            if (letter.position.y > this.canvas.height + 20) {
                if (letter.isTarget) {
                    this.gameState.lives -=1;
                    if (this.gameState.lives <= 0) {
                        this.gameOver();
                    } else {
                        this.lettersOnScreen.splice(index, 1);
                        if (!this.lettersOnScreen.some(l => l.isTarget)) {
                            this.spawnLetters();
                        }
                    }
                } else {
                    this.lettersOnScreen.splice(index, 1);
                }
            }
        });

        if (this.lettersOnScreen.length === 0 && this.gameState.isActive && this.currentLevelIndex < this.alphabet.length) {
             this.spawnLetters(); 
        }
    }

    private nextLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= this.alphabet.length) {
            this.winGame();
        } else {
            this.gameState.currentLevelLetter = this.alphabet[this.currentLevelIndex];
            this.gameState.levelProgress = (this.currentLevelIndex + 1) / this.alphabet.length;
            console.log(`Advancing to next level. Target: ${this.gameState.currentLevelLetter}`);
            this.spawnLetters();
        }
    }

    private gameOver() {
        this.gameState.isActive = false;
        this.gameState.isWin = false; // Explicitly set isWin to false
        console.log("Game Over!");
        // The UI will now show the game over screen via the render method
    }

    private winGame() {
        this.gameState.isActive = false;
        this.gameState.isWin = true; // Set isWin to true
        console.log("Congratulations! You've completed all levels!");
        // The UI will now show the win screen via the render method
    }

    private gameLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        if (this.gameState.isActive) {
            this.update(deltaTime);
        }
        
        // Always render, so game over/win screens are shown
        this.ui.render(this.getGameState(), this.getPlayer(), this.getLettersOnScreen(), this.getArrows());

        if (this.gameState.isActive || (this.gameState.lives <= 0 && !this.gameState.isActive) || (this.currentLevelIndex >= this.alphabet.length && !this.gameState.isActive) ){
             // Continue loop if active, or if game over/win screen needs to persist
             // However, for game over/win, we might want to stop updates but keep rendering.
             // The current logic: if not active, it skips update() but still renders.
             // If game is truly over (lives <=0 or won), we might stop the loop or rely on UI to show a static screen.
             // For simplicity, let's keep it looping to show the final state via ui.render.
        }

        // Only request next frame if the game hasn't been explicitly stopped by navigating away
        // and the game is either active or in a state that needs continuous rendering (like game over/win screens)
        if (this.ui && typeof requestAnimationFrame === 'function' && (this.gameState.isActive || this.gameState.lives <= 0 || this.gameState.isWin)) {
             requestAnimationFrame(() => this.gameLoop());
        }
    }

    // public publicShoot() { // This can be removed if direct click shooting is replaced by mousedown/mouseup
    //     this.handlePlayerShoot();
    // }

    public getGameState(): GameState {
        return this.gameState;
    }

    public getPlayer(): Player { 
        return this.player; 
    }
    public getLettersOnScreen(): LetterDrop[] {
        return this.lettersOnScreen;
    }
    public getArrows(): Projectile[] {
        return this.arrows;
    }
}
