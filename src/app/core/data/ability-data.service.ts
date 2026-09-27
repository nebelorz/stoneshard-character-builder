import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { AbilityTree, Ability, assertAbilityTreeArray, assertAbilityArray } from '@models';

@Injectable({ providedIn: 'root' })
export class AbilityDataService {
  readonly trees = httpResource<AbilityTree[]>(
    () => ({
      url: 'assets/data/trees.json',
    }),
    {
      parse: (res: unknown) => {
        const raw = (res as { trees: AbilityTree[] }).trees;
        return assertAbilityTreeArray(raw);
      },
    },
  );

  readonly abilities = httpResource<Ability[]>(
    () => ({
      url: 'assets/data/abilities.json',
    }),
    {
      parse: (res: unknown) => {
        const raw = (res as { abilities: Ability[] }).abilities;
        return assertAbilityArray(raw);
      },
    },
  );
}
