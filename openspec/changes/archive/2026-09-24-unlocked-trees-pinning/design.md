## Context

The "Unlocked at start" panel lives in `character-info` (features/character), below the stat controls in the left side nav. It derives its rows from `BuildStore.traitsUnlockedOnStart` (the selected character's `traitsUnlockedOnStart` tree ids) mapped to full tree objects via `AbilityDataService.trees`. The rows are inert buttons (`cursor: default`, no click handler).

Pinning is already implemented: `BuildState.pinnedTrees` is owned by `BuildStore`, mutated through `BuildStore.pinTree`/`unpinTree`, shared with the main-area tree selector and pinned-tree cards, and persisted in build state (URL/localStorage). The tree-selector's pinned visual is a gold tint (`tree-selector__tree-cell--pinned`, `rgba($gold-accent, 0.1)`).

See proposal.md for the motivation; specs/character-info-panel/spec.md for the behavioral contract.

## Goals / Non-Goals

**Goals:**

- Reuse the existing `BuildStore` pin APIs and `pinnedTrees` state so the side-nav rows, tree selector, and pinned cards stay in sync with no duplicated state.
- Minimal diff confined to the `character-info` component and its tests; keep the component's single responsibility (display starting trees) and extend it with the pin toggle.
- Preserve all existing behavior: list derivation, character-switch updates, empty-state collapse, keyboard reachability.

**Non-Goals:**

- No changes to `traitsUnlockedOnStart`, the data layer, or the "visual only" unlock semantics.
- No new store, no new pin state, no auto-pinning.
- No changes to the tree selector, pin-area cards, or URL/share logic.

## Decisions

### Reuse BuildStore.pinTree/unpinTree directly

`character-info` already injects `BuildStore`. Add an `isPinned(treeId)` computed and a `togglePin(tree)` method that calls `buildStore.pinTree`/`unpinTree`, mirroring `TreeSelectorComponent.togglePin`. No new service or store.

Alternatives considered: a dedicated `TreePinStore` sub-store (mentioned in the architecture spec's store list) — rejected because pin state already lives in `BuildStore` and a second owner would duplicate state and add sync complexity. The component is already in the character feature and already depends on `BuildStore`.

### Toggle-on-row-click

Clicking a row toggles the tree's pinned state. This matches the tree-selector cell behavior (click/Enter toggles pin) so the interaction stays consistent across the app.

### Pinned styling mirrors tree-selector

Add a `character-info__row--pinned` class using the same `rgba($gold-accent, 0.1)` tint the tree-selector uses, plus `cursor: pointer` and a hover background on the rows. No new icon assets.

### Keyboard and ARIA

Rows are already `<button>` elements with a focus-visible ring, so Enter and Space fire the click handler with no extra keydown code. Add `[attr.aria-pressed]="isPinned(tree.id) ? 'true' : 'false'"` to communicate the toggle state.

### Heading rename

Change the panel heading text from "Unlocked at start" to "Unlocked Trees" in the template.

## Risks / Trade-offs

- [Toggle unpins on second click] → A mis-click can unpin a tree the user has invested points in. Mitigation: the tree card only disappears (obtained abilities are retained in `obtainedAbilities`), and re-pinning is a single click. This matches the existing tree-selector toggle semantics.
- [Rows were previously inert; discoverability of click-to-pin] → Mitigation: pointer cursor, hover background, and the gold pinned state make interactivity visible. A hover tooltip ("Click to pin"/"Click to unpin") can be added later without spec changes.
- [Pinned rows could confuse if pinned state came from elsewhere] → The gold highlight reflects shared `pinnedTrees`, so a tree pinned via the tree selector also shows as pinned in the panel. This is intended (see spec scenario "Pin state stays in sync").

## Migration Plan

Front-end only, no migration. Rollback is a revert of the `character-info` component and its tests.

## Open Questions

- Whether to add a hover tooltip hint on the rows ("Click to pin"/"Click to unpin") for discoverability. Deferrable: it does not change specs, approach, or task breakdown; the tooltip directive already exists.
