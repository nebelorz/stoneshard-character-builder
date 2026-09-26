import { Injectable, inject, computed } from '@angular/core';
import {
  BuildState,
  BonusSlot,
  Character,
  StatKey,
  TraitGain,
  TraitGainSp,
  Ability,
  Quest,
  ObtainedAbility,
  addBossRow as addBossRowPure,
  allocateBonusSlot as allocateBonusSlotPure,
  bonusCount as bonusCountPure,
  bossRowCount as bossRowCountPure,
  bonusSlotsForSource as bonusSlotsForSourcePure,
  canAddBossRow as canAddBossRowPure,
  clearTraitSlots as clearTraitSlotsPure,
  deallocateBonusSlot as deallocateBonusSlotPure,
  derivedTraitAp as derivedTraitApPure,
  derivedTraitApFloor as derivedTraitApFloorPure,
  findQuest as findQuestPure,
  findTraitGain as findTraitGainPure,
  isQuestSource as isQuestSourcePure,
  removeBossRow as removeBossRowPure,
  sanitizeBonusSlots as sanitizeBonusSlotsPure,
  traitSpGains as traitSpGainsPure,
} from '@models';
import { QuestDataService } from './quest-data.service';

@Injectable({ providedIn: 'root' })
export class BonusService {
  private readonly questData = inject(QuestDataService);

  readonly quests = computed(() => this.questData.quests.value() ?? []);

  traitSpGains(character: Character | null): TraitGainSp[] {
    return traitSpGainsPure(character);
  }

  findTraitGain(character: Character | null, sourceId: string): TraitGain | null {
    return findTraitGainPure(character, sourceId);
  }

  findQuest(sourceId: string): Quest | null {
    return findQuestPure(this.quests(), sourceId);
  }

  slotsForSource(state: BuildState, sourceId: string): BonusSlot[] {
    return bonusSlotsForSourcePure(state, sourceId);
  }

  bonusCount(state: BuildState, stat: StatKey): number {
    return bonusCountPure(state, stat);
  }

  bossRowCount(state: BuildState, sourceId: string, character: Character | null): number {
    return bossRowCountPure(state, sourceId, character, this.quests());
  }

  canAddBossRow(state: BuildState, sourceId: string, character: Character | null): boolean {
    return canAddBossRowPure(state, sourceId, character, this.quests());
  }

  allocateSlot(
    state: BuildState,
    sourceId: string,
    index: number,
    stat: StatKey,
    character: Character | null,
  ): BuildState | null {
    return allocateBonusSlotPure(state, sourceId, index, stat, character, this.quests());
  }

  deallocateSlot(
    state: BuildState,
    sourceId: string,
    index: number,
    character: Character | null,
  ): BuildState | null {
    return deallocateBonusSlotPure(state, sourceId, index, character);
  }

  addBossRow(state: BuildState, sourceId: string, character: Character | null): BuildState | null {
    return addBossRowPure(state, sourceId, character, this.quests());
  }

  removeBossRow(
    state: BuildState,
    sourceId: string,
    rowIndex: number,
    character: Character | null,
  ): BuildState | null {
    return removeBossRowPure(state, sourceId, rowIndex, character, this.quests());
  }

  clearTraitSlots(state: BuildState): BuildState {
    return clearTraitSlotsPure(state, (sourceId) => this.isQuestSource(sourceId));
  }

  derivedAp(
    character: Character | null,
    obtainedAbilities: readonly ObtainedAbility[],
    allAbilities: readonly Ability[],
  ): number {
    return derivedTraitApPure(character, obtainedAbilities, allAbilities);
  }

  derivedFloor(
    character: Character | null,
    obtainedAbilities: readonly ObtainedAbility[],
    allAbilities: readonly Ability[],
  ): number {
    return derivedTraitApFloorPure(character, obtainedAbilities, allAbilities);
  }

  sanitizeBonusSlots(slots: unknown, character: Character | null): BonusSlot[] | 'invalid' {
    return sanitizeBonusSlotsPure(slots, character, this.quests());
  }

  private isQuestSource(sourceId: string): boolean {
    return isQuestSourcePure(this.quests(), sourceId);
  }
}
