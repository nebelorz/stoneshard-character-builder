import { Component, model } from '@angular/core';
import { RouteDisplayComponent } from '@features/build/components';

@Component({
  selector: 'app-right-sidenav',
  imports: [RouteDisplayComponent],
  templateUrl: './right-sidenav.html',
  styleUrl: './right-sidenav.scss',
})
export class RightSidenavComponent {
  isOpen = model(true);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
