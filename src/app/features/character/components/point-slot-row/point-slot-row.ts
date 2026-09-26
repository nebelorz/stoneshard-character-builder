import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { STAT_KEYS, StatKey } from '@models';

@Component({
  selector: 'app-point-slot-row',
  templateUrl: './point-slot-row.html',
  styleUrl: './point-slot-row.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class PointSlotRowComponent {
  readonly stat = input<StatKey | null>(null);
  readonly statChange = output<StatKey | null>();

  readonly statOptions = STAT_KEYS;

  dropdownOpen = signal(false);
  activeIndex = signal(0);

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  toggleDropdown(): void {
    this.dropdownOpen.update((open) => !open);
    if (this.dropdownOpen()) {
      this.resetActiveIndex();
    }
  }

  selectStat(stat: StatKey | null): void {
    this.statChange.emit(stat);
    this.closeDropdown();
  }

  onToggleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.dropdownOpen()) {
        this.dropdownOpen.set(true);
        this.resetActiveIndex();
        return;
      }
      const count = this.statOptions.length + 1;
      if (event.key === 'ArrowDown') {
        this.activeIndex.update((i) => Math.min(count - 1, i + 1));
      } else {
        this.activeIndex.update((i) => Math.max(0, i - 1));
      }
    } else if (event.key === 'Home' && this.dropdownOpen()) {
      event.preventDefault();
      this.activeIndex.set(0);
    } else if (event.key === 'End' && this.dropdownOpen()) {
      event.preventDefault();
      this.activeIndex.set(this.statOptions.length);
    } else if (event.key === 'Enter' && this.dropdownOpen()) {
      event.preventDefault();
      this.selectStat(this.statForIndex(this.activeIndex()));
    } else if (event.key === 'Escape' && this.dropdownOpen()) {
      event.preventDefault();
      this.closeDropdown();
      this.focusToggle();
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.dropdownOpen()) return;
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  getStatClass(stat: StatKey): string {
    return `stat-chip stat-chip--${stat.toLowerCase()}`;
  }

  isActive(index: number): boolean {
    return this.dropdownOpen() && this.activeIndex() === index;
  }

  getActiveOptionId(): string | null {
    return this.dropdownOpen() ? `point-slot-option-${this.activeIndex()}` : null;
  }

  private statForIndex(index: number): StatKey | null {
    return index === 0 ? null : this.statOptions[index - 1];
  }

  private resetActiveIndex(): void {
    const current = this.stat();
    this.activeIndex.set(current === null ? 0 : STAT_KEYS.indexOf(current) + 1);
  }

  private closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  private focusToggle(): void {
    this.elementRef.nativeElement
      .querySelector<HTMLButtonElement>('.point-slot-row__toggle')
      ?.focus();
  }
}
