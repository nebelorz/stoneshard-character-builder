import { Component, model, output } from '@angular/core';
import { RouteDisplayComponent, ExtrasDisplayComponent } from '@features/build/components';

@Component({
  selector: 'app-right-sidenav',
  imports: [RouteDisplayComponent, ExtrasDisplayComponent],
  templateUrl: './right-sidenav.html',
  styleUrl: './right-sidenav.scss',
})
export class RightSidenavComponent {
  isOpen = model(true);
  readonly openNotes = output<void>();

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
