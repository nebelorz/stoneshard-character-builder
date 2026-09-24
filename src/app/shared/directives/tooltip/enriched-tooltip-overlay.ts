import { Component, input } from '@angular/core';
import { TooltipContent } from './tooltip-content.model';

@Component({
  selector: 'app-enriched-tooltip-overlay',
  template: `
    @if (content(); as c) {
      <div [id]="tooltipId()" class="enriched-tooltip" role="tooltip">
        @switch (c.kind) {
          @case ('trait') {
            <div class="enriched-tooltip__name font-fantasy">{{ c.name }}</div>
            <div class="enriched-tooltip__desc font-ui">{{ c.description }}</div>
          }
          @case ('stat') {
            <div class="enriched-tooltip__name font-fantasy">{{ c.name }}</div>
            <div class="enriched-tooltip__desc font-ui">{{ c.description }}</div>
            <div class="enriched-tooltip__group">
              <div class="enriched-tooltip__group-label font-ui">
                Each point of {{ c.name }} grants
              </div>
              <ul class="enriched-tooltip__list font-ui">
                @for (effect of c.perPointEffects; track effect) {
                  <li>{{ effect }}</li>
                }
              </ul>
            </div>
            <div class="enriched-tooltip__group">
              <div class="enriched-tooltip__group-label font-ui">
                Reaching 15, 20, 25, and 30 points also grants
              </div>
              <ul class="enriched-tooltip__list font-ui">
                @for (effect of c.milestoneEffects; track effect) {
                  <li>{{ effect }}</li>
                }
              </ul>
            </div>
            <div class="enriched-tooltip__cap font-ui">{{ c.cap }}</div>
          }
        }
      </div>
    }
  `,
  styleUrl: './enriched-tooltip-overlay.scss',
})
export class EnrichedTooltipOverlayComponent {
  readonly content = input<TooltipContent | null>(null);
  readonly tooltipId = input<string>('');
}
