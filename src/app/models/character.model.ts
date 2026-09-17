import { StatKey } from './stat-key.model';

export type Race =
  'Human (Skadian)' | 'Dwarf (Fjall)' | 'Human (Aldor)' | 'Human (Nistra)' | 'Elf (Jacinth)';

export type Gender = 'Male' | 'Female';

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
  readonly dlc?: string;
}
