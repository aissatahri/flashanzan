import { TestBed } from '@angular/core/testing';
import { Badge, BadgeService } from './badge.service';
import { Difficulty, OperationType } from './game.service';
import { ScoreService } from './score.service';

describe('BadgeService', () => {
  let badgeService: BadgeService;
  let scoreService: ScoreService;

  const play = (isCorrect: boolean) => scoreService.addScore({
    difficulty: Difficulty.EASY,
    correctAnswer: 10,
    userAnswer: isCorrect ? 10 : 9,
    isCorrect,
    numbersCount: 5,
    digitsCount: '1',
    operationType: OperationType.ADDITION,
    displayTime: 1500
  });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    scoreService = TestBed.inject(ScoreService);
    badgeService = TestBed.inject(BadgeService);
  });

  afterEach(() => localStorage.clear());

  it('signale le badge débloqué par une nouvelle partie', () => {
    const unlocked: Badge[][] = [];
    badgeService.badgesUnlocked$.subscribe(badges => unlocked.push(badges));

    play(true);

    expect(unlocked.length).toBe(1);
    expect(unlocked[0].map(b => b.id)).toEqual(['first_game']);
  });

  it('ne signale un badge qu\'une seule fois', () => {
    const unlocked: Badge[][] = [];
    badgeService.badgesUnlocked$.subscribe(badges => unlocked.push(badges));

    play(true);
    play(true);

    expect(unlocked.length).toBe(1);
  });

  it('permet de débloquer le badge des 100 parties', () => {
    for (let i = 0; i < 100; i++) {
      play(i % 2 === 0);
    }
    const games100 = badgeService.getBadges().find(b => b.id === 'games_100');
    expect(games100?.unlocked).toBeTrue();
  });
});
