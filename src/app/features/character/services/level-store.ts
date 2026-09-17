import { Injectable, signal, computed } from '@angular/core';
import { BuildState, StatAssignment, ObtainedAbility } from '@models';

const MAX_LEVEL = 30;
const MIN_LEVEL = 1;

interface LevelActions {
  abilities: string[];
  stats: string[];
}

export function buildLevelActionMap(state: BuildState): Map<number, LevelActions> {
  const map = new Map<number, LevelActions>();
  for (const ability of state.obtainedAbilities) {
    if (!map.has(ability.level)) map.set(ability.level, { abilities: [], stats: [] });
    map.get(ability.level)!.abilities.push(ability.abilityId);
  }
  for (const entry of state.statHistory) {
    if (!map.has(entry.level)) map.set(entry.level, { abilities: [], stats: [] });
    map.get(entry.level)!.stats.push(entry.stat);
  }
  return map;
}

@Injectable({ providedIn: 'root' })
export class LevelStore {
  private _level = signal(30);

  readonly level = this._level.asReadonly();

  readonly canLevelUp = computed(() => this._level() < MAX_LEVEL);

  canLevelDown(state: BuildState): boolean {
    const lvl = state.level;
    if (lvl <= MIN_LEVEL) return false;
    const map = buildLevelActionMap(state);
    const levelsToRemove = Math.min(5, lvl - MIN_LEVEL);
    for (let i = 1; i <= levelsToRemove; i++) {
      const actions = map.get(lvl - i + 1);
      if (actions && (actions.abilities.length > 0 || actions.stats.length > 0)) {
        return false;
      }
    }
    return true;
  }

  setLevel(level: number): void {
    this._level.set(level);
  }

  canLevelDownAmount(state: BuildState, levels: number): boolean {
    const lvl = state.level;
    if (lvl <= MIN_LEVEL) return false;
    const map = buildLevelActionMap(state);
    const levelsToRemove = Math.min(levels, lvl - MIN_LEVEL);
    for (let i = 1; i <= levelsToRemove; i++) {
      const actions = map.get(lvl - i + 1);
      if (actions && (actions.abilities.length > 0 || actions.stats.length > 0)) {
        return false;
      }
    }
    return true;
  }

  applyLevelUp(state: BuildState): BuildState | null {
    if (state.level >= MAX_LEVEL) return null;
    return {
      ...state,
      level: state.level + 1,
      ap: state.ap + 1,
      sp: state.sp + 1,
    };
  }

  applyLevelUp5(state: BuildState): BuildState | null {
    if (state.level >= MAX_LEVEL) return null;
    const levelsToAdd = Math.min(5, MAX_LEVEL - state.level);
    return {
      ...state,
      level: state.level + levelsToAdd,
      ap: state.ap + levelsToAdd,
      sp: state.sp + levelsToAdd,
    };
  }

  applyLevelDown(state: BuildState): BuildState | null {
    if (state.level <= MIN_LEVEL) return null;

    const map = buildLevelActionMap(state);
    const actions = map.get(state.level);
    if (actions && (actions.abilities.length > 0 || actions.stats.length > 0)) {
      return null;
    }

    const newLevel = state.level - 1;
    const maxAbilities = Math.min(2 + (newLevel - 1), state.obtainedAbilities.length);
    const maxStats = Math.min(newLevel - 1, state.statHistory.length);

    return {
      ...state,
      level: newLevel,
      ap: state.ap - 1,
      sp: state.sp - 1,
      obtainedAbilities: state.obtainedAbilities.slice(0, maxAbilities),
      statHistory: state.statHistory.slice(0, maxStats),
    };
  }

  applyLevelDown5(state: BuildState): BuildState | null {
    if (state.level <= MIN_LEVEL) return null;

    const levelsToRemove = Math.min(5, state.level - MIN_LEVEL);
    const removedLevels: number[] = [];
    for (let i = 1; i <= levelsToRemove; i++) {
      removedLevels.push(state.level - i + 1);
    }

    const map = buildLevelActionMap(state);
    const canRemove = removedLevels.every((lvl) => {
      const actions = map.get(lvl);
      return !actions || (actions.abilities.length === 0 && actions.stats.length === 0);
    });
    if (!canRemove) return null;

    const newLevel = state.level - levelsToRemove;
    const maxAbilities = Math.min(2 + (newLevel - 1), state.obtainedAbilities.length);
    const maxStats = Math.min(newLevel - 1, state.statHistory.length);

    return {
      ...state,
      level: newLevel,
      ap: state.ap - levelsToRemove,
      sp: state.sp - levelsToRemove,
      obtainedAbilities: state.obtainedAbilities.slice(0, maxAbilities),
      statHistory: state.statHistory.slice(0, maxStats),
    };
  }

  getRouteLevelForAbility(obtainedAbilities: readonly ObtainedAbility[]): number {
    for (let level = 1; level <= MAX_LEVEL; level++) {
      const count = obtainedAbilities.filter((a) => a.level === level).length;
      const capacity = level === 1 ? 2 : 1;
      if (count < capacity) {
        return level;
      }
    }
    return MAX_LEVEL;
  }

  getRouteLevelForStat(statHistory: readonly StatAssignment[]): number {
    for (let level = 2; level <= MAX_LEVEL; level++) {
      const count = statHistory.filter((s) => s.level === level).length;
      if (count < 1) {
        return level;
      }
    }
    return MAX_LEVEL;
  }
}
