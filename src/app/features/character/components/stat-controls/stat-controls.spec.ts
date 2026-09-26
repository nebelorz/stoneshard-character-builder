import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StatControlsComponent } from './stat-controls';
import { BuildStore } from '@features/build/services';
import { STAT_INFO } from '@models';

const HOVER_DELAY = 200;

const settle = (ms = HOVER_DELAY + 50) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('StatControlsComponent', () => {
  let fixture: ComponentFixture<StatControlsComponent>;
  let overlayContainer: OverlayContainer;

  const infoIcons = () =>
    fixture.nativeElement.querySelectorAll('.left-sidenav__stat-info') as NodeListOf<HTMLElement>;

  const tooltipEl = () => overlayContainer.getContainerElement().querySelector('[role="tooltip"]');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatControlsComponent],
      providers: [
        {
          provide: BuildStore,
          useValue: {
            state: () => ({ ap: 0, sp: 0, stats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 } }),
            bonusCount: (stat: string) => (stat === 'STR' ? 2 : 0),
            totalAp: () => 33,
            derivedTraitAp: () => 2,
            canIncrementStat1: () => true,
            canDecrementStat1: () => true,
            canIncrementStat5: () => true,
            canDecrementStat5: () => true,
            incrementStat: () => undefined,
            decrementStat: () => undefined,
            incrementStat5: () => undefined,
            decrementStat5: () => undefined,
          },
        },
      ],
    });

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(StatControlsComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
  });

  it('renders an info icon for each stat', () => {
    expect(infoIcons().length).toBe(5);
  });

  it('labels each info icon for its stat', () => {
    const labels = Array.from(infoIcons()).map((icon) => icon.getAttribute('aria-label'));
    expect(labels).toEqual([
      'Show Strength description',
      'Show Agility description',
      'Show Perception description',
      'Show Vitality description',
      'Show Willpower description',
    ]);
  });

  it('makes each info icon keyboard focusable', () => {
    infoIcons().forEach((icon) => {
      expect(icon.tabIndex).toBe(0);
    });
  });

  it('wraps each glyph in the focusable target with the glyph hidden from assistive tech', () => {
    infoIcons().forEach((target) => {
      expect(target.tagName).toBe('SPAN');
      const glyph = target.querySelector('ng-icon');
      expect(glyph).toBeTruthy();
      expect(glyph?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('opens the description matching each info affordance', () => {
    const keys = ['STR', 'AGI', 'PER', 'VIT', 'WIL'] as const;
    infoIcons().forEach((icon, index) => {
      icon.dispatchEvent(new FocusEvent('focus'));
      const tooltip = tooltipEl();
      expect(tooltip?.textContent).toContain(STAT_INFO[keys[index]].name);
      expect(tooltip?.textContent).toContain(STAT_INFO[keys[index]].description);
      icon.dispatchEvent(new FocusEvent('blur'));
      expect(tooltipEl()).toBeNull();
    });
  });

  it('shows the focused stat description bound from STAT_INFO', () => {
    infoIcons()[0].dispatchEvent(new FocusEvent('focus'));

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Strength');
    expect(tooltip?.textContent).toContain(STAT_INFO.STR.description);
    expect(tooltip?.textContent).toContain(STAT_INFO.STR.perPointEffects[0]);
    expect(tooltip?.textContent).toContain(STAT_INFO.STR.milestoneEffects[0]);
    expect(tooltip?.textContent).toContain(STAT_INFO.STR.cap);
  });

  it('hides the tooltip when focus leaves the info icon', () => {
    const icon = infoIcons()[0];
    icon.dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeTruthy();

    icon.dispatchEvent(new FocusEvent('blur'));
    expect(tooltipEl()).toBeNull();
  });

  it('shows the hovered stat description after the hover delay', async () => {
    infoIcons()[1].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain(STAT_INFO.AGI.name);
    expect(tooltip?.textContent).toContain(STAT_INFO.AGI.perPointEffects[1]);
  });

  describe('merged stat display', () => {
    const statValues = () =>
      fixture.nativeElement.querySelectorAll(
        '.left-sidenav__stat-value',
      ) as NodeListOf<HTMLElement>;

    const bonusMarkers = () =>
      fixture.nativeElement.querySelectorAll(
        '.left-sidenav__stat-bonus',
      ) as NodeListOf<HTMLElement>;

    const hiddenText = (marker: HTMLElement) =>
      marker.querySelector('.visually-hidden')?.textContent?.trim() ?? null;

    it('displays the route value plus bonus count', () => {
      const values = Array.from(statValues()).map((el) => el.textContent!.trim());
      expect(values).toEqual(['12', '8', '7', '9', '6']);
    });

    it('shows the bonus count only for stats with bonus points', () => {
      const active = fixture.nativeElement.querySelectorAll('.left-sidenav__stat-bonus--active');
      expect(active.length).toBe(1);
      expect(active[0].textContent).toContain('+2');
    });

    it('exposes the bonus contribution through visually hidden text', () => {
      const markers = Array.from(bonusMarkers());
      const populated = markers.filter((el) => hiddenText(el) !== null);
      expect(populated.length).toBe(1);
      expect(hiddenText(populated[0])).toBe('Includes 2 bonus points');
    });

    it('does not expose a bonus contribution when there is none', () => {
      const markers = Array.from(bonusMarkers());
      const empty = markers.filter((el) => hiddenText(el) === null);
      expect(empty.length).toBe(4);
      empty.forEach((el) => expect(el.textContent!.trim()).toBe(''));
    });
  });

  describe('AP display', () => {
    it('shows the total AP including derived AP with a badge', () => {
      const values = fixture.nativeElement.querySelectorAll('.left-sidenav__resource-value');
      expect(values[1].textContent!.trim()).toBe('33');
      const badge = fixture.nativeElement.querySelector(
        '.left-sidenav__resource-derived',
      ) as HTMLElement;
      expect(badge.textContent).toContain('+2');
      expect(badge.querySelector('.visually-hidden')?.textContent?.trim()).toBe(
        'Includes 2 trait-derived Ability Points',
      );
    });
  });
});
