## Why

The trait/quest bonus-points work landed with leftover dead code, a dropdown that steals focus on any outside click, duplicated constants and type-key lists, cross-feature coupling between the `build` and `ability-trees` features, domain index math living in templates, and several tests that assert CSS/layout or deleted DOM instead of behavior. These make the feature harder to change safely and let regressions pass, so they should be cleaned up before the next feature builds on top of them.

## What Changes

- Remove dead public surfaces: `BuildStore.allocateBoulderCircle` / `deallocateBoulderCircle` / `canAllocateBoulderCircle`, `BonusService.sourceExists`, `TraitSectionComponent.apGains` / `hasGains`, the unused `BossRow.slots` field, and the unused `#toggleBtn` / `#optionEl` template references in `point-slot-row`.
- Fix the `PointSlotRowComponent` outside-click handler so it only refocuses the toggle when a dropdown was actually open, instead of stealing focus on every document click.
- Remove domain logic from `trait-section.html`: stop computing row counts and slot indices inline; expose them from the component so templates stay presentational.
- Relocate the cross-feature bonus domain logic so `build`, `character`, and `ability-trees` depend on a shared/domain module instead of importing each other's services, breaking the `ability-trees` <-> `build` dependency cycle. **BREAKING** internal-only: import paths for `BonusService` change; no public behavior change.
- Replace duplicated literals with single sources of truth: share the AP budget constant used by the stats progress bar, reuse `STAT_KEYS` for stat-key validation, and derive the unbounded slot ceiling from the exported bonus constants instead of hardcoding `20`.
- Render unbounded/trait point slots data-driven from `pointsPer` instead of hardcoding exactly two slot rows.
- Normalize service imports to the feature barrel where one exists.
- Replace vacuous tests (computed-style/grid and `getBoundingClientRect` geometry assertions that always pass in jsdom) and dead-code tests with behavior-focused coverage; update component specs affected by the above.
- Update the README developer/architecture notes to reflect `BonusService`, `QuestDataService`, and the quest data file.

## Capabilities

### New Capabilities

- None. This change tightens existing architecture and accessibility requirements, so no new capability is introduced.

### Modified Capabilities

- `architecture`: adds requirements for feature dependency direction (no bidirectional feature imports; cross-feature domain logic lives in a shared/domain home), a single source of truth for shared constants and key lists, presentation-only templates, and behavioral (not layout/DOM) test assertions.
- `ui-accessibility`: the point-slot dropdown requirement gains the behavior that an outside click must not move focus while the dropdown is already closed, and must only return focus to the toggle when it was open.

## Impact

- Services: `features/build/services/bonus.service.ts`, `quest-data.service.ts`, `build-store.ts`; `features/ability-trees/services/ability-store.ts`; new shared/domain location for bonus logic.
- Components: `point-slot-row`, `trait-section`, `quests-section`, `stat-controls`, `extras-display`.
- Models: `character.model.ts` / `data-guards.ts` guard placement, `quest.model.ts`.
- Specs: architecture, ui-accessibility.
- Docs: `README.md` developer/architecture section.
- No data files, URL format, AI prompt output, or user-visible behavior change beyond the dropdown focus fix.
