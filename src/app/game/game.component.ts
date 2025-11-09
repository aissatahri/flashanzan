import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GameService, Difficulty, GameState, OperationType } from '../services/game.service';
import { TranslationService, Translation, Language } from '../services/translation.service';
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

  private destroy$ = new Subject<void>();

  constructor(
    private gameService: GameService,
    public translationService: TranslationService
  ) {
    // Initialiser le contexte audio
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  ngOnInit(): void {
    // S'abonner aux traductions
    this.translationService.translations
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        this.t = translations;
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
      this.showDialog = true;
    }
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

  get difficultyLabel(): string {
    switch (this.selectedDifficulty) {
      case Difficulty.EASY: return 'Facile';
      case Difficulty.MEDIUM: return 'Moyen';
      case Difficulty.HARD: return 'Difficile';
      case Difficulty.CUSTOM: return 'Personnalisé';
      default: return '';
    }
  }

  get operationTypeLabel(): string {
    switch (this.customOperationType) {
      case OperationType.ADDITION: return 'Addition';
      case OperationType.SUBTRACTION: return 'Soustraction';
      case OperationType.MIXED: return 'Addition/Soustraction';
      default: return '';
    }
  }
}
