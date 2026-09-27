import {
  isCharacter,
  isAbilityTree,
  isAbility,
  assertCharacterArray,
  assertAbilityTreeArray,
  assertAbilityArray,
  assertQuestArray,
  isTraitGain,
  isQuest,
} from './data-guards';

const VALID_CHARACTER = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: ['warfare'],
};

const VALID_TREE = {
  id: 'warfare',
  name: 'Warfare',
  category: 'weaponry',
  focus: 'Melee combat',
  critEffect: 'Stun',
  icon: 'warfare',
};

const VALID_ABILITY = {
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
  requiredBy: ['warfare-2'],
};

describe('isCharacter', () => {
  it('accepts a valid character', () => {
    expect(isCharacter(VALID_CHARACTER)).toBe(true);
  });

  it('accepts character with optional dlc field', () => {
    expect(isCharacter({ ...VALID_CHARACTER, dlc: 'Winds of Trade' })).toBe(true);
  });

  it('rejects non-object', () => {
    expect(isCharacter(null)).toBe(false);
    expect(isCharacter('string')).toBe(false);
    expect(isCharacter(42)).toBe(false);
  });

  it('rejects missing required field', () => {
    const rest = { ...VALID_CHARACTER } as Record<string, unknown>;
    delete rest['name'];
    expect(isCharacter(rest)).toBe(false);
  });

  it('rejects invalid race', () => {
    expect(isCharacter({ ...VALID_CHARACTER, race: 'Orc' })).toBe(false);
  });

  it('rejects invalid gender', () => {
    expect(isCharacter({ ...VALID_CHARACTER, gender: 'Other' })).toBe(false);
  });

  it('rejects missing trait', () => {
    const rest = { ...VALID_CHARACTER } as Record<string, unknown>;
    delete rest['trait'];
    expect(isCharacter(rest)).toBe(false);
  });

  it('rejects non-array traitsUnlockedOnStart', () => {
    expect(isCharacter({ ...VALID_CHARACTER, traitsUnlockedOnStart: 'warfare' })).toBe(false);
  });

  it('accepts character with valid traitGains', () => {
    expect(
      isCharacter({
        ...VALID_CHARACTER,
        traitGains: [
          { id: 'trophies', resource: 'sp', label: 'Trophies', pointsPer: 1, max: 5 },
          {
            id: 'survival',
            resource: 'ap',
            label: 'Survival abilities',
            formula: 'abilities-per-3',
            treeId: 'survival',
          },
        ],
      }),
    ).toBe(true);
  });

  it('rejects character with invalid traitGains', () => {
    expect(isCharacter({ ...VALID_CHARACTER, traitGains: 'not array' })).toBe(false);
    expect(
      isCharacter({
        ...VALID_CHARACTER,
        traitGains: [{ id: 'bad', resource: 'ap', label: 'Bad', formula: 'nope' }],
      }),
    ).toBe(false);
    expect(
      isCharacter({
        ...VALID_CHARACTER,
        traitGains: [{ id: 'bad', resource: 'sp', label: 'Bad', pointsPer: 1, max: 0 }],
      }),
    ).toBe(false);
  });
});

describe('isTraitGain', () => {
  it('accepts a bounded sp gain', () => {
    expect(
      isTraitGain({ id: 'trophies', resource: 'sp', label: 'Trophies', pointsPer: 1, max: 5 }),
    ).toBe(true);
  });

  it('accepts an unbounded sp gain', () => {
    expect(isTraitGain({ id: 'bosses', resource: 'sp', label: 'Bosses', pointsPer: 2 })).toBe(true);
  });

  it('accepts an ap formula gain', () => {
    expect(
      isTraitGain({ id: 'trees', resource: 'ap', label: 'Trees', formula: 'distinct-trees-6' }),
    ).toBe(true);
  });

  it('rejects non-object', () => {
    expect(isTraitGain(null)).toBe(false);
    expect(isTraitGain('sp')).toBe(false);
  });

  it('rejects unknown resource', () => {
    expect(isTraitGain({ id: 'x', resource: 'xp', label: 'X' })).toBe(false);
  });

  it('rejects invalid formula', () => {
    expect(isTraitGain({ id: 'x', resource: 'ap', label: 'X', formula: 'made-up' })).toBe(false);
  });

  it('rejects non-positive max', () => {
    expect(isTraitGain({ id: 'x', resource: 'sp', label: 'X', pointsPer: 1, max: 0 })).toBe(false);
  });

  it('rejects non-positive or non-integer pointsPer', () => {
    expect(isTraitGain({ id: 'x', resource: 'sp', label: 'X', pointsPer: 0 })).toBe(false);
    expect(isTraitGain({ id: 'x', resource: 'sp', label: 'X', pointsPer: -2 })).toBe(false);
    expect(isTraitGain({ id: 'x', resource: 'sp', label: 'X', pointsPer: 1.5 })).toBe(false);
  });
});

describe('isQuest', () => {
  const VALID_QUEST = {
    id: 'boulder-circle',
    resource: 'sp',
    label: 'Boulder Circle',
    tooltip: 'Grants 1 Stat Point',
    pointsPer: 1,
    max: 1,
  };

  it('accepts a valid quest', () => {
    expect(isQuest(VALID_QUEST)).toBe(true);
  });

  it('rejects non-object', () => {
    expect(isQuest(null)).toBe(false);
    expect(isQuest(42)).toBe(false);
  });

  it('rejects non-sp resource', () => {
    expect(isQuest({ ...VALID_QUEST, resource: 'ap' })).toBe(false);
  });

  it('rejects missing tooltip', () => {
    const rest = { ...VALID_QUEST } as Record<string, unknown>;
    delete rest['tooltip'];
    expect(isQuest(rest)).toBe(false);
  });

  it('rejects non-positive max', () => {
    expect(isQuest({ ...VALID_QUEST, max: 0 })).toBe(false);
  });
});

describe('assertQuestArray', () => {
  it('returns the array for valid data', () => {
    const quest = {
      id: 'boulder-circle',
      resource: 'sp',
      label: 'Boulder Circle',
      tooltip: 'Grants 1 Stat Point',
      pointsPer: 1,
      max: 1,
    };
    expect(assertQuestArray([quest])).toEqual([quest]);
  });

  it('throws on non-array', () => {
    expect(() => assertQuestArray(null)).toThrow('Expected an array of quests');
  });

  it('throws on invalid record in array', () => {
    expect(() => assertQuestArray([{ id: 123 }])).toThrow('Invalid quest at index 0');
  });
});

describe('isAbilityTree', () => {
  it('accepts a valid tree', () => {
    expect(isAbilityTree(VALID_TREE)).toBe(true);
  });

  it('rejects non-object', () => {
    expect(isAbilityTree(null)).toBe(false);
  });

  it('rejects invalid category', () => {
    expect(isAbilityTree({ ...VALID_TREE, category: 'combat' })).toBe(false);
  });

  it('rejects missing field', () => {
    const rest = { ...VALID_TREE } as Record<string, unknown>;
    delete rest['icon'];
    expect(isAbilityTree(rest)).toBe(false);
  });
});

describe('isAbility', () => {
  it('accepts a valid ability', () => {
    expect(isAbility(VALID_ABILITY)).toBe(true);
  });

  it('rejects non-object', () => {
    expect(isAbility(null)).toBe(false);
  });

  it('rejects invalid type', () => {
    expect(isAbility({ ...VALID_ABILITY, type: 'buff' })).toBe(false);
  });

  it('rejects invalid target', () => {
    expect(isAbility({ ...VALID_ABILITY, target: 'Self' })).toBe(false);
  });

  it('rejects non-array requires', () => {
    expect(isAbility({ ...VALID_ABILITY, requires: 'warfare-1' })).toBe(false);
  });

  it('accepts a canonical description containing modifiers', () => {
    expect(isAbility({ ...VALID_ABILITY, description: 'Grants {+5}% Crit Chance.' })).toBe(true);
  });

  it('rejects an unclosed modifier delimiter', () => {
    expect(isAbility({ ...VALID_ABILITY, description: 'Grants {+5% Crit Chance.' })).toBe(false);
  });

  it('rejects malformed derived descriptionLines', () => {
    expect(isAbility({ ...VALID_ABILITY, descriptionLines: 'not lines' })).toBe(false);
    expect(
      isAbility({ ...VALID_ABILITY, descriptionLines: [{ kind: 'paragraph', nodes: 'nope' }] }),
    ).toBe(false);
    expect(
      isAbility({
        ...VALID_ABILITY,
        descriptionLines: [{ kind: 'sentence', nodes: [] }],
      }),
    ).toBe(false);
  });

  it('accepts valid derived descriptionLines', () => {
    expect(
      isAbility({
        ...VALID_ABILITY,
        descriptionLines: [
          { kind: 'paragraph', nodes: [{ kind: 'modifier', expression: '+5', sign: 'pos' }] },
        ],
      }),
    ).toBe(true);
  });
});

describe('assertCharacterArray', () => {
  it('returns the array for valid data', () => {
    const result = assertCharacterArray([VALID_CHARACTER]);
    expect(result).toEqual([VALID_CHARACTER]);
  });

  it('throws on non-array', () => {
    expect(() => assertCharacterArray('not array')).toThrow('Expected an array of characters');
  });

  it('throws on invalid record in array', () => {
    expect(() => assertCharacterArray([{ id: 123 }])).toThrow('Invalid character at index 0');
  });
});

describe('assertAbilityTreeArray', () => {
  it('returns the array for valid data', () => {
    const result = assertAbilityTreeArray([VALID_TREE]);
    expect(result).toEqual([VALID_TREE]);
  });

  it('throws on non-array', () => {
    expect(() => assertAbilityTreeArray(null)).toThrow('Expected an array of ability trees');
  });

  it('throws on invalid record in array', () => {
    expect(() => assertAbilityTreeArray([{ id: 123 }])).toThrow('Invalid ability tree at index 0');
  });
});

describe('assertAbilityArray', () => {
  it('returns the array for valid data', () => {
    const result = assertAbilityArray([VALID_ABILITY]);
    expect(result).toEqual([VALID_ABILITY]);
  });

  it('throws on non-array', () => {
    expect(() => assertAbilityArray(undefined)).toThrow('Expected an array of abilities');
  });

  it('throws on invalid record in array', () => {
    expect(() => assertAbilityArray([{ id: 123 }])).toThrow('Invalid ability at index 0');
  });
});
