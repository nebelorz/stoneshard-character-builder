## Context

The right sidenav has two sections: Extras and Route. Extras currently uses a native `<select>` for Boulder Circle stat selection, which lacks the visual polish of Route's colored stat chips. Route has a collapsible header that is rarely useful since it contains the primary build information. The stat chip color styles are currently defined only in route-display.scss, limiting reuse.

## Goals / Non-Goals

**Goals:**

- Replace native `<select>` with a custom dropdown that renders colored stat chips
- Add contextual tooltip explaining Boulder Circle via a Phosphor question icon
- Remove collapsible behavior from Route to simplify the sidenav
- Extract stat chip styles to a shared location for reuse across components

**Non-Goals:**

- No animation on the custom dropdown (keep it instant)
- No changes to the Boulder Circle data model or store logic
- No changes to how Route computes or displays level data
- No new shared Angular components (keep dropdown logic inline in extras-display)

## Decisions

### Custom dropdown inline in ExtrasDisplayComponent

**Decision**: Build the dropdown logic directly in extras-display rather than creating a reusable `StatSelectComponent`.

**Rationale**: The dropdown is currently only used in one place. Creating a separate component adds indirection without clear benefit. If stat selection appears elsewhere in the future, the component can be extracted then (YAGNI).

**Alternatives considered**:

- New `StatSelectComponent` in shared/: Reusable but premature for one use case.
- New `BoulderCircleComponent`: Over-encapsulates a single row of UI.

### Stat chip styles in shared SCSS partial

**Decision**: Move the stat chip color classes (`--str`, `--agi`, `--per`, `--vit`, `--wil`) from route-display.scss to a shared location. Both route-display and extras-display will reference the same classes.

**Rationale**: Stat colors are a design-system concern, not route-specific. Sharing avoids duplication and ensures consistency.

**Alternatives considered**:

- Duplicate styles in extras-display.scss: Simpler but violates DRY for a visual contract.
- CSS custom properties for stat colors: More flexible but adds complexity beyond current needs.

### Dropdown behavior: click-to-toggle, outside-click-close

**Decision**: The dropdown button toggles open/close. Clicking outside closes it. No animation. Clicking the same stat is a no-op (closes without state change).

**Rationale**: Simple, predictable behavior. No animation keeps it instant and avoids layout thrashing. The "-" placeholder provides explicit deselection.

### Tooltip placement: left

**Decision**: Position the `phosphorQuestion` tooltip to the left using `tooltipPlacement="left"`.

**Rationale**: The icon sits on the left side of the "Boulder Circle" label. A tooltip to the left stays within the sidenav bounds and avoids overlapping the dropdown button on the right.

## Risks / Trade-offs

- **[Risk]** Dropdown may overlap other sidenav content when open. **[Mitigation]** Position it below the button with sufficient z-index; the sidenav has limited vertical content so overflow is unlikely.
- **[Risk]** Removing Route collapsible loses user ability to hide Route. **[Mitigation]** Route is the primary sidenav content; hiding it has low utility. If needed later, the toggle can be restored.
- **[Trade-off]** Inline dropdown logic means no reuse if stat selection appears elsewhere. **[Acceptable]** YAGNI principle; extract when reuse is actually needed.

## Migration Plan

No deployment migration needed. Changes are purely UI-internal with no data model, API, or dependency changes. Rollback is a simple revert of the affected component files.
