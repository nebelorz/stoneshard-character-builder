import { Component, inject, signal, computed, output } from '@angular/core';
import { BuildStore } from '@features/build/services/build-store';
import { StatKey, STAT_KEYS } from '@models';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorInfo, phosphorNote } from '@ng-icons/phosphor-icons/regular';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip';

interface StatOption {
  value: StatKey;
  label: string;
}

@Component({
  selector: 'app-extras-display',
  templateUrl: './extras-display.html',
  styleUrl: './extras-display.scss',
  imports: [NgIcon, TooltipDirective],
  providers: [provideIcons({ phosphorInfo, phosphorNote })],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ExtrasDisplayComponent {
  private readonly buildStore = inject(BuildStore);

  readonly statOptions: StatOption[] = STAT_KEYS.map((stat) => ({
    value: stat,
    label: `+1 ${stat}`,
  }));

  readonly selectedStat = computed(() => {
    const state = this.buildStore.state();
    return state?.boulderCircleStat ?? null;
  });

  readonly notesPreview = computed(() => {
    const state = this.buildStore.state();
    if (!state?.notes) return null;
    const { buildName, author, content } = state.notes;
    return {
      buildName,
      author,
      contentPreview: content.length > 80 ? content.substring(0, 80) + '...' : content,
    };
  });

  dropdownOpen = signal(false);
  readonly openNotes = output<void>();

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  selectStat(stat: StatKey | null): void {
    if (stat === null) {
      this.buildStore.deallocateBoulderCircle();
    } else {
      this.buildStore.allocateBoulderCircle(stat);
    }
    this.dropdownOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const host = document.querySelector('app-extras-display');
    if (host && !host.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  getStatClass(stat: StatKey): string {
    return `stat-chip stat-chip--${stat.toLowerCase()}`;
  }
}
