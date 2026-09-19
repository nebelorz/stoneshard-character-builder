import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouteDisplayComponent } from './route-display';
import { AbilityDataService, AbilityHoverService } from '@features/ability-trees/services';
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
  treeId: 'staves',
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

const MOCK_ABILITIES: Ability[] = [
  ability({ id: 'staves-1', name: 'Test Strike', description: 'A forceful test strike.' }),
  ability({ id: 'staves-2', name: 'Test Guard', description: 'A stalwart test guard.' }),
  ability({ id: 'staves-3', name: 'Test Rush', description: 'A swift test rush.' }),
];

describe('RouteDisplayComponent', () => {
  let fixture: ComponentFixture<RouteDisplayComponent>;
  let buildStore: BuildStore;
  let hoverService: AbilityHoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouteDisplayComponent],
      providers: [
        provideNoopAnimations(),
        BuildStore,
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => MOCK_ABILITIES,
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
    hoverService = TestBed.inject(AbilityHoverService);
    fixture = TestBed.createComponent(RouteDisplayComponent);
    fixture.detectChanges();
  });

  function restoreLevelOneState(): void {
    buildStore.restoreState({
      characterId: 'jorna',
      level: 1,
      ap: 2,
      sp: 0,
      stats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
      obtainedAbilities: [],
      pinnedTrees: [],
      statHistory: [],
      boulderCircleStat: null,
    });
  }

  function buildTwoLevelRoute(): void {
    restoreLevelOneState();
    buildStore.obtainAbility('staves-1');
    buildStore.obtainAbility('staves-2');
    buildStore.levelUp();
    buildStore.obtainAbility('staves-3');
    buildStore.incrementStat('STR');
    fixture.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.level).toBe(2);
  }

  function getLevelSlotsCell(level: number): HTMLElement {
    const levelCells = Array.from(
      fixture.nativeElement.querySelectorAll('.right-sidenav__route-level-cell'),
    ) as HTMLElement[];
    const slotsCells = Array.from(
      fixture.nativeElement.querySelectorAll('.right-sidenav__route-slots-cell'),
    ) as HTMLElement[];
    const index = levelCells.findIndex(
      (cell) =>
        cell.querySelector('.right-sidenav__route-level-num')?.textContent?.trim() ===
        String(level),
    );
    return slotsCells[index];
  }

  function firstAssignedEntry(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.right-sidenav__route-entry--assigned',
    ) as HTMLElement;
  }

  it('renders a Level 1 row with two ability entries and no stat chip', () => {
    buildTwoLevelRoute();
    const level1Slots = getLevelSlotsCell(1);
    expect(level1Slots.querySelectorAll('.right-sidenav__route-entry--assigned').length).toBe(2);
    expect(level1Slots.querySelectorAll('.stat-chip').length).toBe(0);
  });

  it('renders a Level 2 row with one ability entry and one stat chip', () => {
    buildTwoLevelRoute();
    const level2Slots = getLevelSlotsCell(2);
    expect(level2Slots.querySelectorAll('.right-sidenav__route-entry--assigned').length).toBe(1);
    expect(level2Slots.querySelectorAll('.stat-chip').length).toBe(1);
  });

  it('highlights the shared hover service on hover and renders no tooltip', () => {
    buildTwoLevelRoute();
    const entry = firstAssignedEntry();
    entry.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(hoverService.hoveredAbilityId()).toBe('staves-1');
    expect(document.body.querySelector('.right-sidenav__route-tooltip')).toBeNull();
    expect(entry.getAttribute('aria-describedby')).toBeNull();

    entry.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    expect(hoverService.hoveredAbilityId()).toBeNull();
  });

  it('highlights the shared hover service on focus and renders no tooltip', () => {
    buildTwoLevelRoute();
    const entry = firstAssignedEntry();
    entry.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    fixture.detectChanges();

    expect(hoverService.hoveredAbilityId()).toBe('staves-1');
    expect(document.body.querySelector('.right-sidenav__route-tooltip')).toBeNull();
    expect(entry.getAttribute('aria-describedby')).toBeNull();

    entry.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(hoverService.hoveredAbilityId()).toBeNull();
  });

  it('does not render a tooltip over an empty slot', () => {
    buildStore.obtainAbility('staves-1');
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector(
      '.right-sidenav__route-entry--empty',
    ) as HTMLElement;
    expect(empty).toBeTruthy();
    empty.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    expect(document.body.querySelector('.right-sidenav__route-tooltip')).toBeNull();
  });

  it('renders empty level-1 slots without duplicate-key errors', () => {
    restoreLevelOneState();
    expect(() => fixture.detectChanges()).not.toThrow();
    const emptySlots = fixture.nativeElement.querySelectorAll('.right-sidenav__route-entry--empty');
    expect(emptySlots.length).toBe(2);
  });

  it('shows the pointer cursor on assigned stat chips', () => {
    buildTwoLevelRoute();
    const chip = fixture.nativeElement.querySelector('.stat-chip') as HTMLElement;
    expect(chip).toBeTruthy();
    expect(getComputedStyle(chip).cursor).toBe('pointer');
  });
});
