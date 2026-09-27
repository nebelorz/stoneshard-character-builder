import { Injectable, inject, signal, computed } from '@angular/core';
import {
  ABILITY_POINT_BUDGET,
  STAT_POINT_BUDGET,
  BuildState,
  BuildNotes,
  Character,
  Ability,
  StatKey,
  BonusSlot,
} from '@models';
import { CharacterDataService } from '../data/character-data.service';
import { AbilityDataService } from '../data/ability-data.service';
import { LevelStore } from './level-store';
import { StatStore } from './stat-store';
import { AbilityStore } from './ability-store';
import { BonusService } from './bonus.service';

type InitStatus = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class BuildStore {
  private readonly characterData = inject(CharacterDataService);
  private readonly abilityData = inject(AbilityDataService);
  private readonly levelStore = inject(LevelStore);
  private readonly statStore = inject(StatStore);
  private readonly abilityStore = inject(AbilityStore);
  private readonly bonusService = inject(BonusService);

  private readonly _state = signal<BuildState | null>(null);
  private readonly _character = signal<Character | null>(null);
  private readonly _abilities = signal<Ability[]>([]);
  private readonly _initStatus = signal<InitStatus>('idle');
  private readonly _initError = signal<string>('');
  private _initialized = false;

  readonly state = this._state.asReadonly();
  readonly character = this._character.asReadonly();

  readonly initStatus = this._initStatus.asReadonly();
  readonly initError = this._initError.asReadonly();

  readonly stateSnapshot = computed(() => {
    const state = this._state();
    if (!state) return { ready: false } as const;
    return state;
  });

  readonly canLevelUp = computed(() => this.levelStore.canLevelUp());
  readonly canLevelDown = computed(() => {
    const state = this._state();
    if (!state) return false;
    return this.levelStore.canLevelDown(state);
  });
  readonly canLevelUp5 = computed(() => this.levelStore.level() <= 25);
  readonly canLevelDown5 = computed(() => {
    const state = this._state();
    if (!state) return false;
    return this.levelStore.canLevelDownAmount(state, 5);
  });

  readonly traitsUnlockedOnStart = computed(() => this._character()?.traitsUnlockedOnStart ?? []);

  readonly derivedTraitAp = computed(() => {
    const state = this._state();
    const character = this._character();
    if (!state || !character) return 0;
    return this.bonusService.derivedAp(character, state.obtainedAbilities, this._abilities());
  });

  readonly totalAp = computed(() => (this._state()?.ap ?? 0) + this.derivedTraitAp());

  initialize(): void {
    if (this._initialized || this._initStatus() === 'loading') return;

    this._initStatus.set('loading');
    this._initError.set('');

    try {
      const characters = this.characterData.characters.value();
      const abilities = this.abilityData.abilities.value();

      const character = characters?.[0] ?? null;
      this._character.set(character);
      this._abilities.set(abilities ?? []);

      if (character) {
        this.resetToCharacter(character);
      }
      this._initStatus.set('ready');
      this._initialized = true;
    } catch (err: unknown) {
      this._initError.set((err as Error)?.message ?? 'Failed to initialize build store');
      this._initStatus.set('error');
    }
  }

  selectCharacter(characterId: string): void {
    const characters = this.characterData.characters.value() ?? [];
    const character = characters.find((c) => c.id === characterId);
    if (!character || character.id === this._character()?.id) return;

    const state = this._state();
    if (!state) return;

    const oldCharacter = this._character();
    const abilities = this._abilities();
    const oldDerived = this.bonusService.derivedAp(
      oldCharacter,
      state.obtainedAbilities,
      abilities,
    );
    const newDerived = this.bonusService.derivedAp(character, state.obtainedAbilities, abilities);
    const totalAp = state.ap + oldDerived;

    this._character.set(character);
    this.pushState({
      ...state,
      characterId: character.id,
      ap: totalAp - newDerived,
      stats: this.statStore.deriveStats(character.baseStats, state.statHistory),
      bonusSlots: this.bonusService.clearTraitSlots(state).bonusSlots,
    });
  }

  reset(): void {
    const character = this._character();
    if (character) {
      this.resetToCharacter(character);
    }
  }

  restoreState(state: BuildState): void {
    const characters = this.characterData.characters.value() ?? [];
    const character = characters.find((c) => c.id === state.characterId);
    if (character) {
      this._character.set(character);
    }

    const derivedFloor = this.bonusService.derivedFloor(
      character ?? null,
      state.obtainedAbilities,
      this._abilities(),
    );
    this.levelStore.setLevel(state.level);
    this._state.set({
      ...state,
      ap: Math.max(state.ap, derivedFloor),
      bonusSlots: state.bonusSlots ?? [],
      notes: state.notes ?? { buildName: '', author: '', content: '' },
    });
  }

  levelUp(): void {
    const state = this._state();
    if (!state) return;
    const newState = this.levelStore.applyLevelUp(state);
    if (newState) this.pushState(newState);
  }

  levelUp5(): void {
    const state = this._state();
    if (!state) return;
    const newState = this.levelStore.applyLevelUp5(state);
    if (newState) this.pushState(newState);
  }

  levelDown(): void {
    const state = this._state();
    if (!state) return;
    const newState = this.levelStore.applyLevelDown(state);
    if (newState) this.pushState(newState);
  }

  levelDown5(): void {
    const state = this._state();
    if (!state) return;
    const newState = this.levelStore.applyLevelDown5(state);
    if (newState) this.pushState(newState);
  }

  incrementStat(stat: StatKey): void {
    const state = this._state();
    if (!state) return;
    const newState = this.statStore.applyIncrementStat(state, stat);
    if (newState) this.pushState(newState);
  }

  incrementStat5(stat: StatKey): void {
    const state = this._state();
    if (!state) return;
    const newState = this.statStore.applyIncrementStat5(state, stat);
    if (newState) this.pushState(newState);
  }

  decrementStat(stat: StatKey): void {
    const state = this._state();
    if (!state) return;
    const character = this._character();
    if (!character) return;
    const newState = this.statStore.applyDecrementStat(state, stat, character);
    if (newState) this.pushState(newState);
  }

  decrementStat5(stat: StatKey): void {
    const state = this._state();
    if (!state) return;
    const character = this._character();
    if (!character) return;
    const newState = this.statStore.applyDecrementStat5(state, stat, character);
    if (newState) this.pushState(newState);
  }

  obtainAbility(abilityId: string): boolean {
    const state = this._state();
    if (!state) return false;
    const allAbilities = this._abilities();
    const newState = this.abilityStore.applyObtainAbility(
      state,
      abilityId,
      allAbilities,
      (obtained) => this.bonusService.derivedAp(this._character(), obtained, allAbilities),
    );
    if (newState) {
      this.pushState(newState);
      return true;
    }
    return false;
  }

  refundAbility(abilityId: string): boolean {
    const state = this._state();
    if (!state) return false;
    const allAbilities = this._abilities();
    const newState = this.abilityStore.applyRefundAbility(state, abilityId, allAbilities);
    if (newState) {
      this.pushState(newState);
      return true;
    }
    return false;
  }

  pinTree(treeId: string): void {
    const state = this._state();
    if (!state) return;
    const newState = this.applyPinTree(state, treeId);
    if (newState) this.pushState(newState);
  }

  unpinTree(treeId: string): void {
    const state = this._state();
    if (!state) return;
    const newState = this.applyUnpinTree(state, treeId);
    if (newState) this.pushState(newState);
  }

  resetTree(treeId: string): void {
    const state = this._state();
    if (!state) return;
    const newState = this.applyResetTree(state, treeId);
    if (newState) this.pushState(newState);
  }

  canIncrementStat1(stat: StatKey): boolean {
    const state = this._state();
    if (!state) return false;
    return this.statStore.canIncrementStat(state, stat);
  }

  canDecrementStat1(stat: StatKey): boolean {
    const state = this._state();
    if (!state) return false;
    const character = this._character();
    if (!character) return false;
    return this.statStore.canDecrementStat(state, stat, character);
  }

  canIncrementStat5(stat: StatKey): boolean {
    const state = this._state();
    if (!state) return false;
    return this.statStore.canIncrementStat(state, stat);
  }

  canDecrementStat5(stat: StatKey): boolean {
    const state = this._state();
    if (!state) return false;
    const character = this._character();
    if (!character) return false;
    return this.statStore.canDecrementStat(state, stat, character);
  }

  allocateBonusSlot(sourceId: string, index: number, stat: StatKey): void {
    const state = this._state();
    if (!state) return;
    const newState = this.bonusService.allocateSlot(
      state,
      sourceId,
      index,
      stat,
      this._character(),
    );
    if (newState) this.pushState(newState);
  }

  deallocateBonusSlot(sourceId: string, index: number): void {
    const state = this._state();
    if (!state) return;
    const newState = this.bonusService.deallocateSlot(state, sourceId, index, this._character());
    if (newState) this.pushState(newState);
  }

  addBossRow(sourceId: string): void {
    const state = this._state();
    if (!state) return;
    const newState = this.bonusService.addBossRow(state, sourceId, this._character());
    if (newState) this.pushState(newState);
  }

  removeBossRow(sourceId: string, rowIndex: number): void {
    const state = this._state();
    if (!state) return;
    const newState = this.bonusService.removeBossRow(state, sourceId, rowIndex, this._character());
    if (newState) this.pushState(newState);
  }

  canAddBossRow(sourceId: string): boolean {
    const state = this._state();
    if (!state) return false;
    return this.bonusService.canAddBossRow(state, sourceId, this._character());
  }

  bossRowCount(sourceId: string): number {
    const state = this._state();
    if (!state) return 0;
    return this.bonusService.bossRowCount(state, sourceId, this._character());
  }

  bonusCount(stat: StatKey): number {
    const state = this._state();
    if (!state) return 0;
    return this.bonusService.bonusCount(state, stat);
  }

  slotsForSource(sourceId: string): readonly BonusSlot[] {
    const state = this._state();
    if (!state) return [];
    return this.bonusService.slotsForSource(state, sourceId);
  }

  applySetNotes(notes: Partial<BuildNotes>): void {
    const state = this._state();
    if (!state) return;
    this.pushState({
      ...state,
      notes: { ...state.notes, ...notes },
    });
  }

  private applyPinTree(state: BuildState, treeId: string): BuildState | null {
    if (state.pinnedTrees.includes(treeId)) return null;
    return {
      ...state,
      pinnedTrees: [...state.pinnedTrees, treeId],
    };
  }

  private applyUnpinTree(state: BuildState, treeId: string): BuildState | null {
    return {
      ...state,
      pinnedTrees: state.pinnedTrees.filter((id) => id !== treeId),
    };
  }

  private applyResetTree(state: BuildState, treeId: string): BuildState | null {
    const prefix = `${treeId}-`;
    const removedCount = state.obtainedAbilities.filter((a) =>
      a.abilityId.startsWith(prefix),
    ).length;
    if (removedCount === 0) return null;
    return {
      ...state,
      ap: state.ap + removedCount,
      obtainedAbilities: state.obtainedAbilities.filter((a) => !a.abilityId.startsWith(prefix)),
    };
  }

  private pushState(newState: BuildState): void {
    this.levelStore.setLevel(newState.level);
    this._state.set(newState);
  }

  private resetToCharacter(character: Character): void {
    if (!character?.id) return;

    const initialState: BuildState = {
      characterId: character.id,
      level: 30,
      ap: ABILITY_POINT_BUDGET,
      sp: STAT_POINT_BUDGET,
      stats: { ...character.baseStats },
      obtainedAbilities: [],
      pinnedTrees: this._state()?.pinnedTrees ?? [],
      statHistory: [],
      bonusSlots: [],
      notes: { buildName: '', author: '', content: '' },
    };
    this.levelStore.setLevel(initialState.level);
    this._state.set(initialState);
  }
}
