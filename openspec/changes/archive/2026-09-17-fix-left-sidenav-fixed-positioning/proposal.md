## Why

The left sidenav uses `position: sticky` which fails to stick because the `<app-left-sidenav>` host element (display: inline by default) sits between the scroll container and the sticky element. When the user scrolls down, the left sidenav scrolls out of the viewport. The right sidenav uses `position: fixed` and stays visible at all times. The left sidenav should behave identically.

## What Changes

- Change `.left-sidenav` from `position: sticky` to `position: fixed` with `left: 0`
- Add `margin-left` to `.app-content` to reserve the left sidenav width when fixed-positioned
- Remove the unnecessary `overflow-y: auto` from `.left-sidenav` (no content scrolls inside it)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `app-layout`: Left sidenav positioning changes from `sticky` to `fixed`, requiring a content margin adjustment

## Impact

- `src/app/layout/left-sidenav/left-sidenav.scss` - positioning change
- `src/app/app.scss` - new margin-left on `.app-content`
