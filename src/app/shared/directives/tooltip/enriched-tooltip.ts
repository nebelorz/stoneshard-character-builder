import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EnrichedTooltipOverlayComponent } from './enriched-tooltip-overlay';
import { TooltipContent } from './tooltip-content.model';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipPositioning = 'anchor' | 'cursor';

const PLACEMENT_ORDER: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

const PLACEMENT_POSITIONS: Record<TooltipPlacement, ConnectedPosition[]> = {
  top: [{ originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 }],
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -8 },
  ],
  right: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 8 },
  ],
};

function buildPositions(preferred: TooltipPlacement): ConnectedPosition[] {
  const rest = PLACEMENT_ORDER.filter((placement) => placement !== preferred);
  return [preferred, ...rest].flatMap((placement) => PLACEMENT_POSITIONS[placement]);
}

@Directive({
  selector: '[appEnrichedTooltip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'showTooltip()',
    '(blur)': 'hideTooltip()',
    '(keydown.escape)': 'hideTooltip()',
  },
})
export class EnrichedTooltipDirective implements OnDestroy {
  readonly content = input<TooltipContent | null>(null);
  readonly tooltipPlacement = input<TooltipPlacement>('top');
  readonly tooltipPositioning = input<TooltipPositioning>('anchor');

  private readonly hostRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly tooltipId = `enriched-tooltip-${Math.random().toString(36).slice(2, 9)}`;

  onMouseEnter(): void {
    if (!this.content()) {
      return;
    }
    this.delayTimer = setTimeout(() => this.showTooltip(), 200);
  }

  onMouseLeave(): void {
    this.hideTooltip();
  }

  showTooltip(): void {
    if (!this.content() || this.overlayRef) {
      return;
    }

    const positions = buildPositions(this.tooltipPlacement());

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostRef)
      .withPositions(positions);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'enriched-tooltip-pane',
    });

    const portal = new ComponentPortal(EnrichedTooltipOverlayComponent);
    const componentRef = this.overlayRef.attach(portal);
    componentRef.setInput('content', this.content());
    componentRef.setInput('tooltipId', this.tooltipId);
    componentRef.changeDetectorRef.detectChanges();

    this.hostRef.nativeElement.setAttribute('aria-describedby', this.tooltipId);
  }

  hideTooltip(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }

    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    this.hostRef.nativeElement.removeAttribute('aria-describedby');
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }
}
