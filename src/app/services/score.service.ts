import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Score {
  id: string;
  date: Date;
  difficulty: string;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  numbersCount: number;
  digitsCount: string;
  operationType: string;
  displayTime: number;
  timestamp: number;
}

export interface ScoreStats {
  totalGames: number;
  correctGames: number;
  incorrectGames: number;
  successRate: number;
  bestStreak: number;
  currentStreak: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly STORAGE_KEY = 'flashanzan_scores';
  private readonly MAX_SCORES = 50; // Garder les 50 derniers scores
  
  private scoresSubject = new BehaviorSubject<Score[]>([]);
  public scores$: Observable<Score[]> = this.scoresSubject.asObservable();

  constructor() {
    this.loadScores();
  }

  /**
   * Charger les scores depuis le localStorage
   */
  private loadScores(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const scores: Score[] = JSON.parse(stored);
        // Convertir les dates string en objets Date
        scores.forEach(score => {
          score.date = new Date(score.date);
        });
        this.scoresSubject.next(scores);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.scoresSubject.next([]);
    }
  }

  /**
   * Sauvegarder les scores dans le localStorage
   */
  private saveScores(scores: Score[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      this.scoresSubject.next(scores);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des scores:', error);
    }
  }

  /**
   * Ajouter un nouveau score
   */
  addScore(score: Omit<Score, 'id' | 'date' | 'timestamp'>): void {
    const scores = this.scoresSubject.value;
    const newScore: Score = {
      ...score,
      id: this.generateId(),
      date: new Date(),
      timestamp: Date.now()
    };

    scores.unshift(newScore); // Ajouter au début

    // Garder seulement les MAX_SCORES derniers
    if (scores.length > this.MAX_SCORES) {
      scores.splice(this.MAX_SCORES);
    }

    this.saveScores(scores);
  }

  /**
   * Obtenir tous les scores
   */
  getScores(): Score[] {
    return this.scoresSubject.value;
  }

  /**
   * Obtenir les N derniers scores
   */
  getRecentScores(limit: number = 10): Score[] {
    return this.scoresSubject.value.slice(0, limit);
  }

  /**
   * Obtenir les statistiques globales
   */
  getStats(): ScoreStats {
    const scores = this.scoresSubject.value;
    const totalGames = scores.length;
    const correctGames = scores.filter(s => s.isCorrect).length;
    const incorrectGames = totalGames - correctGames;
    const successRate = totalGames > 0 ? (correctGames / totalGames) * 100 : 0;

    // Calculer la meilleure série de victoires
    let bestStreak = 0;
    let currentStreak = 0;
    
    scores.forEach(score => {
      if (score.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    // Série actuelle
    currentStreak = 0;
    for (const score of scores) {
      if (score.isCorrect) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalGames,
      correctGames,
      incorrectGames,
      successRate: Math.round(successRate * 10) / 10,
      bestStreak,
      currentStreak
    };
  }

  /**
   * Supprimer tous les scores
   */
  clearScores(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.scoresSubject.next([]);
  }

  /**
   * Générer un ID unique
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
