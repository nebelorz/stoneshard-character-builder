import { Component } from '@angular/core';
import { CharacterPanelComponent } from '@features/character/components';
import { BuildOptionsComponent } from '@features/build/components';

@Component({
  selector: 'app-left-sidenav',
  imports: [CharacterPanelComponent, BuildOptionsComponent],
  templateUrl: './left-sidenav.html',
  styleUrl: './left-sidenav.scss',
})
export class LeftSidenavComponent {}
