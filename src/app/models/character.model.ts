import { StatKey } from './stat-key.model';

export type Race =
  'Human (Skadian)' | 'Dwarf (Fjall)' | 'Human (Aldor)' | 'Human (Nistra)' | 'Elf (Jacinth)';

export type Gender = 'Male' | 'Female';

export type TraitGainFormula = 'abilities-per-3' | 'distinct-trees-6';

export interface TraitGainSp {
  readonly id: string;
  readonly resource: 'sp';
  readonly label: string;
  readonly pointsPer: number;
  readonly max?: number;
}

export interface TraitGainAp {
  readonly id: string;
  readonly resource: 'ap';
  readonly label: string;
  readonly formula: TraitGainFormula;
  readonly treeId?: string;
}

export type TraitGain = TraitGainSp | TraitGainAp;

export interface Character {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly race: Race;
  readonly gender: Gender;
  readonly trait: {
    readonly name: string;
    readonly description: string;
  };
  readonly baseStats: Record<StatKey, number>;
  readonly traitsUnlockedOnStart: readonly string[];
  readonly traitGains?: readonly TraitGain[];
  readonly dlc?: string;
}
