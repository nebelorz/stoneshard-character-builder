import { StatKey } from './stat-key.model';

export interface ObtainedAbility {
  readonly abilityId: string;
  readonly level: number;
  readonly order: number;
}

export interface StatAssignment {
  readonly level: number;
  readonly order: number;
  readonly stat: StatKey;
}

export interface BuildNotes {
  readonly buildName: string;
  readonly author: string;
  readonly content: string;
}

export interface BuildState {
  readonly characterId: string;
  readonly level: number;
  readonly ap: number;
  readonly sp: number;
  readonly stats: Record<StatKey, number>;
  readonly obtainedAbilities: readonly ObtainedAbility[];
  readonly pinnedTrees: readonly string[];
  readonly statHistory: readonly StatAssignment[];
  readonly boulderCircleStat: StatKey | null;
  readonly notes: BuildNotes;
}
