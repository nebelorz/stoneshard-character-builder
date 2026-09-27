import { Ability, DEFAULT_ABILITY_IDS } from './ability.model';
import { BonusSlot, BuildState, ObtainedAbility } from './build-state.model';
import { Character, TraitGain, TraitGainAp, TraitGainSp } from './character.model';
import { isTraitGainAp, isTraitGainSp } from './data-guards';
import { Quest } from './quest.model';
import { isStatKey, StatKey } from './stat-key.model';

export const ABILITY_POINT_BUDGET = 31;
export const STAT_POINT_BUDGET = 29;
export const UNBOUNDED_SOURCE_MAX_ROWS = 10;
export const DISTINCT_TREES_THRESHOLD = 6;
export const DISTINCT_TREES_MAX_AP = 5;
export const ABILITIES_PER_3_STEP = 3;

export function traitGains(character: Character | null): readonly TraitGain[] {
  return character?.traitGains ?? [];
}

export function traitSpGains(character: Character | null): TraitGainSp[] {
  return traitGains(character).filter(isTraitGainSp);
}

export function traitApGains(character: Character | null): TraitGainAp[] {
  return traitGains(character).filter(isTraitGainAp);
}

export function findTraitGain(character: Character | null, sourceId: string): TraitGain | null {
  return traitGains(character).find((g) => g.id === sourceId) ?? null;
}

export function findQuest(quests: readonly Quest[], sourceId: string): Quest | null {
  return quests.find((q) => q.id === sourceId) ?? null;
}

export function isQuestSource(quests: readonly Quest[], sourceId: string): boolean {
  return findQuest(quests, sourceId) !== null;
}

export function traitSourceExistsForCharacter(
  character: Character | null,
  sourceId: string,
): boolean {
  return findTraitGain(character, sourceId) !== null;
}

export function isUnboundedSource(character: Character | null, sourceId: string): boolean {
  const gain = findTraitGain(character, sourceId);
  return gain !== null && isTraitGainSp(gain) && gain.max === undefined;
}

export function unboundedSlotCeiling(character: Character | null, sourceId: string): number {
  const gain = findTraitGain(character, sourceId);
  const per = gain && isTraitGainSp(gain) ? gain.pointsPer : 1;
  return UNBOUNDED_SOURCE_MAX_ROWS * per;
}

export function bonusSlotCeiling(
  character: Character | null,
  quests: readonly Quest[],
  sourceId: string,
): number | null {
  const gain = findTraitGain(character, sourceId);
  if (gain) {
    return isTraitGainSp(gain) ? (gain.max ?? unboundedSlotCeiling(character, sourceId)) : null;
  }
  const quest = findQuest(quests, sourceId);
  return quest ? quest.max : null;
}

export function bonusPointsPer(
  character: Character | null,
  quests: readonly Quest[],
  sourceId: string,
): number {
  const gain = findTraitGain(character, sourceId);
  if (gain && isTraitGainSp(gain)) return gain.pointsPer;
  return findQuest(quests, sourceId)?.pointsPer ?? 1;
}

export function bonusSlotsForSource(state: BuildState, sourceId: string): BonusSlot[] {
  return state.bonusSlots.filter((s) => s.sourceId === sourceId);
}

export function bonusCount(state: BuildState, stat: StatKey): number {
  return state.bonusSlots.filter((s) => s.stat === stat).length;
}

export function bossRowCount(
  state: BuildState,
  sourceId: string,
  character: Character | null,
  quests: readonly Quest[],
): number {
  const per = bonusPointsPer(character, quests, sourceId);
  return Math.ceil(bonusSlotsForSource(state, sourceId).length / per);
}

export function canAddBossRow(
  state: BuildState,
  sourceId: string,
  character: Character | null,
  quests: readonly Quest[],
): boolean {
  if (!isUnboundedSource(character, sourceId)) return false;
  return bossRowCount(state, sourceId, character, quests) < UNBOUNDED_SOURCE_MAX_ROWS;
}

export function isBonusSlotAllocatable(
  state: BuildState,
  sourceId: string,
  index: number,
  character: Character | null,
  quests: readonly Quest[],
): boolean {
  const ceiling = bonusSlotCeiling(character, quests, sourceId);
  if (ceiling === null || index < 0 || index >= ceiling) return false;
  if (isUnboundedSource(character, sourceId)) {
    return state.bonusSlots.some((s) => s.sourceId === sourceId && s.index === index);
  }
  return true;
}

export function allocateBonusSlot(
  state: BuildState,
  sourceId: string,
  index: number,
  stat: StatKey,
  character: Character | null,
  quests: readonly Quest[],
): BuildState | null {
  if (!isBonusSlotAllocatable(state, sourceId, index, character, quests)) return null;
  const existing = state.bonusSlots.find((s) => s.sourceId === sourceId && s.index === index);
  if (existing && existing.stat === stat) return null;
  const entry: BonusSlot = { sourceId, index, stat };
  const bonusSlots = existing
    ? state.bonusSlots.map((s) => (s === existing ? entry : s))
    : [...state.bonusSlots, entry];
  return { ...state, bonusSlots };
}

export function deallocateBonusSlot(
  state: BuildState,
  sourceId: string,
  index: number,
  character: Character | null,
): BuildState | null {
  const existing = state.bonusSlots.find((s) => s.sourceId === sourceId && s.index === index);
  if (!existing || existing.stat === null) return null;

  if (isUnboundedSource(character, sourceId)) {
    return {
      ...state,
      bonusSlots: state.bonusSlots.map((s) => (s === existing ? { ...s, stat: null } : s)),
    };
  }
  return { ...state, bonusSlots: state.bonusSlots.filter((s) => s !== existing) };
}

export function addBossRow(
  state: BuildState,
  sourceId: string,
  character: Character | null,
  quests: readonly Quest[],
): BuildState | null {
  const gain = findTraitGain(character, sourceId);
  if (!gain || !isTraitGainSp(gain) || gain.max !== undefined) return null;
  const rows = bossRowCount(state, sourceId, character, quests);
  if (rows >= UNBOUNDED_SOURCE_MAX_ROWS) return null;

  const entries: BonusSlot[] = Array.from({ length: gain.pointsPer }, (_, k) => ({
    sourceId,
    index: rows * gain.pointsPer + k,
    stat: null,
  }));
  return { ...state, bonusSlots: [...state.bonusSlots, ...entries] };
}

export function removeBossRow(
  state: BuildState,
  sourceId: string,
  rowIndex: number,
  character: Character | null,
  quests: readonly Quest[],
): BuildState | null {
  const gain = findTraitGain(character, sourceId);
  if (!gain || !isTraitGainSp(gain) || gain.max !== undefined) return null;
  const rows = bossRowCount(state, sourceId, character, quests);
  if (rowIndex < 0 || rowIndex >= rows) return null;

  const per = gain.pointsPer;
  const lower = rowIndex * per;
  const upper = lower + per;
  const updated: BonusSlot[] = [];
  for (const slot of state.bonusSlots) {
    if (slot.sourceId !== sourceId) {
      updated.push(slot);
      continue;
    }
    if (slot.index >= lower && slot.index < upper) continue;
    const row = Math.floor(slot.index / per);
    const offset = slot.index - row * per;
    const newRow = row > rowIndex ? row - 1 : row;
    updated.push({ ...slot, index: newRow * per + offset });
  }
  return { ...state, bonusSlots: updated };
}

export function clearTraitSlots(
  state: BuildState,
  isQuest: (sourceId: string) => boolean,
): BuildState {
  return {
    ...state,
    bonusSlots: state.bonusSlots.filter((s) => isQuest(s.sourceId)),
  };
}

export function derivedTraitAp(
  character: Character | null,
  obtainedAbilities: readonly ObtainedAbility[],
  allAbilities: readonly Ability[],
): number {
  const gains = traitApGains(character);
  if (gains.length === 0) return 0;

  const treeOf = new Map(allAbilities.map((a) => [a.id, a.treeId]));
  const learned = obtainedAbilities.filter((o) => !DEFAULT_ABILITY_IDS.includes(o.abilityId));

  const perTree = new Map<string, number>();
  for (const obtained of learned) {
    const tree = treeOf.get(obtained.abilityId);
    if (tree === undefined) continue;
    perTree.set(tree, (perTree.get(tree) ?? 0) + 1);
  }
  const qualifyingTrees = [...perTree.values()].filter(
    (count) => count >= DISTINCT_TREES_THRESHOLD,
  ).length;

  let total = 0;
  for (const gain of gains) {
    if (gain.formula === 'abilities-per-3') {
      const count = perTree.get(gain.treeId ?? '') ?? 0;
      total += Math.floor(count / ABILITIES_PER_3_STEP);
    } else {
      total += Math.min(DISTINCT_TREES_MAX_AP, qualifyingTrees);
    }
  }
  return total;
}

export function derivedTraitApFloor(
  character: Character | null,
  obtainedAbilities: readonly ObtainedAbility[],
  allAbilities: readonly Ability[],
): number {
  return -derivedTraitAp(character, obtainedAbilities, allAbilities);
}

export function sanitizeBonusSlots(
  slots: unknown,
  character: Character | null,
  quests: readonly Quest[],
): BonusSlot[] | 'invalid' {
  if (slots === undefined || slots === null) return [];
  if (!Array.isArray(slots)) return 'invalid';

  const questIds = new Set(quests.map((q) => q.id));
  const seen = new Set<string>();
  const result: BonusSlot[] = [];
  for (const raw of slots) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) continue;
    const entry = raw as Record<string, unknown>;
    const sourceId = entry['sourceId'];
    const index = entry['index'];
    const stat = entry['stat'];
    if (typeof sourceId !== 'string') continue;
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) continue;
    if (stat !== null && !isStatKey(stat)) continue;
    const isTraitSource = traitSourceExistsForCharacter(character, sourceId);
    const isKnownQuest = questIds.has(sourceId);
    if (!isTraitSource && !isKnownQuest) continue;
    const ceiling = bonusSlotCeiling(character, quests, sourceId);
    if (ceiling === null || index >= ceiling) continue;
    const key = `${sourceId}:${index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ sourceId, index, stat: stat as StatKey | null });
  }
  return result;
}
