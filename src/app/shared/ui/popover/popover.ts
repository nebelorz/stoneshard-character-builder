import {
  Component,
  input,
  model,
  inject,
  effect,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { fadeInOutFast } from '@shared/animations/fade';

const POPOVER_POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
];

@Component({
  selector: 'app-popover',
  imports: [CdkTrapFocus],
  animations: [fadeInOutFast],
  template: `
    <ng-template #popoverContent>
      @if (isOpen()) {
        <div
          class="popover font-ui"
          @fadeInOutFast
          [attr.role]="role()"
          aria-modal="true"
          [attr.aria-labelledby]="ariaLabelledby()"
          [attr.aria-label]="ariaLabelledby() ? null : ariaLabel()"
          cdkTrapFocus
          (keydown.escape)="onEscape()"
        >
          <ng-content />
        </div>
      }
    </ng-template>
  `,
  styles: `
    @use 'variables' as *;

    :host {
      display: contents;
    }

    .popover {
      position: relative;
      z-index: 10000;
      background: $bg-panel;
      border: 1px solid $border-dim;
      border-radius: 4px;
      box-shadow: $shadow-dropdown;
      padding: 12px;
      min-width: 180px;
      max-width: 300px;
    }
  `,
})
export class PopoverComponent implements OnDestroy {
  readonly ariaLabel = input<string>('Popover');
  readonly role = input('dialog');
  readonly ariaLabelledby = input<string | null>(null);
  readonly isOpen = model(false);
  readonly triggerElement = input<HTMLElement | null>(null);

  @ViewChild('popoverContent', { static: true }) popoverContent!: TemplateRef<unknown>;

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;
  private lastTrigger: HTMLElement | null = null;

  private readonly overlayEffect = effect(() => {
    const isOpen = this.isOpen();
    const trigger = this.triggerElement();
    if (isOpen && trigger) {
      this.showOverlay(trigger);
    } else {
      this.hideOverlay();
    }
  });

  ngOnDestroy(): void {
    this.hideOverlay();
  }

  onEscape(): void {
    this.isOpen.set(false);
  }

  private showOverlay(trigger: HTMLElement): void {
    if (this.overlayRef) {
      return;
    }

    this.lastTrigger = trigger;

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions(POPOVER_POSITIONS);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
    });

    const portal = new TemplatePortal(this.popoverContent, this.viewContainerRef);
    this.overlayRef.attach(portal);

    const overlayEl = this.overlayRef.overlayElement;
    const focusable = overlayEl.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]):not(.cdk-focus-trap-anchor)',
    );
    if (focusable) {
      focusable.focus();
    }
  }

  private hideOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    if (this.lastTrigger) {
      this.lastTrigger.focus();
      this.lastTrigger = null;
    }
  }
}
