## 1. Content model

- [x] 1.1 Create `src/app/shared/directives/tooltip/tooltip-content.model.ts` defining the `TooltipContent` discriminated union and `TraitTooltipContent`; verify the app type-checks

## 2. Enriched tooltip primitive

- [x] 2.1 Implement `EnrichedTooltipOverlayComponent` rendering via `@switch` on content kind (trait section: name + description) with `enriched-tooltip-overlay.scss` styling; verify the dev server builds and the tooltip wraps long text
- [x] 2.2 Implement the `appEnrichedTooltip` directive with anchored CDK Overlay positioning (preferred placement + viewport flip), 200ms hover delay, focus/blur/Escape handlers, and `aria-describedby`; verify it builds
- [x] 2.3 Add unit tests for the directive and overlay covering the spec scenarios (trait render, hover show/hide, empty content shows nothing, focus shows, blur hides, Escape hides, `aria-describedby`, viewport flip); verify the tests pass

## 3. Trait display migration

- [x] 3.1 Apply `appEnrichedTooltip` with trait content to the trait icon and each dropdown option in `character-selector.html`; verify hovering a dropdown option shows the trait tooltip without dismissing the dropdown
- [x] 3.2 Remove the imperative trait bubble/tooltip code (effects, show/hide methods, overlay refs, and both trait templates); verify the existing `character-selector.spec.ts` passes, including the trait-icon keyboard focus/blur scenarios

## 4. Verification

- [x] 4.1 Run the full test suite, lint, and a production build; verify all pass with no regressions in the simple `appTooltip` call sites or the ability-icon tooltip

## 5. Positioning correction

- [x] 5.1 Make every placement leave a gap without overlapping the trigger and order positions `[top, bottom, left, right]`; verify a regression test asserts the right-placement gap
- [x] 5.2 Make the overlay pane non-interactive via a panel class and `pointer-events: none`; verify all points across the trigger stay hoverable while the tooltip is shown
