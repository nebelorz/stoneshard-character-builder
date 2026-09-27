## Context

See `proposal.md` | Why. The current cross-layer import edges are exactly two:

- `src/app/models/stat-info.model.ts` imports `StatTooltipContent` from `@shared/directives/tooltip/tooltip-content.model`.
- `src/app/shared/ui/notes-modal/notes-modal.ts` imports `BuildNotes` from `@models`.

No other cross edges exist: `shared` imports nothing from `core`, `features`, or `layout`; `models` imports nothing else outside itself; `core` imports nothing from `shared`, `features`, or `layout`. So the cycle is isolated to these two edges and each can be removed independently.

The tooltip content types are pure interfaces with no Angular or shared-layer dependency:

- `TraitTooltipContent`, `StatTooltipContent`, `TreeTooltipContent`, `QuestTooltipContent`, `TooltipContent` in `src/app/shared/directives/tooltip/tooltip-content.model.ts`.

Importers of those types: `models/stat-info.model.ts`; `shared/directives/tooltip/enriched-tooltip.ts`, `enriched-tooltip-overlay.ts`, `enriched-tooltip.spec.ts`; and five feature components under `features/character/components/` (`trait-section`, `character-info`, `stat-controls`, `quests-section`, `character-selector`). No `layout` file imports them.

The `architecture` requirement is currently being reshaped by two unarchived changes: `core-refactor-review-fixes` MODIFIES "Feature dependency direction" to a layered wording, and `finalize-bonus-feature-hygiene` ADDS a "Layered module structure" requirement. This change refines that same requirement rather than introducing a new one.

## Goals / Non-Goals

**Goals:**

- Remove the `models` <-> `shared` cycle with a strict one-way dependency, and make `models` the lowest layer with no outbound application-layer imports.
- Keep the enriched tooltip contract and rendering behavior identical.
- Make the dependency rule explicit enough to be verified with a grep.

**Non-Goals:**

- Changing `BuildState` shape, the URL payload, the AI prompt output, bonus formulas, quest data, or any runtime behavior.
- Changing the tooltip directive's public behavior (overlay positioning, hover/focus keys, ARIA wiring, content-kind dispatch).
- Reworking the `shared` layer beyond the tooltip content types.

## Decisions

### Decision 1: Move all tooltip content types into `models` (not `BuildNotes` into `shared`, and not a split model)

Chosen approach: relocate the five tooltip content types to `src/app/models/tooltip-content.model.ts`.

Rationale and alternatives:

- **Option A (chosen): move the tooltip content types to `models`.** The types are data shapes, matching the documented role of `models` ("Domain types"). This makes `models` the unambiguous lowest layer and leaves `shared`, `core`, `features`, and `layout` all depending downward. After this change the only direction between `models` and `shared` is `shared -> models`.
- **Option B: move `BuildNotes` out of `models` into `shared`.** Blast radius is smaller on paper (about 4 files: `build-state.model.ts`, `notes-modal.ts`, `build-store.ts`, `app.ts`), but it cannot make `models` pure: `stat-info.model.ts` would still import `StatTooltipContent` from `shared`, so the edge would simply become `models -> shared`. That inverts the natural layering (the domain layer depending on the UI/utility layer), moves a domain type that is part of `BuildState` into the wrong layer, and forces the spec to codify the inverted direction. Rejected.
- **Option C: split the content model (move only `StatTooltipContent` to `models`, keep the rest plus the union in `shared`).** Blast radius is the smallest (about 3 files), but it fragments one cohesive content model across two layers and leaves the `TooltipContent` union reaching upward for one member. The file-count saving is not worth the inconsistency. Rejected.

Blast radius of the chosen option: 9 importer files plus a new file, a barrel export, and one deletion. The importer edits are type-only path rewrites and are independent of how many content kinds are added later, whereas Options B and C each bake in a structural decision that would need unwinding.

### Decision 2: One canonical import path, no re-export shim

Delete `shared/directives/tooltip/tooltip-content.model.ts` rather than leaving it as a re-export of the new models file. A shim would avoid touching the feature imports but would create two import paths for the same type, which conflicts with the existing single-source-of-truth requirements in the `architecture` spec. The mechanical import rewrites are preferable.

### Decision 3: Import through the `@models` barrel

Add `export * from './tooltip-content.model';` to `src/app/models/index.ts` and import the types from `@models` in `shared` and `features`. This is a type-only dependency on the models layer, consistent with how the rest of the app consumes models. `models` imports nothing external, so no cycle can form.

### Decision 4: No behavior change in the tooltip implementation

`EnrichedTooltipDirective` and `EnrichedTooltipOverlayComponent` keep their logic, inputs, positions, and `kind` dispatch; only the type import path changes. `notes-modal.ts` keeps importing `BuildNotes` from `@models`, which is now the permitted direction.

### Decision 5: Refine the existing `architecture` requirement instead of adding a parallel one

Modify "Feature dependency direction" in the `architecture` spec to state that `shared` may depend on `models` and that `models` must not depend on `shared`, `core`, `features`, or `layout`, alongside the existing one-way layer rules. This is a refinement of the pending `core-refactor-review-fixes` wording, not a new requirement, so there is a single place that defines the dependency direction.

## Risks / Trade-offs

- **Two unarchived changes touch the same requirement** (`core-refactor-review-fixes` and `finalize-bonus-feature-hygiene`). If this change is archived before they are, the later archive could overwrite the refined wording. Mitigation: archive the pending changes first (they are already complete), then archive this one, and re-run `openspec validate` after each archive.
- **Missing an importer breaks the build.** Mitigation: the affected importers are enumerated in `tasks.md`, and verification greps for the old module path after the move.
- **`@models` barrel import in the tooltip directive could look like a bundle concern.** These are type-only imports that are erased at compile time; the barrel's value exports are not referenced, so tree-shaking keeps the bundle impact neutral. Confirm with the production build size during verification.
- **README could drift.** The current `models`/`shared` descriptions remain accurate after the move; update only if the wording becomes misleading.
