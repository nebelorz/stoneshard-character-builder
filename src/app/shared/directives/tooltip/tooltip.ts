import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipOverlayComponent } from './tooltip-overlay';

const POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: -8 },
  { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: 8 },
];

const PLACEMENT_ORDER: Record<string, number> = {
  top: 0,
  bottom: 1,
  left: 2,
  right: 3,
};

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown.escape)': 'hideTooltip()',
  },
})
export class TooltipDirective implements OnDestroy {
  readonly tooltipText = input<string>('');
  readonly tooltipPlacement = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private readonly hostRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

  onMouseEnter(): void {
    if (!this.tooltipText()) {
      return;
    }
    this.delayTimer = setTimeout(() => this.showTooltip(), 200);
  }

  onMouseLeave(): void {
    this.hideTooltip();
  }

  private showTooltip(): void {
    if (this.overlayRef) {
      return;
    }

    const positions = [...POSITIONS];
    const preferred = PLACEMENT_ORDER[this.tooltipPlacement()];
    if (preferred !== undefined) {
      const [pos] = positions.splice(preferred, 1);
      positions.unshift(pos);
    }

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostRef)
      .withPositions(positions);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
    });

    const portal = new ComponentPortal(TooltipOverlayComponent);
    const componentRef = this.overlayRef.attach(portal);
    componentRef.setInput('text', this.tooltipText());
    componentRef.setInput('tooltipId', this.tooltipId);
    componentRef.setInput('placement', this.tooltipPlacement());
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
