import { Component, inject, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorSquareLogo,
  phosphorPlusSquare,
  phosphorInfo,
} from '@ng-icons/phosphor-icons/regular';
import { BuildStore } from '@features/build/services';
import { STAT_KEYS, STAT_INFO, StatKey } from '@models';
import { EnrichedTooltipDirective } from '@shared/directives/tooltip/enriched-tooltip';
import { StatTooltipContent } from '@shared/directives/tooltip/tooltip-content.model';

@Component({
  selector: 'app-stat-controls',
  templateUrl: './stat-controls.html',
  styleUrl: './stat-controls.scss',
  imports: [NgIcon, EnrichedTooltipDirective],
  providers: [provideIcons({ phosphorSquareLogo, phosphorPlusSquare, phosphorInfo })],
})
export class StatControlsComponent {
  private readonly buildStore = inject(BuildStore);

  readonly statKeys = STAT_KEYS;
  readonly ap = computed(() => this.buildStore.state()?.ap ?? 0);
  readonly sp = computed(() => this.buildStore.state()?.sp ?? 0);

  getStatValue(stat: StatKey): number {
    return this.buildStore.state()?.stats?.[stat] ?? 0;
  }

  canIncrementStat(stat: StatKey): boolean {
    return this.buildStore.canIncrementStat1(stat);
  }

  canDecrementStat(stat: StatKey): boolean {
    return this.buildStore.canDecrementStat1(stat);
  }

  canIncrementStat5(stat: StatKey): boolean {
    return this.buildStore.canIncrementStat5(stat);
  }

  canDecrementStat5(stat: StatKey): boolean {
    return this.buildStore.canDecrementStat5(stat);
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

  trackByStat(_index: number, stat: StatKey): string {
    return stat;
  }

  getStatName(stat: StatKey): string {
    const names: Record<StatKey, string> = {
      STR: 'Strength',
      AGI: 'Agility',
      PER: 'Perception',
      VIT: 'Vitality',
      WIL: 'Willpower',
    };
    return names[stat];
  }

  getStatInfo(stat: StatKey): StatTooltipContent {
    return STAT_INFO[stat];
  }
}
