## Why

The left-sidenav stat row shows only bare abbreviations (STR, AGI, PER, VIT, WIL), so nothing in the app explains what a stat does. The captured `enriched-tooltip-system` change provides a shared, model-driven rich tooltip. This change adds a `stat` content model to it and wires an info icon per stat, making each stat's description one hover away without inventing any new tooltip mechanism.

## What Changes

- Add a `stat` kind to the enriched tooltip content union with a structured model: stat name, intro description, per-point effects, milestone-tier effects (15/20/25/30), and cap line.
- Populate that model for STR, AGI, PER, VIT, WIL from the five user-supplied descriptions.
- Show an info icon (`phosphorInfo`) next to each stat label; hovering it reveals the stat's description in the enriched tooltip.
- Make the info icon focusable so the enriched tooltip's keyboard access covers it.
- Reuse the enriched tooltip primitive from `enriched-tooltip-system`; no new tooltip abstraction.

## Capabilities

### New Capabilities

- `stat-description-tooltip`: The stat rows in the left sidenav show an info icon per stat; hovering or focusing it reveals the stat's full description (intro, per-point effects, milestone tiers, cap) via the enriched tooltip.

### Modified Capabilities

- None. The previously proposed `ui-popover-tooltip` multiline delta is superseded: stat descriptions render through the enriched tooltip (natural block flow, wrapping included), so the simple text chip needs no change.

## Impact

- Code: new `src/app/models/stat-info.model.ts` (+ export from `models/index.ts`) holding `STAT_INFO: Record<StatKey, StatTooltipContent>`; the `stat` kind added to `shared/directives/tooltip/tooltip-content.model.ts` and its overlay renderer (shared files introduced by `enriched-tooltip-system`); `src/app/features/character/components/stat-controls/stat-controls.{ts,html,scss}`; new `stat-controls.spec.ts`.
- Depends on `enriched-tooltip-system` landing first, since the `stat` kind extends its content union and overlay component.
- Stat allocation behavior, stat history, and the data-layer JSON pipeline are untouched.
- Description content is final: the five texts provided by the user are inserted verbatim into the stat content data.
