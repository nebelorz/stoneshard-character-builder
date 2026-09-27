import { Component, inject, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorInfo, phosphorPlus, phosphorMinus } from '@ng-icons/phosphor-icons/regular';
import { BuildStore, BonusService } from '@core/state';
import { StatKey } from '@models';
import { EnrichedTooltipDirective } from '@shared/directives/tooltip/enriched-tooltip';
import { TraitTooltipContent } from '@shared/directives/tooltip/tooltip-content.model';
import { PointSlotRowComponent } from '../point-slot-row/point-slot-row';

interface BonusSlotView {
  readonly index: number;
  readonly stat: StatKey | null;
}

interface BossRowView {
  readonly rowIndex: number;
  readonly slots: readonly BonusSlotView[];
}

interface GainView {
  readonly id: string;
  readonly label: string;
  readonly bounded: boolean;
  readonly slots: readonly BonusSlotView[];
  readonly bossRows: readonly BossRowView[];
  readonly rowCount: number;
  readonly lastRowIndex: number;
  readonly canAddRow: boolean;
}

@Component({
  selector: 'app-trait-section',
  templateUrl: './trait-section.html',
  styleUrl: './trait-section.scss',
  imports: [NgIcon, EnrichedTooltipDirective, PointSlotRowComponent],
  providers: [provideIcons({ phosphorInfo, phosphorPlus, phosphorMinus })],
})
export class TraitSectionComponent {
  private readonly buildStore = inject(BuildStore);
  private readonly bonusService = inject(BonusService);

  readonly character = computed(() => this.buildStore.character());

  readonly traitContent = computed<TraitTooltipContent | null>(() => {
    const character = this.character();
    if (!character) return null;
    return {
      kind: 'trait',
      name: character.trait.name,
      description: character.trait.description,
    };
  });

  private readonly spGains = computed(() => this.bonusService.traitSpGains(this.character()));

  readonly gainViews = computed<GainView[]>(() => {
    const state = this.buildStore.state();
    return this.spGains().map((gain) => {
      const existing = state ? this.bonusService.slotsForSource(state, gain.id) : [];
      const statAt = (index: number): StatKey | null =>
        existing.find((slot) => slot.index === index)?.stat ?? null;

      if (gain.max !== undefined) {
        const slots = Array.from({ length: gain.max }, (_, index) => ({
          index,
          stat: statAt(index),
        }));
        return {
          id: gain.id,
          label: gain.label,
          bounded: true,
          slots,
          bossRows: [],
          rowCount: 0,
          lastRowIndex: -1,
          canAddRow: false,
        };
      }

      const rowCount = this.buildStore.bossRowCount(gain.id);
      const bossRows = Array.from({ length: rowCount }, (_, rowIndex) => ({
        rowIndex,
        slots: Array.from({ length: gain.pointsPer }, (_, offset) => {
          const index = rowIndex * gain.pointsPer + offset;
          return { index, stat: statAt(index) };
        }),
      }));
      return {
        id: gain.id,
        label: gain.label,
        bounded: false,
        slots: [],
        bossRows,
        rowCount,
        lastRowIndex: rowCount - 1,
        canAddRow: this.buildStore.canAddBossRow(gain.id),
      };
    });
  });

  readonly derivedAp = computed(() => this.buildStore.derivedTraitAp());

  allocate(gainId: string, index: number, stat: StatKey): void {
    this.buildStore.allocateBonusSlot(gainId, index, stat);
  }

  deallocate(gainId: string, index: number): void {
    this.buildStore.deallocateBonusSlot(gainId, index);
  }

  addRow(gainId: string): void {
    this.buildStore.addBossRow(gainId);
  }

  removeRow(gainId: string, rowIndex: number): void {
    this.buildStore.removeBossRow(gainId, rowIndex);
  }
}
