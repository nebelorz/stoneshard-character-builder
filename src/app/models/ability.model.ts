import { DescriptionLine } from './ability-description.model';

export interface Ability {
  readonly id: string;
  readonly name: string;
  readonly treeId: string;
  readonly x: number;
  readonly y: number;
  readonly type: 'attack' | 'passive' | 'maneuver' | 'stance';
  readonly target: 'No Target' | 'Target Area' | 'Target Tile' | 'Target Object';
  readonly range: number;
  readonly energy: number;
  readonly cooldown: number;
  readonly modifiedByLabel: string;
  readonly requires: string[];
  readonly unlockConditions: string[];
  readonly description: string;
  readonly descriptionLines: readonly DescriptionLine[];
  readonly requiredBy: string[];
}

export type RawAbility = Omit<Ability, 'descriptionLines'>;

export const DEFAULT_ABILITY_IDS: readonly string[] = ['survival-1'];
