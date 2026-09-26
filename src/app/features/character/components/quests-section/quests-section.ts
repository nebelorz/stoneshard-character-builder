import { Component, inject, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorInfo } from '@ng-icons/phosphor-icons/regular';
import { BuildStore } from '@features/build/services';
import { BonusService } from '@shared/services';
import { Quest, StatKey } from '@models';
import { EnrichedTooltipDirective } from '@shared/directives/tooltip/enriched-tooltip';
import { QuestTooltipContent } from '@shared/directives/tooltip/tooltip-content.model';
import { PointSlotRowComponent } from '../point-slot-row/point-slot-row';

interface QuestSlotView {
  readonly index: number;
  readonly stat: StatKey | null;
}

@Component({
  selector: 'app-quests-section',
  templateUrl: './quests-section.html',
  styleUrl: './quests-section.scss',
  imports: [NgIcon, EnrichedTooltipDirective, PointSlotRowComponent],
  providers: [provideIcons({ phosphorInfo })],
})
export class QuestsSectionComponent {
  private readonly buildStore = inject(BuildStore);
  private readonly bonusService = inject(BonusService);

  readonly quests = computed(() => this.bonusService.quests());

  readonly slotsByQuest = computed<Record<string, QuestSlotView[]>>(() => {
    const state = this.buildStore.state();
    const map: Record<string, QuestSlotView[]> = {};
    for (const quest of this.quests()) {
      const existing = state ? this.bonusService.slotsForSource(state, quest.id) : [];
      map[quest.id] = Array.from({ length: quest.max }, (_, index) => ({
        index,
        stat: existing.find((slot) => slot.index === index)?.stat ?? null,
      }));
    }
    return map;
  });

  tooltipContent(quest: Quest): QuestTooltipContent {
    return {
      kind: 'quest',
      name: quest.label,
      description: quest.tooltip,
    };
  }

  allocate(questId: string, index: number, stat: StatKey): void {
    this.buildStore.allocateBonusSlot(questId, index, stat);
  }

  deallocate(questId: string, index: number): void {
    this.buildStore.deallocateBonusSlot(questId, index);
  }
}
