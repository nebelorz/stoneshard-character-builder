## Why

The app has three tooltip mechanisms: the simple text-chip `appTooltip` directive, a hand-rolled rich tooltip inside `ability-icon` (cursor-following, appended to body), and an imperative CDK Overlay + TemplatePortal tooltip in `character-selector` for trait display. Rich content (abilities, traits, and the upcoming stat descriptions) has no shared home, so each consumer rebuilds overlay wiring, positioning, and ARIA. A single model-driven enriched tooltip gives rich content one mechanism and one styling surface, while the simple chip keeps covering short micro-copies.

## What Changes

- Add a shared **enriched tooltip** primitive: an `appEnrichedTooltip` directive that opens a CDK Overlay portal hosting an `EnrichedTooltipOverlayComponent`, which renders a typed content union (`trait` shipped in this change; `ability` and `stat` content models plug in from their own changes).
- Content is passed as a discriminated-union input, so each tooltip is a typed data model rather than ad-hoc template wiring.
- Positioning is anchored to the trigger element via CDK `flexibleConnectedTo`, with a placement input and automatic viewport flipping. A positioning-mode input is defined to allow future cursor-follow behavior, but cursor-follow is not implemented in this change.
- Placements leave a gap and never overlap the trigger, and the tooltip overlay is non-interactive, so showing a tooltip cannot steal the trigger's hover.
- The enriched tooltip is keyboard accessible: shows on focus, hides on blur and Escape, and sets `aria-describedby`.
- Migrate `character-selector`'s trait display (trait bubble and dropdown trait tooltip) onto the enriched tooltip, removing the imperative Overlay/TemplatePortal code.
- The simple `appTooltip` directive and the `ability-icon` tooltip are untouched (ability-icon migration is a deliberate follow-up).

## Capabilities

### New Capabilities

- `enriched-tooltip`: A shared, model-driven rich tooltip that renders typed content (trait content shipped now; ability and stat content models added later), anchored to its trigger, keyboard accessible, and reusable across the app.

### Modified Capabilities

- None. The trait tooltip's observable behavior (trait name and description shown on hover/focus) is unchanged, so `character-select` requirements do not change. The `ui-popover-tooltip` "Ability tooltip" and "Simple tooltip directive" requirements are untouched.

## Impact

- Code: new shared files under `src/app/shared/directives/tooltip/` (`enriched-tooltip.ts`, `enriched-tooltip-overlay.ts` + scss, `tooltip-content.model.ts`); migration in `src/app/features/character/components/character-selector/` (`character-selector.ts`, `character-selector.html`); new specs for the enriched tooltip; `character-selector.spec.ts` updated.
- The overlay pane is made non-interactive via a global rule in `src/styles.scss` (`.cdk-overlay-pane.enriched-tooltip-pane { pointer-events: none }`).
- The simple `appTooltip` directive, `build-options`, `extras-display`, `footer`, and `pin-area` are unaffected.
- The `ability-icon` rich tooltip remains as-is in this change.
- No new dependencies; reuses the existing CDK Overlay setup already used by `appTooltip`.
- The `stat-description-tooltips` change (captured separately) builds its stat content model and info icons on top of this primitive.
