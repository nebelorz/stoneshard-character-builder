import { Component, input, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { AbilityTree, DEFAULT_TREE_WIDTH, DEFAULT_TREE_HEIGHT, Ability } from '@models';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { AbilityIconComponent } from '../ability-icon/ability-icon';

interface PlacedAbility {
  ability: Ability;
  left: number;
  top: number;
}

@Component({
  selector: 'app-ability-tree',
  imports: [AbilityIconComponent],
  templateUrl: './ability-tree.html',
  styleUrl: './ability-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityTreeComponent {
  tree = input.required<AbilityTree>();

  abilities = signal<Ability[]>([]);
  placedAbilities = signal<PlacedAbility[]>([]);
  treeWidth = DEFAULT_TREE_WIDTH;
  treeHeight = DEFAULT_TREE_HEIGHT;

  private readonly abilityData = inject(AbilityDataService);
  private readonly buildStore = inject(BuildStore);

  private readonly abilitiesEffect = effect(() => {
    const allAbilities = this.abilityData.abilities.value();
    if (allAbilities) {
      const tree = this.tree();
      this.treeWidth = tree.width ?? DEFAULT_TREE_WIDTH;
      this.treeHeight = tree.height ?? DEFAULT_TREE_HEIGHT;
      const treeAbilities = allAbilities.filter((a) => a.treeId === tree.id);
      this.abilities.set(treeAbilities);
      this.buildLayout(treeAbilities);
    }
  });

  get aspectRatio(): string {
    return `${this.treeWidth} / ${this.treeHeight}`;
  }

  onObtain(abilityId: string): void {
    this.buildStore.obtainAbility(abilityId);
  }

  onRefund(abilityId: string): void {
    this.buildStore.refundAbility(abilityId);
  }

  private buildLayout(abilities: Ability[]): void {
    this.placedAbilities.set(
      abilities.map((ability) => ({
        ability,
        left: (ability.x / this.treeWidth) * 100,
        top: (ability.y / this.treeHeight) * 100,
      })),
    );
  }

  trackByAbility(_index: number, placed: PlacedAbility): string {
    return placed.ability.id;
  }
}
