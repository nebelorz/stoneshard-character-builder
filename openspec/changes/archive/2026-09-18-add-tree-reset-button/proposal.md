## Why

Pinned ability trees accumulate obtained abilities as users experiment with builds. Currently, the only way to clear a tree's abilities is to refund them one by one (right-click each) or reset the entire build (which resets all trees and stats). Users need a quick way to clear a single pinned tree back to its default state without affecting other trees or their stat allocations.

## What Changes

- Add a "Reset Tree" button to each pinned tree card, positioned to the left of the existing unpin (X) button
- The button uses the `reset_ability_tree.png` icon at the same size as the close button (16x16)
- Clicking the button refunds all obtained abilities in that specific tree, returning spent AP, while keeping the tree pinned
- Default abilities (e.g., Butchering in the survival tree) are preserved and not affected by the reset

## Capabilities

### New Capabilities

- `per-tree-reset`: Reset all obtained abilities in a single pinned tree to defaults, restoring AP, without affecting other trees or unpinning

### Modified Capabilities

- `tree-pinning`: Add a reset control to each pinned tree card alongside the existing unpin control

## Impact

- **Components**: `PinAreaComponent` (template, styles, logic) gains a reset button and delegates to the store
- **Services**: `BuildStore` gains a `resetTree(treeId)` method that filters obtained abilities by tree and restores AP
- **Assets**: Uses existing `reset_ability_tree.png` icon (already in `src/assets/icons/`)
- **State**: `BuildState` structure unchanged; only the `obtainedAbilities` and `ap` fields are modified by the new action
