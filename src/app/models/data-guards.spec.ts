import {
  isCharacter,
  isAbilityTree,
  isAbility,
  assertCharacterArray,
  assertAbilityTreeArray,
  assertAbilityArray,
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
