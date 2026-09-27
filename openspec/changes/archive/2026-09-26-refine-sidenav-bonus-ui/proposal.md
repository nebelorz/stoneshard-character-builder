## Why

The left sidenav composition has frictions surfaced after the trait/quest bonus points work: the selector's trait icon is redundant now that the trait section sits directly below it, the section order buries the trait info between level and stats, the per-stat bonus marker (`+1`) shifts the stat row layout when it appears, bounded trait slot lists and the Character Unlocked Trees panel waste vertical space in a single column, the trait stepper buttons render without the shared side-nav button styling (they reference a class defined only in other components' encapsulated styles), and info icons sit at inconsistent distances and positions relative to their labels.

## What Changes

- Remove the character selector's trait icon badge (letter + tooltip); the trait section below provides the same information.
- Reorder the left sidenav sections to: character selector, character trait, level, stats, quests, Character Unlocked Trees.
- Render the stats panel bonus marker in a reserved fixed-width space so stat rows never shift when markers appear, change, or disappear.
- Lay out bounded trait slot lists and the Character Unlocked Trees panel in space-filling grid columns (three at the standard sidenav width); unbounded boss-row pairs stay full-width.
- Apply the shared side-nav button styling to the trait stepper controls.
- Standardize the info affordance pattern across left sidenav rows (stat rows, trait header, quest rows): info icon with tooltip first, then the label, then the row content, with the icon visually close to its label.

## Capabilities

### New Capabilities

- `left-sidenav-layout`: visual composition of the left sidenav - section order, the icon-first info affordance pattern, space-filling multi-column list layouts, unlocked trees name tooltips, and shared control styling for the trait stepper.

### Modified Capabilities

- `character-select`: the "Trait display" requirement no longer mandates a selector trait icon; the trait's name and description are provided by the trait section.
- `ui-accessibility`: removes the trait icon keyboard accessibility and accessible name requirements that target the eliminated selector icon.
- `stat-allocation`: the "Stat value includes bonus points" requirement gains a reserved-width marker so stat rows do not shift layout.
- `bonus-points`: the "Stat display aggregation" requirement gains the same reserved-width marker behavior.

## Impact

- `character-selector` component (template, styles, `currentTraitContent` computed, spec focus/blur scenarios).
- `character-panel` template (section order).
- `stat-controls` component (icon-first row layout, reserved bonus marker span, styles).
- `trait-section` component (icon-first header, space-filling bounded slot lists, stepper button styles, spec updates).
- `quests-section` component (icon-label gap normalization only; already icon-first).
- `character-info` component (space-filling tree list, name tooltips, styles, spec updates).
- No changes to build state, services, URL sharing, or AI prompt behavior; purely presentational.
