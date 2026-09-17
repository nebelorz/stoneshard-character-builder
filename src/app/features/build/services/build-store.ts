import { Injectable, inject, signal, computed } from '@angular/core';
import { BuildState, Character, Ability, StatKey } from '@models';
import { CharacterDataService, LevelStore, StatStore } from '@features/character/services';
import { AbilityDataService, AbilityStore } from '@features/ability-trees/services';

const INITIAL_AP = 31;
const INITIAL_SP = 29;

type InitStatus = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class BuildStore {
  private readonly characterData = inject(CharacterDataService);
  private readonly abilityData = inject(AbilityDataService);
  private readonly levelStore = inject(LevelStore);
  private readonly statStore = inject(StatStore);
  private readonly abilityStore = inject(AbilityStore);

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

    this._character.set(character);
    this.pushState({
      ...state,
      characterId: character.id,
      stats: this.statStore.deriveStats(character.baseStats, state.statHistory),
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

    this.levelStore.setLevel(state.level);
    this._state.set({ ...state });
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
    const newState = this.abilityStore.applyObtainAbility(state, abilityId, allAbilities);
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

  private pushState(newState: BuildState): void {
    this.levelStore.setLevel(newState.level);
    this._state.set(newState);
  }

  private resetToCharacter(character: Character): void {
    if (!character?.id) return;

    const initialState: BuildState = {
      characterId: character.id,
      level: 30,
      ap: INITIAL_AP,
      sp: INITIAL_SP,
      stats: { ...character.baseStats },
      obtainedAbilities: [],
      pinnedTrees: this._state()?.pinnedTrees ?? [],
      statHistory: [],
    };
    this.levelStore.setLevel(initialState.level);
    this._state.set(initialState);
  }
}
