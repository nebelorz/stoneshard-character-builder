## 1. Left sidenav positioning

- [x] 1.1 Change `.left-sidenav` from `position: sticky` to `position: fixed; left: 0` and remove `overflow-y: auto` in `left-sidenav.scss`. Verify: the left sidenav stays visible when scrolling the main content.
- [x] 1.2 Add `margin-left: 260px` to `.app-content` in `app.scss`. Verify: main content does not overlap the left sidenav.

## 2. Verification

- [x] 2.1 Run build (`ng build`) and verify no CSS compilation errors.
