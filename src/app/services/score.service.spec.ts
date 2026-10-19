import { TestBed } from '@angular/core/testing';
import { Difficulty, OperationType } from './game.service';
import { Score, ScoreService } from './score.service';

describe('ScoreService', () => {
  const newScore = (isCorrect: boolean): Omit<Score, 'id' | 'date' | 'timestamp'> => ({
    difficulty: Difficulty.EASY,
    correctAnswer: 10,
    userAnswer: isCorrect ? 10 : 9,
    isCorrect,
    numbersCount: 5,
    digitsCount: '1',
    operationType: OperationType.ADDITION,
    displayTime: 1500
  });

  const createService = (): ScoreService => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(ScoreService);
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('compte toutes les parties au-delà des 50 gardées dans l\'historique', () => {
    const service = createService();
    for (let i = 0; i < 120; i++) {
      service.addScore(newScore(true));
    }
    expect(service.getScores().length).toBe(50);
    const stats = service.getStats();
    expect(stats.totalGames).toBe(120);
    expect(stats.correctGames).toBe(120);
    expect(stats.bestStreak).toBe(120);
  });

  it('calcule les séries et le taux de réussite', () => {
    const service = createService();
    [true, true, true, false, true, true].forEach(ok => service.addScore(newScore(ok)));
    const stats = service.getStats();
    expect(stats.totalGames).toBe(6);
    expect(stats.incorrectGames).toBe(1);
    expect(stats.bestStreak).toBe(3);
    expect(stats.currentStreak).toBe(2);
    expect(stats.successRate).toBe(83.3);
  });

  it('conserve les compteurs après un rechargement', () => {
    createService().addScore(newScore(true));
    expect(createService().getStats().totalGames).toBe(1);
  });

  it('migre un ancien historique (libellés français, sans compteurs)', () => {
    const legacy = [
      { ...newScore(true), difficulty: 'Difficile', operationType: 'Soustraction', id: 'a', date: new Date().toISOString(), timestamp: 2 },
      { ...newScore(false), difficulty: 'Facile', operationType: 'Addition', id: 'b', date: new Date().toISOString(), timestamp: 1 }
    ];
    localStorage.setItem('flashanzan_scores', JSON.stringify(legacy));

    const service = createService();
    const [first, second] = service.getScores();
    expect(first.difficulty).toBe(Difficulty.HARD);
    expect(first.operationType).toBe(OperationType.SUBTRACTION);
    expect(second.difficulty).toBe(Difficulty.EASY);
    expect(service.getStats().totalGames).toBe(2);
    expect(service.getStats().currentStreak).toBe(1);
  });

  it('remet les compteurs à zéro avec l\'historique', () => {
    const service = createService();
    service.addScore(newScore(true));
    service.clearScores();
    expect(service.getStats().totalGames).toBe(0);
  });
});
