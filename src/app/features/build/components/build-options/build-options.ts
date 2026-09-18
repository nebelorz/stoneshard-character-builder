import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorTrash,
  phosphorShareNetwork,
  phosphorHeadCircuit,
} from '@ng-icons/phosphor-icons/regular';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip';
import { PopupService } from '@shared/services';

@Component({
  selector: 'app-build-options',
  imports: [NgIcon, TooltipDirective],
  providers: [
    provideIcons({
      phosphorTrash,
      phosphorShareNetwork,
      phosphorHeadCircuit,
    }),
  ],
  templateUrl: './build-options.html',
  styleUrl: './build-options.scss',
})
export class BuildOptionsComponent {
  private readonly popupService = inject(PopupService);

  openPopup(type: 'share' | 'ai-prompt' | 'reset', event: Event): void {
    const trigger = event.currentTarget as HTMLElement;
    this.popupService.toggle(type, trigger);
  }
}
