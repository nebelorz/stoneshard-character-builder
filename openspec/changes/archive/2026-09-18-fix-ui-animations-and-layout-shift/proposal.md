## Why

The page currently suffers from a layout shift on load: the `app-tree-selector` briefly appears in the center of the screen before repositioning to its correct location. Additionally, all component visibility changes (pinning/unpinning trees, opening/closing popovers) happen instantly without transition, making the UI feel abrupt. The builder options popover also lacks toggle behavior: clicking the same button while the popover is open does not close it.

## What Changes

- Prevent the layout shift of `app-tree-selector` on page load by hiding the main content until it is ready to render in its final position
- Add fade-in/fade-out transitions to ability tree card appearance/disappearance when pinning or unpinning
- Add fade-in/fade-out transitions to builder options popover open/close
- Fix builder options popover to close when clicking the trigger button again (toggle behavior)

## Capabilities

### Modified Capabilities

- `tree-pinning`: Add fade-in/fade-out transitions when pinned tree cards appear and disappear from the pin area
- `ui-popover-tooltip`: Add fade-in/fade-out transitions to popover open/close; add toggle behavior so clicking the same trigger button closes an already-open popover
- `app-layout`: Prevent layout shift of tree selector on initial page load

### New Capabilities

_(none)_

## Impact

- `src/app/features/ability-trees/components/pin-area.ts` / `.html` / `.scss` - fade animation on card list
- `src/app/shared/ui/popover/popover.ts` / `.html` / `.scss` - fade animation on popover, toggle logic
- `src/app/features/build/components/build-options/build-options.ts` - toggle logic in `openPopup()`
- `src/app/app.html` / `.ts` - loading state transition to prevent layout shift
- `src/app/shared/ui/fade.ts` - may need a new animation trigger for list items
