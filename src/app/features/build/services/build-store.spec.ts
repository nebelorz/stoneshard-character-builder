import { TestBed } from '@angular/core/testing';
import { BuildStore } from './build-store';
import { CharacterDataService } from '@features/character/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { QuestDataService } from '@shared/services';
import { BuildState, DEFAULT_ABILITY_IDS } from '@models';

const MOCK_QUESTS = [
  {
    id: 'boulder-circle',
    resource: 'sp' as const,
    label: 'Boulder Circle',
    tooltip: 'Grants 1 Stat Point',
    pointsPer: 1,
    max: 1,
  },
];

function getReadyState(s: BuildStore): BuildState {
  const snapshot = s.stateSnapshot();
  if (!snapshot || !('characterId' in snapshot)) {
    throw new Error('Store is not ready');
  }
  return snapshot as BuildState;
}

function restoreLevelState(s: BuildStore, level: number): void {
  s.restoreState({
    characterId: 'jorna',
    level,
    ap: 2 + (level - 1),
    sp: level - 1,
    stats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
    obtainedAbilities: [],
    pinnedTrees: [],
    statHistory: [],
    bonusSlots: [],
    notes: { buildName: '', author: '', content: '' },
  });
}

const MOCK_CHARACTERS = [
  {
    id: 'jorna',
    name: 'Jorna',
    title: 'The Bold',
    race: 'Human (Skadian)',
    gender: 'Female',
    trait: { name: 'Brave', description: '+10% Crit Chance' },
    baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
    traitsUnlockedOnStart: ['warfare'],
  },
  {
    id: 'aldor',
    name: 'Aldor',
    title: 'The Wise',
    race: 'Elf (Jacinth)',
    gender: 'Male',
    trait: { name: 'Studious', description: '+15% Skill XP' },
    baseStats: { STR: 6, AGI: 8, PER: 9, VIT: 7, WIL: 10 },
    traitsUnlockedOnStart: ['geomancy'],
    traitGains: [
      {
        id: 'warfare-mastery',
        resource: 'ap',
        label: 'Warfare abilities learned',
        formula: 'abilities-per-3',
        treeId: 'warfare',
      },
    ],
  },
];

const MOCK_ABILITIES = [
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
  {
    id: 'survival-1',
    name: 'Butchering',
    treeId: 'survival',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'PER',
    requires: [],
    unlockConditions: [],
    description: 'Harvest resources',
    requiredBy: ['survival-2'],
  },
  {
    id: 'survival-2',
    name: 'Skinning',
    treeId: 'survival',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'PER',
    requires: ['survival-1'],
    unlockConditions: [],
    description: 'Improved skinning',
    requiredBy: [],
  },
];

describe('BuildStore', () => {
  let store: BuildStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BuildStore,
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              value: () => MOCK_CHARACTERS,
              status: () => 'ready' as const,
              error: () => null,
              reload: () => {},
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => MOCK_ABILITIES,
              status: () => 'ready' as const,
              error: () => null,
              reload: () => {},
            },
          },
        },
        {
          provide: QuestDataService,
          useValue: {
            quests: {
              value: () => MOCK_QUESTS,
              status: () => 'ready' as const,
              error: () => null,
              reload: () => {},
            },
          },
        },
      ],
    });
    store = TestBed.inject(BuildStore);
    store.initialize();
  });

  it('should initialize with default character state', () => {
    const state = getReadyState(store);
    expect(state.characterId).toBe('jorna');
    expect(state.level).toBe(30);
    expect(state.ap).toBe(31);
    expect(state.sp).toBe(29);
    expect(state.stats).toEqual({ STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 });
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.pinnedTrees).toEqual([]);
  });

  describe('Level management', () => {
    it('should increment level and gain AP/SP', () => {
      restoreLevelState(store, 1);
      store.levelUp();
      const state = getReadyState(store);
      expect(state.level).toBe(2);
      expect(state.ap).toBe(3);
      expect(state.sp).toBe(1);
    });

    it('should not exceed max level 30', () => {
      restoreLevelState(store, 29);
      store.levelUp();
      expect(getReadyState(store).level).toBe(30);
      store.levelUp();
      expect(getReadyState(store).level).toBe(30);
    });

    it('should decrement level and lose AP/SP', () => {
      restoreLevelState(store, 3);
      store.levelDown();
      const state = getReadyState(store);
      expect(state.level).toBe(2);
      expect(state.ap).toBe(3);
      expect(state.sp).toBe(1);
    });

    it('should not decrement below level 1', () => {
      restoreLevelState(store, 1);
      store.levelDown();
      expect(getReadyState(store).level).toBe(1);
    });
  });

  describe('Stat allocation', () => {
    it('should increment stat and deduct SP', () => {
      store.incrementStat('STR');
      const state = getReadyState(store);
      expect(state.stats['STR']).toBe(11);
      expect(state.sp).toBe(28);
    });

    it('should not increment with 0 SP', () => {
      restoreLevelState(store, 1);
      store.incrementStat('STR');
      expect(getReadyState(store).stats['STR']).toBe(10);
    });
  });

  describe('Ability obtain', () => {
    it('should obtain ability with no requirements', () => {
      const result = store.obtainAbility('warfare-1');
      expect(result).toBe(true);
      const state = getReadyState(store);
      expect(state.ap).toBe(30);
      expect(state.obtainedAbilities.length).toBe(1);
    });

    it('should not obtain ability without meeting requirements', () => {
      const result = store.obtainAbility('warfare-2');
      expect(result).toBe(false);
    });
  });

  describe('Ability refund', () => {
    it('should refund ability and return AP', () => {
      store.obtainAbility('warfare-1');
      const result = store.refundAbility('warfare-1');
      expect(result).toBe(true);
      const state = getReadyState(store);
      expect(state.ap).toBe(31);
      expect(state.obtainedAbilities.length).toBe(0);
    });

    it('should cascade refund to children', () => {
      store.obtainAbility('warfare-1');
      store.obtainAbility('warfare-2');
      store.obtainAbility('warfare-4');
      store.refundAbility('warfare-1');
      const state = getReadyState(store);
      expect(state.obtainedAbilities.length).toBe(0);
      expect(state.ap).toBe(31);
    });
  });

  describe('Reset', () => {
    it('should reset to character defaults', () => {
      store.levelUp();
      store.incrementStat('STR');
      store.obtainAbility('warfare-1');
      store.reset();
      const state = getReadyState(store);
      expect(state.level).toBe(30);
      expect(state.ap).toBe(31);
      expect(state.sp).toBe(29);
      expect(state.stats).toEqual({ STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 });
      expect(state.obtainedAbilities).toEqual([]);
    });
  });

  describe('Character selection', () => {
    it('should transfer the build when selecting a different character', () => {
      store.levelUp();
      store.incrementStat('STR');
      store.obtainAbility('warfare-1');
      store.pinTree('warfare');
      store.selectCharacter('aldor');
      const state = getReadyState(store);
      expect(state.characterId).toBe('aldor');
      expect(state.level).toBe(30);
      expect(state.ap).toBe(30);
      expect(state.sp).toBe(28);
      expect(state.obtainedAbilities.length).toBe(1);
      expect(state.pinnedTrees).toContain('warfare');
      expect(state.statHistory).toEqual([{ level: 2, order: 1, stat: 'STR' }]);
      expect(state.stats).toEqual({ STR: 7, AGI: 8, PER: 9, VIT: 7, WIL: 10 });
    });

    it('should be a no-op when selecting the already-selected character', () => {
      store.incrementStat('STR');
      const before = getReadyState(store);
      store.selectCharacter('jorna');
      expect(getReadyState(store)).toEqual(before);
    });

    it('should be a no-op when selecting an unknown character', () => {
      store.incrementStat('STR');
      const before = getReadyState(store);
      store.selectCharacter('unknown');
      expect(getReadyState(store)).toEqual(before);
    });
  });

  describe('Tree pinning', () => {
    it('should pin a tree', () => {
      store.pinTree('warfare');
      expect(getReadyState(store).pinnedTrees).toContain('warfare');
    });

    it('should unpin a tree', () => {
      store.pinTree('warfare');
      store.unpinTree('warfare');
      expect(getReadyState(store).pinnedTrees).not.toContain('warfare');
    });

    it('should not pin same tree twice', () => {
      store.pinTree('warfare');
      store.pinTree('warfare');
      expect(getReadyState(store).pinnedTrees.filter((t) => t === 'warfare').length).toBe(1);
    });
  });

  describe('resetTree', () => {
    it('should remove only the specified tree abilities and restore AP', () => {
      store.obtainAbility('warfare-1');
      store.obtainAbility('warfare-2');
      store.obtainAbility('survival-2');
      const before = getReadyState(store);
      expect(before.ap).toBe(28);
      expect(before.obtainedAbilities.length).toBe(3);

      store.resetTree('warfare');
      const after = getReadyState(store);
      expect(after.obtainedAbilities.length).toBe(1);
      expect(after.obtainedAbilities[0].abilityId).toBe('survival-2');
      expect(after.ap).toBe(30);
    });

    it('should be a no-op when no abilities from that tree are obtained', () => {
      store.obtainAbility('warfare-1');
      const before = getReadyState(store);
      store.resetTree('survival');
      expect(getReadyState(store)).toEqual(before);
    });

    it('should not affect other trees abilities', () => {
      store.obtainAbility('warfare-1');
      store.obtainAbility('warfare-2');
      store.obtainAbility('survival-2');
      store.resetTree('survival');
      const after = getReadyState(store);
      expect(after.obtainedAbilities.length).toBe(2);
      expect(after.obtainedAbilities.map((a) => a.abilityId)).toEqual(['warfare-1', 'warfare-2']);
    });

    it('should preserve pin state after reset', () => {
      store.pinTree('warfare');
      store.obtainAbility('warfare-1');
      store.resetTree('warfare');
      expect(getReadyState(store).pinnedTrees).toContain('warfare');
    });

    it('should not include DEFAULT_ABILITY_IDS in obtainedAbilities', () => {
      const state = getReadyState(store);
      for (const id of DEFAULT_ABILITY_IDS) {
        expect(state.obtainedAbilities.some((a) => a.abilityId === id)).toBe(false);
      }
    });
  });

  describe('stateSnapshot before initialization', () => {
    it('should return an explicit not-ready result instead of null or throw', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          BuildStore,
          {
            provide: CharacterDataService,
            useValue: {
              characters: {
                value: () => [],
                status: () => 'idle' as const,
                error: () => null,
                reload: () => {},
              },
            },
          },
          {
            provide: AbilityDataService,
            useValue: {
              abilities: {
                value: () => [],
                status: () => 'idle' as const,
                error: () => null,
                reload: () => {},
              },
            },
          },
        ],
      });
      const uninitializedStore = TestBed.inject(BuildStore);

      expect(() => uninitializedStore.stateSnapshot()).not.toThrow();
      const result = uninitializedStore.stateSnapshot();
      expect(result).toEqual({ ready: false });
    });

    it('should re-initialize store on retry after failed init', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          BuildStore,
          {
            provide: CharacterDataService,
            useValue: {
              characters: {
                value: () => [],
                status: () => 'error' as const,
                error: () => ({ message: 'Failed to load' }),
                reload: () => {},
              },
            },
          },
          {
            provide: AbilityDataService,
            useValue: {
              abilities: {
                value: () => [],
                status: () => 'error' as const,
                error: () => ({ message: 'Failed to load' }),
                reload: () => {},
              },
            },
          },
        ],
      });
      const retryStore = TestBed.inject(BuildStore);

      retryStore.initialize();
      expect(retryStore.stateSnapshot()).toEqual({ ready: false });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          BuildStore,
          {
            provide: CharacterDataService,
            useValue: {
              characters: {
                value: () => MOCK_CHARACTERS,
                status: () => 'ready' as const,
                error: () => null,
                reload: () => {},
              },
            },
          },
          {
            provide: AbilityDataService,
            useValue: {
              abilities: {
                value: () => MOCK_ABILITIES,
                status: () => 'ready' as const,
                error: () => null,
                reload: () => {},
              },
            },
          },
        ],
      });
      const retryStore2 = TestBed.inject(BuildStore);

      retryStore2.initialize();

      const state = getReadyState(retryStore2);
      expect(state.characterId).toBe('jorna');
    });
  });

  describe('restoreState', () => {
    it('should restore from URL state', () => {
      const state = {
        characterId: 'jorna',
        level: 5,
        ap: 6,
        sp: 4,
        stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
        obtainedAbilities: [{ abilityId: 'warfare-1', level: 1, order: 1 }],
        pinnedTrees: ['warfare'],
        statHistory: [{ level: 2, order: 1, stat: 'STR' as const }],
        bonusSlots: [],
        notes: { buildName: '', author: '', content: '' },
      };
      store.restoreState(state);
      const restored = getReadyState(store);
      expect(restored.level).toBe(5);
      expect(restored.obtainedAbilities.length).toBe(1);
      expect(restored.pinnedTrees).toContain('warfare');
    });
  });

  describe('Bonus slot allocation', () => {
    it('mutates build state when a quest slot is allocated and deallocated', () => {
      store.allocateBonusSlot('boulder-circle', 0, 'STR');
      let state = getReadyState(store);
      expect(state.bonusSlots).toEqual([{ sourceId: 'boulder-circle', index: 0, stat: 'STR' }]);

      store.deallocateBonusSlot('boulder-circle', 0);
      state = getReadyState(store);
      expect(state.bonusSlots).toEqual([]);
    });

    it('keeps quest slots across character changes', () => {
      store.allocateBonusSlot('boulder-circle', 0, 'STR');
      store.selectCharacter('aldor');
      const state = getReadyState(store);
      expect(state.bonusSlots).toEqual([{ sourceId: 'boulder-circle', index: 0, stat: 'STR' }]);
    });

    it('clears quest slots on full reset', () => {
      store.allocateBonusSlot('boulder-circle', 0, 'STR');
      store.reset();
      expect(getReadyState(store).bonusSlots).toEqual([]);
    });
  });

  describe('Derived trait AP budget', () => {
    function restoreAldorDerivedState(s: BuildStore, level: number): void {
      s.restoreState({
        characterId: 'aldor',
        level,
        ap: -1,
        sp: 5,
        stats: { STR: 6, AGI: 8, PER: 9, VIT: 7, WIL: 10 },
        obtainedAbilities: [
          { abilityId: 'warfare-1', level: 1, order: 1 },
          { abilityId: 'warfare-2', level: 2, order: 2 },
          { abilityId: 'warfare-3', level: 3, order: 3 },
        ],
        pinnedTrees: [],
        statHistory: [],
        bonusSlots: [],
        notes: { buildName: '', author: '', content: '' },
      });
    }

    it('should preserve the total budget on character switches', () => {
      restoreAldorDerivedState(store, 5);
      expect(store.derivedTraitAp()).toBe(1);
      expect(store.totalAp()).toBe(0);

      store.selectCharacter('jorna');
      expect(getReadyState(store).ap).toBe(0);
      expect(store.derivedTraitAp()).toBe(0);
      expect(store.totalAp()).toBe(0);

      store.selectCharacter('aldor');
      expect(getReadyState(store).ap).toBe(-1);
      expect(store.derivedTraitAp()).toBe(1);
      expect(store.totalAp()).toBe(0);
    });

    it('should clamp restored ap up to the derived floor', () => {
      store.restoreState({
        characterId: 'aldor',
        level: 5,
        ap: -5,
        sp: 5,
        stats: { STR: 6, AGI: 8, PER: 9, VIT: 7, WIL: 10 },
        obtainedAbilities: [
          { abilityId: 'warfare-1', level: 1, order: 1 },
          { abilityId: 'warfare-2', level: 2, order: 2 },
          { abilityId: 'warfare-3', level: 3, order: 3 },
        ],
        pinnedTrees: [],
        statHistory: [],
        bonusSlots: [],
        notes: { buildName: '', author: '', content: '' },
      });
      expect(getReadyState(store).ap).toBe(-1);
      expect(store.totalAp()).toBe(0);
    });

    it('should apply level-down with negative ap without branching on its sign', () => {
      restoreAldorDerivedState(store, 5);
      store.levelDown();
      const state = getReadyState(store);
      expect(state.level).toBe(4);
      expect(state.ap).toBe(-2);
      expect(state.obtainedAbilities.length).toBe(3);
    });

    it('should shrink the derived AP budget when abilities are refunded', () => {
      restoreAldorDerivedState(store, 5);
      expect(store.derivedTraitAp()).toBe(1);

      store.refundAbility('warfare-1');

      expect(store.derivedTraitAp()).toBe(0);
      expect(getReadyState(store).obtainedAbilities.length).toBe(0);
    });
  });
});
