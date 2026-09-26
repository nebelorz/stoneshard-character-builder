import { Component, inject, computed, output } from '@angular/core';
import { BuildStore } from '@features/build/services';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorNote } from '@ng-icons/phosphor-icons/regular';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip';

@Component({
  selector: 'app-extras-display',
  templateUrl: './extras-display.html',
  styleUrl: './extras-display.scss',
  imports: [NgIcon, TooltipDirective],
  providers: [provideIcons({ phosphorNote })],
})
export class ExtrasDisplayComponent {
  private readonly buildStore = inject(BuildStore);

  readonly notesPreview = computed(() => {
    const state = this.buildStore.state();
    if (!state?.notes) return null;
    const { buildName, author, content } = state.notes;
    if (!buildName && !author && !content) return null;
    return {
      buildName,
      author,
      contentPreview: content.length > 80 ? content.substring(0, 80) + '...' : content,
    };
  });

  readonly openNotes = output<void>();
}
