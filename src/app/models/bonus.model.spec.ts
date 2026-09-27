import {
  UNBOUNDED_SOURCE_MAX_ROWS,
  addBossRow,
  allocateBonusSlot,
  bonusCount,
  bonusSlotCeiling,
  bossRowCount,
  clearTraitSlots,
  deallocateBonusSlot,
  derivedTraitAp,
  isQuestSource,
  isUnboundedSource,
  removeBossRow,
  sanitizeBonusSlots,
} from './bonus.model';
import { BonusSlot, BuildState } from './build-state.model';
import { Character } from './character.model';
import { Ability } from './ability.model';

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

const VELMIR: Character = {
  id: 'velmir',
  name: 'Velmir',
  title: 'Revenger',
  race: 'Human (Skadian)',
  gender: 'Male',
  trait: { name: 'With Great Vengeance', description: 'Grants 2 Stat Points per boss.' },
  baseStats: { STR: 11, AGI: 11, PER: 11, VIT: 10, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [{ id: 'bosses', resource: 'sp', label: 'Bosses killed', pointsPer: 2 }],
};

const JORGRIM: Character = {
  id: 'jorgrim',
  name: 'Jorgrim',
  title: 'Reaver',
  race: 'Dwarf (Fjall)',
  gender: 'Male',
  trait: { name: 'Gore and Glory', description: 'Grants trophies points.' },
  baseStats: { STR: 11, AGI: 10, PER: 11, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [
    { id: 'trophies', resource: 'sp', label: 'Trophies delivered', pointsPer: 1, max: 5 },
  ],
};

const DIRWIN: Character = {
  id: 'dirwin',
  name: 'Dirwin',
  title: 'Woodward',
  race: 'Human (Aldor)',
  gender: 'Male',
  trait: { name: "Ranger's Grit", description: 'Dens and survival AP.' },
  baseStats: { STR: 10, AGI: 11, PER: 11, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [
    { id: 'dens', resource: 'sp', label: 'Dens cleared', pointsPer: 1, max: 3 },
    {
      id: 'survival',
      resource: 'ap',
      label: 'Survival abilities learned',
      formula: 'abilities-per-3',
      treeId: 'survival',
    },
  ],
};

const MAHIR: Character = {
  id: 'mahir',
  name: 'Mahir',
  title: 'Dervish',
  race: 'Elf (Jacinth)',
  gender: 'Male',
  trait: { name: 'Lifelong Journey', description: 'Per tree AP.' },
  baseStats: { STR: 10, AGI: 11, PER: 11, VIT: 10, WIL: 11 },
  traitsUnlockedOnStart: [],
  traitGains: [
    { id: 'trees', resource: 'ap', label: 'Ability trees mastered', formula: 'distinct-trees-6' },
  ],
};

const ABILITY_IDS = [
  'warfare-1',
  'warfare-2',
  'warfare-3',
  'survival-1',
  'survival-2',
  'survival-3',
  'survival-4',
  'survival-5',
  'survival-6',
  'survival-7',
  'pyromancy-1',
  'pyromancy-2',
  'pyromancy-3',
  'pyromancy-4',
  'pyromancy-5',
  'pyromancy-6',
  'athletics-1',
  'athletics-2',
  'athletics-3',
  'athletics-4',
  'athletics-5',
  'athletics-6',
];

const MOCK_ABILITIES: Ability[] = ABILITY_IDS.map((id) => ({
  id,
  name: id,
  treeId: id.split('-').slice(0, -1).join('-'),
  x: 0,
  y: 0,
  type: 'passive' as const,
  target: 'No Target' as const,
  range: 1,
  energy: 0,
  cooldown: 0,
  modifiedByLabel: 'PER',
  requires: [],
  unlockConditions: [],
  description: '',
  descriptionLines: [],
  requiredBy: [],
}));

function makeState(overrides: Partial<BuildState> = {}): BuildState {
  return {
    characterId: 'velmir',
    level: 30,
    ap: 31,
    sp: 29,
    stats: { STR: 10, AGI: 10, PER: 10, VIT: 10, WIL: 10 },
    obtainedAbilities: [],
    pinnedTrees: [],
    statHistory: [],
    bonusSlots: [],
    notes: { buildName: '', author: '', content: '' },
    ...overrides,
  };
}

describe('bonus.model', () => {
  describe('slot configuration', () => {
    it('exposes bounded slot lists from config', () => {
      expect(bonusSlotCeiling(JORGRIM, MOCK_QUESTS, 'trophies')).toBe(5);
      expect(bonusSlotCeiling(DIRWIN, MOCK_QUESTS, 'dens')).toBe(3);
      expect(bonusSlotCeiling(JORGRIM, MOCK_QUESTS, 'boulder-circle')).toBe(1);
    });

    it('exposes unbounded ceiling for unbounded sources', () => {
      expect(bonusSlotCeiling(VELMIR, MOCK_QUESTS, 'bosses')).toBe(20);
      expect(isUnboundedSource(VELMIR, 'bosses')).toBe(true);
      expect(isUnboundedSource(JORGRIM, 'trophies')).toBe(false);
    });

    it('returns null ceiling for unknown sources', () => {
      expect(bonusSlotCeiling(VELMIR, MOCK_QUESTS, 'unknown')).toBeNull();
    });
  });

  describe('allocateBonusSlot', () => {
    it('allocates a bounded slot', () => {
      const state = makeState();
      const next = allocateBonusSlot(state, 'trophies', 0, 'STR', JORGRIM, MOCK_QUESTS);
      expect(next?.bonusSlots).toEqual([{ sourceId: 'trophies', index: 0, stat: 'STR' }]);
    });

    it('reallocates a slot to another stat', () => {
      const state = makeState({
        bonusSlots: [{ sourceId: 'trophies', index: 0, stat: 'STR' }],
      });
      const next = allocateBonusSlot(state, 'trophies', 0, 'AGI', JORGRIM, MOCK_QUESTS);
      expect(next?.bonusSlots).toEqual([{ sourceId: 'trophies', index: 0, stat: 'AGI' }]);
    });

    it('rejects out-of-range bounded index', () => {
      const state = makeState();
      expect(allocateBonusSlot(state, 'trophies', 5, 'STR', JORGRIM, MOCK_QUESTS)).toBeNull();
      expect(allocateBonusSlot(state, 'trophies', -1, 'STR', JORGRIM, MOCK_QUESTS)).toBeNull();
    });

    it('rejects allocation of an unclaimed unbounded slot', () => {
      const state = makeState();
      expect(allocateBonusSlot(state, 'bosses', 0, 'STR', VELMIR, MOCK_QUESTS)).toBeNull();
    });

    it('allocates a claimed unbounded slot', () => {
      const state = makeState({
        bonusSlots: [
          { sourceId: 'bosses', index: 0, stat: null },
          { sourceId: 'bosses', index: 1, stat: null },
        ],
      });
      const next = allocateBonusSlot(state, 'bosses', 1, 'VIT', VELMIR, MOCK_QUESTS);
      expect(next?.bonusSlots).toEqual([
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'bosses', index: 1, stat: 'VIT' },
      ]);
    });
  });

  describe('deallocateBonusSlot', () => {
    it('removes the entry for a bounded source', () => {
      const state = makeState({
        bonusSlots: [
          { sourceId: 'trophies', index: 0, stat: 'STR' },
          { sourceId: 'boulder-circle', index: 0, stat: 'AGI' },
        ],
      });
      const next = deallocateBonusSlot(state, 'trophies', 0, JORGRIM);
      expect(next?.bonusSlots).toEqual([{ sourceId: 'boulder-circle', index: 0, stat: 'AGI' }]);
    });

    it('sets stat to null for an unbounded source, keeping the row', () => {
      const state = makeState({
        bonusSlots: [
          { sourceId: 'bosses', index: 0, stat: 'STR' },
          { sourceId: 'bosses', index: 1, stat: 'PER' },
        ],
      });
      const next = deallocateBonusSlot(state, 'bosses', 0, VELMIR);
      expect(next?.bonusSlots).toEqual([
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'bosses', index: 1, stat: 'PER' },
      ]);
    });

    it('is a no-op when the slot is not allocated', () => {
      const state = makeState({ bonusSlots: [{ sourceId: 'bosses', index: 0, stat: null }] });
      expect(deallocateBonusSlot(state, 'bosses', 0, VELMIR)).toBeNull();
      expect(deallocateBonusSlot(state, 'trophies', 0, JORGRIM)).toBeNull();
    });
  });

  describe('unbounded stepper', () => {
    it('starts at zero rows', () => {
      expect(bossRowCount(makeState(), 'bosses', VELMIR, MOCK_QUESTS)).toBe(0);
    });

    it('appends the configured slots per boss row', () => {
      const state = makeState();
      const next = addBossRow(state, 'bosses', VELMIR, MOCK_QUESTS);
      expect(next?.bonusSlots).toEqual([
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'bosses', index: 1, stat: null },
      ]);
      expect(bossRowCount(next!, 'bosses', VELMIR, MOCK_QUESTS)).toBe(1);
    });

    it('stops appending at the boss ceiling', () => {
      let state = makeState();
      for (let i = 0; i < UNBOUNDED_SOURCE_MAX_ROWS; i++) {
        state = addBossRow(state, 'bosses', VELMIR, MOCK_QUESTS)!;
      }
      expect(bossRowCount(state, 'bosses', VELMIR, MOCK_QUESTS)).toBe(UNBOUNDED_SOURCE_MAX_ROWS);
      const rejected = addBossRow(state, 'bosses', VELMIR, MOCK_QUESTS);
      expect(rejected).toBeNull();
    });

    it('removes a boss row and reindexes remaining rows', () => {
      let state = makeState();
      for (let i = 0; i < 3; i++) {
        state = addBossRow(state, 'bosses', VELMIR, MOCK_QUESTS)!;
      }
      state = allocateBonusSlot(state, 'bosses', 4, 'STR', VELMIR, MOCK_QUESTS)!;
      const next = removeBossRow(state, 'bosses', 1, VELMIR, MOCK_QUESTS);
      expect(next?.bonusSlots).toEqual([
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'bosses', index: 1, stat: null },
        { sourceId: 'bosses', index: 2, stat: 'STR' },
        { sourceId: 'bosses', index: 3, stat: null },
      ]);
    });

    it('rejects removing a row that does not exist', () => {
      const state = makeState();
      expect(removeBossRow(state, 'bosses', 0, VELMIR, MOCK_QUESTS)).toBeNull();
    });

    it('rejects stepper operations on bounded sources', () => {
      const state = makeState();
      expect(addBossRow(state, 'trophies', JORGRIM, MOCK_QUESTS)).toBeNull();
      expect(removeBossRow(state, 'trophies', 0, JORGRIM, MOCK_QUESTS)).toBeNull();
    });
  });

  describe('bonusCount and clearTraitSlots', () => {
    it('counts only allocated slots of a stat', () => {
      const slots: BonusSlot[] = [
        { sourceId: 'boulder-circle', index: 0, stat: 'VIT' },
        { sourceId: 'bosses', index: 0, stat: 'VIT' },
        { sourceId: 'bosses', index: 1, stat: 'VIT' },
        { sourceId: 'bosses', index: 2, stat: null },
        { sourceId: 'bosses', index: 3, stat: 'STR' },
      ];
      const state = makeState({ bonusSlots: slots });
      expect(bonusCount(state, 'VIT')).toBe(3);
      expect(bonusCount(state, 'STR')).toBe(1);
      expect(bonusCount(state, 'AGI')).toBe(0);
    });

    it('clears trait slots but keeps quest slots', () => {
      const slots: BonusSlot[] = [
        { sourceId: 'boulder-circle', index: 0, stat: 'VIT' },
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'trophies', index: 0, stat: 'STR' },
      ];
      const state = makeState({ bonusSlots: slots });
      const next = clearTraitSlots(state, (sourceId) => isQuestSource(MOCK_QUESTS, sourceId));
      expect(next.bonusSlots).toEqual([{ sourceId: 'boulder-circle', index: 0, stat: 'VIT' }]);
    });
  });

  describe('derivedTraitAp formulas', () => {
    function obtained(ids: string[]): { abilityId: string; level: number; order: number }[] {
      return ids.map((abilityId, i) => ({ abilityId, level: 2 + i, order: i + 1 }));
    }

    it('returns 0 with no learned abilities', () => {
      expect(derivedTraitAp(DIRWIN, [], MOCK_ABILITIES)).toBe(0);
    });

    it('returns 0 below the boundary for abilities-per-3', () => {
      expect(derivedTraitAp(DIRWIN, obtained(['survival-2', 'survival-3']), MOCK_ABILITIES)).toBe(
        0,
      );
    });

    it('returns 1 at the boundary for abilities-per-3', () => {
      expect(
        derivedTraitAp(
          DIRWIN,
          obtained(['survival-2', 'survival-3', 'survival-4']),
          MOCK_ABILITIES,
        ),
      ).toBe(1);
    });

    it('returns 2 above the boundary for abilities-per-3', () => {
      expect(
        derivedTraitAp(
          DIRWIN,
          obtained([
            'survival-2',
            'survival-3',
            'survival-4',
            'survival-5',
            'survival-6',
            'survival-7',
          ]),
          MOCK_ABILITIES,
        ),
      ).toBe(2);
    });

    it('excludes default abilities for abilities-per-3', () => {
      expect(
        derivedTraitAp(
          DIRWIN,
          obtained(['survival-1', 'survival-2', 'survival-3']),
          MOCK_ABILITIES,
        ),
      ).toBe(0);
    });

    it('returns 0 below the tree threshold for distinct-trees-6', () => {
      expect(
        derivedTraitAp(
          MAHIR,
          obtained(['warfare-1', 'warfare-2', 'warfare-3', 'pyromancy-1']),
          MOCK_ABILITIES,
        ),
      ).toBe(0);
    });

    it('returns 1 when one tree reaches the threshold', () => {
      expect(
        derivedTraitAp(
          MAHIR,
          obtained([
            'pyromancy-1',
            'pyromancy-2',
            'pyromancy-3',
            'pyromancy-4',
            'pyromancy-5',
            'pyromancy-6',
          ]),
          MOCK_ABILITIES,
        ),
      ).toBe(1);
    });

    it('counts distinct trees and caps at 5', () => {
      const ids = [
        'survival-2',
        'survival-3',
        'survival-4',
        'survival-5',
        'survival-6',
        'survival-7',
        'pyromancy-1',
        'pyromancy-2',
        'pyromancy-3',
        'pyromancy-4',
        'pyromancy-5',
        'pyromancy-6',
        'warfare-1',
        'warfare-2',
        'warfare-3',
        'athletics-1',
        'athletics-2',
        'athletics-3',
        'athletics-4',
        'athletics-5',
        'athletics-6',
      ];
      expect(derivedTraitAp(MAHIR, obtained(ids), MOCK_ABILITIES)).toBe(3);
    });

    it('excludes default abilities for distinct-trees-6', () => {
      expect(
        derivedTraitAp(
          MAHIR,
          obtained([
            'survival-1',
            'survival-2',
            'survival-3',
            'survival-4',
            'survival-5',
            'survival-6',
          ]),
          MOCK_ABILITIES,
        ),
      ).toBe(0);
    });

    it('returns 0 for characters without ap gains', () => {
      expect(derivedTraitAp(JORGRIM, obtained(['warfare-1', 'warfare-2']), MOCK_ABILITIES)).toBe(0);
    });
  });

  describe('sanitizeBonusSlots', () => {
    it('treats missing as empty', () => {
      expect(sanitizeBonusSlots(undefined, VELMIR, MOCK_QUESTS)).toEqual([]);
      expect(sanitizeBonusSlots(null, VELMIR, MOCK_QUESTS)).toEqual([]);
    });

    it('flags non-array as invalid', () => {
      expect(sanitizeBonusSlots('nope', VELMIR, MOCK_QUESTS)).toBe('invalid');
    });

    it('drops malformed entries individually', () => {
      const raw = [
        { sourceId: 'bosses', index: 0, stat: 'STR' },
        { sourceId: 'bosses', index: 1 },
        { sourceId: 42, index: 2, stat: null },
        { sourceId: 'bosses', index: -1, stat: null },
        { sourceId: 'bosses', index: 2, stat: 'NOPE' },
        { sourceId: 'unknown-source', index: 0, stat: null },
        { sourceId: 'trophies', index: 0, stat: 'STR' },
        { sourceId: 'bosses', index: 25, stat: null },
      ];
      const result = sanitizeBonusSlots(raw, VELMIR, MOCK_QUESTS);
      expect(result).toEqual([{ sourceId: 'bosses', index: 0, stat: 'STR' }]);
    });

    it('drops duplicate (sourceId, index) pairs keeping the first', () => {
      const raw = [
        { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
        { sourceId: 'boulder-circle', index: 0, stat: 'AGI' },
      ];
      expect(sanitizeBonusSlots(raw, VELMIR, MOCK_QUESTS)).toEqual([
        { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
      ]);
    });

    it('drops trait sources of another character', () => {
      const raw = [{ sourceId: 'trophies', index: 0, stat: 'STR' }];
      expect(sanitizeBonusSlots(raw, VELMIR, MOCK_QUESTS)).toEqual([]);
      expect(sanitizeBonusSlots(raw, JORGRIM, MOCK_QUESTS)).toEqual([
        { sourceId: 'trophies', index: 0, stat: 'STR' },
      ]);
    });
  });
});
