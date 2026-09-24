## Context

Three tooltip mechanisms coexist today. The simple `appTooltip` directive (`shared/directives/tooltip/tooltip.ts`) renders a plain text chip via CDK Overlay and covers short micro-copies. `ability-icon` hand-rolls a rich tooltip (appended to body, cursor-following, viewport-edge flipping). `character-selector` imperatively opens a CDK Overlay + TemplatePortal for trait display, driven by signals and manual overlay lifecycle. The `character-select` spec requires the trait icon to be keyboard accessible (focus shows the bubble, blur hides it). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- One shared, model-driven enriched tooltip for structured content.
- Migrate `character-selector`'s trait display onto it, retiring the imperative overlay wiring.
- Keyboard access (focus/blur/Escape) on the enriched tooltip, satisfying the trait-icon accessibility requirement.
- A content model shaped so `ability` and `stat` kinds slot in from their own changes without reworking the mechanism.

**Non-Goals:**

- Cursor-follow positioning (reserved as a positioning mode; only anchored is implemented until the ability migration has a consumer).
- Migrating the `ability-icon` tooltip.
- Changing the simple `appTooltip` directive or any of its call sites.

## Decisions

**1. Content model is an open discriminated union in shared.**
`shared/directives/tooltip/tooltip-content.model.ts` defines `TooltipContent` as a discriminated union keyed on `kind`. This change ships `TraitTooltipContent = { kind: 'trait'; name: string; description: string }`. The `stat-description-tooltips` change adds a `stat` kind; a future change adds `ability`. The union is the contract between content producers and the renderer.

- Alternatives rejected: TemplateRef-per-consumer (keeps the current ad-hoc wiring with no shared contract); a single generic "title + body" model (too weak for ability's structured sections).

**2. Enriched tooltip is a directive + a portal overlay component.**
`appEnrichedTooltip` (input `content: TooltipContent | null`, `tooltipPlacement`) opens a CDK Overlay hosting `EnrichedTooltipOverlayComponent` via `ComponentPortal`, mirroring the `appTooltip` architecture. The overlay component renders with `@switch (content().kind)`, one section per kind. Host handlers: `mouseenter`/`mouseleave` (200ms delay, matching the existing chip), `focus`/`blur`, `keydown.escape`, and `aria-describedby` association. Null/empty content short-circuits (no overlay).

- Alternatives rejected: extending `appTooltip` itself with a content input (mixes the simple text path and the rich path in one directive; the two logics the product wants are clearer as two directives).

**3. Positioning reuses the flexible-connected pattern with a mode input.**
Same `flexibleConnectedTo` + position fallback list as `appTooltip`, with a preferred placement input and automatic flipping. All placements leave an 8px gap (positive offsets on the tooltip side), so the tooltip never overlaps its trigger; the position list is ordered `[top, bottom, left, right]` to match `PLACEMENT_ORDER`. The overlay pane gets a panel class and `pointer-events: none`, so a tooltip can never intercept the pointer and cause its trigger to lose hover (the tooltip content is already non-interactive). A `tooltipPositioning` input is declared defaulting to `anchor`; `cursor` is documented in the type but not implemented until the ability migration needs it.

- Alternatives rejected: implementing cursor-follow now (speculative, no consumer); ignoring the mode entirely (locks the API and forces a breaking change later); overlapping the trigger by an offset (the CDK overlay pane is interactive by default, so an overlapping tooltip steals the trigger's hover and makes the tooltip flicker).

**4. Trait migration replaces imperative code with per-host directives.**
The trait icon gets `appEnrichedTooltip` with the current character's trait content; each dropdown option row gets the same directive with that character's trait content. This deletes the `traitBubbleEffect`/`traitTooltipEffect`, `showTraitBubble`/`hideTraitBubble`/`showTraitTooltip`/`hideTraitTooltip`, and both trait templates. Keyboard access moves into the directive (satisfying the `character-select` focus/blur requirement).

- Consideration: the bubble (compact) and dropdown tooltip (name + description) currently have separate styles; the enriched tooltip unifies them on one style surface (fantasy name header + ui description body). This is an accepted visual unification.

**5. Styling lives in `enriched-tooltip-overlay.scss`.**
Reuses existing theme tokens (`$bg-panel`, `$text-primary`, `$radius-sm`, `$shadow-tooltip`) with a max width around 280px, a `font-fantasy` title and `font-ui` body, so it reads consistently with the app theme while supporting wrapped multi-line content (natural block flow, no `white-space: nowrap`).

## Risks / Trade-offs

- [Trait bubble keyboard behavior must survive the migration] -> The directive implements focus/blur; tests drive real focus/blur events on the trait icon.
- [Unifying the two trait tooltip styles changes visuals slightly] -> Accepted; verified visually against the old styles during implementation.
- [Nested overlays: dropdown option tooltip renders inside the dropdown overlay] -> The directive uses the global `Overlay` (attaches to body, no backdrop), so it floats above the dropdown; tests verify hover does not dismiss the dropdown.
- [The open union tempts premature abstraction] -> Only `trait` ships here; `stat` and `ability` are added by their own changes, exercising the union against real consumers.

## Migration Plan

Additive first: new shared files + tests. Then swap `character-selector` to the directive and delete the imperative trait tooltip code. The simple `appTooltip` and `ability-icon` tooltip are untouched, so rollback is a revert of the character-selector swap. No data migration.
