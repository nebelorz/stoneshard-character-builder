import { Injectable, inject } from '@angular/core';
import {
  BuildState,
  ObtainedAbility,
  Ability,
  DEFAULT_ABILITY_IDS,
  parseRequirements,
  meetsRequirements,
} from '@models';
import { LevelStore } from '@features/character/services';

@Injectable({ providedIn: 'root' })
export class AbilityStore {
  private readonly levelStore = inject(LevelStore);

  applyObtainAbility(
    state: BuildState,
    abilityId: string,
    allAbilities: Ability[],
  ): BuildState | null {
    if (state.ap <= 0) return null;

    const ability = allAbilities.find((a) => a.id === abilityId);
    if (!ability) return null;

    if (state.obtainedAbilities.some((a) => a.abilityId === abilityId)) return null;

    if (DEFAULT_ABILITY_IDS.includes(abilityId)) return null;

    const obtainedIds = new Set(state.obtainedAbilities.map((a) => a.abilityId));
    for (const id of DEFAULT_ABILITY_IDS) obtainedIds.add(id);
    const requirementsMet = meetsRequirements(parseRequirements(ability.requires), obtainedIds);
    if (!requirementsMet) return null;

    const routeLevel = this.levelStore.getRouteLevelForAbility(state.obtainedAbilities);
    const order = state.obtainedAbilities.length + 1;
    const obtained: ObtainedAbility = { abilityId, level: routeLevel, order };

    return {
      ...state,
      ap: state.ap - 1,
      obtainedAbilities: [...state.obtainedAbilities, obtained],
    };
  }

  applyRefundAbility(
    state: BuildState,
    abilityId: string,
    allAbilities: Ability[],
  ): BuildState | null {
    const obtained = state.obtainedAbilities.find((a) => a.abilityId === abilityId);
    if (!obtained) return null;

    const toRefund = this.collectDescendants(abilityId, allAbilities, state.obtainedAbilities);
    const refundedIds = new Set(toRefund);
    const newObtained = state.obtainedAbilities.filter((a) => !refundedIds.has(a.abilityId));
    const apReturned = toRefund.length;

    return {
      ...state,
      ap: state.ap + apReturned,
      obtainedAbilities: newObtained,
    };
  }

  private collectDescendants(
    abilityId: string,
    allAbilities: readonly Ability[],
    obtained: readonly ObtainedAbility[],
  ): string[] {
    const result: string[] = [];
    const resultSet = new Set<string>();
    const remainingIds = new Set(obtained.map((a) => a.abilityId));
    const abilityMap = new Map(allAbilities.map((a) => [a.id, a]));

    const queue = [abilityId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!remainingIds.has(currentId)) continue;

      result.push(currentId);
      resultSet.add(currentId);
      remainingIds.delete(currentId);

      const ability = abilityMap.get(currentId);
      if (!ability) continue;

      for (const childId of ability.requiredBy) {
        if (resultSet.has(childId)) continue;
        if (!remainingIds.has(childId)) continue;

        const childAbility = abilityMap.get(childId);
        if (!childAbility) continue;

        const requirementsMet = meetsRequirements(
          parseRequirements(childAbility.requires),
          remainingIds,
        );
        if (!requirementsMet) {
          queue.push(childId);
        }
      }
    }

    return result;
  }
}
