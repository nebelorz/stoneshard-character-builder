## Why

The trait/quest bonus-points feature landed with tests that contradict the architecture rules the same work established, and a set of hygiene gaps the earlier cleanup changes missed: dead handlers, duplicate imports, inconsistent module imports, a pass-through wrapper, and per-change-detection recomputation in templates. These let the same class of regression back in, so they should be closed before more work builds on the feature.

## What Changes

- Bring the affected tests into compliance with the existing `architecture` rule that tests assert behavior, not DOM structure: rewrite the structural assertions (element order, reserved span presence, absence of removed markup) to assert state, emitted behavior, or the ARIA contract, and delete assertions whose only purpose is to check removed DOM.
- Replace duplicated literals with single sources of truth where still duplicated (import barrel usage, `isStatKey` usage), and remove pass-through indirection.
- Remove dead code: the unbound `PointSlotRowComponent.onOptionKeydown` handler and the redundant `TraitSectionComponent.hasPointGains` computed.
- Merge duplicate `@shared/services` imports in `AiPromptService`.
- Normalize `BuildStore` imports in the trait/quests components and specs to the feature barrel `@features/build/services`, matching the rest of the character feature.
- Give quest tooltips an honest content kind instead of reusing `kind: 'trait'`.
- Expose derived view values as signals instead of template methods that recompute and allocate new arrays on every change detection (`trait-section`, `stat-controls`, `character-info`).
- Remove the `gain.max!` non-null assertion in `trait-section.html` by passing the already-narrowed gain to the helper.
- Stop using `aria-label` on role-less generic spans as the only accessibility mechanism for bonus and derived-AP indicators; expose the contribution through a supported mechanism.

## Capabilities

### New Capabilities

- None. This change closes hygiene gaps and tightens existing architecture, accessibility, and trait-section behavior, so no new capability is introduced.

### Modified Capabilities

- `ui-accessibility`: adds a requirement that bonus and derived-point indicators expose their meaning to assistive technology through a supported mechanism (visually hidden text or a supporting role), not solely an `aria-label` on a role-less generic element.

The existing `architecture` requirements about behavioral tests and presentation-versus-domain logic are unchanged; the affected tests and view code are being brought into compliance with them, which is implementation work recorded in design and tasks rather than a requirement change.

## Impact

- Components: `trait-section` (html, ts, spec), `quests-section` (ts, spec), `point-slot-row` (ts, spec), `stat-controls` (html, ts, scss, spec), `character-info` (ts, spec), `character-selector` (spec).
- Services: `ai-prompt.service.ts` (imports), `bonus.service.ts` and `url-share.service.ts` (stat-key wrapper), `build-store.ts`/templates (view values).
- Models/tooltip: `tooltip-content.model.ts` and `enriched-tooltip-overlay.ts` (quest content kind).
- Specs: `ui-accessibility`.
- No change to the URL payload, persisted build state shape, bonus formulas, quest data, or AI prompt output.
- Does not modify the in-progress `refine-sidenav-bonus-ui` change; it cleans the tests that change added.
