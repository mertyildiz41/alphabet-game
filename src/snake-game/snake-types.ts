// src/snake-game/snake-types.ts
export interface Position {
    x: number;
    y: number;
}

export interface SnakeGameState {
    score: number;
    isGameOver: boolean;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    snakeSegments: Position[];
    foodPosition: Position;
}

export interface GameObject {
    draw: (context: CanvasRenderingContext2D, gridSize?: number) => void;
    update?: () => void;
}
