import { Component, inject, computed, effect } from '@angular/core';
import { BuildStore } from '@features/build/services/build-store';
import { AbilityDataService, AbilityHoverService } from '@features/ability-trees/services';
import { Ability, StatKey } from '@models';

interface RouteAbility {
  id: string;
  name: string;
  icon: string;
  ability: Ability;
}

interface RouteStat {
  stat: StatKey;
  label: string;
}

interface RouteLevel {
  level: number;
  abilities: (RouteAbility | null)[];
  stats: (RouteStat | null)[];
}

@Component({
  selector: 'app-route-display',
  templateUrl: './route-display.html',
  styleUrl: './route-display.scss',
})
export class RouteDisplayComponent {
  private readonly buildStore = inject(BuildStore);
  private readonly abilityData = inject(AbilityDataService);
  private readonly hoverService = inject(AbilityHoverService);

  private allAbilities: Ability[] = [];

  private readonly loadAbilitiesEffect = effect(() => {
    const abilities = this.abilityData.abilities.value();
    if (abilities) {
      this.allAbilities = abilities;
    }
  });

  routeDisplay = computed<RouteLevel[]>(() => {
    const st = this.buildStore.state();
    if (!st) return [];

    const abilities = st.obtainedAbilities;
    const stats = st.statHistory;
    const currentLevel = st.level;

    const abilityObjMap = new Map<string, Ability>();
    for (const a of this.allAbilities) {
      abilityObjMap.set(a.id, a);
    }

    const levels: RouteLevel[] = [];
    for (let lvl = 1; lvl <= currentLevel; lvl++) {
      const levelAbilities = abilities.filter((a) => a.level === lvl);
      const levelStats = stats.filter((s) => s.level === lvl);

      const abilitySlots: (RouteAbility | null)[] = [];
      if (lvl === 1) {
        abilitySlots.push(
          levelAbilities.length > 0
            ? this.buildRouteAbility(levelAbilities[0].abilityId, abilityObjMap)
            : null,
        );
        abilitySlots.push(
          levelAbilities.length > 1
            ? this.buildRouteAbility(levelAbilities[1].abilityId, abilityObjMap)
            : null,
        );
      } else {
        abilitySlots.push(
          levelAbilities.length > 0
            ? this.buildRouteAbility(levelAbilities[0].abilityId, abilityObjMap)
            : null,
        );
      }

      const statSlots: (RouteStat | null)[] = [];
      if (lvl >= 2) {
        statSlots.push(
          levelStats.length > 0
            ? { stat: levelStats[0].stat, label: `${levelStats[0].stat} +1` }
            : null,
        );
      }

      levels.push({ level: lvl, abilities: abilitySlots, stats: statSlots });
    }

    return levels;
  });

  onUnassignAbility(abilityId: string): void {
    this.buildStore.refundAbility(abilityId);
    this.hoverService.setHovered(null);
  }

  onDecrementStatRoute(stat: StatKey): void {
    this.buildStore.decrementStat(stat);
  }

  onAbilityHover(ability: Ability | null): void {
    this.hoverService.setHovered(ability?.id ?? null);
  }

  private getAbilityIcon(abilityId: string): string {
    const ability = this.allAbilities.find((a) => a.id === abilityId);
    if (!ability) return '';
    const iconName = ability.name.replace(/\s+/g, '_');
    return `assets/icons/${ability.treeId}/${iconName}.png`;
  }

  private buildRouteAbility(abilityId: string, abilityObjMap: Map<string, Ability>): RouteAbility {
    const ability = abilityObjMap.get(abilityId)!;
    return {
      id: abilityId,
      name: ability?.name ?? abilityId,
      icon: this.getAbilityIcon(abilityId),
      ability,
    };
  }

  getStatClass(stat: StatKey): string {
    return `stat-chip stat-chip--${stat.toLowerCase()}`;
  }

  trackByLevel(_index: number, level: RouteLevel): number {
    return level.level;
  }

  trackByAbility(_index: number, ability: RouteAbility | null): string {
    return ability ? ability.id : `empty-${_index}`;
  }

  trackByStat(_index: number, stat: RouteStat | null): string | null {
    return stat?.stat ?? null;
  }
}
