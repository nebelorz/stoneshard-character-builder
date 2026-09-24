import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { EnrichedTooltipDirective, TooltipPlacement } from './enriched-tooltip';
import { TooltipContent } from './tooltip-content.model';

const TRAIT_CONTENT: TooltipContent = {
  kind: 'trait',
  name: 'Brave',
  description: '+10% Crit Chance',
};

@Component({
  template: `
    <button #trigger appEnrichedTooltip [content]="content()" [tooltipPlacement]="placement()">
      Trait trigger
    </button>
  `,
  imports: [EnrichedTooltipDirective],
})
class TooltipTestHostComponent {
  readonly content = signal<TooltipContent | null>(TRAIT_CONTENT);
  readonly placement = signal<TooltipPlacement>('top');
}

const HOVER_DELAY = 200;

const settle = (ms = HOVER_DELAY + 50) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const toRect = (top: number, height: number, left: number, width: number): DOMRect => ({
  top,
  bottom: top + height,
  left,
  right: left + width,
  width,
  height,
  x: left,
  y: top,
  toJSON: () => ({}),
});

const zeroRect = toRect(0, 0, 0, 0);

describe('EnrichedTooltipDirective', () => {
  let fixture: ComponentFixture<TooltipTestHostComponent>;
  let trigger: HTMLButtonElement;
  let overlayContainer: OverlayContainer;

  const tooltipEl = () => overlayContainer.getContainerElement().querySelector('[role="tooltip"]');

  const boundingBoxEl = () =>
    overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-connected-position-bounding-box') as HTMLElement;

  const setViewport = (width: number, height: number) => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: width,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: height,
      configurable: true,
    });
  };

  const mockRects = (triggerRect: DOMRect, paneRect: DOMRect) => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this === trigger) {
        return triggerRect;
      }
      if (this.classList.contains('cdk-overlay-pane')) {
        return paneRect;
      }
      return zeroRect;
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TooltipTestHostComponent] });
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(TooltipTestHostComponent);
    fixture.detectChanges();
    trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
    vi.restoreAllMocks();
    delete (document.documentElement as { clientWidth?: number }).clientWidth;
    delete (document.documentElement as { clientHeight?: number }).clientHeight;
  });

  it('renders the trait name and description when hovered', async () => {
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await settle();

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Brave');
    expect(tooltip?.textContent).toContain('+10% Crit Chance');
  });

  it('hides the tooltip when the cursor leaves the trigger', async () => {
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
    expect(tooltipEl()).toBeTruthy();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltipEl()).toBeNull();
  });

  it('waits for the hover delay before showing and cancels on leave', async () => {
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await settle(50);
    expect(tooltipEl()).toBeNull();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    await settle();
    expect(tooltipEl()).toBeNull();
  });

  it('shows no tooltip when content is null', async () => {
    fixture.componentInstance.content.set(null);
    fixture.detectChanges();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
    expect(tooltipEl()).toBeNull();

    trigger.dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows the tooltip when the trigger receives focus', () => {
    trigger.dispatchEvent(new FocusEvent('focus'));

    expect(tooltipEl()).toBeTruthy();
    expect(tooltipEl()?.textContent).toContain('Brave');
  });

  it('hides the tooltip when the trigger loses focus', () => {
    trigger.dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeTruthy();

    trigger.dispatchEvent(new FocusEvent('blur'));
    expect(tooltipEl()).toBeNull();
  });

  it('hides the tooltip on Escape', () => {
    trigger.dispatchEvent(new FocusEvent('focus'));
    expect(tooltipEl()).toBeTruthy();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tooltipEl()).toBeNull();
  });

  it('associates the visible tooltip with the trigger via aria-describedby', () => {
    trigger.dispatchEvent(new FocusEvent('focus'));

    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(tooltipEl()?.id).toBe(describedBy);

    trigger.dispatchEvent(new FocusEvent('blur'));
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('places the tooltip above the trigger when the preferred placement fits', () => {
    setViewport(1024, 768);
    mockRects(toRect(400, 20, 100, 120), toRect(0, 60, 0, 280));

    trigger.dispatchEvent(new FocusEvent('focus'));

    expect(boundingBoxEl().style.bottom).not.toBe('auto');
    expect(boundingBoxEl().style.top).toBe('auto');
  });

  it('repositions below the trigger when the preferred placement overflows the viewport', () => {
    setViewport(1024, 768);
    mockRects(toRect(0, 20, 100, 120), toRect(0, 60, 0, 280));

    trigger.dispatchEvent(new FocusEvent('focus'));

    expect(boundingBoxEl().style.top).not.toBe('auto');
    expect(boundingBoxEl().style.bottom).toBe('auto');
  });

  it('places the tooltip to the right of the trigger with a gap when placement is right', () => {
    setViewport(1024, 768);
    mockRects(toRect(300, 20, 100, 120), toRect(0, 60, 0, 280));
    fixture.componentInstance.placement.set('right');
    fixture.detectChanges();

    trigger.dispatchEvent(new FocusEvent('focus'));

    const pane = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(boundingBoxEl().style.left).toBe('220px');
    expect(pane.style.transform).toBe('translateX(8px)');
  });
});
