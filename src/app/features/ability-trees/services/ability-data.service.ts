import { Injectable, inject, effect } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { AbilityTree, Ability, assertAbilityTreeArray, assertAbilityArray } from '@models';

@Injectable({ providedIn: 'root' })
export class AbilityDataService {
  private readonly http = inject(HttpClient);

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

  private readonly logTreesError = effect(() => {
    const error = this.trees.error();
    if (error) {
      console.error('Failed to load ability trees:', error);
    }
  });

  private readonly logAbilitiesError = effect(() => {
    const error = this.abilities.error();
    if (error) {
      console.error('Failed to load abilities:', error);
    }
  });
}
