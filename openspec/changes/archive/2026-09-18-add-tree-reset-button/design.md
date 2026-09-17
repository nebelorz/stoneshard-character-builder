## Context

The pin-area renders a grid of pinned ability trees. Each card has an unpin (X) button in the top-right corner that appears on hover. The `BuildStore` manages all state mutations through immutable signal updates. Obtained abilities are stored as `ObtainedAbility[]` in `BuildState`, where each entry records `abilityId`, `level`, and `order`. AP is a simple counter decremented on obtain and incremented on refund. Default abilities (e.g., `survival-1` / Butchering) are defined in `DEFAULT_ABILITY_IDS` and are always treated as active without being in the obtained list.

## Goals / Non-Goals

**Goals:**

- Add a `resetTree(treeId)` method to `BuildStore` that refunds all obtained abilities belonging to a specific tree
- Add a reset button to each pinned tree card in the pin-area UI
- Preserve default abilities, pin state, stats, level, and SP on reset

**Non-Goals:**

- Changing the full build reset behavior
- Adding confirmation popup for tree reset (simple action, low risk)
- Unpinning the tree after reset

## Decisions

### 1. Filter obtained abilities by tree ID

**Decision:** Add a `resetTree(treeId)` method in `BuildStore` that filters `obtainedAbilities` to remove entries whose `abilityId` starts with `${treeId}-`, then restores AP by the count of removed abilities.

**Rationale:** Ability IDs are prefixed with their tree ID (e.g., `survival-1`, `swords-3`). Filtering by prefix is a simple, reliable way to identify which abilities belong to a tree without needing to join against the abilities data. The `AbilityStore` already has the refund logic for cascade and AP restoration, but per-tree reset is a bulk operation that is cleaner as a direct state transformation in `BuildStore`.

**Alternative considered:** Reuse `applyRefundAbility` in a loop for each obtained ability in the tree. Rejected because it would cascade multiple times redundantly and is less efficient than a single bulk filter.

### 2. Button placement and styling

**Decision:** Add the reset button as a sibling to the existing unpin button in `pin-area.html`, positioned with `right: 34px` (22px button + 6px gap from the unpin button's `right: 6px`). Same 22x22px size, same hover reveal behavior, using `reset_ability_tree.png` at 16x16.

**Rationale:** Keeps the button grouped with the existing card action controls. The hover-reveal pattern is already established for the unpin button and applies naturally here.

### 3. No confirmation dialog

**Decision:** Perform the reset immediately on click without a confirmation popup.

**Rationale:** The action is easily reversible (user can re-obtain abilities), affects only one tree, and the existing unpin button also acts without confirmation. Adding a popup would break the established pattern for card-level actions.

## Risks / Trade-offs

- **[Risk] User accidentally resets a tree** → Mitigation: The button is hidden by default (hover reveal), matching the unpin button's discoverability. The action is non-destructive to overall build state (only abilities in one tree are affected).
- **[Risk] AP calculation mismatch** → Mitigation: The count of removed abilities directly equals the AP to restore, since each ability costs exactly 1 AP. No complex calculation needed.
