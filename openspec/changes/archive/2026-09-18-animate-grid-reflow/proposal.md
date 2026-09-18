## Why

When unpinning a tree card from the pin area, the unpinned card fades out but the remaining cards snap into their new grid positions instantly. This creates a harsh, abrupt reflow that feels jarring, especially with 3+ pinned trees.

## What Changes

- Add a staggered slide animation to the remaining tree cards when one is unpinned, so they glide smoothly into position instead of snapping

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `tree-pinning`: Remaining pinned tree cards animate with a staggered shift when a sibling card is removed

## Impact

- `src/app/features/ability-trees/components/pin-area.ts` - replace `fadeInOut` with a custom animation trigger using `query` and `stagger` for the `@for` block
- `src/app/features/ability-trees/components/pin-area.html` - no template change needed (animation trigger stays the same)
