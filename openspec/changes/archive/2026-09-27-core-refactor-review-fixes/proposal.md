## Why

The `core`-layer refactor landed but left review gaps that will compound if features build on them: quest data-load failures are now completely silent, dead `HttpClient` injections remain in the data services, path aliases are duplicated and shadowed across three configs, the notes-modal `@defer` does not match its design intent while the bundle budget was raised to hide the resulting warning, a focusable tooltip trigger is modeled as `role="img"`, and the README/architecture spec describe the dependency rules inaccurately. These are residual hygiene items from the same review that should be closed before the next feature lands on the state layer.

## What Changes

- Surface quest-data load failures with a non-blocking toast. This deliberately reverses the prior "no new toast" non-goal for this single case: the resource error state is currently never observed, so a failed `quests.json` silently yields an empty quest list.
- Remove the dead `inject(HttpClient)` fields from `CharacterDataService`, `AbilityDataService`, and `QuestDataService`; `httpResource` resolves its own client.
- Make module resolution configuration have a single source of truth: remove the shadowed `@core/state` / `@core/data` Vitest alias entries and stop maintaining the same aliases in three places.
- Remove the redundant `@defer (when notesModalOpen())` wrapper around the notes modal (the modal already gates on `@if (isOpen())`), reduce the initial bundle so it fits the original budget, and restore `initial.maximumWarning` to `500kB`.
- Model the stat info affordance (and the matching trait info affordance) as an interactive control (`role="button"`) instead of `role="img"`, and update the spec assertion that currently locks in the image role.
- Align documentation with the code: `core` depends only on `models` (never `shared`), and `layout` is allowed to compose `features`.
- Simplify the `AppErrorHandler` toast import to a sibling-relative path instead of the `@shared/services` barrel deep path.

## Capabilities

### New Capabilities

<!-- None. The build-budget behavior this change touches is introduced by the pending `finalize-bonus-feature-hygiene` change; this change tightens the value under that capability rather than defining it. -->

### Modified Capabilities

- `error-handling`: add a requirement that a failed quest-data load is reported to the user through a non-blocking notification, on top of the existing resource error state.
- `architecture`: clarify the feature dependency direction (features and layout depend on `core`/`models`/`shared`; `layout` may compose features; `core` depends only on `models`), and add a single-source-of-truth requirement for module resolution configuration.
- `ui-accessibility`: add a requirement that focusable tooltip triggers expose an interactive role and correct ARIA wiring rather than a non-interactive `role="img"`.
- `stat-description-tooltip`: the stat info affordance is an interactive control, not an image.

## Impact

- Data services: `core/data/character-data.service.ts`, `ability-data.service.ts`, `quest-data.service.ts` (dead injection removal); `core/data/*.spec.ts` (assertions adjusted if needed).
- Error handling: root component / toast wiring in `app.ts` plus a new quest-failure effect or aggregated non-blocking notice; `core/data/quest-data.service.ts`.
- Config/tooling: `vitest.config.ts` (remove shadowed/duplicated aliases, single-source resolution), `tsconfig.app.json` / `tsconfig.spec.json` (only if resolution strategy changes), `angular.json` (`initial.maximumWarning` back to `500kB`).
- Notes modal: `app.html` (`@defer` removal); bundle-size reduction elsewhere if needed to fit `500kB`.
- Accessibility: `features/character/components/stat-controls/stat-controls.html` and `stat-controls.spec.ts`; `features/character/components/trait-section/trait-section.html` and `trait-section.spec.ts` (same focusable tooltip-trigger pattern).
- Docs: `README.md` architecture section; `openspec/specs/architecture/spec.md` (via delta).
- Not changed: `BuildState` shape, URL payload, AI prompt output, bonus formulas, quest data, and the `finalize-bonus-feature-hygiene` artifacts.
