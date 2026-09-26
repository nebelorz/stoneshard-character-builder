import { TestBed, ComponentFixture } from '@angular/core/testing';
import { QuestsSectionComponent } from './quests-section';
import { BuildStore } from '@features/build/services';
import { CharacterDataService } from '@features/character/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { QuestDataService } from '@shared/services';
import { Character } from '@models';

const MOCK_QUESTS = [
  {
    id: 'boulder-circle',
    resource: 'sp' as const,
    label: 'Boulder Circle',
    tooltip: 'The Boulder Circle training grants 1 Stat Point',
    pointsPer: 1,
    max: 1,
  },
];

const CHARACTER: Character = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: [],
};

function setup(): { fixture: ComponentFixture<QuestsSectionComponent>; store: BuildStore } {
  TestBed.configureTestingModule({
    imports: [QuestsSectionComponent],
    providers: [
      BuildStore,
      {
        provide: CharacterDataService,
        useValue: {
          characters: {
            value: () => [CHARACTER],
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
            value: () => [],
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
  const fixture = TestBed.createComponent(QuestsSectionComponent);
  fixture.detectChanges();
  return { fixture, store };
}

describe('QuestsSectionComponent', () => {
  it('renders a Boulder Circle slot row', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Boulder Circle');
    expect(fixture.nativeElement.querySelector('app-point-slot-row')).not.toBeNull();
  });

  it('shows the placeholder when unallocated', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.point-slot-row__toggle').textContent.trim()).toBe(
      '-',
    );
  });

  it('shows the stat chip when allocated', () => {
    const { fixture, store } = setup();
    store.allocateBonusSlot('boulder-circle', 0, 'STR');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stat-chip--str')).not.toBeNull();
  });

  it('deallocates back to the placeholder', () => {
    const { fixture, store } = setup();
    store.allocateBonusSlot('boulder-circle', 0, 'STR');
    store.deallocateBonusSlot('boulder-circle', 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stat-chip--str')).toBeNull();
    expect(fixture.nativeElement.querySelector('.point-slot-row__toggle').textContent.trim()).toBe(
      '-',
    );
  });

  it('renders an info icon affordance for the quest', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.left-sidenav__quest-info')).not.toBeNull();
  });
});
