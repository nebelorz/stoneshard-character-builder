## Context

The `enriched-tooltip-system` change (captured in parallel) defines a shared, model-driven enriched tooltip: a `TooltipContent` discriminated union in `shared/directives/tooltip/tooltip-content.model.ts`, an `appEnrichedTooltip` directive, and an overlay component that renders via `@switch` on content kind. That change ships a `trait` kind and keyboard access. The stat list renders in `stat-controls` from `STAT_KEYS`; stat names currently live in a local `getStatName()` Record inside the component. The five stat descriptions are final user-provided text with a consistent structure (name, intro paragraph, "Each point of X grants" bullets, "Reaching 15/20/25/30" bullets, cap line). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Add a `stat` content kind to the enriched tooltip union and render it.
- Keep the five descriptions as separated, type-safe data outside the component.
- Show an info icon per stat that opens the enriched tooltip on hover and focus.

**Non-Goals:**

- Changes to the simple `appTooltip` directive or its call sites.
- Rendering the descriptions anywhere beyond the stat list.
- HTTP-fetched data; the descriptions are static app content.

## Decisions

**1. Stat content model lives in the shared union; data lives in the models layer.**
`StatTooltipContent` is added to `TooltipContent` in `tooltip-content.model.ts` and rendered by a `stat` case in the overlay component's `@switch`. The five instances are data, not code: `src/app/models/stat-info.model.ts` exports `STAT_INFO: Record<StatKey, StatTooltipContent>`, exported from the `models/index.ts` barrel. The `Record<StatKey, ...>` key type makes a missing stat a compile error, and the data stays separated from the component (the user's stated preference) while sitting beside `STAT_KEYS`.

- Alternatives rejected: `assets/data/stats.json` + a data service (async fetch, loading state, and runtime guards for five static strings; the data-layer JSON pipeline is for large datasets); a plain-text `Record<StatKey, string>` (loses the structure the enriched tooltip renders); a data object inside `stat-controls.ts` (couples content to the component).

**2. Content shape maps 1:1 to the supplied text.**
`StatTooltipContent = { kind: 'stat'; name: string; description: string; perPointEffects: string[]; milestoneEffects: string[]; cap: string }`. `perPointEffects` are the "Each point of X grants" bullets, `milestoneEffects` are the "Reaching 15, 20, 25, and 30 points also grants" bullets, and `cap` is the "Cap: 30 points" line. The overlay renders a fantasy-font title, the intro paragraph, and the two bullet groups with their labels, then the cap.

**3. Info icon wiring mirrors the `extras-display` pattern.**
In `stat-controls`, register `NgIcon` + `EnrichedTooltipDirective` in `imports` and `phosphorInfo` in `provideIcons`; each row renders an info icon bound with `appEnrichedTooltip` and the stat's content. Placement `right` suits a row hugging the left panel edge; the enriched tooltip's flexible positioning flips if there is no room.

**4. The info icon is focusable for keyboard access.**
The icon is given `tabindex="0"`, `role="img"`, and an `aria-label` (e.g., "Show Strength description") so the enriched tooltip's focus/blur handling (from `enriched-tooltip-system`) covers it, satisfying the keyboard scenario in the spec.

- Alternatives rejected: wrapping the icon in a `<button>` (implies a click action that does not exist); leaving it non-focusable (keyboard users would have no way to read the descriptions).

## Risks / Trade-offs

- [Sequencing dependency on `enriched-tooltip-system`] -> This change is implemented after that one lands; the shared union and overlay component it extends already exist.
- [A focusable `role="img"` span is a non-standard focus target] -> Accepted; verified that tab order and screen-reader labeling behave predictably.
- [Content wording is final] -> Any future rewording is a one-file data edit in `stat-info.model.ts`.
- [The `stat` case adds to the shared overlay's `@switch`] -> Additive and isolated; existing `trait` rendering is untouched.

## Migration Plan

None needed. Feature addition on top of the enriched tooltip; no data migration and no rollback surface beyond removing the icon wiring.
