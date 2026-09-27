## Why

`@angular/animations` is deprecated as of Angular v20.2 (the whole package, including `provideAnimationsAsync`), and the Angular team intends to remove it in v23. This app still ships `provideAnimationsAsync()` plus four legacy trigger files and five spec files that import the deprecated providers, so a routine Angular upgrade would break the build.

## What Changes

- Remove the `@angular/animations` dependency and drop `provideAnimationsAsync()` from the application providers.
- Replace the shared animation triggers with native CSS driven by `animate.enter` / `animate.leave` and class bindings:
  - `fadeInOut` (app shell, character selector dropdown).
  - `fadeInOutFast` (popover, entrance only; behavior is unchanged since the overlay already detached before any fade-out could play).
  - `expandCollapse` (tree selector category panel).
  - `iconHover` (footer icons) replaced by CSS `:hover`, which also removes the four `*Hovered` signals.
- Delete dead animation code: the `cardReflow` trigger (its `:leave` queries a class that never matches inside the leaving card, so it is a no-op) and the unused `appIconHover` directive (`AnimationBuilder`).
- Focus the first tree item directly when a category expands instead of deferring focus to the removed animation callback, and add the missing tree-selector keyboard spec.
- Remove `provideAnimations()` / `provideNoopAnimations()` imports and providers from the five specs that use them.
- **BREAKING** internal-only: no user-facing API changes; the staggered reflow of remaining pinned cards is dropped because it was never observable.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shared/icon-hover-animation`: the reusable mechanism changes from an Angular animation trigger/directive to a shared CSS effect; the zoom and jiggle behavior stays.
- `tree-pinning`: drop the unfulfilled "staggered shift" requirement for remaining pinned cards, which depended on the removed `cardReflow` trigger.

## Impact

- Dependencies: `@angular/animations` removed from `package.json`.
- App config: `src/app/app.config.ts`.
- Shared: `src/app/shared/animations/fade.ts`, `src/app/shared/animations/icon-hover.ts`, `src/app/shared/directives/icon-hover.directive.ts` (deleted).
- Layout and features: `src/app/app.ts` / `app.html`, `src/app/layout/footer/*`, `src/app/shared/ui/popover/popover.ts`, `src/app/features/character/components/character-selector/*`, `src/app/features/ability-trees/components/tree-selector/*`, `src/app/features/ability-trees/components/pin-area*`.
- Tests: `src/app/app.spec.ts`, `src/app/shared/ui/popover/popover.spec.ts`, `src/app/shared/ui/confirm-popup/confirm-popup.spec.ts`, `src/app/features/character/components/character-selector/character-selector.spec.ts`, `src/app/features/build/components/route-display/route-display.spec.ts`, plus a new `tree-selector.spec.ts`.
