## Why

`BonusService` (`src/app/core/state/bonus.service.ts`) is a thin shell: every method just forwards to a pure function in `@models/bonus.model.ts`, and its only real responsibility is injecting quest data. Its imports are aliased `as ...Pure` purely to disambiguate the service methods from the same-named domain functions, which is a smell. Removing the layer (or, failing that, dropping the aliases) simplifies the bonus feature.

## What Changes

- Run a short spike that migrates the five `BonusService` consumers to pure functions + quest data and decides whether removing the service is worth it.
- If removal is worthwhile:
  - Delete `BonusService` and its spec, moving the still-valuable formula tests to a new `bonus.model.spec.ts` (pure domain tests).
  - Consumers import the pure functions from `@models` and get quests from `QuestDataService` (optionally via a small `questList` computed added to that service).
  - **BREAKING** internal-only: `BonusService` disappears from `@core/state`; no runtime behavior change.
- If removal is not worthwhile:
  - Keep `BonusService` and simply remove the `as ...Pure` aliases, calling the domain functions directly.
- Either way, no user-visible behavior changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. This is a pure internal refactor with no spec-level behavior change, so the change sets `skip_specs: true`.

## Impact

- `src/app/core/state/bonus.service.ts` and `bonus.service.spec.ts` (deleted or trimmed).
- Consumers: `src/app/core/state/build-store.ts`, `src/app/features/build/services/ai-prompt.service.ts`, `src/app/features/build/services/url-share.service.ts`, `src/app/features/character/components/quests-section/quests-section.ts`, `src/app/features/character/components/trait-section/trait-section.ts`.
- Possibly `src/app/core/data/quest-data.service.ts` (a shared `questList` computed) and new `src/app/models/bonus.model.spec.ts`.
