## Why

The trait/quest bonus-points work and its cleanup changes fixed the visible issues but left the architecture only half-converged: `build`, `character`, and `ability-trees` still import each other back and forth, shared display metadata is duplicated, dead and duplicate store members remain, several new specs still assert DOM structure/CSS instead of behavior, and the production build plus test tooling emit warnings. These keep the repository from matching its own architecture and testing specs, so they should be closed before more features build on the state layer.

## What Changes

- **BREAKING** internal-only: introduce a one-way `core/` layer that owns application state and data access, and move `BuildStore`, `LevelStore`, `StatStore`, `AbilityStore`, `BonusService`, `CharacterDataService`, `AbilityDataService`, and `QuestDataService` into it. Features depend on `core`, `models`, and `shared` only; no feature imports another feature. Import paths change; no user-visible behavior changes.
- Remove dead code and duplicate surfaces: delete `BuildStore.slotsForSource` (no callers), collapse the identical `canIncrementStat1`/`canIncrementStat5` and `canDecrementStat1`/`canDecrementStat5` pairs into single predicates, and derive stat display names from the existing `STAT_INFO` instead of a parallel `STAT_NAMES` map.
- Bring the remaining structural specs in line with the testing requirement: rewrite the DOM-structure/CSS-class/attribute assertions in `extras-display`, `stat-controls`, and `quests-section` specs to assert behavior or the ARIA contract, and keep the existing behavioral coverage.
- Make data-load error surfacing consistent: remove the ad-hoc `console.error` effects from `AbilityDataService` and `QuestDataService` so the resource error state is the single reporting source of truth.
- Make the production build warning-free: reduce cheap bundle cost (icons/lazy loading) and set the `angular.json` initial budget to a value the application actually meets.
- Type-check the test setup file by adding `src/test-setup.ts` to the TypeScript program so `ng test` no longer warns that it is excluded from compilation.
- Land the three pending hygiene changes first (`refine-bonus-feature-hygiene`, `fix-bonus-feature-hygiene-gaps`, `refine-sidenav-bonus-ui`) and correct the `6.10` task-numbering gap in `refine-sidenav-bonus-ui`; this change is scoped to what remains after they are committed/archived.

## Capabilities

### New Capabilities

- `build-performance`: the production build stays within its configured bundle budgets with no warnings.

### Modified Capabilities

- `architecture`: replaces the informal dependency guidance with a strict one-way feature layering (`core`/`models`/`shared` inward, no feature-to-feature imports), adds a single-source-of-truth rule for shared display metadata, and tightens the presentation-vs-domain and low-value-test requirements.
- `data-layer`: brings `quests.json` under the single-fetch and load-validation requirements, alongside characters, trees, and abilities.
- `error-handling`: requires data-service load failures to surface through the shared error/data-layer state rather than direct console logging.

## Impact

- New `core/` layer: `core/state/` (`BuildStore`, `LevelStore`, `StatStore`, `AbilityStore`, `BonusService`) and `core/data/` (`CharacterDataService`, `AbilityDataService`, `QuestDataService`); new `@core/*` path aliases.
- Services/stores: `build-store.ts`, `level-store.ts`, `stat-store.ts`, `ability-store.ts`, `bonus.service.ts`, three data services; `ai-prompt.service.ts`, `url-share.service.ts`.
- Components updating imports: all of `features/build`, `features/character`, `features/ability-trees`, and `layout`.
- Specs: all specs importing `@features/*/services`, plus `extras-display.spec.ts`, `stat-controls.spec.ts`, `quests-section.spec.ts`.
- Config: `angular.json` (budgets), `tsconfig.json`/`tsconfig.spec.json` (test setup), `tsconfig` path aliases.
- No change to `BuildState` shape, URL payload, AI prompt output, bonus formulas, or quest data.
