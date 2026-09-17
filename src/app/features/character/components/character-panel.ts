import { Component } from '@angular/core';
import { CharacterSelectorComponent } from '@features/character/components/character-selector/character-selector';
import { CharacterInfoComponent } from '@features/character/components/character-info/character-info';
import { LevelControlsComponent } from '@features/character/components/level-controls/level-controls';
import { StatControlsComponent } from '@features/character/components/stat-controls/stat-controls';

@Component({
  selector: 'app-character-panel',
  imports: [
    CharacterSelectorComponent,
    CharacterInfoComponent,
    LevelControlsComponent,
    StatControlsComponent,
  ],
  templateUrl: './character-panel.html',
})
export class CharacterPanelComponent {}
