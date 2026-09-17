import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CharacterInfoComponent } from './character-info';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { CharacterDataService } from '@features/character/services';
import { AbilityTree } from '@models';

const JORNA = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: ['warfare', 'staves'],
};

const DIRWIN = {
  id: 'dirwin',
  name: 'Dirwin',
  title: 'Woodward',
  race: 'Human (Aldor)',
  gender: 'Male',
  trait: { name: "Ranger's Grit", description: 'Expertise' },
  baseStats: { STR: 10, AGI: 11, PER: 11, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: ['staves'],
};

const ARNA = {
  id: 'arna',
  name: 'Arna',
  title: 'Maiden Knight',
  race: 'Human (Aldor)',
  gender: 'Female',
  trait: { name: 'Vow of the Feat', description: 'Vow' },
  baseStats: { STR: 11, AGI: 11, PER: 10, VIT: 11, WIL: 10 },
  traitsUnlockedOnStart: [],
};

const TREES: AbilityTree[] = [
  {
    id: 'warfare',
    name: 'Warfare',
    category: 'utility',
    focus: '',
    critEffect: '',
    icon: 'warfare',
  },
  {
    id: 'staves',
    name: 'Staves',
    category: 'weaponry',
    focus: '',
    critEffect: '',
    icon: 'staves',
  },
];

describe('CharacterInfoComponent', () => {
  let fixture: ComponentFixture<CharacterInfoComponent>;
  let buildStore: BuildStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterInfoComponent],
      providers: [
        BuildStore,
        {
          provide: AbilityDataService,
          useValue: {
            trees: {
              value: () => TREES,
              status: () => 'ready' as const,
              error: () => null,
            },
            abilities: {
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
              value: () => [JORNA, DIRWIN, ARNA],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
      ],
    });

    buildStore = TestBed.inject(BuildStore);
    buildStore.initialize();
    fixture = TestBed.createComponent(CharacterInfoComponent);
    fixture.detectChanges();
  });

  it('renders each starting tree as a row with icon and name', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    expect(rows.length).toBe(2);

    const names = Array.from(rows).map((row) =>
      row.querySelector('.character-info__tree-name')?.textContent?.trim(),
    );
    expect(names).toEqual(['Warfare', 'Staves']);

    const firstRow = rows[0];
    const icon = firstRow.querySelector('img') as HTMLImageElement;
    expect(icon.getAttribute('src')).toBe('assets/icons/warfare/warfare_tree_icon.png');
    expect(icon.getAttribute('alt')).toBe('Warfare');

    rows.forEach((row) => {
      expect(row.querySelector('.character-info__lock')).toBeNull();
    });
  });

  it('labels the panel "Unlocked at start"', () => {
    const heading = fixture.nativeElement.querySelector('.character-info__heading') as HTMLElement;
    expect(heading.textContent?.trim()).toBe('Unlocked at start');
  });

  it('collapses to nothing when the selected character has no starting trees', () => {
    buildStore.selectCharacter('arna');
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.character-info') as HTMLElement | null;
    expect(panel).toBeNull();
  });

  it('updates the rows when a different character is selected', () => {
    buildStore.selectCharacter('dirwin');
    fixture.detectChanges();

    const names = Array.from(
      fixture.nativeElement.querySelectorAll('.character-info__tree-name') as HTMLElement[],
    ).map((el) => el.textContent?.trim());
    expect(names).toEqual(['Staves']);
  });

  it('renders each starting tree as a keyboard-focusable row', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    rows.forEach((row) => {
      expect(row.tagName).toBe('BUTTON');
      expect(row.tabIndex).toBe(0);
      row.focus();
      expect(document.activeElement).toBe(row);
    });
  });
});
