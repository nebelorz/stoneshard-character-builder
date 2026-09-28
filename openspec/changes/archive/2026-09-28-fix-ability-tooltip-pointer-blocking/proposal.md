## Why

The ability tooltip card is offset to the right of the hovered icon, is 320px wide, and captures pointer events so a user can hover it and scroll a long description. Because it sits on top of neighbouring icons and cancels its own hide timer while the pointer is over it, moving the cursor right to tick the next ability instead lands on the card. The pointer never reaches the neighbour icon, so the intended "entering another icon hides the card" guard never fires. The user has to leave the card, wait for it to disappear, and only then click. The card should never steal pointer input from the tree.

## What Changes

- Make the ability card pointer-inert (`pointer-events: none`). The pointer passes through it, so hovering or clicking a covered neighbour icon works and the existing neighbour-hide guard fires.
- Remove hover retention on the card: entering and leaving the card no longer cancels or schedules the hide.
- Add a short appearance delay (~120 ms) when showing on hover, so sweeping across the grid does not flash a card per icon. Keyboard focus still shows the card immediately.
- Reduce the hide delay on leaving the icon to ~60 ms.
- Add wheel-to-scroll on the trigger icon while its card is visible: the wheel scrolls the card body when it overflows, and the card absorbs the wheel so the page does not scroll.
- Preserve keyboard reachability: the overflow region stays focusable and Escape hides the card.
- After obtaining or refunding an ability, the card stays visible until the pointer leaves the icon.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui-popover-tooltip`: the ability tooltip requirement changes from a hover-retentive, pointer-interactive card to a pointer-inert card with a hover appearance delay, wheel-over-trigger scrolling, a shorter hide delay, and preserved keyboard reachability.

## Impact

- Feature UI: `src/app/features/ability-trees/components/ability-icon/` (`ability-icon.ts` timers and wheel handling; `ability-icon.html` card handlers; `ability-icon.scss` pointer behavior). No change to positioning, layout, or data.
- Untouched: the `appEnrichedTooltip` system, the `appTooltip` directive, ability tree layout, and the build state model.
- Non-goal: touch and mobile interaction; scope stays desktop hover plus keyboard focus.
