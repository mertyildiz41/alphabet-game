// src/alphabet-arrow-game/types.ts

export interface LetterDrop {
    letter: string;
    isTarget: boolean;
    position: { x: number; y: number };
    speed: number;
}

export interface GameState {
    currentLevelLetter: string;
    score: number;
    lives: number;
    isActive: boolean;
    levelProgress: number; // Added to store calculated progress
    isWin?: boolean; // Added to explicitly track win state
}
