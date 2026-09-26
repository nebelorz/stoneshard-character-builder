import { Component } from '@angular/core';
import { CharacterSelectorComponent } from '@features/character/components/character-selector/character-selector';
import { CharacterInfoComponent } from '@features/character/components/character-info/character-info';
import { LevelControlsComponent } from '@features/character/components/level-controls/level-controls';
import { StatControlsComponent } from '@features/character/components/stat-controls/stat-controls';
import { TraitSectionComponent } from '@features/character/components/trait-section/trait-section';
import { QuestsSectionComponent } from '@features/character/components/quests-section/quests-section';

@Component({
  selector: 'app-character-panel',
  imports: [
    CharacterSelectorComponent,
    CharacterInfoComponent,
    LevelControlsComponent,
    StatControlsComponent,
    TraitSectionComponent,
    QuestsSectionComponent,
  ],
  templateUrl: './character-panel.html',
})
export class CharacterPanelComponent {}
