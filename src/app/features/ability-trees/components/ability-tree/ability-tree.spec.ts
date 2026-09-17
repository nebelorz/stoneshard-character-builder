import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbilityTreeComponent } from './ability-tree';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { CharacterDataService } from '@features/character/services';
import { AbilityTree, Ability, BuildState } from '@models';

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

const STAVES_ABILITIES: Ability[] = [
  ability({
    id: 'staves-1',
    name: 'Destabilizing Hits',
    x: 54,
    y: 116,
    requiredBy: ['staves-5'],
  }),
  ability({
    id: 'staves-2',
    name: 'Hail of Blows',
    x: 130,
    y: 116,
    requiredBy: ['staves-5', 'staves-6'],
  }),
  ability({
    id: 'staves-3',
    name: 'Step Aside!',
    x: 206,
    y: 116,
    requiredBy: ['staves-6', 'staves-7'],
  }),
  ability({
    id: 'staves-4',
    name: 'Battle Trance',
    x: 282,
    y: 116,
    requiredBy: ['staves-7'],
  }),
  ability({
    id: 'staves-5',
    name: 'Now or Never',
    x: 54,
    y: 262,
    requires: ['staves-1', 'staves-2'],
    requiredBy: ['staves-8'],
  }),
  ability({
    id: 'staves-6',
    name: 'Unwavering Stance',
    x: 168,
    y: 262,
    requires: ['staves-2', 'staves-3'],
    requiredBy: ['staves-8'],
  }),
  ability({
    id: 'staves-7',
    name: 'Triumph',
    x: 282,
    y: 262,
    requires: ['staves-3|staves-4'],
    requiredBy: ['staves-8'],
  }),
  ability({
    id: 'staves-8',
    name: 'Peacemaker',
    x: 168,
    y: 408,
    requires: ['staves-5|staves-6|staves-7'],
  }),
];

const STAVES_TREE: AbilityTree = {
  id: 'staves',
  name: 'Staves',
  category: 'weaponry',
  focus: '',
  critEffect: '',
  icon: 'staves',
};

describe('AbilityTreeComponent', () => {
  let fixture: ComponentFixture<AbilityTreeComponent>;
  let buildStore: BuildStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbilityTreeComponent],
      providers: [
        BuildStore,
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => STAVES_ABILITIES,
              status: () => 'ready' as const,
              error: () => null,
            },
            trees: {
              value: () => [STAVES_TREE],
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
    fixture = TestBed.createComponent(AbilityTreeComponent);
    fixture.componentRef.setInput('tree', STAVES_TREE);
    fixture.detectChanges();
  });

  it('renders one icon per ability at its percentage position', () => {
    const icons = fixture.nativeElement.querySelectorAll('app-ability-icon') as HTMLElement[];
    expect(icons.length).toBe(8);

    const byName = (name: string) =>
      Array.from(icons).find(
        (el) => el.querySelector('.ability-icon__img')?.getAttribute('alt') === name,
      )!;

    const peacemaker = byName('Peacemaker');
    expect(parseFloat(peacemaker.style.left)).toBeCloseTo((168 / 338) * 100, 1);
    expect(parseFloat(peacemaker.style.top)).toBeCloseTo((408 / 522) * 100, 1);

    const first = byName('Destabilizing Hits');
    expect(parseFloat(first.style.left)).toBeCloseTo((54 / 338) * 100, 1);
    expect(parseFloat(first.style.top)).toBeCloseTo((116 / 522) * 100, 1);
  });

  it('renders the tree background image with the correct source behind the icons', () => {
    const img = fixture.nativeElement.querySelector(
      '.ability-tree__background',
    ) as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('assets/icons/staves/staves_background.png');

    const canvas = fixture.nativeElement.querySelector('.ability-tree__canvas') as HTMLElement;
    expect(canvas.children[0]).toBe(img);

    const style = getComputedStyle(img);
    expect(style.zIndex).toBe('0');
    expect(style.pointerEvents).toBe('none');

    const icon = fixture.nativeElement.querySelector('app-ability-icon') as HTMLElement;
    expect(getComputedStyle(icon).zIndex).toBe('1');
  });

  it('clicking an unlocked icon obtains the ability', () => {
    const firstIcon = fixture.nativeElement.querySelector(
      'app-ability-icon .ability-icon',
    ) as HTMLElement;
    firstIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities.map((a: { abilityId: string }) => a.abilityId)).toContain(
      'staves-1',
    );
  });

  it('right-clicking an obtained icon refunds it', () => {
    buildStore.obtainAbility('staves-1');
    fixture.detectChanges();

    const firstIcon = fixture.nativeElement.querySelector(
      'app-ability-icon .ability-icon',
    ) as HTMLElement;
    firstIcon.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.ap).toBe(31);
  });

  it('shows a tooltip on hover', () => {
    const firstIcon = fixture.nativeElement.querySelector(
      'app-ability-icon .ability-icon',
    ) as HTMLElement;
    firstIcon.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    const tooltip = document.body.querySelector('.ability-tooltip') as HTMLElement;
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toContain('Destabilizing Hits');
    expect(window.getComputedStyle(tooltip).visibility).toBe('visible');

    firstIcon.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    const hiddenTooltip = document.body.querySelector('.ability-tooltip') as HTMLElement;
    expect(hiddenTooltip).toBeTruthy();
    expect(hiddenTooltip.classList.contains('ability-tooltip--visible')).toBe(false);
    expect(window.getComputedStyle(hiddenTooltip).visibility).toBe('hidden');
  });
});
