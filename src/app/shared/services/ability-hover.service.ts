import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AbilityHoverService {
  hoveredAbilityId = signal<string | null>(null);
  activeTooltipId = signal<string | null>(null);

  setHovered(abilityId: string | null): void {
    this.hoveredAbilityId.set(abilityId);
  }

  setActiveTooltip(abilityId: string | null): void {
    this.activeTooltipId.set(abilityId);
  }
}
