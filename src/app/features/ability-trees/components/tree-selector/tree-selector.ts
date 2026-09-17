import {
  Component,
  ElementRef,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { expandCollapse } from '@shared/animations/fade';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from '@features/build/services';
import { AbilityTree } from '@models';

interface CategoryGroup {
  category: 'weaponry' | 'utility' | 'sorcery';
  label: string;
  trees: AbilityTree[];
}

@Component({
  selector: 'app-tree-selector',
  host: { '(document:click)': 'onDocumentClick($event)' },
  animations: [expandCollapse],
  templateUrl: './tree-selector.html',
  styleUrl: './tree-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectorComponent {
  readonly categories = computed(() => {
    const trees = this.abilityData.trees.value();
    if (!trees) return [];
    return [
      {
        category: 'weaponry' as const,
        label: 'Weaponry',
        trees: trees.filter((t) => t.category === 'weaponry'),
      },
      {
        category: 'utility' as const,
        label: 'Utility',
        trees: trees.filter((t) => t.category === 'utility'),
      },
      {
        category: 'sorcery' as const,
        label: 'Sorcery',
        trees: trees.filter((t) => t.category === 'sorcery'),
      },
    ];
  });

  readonly pinnedTrees = computed(() => this.buildStore.state()?.pinnedTrees ?? []);
  expandedCategory = signal<string | null>(null);
  focusedIndex = signal(0);
  private readonly pendingFocusTreeIndex = signal<number | null>(null);

  readonly expandedCategoryTrees = computed(() => {
    const expanded = this.expandedCategory();
    if (!expanded) return [];
    return this.categories().find((c) => c.category === expanded)?.trees ?? [];
  });

  readonly pinnedCount = computed(() => {
    const pinned = this.pinnedTrees();
    const cats = this.categories();
    const map: Record<string, number> = {};
    for (const cat of cats) {
      map[cat.category] = cat.trees.filter((t) => pinned.includes(t.id)).length;
    }
    return map;
  });

  private readonly abilityData = inject(AbilityDataService);
  private readonly buildStore = inject(BuildStore);
  private readonly elementRef = inject(ElementRef);

  toggleCategory(category: CategoryGroup): void {
    if (this.expandedCategory() === category.category) {
      this.expandedCategory.set(null);
    } else {
      this.expandedCategory.set(category.category);
      this.focusedIndex.set(0);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.expandedCategory.set(null);
    }
  }

  isPinned(treeId: string): boolean {
    return this.pinnedTrees().includes(treeId);
  }

  togglePin(tree: AbilityTree, event: Event): void {
    event.stopPropagation();
    if (this.isPinned(tree.id)) {
      this.buildStore.unpinTree(tree.id);
    } else {
      this.buildStore.pinTree(tree.id);
    }
  }

  setFocusedIndex(index: number): void {
    this.focusedIndex.set(index);
  }

  tabIndexFor(cat: CategoryGroup): number {
    const expanded = this.expandedCategory();
    if (expanded) return expanded === cat.category ? 0 : -1;
    return this.categories()[0]?.category === cat.category ? 0 : -1;
  }

  onCategoryKeydown(event: KeyboardEvent, category: CategoryGroup): void {
    const cats = this.categories();
    const idx = cats.findIndex((c) => c.category === category.category);

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      const next = cats[(idx + offset + cats.length) % cats.length];
      this.focusTab(next.category);
    } else if (event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
      if (this.expandedCategory() !== category.category) {
        this.expandedCategory.set(category.category);
        this.focusedIndex.set(0);
        this.pendingFocusTreeIndex.set(0);
      } else {
        this.focusedIndex.set(0);
        this.focusTreeItem(0);
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.focusTab(cats[0].category);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.focusTab(cats[cats.length - 1].category);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.expandedCategory.set(null);
    }
  }

  onTreeKeydown(event: KeyboardEvent, tree: AbilityTree, index: number): void {
    const expanded = this.expandedCategory();
    if (!expanded) return;

    const cat = this.categories().find((c) => c.category === expanded);
    if (!cat) return;

    const trees = cat.trees;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(index + 1, trees.length - 1);
      this.focusedIndex.set(next);
      this.focusTreeItem(next);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = Math.max(index - 1, 0);
      this.focusedIndex.set(prev);
      this.focusTreeItem(prev);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.focusedIndex.set(0);
      this.focusTreeItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.focusedIndex.set(trees.length - 1);
      this.focusTreeItem(trees.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.togglePin(trees[index], event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.expandedCategory.set(null);
      this.focusTab(expanded);
    }
  }

  onPanelEnter(): void {
    const pending = this.pendingFocusTreeIndex();
    if (pending !== null) {
      this.pendingFocusTreeIndex.set(null);
      this.focusTreeItem(pending);
    }
  }

  private focusTab(category: string): void {
    const el = this.elementRef.nativeElement.querySelector(`#tree-tab-${category}`);
    if (el) {
      (el as HTMLElement).focus();
    }
  }

  private focusTreeItem(index: number): void {
    const panelEl = this.elementRef.nativeElement.querySelector('.tree-selector__panel');
    if (panelEl) {
      const cells = panelEl.querySelectorAll('.tree-selector__tree-cell');
      const target = cells[index];
      if (target) {
        (target as HTMLElement).focus();
      }
    }
  }

  trackByCategory(_index: number, cat: CategoryGroup): string {
    return cat.category;
  }

  trackByTreeId(_index: number, tree: AbilityTree): string {
    return tree.id;
  }

  getTreeIconPath(tree: AbilityTree): string {
    return `assets/icons/${tree.id}/${tree.id}_tree_icon.png`;
  }
}
