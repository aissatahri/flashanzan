import { TestBed } from '@angular/core/testing';
import { Difficulty, GameConfig, GameService, OperationType } from './game.service';

describe('GameService', () => {
  let service: GameService;

  const config = (overrides: Partial<GameConfig>): GameConfig => ({
    difficulty: Difficulty.CUSTOM,
    numberCount: 10,
    displayTime: 1000,
    minDigits: 1,
    maxDigits: 1,
    operationType: OperationType.ADDITION,
    ...overrides
  });

  const digits = (n: number) => String(Math.abs(n)).length;
  const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  afterEach(() => service.resetGame());

  it('génère des additions dont le nombre de chiffres respecte les bornes', () => {
    for (let run = 0; run < 200; run++) {
      const numbers = service['generateNumbers'](config({ minDigits: 2, maxDigits: 3 }));
      expect(numbers.length).toBe(10);
      numbers.forEach(n => {
        expect(n).toBeGreaterThan(0);
        expect(digits(n)).toBeGreaterThanOrEqual(2);
        expect(digits(n)).toBeLessThanOrEqual(3);
      });
    }
  });

  it('génère un mode mixte dans les bornes, avec un total toujours positif', () => {
    for (let run = 0; run < 200; run++) {
      const numbers = service['generateNumbers'](config({ operationType: OperationType.MIXED, numberCount: 20 }));
      expect(numbers[0]).toBeGreaterThan(0);
      let running = 0;
      numbers.forEach(n => {
        expect(digits(n)).toBe(1);
        running += n;
        expect(running).toBeGreaterThan(0);
      });
    }
  });

  it('génère une soustraction : un nombre de départ puis uniquement des soustractions dans les bornes', () => {
    for (let run = 0; run < 200; run++) {
      const numbers = service['generateNumbers'](config({ operationType: OperationType.SUBTRACTION, numberCount: 15 }));
      const [start, ...rest] = numbers;
      expect(start).toBeGreaterThan(0);
      rest.forEach(n => {
        expect(n).toBeLessThan(0);
        expect(digits(n)).toBe(1);
      });
      let running = 0;
      numbers.forEach(n => {
        running += n;
        expect(running).toBeGreaterThan(0);
      });
      expect(digits(sum(numbers))).toBe(1);
    }
  });

  it('expose la configuration réellement jouée', () => {
    service.startGame(Difficulty.HARD);
    const current = service.getCurrentConfig();
    expect(current.difficulty).toBe(Difficulty.HARD);
    expect(current.displayTime).toBe(500);
    expect(current.minDigits).toBe(3);
  });

  it('expose la configuration personnalisée appliquée', () => {
    service.updateCustomConfig({ displayTime: 2500, minDigits: 2, maxDigits: 4, operationType: OperationType.MIXED });
    service.startGame(Difficulty.CUSTOM);
    const current = service.getCurrentConfig();
    expect(current.difficulty).toBe(Difficulty.CUSTOM);
    expect(current.displayTime).toBe(2500);
    expect(current.maxDigits).toBe(4);
    expect(current.operationType).toBe(OperationType.MIXED);
  });
});
