## Context

See `proposal.md` - Why. The app currently registers the deprecated `provideAnimationsAsync()` (`src/app/app.config.ts:8,16`) and defines four legacy triggers in `src/app/shared/animations/`. Five specs also import deprecated providers (`provideAnimations` / `provideNoopAnimations`). Two pieces of animation code are already dead: `cardReflow` is a no-op (its `:leave` `query('.pin-area__card', ...)` runs inside the very card that is leaving, so it matches nothing) and the `appIconHover` directive has no usages.

Angular v20.2 introduced `animate.enter` and `animate.leave` as compiler-level APIs (not directives) that apply CSS classes on enter/leave and need no provider. That is the supported replacement for `@angular/animations`.

## Goals / Non-Goals

**Goals:**

- Remove `@angular/animations` and the deprecated animation providers entirely so the app is v23-ready.
- Preserve the visible effects that users actually rely on: app/shell and dropdown fade, popover entrance, tree panel expand/collapse, footer icon hover, and pinned card fade.
- Reduce code: delete dead animations, drop the footer hover signals, and simplify the tree-selector focus path.
- Remove the deprecated providers from the affected specs.

**Non-Goals:**

- No changes to build state, URL payload, AI prompt output, data, or any non-animation behavior.
- No new animation library (GSAP, anime.js, etc.); native CSS only.
- No re-implementation of the staggered reflow of pinned cards (it was never observable).

## Decisions

### D1 - Native CSS via `animate.enter` / `animate.leave`

Replace the TypeScript triggers with CSS classes applied by the compiler-level `animate.enter` / `animate.leave` APIs. Shared keyframes and classes live in one SCSS partial under `src/app/shared/styles/` (already on the Sass include path per `angular.json`), and each component `@use`s it. Alternatives: (a) keep per-component duplicated keyframes - rejected, the icon-hover capability is explicitly reusable; (b) keep the legacy trigger file but lazy-load - rejected, the package is deprecated and slated for removal.

### D2 - Footer hover becomes pure CSS

The footer icons only need hover feedback, so replace `[@iconHover]="discordHovered ? 'active' : 'idle'"` and the four `*Hovered` signals with the shared CSS hover class. Alternatives: (a) keep the signals and bind a class - rejected, adds state for a purely presentational effect; (b) keep the trigger - rejected with the package.

### D3 - Expand/collapse with CSS grid, focus immediately

Animate the tree panel with the `grid-template-rows: 0fr -> 1fr` technique on a wrapper class instead of `expandCollapse`. Focus the first tree item directly when a category expands; the panel cells exist as soon as `expandedCategory` is set, so the `pendingFocusTreeIndex` / `onPanelEnter` deferral (previously tied to the animation `.done` callback) is unnecessary. Alternatives: (a) keep a deferral driven by `animationend` - rejected as unneeded complexity; (b) keep the trigger - rejected with the package. A new `tree-selector.spec.ts` covers the keyboard expand-then-focus flow.

### D4 - Popover animates in only

The popover overlay is detached immediately in `hideOverlay()`, so the legacy `:leave` never played. Use an `animate.enter` class only. Behavior is unchanged (entrance-only before and after), so no spec delta is required for `ui-popover-tooltip` even though its requirement still mentions a fade-out. Alternative: coordinate `animate.leave` with `animationend` before detaching - rejected as out of the minimum-code scope.

### D5 - Pinned cards get real enter/leave fade

Pinned cards previously carried only the no-op `cardReflow` trigger, so the fade-in/out described in `tree-pinning` was never actually shown. Apply shared `animate.enter` / `animate.leave` fade classes to `.pin-area__card` and delete `cardReflow`. The staggered sibling reflow is dropped per D-scope and the spec is updated. Delete the unused `appIconHover` directive with it.

### D6 - Specs lose the deprecated providers

Because CSS animations need no Angular provider, delete `provideAnimations()` / `provideNoopAnimations()` from the five specs. TestBed disables animations by default, so `animate.leave` completes immediately and removal-based assertions keep passing; no `animationsEnabled: true` is needed.

## Risks / Trade-offs

- [Legacy and new animation APIs cannot coexist in the same component] → remove every legacy trigger and provider in this change before adding `animate.*`, and verify no `@angular/animations` import remains.
- [`animate.leave` defers DOM removal until the animation ends] → TestBed disables animations by default, so tests still see immediate removal; verify the removal-based specs (popover close, tree collapse, unpin).
- [CSS grid expand support/browser quirks] → the `0fr -> 1fr` technique degrades gracefully to a snap when transitions are unsupported.
- [Dropping the pinned-card stagger is a visible change] → it was a no-op, recorded in the spec delta.
- [Bundle copies of `@angular/animations` may linger in `package-lock`] → confirm with a production build size check and remove the dependency entry.

## Migration Plan

1. Add the shared animation SCSS partial and the new `tree-selector.spec.ts` keyboard test.
2. Migrate the shell, dropdown, popover, tree panel, footer, and pinned-card templates off the legacy triggers.
3. Delete `shared/animations/*.ts` and `shared/directives/icon-hover.directive.ts`; remove `provideAnimationsAsync()` and the `@angular/animations` dependency.
4. Remove the deprecated providers/imports from the five specs.
5. Run `npm run lint`, `ng build`, and `npm test`.

Rollback: revert the commits; the legacy triggers and provider restore the previous behavior in one step.
