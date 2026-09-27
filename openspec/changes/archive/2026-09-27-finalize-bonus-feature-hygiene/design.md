## Context

See `proposal.md` - Why. The current import graph has `build`, `character`, and `ability-trees` importing each other's services in both directions (23 + 17 + 21 cross-feature service imports), the state layer is split across features and `shared`, `models/index.ts` uses wildcard re-exports, and several specs assert DOM structure. `ng build` warns on the 500 kB initial budget (554 kB measured) and `ng test` warns that `src/test-setup.ts` is outside the TypeScript program.

Path aliases are duplicated across `tsconfig.app.json`, `tsconfig.spec.json`, and `vitest.config.ts`; `tsconfig.spec.json` also carries a stale `@features/ability/services` alias that does not match the `ability-trees` folder.

## Goals / Non-Goals

**Goals:**

- Make the dependency direction one-way and enforceable: features/layout to `core` to `models`/`shared`.
- Remove the dead and duplicated surfaces found in review.
- Bring the remaining structural specs into line with the testing requirement.
- Leave `ng build` and `ng test` warning-free.

**Non-Goals:**

- No change to `BuildState` shape, URL payload, AI prompt output, bonus formulas, or data files.
- No new user-facing features (quest-load failures stay non-blocking; no new toast).
- No RxJS/state-library introduction; signals and the existing store pattern stay.
- Not archiving the three pending changes; this design assumes they land first.

## Decisions

### D1 - Introduce a `core` layer instead of DI indirection

Create `src/app/core/` with `core/data/` and `core/state/`. Move the state and data singleton services there so every cycle is broken by relocation, not by tokens.

- `core/state/`: `BuildStore`, `LevelStore`, `StatStore`, `AbilityStore`, `BonusService`
- `core/data/`: `CharacterDataService`, `AbilityDataService`, `QuestDataService`
- `shared/services/`: `AbilityHoverService` (cross-cutting UI hover state used by `build` and `ability-trees`)

Alternatives considered: (a) DI tokens/ports in `shared` with feature-provided implementations - indirect, more code, harder to trace; (b) keep services in features and only forbid component-to-component imports - leaves the `build` <-> `character`/`ability-trees` service cycle; (c) move `BuildStore` into `shared` - violates the existing shared-layer strategy because it is application state, not a cross-cutting UI concern. `core` is the conventional singleton home and keeps `shared` for UI/cross-cutting services.

`AbilityHoverService` moves to `shared/services` because both `build` and `ability-trees` need it and feature-to-feature imports are forbidden. `AiPromptService` and `UrlShareService` stay in `features/build/services` (feature orchestration) and consume `@core/*`.

### D2 - Imports inside `core` are relative; consumers use barrels

Files within `core` import siblings with relative paths (`./level-store`); external code imports `@core/state` and `@core/data`. This avoids barrel self-cycles while keeping feature imports stable. Add `@core/*` aliases to `tsconfig.app.json`, `tsconfig.spec.json`, and `vitest.config.ts`, and delete the stale `@features/ability/services` alias.

### D3 - Delete dead code and duplicate predicates

- Delete `BuildStore.slotsForSource`; the two components already call `BonusService.slotsForSource` directly.
- Collapse `canIncrementStat1`/`canIncrementStat5` and `canDecrementStat1`/`canDecrementStat5` into `canIncrementStat`/`canDecrementStat`. The +5/-5 buttons are gated by the same predicate as +1/-1 because the batch operation clamps to available SP and the stat cap.
- Remove `STAT_NAMES` from `stat-controls.ts` and read `STAT_INFO[stat].name` (the existing domain metadata), satisfying the presentation-metadata requirement.

### D4 - Specs assert behavior, not structure

Rewrite the structural assertions in `extras-display.spec.ts` (header text/class, `tooltiptext` attribute), `stat-controls.spec.ts` (icon count, glyph wrapper checks), and `quests-section.spec.ts` (icon affordance presence) to assert state changes, emitted outputs, or the ARIA contract. Keep the existing behavioral coverage (allocation/deallocation, tooltip focus/hover wiring).

### D5 - Data services stop logging directly

Remove the `logError` effects from `AbilityDataService` and `QuestDataService`; the `httpResource` error signal remains the single reporting source. The root component already aggregates characters/trees/abilities into the blocking error UI; quests stay out of that aggregation so a quest-data failure cannot block startup.

### D6 - Warning-free build and test

- Audit with `ng build --stats-json` (or `source-map-explorer`), apply cheap wins (confirm per-icon imports, drop unused icon packs, defer non-critical right-sidenav content), then set `initial.maximumWarning` to the measured size plus a small headroom and keep `maximumError` at `1MB` so real regressions still fail.
- Add `src/test-setup.ts` to `tsconfig.spec.json` `include` so it is type-checked and the warning disappears.

### D7 - Land the pending changes first

Apply this change after `refine-bonus-feature-hygiene`, `fix-bonus-feature-hygiene-gaps`, and `refine-sidenav-bonus-ui` are committed/archived, and fix the `6.10` task-numbering gap in `refine-sidenav-bonus-ui` while landing it. This change is the residual hygiene pass on that merged baseline.

## Risks / Trade-offs

- [Large mechanical refactor (dozens of import updates) can miss a reference] -> Do the move in one atomic step, replace imports by exact `@features/...services` match, and gate on `npm run lint`, `ng build`, and the full `npm test` suite.
- [Barrel-internal cycles inside `core`] -> Import rule D2 (relative within `core`) plus a check that `ng build` reports no circular-dependency warning.
- [Raising the bundle budget could hide regressions] -> Set `maximumWarning` close to the measured size and keep `maximumError` at `1MB`; record the measured baseline in the change.
- [Path aliases drift across three config files] -> Update all three in the same task and grep for the old alias.
- [Removing console logging reduces diagnostics] -> The resource error state remains observable and the configured `ErrorHandler` still reports unexpected exceptions.

## Migration Plan

1. Land and archive the three pending changes; fix the task-numbering gap.
2. Add the `core` layer, move files, update aliases and imports, remove old barrels.
3. Delete dead/duplicate members and deduplicate stat metadata.
4. Rewrite the affected specs and remove ad-hoc console logging.
5. Adjust budgets and `tsconfig.spec.json`; verify `ng build`, `ng test`, `npm run lint`.

Rollback: the work is isolated to import structure and internal cleanup with no persisted state change; reverting the commits restores the previous layout. The bundle budget change is a single config value.
