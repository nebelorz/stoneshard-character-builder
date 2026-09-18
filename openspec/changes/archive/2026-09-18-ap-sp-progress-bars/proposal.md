## Why

AP and SP are displayed as plain text labels at the bottom of the stat controls section. This minimal presentation lacks visual hierarchy and doesn't communicate resource usage at a glance. Adding progress bars with icons improves readability and provides immediate visual feedback on resource consumption.

## What Changes

- Add Phosphor icons (`phosphorBook` for AP, `phosphorPlusSquare` for SP) to the resource display
- Replace plain text layout with progress bars showing current/max values
- Apply `bg-deepest` color to progress bar fills
- Icon colors use `text-secondary`
- Max values are fixed constants: AP=31, SP=29

## Capabilities

### New Capabilities

- `resource-display`: Visual presentation of AP and SP resources with icons and progress bars in the stat controls panel

### Modified Capabilities

(none - no behavior changes, only UI presentation)

## Impact

- `stat-controls.html` - Add icon elements and progress bar structure
- `stat-controls.scss` - Add progress bar styles
- `_components.scss` - Optionally add reusable progress bar mixin
- No changes to `stat-controls.ts` (existing `ap()` and `sp()` computeds are sufficient)
- No changes to data model or business logic
