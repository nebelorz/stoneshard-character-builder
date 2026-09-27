import { Component, inject, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorSquareLogo,
  phosphorPlusSquare,
  phosphorInfo,
} from '@ng-icons/phosphor-icons/regular';
import { BuildStore } from '@core/state';
import { ABILITY_POINT_BUDGET, STAT_POINT_BUDGET, STAT_KEYS, STAT_INFO, StatKey } from '@models';
import { EnrichedTooltipDirective } from '@shared/directives/tooltip/enriched-tooltip';
import { StatTooltipContent } from '@shared/directives/tooltip/tooltip-content.model';

interface StatRow {
  readonly key: StatKey;
  readonly name: string;
  readonly value: number;
  readonly bonusCount: number;
  readonly info: StatTooltipContent;
}

@Component({
  selector: 'app-stat-controls',
  templateUrl: './stat-controls.html',
  styleUrl: './stat-controls.scss',
  imports: [NgIcon, EnrichedTooltipDirective],
  providers: [provideIcons({ phosphorSquareLogo, phosphorPlusSquare, phosphorInfo })],
})
export class StatControlsComponent {
  private readonly buildStore = inject(BuildStore);

  readonly statRows = computed<StatRow[]>(() => {
    const stats = this.buildStore.state()?.stats;
    return STAT_KEYS.map((stat) => {
      const bonusCount = this.buildStore.bonusCount(stat);
      return {
        key: stat,
        name: STAT_INFO[stat].name,
        value: (stats?.[stat] ?? 0) + bonusCount,
        bonusCount,
        info: STAT_INFO[stat],
      };
    });
  });

  readonly ap = computed(() => this.buildStore.totalAp());
  readonly derivedAp = computed(() => this.buildStore.derivedTraitAp());
  readonly apPercent = computed(() => Math.min(100, (this.ap() / ABILITY_POINT_BUDGET) * 100));
  readonly sp = computed(() => this.buildStore.state()?.sp ?? 0);
  readonly spPercent = computed(() => Math.min(100, (this.sp() / STAT_POINT_BUDGET) * 100));

  canIncrementStat(stat: StatKey): boolean {
    return this.buildStore.canIncrementStat(stat);
  }

  canDecrementStat(stat: StatKey): boolean {
    return this.buildStore.canDecrementStat(stat);
  }

  onIncrementStat(stat: StatKey): void {
    this.buildStore.incrementStat(stat);
  }

  onDecrementStat(stat: StatKey): void {
    this.buildStore.decrementStat(stat);
  }

  onIncrementStat5(stat: StatKey): void {
    this.buildStore.incrementStat5(stat);
  }

  onDecrementStat5(stat: StatKey): void {
    this.buildStore.decrementStat5(stat);
  }
}
