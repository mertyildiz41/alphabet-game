export interface GameState {
    score: number;
    lives: number;
    targetLetter: string;
    isGameOver: boolean;
    coins: number; // Added coins
}

export interface Entity {
    position: { x: number; y: number };
    move: (dx: number, dy: number) => void;
    draw: (context: CanvasRenderingContext2D) => void;
}

export interface GameLetter {
  value: string;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  isHit: boolean;
}

// Basic structure for game entities that can be drawn and updated
export interface GameObject {
    x: number;
    y: number;
    width?: number; 
    height?: number;
    isActive?: boolean; // To manage active state for projectiles, letters etc.
    draw: (context: CanvasRenderingContext2D) => void;
    update?: (deltaTime: number, canvasWidth?: number, canvasHeight?: number) => void;
}