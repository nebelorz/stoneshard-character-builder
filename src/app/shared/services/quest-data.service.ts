import { Injectable, inject, effect } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Quest, assertQuestArray } from '@models';

@Injectable({ providedIn: 'root' })
export class QuestDataService {
  private readonly http = inject(HttpClient);

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

  private readonly logError = effect(() => {
    const error = this.quests.error();
    if (error) {
      console.error('Failed to load quests:', error);
    }
  });
}
