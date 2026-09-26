## Context

The left sidenav is 260px wide with 14px side padding (232px usable). All its components use Angular's default emulated view encapsulation, so styles are component-scoped: `.left-sidenav__btn` is defined locally in stat-controls.scss and level-controls.scss via the shared `side-nav-btn` mixins from `shared/styles/_components.scss`, and trait-section.scss never defines it, which is why its stepper buttons currently render unstyled. Stat rows use `flex: 1; justify-content: flex-end` for the control cluster, so the conditional `+1` bonus span shifts that cluster only in rows with bonuses. Point-slot-row toggles are 68px minimum width. The trait, quests, and stats sections each position their info icon differently (quests already icon-first).

## Goals / Non-Goals

**Goals:**

- A single, predictable visual grammar for the left sidenav: section order, icon-first affordances, space-filling multi-column lists, uniform button styling.
- Zero layout shift in the stats panel when bonus markers appear or change.
- Remove dead code left by the selector trait icon (template block, SCSS, `currentTraitContent` computed, stale spec scenarios).

**Non-Goals:**

- No changes to build state, services, URL sharing, or AI prompt behavior (purely presentational).
- The footer and right sidenav are out of scope; their icons are standalone action icons, not label affordances.
- No responsive breakpoints; the sidenav is a fixed-width desktop panel.
- The point-slot-row component itself is not modified.
- The trait section intentionally renders no section heading; the trait name label is its identity (user decision), so no heading is added or required.

## Decisions

### D1: Reserved-width bonus marker via always-rendered span

Render the `.left-sidenav__stat-bonus` span in every stat row, always. Give it a fixed `min-width` sized for the widest realistic marker (`+10` at the current font size, ~24px) with left-aligned text so the marker hugs the stat value while the reserved space sits between the marker and the control buttons; when a row has no bonus the span renders empty with `visibility: hidden` (or `:empty` selector). Keep the `+N` text and aria-label only when the bonus count is positive.

Alternatives considered: removing the marker entirely (loses useful information for the player); CSS grid columns for the whole control cluster (more invasive change to the shared stat-controls mixins for the same result); coloring the value gold instead (works but is a weaker signal and complicates the value's semantics when route and bonus mix).

### D2: Icon-first pattern by reordering template elements, not CSS

Move the info icon before the label in stat-controls and trait-section templates (quests already matches), then express the two gaps with a single row-level flex layout: a tight `gap` between icon and label (2px) achieved with a small wrapper or reduced row gap plus a `margin-left: auto` on the content cluster. DOM order and visual order match, so no `order` hacks are needed and screen readers encounter the self-descriptive icon (`aria-label="Show X description"`) before the label naturally.

### D3: Space-filling columns via `display: grid` with auto-fill tracks

Use `grid-template-columns: repeat(auto-fill, minmax(68px, 1fr))` for bounded trait slot lists (`.left-sidenav__trait-rows` when the gain is bounded) and the Character Unlocked Trees list. `auto-fill` uses the full panel width and fits as many equal tracks as the 68px minimum allows, so point-slot toggles keep their minimum and the grid naturally yields three columns in the 232px usable width. `minmax` with `1fr` prevents content blowout; tree names truncate within their track. Reading order stays row-major (slots 1-3, 4-5), which matches slot numbering. Boss-row pairs remain a separate flex row (full-width, two toggles), unchanged.

Alternatives considered: a fixed `repeat(2, ...)` count (wastes width when three columns fit); `flex-wrap` with percentage widths (needs extra basis math and still wraps oddly for min-width content); three fixed columns (correct today but brittle if the panel width ever changes; auto-fill adapts).

### D4: Stepper styling by defining the shared classes locally

Add the same `.left-sidenav__btn` / `--sm` block that stat-controls.scss and level-controls.scss already define (via `side-nav-btn` / `side-nav-btn-sm` mixins from `_components.scss`, already imported) to trait-section.scss. This preserves the project's encapsulation-based styling model rather than extracting the class to a global stylesheet, which would widen the blast radius of future button restyles. The duplication is intentional and already precedented by the two existing definitions.

### D5: Trait icon removal is template + code cleanup, not a feature flag

Delete the `char-selector__trait-icon` block, its SCSS blocks (`&__trait-icon`, `&__trait-icon-letter`), and the now-unreferenced `currentTraitContent` computed in character-selector.ts. Update character-selector.spec.ts to drop the focus/blur scenarios and assert the icon's absence. The dropdown options keep their textual trait name line, which is untouched.

### D6: Tree name tooltips via the enriched tooltip directive

Attach the existing `EnrichedTooltipDirective` to each `.character-info__row` button with a tooltip containing the tree's name (and description when the data provides one), keeping hover and keyboard focus reachability consistent with the other sidenav info affordances. This anticipates a future UI where only tree icons are shown; the name remains reachable without relying on the visible text label.

### D7: Section order places trait immediately after the selector

After further visual verification the order was revised to: selector, trait, level, stats, quests, trees, so the trait block (the character's identity) sits directly under the character selector. The template is reordered in task 6.10 and the spec delta records the confirmed order.

### D8: Stepper lives in the group header, compact sizing

For unbounded gains, the stepper moves from below the boss rows to the group header line, right-aligned next to the label (`margin-left: auto`), so the row of buttons no longer consumes its own vertical slot. Buttons keep the shared `side-nav-btn` language but render below the shared `--sm` dimensions via a local size override in trait-section.scss, since the 24px-wide stat buttons would crowd the 232px header row. The bonus marker gains `line-height: 1` so its glyph centers vertically against the taller stat value.

## Risks / Trade-offs

- [Reserved marker space consumes ~24px in every stat row even without bonuses] -> Accepted: the control cluster is right-aligned so the reservation is invisible; the alignment guarantee it buys applies to all five rows.
- [Multi-column grids change the vertical rhythm of trait sections users have seen] -> Accepted per user decision; bounded lists shrink (5 slots: 5 rows to 2 with three columns) which is the goal.
- [Icon-first placement gives info icons the most visually salient leftmost column] -> Mitigated by the existing muted gray color that only brightens on hover/focus.
- [Removing the selector trait icon drops a tooltip affordance some users may have used] -> Mitigated: the trait section directly below retains the same enriched tooltip with keyboard access.

## Migration Plan

Single-pass presentational change; no data or URL migration. Rollback is a git revert of the component commits. Specs sync on archive: character-select and ui-accessibility requirements are replaced/removed, stat-allocation and bonus-points gain the reserved-marker wording, and the new left-sidenav-layout capability is created.
