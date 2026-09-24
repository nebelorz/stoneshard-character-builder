## Why

The side-nav "Unlocked at start" panel is purely informational: rows do nothing when clicked. Pinning a starting tree requires opening the main-area tree selector, expanding a category, and clicking its pin toggle. Since a character's starting trees are the most likely trees a user pins, making those rows directly pinnable gives a one-click path to the most relevant trees.

## What Changes

- Rename the side-nav section heading from "Unlocked at start" to "Unlocked Trees".
- Make each unlocked-tree row a pin toggle: clicking a row pins that tree into the main content area; clicking it again unpins it.
- Show pinned state on the row with a gold highlight (mirroring the tree-selector pinned styling) and `aria-pressed`.
- Reuse the existing `BuildStore.pinTree`/`unpinTree` and `pinnedTrees` build state. No auto-pinning, no new state, no data model changes.
- Preserve the existing tree unlock logic: the row list is still derived from the selected character's `traitsUnlockedOnStart`.
- Keep the existing collapse behavior when the selected character has no unlocked trees.

## Capabilities

### New Capabilities

- None. No new capability is introduced; the change reshapes an existing panel's behavior.

### Modified Capabilities

- `character-info-panel`: The starting-trees panel's requirements change. The section heading is renamed, and its rows become interactive pin toggles (click pins/unpins, pinned rows show a gold highlight and `aria-pressed`), instead of inert informational rows.

## Impact

- Code: `src/app/features/character/components/character-info/character-info.ts`, `character-info.html`, `character-info.scss`, and `character-info.spec.ts`.
- Reuses existing `BuildStore` pin APIs and the `pinnedTrees` build state; URL/localStorage persistence and pin-state behavior in the tree selector and pinned-tree cards are unchanged.
- No data model changes. `Character.traitsUnlockedOnStart` and the `data-layer` "visual only" semantics are untouched.
- No new dependencies or shared-layer changes.
