import { TestBed } from '@angular/core/testing';
import { StatStore } from './stat-store';
import { LevelStore } from './level-store';
import { BuildState, Character } from '@models';

const MOCK_CHARACTER: Character = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: ['warfare'],
};

const createMockState = (overrides: Partial<BuildState> = {}): BuildState => ({
  characterId: 'jorna',
  level: 5,
  ap: 6,
  sp: 4,
  stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
  obtainedAbilities: [],
  pinnedTrees: [],
  statHistory: [],
  boulderCircleStat: null,
  ...overrides,
});

describe('StatStore', () => {
  let store: StatStore;
  let levelStore: LevelStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatStore, LevelStore],
    });
    store = TestBed.inject(StatStore);
    levelStore = TestBed.inject(LevelStore);
    levelStore.setLevel(5);
  });

  describe('applyIncrementStat', () => {
    it('should increment stat and deduct SP', () => {
      const state = createMockState({ sp: 4 });
      const result = store.applyIncrementStat(state, 'STR');
      expect(result).not.toBeNull();
      expect(result!.stats['STR']).toBe(13);
      expect(result!.sp).toBe(3);
    });

    it('should return null when SP = 0', () => {
      const state = createMockState({ sp: 0 });
      expect(store.applyIncrementStat(state, 'STR')).toBeNull();
    });

    it('should add entry to statHistory', () => {
      const state = createMockState({ sp: 4 });
      const result = store.applyIncrementStat(state, 'STR');
      expect(result).not.toBeNull();
      expect(result!.statHistory.length).toBe(1);
      expect(result!.statHistory[0].stat).toBe('STR');
    });
  });

  describe('deriveStats', () => {
    it('should return base stats when there are no allocations', () => {
      const result = store.deriveStats(MOCK_CHARACTER.baseStats, []);
      expect(result).toEqual(MOCK_CHARACTER.baseStats);
    });

    it('should add 1 to a stat for a single allocation', () => {
      const result = store.deriveStats(MOCK_CHARACTER.baseStats, [
        { level: 2, order: 1, stat: 'STR' },
      ]);
      expect(result['STR']).toBe(11);
      expect(result).toEqual({ STR: 11, AGI: 8, PER: 7, VIT: 9, WIL: 6 });
    });

    it('should sum multiple allocations of the same stat', () => {
      const result = store.deriveStats(MOCK_CHARACTER.baseStats, [
        { level: 2, order: 1, stat: 'STR' },
        { level: 3, order: 1, stat: 'STR' },
        { level: 4, order: 1, stat: 'STR' },
      ]);
      expect(result['STR']).toBe(13);
      expect(result).toEqual({ STR: 13, AGI: 8, PER: 7, VIT: 9, WIL: 6 });
    });
  });

  describe('applyDecrementStat', () => {
    it('should decrement stat and add SP', () => {
      const state = createMockState({
        stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
        statHistory: [{ level: 2, order: 1, stat: 'STR' }],
      });
      const result = store.applyDecrementStat(state, 'STR', MOCK_CHARACTER);
      expect(result).not.toBeNull();
      expect(result!.stats['STR']).toBe(11);
      expect(result!.sp).toBe(5);
    });

    it('should return null when stat = base value', () => {
      const state = createMockState({
        stats: { STR: 10, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
      });
      expect(store.applyDecrementStat(state, 'STR', MOCK_CHARACTER)).toBeNull();
    });
  });
});
