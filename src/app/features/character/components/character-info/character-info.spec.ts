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

  it('labels the panel ">Character Unlocked Trees"', () => {
    const heading = fixture.nativeElement.querySelector('.character-info__heading') as HTMLElement;
    expect(heading.textContent?.trim()).toBe('>Character Unlocked Trees');
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

  it('does not pin any starting tree on load', () => {
    expect(buildStore.state()?.pinnedTrees ?? []).toEqual([]);

    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    rows.forEach((row) => {
      expect(row.classList.contains('character-info__row--pinned')).toBe(false);
      expect(row.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('pins a tree when its row is clicked', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    (rows[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).toContain('warfare');
    expect(rows[0].classList.contains('character-info__row--pinned')).toBe(true);
    expect(rows[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('unpins a tree when its pinned row is clicked again', () => {
    buildStore.pinTree('warfare');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    expect(rows[0].getAttribute('aria-pressed')).toBe('true');

    (rows[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).not.toContain('warfare');
    expect(rows[0].classList.contains('character-info__row--pinned')).toBe(false);
    expect(rows[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles a tree pin with Enter on a focused row', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    const row = rows[0] as HTMLElement;
    row.focus();

    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    row.click();
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).toContain('warfare');
    expect(row.getAttribute('aria-pressed')).toBe('true');
  });

  it('toggles a tree pin with Space on a focused row', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    const row = rows[0] as HTMLElement;
    row.focus();

    row.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    row.click();
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).toContain('warfare');
    expect(row.getAttribute('aria-pressed')).toBe('true');
  });

  it('reflects pin state pinned through the build store', () => {
    buildStore.pinTree('staves');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    expect(rows[1].classList.contains('character-info__row--pinned')).toBe(true);
    expect(rows[1].getAttribute('aria-pressed')).toBe('true');
    expect(rows[0].classList.contains('character-info__row--pinned')).toBe(false);
    expect(rows[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps pins and updates rows when switching characters', () => {
    const rows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    (rows[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).toContain('warfare');

    buildStore.selectCharacter('dirwin');
    fixture.detectChanges();

    expect(buildStore.state()?.pinnedTrees).toContain('warfare');

    const newRows = fixture.nativeElement.querySelectorAll('.character-info__row') as HTMLElement[];
    expect(newRows.length).toBe(1);
    const names = Array.from(newRows).map((row) =>
      row.querySelector('.character-info__tree-name')?.textContent?.trim(),
    );
    expect(names).toEqual(['Staves']);
    expect(newRows[0].getAttribute('aria-pressed')).toBe('false');
  });
});
