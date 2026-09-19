import { Component, inject, signal, computed, ElementRef, HostListener } from '@angular/core';
import { BuildStore } from '@features/build/services/build-store';
import { StatKey, STAT_KEYS } from '@models';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorInfo } from '@ng-icons/phosphor-icons/regular';
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
  providers: [provideIcons({ phosphorInfo })],
})
export class ExtrasDisplayComponent {
  private readonly buildStore = inject(BuildStore);
  private readonly elementRef = inject(ElementRef);

  readonly statOptions: StatOption[] = STAT_KEYS.map((stat) => ({
    value: stat,
    label: `+1 ${stat}`,
  }));

  readonly selectedStat = computed(() => {
    const state = this.buildStore.state();
    return state?.boulderCircleStat ?? null;
  });

  dropdownOpen = signal(false);

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  getStatClass(stat: StatKey): string {
    return `stat-chip stat-chip--${stat.toLowerCase()}`;
  }
}
