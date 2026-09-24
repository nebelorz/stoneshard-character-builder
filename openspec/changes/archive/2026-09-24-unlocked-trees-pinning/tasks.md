## 1. Character-info component

- [x] 1.1 Add `isPinned(treeId)` and `togglePin(tree)` to `character-info.ts` that call `BuildStore.pinTree`/`unpinTree`, mirroring `TreeSelectorComponent.togglePin`; verify the component compiles
- [x] 1.2 Update `character-info.html`: rename heading to "Unlocked Trees", wire `(click)="togglePin(tree)"` on the row, add `--pinned` class and `[attr.aria-pressed]` bound to pin state
- [x] 1.3 Update `character-info.scss`: add `cursor: pointer`, hover background, and a `--pinned` gold tint (mirroring the tree-selector `rgba($gold-accent, 0.1)` style)

## 2. Tests

- [x] 2.1 Update `character-info.spec.ts`: change the heading assertion to "Unlocked Trees"; verify the updated suite passes
- [x] 2.2 Add tests for click pins a tree, click unpins, no auto-pinning on load, keyboard toggle (Enter/Space), pin state synced from `BuildStore`, and pins persisting across character switch; verify all pass via `npm test`

## 3. Verification

- [x] 3.1 Run `npm test` and `npm run lint`, and verify both pass with no regressions in `character-info` or related pinning behavior
