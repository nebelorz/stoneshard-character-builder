import { TestBed } from '@angular/core/testing';
import { AbilityStore } from './ability-store';
import { LevelStore } from '@features/character/services';
import { BuildState, Ability } from '@models';

const MOCK_ABILITIES: Ability[] = [
  {
    id: 'warfare-1',
    name: 'War Cry',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'attack',
    target: 'No Target',
    range: 1,
    energy: 10,
    cooldown: 12,
    modifiedByLabel: 'STR',
    requires: [],
    unlockConditions: [],
    description: 'Boost morale',
    requiredBy: ['warfare-2', 'warfare-3'],
  },
  {
    id: 'warfare-2',
    name: 'Battle Focus',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'STR',
    requires: ['warfare-1'],
    unlockConditions: [],
    description: 'Improved focus',
    requiredBy: ['warfare-4'],
  },
  {
    id: 'warfare-3',
    name: 'Shield Bash',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'attack',
    target: 'Target Object',
    range: 1,
    energy: 15,
    cooldown: 8,
    modifiedByLabel: 'STR',
    requires: ['warfare-1'],
    unlockConditions: [],
    description: 'Bash with shield',
    requiredBy: [],
  },
  {
    id: 'warfare-4',
    name: 'War Master',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'STR',
    requires: ['warfare-2'],
    unlockConditions: [],
    description: 'Master of war',
    requiredBy: [],
  },
];

const createMockState = (overrides: Partial<BuildState> = {}): BuildState => ({
  characterId: 'jorna',
  level: 5,
  ap: 6,
  sp: 4,
  stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
  obtainedAbilities: [],
  pinnedTrees: [],
  statHistory: [],
  ...overrides,
});

describe('AbilityStore', () => {
  let store: AbilityStore;
  let levelStore: LevelStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbilityStore, LevelStore],
    });
    store = TestBed.inject(AbilityStore);
    levelStore = TestBed.inject(LevelStore);
    levelStore.setLevel(5);
  });

  describe('applyObtainAbility', () => {
    it('should obtain ability with no requirements', () => {
      const state = createMockState({ ap: 2 });
      const result = store.applyObtainAbility(state, 'warfare-1', MOCK_ABILITIES);
      expect(result).not.toBeNull();
      expect(result!.ap).toBe(1);
      expect(result!.obtainedAbilities.length).toBe(1);
      expect(result!.obtainedAbilities[0].abilityId).toBe('warfare-1');
    });

    it('should return false when AP = 0', () => {
      const state = createMockState({ ap: 0 });
      expect(store.applyObtainAbility(state, 'warfare-1', MOCK_ABILITIES)).toBeNull();
    });

    it('should return false when requirements not met', () => {
      const state = createMockState({ ap: 2 });
      expect(store.applyObtainAbility(state, 'warfare-2', MOCK_ABILITIES)).toBeNull();
    });

    it('should return false when already obtained', () => {
      const state = createMockState({
        ap: 1,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 1, order: 1 }],
      });
      expect(store.applyObtainAbility(state, 'warfare-1', MOCK_ABILITIES)).toBeNull();
    });

    it('should obtain ability after meeting requirements', () => {
      const state = createMockState({
        ap: 2,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 1, order: 1 }],
      });
      const result = store.applyObtainAbility(state, 'warfare-2', MOCK_ABILITIES);
      expect(result).not.toBeNull();
      expect(result!.ap).toBe(1);
      expect(result!.obtainedAbilities.length).toBe(2);
    });

    it('should treat default active abilities as satisfying prerequisites', () => {
      const abilities: Ability[] = [
        ...MOCK_ABILITIES,
        {
          id: 'survival-4',
          name: 'Forage',
          treeId: 'survival',
          x: 0,
          y: 0,
          type: 'passive',
          target: 'No Target',
          range: 1,
          energy: 0,
          cooldown: 0,
          modifiedByLabel: '',
          requires: ['survival-1'],
          unlockConditions: [],
          description: 'Forage for food',
          requiredBy: [],
        },
      ];
      const state = createMockState({ ap: 2 });
      const result = store.applyObtainAbility(state, 'survival-4', abilities);
      expect(result).not.toBeNull();
      expect(result!.obtainedAbilities.map((a) => a.abilityId)).toContain('survival-4');
      expect(result!.ap).toBe(1);
    });

    it('should not allow obtaining a default active ability', () => {
      const abilities: Ability[] = [
        ...MOCK_ABILITIES,
        {
          id: 'survival-1',
          name: 'Butchering',
          treeId: 'survival',
          x: 0,
          y: 0,
          type: 'passive',
          target: 'Target Object',
          range: 1,
          energy: 0,
          cooldown: 0,
          modifiedByLabel: '',
          requires: [],
          unlockConditions: [],
          description: 'Carve carcasses for meat',
          requiredBy: ['survival-4', 'survival-5'],
        },
      ];
      const state = createMockState({ ap: 2 });
      expect(store.applyObtainAbility(state, 'survival-1', abilities)).toBeNull();
    });
  });

  describe('applyRefundAbility', () => {
    it('should refund ability and return AP', () => {
      const state = createMockState({
        ap: 1,
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 1, order: 1 }],
      });
      const result = store.applyRefundAbility(state, 'warfare-1', MOCK_ABILITIES);
      expect(result).not.toBeNull();
      expect(result!.ap).toBe(2);
      expect(result!.obtainedAbilities.length).toBe(0);
    });

    it('should cascade refund to children', () => {
      const state = createMockState({
        ap: 0,
        obtainedAbilities: [
          { abilityId: 'warfare-1', level: 1, order: 1 },
          { abilityId: 'warfare-2', level: 2, order: 2 },
          { abilityId: 'warfare-4', level: 3, order: 3 },
        ],
      });
      const result = store.applyRefundAbility(state, 'warfare-1', MOCK_ABILITIES);
      expect(result).not.toBeNull();
      expect(result!.obtainedAbilities.length).toBe(0);
      expect(result!.ap).toBe(3);
    });

    it('should return null when not obtained', () => {
      const state = createMockState();
      expect(store.applyRefundAbility(state, 'warfare-1', MOCK_ABILITIES)).toBeNull();
    });
  });
});
