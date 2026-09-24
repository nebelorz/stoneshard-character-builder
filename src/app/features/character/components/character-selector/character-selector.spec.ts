import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CharacterSelectorComponent } from './character-selector';
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
];

const HOVER_DELAY = 200;

const settle = (ms = HOVER_DELAY + 50) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('CharacterSelectorComponent', () => {
  let fixture: ComponentFixture<CharacterSelectorComponent>;
  let overlayContainer: OverlayContainer;

  const traitIcon = () =>
    fixture.nativeElement.querySelector('.char-selector__trait-icon') as HTMLElement;

  const tooltipEl = () => overlayContainer.getContainerElement().querySelector('[role="tooltip"]');

  const dropdownOptions = () =>
    overlayContainer
      .getContainerElement()
      .querySelectorAll('.char-selector__option') as NodeListOf<HTMLElement>;

  const openDropdown = () => {
    const toggle = fixture.nativeElement.querySelector('#char-selector-toggle') as HTMLElement;
    toggle.click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterSelectorComponent],
      providers: [
        provideNoopAnimations(),
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

    overlayContainer = TestBed.inject(OverlayContainer);
    const buildStore = TestBed.inject(BuildStore);
    buildStore.initialize();
    fixture = TestBed.createComponent(CharacterSelectorComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
  });

  it('shows the trait tooltip when the trait icon receives focus', () => {
    traitIcon().dispatchEvent(new FocusEvent('focus'));

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Brave');
    expect(tooltip?.textContent).toContain('+10% Crit Chance');
    expect(traitIcon().getAttribute('aria-describedby')).toBe(tooltip?.id);
  });

  it('hides the trait tooltip when the trait icon loses focus', () => {
    traitIcon().dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeTruthy();

    traitIcon().dispatchEvent(new FocusEvent('blur'));
    expect(tooltipEl()).toBeNull();
    expect(traitIcon().getAttribute('aria-describedby')).toBeNull();
  });

  it('hides the trait tooltip when Escape is pressed while the trait icon is focused', () => {
    traitIcon().dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeTruthy();

    traitIcon().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tooltipEl()).toBeNull();
  });

  it('shows the trait tooltip after hovering the trait icon', async () => {
    traitIcon().dispatchEvent(new MouseEvent('mouseenter'));
    expect(tooltipEl()).toBeNull();

    await settle();
    expect(tooltipEl()).toBeTruthy();
    expect(tooltipEl()?.textContent).toContain('Brave');

    traitIcon().dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltipEl()).toBeNull();
  });

  it('shows the hovered option trait tooltip without dismissing the dropdown', async () => {
    openDropdown();

    const options = dropdownOptions();
    expect(options.length).toBe(3);

    options[1].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain("Ranger's Grit");
    expect(tooltip?.textContent).toContain('Expertise');

    const dropdown = overlayContainer
      .getContainerElement()
      .querySelector('.char-selector__dropdown');
    expect(dropdown).toBeTruthy();
    expect(fixture.componentInstance.dropdownOpen()).toBe(true);

    options[1].dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltipEl()).toBeNull();
    expect(fixture.componentInstance.dropdownOpen()).toBe(true);
  });

  it('closes the dropdown when a character option is selected', () => {
    openDropdown();

    const options = dropdownOptions();
    options[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dropdownOpen()).toBe(false);
    expect(
      overlayContainer.getContainerElement().querySelector('.char-selector__dropdown'),
    ).toBeNull();
  });
});
