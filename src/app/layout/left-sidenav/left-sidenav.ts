import { Component } from '@angular/core';
import { CharacterPanelComponent } from '@features/character/components';
import { BuildOptionsComponent } from '@features/build/components';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-left-sidenav',
  imports: [CharacterPanelComponent, BuildOptionsComponent, FooterComponent],
  templateUrl: './left-sidenav.html',
  styleUrl: './left-sidenav.scss',
})
export class LeftSidenavComponent {}
