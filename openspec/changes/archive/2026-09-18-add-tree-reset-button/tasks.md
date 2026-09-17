## 1. Store method

- [x] 1.1 Add `resetTree(treeId: string)` method to `BuildStore` that filters `obtainedAbilities` to remove entries whose `abilityId` starts with `${treeId}-`, restores AP by the count of removed abilities, and pushes the new state. Verify: unit test in `build-store.spec.ts` that obtains abilities from two trees, calls `resetTree` on one, and asserts only that tree's abilities are removed and AP restored correctly.
- [x] 1.2 Verify that `resetTree('survival')` preserves the default ability (`survival-1` / Butchering) by confirming it is never in `obtainedAbilities` and is unaffected. Verify: test that `DEFAULT_ABILITY_IDS` are not included in the filter logic.

## 2. Pin-area component

- [x] 2.1 Add `resetTree(treeId: string)` method to `PinAreaComponent` that delegates to `buildStore.resetTree()`. Verify: method exists and compiles.
- [x] 2.2 Add reset button to `pin-area.html` as a sibling before the existing unpin button, using `reset_ability_tree.png` at 16x16, with `aria-label="Reset {tree.name}"` and `title="Reset tree"`. Verify: button renders in the DOM for each pinned tree card.

## 3. Styles

- [x] 3.1 Add `.pin-area__reset-btn` styles in `pin-area.scss` matching the unpin button's positioning (`position: absolute`, `top: 6px`), size (22x22px), hover reveal, and visual treatment, with `right: 34px` to sit left of the unpin button. Verify: reset button appears on card hover, hidden by default, aligned left of the X button.

## 4. Verification

- [x] 4.1 Run the full test suite (`ng test`) and confirm all existing tests pass. Verify: zero test failures.
- [x] 4.2 Manually verify: pin two trees, obtain abilities in both, click reset on one tree, confirm only that tree's abilities are cleared and AP restored, other tree unchanged. Confirm survival tree reset preserves Butchering.
