import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Difficulty, OperationType } from './game.service';

export interface Score {
  id: string;
  date: Date;
  difficulty: Difficulty;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  numbersCount: number;
  digitsCount: string;
  operationType: OperationType;
  displayTime: number;
  timestamp: number;
}

// Compteurs cumulés, indépendants de l'historique limité à MAX_SCORES
interface ScoreTotals {
  totalGames: number;
  correctGames: number;
  bestStreak: number;
  currentStreak: number;
}

// Anciennes versions : les libellés français étaient stockés à la place des clés
const LEGACY_DIFFICULTIES: { [label: string]: Difficulty } = {
  'Facile': Difficulty.EASY,
  'Moyen': Difficulty.MEDIUM,
  'Difficile': Difficulty.HARD,
  'Personnalisé': Difficulty.CUSTOM
};

const LEGACY_OPERATIONS: { [label: string]: OperationType } = {
  'Addition': OperationType.ADDITION,
  'Soustraction': OperationType.SUBTRACTION,
  'Mixte': OperationType.MIXED
};

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
  private readonly TOTALS_KEY = 'flashanzan_totals';
  private readonly MAX_SCORES = 50; // Garder les 50 derniers scores

  private scoresSubject = new BehaviorSubject<Score[]>([]);
  public scores$: Observable<Score[]> = this.scoresSubject.asObservable();

  private totals: ScoreTotals = this.emptyTotals();

  constructor() {
    this.loadScores();
    this.loadTotals();
  }

  /**
   * Charger les scores depuis le localStorage
   */
  private loadScores(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const scores: Score[] = JSON.parse(stored);
        scores.forEach(score => {
          // Convertir les dates string en objets Date
          score.date = new Date(score.date);
          score.difficulty = LEGACY_DIFFICULTIES[score.difficulty] ?? score.difficulty;
          score.operationType = LEGACY_OPERATIONS[score.operationType] ?? score.operationType;
        });
        this.scoresSubject.next(scores);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.scoresSubject.next([]);
    }
  }

  /**
   * Charger les compteurs cumulés, ou les reconstruire depuis l'historique existant
   */
  private loadTotals(): void {
    try {
      const stored = localStorage.getItem(this.TOTALS_KEY);
      if (stored) {
        this.totals = { ...this.emptyTotals(), ...JSON.parse(stored) };
        return;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
    this.totals = this.computeTotalsFromHistory(this.scoresSubject.value);
    this.saveTotals();
  }

  private saveTotals(): void {
    try {
      localStorage.setItem(this.TOTALS_KEY, JSON.stringify(this.totals));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des statistiques:', error);
    }
  }

  private emptyTotals(): ScoreTotals {
    return { totalGames: 0, correctGames: 0, bestStreak: 0, currentStreak: 0 };
  }

  /**
   * Calculer les compteurs à partir d'un historique (du plus récent au plus ancien)
   */
  private computeTotalsFromHistory(scores: Score[]): ScoreTotals {
    let bestStreak = 0;
    let streak = 0;
    scores.forEach(score => {
      streak = score.isCorrect ? streak + 1 : 0;
      bestStreak = Math.max(bestStreak, streak);
    });

    let currentStreak = 0;
    for (const score of scores) {
      if (!score.isCorrect) break;
      currentStreak++;
    }

    return {
      totalGames: scores.length,
      correctGames: scores.filter(s => s.isCorrect).length,
      bestStreak,
      currentStreak
    };
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

    // Mettre à jour les compteurs avant d'émettre, pour que les abonnés (badges) les voient
    const totals = this.totals;
    totals.totalGames++;
    if (newScore.isCorrect) {
      totals.correctGames++;
      totals.currentStreak++;
      totals.bestStreak = Math.max(totals.bestStreak, totals.currentStreak);
    } else {
      totals.currentStreak = 0;
    }
    this.saveTotals();

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
    const { totalGames, correctGames, bestStreak, currentStreak } = this.totals;
    const incorrectGames = totalGames - correctGames;
    const successRate = totalGames > 0 ? (correctGames / totalGames) * 100 : 0;

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
    this.totals = this.emptyTotals();
    this.saveTotals();
    this.scoresSubject.next([]);
  }

  /**
   * Générer un ID unique
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
