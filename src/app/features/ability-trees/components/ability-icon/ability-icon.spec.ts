import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbilityIconComponent } from './ability-icon';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { CharacterDataService } from '@features/character/services';
import { Ability, BuildState } from '@models';

function getReadyState(store: BuildStore): BuildState {
  const snapshot = store.stateSnapshot();
  if (!snapshot || !('characterId' in snapshot)) {
    throw new Error('Store is not ready');
  }
  return snapshot as BuildState;
}

const MOCK_CHARACTER = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: ['warfare'],
};

const ability = (partial: Partial<Ability>): Ability => ({
  id: '',
  name: '',
  treeId: 'survival',
  x: 0,
  y: 0,
  type: 'passive',
  target: 'No Target',
  range: 1,
  energy: 0,
  cooldown: 0,
  modifiedByLabel: '',
  requires: [],
  unlockConditions: [],
  description: '',
  requiredBy: [],
  ...partial,
});

const SURVIVAL_ABILITIES: Ability[] = [
  ability({
    id: 'survival-1',
    name: 'Butchering',
    requiredBy: ['survival-4', 'survival-5'],
  }),
  ability({
    id: 'survival-4',
    name: 'Forage',
    requires: ['survival-1'],
    requiredBy: ['survival-8'],
  }),
];

describe('AbilityIconComponent', () => {
  let fixture: ComponentFixture<AbilityIconComponent>;
  let buildStore: BuildStore;

  function setup(abilityId: string): void {
    TestBed.configureTestingModule({
      imports: [AbilityIconComponent],
      providers: [
        BuildStore,
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => SURVIVAL_ABILITIES,
              status: () => 'ready' as const,
              error: () => null,
            },
            trees: {
              value: () => [],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              value: () => [MOCK_CHARACTER],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
      ],
    });

    buildStore = TestBed.inject(BuildStore);
    buildStore.initialize();
    const component = TestBed.createComponent(AbilityIconComponent);
    component.componentRef.setInput(
      'ability',
      SURVIVAL_ABILITIES.find((a) => a.id === abilityId),
    );
    component.componentRef.setInput('treeId', 'survival');
    fixture = component;
    fixture.detectChanges();
  }

  it('renders a default active ability as obtained with no level badge and no lock overlay', () => {
    setup('survival-1');
    const icon = fixture.nativeElement.querySelector('.ability-icon') as HTMLElement;
    expect(icon.classList.contains('ability-icon--obtained')).toBe(true);
    expect(icon.classList.contains('ability-icon--locked')).toBe(false);
    expect(icon.querySelector('.ability-icon__locked-overlay')).toBeNull();
    expect(icon.querySelector('.ability-icon__level')).toBeNull();
  });

  it('does not obtain a default active ability on click', () => {
    setup('survival-1');
    const icon = fixture.nativeElement.querySelector('.ability-icon') as HTMLElement;
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.ap).toBe(31);
  });

  it('does not refund a default active ability on context menu', () => {
    setup('survival-1');
    const icon = fixture.nativeElement.querySelector('.ability-icon') as HTMLElement;
    icon.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    fixture.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.ap).toBe(31);
  });

  it('unlocks an ability that requires a default active ability', () => {
    setup('survival-4');
    const icon = fixture.nativeElement.querySelector('.ability-icon') as HTMLElement;
    expect(icon.classList.contains('ability-icon--unlocked')).toBe(true);
    expect(icon.classList.contains('ability-icon--locked')).toBe(false);
  });

  it('allows obtaining an ability whose prerequisite is a default active ability', () => {
    setup('survival-4');
    const icon = fixture.nativeElement.querySelector('.ability-icon') as HTMLElement;
    let emitted: string | undefined;
    fixture.componentInstance.obtain.subscribe((id) => (emitted = id));
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toBe('survival-4');

    expect(buildStore.obtainAbility('survival-4')).toBe(true);
    fixture.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities.map((a) => a.abilityId)).toContain('survival-4');
    expect(state.ap).toBe(30);
  });
});
