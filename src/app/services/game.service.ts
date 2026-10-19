import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  CUSTOM = 'custom'
}

export enum OperationType {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MIXED = 'mixed'
}

export interface GameConfig {
  difficulty: Difficulty;
  numberCount: number;
  displayTime: number; // en millisecondes
  minDigits: number;
  maxDigits: number;
  operationType: OperationType;
}

export interface GameState {
  isPlaying: boolean;
  currentNumber: number | null;
  numbersShown: number[];
  score: number;
  timeRemaining: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState = new BehaviorSubject<GameState>({
    isPlaying: false,
    currentNumber: null,
    numbersShown: [],
    score: 0,
    timeRemaining: 0
  });

  private stopGame$ = new Subject<void>();
  
  public gameState$ = this.gameState.asObservable();
  
  private currentConfig?: GameConfig; // Sauvegarder la configuration actuelle

  private configs: { [key in Difficulty]: GameConfig } = {
    [Difficulty.EASY]: {
      difficulty: Difficulty.EASY,
      numberCount: 5,
      displayTime: 1500,
      minDigits: 1,
      maxDigits: 1,
      operationType: OperationType.ADDITION
    },
    [Difficulty.MEDIUM]: {
      difficulty: Difficulty.MEDIUM,
      numberCount: 10,
      displayTime: 1000,
      minDigits: 2,
      maxDigits: 2,
      operationType: OperationType.ADDITION
    },
    [Difficulty.HARD]: {
      difficulty: Difficulty.HARD,
      numberCount: 15,
      displayTime: 500,
      minDigits: 3,
      maxDigits: 3,
      operationType: OperationType.ADDITION
    },
    [Difficulty.CUSTOM]: {
      difficulty: Difficulty.CUSTOM,
      numberCount: 5,
      displayTime: 1500,
      minDigits: 1,
      maxDigits: 2,
      operationType: OperationType.ADDITION
    }
  };

  constructor() { }

  startGame(difficulty: Difficulty, customConfig?: Partial<GameConfig>): void {
    this.stopGame$.next();
    let config = this.configs[difficulty];
    
    // Si c'est un défi personnalisé, fusionner avec la configuration custom
    if (difficulty === Difficulty.CUSTOM && customConfig) {
      config = { ...config, ...customConfig, difficulty: Difficulty.CUSTOM };
    }
    
    // Sauvegarder la configuration
    this.currentConfig = config;
    
    const numbers = this.generateNumbers(config);
    
    this.gameState.next({
      isPlaying: true,
      currentNumber: null,
      numbersShown: [],
      score: 0,
      timeRemaining: 0
    });

    this.displayNumbers(numbers, config);
  }

  replayNumbers(numbers: number[]): void {
    this.stopGame$.next();
    
    // Utiliser la configuration sauvegardée ou par défaut
    const config = this.currentConfig || this.configs[Difficulty.EASY];
    
    this.gameState.next({
      isPlaying: true,
      currentNumber: null,
      numbersShown: [],
      score: this.gameState.value.score,
      timeRemaining: 0
    });

    this.displayNumbers(numbers, config);
  }

  updateCustomConfig(config: Partial<GameConfig>): void {
    this.configs[Difficulty.CUSTOM] = {
      ...this.configs[Difficulty.CUSTOM],
      ...config,
      difficulty: Difficulty.CUSTOM
    };
  }

  getConfig(difficulty: Difficulty): GameConfig {
    return { ...this.configs[difficulty] };
  }

  /**
   * Configuration de la dernière partie lancée, ou celle de la difficulté donnée
   */
  getCurrentConfig(fallback: Difficulty = Difficulty.EASY): GameConfig {
    return { ...(this.currentConfig || this.configs[fallback]) };
  }

  private generateNumbers(config: GameConfig): number[] {
    if (config.operationType === OperationType.SUBTRACTION) {
      // Le nombre de départ couvre toutes les soustractions, pour que le résultat reste positif
      const subtrahends = Array.from({ length: config.numberCount - 1 }, () => this.randomNumber(config));
      const start = subtrahends.reduce((a, b) => a + b, 0) + this.randomNumber(config);
      return [start, ...subtrahends.map(n => -n)];
    }

    const numbers: number[] = [];
    let sum = 0;

    for (let i = 0; i < config.numberCount; i++) {
      let number = this.randomNumber(config);

      // Mode mixte : 50% de chance de soustraire, seulement si le total reste positif
      if (config.operationType === OperationType.MIXED && i > 0 && Math.random() < 0.5 && sum - number > 0) {
        number = -number;
      }

      numbers.push(number);
      sum += number;
    }

    return numbers;
  }

  /**
   * Nombre positif dont le nombre de chiffres est compris entre minDigits et maxDigits
   */
  private randomNumber(config: GameConfig): number {
    const digitCount = Math.floor(Math.random() * (config.maxDigits - config.minDigits + 1)) + config.minDigits;
    const min = Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private displayNumbers(numbers: number[], config: GameConfig): void {
    let index = 0;
    const state = this.gameState.value;

    interval(config.displayTime)
      .pipe(
        take(numbers.length + 1),
        takeUntil(this.stopGame$)
      )
      .subscribe({
        next: () => {
          if (index < numbers.length) {
            this.gameState.next({
              ...this.gameState.value,
              currentNumber: numbers[index],
              numbersShown: [...this.gameState.value.numbersShown, numbers[index]]
            });
            index++;
          } else {
            // Fin de l'affichage
            this.gameState.next({
              ...this.gameState.value,
              currentNumber: null,
              isPlaying: false
            });
          }
        }
      });
  }

  checkAnswer(userAnswer: number): boolean {
    const correctAnswer = this.gameState.value.numbersShown.reduce((a, b) => a + b, 0);
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      this.gameState.next({
        ...this.gameState.value,
        score: this.gameState.value.score + 1
      });
    }
    
    return isCorrect;
  }

  getCorrectAnswer(): number {
    return this.gameState.value.numbersShown.reduce((a, b) => a + b, 0);
  }

  stopGame(): void {
    this.stopGame$.next();
    this.gameState.next({
      ...this.gameState.value,
      isPlaying: false,
      currentNumber: null
    });
  }

  resetGame(): void {
    this.stopGame$.next();
    this.gameState.next({
      isPlaying: false,
      currentNumber: null,
      numbersShown: [],
      score: 0,
      timeRemaining: 0
    });
  }
}
