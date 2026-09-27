import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Quest, assertQuestArray } from '@models';

@Injectable({ providedIn: 'root' })
export class QuestDataService {
  readonly quests = httpResource<Quest[]>(
    () => ({
      url: 'assets/data/quests.json',
    }),
    {
      parse: (res: unknown) => {
        const raw = (res as { quests: Quest[] }).quests;
        return assertQuestArray(raw);
      },
    },
  );
}
