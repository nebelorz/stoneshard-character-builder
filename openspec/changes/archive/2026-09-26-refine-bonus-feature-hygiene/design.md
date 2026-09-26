## Context

See `proposal.md - Why`. Relevant current state that shapes the approach:

- `BonusService` lives in `features/build/services` but is imported by `features/character` components (`trait-section`, `quests-section`) and by `features/ability-trees/services/ability-store`. `BuildStore` imports `AbilityStore` from `features/ability-trees`, so `ability-trees` and `build` import each other (a cycle).
- `QuestDataService` is only consumed by `BonusService` and `BuildStore`, both in `build`.
- `ABILITY budget` (`31`) is defined privately as `INITIAL_AP` in `build-store.ts` and duplicated as a literal in `stat-controls.ts`.
- `BonusService` exposes several members that nothing calls, plus `trait-section` exposes two computed properties that nothing reads.
- `trait-section.html` computes row counts and `rowIndex * pointsPer` slot indices inline and hardcodes a two-slot boss row.
- `PointSlotRowComponent.onDocumentClick` calls `closeDropdown()` unconditionally, which focuses the toggle even when the dropdown is closed.
- Several tests assert `getComputedStyle`/`getBoundingClientRect` values that are constants in jsdom, or assert the absence of removed DOM.

## Goals / Non-Goals

**Goals:**

- Break the `ability-trees` <-> `build` cycle and give cross-feature bonus logic one shared home.
- One definition each for the AP budget, bonus ceilings, and stat-key list.
- Remove dead members and dead-only tests.
- Make `point-slot-row` stop moving focus on unrelated document clicks.
- Make trait/quest templates presentational.
- Make the affected tests assert behavior.

**Non-Goals:**

- No change to the URL payload, AI prompt output, quest data shape, or persisted build state.
- No new visual design or layout behavior; this is not a UI refresh.
- No test framework migration (Vitest stays).
- No change to the existing `left-sidenav-layout` work in the sibling change.

## Decisions

### D1: Split pure bonus domain logic from the injectable service

Extract the pure computations (`derivedAp`, `derivedFloor`, and the slot math) into a pure domain module that has no Angular or feature dependencies and lives with the other pure domain helpers under `@models` (alongside `requirement.model.ts`). `BonusService` becomes a thin injectable that owns quest data access and delegates to those functions.

`AbilityStore.applyObtainAbility` stops injecting `BonusService`; `BuildStore` passes the already-computed derived AP budget as an argument (it already exposes `derivedTraitAp`). This removes `ability-trees -> build` entirely because the formulas are pure and locally importable.

Alternatives considered: an abstract injection token provided by `build` and injected by `ability-trees` (adds indirection for one value); keeping the formulas in the service and passing the service (retains the cycle).

### D2: Move `BonusService` and `QuestDataService` to `shared/services`

`BonusService` is used by 3 features (`build`, `character`, `ability-trees`) and `QuestDataService` only by bonus code, so both belong in the shared layer per the architecture spec. They move to `shared/services` and are exported through its barrel; `build`, `character`, and `ability-trees` import via `@shared/services`. `shared` depends only on `@models`, so the graph stays acyclic: `models <- shared <- features`.

Alternatives considered: keep them in `build` and route every character access through `BuildStore` (turns `BuildStore` into a god object and makes independent `BonusService` tests impossible); place them in a new top-level `domain/` folder (a new architectural layer for two services, inconsistent with the existing `shared/services` convention).

### D3: Single sources of truth for constants and key lists

- Move the ability-point budget (`31`) to one exported constant consumed by both `BuildStore` and `stat-controls`.
- Reuse the exported `STAT_KEYS` list for stat-key validation instead of a parallel `isValidStatKey` literal chain.
- Derive the unbounded slot ceiling from the exported row/points constants (`max rows * pointsPer`) and expose a `canAddBossRow`-style predicate consumed by `trait-section`, replacing the hardcoded `20`.

Alternatives considered: leave `UNBOUNDED_SOURCE_CEILING` and `UNBOUNDED_SOURCE_MAX_ROWS` as two independent constants (they can silently diverge).

### D4: Presentational templates

`TraitSectionComponent` exposes the derived values the template needs (row count, last row index, the indices for a boss row given `pointsPer`). `trait-section.html` iterates `pointsPer` slots instead of hardcoding two, and no longer performs arithmetic.

Alternatives considered: a template getter per slot (still template logic); moving the whole boss-row view model into the store (overkill for view shaping).

### D5: Outside-click focus behavior

`PointSlotRowComponent.onDocumentClick` closes the dropdown only when it is open and does not force focus to the toggle; keyboard Escape remains the path that returns focus to the toggle (already specified). This matches the updated `ui-accessibility` requirement and removes the focus steal.

Alternatives considered: keep focusing on close (fights the user's click target); use CDK overlay outside-click for consistency with selector dropdowns (larger change than the bug warrants; can be revisited if `point-slot-row` later adopts the CDK pattern).

### D6: Guard placement

Move `isTraitGainSp` / `isTraitGainAp` from `character.model.ts` into `data-guards.ts` so all runtime type guards live in one place as the rest of the codebase does. `TraitGainSp` / `TraitGainAp` interfaces stay in the model.

Alternative: leave the guards in the model file (inconsistent with the established convention).

### D7: Behavioral tests

Delete assertions that only inspect computed styles, bounding boxes, or removed DOM, and cover the same behavior through state/output assertions: allocation/deallocation changes `BuildStore` state; outside click leaves focus on the clicked element when closed; refunded abilities shrink the derived AP budget; etc. Tests that only exercised removed members are deleted, not rewritten.

## Risks / Trade-offs

- [Moving services changes import paths across features and specs] -> Mechanical find/replace; `ng build` and the full test suite catch missed imports.
- [Passing derived AP into `AbilityStore` changes its public signature and its tests] -> Update the store and its specs together; behavior stays identical because the value comes from the same formula.
- [Relocating pure formulas could accidentally change numeric behavior] -> Move the code verbatim first, then adjust imports; existing `bonus.service.spec.ts` formula cases guard the numbers.
- [Deleting "removed DOM" tests reduces apparent coverage] -> The new behavior tests cover the interactions those tests were gesturing at.

## Migration Plan

Single-pass refactor; no data, URL, or persisted-state migration. Order: (1) extract pure formulas and update `AbilityStore`, (2) move services to shared, (3) constants and template cleanup, (4) delete dead members and dead tests, (5) add behavioral tests, (6) docs. Rollback is a git revert of the change.
