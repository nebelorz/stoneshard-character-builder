## 1. Shared CSS foundation

- [x] 1.1 Add a shared SCSS partial under `src/app/shared/styles/` with the reusable fade, icon-hover (zoom + jiggle keyframes), and pin-card fade classes; verify each consuming component can `@use` it without a Sass resolution error
- [x] 1.2 Add `tree-selector.spec.ts` covering keyboard expand (ArrowDown/Enter) then immediate focus on the first tree item; verify the new spec fails against the current deferred-focus code and passes after task 3.3

## 2. Shell, dropdown, and popover

- [x] 2.1 Replace `@fadeInOut` in `src/app/app.html` with `animate.enter` / `animate.leave` shared classes and drop the `animations: [fadeInOut]` registration in `app.ts`; verify the shell still renders and removes error/loading/main views correctly
- [x] 2.2 Replace `@fadeInOut` in `character-selector.html` with the shared enter/leave classes and drop its `animations` registration; verify the dropdown still opens and closes
- [x] 2.3 Replace `@fadeInOutFast` in `popover.ts` with an entrance-only shared class and remove its `animations` registration; verify `popover.spec.ts` still passes

## 3. Tree selector and pinned area

- [x] 3.1 Replace `@expandCollapse` in `tree-selector.html` with the CSS grid wrapper class and remove the trigger registration in `tree-selector.ts`; verify the panel still expands and collapses
- [x] 3.2 Remove `pendingFocusTreeIndex` and `onPanelEnter`, and focus the first tree item directly when a category expands; verify `tree-selector.spec.ts` passes
- [x] 3.3 Replace `@cardReflow` on `.pin-area__card` with shared `animate.enter` / `animate.leave` fade classes and remove the `animations` registration in `pin-area.ts`; verify pin/unpin still adds and removes cards
- [x] 3.4 Delete `cardReflow` and the other unused triggers from `shared/animations/fade.ts` as their consumers migrate; verify no remaining import references them

## 4. Footer icon hover

- [x] 4.1 Remove the four `*Hovered` signals and the `[@iconHover]` bindings in `footer.html` / `footer.ts`, applying the shared CSS hover class instead; verify the icons still scale and jiggle on hover
- [x] 4.2 Delete `shared/animations/icon-hover.ts` and the unused `shared/directives/icon-hover.directive.ts`; verify no file imports `@angular/animations` or the deleted directive

## 5. Remove the deprecated package and providers

- [x] 5.1 Remove `provideAnimationsAsync()` from `src/app/app.config.ts`; verify the app builds with no animation provider
- [x] 5.2 Remove `@angular/animations` from `package.json` and reinstall; verify `ng build` succeeds and the production initial bundle does not include the animations package

## 6. Specs and verification

- [x] 6.1 Remove `provideAnimations()` / `provideNoopAnimations()` imports and providers from `app.spec.ts`, `popover.spec.ts`, `confirm-popup.spec.ts`, `character-selector.spec.ts`, and `route-display.spec.ts`; verify those specs pass
- [x] 6.2 Grep the repo for `@angular/animations`, `provideAnimations`, `@fadeInOut`, `@iconHover`, `@expandCollapse`, and `@cardReflow`; verify none remain
- [x] 6.3 Run `npm run lint`, `ng build`, and `npm test`; verify all pass with no new budget warnings
