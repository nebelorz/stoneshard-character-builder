import { Character } from './character.model';
import { AbilityTree } from './ability-tree.model';
import { Ability } from './ability.model';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isCharacter(value: unknown): value is Character {
  if (!isRecord(value)) return false;
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
    typeof value['traitsUnlockedOnStart'] === 'object' &&
    Array.isArray(value['traitsUnlockedOnStart'])
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
