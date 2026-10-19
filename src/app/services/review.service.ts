import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';

interface ReviewState {
  requestCount: number;
  lastRequestedAt: number;
}

/**
 * Demande d'avis Google Play, déclenchée après un moment positif et limitée dans le temps
 */
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly STORAGE_KEY = 'flashanzan_review';
  private readonly MIN_GAMES = 5;
  private readonly MAX_REQUESTS = 3;
  private readonly MIN_DAYS_BETWEEN_REQUESTS = 30;

  async maybeRequestReview(totalGames: number): Promise<void> {
    if (!Capacitor.isNativePlatform() || totalGames < this.MIN_GAMES) {
      return;
    }

    const state = this.loadState();
    const daysSinceLastRequest = (Date.now() - state.lastRequestedAt) / (24 * 60 * 60 * 1000);
    if (state.requestCount >= this.MAX_REQUESTS || daysSinceLastRequest < this.MIN_DAYS_BETWEEN_REQUESTS) {
      return;
    }

    this.saveState({ requestCount: state.requestCount + 1, lastRequestedAt: Date.now() });
    try {
      // Google Play décide seul d'afficher ou non la fenêtre (quota interne)
      await InAppReview.requestReview();
    } catch (error) {
      console.error('Erreur lors de la demande d\'avis:', error);
    }
  }

  private loadState(): ReviewState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état des avis:', error);
    }
    return { requestCount: 0, lastRequestedAt: 0 };
  }

  private saveState(state: ReviewState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état des avis:', error);
    }
  }
}
