import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScoreService } from './score.service';

export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlockedDate?: Date;
  progress: number; // 0-100
  requirement: number;
  currentValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly STORAGE_KEY = 'flashanzan_badges';
  
  private badgesSubject = new BehaviorSubject<Badge[]>([]);
  public badges$: Observable<Badge[]> = this.badgesSubject.asObservable();

  // Émet les badges qui viennent d'être débloqués
  private badgesUnlockedSubject = new Subject<Badge[]>();
  public badgesUnlocked$: Observable<Badge[]> = this.badgesUnlockedSubject.asObservable();

  private allBadges: Badge[] = [
    // Badges de nombre de parties
    {
      id: 'first_game',
      name: 'Premier Pas',
      nameAr: 'الخطوة الأولى',
      nameEn: 'First Step',
      description: 'Jouer votre première partie',
      descriptionAr: 'العب أول لعبة لك',
      descriptionEn: 'Play your first game',
      icon: '🎯',
      level: 'bronze',
      unlocked: false,
      progress: 0,
      requirement: 1,
      currentValue: 0
    },
    {
      id: 'games_10',
      name: 'Débutant',
      nameAr: 'مبتدئ',
      nameEn: 'Beginner',
      description: 'Jouer 10 parties',
      descriptionAr: 'العب 10 ألعاب',
      descriptionEn: 'Play 10 games',
      icon: '🎮',
      level: 'bronze',
      unlocked: false,
      progress: 0,
      requirement: 10,
      currentValue: 0
    },
    {
      id: 'games_50',
      name: 'Expérimenté',
      nameAr: 'ذو خبرة',
      nameEn: 'Experienced',
      description: 'Jouer 50 parties',
      descriptionAr: 'العب 50 لعبة',
      descriptionEn: 'Play 50 games',
      icon: '🏅',
      level: 'silver',
      unlocked: false,
      progress: 0,
      requirement: 50,
      currentValue: 0
    },
    {
      id: 'games_100',
      name: 'Expert',
      nameAr: 'خبير',
      nameEn: 'Expert',
      description: 'Jouer 100 parties',
      descriptionAr: 'العب 100 لعبة',
      descriptionEn: 'Play 100 games',
      icon: '🏆',
      level: 'gold',
      unlocked: false,
      progress: 0,
      requirement: 100,
      currentValue: 0
    },
    // Badges de réussite
    {
      id: 'correct_5',
      name: 'Bon Départ',
      nameAr: 'بداية جيدة',
      nameEn: 'Good Start',
      description: 'Réussir 5 parties',
      descriptionAr: 'انجح في 5 ألعاب',
      descriptionEn: 'Succeed in 5 games',
      icon: '✅',
      level: 'bronze',
      unlocked: false,
      progress: 0,
      requirement: 5,
      currentValue: 0
    },
    {
      id: 'correct_25',
      name: 'Calculateur',
      nameAr: 'حاسب',
      nameEn: 'Calculator',
      description: 'Réussir 25 parties',
      descriptionAr: 'انجح في 25 لعبة',
      descriptionEn: 'Succeed in 25 games',
      icon: '🧮',
      level: 'silver',
      unlocked: false,
      progress: 0,
      requirement: 25,
      currentValue: 0
    },
    {
      id: 'correct_50',
      name: 'Maître du Calcul',
      nameAr: 'سيد الحساب',
      nameEn: 'Math Master',
      description: 'Réussir 50 parties',
      descriptionAr: 'انجح في 50 لعبة',
      descriptionEn: 'Succeed in 50 games',
      icon: '🎓',
      level: 'gold',
      unlocked: false,
      progress: 0,
      requirement: 50,
      currentValue: 0
    },
    // Badges de série
    {
      id: 'streak_3',
      name: 'En Feu',
      nameAr: 'في لهيب',
      nameEn: 'On Fire',
      description: 'Gagner 3 parties d\'affilée',
      descriptionAr: 'اربح 3 ألعاب على التوالي',
      descriptionEn: 'Win 3 games in a row',
      icon: '🔥',
      level: 'bronze',
      unlocked: false,
      progress: 0,
      requirement: 3,
      currentValue: 0
    },
    {
      id: 'streak_5',
      name: 'Inarrêtable',
      nameAr: 'لا يقهر',
      nameEn: 'Unstoppable',
      description: 'Gagner 5 parties d\'affilée',
      descriptionAr: 'اربح 5 ألعاب على التوالي',
      descriptionEn: 'Win 5 games in a row',
      icon: '⚡',
      level: 'silver',
      unlocked: false,
      progress: 0,
      requirement: 5,
      currentValue: 0
    },
    {
      id: 'streak_10',
      name: 'Légende',
      nameAr: 'أسطورة',
      nameEn: 'Legend',
      description: 'Gagner 10 parties d\'affilée',
      descriptionAr: 'اربح 10 ألعاب على التوالي',
      descriptionEn: 'Win 10 games in a row',
      icon: '👑',
      level: 'gold',
      unlocked: false,
      progress: 0,
      requirement: 10,
      currentValue: 0
    },
    // Badge perfectionniste
    {
      id: 'perfect_rate',
      name: 'Perfectionniste',
      nameAr: 'الكمال',
      nameEn: 'Perfectionist',
      description: 'Atteindre 90% de réussite (min 20 parties)',
      descriptionAr: 'حقق نسبة نجاح 90٪ (20 لعبة على الأقل)',
      descriptionEn: 'Achieve 90% success rate (min 20 games)',
      icon: '💯',
      level: 'platinum',
      unlocked: false,
      progress: 0,
      requirement: 90,
      currentValue: 0
    }
  ];

  constructor(private scoreService: ScoreService) {
    this.loadBadges();
    this.updateBadges();
    
    // Mettre à jour les badges à chaque nouveau score
    this.scoreService.scores$.subscribe(() => {
      this.updateBadges();
    });
  }

  /**
   * Charger les badges depuis le localStorage
   */
  private loadBadges(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const savedBadges: Badge[] = JSON.parse(stored);
        
        // Fusionner avec les nouveaux badges (au cas où on en ajoute)
        this.allBadges.forEach(badge => {
          const saved = savedBadges.find(b => b.id === badge.id);
          if (saved) {
            badge.unlocked = saved.unlocked;
            badge.unlockedDate = saved.unlockedDate ? new Date(saved.unlockedDate) : undefined;
          }
        });
      }
      this.badgesSubject.next([...this.allBadges]);
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error);
      this.badgesSubject.next([...this.allBadges]);
    }
  }

  /**
   * Sauvegarder les badges dans le localStorage
   */
  private saveBadges(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.allBadges));
      this.badgesSubject.next([...this.allBadges]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des badges:', error);
    }
  }

  /**
   * Mettre à jour l'état des badges
   */
  updateBadges(): Badge[] {
    const stats = this.scoreService.getStats();
    const newlyUnlocked: Badge[] = [];

    this.allBadges.forEach(badge => {
      if (!badge.unlocked) {
        switch (badge.id) {
          // Badges de nombre de parties
          case 'first_game':
          case 'games_10':
          case 'games_50':
          case 'games_100':
            badge.currentValue = stats.totalGames;
            badge.progress = Math.min(100, (stats.totalGames / badge.requirement) * 100);
            if (stats.totalGames >= badge.requirement) {
              this.unlockBadge(badge);
              newlyUnlocked.push(badge);
            }
            break;

          // Badges de réussite
          case 'correct_5':
          case 'correct_25':
          case 'correct_50':
            badge.currentValue = stats.correctGames;
            badge.progress = Math.min(100, (stats.correctGames / badge.requirement) * 100);
            if (stats.correctGames >= badge.requirement) {
              this.unlockBadge(badge);
              newlyUnlocked.push(badge);
            }
            break;

          // Badges de série
          case 'streak_3':
          case 'streak_5':
          case 'streak_10':
            badge.currentValue = stats.bestStreak;
            badge.progress = Math.min(100, (stats.bestStreak / badge.requirement) * 100);
            if (stats.bestStreak >= badge.requirement) {
              this.unlockBadge(badge);
              newlyUnlocked.push(badge);
            }
            break;

          // Badge perfectionniste
          case 'perfect_rate':
            if (stats.totalGames >= 20) {
              badge.currentValue = Math.round(stats.successRate);
              badge.progress = Math.min(100, (stats.successRate / badge.requirement) * 100);
              if (stats.successRate >= badge.requirement) {
                this.unlockBadge(badge);
                newlyUnlocked.push(badge);
              }
            } else {
              badge.currentValue = 0;
              badge.progress = 0;
            }
            break;
        }
      }
    });

    this.saveBadges();
    if (newlyUnlocked.length > 0) {
      this.badgesUnlockedSubject.next(newlyUnlocked);
    }
    return newlyUnlocked;
  }

  /**
   * Débloquer un badge
   */
  private unlockBadge(badge: Badge): void {
    badge.unlocked = true;
    badge.unlockedDate = new Date();
    badge.progress = 100;
  }

  /**
   * Obtenir tous les badges
   */
  getBadges(): Badge[] {
    return this.badgesSubject.value;
  }

  /**
   * Obtenir les badges débloqués
   */
  getUnlockedBadges(): Badge[] {
    return this.badgesSubject.value.filter(b => b.unlocked);
  }

  /**
   * Obtenir les badges verrouillés
   */
  getLockedBadges(): Badge[] {
    return this.badgesSubject.value.filter(b => !b.unlocked);
  }

  /**
   * Réinitialiser tous les badges
   */
  resetBadges(): void {
    this.allBadges.forEach(badge => {
      badge.unlocked = false;
      badge.unlockedDate = undefined;
      badge.progress = 0;
      badge.currentValue = 0;
    });
    this.saveBadges();
  }
}
