import { Player, Letter as LetterEntity } from '../entities/index.js';
import { GameUI } from './GameUI.js';
const ROAD_HEIGHT = 150;
const AVAILABLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTER_COLORS = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FBE0F2', '#FFDDC1']; // Softer pastel colors
export class Game {
    constructor(canvas, context) {
        this.letters = [];
        this.projectiles = [];
        this.letterSpawnTimer = 0;
        this.letterSpawnInterval = 1800; // ms, slightly faster
        this.lastTime = 0;
        this.mouseX = 0;
        this.assetsReady = false;
        this.canvas = canvas;
        this.context = context;
        this.mouseX = this.canvas.width / 2;
        this.player = new Player(this.canvas.width, this.canvas.height, ROAD_HEIGHT);
        this.gameUI = new GameUI(() => { this.assetsReady = true; });
        this.gameState = this.getInitialGameState();
        this.setupInputHandlers();
    }
    getInitialGameState() {
        return {
            score: 0,
            lives: 3,
            targetLetter: "",
            isGameOver: false,
            coins: 0, // Initialize coins
        };
    }
    getRandomLetter() {
        // This might still be useful for just getting a random letter to spawn
        return AVAILABLE_LETTERS[Math.floor(Math.random() * AVAILABLE_LETTERS.length)];
    }
    setupInputHandlers() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameState.isGameOver && this.assetsReady)
                return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.player.updateAimerPosition(this.mouseX);
        });
        this.canvas.addEventListener('click', (e) => {
            if (!this.assetsReady)
                return; // Don't allow clicks if assets (like UI) aren't ready
            if (this.gameState.isGameOver) {
                this.restartGame();
                return;
            }
            this.projectiles.push(this.player.shoot());
        });
    }
    spawnLetter() {
        const value = this.getRandomLetter(); // Still use this to get a letter to spawn
        const size = Math.floor(70 + Math.random() * 50); // Slightly larger letters
        const x = Math.random() * (this.canvas.width - size) + size / 2; // Ensure full letter is visible horizontally
        const y = -size; // Start above screen
        const color = LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)];
        const speed = (0.8 + Math.random() * 0.7) * (this.canvas.height / 800); // Scale speed slightly with canvas height
        this.letters.push(new LetterEntity(value, x, y, color, size, speed));
    }
    update(deltaTime) {
        if (this.gameState.isGameOver || !this.assetsReady)
            return;
        this.letterSpawnTimer += deltaTime;
        if (this.letterSpawnTimer >= this.letterSpawnInterval) {
            this.spawnLetter();
            this.letterSpawnTimer = 0;
        }
        this.projectiles.forEach(p => p.update(deltaTime));
        this.projectiles = this.projectiles.filter(p => p.isActive);
        this.letters.forEach(l => l.update(deltaTime, this.canvas.width, this.canvas.height));
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (!proj.isActive)
                continue;
            for (let j = this.letters.length - 1; j >= 0; j--) {
                const letter = this.letters[j];
                if (!letter.isActive || letter.isHit)
                    continue;
                // ... existing collision detection math ...
                const projLeft = proj.x - proj.width / 2;
                const projRight = proj.x + proj.width / 2;
                const projTop = proj.y;
                const projBottom = proj.y + proj.height;
                const letterLeft = letter.x - letter.size / 2;
                const letterRight = letter.x + letter.size / 2;
                const letterTop = letter.y - letter.size / 2;
                const letterBottom = letter.y + letter.size / 2;
                if (projRight > letterLeft && projLeft < letterRight && projBottom > letterTop && projTop < letterBottom) {
                    letter.isHit = true;
                    proj.isActive = false;
                    // Award a coin for hitting any letter
                    this.gameState.coins += 1;
                    // Optional: if score is still used, you can increment it here too
                    // this.gameState.score += 5; 
                    // Remove target letter logic
                    // if (letter.value === this.gameState.targetLetter) {
                    //     this.gameState.score += 10;
                    //     this.gameState.targetLetter = this.getRandomLetter();
                    // } else {
                    //     // Penalty for hitting wrong letter (optional, e.g., lose score or nothing)
                    //     // this.gameState.score = Math.max(0, this.gameState.score - 5);
                    // }
                    setTimeout(() => { letter.isActive = false; }, 300);
                    break;
                }
            }
        }
        for (let i = this.letters.length - 1; i >= 0; i--) {
            const letter = this.letters[i];
            if (!letter.isActive) {
                if (!letter.isHit) {
                    this.gameState.lives--;
                    if (this.gameState.lives < 0)
                        this.gameState.lives = 0; // Prevent negative lives display
                }
                this.letters.splice(i, 1);
            }
        }
        if (this.gameState.lives <= 0 && !this.gameState.isGameOver) {
            this.gameState.isGameOver = true;
        }
    }
    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ... existing background rendering ...
        this.context.fillStyle = '#87CEEB';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'white';
        this.drawCloud(100, 100, 150, 60);
        this.drawCloud(this.canvas.width * 0.7, 120, 200, 80);
        this.drawCloud(this.canvas.width * 0.4, 80, 120, 50);
        this.context.fillStyle = '#606060'; // Darker Road
        this.context.fillRect(0, this.canvas.height - ROAD_HEIGHT, this.canvas.width, ROAD_HEIGHT);
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 10;
        this.context.setLineDash([50, 35]);
        const lineY = this.canvas.height - ROAD_HEIGHT / 2;
        this.context.beginPath();
        this.context.moveTo(0, lineY);
        this.context.lineTo(this.canvas.width, lineY);
        this.context.stroke();
        this.context.setLineDash([]);
        this.letters.forEach(l => l.draw(this.context));
        this.projectiles.forEach(p => p.draw(this.context));
        this.player.draw(this.context);
        if (this.assetsReady) {
            // GameUI will need to be updated to show coins and not targetLetter
            this.gameUI.draw(this.context, this.gameState, this.canvas.width, this.canvas.height);
        }
    }
    drawCloud(x, y, w, h) {
        this.context.beginPath();
        this.context.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
        this.context.ellipse(x + w / 3.5, y - h / 4.5, w / 2.8, h / 2.8, 0, 0, Math.PI * 2);
        this.context.ellipse(x - w / 3.5, y + h / 4.5, w / 2.8, h / 2.8, 0, 0, Math.PI * 2);
        this.context.ellipse(x + w / 5, y + h / 3, w / 3, h / 3, 0, 0, Math.PI * 2);
        this.context.fill();
    }
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.update(deltaTime);
        this.render();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    start() {
        this.lastTime = performance.now();
        // Ensure player is initialized with current canvas dimensions
        this.player = new Player(this.canvas.width, this.canvas.height, ROAD_HEIGHT);
        this.player.updateAimerPosition(this.mouseX); // Initial position
        this.gameLoop(this.lastTime);
    }
    restartGame() {
        this.gameState = this.getInitialGameState();
        this.letters = [];
        this.projectiles = [];
        this.letterSpawnTimer = 0;
        this.player = new Player(this.canvas.width, this.canvas.height, ROAD_HEIGHT);
        this.player.updateAimerPosition(this.mouseX);
        // No need to reset targetLetter specifically if it's not a core mechanic anymore
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.player.updateAimerPosition(this.mouseX);
        // GameUI might need a resize method if its elements are positioned absolutely or need recalculation
        // this.gameUI.resize(width, height);
    }
}
