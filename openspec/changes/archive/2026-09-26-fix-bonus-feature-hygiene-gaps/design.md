## Context

See `proposal.md - Why`. Current state that shapes the approach:

- `openspec/specs/architecture/spec.md` already requires that tests verify behavior and not DOM structure ("Avoid low-value tests"), but the sibling `refine-sidenav-bonus-ui` change added assertions on element order, reserved spans, and the absence of removed markup.
- Shared style mixins live in `src/app/shared/styles/_components.scss`; there is no visually-hidden utility.
- `PointSlotRowComponent.onOptionKeydown` is defined but not bound in its template (the `character-selector` counterpart is bound).
- `AiPromptService` imports from `@shared/services` on two separate lines; the trait/quests components import `BuildStore` from the deep path while most character components use the `@features/build/services` barrel.
- `BonusService.isValidStatKey` is a pass-through to the model `isStatKey`; `quests-section` labels quest tooltip content as `kind: 'trait'`.
- `trait-section`, `stat-controls`, and `character-info` expose template methods that recompute and allocate new arrays/objects on every change detection.

## Goals / Non-Goals

**Goals:**

- Bring the touched tests into line with the existing behavioral-test requirement.
- Remove genuine dead code, duplicated literals/imports, and pass-through indirection.
- Stop per-change-detection recomputation in the three affected templates.
- Give bonus/derived indicators a supported accessibility mechanism.

**Non-Goals:**

- No change to URLs, persisted `BuildState`, bonus formulas, quest data, or AI prompt output.
- No new visual design.
- No test framework or tooling migration.
- No edits inside the in-progress `refine-sidenav-bonus-ui` change folder; only the code/specs it touched.

## Decisions

### D2: Reconcile tests with the existing architecture rule by changing tests, not the rule

Classify the newly added assertions and act per class:

- Behavioral/state (keep): allocation mutates store state, dropdown open/close, option selection emits expected stat, tooltip appears on hover/focus, derived AP shrinks on refund, outside-click focus behavior.
- ARIA/role contract (keep, as the observable accessibility contract): `aria-haspopup`, `aria-expanded`, option roles, `aria-describedby`.
- DOM structure/order/absence (remove or rewrite): `character-selector` "renders no trait affordance" (absence of removed markup) is deleted; `stat-controls` "places the info icon before the stat label" and "renders a reserved bonus marker span in every stat row" are deleted; `quests-section`/`trait-section` "places the info icon before ..." are deleted; `point-slot-row` option-count and `character-info` row-structure assertions are rewritten to behavioral equivalents (e.g. every stat key is selectable and emits that stat; each unlocked tree's tooltip content is reachable).

Alternatives considered: relax the architecture requirement to allow structural assertions (rejected - the rule is the intended agreement and was added deliberately); keep the tests and accept the violation (rejected - leaves the suite contradicting its own spec).

### D3: Accessibility via visually hidden text, not `aria-label` on generic spans

Render the indicator's meaning as visually hidden text (a `visually-hidden` mixin added to `_components.scss`, consumed by `stat-controls.scss` and `trait-section.scss`) alongside the visible `+N`, and drop the `aria-label` from the role-less span. Zero-contribution indicators remain absent. The hidden text is only emitted when the contribution is positive.
Alternatives considered: `role="note"`/`role="text"` (inconsistent assistive-technology support); `aria-label` with a role added to the span (still not reliably exposed and gives the span button-like semantics).

### D4: Expose derived view values as signals

Replace template-invoked methods with `computed` view models:

- `trait-section`: a computed list of gain view models (label, bounded flag, bounded slot indices, boss rows with their slot indices, stepper availability), removing `indexes`, `slotIndices`, `rowCount`, `lastRowIndex`, `bossRowsFor`, `hasPointGains`, and the `gain.max!` assertion from the template.
- `stat-controls`: computed per-stat rows (or a computed map) providing value and bonus count.
- `character-info`: a computed map from tree id to tooltip content.

Reading order and rendered content are preserved. `@for` iterates the computed arrays with existing tracking.
Alternatives considered: keep methods (rejected - they re-run and re-allocate each change detection); move the view shaping into `BuildStore` (rejected - it is presentation shaping, not domain state).

### D5: Mechanical hygiene fixes

- Merge `AiPromptService`'s two `@shared/services` imports into one.
- Import `BuildStore` from `@features/build/services` in `trait-section`/`quests-section` and their specs.
- Delete `PointSlotRowComponent.onOptionKeydown` (unbound).
- Delete `BonusService.isValidStatKey` and call `isStatKey` directly in `url-share.service.ts`.
- Add a `quest` tooltip content kind (`QuestTooltipContent`) and use it in `quests-section`/`tooltip-content.model.ts`/`enriched-tooltip-overlay.ts` instead of `kind: 'trait'`.

## Risks / Trade-offs

- [Sibling change modifies the same specs/tests; archive order can lose content] -> Keep this change's deltas additive (ADDED / a superset MODIFIED of unchanged behavior) and note in the archive step that `refine-bonus-feature-hygiene` and `refine-sidenav-bonus-ui` should be archived first or reconciled.
- [Deleting structural tests reduces apparent coverage] -> The rewritten behavioral and ARIA-contract tests cover the interactions; verified by the suite staying green.
- [View-model refactor could change rendering order] -> Keep list order identical and rely on `trait-section.spec.ts` / `stat-controls.spec.ts` behavioral coverage.
- [Changing indicator markup breaks the sibling tests that assert `aria-label`] -> Update those tests in the same change so assertions match the supported mechanism.

## Migration Plan

Single-pass: (1) rewrite/remove non-compliant tests, (2) accessibility mechanism, (3) view models, (4) mechanical hygiene, (5) run `npm run lint`, `ng build`, and `npm test` green. No data, URL, or persisted-state migration. Rollback is a git revert.

## Open Questions

- None. The accessibility mechanism and test policy are decided above.
