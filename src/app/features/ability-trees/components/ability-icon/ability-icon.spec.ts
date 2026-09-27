import { TestBed, ComponentFixture } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { AbilityIconComponent } from './ability-icon';
import { AbilityDataService, CharacterDataService } from '@core/data';
import { BuildStore } from '@core/state';
import { AbilityHoverService } from '@shared/services';
import { Ability, BuildState, DescriptionLine } from '@models';

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

const paragraph = (text: string): readonly DescriptionLine[] => [
  { kind: 'paragraph', nodes: [{ kind: 'text', text }] },
];

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
  descriptionLines: [],
  requiredBy: [],
  ...partial,
});

const ATTACK_ABILITY = ability({
  id: 'survival-attack',
  name: 'Cleave',
  type: 'attack',
  target: 'Target Area',
  range: 2,
  energy: 10,
  cooldown: 8,
  modifiedByLabel: 'Strength, Magic Power, Foo Bar',
  descriptionLines: paragraph('Cuts things.'),
});

const PASSIVE_ABILITY = ability({
  id: 'survival-passive',
  name: 'Endurance',
  descriptionLines: paragraph('Keeps you going.'),
});

const BULLET_ABILITY = ability({
  id: 'survival-bullet',
  name: 'Regeneration',
  descriptionLines: [
    { kind: 'paragraph', nodes: [{ kind: 'text', text: 'Grants:' }] },
    { kind: 'bullet', nodes: [{ kind: 'modifier', expression: '+5', sign: 'pos' }] },
  ],
});

const LOCKED_PARENT = ability({ id: 'survival-9', name: 'Locked Parent' });

const LOCKED_ABILITY = ability({
  id: 'survival-locked',
  name: 'Whirlwind',
  requires: ['survival-1|survival-4', 'survival-9'],
  unlockConditions: ['Invest 8 AP in STR AGI'],
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
  ATTACK_ABILITY,
  PASSIVE_ABILITY,
  BULLET_ABILITY,
  LOCKED_PARENT,
  LOCKED_ABILITY,
];

describe('AbilityIconComponent', () => {
  let fixture: ComponentFixture<AbilityIconComponent> | undefined;
  let buildStore: BuildStore;
  let hoverService: AbilityHoverService;

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
    hoverService = TestBed.inject(AbilityHoverService);
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

  afterEach(() => {
    fixture?.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function getIcon(): HTMLElement {
    return fixture!.nativeElement.querySelector('.ability-icon') as HTMLElement;
  }

  function getTooltip(abilityId: string): HTMLElement {
    return document.getElementById(`ability-tooltip-${abilityId}`) as HTMLElement;
  }

  function hoverIcon(abilityId: string): void {
    getIcon().dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture!.detectChanges();
    expect(getTooltip(abilityId).classList.contains('ability-tooltip--visible')).toBe(true);
  }

  it('renders a default active ability as obtained with no level badge and no lock overlay', () => {
    setup('survival-1');
    const icon = getIcon();
    expect(icon.classList.contains('ability-icon--obtained')).toBe(true);
    expect(icon.classList.contains('ability-icon--locked')).toBe(false);
    expect(icon.querySelector('.ability-icon__locked-overlay')).toBeNull();
    expect(icon.querySelector('.ability-icon__level')).toBeNull();
  });

  it('does not obtain a default active ability on click', () => {
    setup('survival-1');
    const icon = getIcon();
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture!.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.ap).toBe(31);
  });

  it('does not refund a default active ability on context menu', () => {
    setup('survival-1');
    const icon = getIcon();
    icon.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    fixture!.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities).toEqual([]);
    expect(state.ap).toBe(31);
  });

  it('unlocks an ability that requires a default active ability', () => {
    setup('survival-4');
    const icon = getIcon();
    expect(icon.classList.contains('ability-icon--unlocked')).toBe(true);
    expect(icon.classList.contains('ability-icon--locked')).toBe(false);
  });

  it('allows obtaining an ability whose prerequisite is a default active ability', () => {
    setup('survival-4');
    const icon = getIcon();
    let emitted: string | undefined;
    fixture!.componentInstance.obtain.subscribe((id) => (emitted = id));
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toBe('survival-4');

    expect(buildStore.obtainAbility('survival-4')).toBe(true);
    fixture!.detectChanges();
    const state = getReadyState(buildStore);
    expect(state.obtainedAbilities.map((a) => a.abilityId)).toContain('survival-4');
    expect(state.ap).toBe(30);
  });

  it('renders the tooltip header as a name and a type chip for an attack ability', () => {
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    expect(tooltip.querySelector('.ability-tooltip__name')?.textContent).toContain('Cleave');
    expect(tooltip.querySelector('.ability-tooltip__type')?.textContent?.trim()).toBe('attack');
  });

  it('always shows all four metrics for a passive ability with no target', () => {
    setup('survival-passive');
    hoverIcon('survival-passive');
    const tooltip = getTooltip('survival-passive');
    const metrics = [...tooltip.querySelectorAll('.ability-tooltip__metric')];
    expect(metrics).toHaveLength(4);
    const labels = metrics.map((m) =>
      m.querySelector('.ability-tooltip__metric-label')?.textContent?.trim(),
    );
    expect(labels).toEqual(['Target', 'Range', 'Energy', 'Cooldown']);
    expect(metrics[0].querySelector('.ability-tooltip__metric-value')?.textContent?.trim()).toBe(
      'No Target',
    );
    expect(metrics[3].querySelector('.ability-tooltip__metric-value')?.textContent?.trim()).toBe(
      '0',
    );
  });

  it('classifies scaling statistics into stat, neutral, and plain terms', () => {
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    expect(tooltip.querySelector('.ability-tooltip__token--str')?.textContent).toBe('Strength');
    expect(tooltip.querySelector('.ability-tooltip__token--neutral')?.textContent).toBe(
      'Magic Power',
    );
    expect(tooltip.querySelector('.ability-tooltip__scaling-term')?.textContent).toBe('Foo Bar');
  });

  it('renders a multi-group locked ability as distinct AND groups with OR alternatives', () => {
    setup('survival-locked');
    hoverIcon('survival-locked');
    const tooltip = getTooltip('survival-locked');
    expect(tooltip.querySelectorAll('.ability-tooltip__group')).toHaveLength(2);
    expect(tooltip.querySelectorAll('.ability-tooltip__or-separator')).toHaveLength(1);
    expect(tooltip.querySelectorAll('.ability-tooltip__and-separator')).toHaveLength(1);
  });

  it('renders bullet description rows inside the tooltip card', () => {
    setup('survival-bullet');
    hoverIcon('survival-bullet');
    const tooltip = getTooltip('survival-bullet');
    expect(tooltip.querySelector('app-ability-description')).not.toBeNull();
    expect(tooltip.querySelectorAll('.ability-description__line--bullet')).toHaveLength(1);
  });

  it('keeps the card visible while the pointer moves onto it and hides after the delay', () => {
    vi.useFakeTimers();
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    const icon = getIcon();

    icon.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    tooltip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(400);
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(true);

    tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    vi.advanceTimersByTime(400);
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(false);
  });

  it('keeps the card visible while keyboard focus is inside it', () => {
    vi.useFakeTimers();
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    const body = tooltip.querySelector('.ability-tooltip__body') as HTMLElement;

    getIcon().dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    body.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    vi.advanceTimersByTime(400);
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(true);

    body.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    vi.advanceTimersByTime(400);
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(false);
  });

  it('hides the card immediately when another ability takes hover', () => {
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');

    hoverService.setActiveTooltip('survival-locked');
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(false);
  });

  it('makes the overflow region focusable and dismisses the card on Escape', () => {
    setup('survival-attack');
    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    const body = tooltip.querySelector('.ability-tooltip__body') as HTMLElement;
    Object.defineProperty(body, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(body, 'clientHeight', { value: 200, configurable: true });

    getIcon().dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture!.detectChanges();
    expect(body.getAttribute('tabindex')).toBe('0');

    body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture!.detectChanges();
    expect(tooltip.classList.contains('ability-tooltip--visible')).toBe(false);
  });

  it('flips the card to the left of the icon near the right viewport edge', () => {
    setup('survival-attack');
    const icon = getIcon();
    vi.spyOn(icon, 'getBoundingClientRect').mockReturnValue({
      left: 900,
      right: 960,
      top: 100,
      bottom: 160,
      width: 60,
      height: 60,
      x: 900,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });

    hoverIcon('survival-attack');
    const tooltip = getTooltip('survival-attack');
    expect(tooltip.classList.contains('ability-tooltip--left')).toBe(true);
    const left = Number.parseFloat(tooltip.style.left);
    expect(left + 280).toBeLessThanOrEqual(900);
  });
});
