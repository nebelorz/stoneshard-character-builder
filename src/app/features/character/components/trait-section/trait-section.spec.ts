import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TraitSectionComponent } from './trait-section';
import { BuildStore } from '@core/state';
import { CharacterDataService, AbilityDataService, QuestDataService } from '@core/data';
import { Character, Ability } from '@models';

const MOCK_QUESTS = [
  {
    id: 'boulder-circle',
    resource: 'sp' as const,
    label: 'Boulder Circle',
    tooltip: 'Grants 1 Stat Point',
    pointsPer: 1,
    max: 1,
  },
];

const VELMIR: Character = {
  id: 'velmir',
  name: 'Velmir',
  title: 'Revenger',
  race: 'Human (Skadian)',
  gender: 'Male',
  trait: { name: 'With Great Vengeance', description: 'Grants 2 Stat Points per killed Boss.' },
  baseStats: { STR: 11, AGI: 11, PER: 11, VIT: 10, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [{ id: 'bosses', resource: 'sp', label: 'Bosses killed', pointsPer: 2 }],
};

const JORGRIM: Character = {
  id: 'jorgrim',
  name: 'Jorgrim',
  title: 'Reaver',
  race: 'Dwarf (Fjall)',
  gender: 'Male',
  trait: { name: 'Gore and Glory', description: 'Grants trophy points.' },
  baseStats: { STR: 11, AGI: 10, PER: 11, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [
    { id: 'trophies', resource: 'sp', label: 'Trophies delivered', pointsPer: 1, max: 5 },
  ],
};

const DIRWIN: Character = {
  id: 'dirwin',
  name: 'Dirwin',
  title: 'Woodward',
  race: 'Human (Aldor)',
  gender: 'Male',
  trait: { name: "Ranger's Grit", description: 'Dens and survival AP.' },
  baseStats: { STR: 10, AGI: 11, PER: 11, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
  traitGains: [
    { id: 'dens', resource: 'sp', label: 'Dens and caves cleared', pointsPer: 1, max: 3 },
    {
      id: 'survival',
      resource: 'ap',
      label: 'Survival abilities learned',
      formula: 'abilities-per-3',
      treeId: 'survival',
    },
  ],
};

const ARNA: Character = {
  id: 'arna',
  name: 'Arna',
  title: 'Maiden Knight',
  race: 'Human (Aldor)',
  gender: 'Female',
  trait: { name: 'Vow of the Feat', description: 'Psyche effects.' },
  baseStats: { STR: 11, AGI: 11, PER: 10, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
};

const MOCK_ABILITIES: Ability[] = [
  'survival-2',
  'survival-3',
  'survival-4',
  'survival-5',
  'survival-6',
  'survival-7',
].map((id) => ({
  id,
  name: id,
  treeId: 'survival',
  x: 0,
  y: 0,
  type: 'passive' as const,
  target: 'No Target' as const,
  range: 1,
  energy: 0,
  cooldown: 0,
  modifiedByLabel: 'PER',
  requires: [],
  unlockConditions: [],
  description: '',
  requiredBy: [],
}));

function setup(characters: Character[]): {
  fixture: ComponentFixture<TraitSectionComponent>;
  store: BuildStore;
} {
  TestBed.configureTestingModule({
    imports: [TraitSectionComponent],
    providers: [
      BuildStore,
      {
        provide: CharacterDataService,
        useValue: {
          characters: {
            value: () => characters,
            status: () => 'ready' as const,
            error: () => null,
            reload: () => {},
          },
        },
      },
      {
        provide: AbilityDataService,
        useValue: {
          abilities: {
            value: () => MOCK_ABILITIES,
            status: () => 'ready' as const,
            error: () => null,
            reload: () => {},
          },
        },
      },
      {
        provide: QuestDataService,
        useValue: {
          quests: {
            value: () => MOCK_QUESTS,
            status: () => 'ready' as const,
            error: () => null,
            reload: () => {},
          },
        },
      },
    ],
  });
  const store = TestBed.inject(BuildStore);
  store.initialize();
  const fixture = TestBed.createComponent(TraitSectionComponent);
  fixture.detectChanges();
  return { fixture, store };
}

describe('TraitSectionComponent', () => {
  it('renders trait name and an interactive info affordance', () => {
    const { fixture } = setup([JORGRIM]);
    expect(fixture.nativeElement.textContent).toContain('Gore and Glory');
    const info = fixture.nativeElement.querySelector(
      '.left-sidenav__trait-info',
    ) as HTMLElement | null;
    expect(info).not.toBeNull();
    expect(info!.getAttribute('role')).toBe('button');
    expect(info!.getAttribute('aria-label')).toBe('Show Gore and Glory description');
  });

  describe('Jorgrim (bounded gains)', () => {
    let fixture: ComponentFixture<TraitSectionComponent>;
    let store: BuildStore;

    beforeEach(() => {
      ({ fixture, store } = setup([JORGRIM]));
    });

    it('renders 5 bounded point slots', () => {
      const slots = fixture.nativeElement.querySelectorAll('app-point-slot-row');
      expect(slots.length).toBe(5);
    });

    it('renders the group label', () => {
      expect(fixture.nativeElement.textContent).toContain('Trophies delivered');
    });

    it('allocates and deallocates through the store', () => {
      store.allocateBonusSlot('trophies', 0, 'STR');
      fixture.detectChanges();
      const chips = fixture.nativeElement.querySelectorAll('.stat-chip--str');
      expect(chips.length).toBe(1);

      store.deallocateBonusSlot('trophies', 0);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.stat-chip--str').length).toBe(0);
    });
  });

  describe('Velmir (unbounded gains)', () => {
    let fixture: ComponentFixture<TraitSectionComponent>;
    let store: BuildStore;

    beforeEach(() => {
      ({ fixture, store } = setup([VELMIR]));
    });

    it('starts with no boss rows and shows the stepper', () => {
      expect(fixture.nativeElement.querySelectorAll('app-point-slot-row').length).toBe(0);
      const stepper = fixture.nativeElement.querySelector('.left-sidenav__trait-stepper');
      expect(stepper).not.toBeNull();
    });

    it('renders the stepper in the group header, right of the label', () => {
      const header = fixture.nativeElement.querySelector(
        '.left-sidenav__trait-group-header',
      ) as HTMLElement;
      expect(header).not.toBeNull();
      expect(header.querySelector('.left-sidenav__trait-group-label')).not.toBeNull();
      expect(header.querySelector('.left-sidenav__trait-stepper')).not.toBeNull();
    });

    it('appends 2 slots (one boss row) when clicking add', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.left-sidenav__trait-stepper button',
      ) as NodeListOf<HTMLButtonElement>;
      const addBtn = Array.from(buttons).find(
        (b) => (b as HTMLButtonElement).getAttribute('aria-label') === 'Add boss row',
      );
      addBtn!.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('app-point-slot-row').length).toBe(2);
    });

    it('allocates a slot in a boss row', () => {
      store.addBossRow('bosses');
      store.allocateBonusSlot('bosses', 1, 'VIT');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.stat-chip--vit').length).toBe(1);
    });

    it('removes the last boss row via the stepper', () => {
      store.addBossRow('bosses');
      store.addBossRow('bosses');
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll(
        '.left-sidenav__trait-stepper button',
      ) as NodeListOf<HTMLButtonElement>;
      const removeBtn = Array.from(buttons).find(
        (b) => b.getAttribute('aria-label') === 'Remove boss row',
      );
      removeBtn!.click();
      fixture.detectChanges();
      const snapshot = store.stateSnapshot();
      if (!('characterId' in snapshot)) throw new Error('Store not ready');
      expect(snapshot.bonusSlots.length).toBe(2);
    });

    it('renders stepper buttons with descriptive aria labels', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.left-sidenav__trait-stepper button',
      ) as NodeListOf<HTMLButtonElement>;
      expect(buttons.length).toBe(2);
      expect(buttons[0].getAttribute('aria-label')).toBe('Remove boss row');
      expect(buttons[1].getAttribute('aria-label')).toBe('Add boss row');
    });

    it('renders the remove button as disabled while there are no boss rows', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.left-sidenav__trait-stepper button',
      ) as NodeListOf<HTMLButtonElement>;
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(false);
    });
  });

  describe('Dirwin (mixed gains)', () => {
    let fixture: ComponentFixture<TraitSectionComponent>;
    let store: BuildStore;

    beforeEach(() => {
      ({ fixture, store } = setup([DIRWIN]));
    });

    it('renders 3 dens slots', () => {
      const slots = fixture.nativeElement.querySelectorAll('app-point-slot-row');
      expect(slots.length).toBe(3);
    });

    it('shows no derived AP badge without qualifying abilities', () => {
      expect(fixture.nativeElement.querySelector('.left-sidenav__trait-derived-ap')).toBeNull();
    });

    it('shows the derived AP badge when enough Survival abilities are learned', () => {
      store.obtainAbility('survival-2');
      store.obtainAbility('survival-3');
      store.obtainAbility('survival-4');
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector(
        '.left-sidenav__trait-derived-ap',
      ) as HTMLElement;
      expect(badge).not.toBeNull();
      expect(badge.textContent).toContain('+1 AP');
      expect(badge.querySelector('.visually-hidden')?.textContent?.trim()).toBe(
        'Includes 1 trait-derived Ability Points',
      );
    });
  });

  describe('Arna (no gains)', () => {
    it('renders only the trait name and description affordance', () => {
      const { fixture } = setup([ARNA]);
      expect(fixture.nativeElement.querySelectorAll('app-point-slot-row').length).toBe(0);
      expect(fixture.nativeElement.querySelector('.left-sidenav__trait-stepper')).toBeNull();
      expect(fixture.nativeElement.querySelector('.left-sidenav__trait-derived-ap')).toBeNull();
      expect(fixture.nativeElement.textContent).toContain('Vow of the Feat');
    });
  });
});
