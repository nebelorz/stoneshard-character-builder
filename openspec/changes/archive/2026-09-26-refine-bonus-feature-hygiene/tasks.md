## 1. Decouple ability-trees from build

- [x] 1.1 Extract the pure bonus computations (`derivedAp`, `derivedFloor`, slot math) from `BonusService` into a pure domain module alongside the other model helpers, with no Angular or feature imports; verify `bonus.service.spec.ts` formula cases still pass
- [x] 1.2 Change `AbilityStore.applyObtainAbility` to receive the already-computed derived AP budget instead of injecting `BonusService`; verify `ability-store.spec.ts` passes with the new signature
- [x] 1.3 Update `BuildStore.obtainAbility` to pass its `derivedTraitAp` value; verify `build-store.spec.ts` passes and `ability-store.ts` no longer imports anything from `@features/build`

## 2. Move bonus services to the shared layer

- [x] 2.1 Move `BonusService` and `QuestDataService` into `shared/services` and export them from the shared barrel; verify the files exist at the new path and `ng build` succeeds
- [x] 2.2 Update all consumers and specs (`build`, `character`, `ability-trees`) to import from `@shared/services`; verify no file imports `features/build/services/bonus.service` or `quest-data.service` (grep) and `ng build` succeeds

## 3. Single source of truth for constants and key lists

- [x] 3.1 Export one ability-point budget constant and consume it in both `BuildStore` and `stat-controls`; verify no hardcoded `31` remains in stat-controls (grep) and `stat-controls.spec.ts` passes
- [x] 3.2 Reuse the exported `STAT_KEYS` list for stat-key validation instead of the duplicated literal chain; verify `bonus.service.spec.ts` and `url-share.service.spec.ts` pass
- [x] 3.3 Derive the unbounded slot ceiling from the exported row/points constants and expose a can-add-row predicate; consume it in `trait-section` (remove the hardcoded `20`); verify `bonus.service.spec.ts` and `trait-section.spec.ts` pass

## 4. Remove dead code

- [x] 4.1 Delete `BuildStore.allocateBoulderCircle`, `deallocateBoulderCircle`, and `canAllocateBoulderCircle`; verify grep finds no remaining references and `build-store.spec.ts` is updated to drop the dead-only cases
- [x] 4.2 Delete `BonusService.sourceExists`, `TraitSectionComponent.apGains` and `hasGains`, the unused `BossRow.slots` field, and the unused `#toggleBtn` / `#optionEl` template refs; verify `npm run lint` and `ng build` succeed with no unused-symbol warnings

## 5. Presentational templates

- [x] 5.1 Expose row count, last-row index, and per-row slot indices from `TraitSectionComponent`, iterate `pointsPer` slots in `trait-section.html`, and remove all inline index arithmetic; verify `trait-section.spec.ts` passes and the template contains no multiplication or subtraction expressions

## 6. Point-slot dropdown focus fix

- [x] 6.1 Update `PointSlotRowComponent.onDocumentClick` to close only when open and to not force focus to the toggle; verify a new `point-slot-row.spec.ts` scenario asserts focus stays on the clicked element when closed

## 7. Replace vacuous and dead tests

- [x] 7.1 Delete the computed-style/grid, bounding-box offset, and `--progress-width` assertions in `stat-controls.spec.ts` and `character-info.spec.ts`, and the removed-DOM-only assertions; verify the deleted tests no longer exist (grep) and `npm test` passes
- [x] 7.2 Add behavioral coverage for the same features: allocation/deallocation mutates `BuildStore` state, derived AP shrinks on refund, and the outside-click focus behavior; verify the new tests fail against the pre-fix code paths and pass afterward

## 8. Guards, docs, and verification

- [x] 8.1 Move `isTraitGainSp` / `isTraitGainAp` from `character.model.ts` to `data-guards.ts`; verify `data-guards.spec.ts` passes and the model file no longer exports runtime guards
- [x] 8.2 Update the README developer/architecture section to mention `BonusService`, `QuestDataService`, and the quest data file; verify the described structure matches the source tree
- [x] 8.3 Run `npm run lint`, `ng build`, and the full `npm test` suite; resolve every error and warning introduced by this change (pre-existing bundle-budget warning excluded)
