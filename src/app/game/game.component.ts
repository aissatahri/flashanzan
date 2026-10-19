import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GameService, Difficulty, GameState, OperationType, GameConfig } from '../services/game.service';
import { TranslationService, Translation, Language } from '../services/translation.service';
import { ScoreService } from '../services/score.service';
import { BadgeService, Badge } from '../services/badge.service';
import { FontService, FontFamily, FontOption } from '../services/font.service';
import { ReviewService } from '../services/review.service';
import { ShareService } from '../services/share.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  gameState: GameState = {
    isPlaying: false,
    currentNumber: null,
    numbersShown: [],
    score: 0,
    timeRemaining: 0
  };

  userAnswer: number | null = null;
  selectedDifficulty: Difficulty = Difficulty.EASY;
  difficulties = Difficulty;
  operationTypes = OperationType;
  showResult = false;
  isCorrect = false;
  correctAnswer = 0;
  Math = Math; // Pour utiliser Math dans le template
  showDialog = false; // Pour la boîte de dialogue personnalisée
  currentNumbers: number[] = []; // Sauvegarder les nombres actuels
  isAnswerPromptShown = false; // Flag pour éviter les prompts multiples
  showAnswerModal = false; // Pour la modal de saisie de réponse
  answerInput = ''; // Stocke la réponse saisie
  private audioContext: AudioContext | null = null;
  private previousNumberCount = 0; // Pour détecter les nouveaux nombres
  
  @ViewChild('answerField') answerField!: ElementRef<HTMLInputElement>;
  
  // Traduction
  t!: Translation;
  showLanguageMenu = false;
  availableLanguages = this.translationService.getAvailableLanguages();
  showCustomModal = false; // Pour la modal de personnalisation

  // Scores et Badges
  showScoresModal = false;
  showBadgesModal = false;
  showAboutModal = false;
  newlyUnlockedBadges: Badge[] = [];
  showBadgeUnlockModal = false;

  // Options de personnalisation
  customOperationType: OperationType = OperationType.ADDITION;
  customMinDigits: number = 1; // Nombre minimum de chiffres
  customMaxDigits: number = 3; // Nombre maximum de chiffres
  customNumberCount: number = 10;
  customDisplayTime: number = 1000; // en millisecondes
  minNumberCount: number = 3; // Minimum 3 opérations
  maxNumberCount: number = 50; // Maximum 50 opérations

  // Options disponibles
  displayTimeOptions = [
    { value: 200, label: '0.2s' },
    { value: 500, label: '0.5s' },
    { value: 700, label: '0.7s' },
    { value: 1000, label: '1s' },
    { value: 1500, label: '1.5s' },
    { value: 2000, label: '2s' },
    { value: 2500, label: '2.5s' },
    { value: 3000, label: '3s' }
  ];

  // Cartes de sélection du niveau
  levels = [
    { difficulty: Difficulty.EASY, icon: '🌱', config: this.gameService.getConfig(Difficulty.EASY) },
    { difficulty: Difficulty.MEDIUM, icon: '🚀', config: this.gameService.getConfig(Difficulty.MEDIUM) },
    { difficulty: Difficulty.HARD, icon: '🔥', config: this.gameService.getConfig(Difficulty.HARD) },
    { difficulty: Difficulty.CUSTOM, icon: '⚙️', config: this.gameService.getConfig(Difficulty.CUSTOM) }
  ];

  private destroy$ = new Subject<void>();

  // Demande d'avis à faire à la fermeture du résultat (après un moment positif)
  private reviewPending = false;
  isSharing = false;

  // Font selection
  showFontModal = false;
  currentFont: FontFamily = 'default';
  fontOptions: FontOption[] = [];

  constructor(
    private gameService: GameService,
    public translationService: TranslationService,
    private scoreService: ScoreService,
    private badgeService: BadgeService,
    public fontService: FontService,
    private reviewService: ReviewService,
    private shareService: ShareService
  ) {
    // Initialiser le contexte audio
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.fontOptions = fontService.fontOptions;
  }

  ngOnInit(): void {
    // S'abonner aux traductions
    this.translationService.translations
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        this.t = translations;
      });
    
    // S'abonner aux changements de police
    this.fontService.currentFont$
      .pipe(takeUntil(this.destroy$))
      .subscribe(font => {
        this.currentFont = font;
      });

    // Afficher la notification des badges débloqués après un court délai
    this.badgeService.badgesUnlocked$
      .pipe(takeUntil(this.destroy$))
      .subscribe(badges => {
        this.newlyUnlockedBadges = badges;
        this.reviewPending = true;
        setTimeout(() => {
          this.showBadgeUnlockModal = true;
        }, 1500);
      });

    this.gameService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
        
        // Sauvegarder les nombres actuels
        if (state.numbersShown.length > 0) {
          this.currentNumbers = [...state.numbersShown];
          
          // Jouer un son si un nouveau nombre est affiché
          if (state.isPlaying && state.numbersShown.length > this.previousNumberCount) {
            this.playBeepSound();
          }
          this.previousNumberCount = state.numbersShown.length;
        }
        
        // Quand le jeu se termine, afficher la boîte de dialogue une seule fois
        if (!state.isPlaying && state.numbersShown.length > 0 && !this.showResult && !this.showDialog && !this.isAnswerPromptShown) {
          this.isAnswerPromptShown = true;
          this.previousNumberCount = 0; // Réinitialiser le compteur
          this.promptForAnswer();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startGame(): void {
    this.showResult = false;
    this.userAnswer = null;
    this.isAnswerPromptShown = false; // Réinitialiser le flag
    this.previousNumberCount = 0; // Réinitialiser le compteur de nombres
    
    if (this.selectedDifficulty === Difficulty.CUSTOM) {
      // Envoyer la configuration personnalisée
      this.gameService.updateCustomConfig({
        operationType: this.customOperationType,
        minDigits: this.customMinDigits,
        maxDigits: this.customMaxDigits,
        numberCount: this.customNumberCount,
        displayTime: this.customDisplayTime
      });
    }
    
    this.gameService.startGame(this.selectedDifficulty);
  }

  // Méthodes pour le nombre minimum de chiffres
  incrementMinDigits(): void {
    if (this.customMinDigits < 5) {
      this.customMinDigits++;
      // S'assurer que min <= max
      if (this.customMinDigits > this.customMaxDigits) {
        this.customMaxDigits = this.customMinDigits;
      }
    }
  }

  decrementMinDigits(): void {
    if (this.customMinDigits > 1) {
      this.customMinDigits--;
    }
  }

  validateMinDigits(): void {
    if (this.customMinDigits < 1) this.customMinDigits = 1;
    if (this.customMinDigits > 5) this.customMinDigits = 5;
    // S'assurer que min <= max
    if (this.customMinDigits > this.customMaxDigits) {
      this.customMaxDigits = this.customMinDigits;
    }
  }

  // Méthodes pour le nombre maximum de chiffres
  incrementMaxDigits(): void {
    if (this.customMaxDigits < 5) {
      this.customMaxDigits++;
    }
  }

  decrementMaxDigits(): void {
    if (this.customMaxDigits > 1) {
      this.customMaxDigits--;
      // S'assurer que max >= min
      if (this.customMaxDigits < this.customMinDigits) {
        this.customMinDigits = this.customMaxDigits;
      }
    }
  }

  validateMaxDigits(): void {
    if (this.customMaxDigits < 1) this.customMaxDigits = 1;
    if (this.customMaxDigits > 5) this.customMaxDigits = 5;
    // S'assurer que max >= min
    if (this.customMaxDigits < this.customMinDigits) {
      this.customMinDigits = this.customMaxDigits;
    }
  }

  incrementNumberCount(): void {
    if (this.customNumberCount < this.maxNumberCount) {
      this.customNumberCount++;
    }
  }

  decrementNumberCount(): void {
    if (this.customNumberCount > this.minNumberCount) {
      this.customNumberCount--;
    }
  }

  validateNumberCount(): void {
    if (this.customNumberCount < this.minNumberCount) this.customNumberCount = this.minNumberCount;
    if (this.customNumberCount > this.maxNumberCount) this.customNumberCount = this.maxNumberCount;
  }

  getSpeedHint(): string {
    if (this.customDisplayTime <= 500) {
      return this.t.veryFast || '⚡ Très rapide';
    } else if (this.customDisplayTime <= 1000) {
      return this.t.fast || '🚀 Rapide';
    } else if (this.customDisplayTime <= 2000) {
      return this.t.normal || '✅ Normal';
    } else {
      return this.t.slow || '🐢 Lent';
    }
  }

  // Obtenir la couleur pour le nombre actuel basée sur son index
  getCurrentNumberColor(): string {
    const colors = [
      '#FF6B6B', // Rouge corail
      '#4ECDC4', // Turquoise
      '#45B7D1', // Bleu ciel
      '#FFA07A', // Saumon clair
      '#98D8C8', // Menthe
      '#F7DC6F', // Jaune doux
      '#BB8FCE', // Violet clair
      '#85C1E2', // Bleu clair
      '#F8B88B', // Orange pêche
      '#A8E6CF'  // Vert menthe
    ];
    
    const index = this.gameState.numbersShown.length - 1;
    return colors[index % colors.length];
  }

  // Obtenir la couleur par index (pour l'affichage du calcul)
  getColorByIndex(index: number): string {
    const colors = [
      '#FF6B6B', // Rouge corail
      '#4ECDC4', // Turquoise
      '#45B7D1', // Bleu ciel
      '#FFA07A', // Saumon clair
      '#98D8C8', // Menthe
      '#F7DC6F', // Jaune doux
      '#BB8FCE', // Violet clair
      '#85C1E2', // Bleu clair
      '#F8B88B', // Orange pêche
      '#A8E6CF'  // Vert menthe
    ];
    
    return colors[index % colors.length];
  }

  submitAnswer(): void {
    if (this.userAnswer !== null) {
      this.isCorrect = this.gameService.checkAnswer(this.userAnswer);
      this.correctAnswer = this.gameService.getCorrectAnswer();
      this.showResult = true;
    }
  }

  resetGame(): void {
    this.requestReviewIfPending();
    this.showResult = false;
    this.userAnswer = null;
    this.showDialog = false;
    this.isAnswerPromptShown = false; // Réinitialiser le flag
    this.gameService.resetGame();
  }

  retryWithoutResult(): void {
    this.showResult = false;
    this.userAnswer = null;
    this.showDialog = false;
    this.isAnswerPromptShown = false; // Réinitialiser le flag
    this.startGame();
  }

  promptForAnswer(): void {
    setTimeout(() => {
      this.showAnswerModal = true;
      this.answerInput = '';
      // Focus sur l'input après l'affichage de la modal
      setTimeout(() => {
        if (this.answerField) {
          this.answerField.nativeElement.focus();
        }
      }, 100);
    }, 500);
  }

  submitAnswerFromModal(): void {
    const numAnswer = parseInt(this.answerInput, 10);
    
    if (isNaN(numAnswer) || this.answerInput === '') {
      return; // Ne rien faire si la réponse n'est pas valide
    }
    
    this.userAnswer = numAnswer;
    this.showAnswerModal = false;
    this.submitAnswerWithDialog();
  }

  cancelAnswerModal(): void {
    this.showAnswerModal = false;
    this.answerInput = '';
  }

  submitAnswerWithDialog(): void {
    if (this.userAnswer !== null) {
      this.isCorrect = this.gameService.checkAnswer(this.userAnswer);
      this.correctAnswer = this.gameService.getCorrectAnswer();
      
      // Enregistrer le score
      this.saveScore();
      
      this.showDialog = true;
    }
  }

  /**
   * Enregistrer le score de la partie
   */
  private saveScore(): void {
    // Configuration réellement jouée (et non les valeurs du formulaire)
    const config = this.gameService.getCurrentConfig(this.selectedDifficulty);
    const digitsCount = config.minDigits === config.maxDigits
      ? `${config.minDigits}`
      : `${config.minDigits}-${config.maxDigits}`;

    // Les nouveaux badges sont signalés via badgesUnlocked$ (voir ngOnInit)
    this.scoreService.addScore({
      difficulty: config.difficulty,
      correctAnswer: this.correctAnswer,
      userAnswer: this.userAnswer || 0,
      isCorrect: this.isCorrect,
      numbersCount: this.currentNumbers.length,
      digitsCount,
      operationType: config.operationType,
      displayTime: config.displayTime
    });

    if (this.isCorrect && this.scoreService.getStats().currentStreak >= 3) {
      this.reviewPending = true;
    }
  }

  private requestReviewIfPending(): void {
    if (this.reviewPending) {
      this.reviewPending = false;
      this.reviewService.maybeRequestReview(this.scoreService.getStats().totalGames);
    }
  }

  async shareResult(): Promise<void> {
    if (this.isSharing) return;
    this.isSharing = true;

    const config = this.gameService.getCurrentConfig(this.selectedDifficulty);
    const count = this.currentNumbers.length;
    const time = config.displayTime / 1000;
    try {
      await this.shareService.shareResult({
        headline: this.t.shareHeadline,
        stat: `${count} ${this.t.numbersUnit}`,
        detail: `${this.getRangeLabel(config)} · ${time} s`,
        challenge: this.t.shareChallenge,
        message: this.t.shareMessage.replace('{count}', `${count}`).replace('{time}', `${time}`),
        rtl: this.translationService.currentLanguage === 'ar'
      });
    } catch (error) {
      // Partage annulé par l'utilisateur ou indisponible : rien à faire
      console.warn('Partage non effectué:', error);
    } finally {
      this.isSharing = false;
    }
  }

  selectLevel(difficulty: Difficulty): void {
    this.selectedDifficulty = difficulty;
    if (difficulty === Difficulty.CUSTOM) {
      this.openCustomModal();
    }
  }

  onStartClick(): void {
    if (this.selectedDifficulty === Difficulty.CUSTOM) {
      this.openCustomModal();
    } else {
      this.startGame();
    }
  }

  // Plage des nombres affichés, ex. "10–99"
  getRangeLabel(config: GameConfig): string {
    const min = Math.pow(10, config.minDigits - 1);
    const max = Math.pow(10, config.maxDigits) - 1;
    return `${min}–${max}`;
  }

  getDifficultyLabel(difficulty: Difficulty): string {
    const labels: { [key in Difficulty]: string } = {
      [Difficulty.EASY]: this.t.easy,
      [Difficulty.MEDIUM]: this.t.medium,
      [Difficulty.HARD]: this.t.hard,
      [Difficulty.CUSTOM]: this.t.custom
    };
    return labels[difficulty] ?? difficulty;
  }

  retryCurrentNumbers(): void {
    // Recommencer avec les mêmes nombres
    this.showDialog = false;
    this.showResult = false;
    this.userAnswer = null;
    this.isAnswerPromptShown = false; // Réinitialiser le flag
    this.previousNumberCount = 0; // Réinitialiser le compteur de nombres
    
    // Rejouer les mêmes nombres
    this.gameService.replayNumbers(this.currentNumbers);
  }

  closeDialog(): void {
    this.showDialog = false;
    this.showResult = true; // Afficher la boîte de résultats centrée
  }

  hideResultDialog(): void {
    this.requestReviewIfPending();
    this.showResult = false;
    this.showDialog = false;
  }

  playBeepSound(): void {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Fréquence du son (Hz) - un son agréable
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    // Enveloppe du son (fade in/out rapide)
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
    this.showLanguageMenu = false;
  }

  openCustomModal(): void {
    this.showCustomModal = true;
  }

  closeCustomModal(): void {
    this.showCustomModal = false;
  }

  saveCustomSettings(): void {
    this.showCustomModal = false;
    this.startGame();
  }

  get canSubmit(): boolean {
    return !this.gameState.isPlaying && 
           this.gameState.numbersShown.length > 0 && 
           !this.showResult;
  }

  // Méthodes pour les Scores et Badges
  openScoresModal(): void {
    this.showScoresModal = true;
  }

  closeScoresModal(): void {
    this.showScoresModal = false;
  }

  openBadgesModal(): void {
    this.showBadgesModal = true;
  }

  closeBadgesModal(): void {
    this.showBadgesModal = false;
  }

  closeBadgeUnlockModal(): void {
    this.showBadgeUnlockModal = false;
    this.newlyUnlockedBadges = [];
  }

  openAboutModal(): void {
    this.showAboutModal = true;
  }

  closeAboutModal(): void {
    this.showAboutModal = false;
  }

  // Font methods
  openFontModal(): void {
    this.showFontModal = true;
  }

  closeFontModal(): void {
    this.showFontModal = false;
  }

  selectFont(fontId: FontFamily): void {
    this.fontService.setFont(fontId);
    this.closeFontModal();
  }

  getCurrentFontStyle(): string {
    return this.fontService.getFontCssFamily(this.currentFont);
  }

  getScoreService(): ScoreService {
    return this.scoreService;
  }

  getBadgeService(): BadgeService {
    return this.badgeService;
  }
}
