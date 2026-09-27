## 1. Prerequisites and baseline

- [x] 1.1 Confirm the prerequisite `finalize-bonus-feature-hygiene` change is committed and archived (`openspec list --json` shows no in-progress prior change) so its `build-performance` capability and `@core` layer are the baseline
- [x] 1.2 Capture the baseline: run `ng build --stats-json`, record the initial total and the `@angular/animations` contribution, and run `npm test` and `npm run lint` to confirm green

## 2. Dead code and import hygiene

- [x] 2.1 Delete the unused `private readonly http = inject(HttpClient);` field from `CharacterDataService`, `AbilityDataService`, and `QuestDataService`; verify `ng build` succeeds and `grep "this.http" src/app/core/data` returns nothing
- [x] 2.2 Change `app-error-handler.ts` to import `ToastService` from `./toast.service`; verify `ng build` and lint pass

## 3. Quest load failure reporting

- [x] 3.1 Inject `QuestDataService` into the root component and add a one-shot effect that shows a non-blocking toast when `quests.error()` becomes non-null; verify the toast reads "Could not load quest data; quest bonuses may be unavailable"
- [x] 3.2 Confirm quest errors stay out of the blocking `dataError`/`errorMessage` computed so startup is not blocked; verify by unit-testing that a quests failure does not set the blocking error message
- [x] 3.3 Add or update a component/service test asserting the failure is surfaced to the user (toast shown) and not silent; verify the test fails before the effect and passes after

## 4. Single source of truth for path aliases

- [x] 4.1 Extract `compilerOptions.paths` into a shared `tsconfig.paths.json` and have `tsconfig.app.json` and `tsconfig.spec.json` extend it; verify both still resolve `@core`, `@shared`, `@features`, `@models`, and `@layout`
- [x] 4.2 Add `vite-tsconfig-paths` as a dev dependency and replace the `resolve.alias` block in `vitest.config.ts` with the plugin; verify `vitest.config.ts` no longer references `path`/`__dirname` and no longer reports missing node types
- [x] 4.3 Confirm no alias is shadowed by a broader prefix and the full test suite resolves all aliases; verify `npm test` passes

## 5. Remove `@defer`, lazy-load animations, restore budget

- [x] 5.1 Remove the `@defer (when notesModalOpen())` wrapper from `app.html`, keeping the modal's inner `@if (isOpen())`; verify the notes modal still opens, saves, and closes
- [x] 5.2 Replace `provideAnimations()` with `provideAnimationsAsync()` in `app.config.ts`; verify animations still play and tests using `provideNoopAnimations`/`provideAnimations` are unaffected
- [x] 5.3 Set `initial.maximumWarning` back to `500kB` in `angular.json`; verify `ng build` emits no budget warning and record the measured initial size (measured: 461.18 kB)

## 6. Stat info affordance accessibility

- [x] 6.1 Change the `span.left-sidenav__stat-info` role from `img` to `button` in `stat-controls.html`, keeping `tabindex="0"`, `aria-label`, and the enriched-tooltip binding; verify hover and focus still show the description tooltip
- [x] 6.2 Update `stat-controls.spec.ts` to assert the interactive role and accessible name instead of the image role; verify the spec passes

## 7. Documentation alignment

- [x] 7.1 Update `README.md` to state that `core` depends only on `models` and that `layout` may compose `features`; verify the description matches the actual import graph
- [x] 7.2 Verify the architecture spec wording matches the code (features/layout inward, `core` -> `models`, layout composes features); confirm the delta applies against the current main spec

## 8. Verification

- [x] 8.1 Run `npm run lint`, `ng build`, and `npm test`; verify all pass with no new warnings and no budget warning
- [x] 8.2 Grep for residual issues: no unused `HttpClient` injection in `core/data`, no `role="img"` on the stat info affordance, no duplicated `resolve.alias` map in `vitest.config.ts`; verify all clean
