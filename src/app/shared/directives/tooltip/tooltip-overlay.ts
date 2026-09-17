import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip-overlay',
  template: `
    <div
      [id]="tooltipId()"
      class="app-tooltip font-neutral"
      [class]="'app-tooltip app-tooltip--' + placement()"
      role="tooltip"
    >
      {{ text() }}
    </div>
  `,
  styleUrl: './tooltip-overlay.scss',
})
export class TooltipOverlayComponent {
  readonly text = input<string>('');
  readonly tooltipId = input<string>('');
  readonly placement = input<'top' | 'bottom' | 'left' | 'right'>('top');
}
