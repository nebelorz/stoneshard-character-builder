import { Component, inject, computed } from '@angular/core';
import { BuildStore } from '@features/build/services';

@Component({
  selector: 'app-level-controls',
  templateUrl: './level-controls.html',
  styleUrl: './level-controls.scss',
})
export class LevelControlsComponent {
  private readonly buildStore = inject(BuildStore);

  readonly level = computed(() => this.buildStore.state()?.level ?? 30);
  readonly canLevelUp = computed(() => this.buildStore.canLevelUp());
  readonly canLevelDown = computed(() => this.buildStore.canLevelDown());
  readonly canLevelUp5 = computed(() => this.buildStore.canLevelUp5());
  readonly canLevelDown5 = computed(() => this.buildStore.canLevelDown5());

  onLevelUp(): void {
    this.buildStore.levelUp();
  }

  onLevelDown(): void {
    this.buildStore.levelDown();
  }

  onLevelUp5(): void {
    this.buildStore.levelUp5();
  }

  onLevelDown5(): void {
    this.buildStore.levelDown5();
  }
}
