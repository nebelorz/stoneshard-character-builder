import { Component, computed, inject } from '@angular/core';
import { AbilityDataService } from '@core/data';
import { BuildStore } from '@core/state';
import { AbilityTree } from '@models';
import { EnrichedTooltipDirective } from '@shared/directives/tooltip/enriched-tooltip';
import { TreeTooltipContent } from '@models';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.html',
  styleUrl: './character-info.scss',
  imports: [EnrichedTooltipDirective],
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

  readonly pinnedTrees = computed(() => this.buildStore.state()?.pinnedTrees ?? []);

  readonly tooltipByTreeId = computed<Record<string, TreeTooltipContent>>(() => {
    const map: Record<string, TreeTooltipContent> = {};
    for (const tree of this.startingTrees()) {
      map[tree.id] = {
        kind: 'tree',
        name: tree.name,
        description: tree.focus || undefined,
      };
    }
    return map;
  });

  getTreeIconPath(tree: AbilityTree): string {
    return `assets/icons/${tree.id}/${tree.id}_tree_icon.png`;
  }

  isPinned(treeId: string): boolean {
    return this.pinnedTrees().includes(treeId);
  }

  togglePin(tree: AbilityTree): void {
    if (this.isPinned(tree.id)) {
      this.buildStore.unpinTree(tree.id);
    } else {
      this.buildStore.pinTree(tree.id);
    }
  }

  trackByTreeId(_index: number, tree: AbilityTree): string {
    return tree.id;
  }
}
