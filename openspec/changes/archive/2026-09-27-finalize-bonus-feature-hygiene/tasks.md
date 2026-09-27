## 1. Prerequisites and baseline

- [x] 1.1 Confirm `refine-bonus-feature-hygiene`, `fix-bonus-feature-hygiene-gaps`, and `refine-sidenav-bonus-ui` are committed and archived; verify `openspec list --json` shows no in-progress prior hygiene change
- [x] 1.2 Fix the `6.10` numbering gap in `refine-sidenav-bonus-ui/tasks.md` (section 6 has no 6.9) before archiving; verify the numbers are sequential
- [x] 1.3 Capture the baseline: run `ng build` and record the initial bundle size and the current budget warning; store the number for task 9.3
- [x] 1.4 Run `npm run lint` and `npm test` to confirm a green baseline before moving code

## 2. Core layer scaffolding and path aliases

- [x] 2.1 Create `src/app/core/state/` and `src/app/core/data/` with barrel `index.ts` files; verify both directories and barrels exist
- [x] 2.2 Add the `@core/*` alias mapping to `app/core/*` in `tsconfig.app.json`, `tsconfig.spec.json`, and `vitest.config.ts`; verify all three configs contain the alias
- [x] 2.3 Remove the stale `@features/ability/services` alias from `tsconfig.spec.json` (it does not match the `ability-trees` folder); verify no config references it

## 3. Move state services into `core/state`

- [x] 3.1 Move `build-store.ts` and `build-store.spec.ts` from `features/build/services` to `core/state`; verify the new files exist and the old paths are gone
- [x] 3.2 Move `level-store.ts`, `level-store.spec.ts`, `stat-store.ts`, and `stat-store.spec.ts` from `features/character/services` to `core/state`; verify old paths are gone
- [x] 3.3 Move `ability-store.ts` and `ability-store.spec.ts` from `features/ability-trees/services` to `core/state`; verify old paths are gone
- [x] 3.4 Move `bonus.service.ts` and `bonus.service.spec.ts` from `shared/services` to `core/state`; verify old paths are gone
- [x] 3.5 Export the moved stores and `BonusService` from `core/state/index.ts`, using relative imports between files inside `core`; verify `npm run lint` reports no unresolved-internal-cycle issue

## 4. Move data services into `core/data`

- [x] 4.1 Move `character-data.service.ts` from `features/character/services` to `core/data`; verify old path is gone
- [x] 4.2 Move `ability-data.service.ts` from `features/ability-trees/services` to `core/data`; verify old path is gone
- [x] 4.3 Move `quest-data.service.ts` from `shared/services` to `core/data`; verify old path is gone
- [x] 4.4 Export the three data services from `core/data/index.ts`; verify the barrel resolves all three
- [x] 4.5 Remove `bonus.service` and `quest-data.service` exports from `shared/services/index.ts`; verify `shared/services` only exports toast, popup, and error handler

## 5. Update consumers and feature barrels

- [x] 5.1 Replace every `@features/build/services` import of `BuildStore` with `@core/state` (23 occurrences at baseline); verify grep finds no `BuildStore` imported from a feature path
- [x] 5.2 Replace `CharacterDataService`, `LevelStore`, and `StatStore` imports with `@core/data` / `@core/state`; verify grep finds no remaining `@features/character/services`
- [x] 5.3 Replace `AbilityDataService` and `AbilityStore` imports with `@core/*`, moving `AbilityHoverService` to `@shared/services` so no feature imports another feature; verify no feature imports another feature's state or data service
- [x] 5.4 Delete the now-empty `features/character/services` and `features/ability-trees/services` directories and trim `features/build/services/index.ts`; verify the remaining services barrels export only feature-local members
- [x] 5.5 Update `app.ts` and `app.spec.ts` imports to `@core/*`; verify `ng build` resolves the root component
- [x] 5.6 Verify the layering rule: grep that no file under `features/**` or `layout/**` imports another feature, and `ng build` succeeds

## 6. Remove dead code and duplicate surfaces

- [x] 6.1 Delete `BuildStore.slotsForSource`; verify grep finds no reference and `ng build` succeeds
- [x] 6.2 Collapse `canIncrementStat1`/`canIncrementStat5` into `canIncrementStat` and `canDecrementStat1`/`canDecrementStat5` into `canDecrementStat`; update `stat-controls.ts` call sites; verify grep finds no `canIncrementStat1`/`canDecrementStat5` and the spec passes
- [x] 6.3 Remove the local `STAT_NAMES` map from `stat-controls.ts` and read `STAT_INFO[stat].name`; verify `stat-controls.spec.ts` still asserts the accessible names

## 7. Bring specs in line with behavioral testing

- [x] 7.1 Rewrite the structural assertions in `extras-display.spec.ts` (title text/class, `tooltiptext` attribute) to assert emitted output or the ARIA contract; verify the file passes
- [x] 7.2 Rewrite the structural assertions in `stat-controls.spec.ts` (icon count, glyph wrapper) to assert behavior or the ARIA contract; verify the file passes
- [x] 7.3 Rewrite the structural assertion in `quests-section.spec.ts` (icon affordance presence) to assert behavior or the ARIA contract; verify the file passes
- [x] 7.4 Update every spec for the new `@core/*` import paths and run the full `npm test` suite; verify all specs pass

## 8. Consistent data error reporting

- [x] 8.1 Remove the `console.error` load-error effect from `AbilityDataService`; verify a test asserts the resource error state is populated (or add one)
- [x] 8.2 Remove the `console.error` load-error effect from `QuestDataService`; verify the resource error state remains the reporting source
- [x] 8.3 Verify grep finds no `console.error`/`console.warn` inside `core/data` services

## 9. Warning-free build and test tooling

- [x] 9.1 Add `src/test-setup.ts` to the `include` array of `tsconfig.spec.json`; verify `ng test` no longer emits the "not found in TypeScript compilation" warning
- [x] 9.2 Audit the production bundle (`ng build --stats-json`) and apply cheap reductions (per-icon imports, unused icon packs, deferred non-critical content); record before/after bundle sizes
- [x] 9.3 Set `initial.maximumWarning` in `angular.json` to the measured size plus a small headroom, keeping `maximumError` at `1MB`; verify `ng build` emits no budget warning

## 10. Verification

- [x] 10.1 Run `npm run lint`, `ng build`, and the full `npm test` suite; verify all pass with no new warnings
- [x] 10.2 Grep for the removed import paths and aliases (`@features/build/services` for `BuildStore`, `@features/character/services`, `@features/ability-trees/services` state/data, `@features/ability/services`); verify none remain
- [x] 10.3 Update the README architecture section to describe the `core` layer and the one-way dependency direction; verify the described structure matches the source tree
