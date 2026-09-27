## Context

See `proposal.md` - Why. This change is the residue left by the uncommitted `core`-layer refactor. The current tree already builds and passes (331 tests, lint clean), so the work is narrow and mostly mechanical. Two measurements shape the approach:

- The production initial bundle is 512.43 kB (raw) with the notes modal split into a lazy chunk (`chunk-VHYWIAXN.js`, 11.68 kB). The configured `initial.maximumWarning` was raised from 500 kB to 550 kB to absorb this.
- Bundle input analysis shows `@angular/animations/fesm2022/browser.mjs` contributes ~52.6 kB to the initial bundle, plus ~9.4 kB across its util/private chunks, driven by `provideAnimations()` in `app.config.ts`.

`QuestDataService.quests.error()` currently has no consumer in application code, and the notes-modal `@defer` does not match the design intent recorded in the prerequisite `finalize-bonus-feature-hygiene` change.

## Goals / Non-Goals

**Goals:**

- Make quest-data failures observable to the user without blocking startup.
- Remove dead code and configuration drift identified in review.
- Restore `initial.maximumWarning` to 500 kB and make the build meet it without warnings.
- Correct the accessibility semantics of the stat info affordance and the layering documentation.
- Keep all existing observable behavior for character, tree, ability, and quest data when data loads successfully.

**Non-Goals:**

- No change to `BuildState`, URL payload, AI prompt output, bonus formulas, or quest data.
- No retry UI or blocking error component for quests; the failure is informational only.
- No migration away from `@angular/animations` or from Zone.js.
- No new state-management or architectural abstraction.

## Decisions

### D1 - Report quest failures with a one-shot non-blocking toast

Inject `QuestDataService` into the root component and add a small effect that watches `quests.error()`. On the first non-null error, show a single toast (`ToastService.show('Could not load quest data; quest bonuses may be unavailable', 'error')`) and set a guard flag so later effect runs do not repeat it. Quests remain excluded from the blocking `dataError`/`errorMessage` computed so startup is unaffected.

- Alternatives: (a) surface through the global `ErrorHandler` - rejected, data-load failures are not uncaught exceptions and would double-report; (b) render an inline notice in the quests section - rejected, the whole section renders from quest data, so there is nothing to attach it to when data is empty; (c) leave silent - rejected, the resource error state is otherwise never observed.
- This deliberately reverses the `finalize-bonus-feature-hygiene` "no new toast" non-goal for this single case; the toast is informational and does not gate any build operation.

### D2 - Single source of truth for path aliases via `vite-tsconfig-paths`

Extract the shared `compilerOptions.paths` map into a `tsconfig.paths.json` base that `tsconfig.app.json` and `tsconfig.spec.json` both `extends`, and add the dev-only `vite-tsconfig-paths` plugin to `vitest.config.ts` so Vitest derives aliases from the tsconfig instead of a hand-maintained `resolve.alias` map. Remove the `resolve.alias` block (including the shadowed `@core/state` / `@core/data` entries and the `path`/`__dirname` usage).

- This also removes the `Cannot find name '__dirname'` / `Cannot find name 'path'` type errors in `vitest.config.ts`, since the config no longer references Node globals.
- Alternatives: (a) keep `resolve.alias` but order exact entries before prefixes - fixes shadowing but leaves three drifting copies; (b) add `@types/node` and keep duplication - fixes types but not drift. Neither meets the single-source requirement.

### D3 - Remove `@defer`, lazy-load animations, restore the 500 kB budget

- Remove the `@defer (when notesModalOpen())` wrapper in `app.html`; the modal's own `@if (isOpen())` already gates rendering. This moves ~11.7 kB back into the initial bundle.
- Replace `provideAnimations()` with `provideAnimationsAsync()` from `@angular/platform-browser/animations/async`. This lazily loads the animations renderer, removing the ~52.6 kB `browser.mjs` plus its util/private chunks from the initial bundle while preserving all existing animation triggers.
- Net effect is comfortably under the original 500 kB; set `initial.maximumWarning` back to `500kB` and verify `ng build` emits no budget warning. The exact measured size is recorded during implementation.
- Alternatives: (a) keep `provideAnimations()` and cut icon/CSS weight - insufficient headroom at ~24 kB needed and touches many files; (b) keep the 550 kB budget - rejected by the review decision.

### D4 - Model the stat info affordance as a button

Change the `span.left-sidenav__stat-info` from `role="img"` to `role="button"` while keeping `tabindex="0"`, the `aria-label`, and the enriched-tooltip binding. Apply the same change to the matching focusable tooltip trigger in `trait-section.html` (`.left-sidenav__trait-info`), since the `ui-accessibility` requirement is generic over focusable tooltip triggers. Update `stat-controls.spec.ts` (and the trait affordance test) to assert the interactive role and accessible name instead of the image role. The tooltip directive already handles focus/hover and `aria-describedby`, so no interaction wiring changes.

- Alternative: drop the role and rely on a focusable generic element with `aria-label` + `aria-describedby` - rejected by the review decision in favor of an explicit interactive role.

### D5 - Remove dead injections and tidy imports

- Delete `private readonly http = inject(HttpClient);` from all three `core/data` services; `httpResource` resolves its own client. Tests keep `provideHttpClient` / `provideHttpClientTesting`.
- Change `app-error-handler.ts` to import `ToastService` from `./toast.service` instead of `@shared/services/toast.service`.

### D6 - Correct documentation and spec wording

- `README.md`: state that `core` depends only on `models`, and that `layout` may compose `features`.
- The `architecture` delta updates `Feature dependency direction` in place (a requirement that exists both before and after the prerequisite change, so the delta applies cleanly either way) and adds the module-resolution single-source requirement.

## Risks / Trade-offs

- [A toast on every effect re-run could spam] → guard with a one-shot flag; quests load once per lifecycle and there is no retry path.
- [Removing `@defer` increases the initial bundle] → offset by lazy-loading animations (D3); gate on a measured `ng build` with no budget warning.
- [`provideAnimationsAsync` can delay the very first animation by a chunk fetch] → animations are decorative; the first-paint experience is unaffected and the chunk is cached after first use. If any test asserts animation timing, it uses `provideNoopAnimations`.
- [`vite-tsconfig-paths` resolves a different tsconfig than expected] → point it at `tsconfig.spec.json` (which extends the shared base) and confirm alias resolution by running the full test suite.
- [`role="button"` implies activation that the affordance does not perform] → the affordance does perform a user action (revealing the description) and is already focusable; the accessible name and `aria-describedby` describe it. If reviewers prefer, the fallback is an explicit disclosure pattern, but the spec now requires an interactive role.

## Migration Plan

1. Confirm the prerequisite `finalize-bonus-feature-hygiene` change is committed/archived first (its `build-performance` capability governs the budget).
2. Remove dead injections and tidy the error-handler import.
3. Add the quest-failure toast effect and root injection.
4. Consolidate aliases (`tsconfig.paths.json`, `vite-tsconfig-paths`), update `vitest.config.ts`.
5. Remove `@defer`, switch to `provideAnimationsAsync`, restore the 500 kB budget.
6. Change the stat affordance role and update its spec.
7. Update README, then run `npm run lint`, `ng build`, and `npm test`.

Rollback: each step is independent; reverting the bundle/config commits restores the 550 kB budget and eager animations, and the toast effect is a single additive block.
