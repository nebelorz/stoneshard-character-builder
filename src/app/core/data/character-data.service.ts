import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Character, assertCharacterArray } from '@models';

@Injectable({ providedIn: 'root' })
export class CharacterDataService {
  readonly characters = httpResource<Character[]>(
    () => ({
      url: 'assets/data/characters.json',
    }),
    {
      parse: (res: unknown) => {
        const raw = (res as { characters: Character[] }).characters;
        return assertCharacterArray(raw);
      },
    },
  );
}
