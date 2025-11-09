import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'ar' | 'fr' | 'en';

export interface Translation {
  // Header
  appTitle: string;
  subtitle: string;
  
  // Difficulty
  chooseDifficulty: string;
  easy: string;
  medium: string;
  hard: string;
  custom: string;
  
  // Custom options
  customizeChallenge: string;
  problemType: string;
  addition: string;
  subtraction: string;
  mixed: string;
  minDigits: string;
  maxDigits: string;
  numbersPerProblem: string;
  displayTime: string;
  numberOfDigits: string;
  numbersRange: string;
  digitsRange: string;
  minDigitsHint: string;
  maxDigitsHint: string;
  
  // Difficulty hints
  veryEasy: string;
  easyLevel: string;
  mediumLevel: string;
  hardLevel: string;
  veryHard: string;
  
  // Speed hints
  veryFast: string;
  fast: string;
  normal: string;
  slow: string;
  
  // Buttons
  start: string;
  newGame: string;
  retry: string;
  close: string;
  validate: string;
  cancel: string;
  retrySequence: string;
  viewSolution: string;
  
  // Game
  numbersShown: string;
  score: string;
  
  // Answer modal
  enterAnswer: string;
  yourAnswer: string;
  
  // Results
  bravo: string;
  sorry: string;
  wrongAnswer: string;
  tryAgain: string;
  correctAnswer: string;
  calculation: string;
}

const translations: Record<Language, Translation> = {
  fr: {
    appTitle: 'FlashAnzan',
    subtitle: 'Entraînement au calcul mental japonais',
    chooseDifficulty: 'Choisissez votre niveau',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    custom: 'Personnalisé',
    customizeChallenge: 'Personnaliser le défi',
    problemType: 'Type de problème :',
    addition: 'Addition',
    subtraction: 'Soustraction',
    mixed: 'Mixte',
    minDigits: 'Nombre minimum de chiffres :',
    maxDigits: 'Nombre maximum de chiffres :',
    numbersPerProblem: 'Nombre d\'opérations',
    displayTime: 'Temps d\'affichage',
    numberOfDigits: 'Nombre de chiffres',
    numbersRange: 'Entre 3 et 50 nombres',
    digitsRange: 'Entre 1 et 5 chiffres',
    minDigitsHint: 'Nombre minimum de chiffres par nombre (1-5)',
    maxDigitsHint: 'Nombre maximum de chiffres par nombre (1-5)',
    veryEasy: '🟢 Très facile',
    easyLevel: '🟡 Facile',
    mediumLevel: '🟠 Moyen',
    hardLevel: '🔴 Difficile',
    veryHard: '⚫ Très difficile',
    veryFast: '⚡ Très rapide',
    fast: '🚀 Rapide',
    normal: '✅ Normal',
    slow: '🐢 Lent',
    start: 'Commencer',
    newGame: 'Nouveau jeu',
    retry: 'Recommencer',
    close: 'Fermer',
    validate: 'Valider',
    cancel: 'Annuler',
    retrySequence: 'Recommencer cette suite',
    viewSolution: 'Voir la solution',
    numbersShown: 'nombres affichés',
    score: 'Score',
    enterAnswer: 'Entrez votre réponse',
    yourAnswer: 'Votre réponse :',
    bravo: 'Bravo !',
    sorry: 'Dommage !',
    wrongAnswer: 'Ce n\'est pas la bonne réponse...',
    tryAgain: 'Réessayez pour vous améliorer !',
    correctAnswer: 'Réponse correcte :',
    calculation: 'Calcul :'
  },
  en: {
    appTitle: 'FlashAnzan',
    subtitle: 'Japanese Mental Arithmetic Training',
    chooseDifficulty: 'Choose your level',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    custom: 'Custom',
    customizeChallenge: 'Customize the challenge',
    problemType: 'Problem type:',
    addition: 'Addition',
    subtraction: 'Subtraction',
    mixed: 'Mixed',
    minDigits: 'Minimum digits:',
    maxDigits: 'Maximum digits:',
    numbersPerProblem: 'Number of operations',
    displayTime: 'Display time',
    numberOfDigits: 'Number of digits',
    numbersRange: 'Between 3 and 50 numbers',
    digitsRange: 'Between 1 and 5 digits',
    minDigitsHint: 'Minimum digits per number (1-5)',
    maxDigitsHint: 'Maximum digits per number (1-5)',
    veryEasy: '🟢 Very easy',
    easyLevel: '🟡 Easy',
    mediumLevel: '🟠 Medium',
    hardLevel: '🔴 Hard',
    veryHard: '⚫ Very hard',
    veryFast: '⚡ Very fast',
    fast: '🚀 Fast',
    normal: '✅ Normal',
    slow: '🐢 Slow',
    start: 'Start',
    newGame: 'New Game',
    retry: 'Retry',
    close: 'Close',
    validate: 'Validate',
    cancel: 'Cancel',
    retrySequence: 'Retry this sequence',
    viewSolution: 'View solution',
    numbersShown: 'numbers shown',
    score: 'Score',
    enterAnswer: 'Enter your answer',
    yourAnswer: 'Your answer:',
    bravo: 'Well done!',
    sorry: 'Sorry!',
    wrongAnswer: 'That\'s not the right answer...',
    tryAgain: 'Try again to improve!',
    correctAnswer: 'Correct answer:',
    calculation: 'Calculation:'
  },
  ar: {
    appTitle: 'فلاش أنزان',
    subtitle: 'تدريب الحساب الذهني الياباني',
    chooseDifficulty: 'اختر مستواك',
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    custom: 'مخصص',
    customizeChallenge: 'تخصيص التحدي',
    problemType: 'نوع المسألة:',
    addition: 'جمع',
    subtraction: 'طرح',
    mixed: 'مختلط',
    minDigits: 'الحد الأدنى من الأرقام:',
    maxDigits: 'الحد الأقصى من الأرقام:',
    numbersPerProblem: 'عدد العمليات',
    displayTime: 'وقت العرض',
    numberOfDigits: 'عدد الأرقام',
    numbersRange: 'بين 3 و 50 رقم',
    digitsRange: 'بين 1 و 5 أرقام',
    minDigitsHint: 'الحد الأدنى من الأرقام لكل عدد (1-5)',
    maxDigitsHint: 'الحد الأقصى من الأرقام لكل عدد (1-5)',
    veryEasy: '🟢 سهل جداً',
    easyLevel: '🟡 سهل',
    mediumLevel: '🟠 متوسط',
    hardLevel: '🔴 صعب',
    veryHard: '⚫ صعب جداً',
    veryFast: '⚡ سريع جداً',
    fast: '🚀 سريع',
    normal: '✅ عادي',
    slow: '🐢 بطيء',
    start: 'ابدأ',
    newGame: 'لعبة جديدة',
    retry: 'إعادة المحاولة',
    close: 'إغلاق',
    validate: 'تأكيد',
    cancel: 'إلغاء',
    retrySequence: 'إعادة هذا التسلسل',
    viewSolution: 'عرض الحل',
    numbersShown: 'أرقام معروضة',
    score: 'النتيجة',
    enterAnswer: 'أدخل إجابتك',
    yourAnswer: 'إجابتك:',
    bravo: 'أحسنت!',
    sorry: 'للأسف!',
    wrongAnswer: 'هذه ليست الإجابة الصحيحة...',
    tryAgain: 'حاول مرة أخرى للتحسين!',
    correctAnswer: 'الإجابة الصحيحة:',
    calculation: 'الحساب:'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>(this.getDefaultLanguage());
  private translations$ = new BehaviorSubject<Translation>(translations[this.getDefaultLanguage()]);

  constructor() {
    this.currentLanguage$.subscribe(lang => {
      this.translations$.next(translations[lang]);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  private getDefaultLanguage(): Language {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  }

  get currentLanguage(): Language {
    return this.currentLanguage$.value;
  }

  get translations(): Observable<Translation> {
    return this.translations$.asObservable();
  }

  get t(): Translation {
    return this.translations$.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
    return [
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' }
    ];
  }
}
