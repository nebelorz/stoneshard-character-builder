import { Component, computed, inject } from '@angular/core';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { AbilityTree } from '@models';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.html',
  styleUrl: './character-info.scss',
})
export class CharacterInfoComponent {
  private readonly buildStore = inject(BuildStore);
  private readonly abilityData = inject(AbilityDataService);

  readonly startingTrees = computed<AbilityTree[]>(() => {
    const unlocked = this.buildStore.traitsUnlockedOnStart();
    if (unlocked.length === 0) return [];
    const trees = this.abilityData.trees.value();
    if (!trees) return [];
    return unlocked
      .map((id) => trees.find((tree) => tree.id === id))
      .filter((tree): tree is AbilityTree => tree !== undefined);
  });

  getTreeIconPath(tree: AbilityTree): string {
    return `assets/icons/${tree.id}/${tree.id}_tree_icon.png`;
  }

  trackByTreeId(_index: number, tree: AbilityTree): string {
    return tree.id;
  }
}
