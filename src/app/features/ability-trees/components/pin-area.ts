import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { BuildStore } from '@features/build/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { AbilityTree } from '@models';
import { AbilityTreeComponent } from './ability-tree/ability-tree';
import { TreeSelectorComponent } from './tree-selector/tree-selector';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip';
import { cardReflow } from '@shared/animations/fade';

@Component({
  selector: 'app-pin-area',
  imports: [AbilityTreeComponent, TreeSelectorComponent, TooltipDirective],
  templateUrl: './pin-area.html',
  styleUrl: './pin-area.scss',
  animations: [cardReflow],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinAreaComponent {
  readonly pinnedTreeData = computed(() => {
    const allTrees = this.abilityData.trees.value() ?? [];
    const pinnedIds = this.buildStore.state()?.pinnedTrees ?? [];
    return pinnedIds
      .map((id) => allTrees.find((t) => t.id === id))
      .filter((t): t is AbilityTree => t !== undefined);
  });

  private readonly buildStore = inject(BuildStore);
  private readonly abilityData = inject(AbilityDataService);

  trackByTreeId(_index: number, tree: AbilityTree): string {
    return tree.id;
  }

  unpinTree(treeId: string): void {
    this.buildStore.unpinTree(treeId);
  }

  resetTree(treeId: string): void {
    this.buildStore.resetTree(treeId);
  }
}
