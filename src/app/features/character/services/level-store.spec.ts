import { TestBed } from '@angular/core/testing';
import { LevelStore, buildLevelActionMap } from './level-store';
import { BuildState, StatAssignment } from '@models';

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
  notes: { buildName: '', author: '', content: '' },
  ...overrides,
});

describe('LevelStore', () => {
  let store: LevelStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelStore],
    });
    store = TestBed.inject(LevelStore);
  });

  it('should initialize with level 30', () => {
    expect(store.level()).toBe(30);
  });

  describe('canLevelUp', () => {
    it('should be true when level < 30', () => {
      store.setLevel(1);
      expect(store.canLevelUp()).toBe(true);
    });

    it('should be false when level = 30', () => {
      store.setLevel(30);
      expect(store.canLevelUp()).toBe(false);
    });
  });

  describe('canLevelDown', () => {
    it('should be false when level = 1', () => {
      const state = createMockState({ level: 1 });
      expect(store.canLevelDown(state)).toBe(false);
    });

    it('should be true when level > 1 and no actions at current level', () => {
      const state = createMockState({ level: 5 });
      expect(store.canLevelDown(state)).toBe(true);
    });

    it('should be false when abilities are allocated at current level', () => {
      const state = createMockState({
        level: 5,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 5, order: 1 }],
      });
      expect(store.canLevelDown(state)).toBe(false);
    });

    it('should be false when stats are allocated at current level', () => {
      const state = createMockState({
        level: 5,
        statHistory: [{ level: 5, order: 1, stat: 'STR' }],
      });
      expect(store.canLevelDown(state)).toBe(false);
    });

    it('should be true when actions exist only at lower levels', () => {
      const state = createMockState({
        level: 3,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 1, order: 1 }],
      });
      expect(store.canLevelDown(state)).toBe(true);
    });
  });

  describe('applyLevelUp', () => {
    it('should increment level and AP/SP', () => {
      const state = createMockState();
      const result = store.applyLevelUp(state);
      expect(result).not.toBeNull();
      expect(result!.level).toBe(6);
      expect(result!.ap).toBe(7);
      expect(result!.sp).toBe(5);
    });

    it('should return null at max level', () => {
      const state = createMockState({ level: 30 });
      expect(store.applyLevelUp(state)).toBeNull();
    });
  });

  describe('applyLevelDown', () => {
    it('should decrement level and AP/SP', () => {
      const state = createMockState();
      const result = store.applyLevelDown(state);
      expect(result).not.toBeNull();
      expect(result!.level).toBe(4);
      expect(result!.ap).toBe(5);
      expect(result!.sp).toBe(3);
    });

    it('should return null at min level', () => {
      const state = createMockState({ level: 1 });
      expect(store.applyLevelDown(state)).toBeNull();
    });

    it('should return null when abilities exist at current level', () => {
      const state = createMockState({
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 5, order: 1 }],
      });
      expect(store.applyLevelDown(state)).toBeNull();
    });

    it('should truncate abilities and stats to new level capacity', () => {
      const state = createMockState({
        level: 4,
        obtainedAbilities: [
          { abilityId: 'a1', level: 1, order: 1 },
          { abilityId: 'a2', level: 1, order: 2 },
          { abilityId: 'a3', level: 2, order: 3 },
          { abilityId: 'a4', level: 3, order: 4 },
          { abilityId: 'a5', level: 3, order: 5 },
        ],
        statHistory: [
          { level: 2, order: 1, stat: 'STR' as const },
          { level: 2, order: 2, stat: 'AGI' as const },
          { level: 3, order: 1, stat: 'VIT' as const },
          { level: 3, order: 2, stat: 'WIL' as const },
        ],
      });
      const result = store.applyLevelDown(state);
      expect(result).not.toBeNull();
      expect(result!.level).toBe(3);
      expect(result!.obtainedAbilities.length).toBe(4);
      expect(result!.statHistory.length).toBe(2);
    });
  });

  describe('getRouteLevelForAbility', () => {
    it('should return 1 for first ability', () => {
      expect(store.getRouteLevelForAbility([])).toBe(1);
    });

    it('should return 2 when level 1 is full', () => {
      const obtained = [
        { abilityId: 'a1', level: 1, order: 1 },
        { abilityId: 'a2', level: 1, order: 2 },
      ];
      expect(store.getRouteLevelForAbility(obtained)).toBe(2);
    });
  });

  describe('getRouteLevelForStat', () => {
    it('should return 2 for first stat', () => {
      expect(store.getRouteLevelForStat([])).toBe(2);
    });

    it('should return 3 when level 2 is full', () => {
      const history: StatAssignment[] = [{ level: 2, order: 1, stat: 'STR' }];
      expect(store.getRouteLevelForStat(history)).toBe(3);
    });
  });

  describe('refund unblocks level-down', () => {
    it('should allow canLevelDown when ability at current level is refunded', () => {
      const stateWithAbility = createMockState({
        level: 2,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 2, order: 1 }],
      });
      expect(store.canLevelDown(stateWithAbility)).toBe(false);

      const stateAfterRefund = createMockState({ level: 2 });
      expect(store.canLevelDown(stateAfterRefund)).toBe(true);
    });

    it('should allow canLevelDown when stat at current level is decremented', () => {
      const stateWithStat = createMockState({
        level: 2,
        statHistory: [{ level: 2, order: 1, stat: 'STR' }],
      });
      expect(store.canLevelDown(stateWithStat)).toBe(false);

      const stateAfterDecrement = createMockState({ level: 2 });
      expect(store.canLevelDown(stateAfterDecrement)).toBe(true);
    });
  });
});

describe('buildLevelActionMap', () => {
  it('should group abilities by level', () => {
    const state = createMockState({
      obtainedAbilities: [
        { abilityId: 'a1', level: 1, order: 1 },
        { abilityId: 'a2', level: 1, order: 2 },
        { abilityId: 'a3', level: 2, order: 3 },
      ],
    });
    const map = buildLevelActionMap(state);
    expect(map.get(1)!.abilities).toEqual(['a1', 'a2']);
    expect(map.get(2)!.abilities).toEqual(['a3']);
  });

  it('should group stats by level', () => {
    const state = createMockState({
      statHistory: [
        { level: 2, order: 1, stat: 'STR' },
        { level: 2, order: 2, stat: 'AGI' },
        { level: 3, order: 1, stat: 'VIT' },
      ],
    });
    const map = buildLevelActionMap(state);
    expect(map.get(2)!.stats).toEqual(['STR', 'AGI']);
    expect(map.get(3)!.stats).toEqual(['VIT']);
  });

  it('should return empty map for empty state', () => {
    const state = createMockState();
    const map = buildLevelActionMap(state);
    expect(map.size).toBe(0);
  });
});
