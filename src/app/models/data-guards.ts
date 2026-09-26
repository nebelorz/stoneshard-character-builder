import { Character, TraitGain, TraitGainAp, TraitGainSp } from './character.model';
import { AbilityTree } from './ability-tree.model';
import { Ability } from './ability.model';
import { Quest } from './quest.model';

const RACES = new Set([
  'Human (Skadian)',
  'Dwarf (Fjall)',
  'Human (Aldor)',
  'Human (Nistra)',
  'Elf (Jacinth)',
]);

const GENDERS = new Set(['Male', 'Female']);

const ABILITY_TYPES = new Set(['attack', 'passive', 'maneuver', 'stance']);

const ABILITY_TARGETS = new Set(['No Target', 'Target Area', 'Target Tile', 'Target Object']);

const TREE_CATEGORIES = new Set(['weaponry', 'utility', 'sorcery']);

const TRAIT_GAIN_FORMULAS = new Set(['abilities-per-3', 'distinct-trees-6']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isTraitGain(value: unknown): value is TraitGain {
  if (!isRecord(value)) return false;
  if (value['resource'] === 'sp') {
    return (
      typeof value['id'] === 'string' &&
      typeof value['label'] === 'string' &&
      typeof value['pointsPer'] === 'number' &&
      Number.isInteger(value['pointsPer']) &&
      value['pointsPer'] > 0 &&
      (value['max'] === undefined ||
        (typeof value['max'] === 'number' && Number.isInteger(value['max']) && value['max'] > 0))
    );
  }
  if (value['resource'] === 'ap') {
    return (
      typeof value['id'] === 'string' &&
      typeof value['label'] === 'string' &&
      TRAIT_GAIN_FORMULAS.has(value['formula'] as string) &&
      (value['treeId'] === undefined || typeof value['treeId'] === 'string')
    );
  }
  return false;
}

export function isTraitGainSp(gain: TraitGain): gain is TraitGainSp {
  return gain.resource === 'sp';
}

export function isTraitGainAp(gain: TraitGain): gain is TraitGainAp {
  return gain.resource === 'ap';
}

export function isCharacter(value: unknown): value is Character {
  if (!isRecord(value)) return false;
  const traitGainsValid =
    value['traitGains'] === undefined ||
    (Array.isArray(value['traitGains']) && value['traitGains'].every((g) => isTraitGain(g)));
  return (
    typeof value['id'] === 'string' &&
    typeof value['name'] === 'string' &&
    typeof value['title'] === 'string' &&
    RACES.has(value['race'] as string) &&
    GENDERS.has(value['gender'] as string) &&
    isRecord(value['trait']) &&
    typeof value['trait']['name'] === 'string' &&
    typeof value['trait']['description'] === 'string' &&
    isRecord(value['baseStats']) &&
    Array.isArray(value['traitsUnlockedOnStart']) &&
    traitGainsValid
  );
}

export function isQuest(value: unknown): value is Quest {
  if (!isRecord(value)) return false;
  return (
    typeof value['id'] === 'string' &&
    value['resource'] === 'sp' &&
    typeof value['label'] === 'string' &&
    typeof value['tooltip'] === 'string' &&
    typeof value['pointsPer'] === 'number' &&
    typeof value['max'] === 'number' &&
    Number.isInteger(value['max']) &&
    value['max'] > 0
  );
}

export function isAbilityTree(value: unknown): value is AbilityTree {
  if (!isRecord(value)) return false;
  return (
    typeof value['id'] === 'string' &&
    typeof value['name'] === 'string' &&
    TREE_CATEGORIES.has(value['category'] as string) &&
    typeof value['focus'] === 'string' &&
    typeof value['critEffect'] === 'string' &&
    typeof value['icon'] === 'string'
  );
}

export function isAbility(value: unknown): value is Ability {
  if (!isRecord(value)) return false;
  return (
    typeof value['id'] === 'string' &&
    typeof value['name'] === 'string' &&
    typeof value['treeId'] === 'string' &&
    typeof value['x'] === 'number' &&
    typeof value['y'] === 'number' &&
    ABILITY_TYPES.has(value['type'] as string) &&
    ABILITY_TARGETS.has(value['target'] as string) &&
    typeof value['range'] === 'number' &&
    typeof value['energy'] === 'number' &&
    typeof value['cooldown'] === 'number' &&
    typeof value['modifiedByLabel'] === 'string' &&
    Array.isArray(value['requires']) &&
    Array.isArray(value['unlockConditions']) &&
    typeof value['description'] === 'string' &&
    Array.isArray(value['requiredBy'])
  );
}

export function assertCharacterArray(data: unknown): Character[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of characters');
  }
  for (let i = 0; i < data.length; i++) {
    if (!isCharacter(data[i])) {
      throw new Error(`Invalid character at index ${i}`);
    }
  }
  return data as Character[];
}

export function assertAbilityTreeArray(data: unknown): AbilityTree[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of ability trees');
  }
  for (let i = 0; i < data.length; i++) {
    if (!isAbilityTree(data[i])) {
      throw new Error(`Invalid ability tree at index ${i}`);
    }
  }
  return data as AbilityTree[];
}

export function assertQuestArray(data: unknown): Quest[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of quests');
  }
  for (let i = 0; i < data.length; i++) {
    if (!isQuest(data[i])) {
      throw new Error(`Invalid quest at index ${i}`);
    }
  }
  return data as Quest[];
}

export function assertAbilityArray(data: unknown): Ability[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of abilities');
  }
  for (let i = 0; i < data.length; i++) {
    if (!isAbility(data[i])) {
      throw new Error(`Invalid ability at index ${i}`);
    }
  }
  return data as Ability[];
}
