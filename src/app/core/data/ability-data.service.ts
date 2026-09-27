import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  Ability,
  AbilityTree,
  RawAbility,
  assertAbilityTreeArray,
  assertAbilityArray,
  flattenDescription,
  tokenizeDescription,
} from '@models';

function buildAbility(raw: RawAbility): Ability {
  const descriptionLines = tokenizeDescription(raw.description);
  return {
    ...raw,
    description: flattenDescription(descriptionLines),
    descriptionLines,
  };
}

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
        const raw = (res as { abilities: unknown }).abilities;
        return assertAbilityArray(raw).map(buildAbility);
      },
    },
  );
}
