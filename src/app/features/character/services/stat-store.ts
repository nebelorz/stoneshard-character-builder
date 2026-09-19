import { Injectable, inject } from '@angular/core';
import { BuildState, StatAssignment, Character, StatKey } from '@models';
import { LevelStore } from './level-store';

const MAX_STAT = 30;

@Injectable({ providedIn: 'root' })
export class StatStore {
  private readonly levelStore = inject(LevelStore);

  deriveStats(
    baseStats: Record<StatKey, number>,
    statHistory: readonly StatAssignment[],
  ): Record<StatKey, number> {
    const stats: Record<StatKey, number> = { ...baseStats };
    for (const entry of statHistory) {
      stats[entry.stat] = Math.min(MAX_STAT, (stats[entry.stat] ?? 0) + 1);
    }
    return stats;
  }

  canIncrementStat(state: BuildState, stat: StatKey): boolean {
    const currentValue = state.stats[stat] ?? 0;
    const hasBoulderCircleBonus = state.boulderCircleStat === stat;
    const maxStat = hasBoulderCircleBonus ? MAX_STAT + 1 : MAX_STAT;
    return state.sp > 0 && currentValue < maxStat;
  }

  canDecrementStat(state: BuildState, stat: StatKey, character: Character): boolean {
    const currentValue = state.stats[stat] ?? 0;
    const baseValue = character.baseStats[stat] ?? 0;
    return currentValue > baseValue;
  }

  applyIncrementStat(state: BuildState, stat: StatKey): BuildState | null {
    if (state.sp <= 0) return null;

    const currentValue = state.stats[stat] ?? 0;
    const hasBoulderCircleBonus = state.boulderCircleStat === stat;
    const maxStat = hasBoulderCircleBonus ? MAX_STAT + 1 : MAX_STAT;
    if (currentValue >= maxStat) return null;

    const routeLevel = this.levelStore.getRouteLevelForStat(state.statHistory);
    const newStats = { ...state.stats, [stat]: currentValue + 1 };

    const existingAtLevel = state.statHistory.filter((h) => h.level === routeLevel);
    const nextOrder = existingAtLevel.length + 1;
    const newEntry: StatAssignment = { level: routeLevel, order: nextOrder, stat };

    return {
      ...state,
      sp: state.sp - 1,
      stats: newStats,
      statHistory: [...state.statHistory, newEntry],
    };
  }

  applyIncrementStat5(state: BuildState, stat: StatKey): BuildState | null {
    const currentValue = state.stats[stat] ?? 0;
    const hasBoulderCircleBonus = state.boulderCircleStat === stat;
    const maxStat = hasBoulderCircleBonus ? MAX_STAT + 1 : MAX_STAT;
    const maxIncrement = Math.min(5, state.sp, maxStat - currentValue);
    if (maxIncrement <= 0) return null;

    const newStats = { ...state.stats, [stat]: currentValue + maxIncrement };
    const newHistoryEntries: StatAssignment[] = [];
    let currentStatHistory = [...state.statHistory];

    for (let i = 0; i < maxIncrement; i++) {
      const routeLevel = this.levelStore.getRouteLevelForStat(currentStatHistory);

      const existingAtLevel = currentStatHistory.filter((h) => h.level === routeLevel);
      const nextOrder = existingAtLevel.length + 1;
      const newEntry: StatAssignment = { level: routeLevel, order: nextOrder, stat };
      newHistoryEntries.push(newEntry);
      currentStatHistory = [...currentStatHistory, newEntry];
    }

    return {
      ...state,
      sp: state.sp - maxIncrement,
      stats: newStats,
      statHistory: [...state.statHistory, ...newHistoryEntries],
    };
  }

  applyDecrementStat(state: BuildState, stat: StatKey, character: Character): BuildState | null {
    const currentValue = state.stats[stat] ?? 0;
    const baseValue = character.baseStats[stat] ?? 0;
    if (currentValue <= baseValue) return null;

    let lastIndex = -1;
    for (let i = state.statHistory.length - 1; i >= 0; i--) {
      if (state.statHistory[i].stat === stat) {
        lastIndex = i;
        break;
      }
    }
    const newStatHistory =
      lastIndex >= 0
        ? [...state.statHistory.slice(0, lastIndex), ...state.statHistory.slice(lastIndex + 1)]
        : state.statHistory;

    const newStats = { ...state.stats, [stat]: currentValue - 1 };
    return { ...state, sp: state.sp + 1, stats: newStats, statHistory: newStatHistory };
  }

  applyDecrementStat5(state: BuildState, stat: StatKey, character: Character): BuildState | null {
    const currentValue = state.stats[stat] ?? 0;
    const baseValue = character.baseStats[stat] ?? 0;
    const maxDecrement = Math.min(5, currentValue - baseValue);
    if (maxDecrement <= 0) return null;

    let newStatHistory = [...state.statHistory];
    for (let i = 0; i < maxDecrement; i++) {
      let lastIndex = -1;
      for (let j = newStatHistory.length - 1; j >= 0; j--) {
        if (newStatHistory[j].stat === stat) {
          lastIndex = j;
          break;
        }
      }
      if (lastIndex >= 0) {
        newStatHistory = [
          ...newStatHistory.slice(0, lastIndex),
          ...newStatHistory.slice(lastIndex + 1),
        ];
      }
    }

    const newStats = { ...state.stats, [stat]: currentValue - maxDecrement };
    return {
      ...state,
      sp: state.sp + maxDecrement,
      stats: newStats,
      statHistory: newStatHistory,
    };
  }
}
