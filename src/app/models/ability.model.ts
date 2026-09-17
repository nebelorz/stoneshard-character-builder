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
  readonly requiredBy: string[];
}

export const DEFAULT_ABILITY_IDS: readonly string[] = ['survival-1'];
