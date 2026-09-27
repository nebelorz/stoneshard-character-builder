## Why

The `models` and `shared` layers import from each other: `models/stat-info.model.ts` imports `StatTooltipContent` from `shared/directives/tooltip/tooltip-content.model.ts`, while `shared/ui/notes-modal/notes-modal.ts` imports `BuildNotes` from `@models`. This is the exact bidirectional dependency that the `architecture` requirement forbids, and it was left as a known follow-up when `core-refactor-review-fixes` landed. It should be closed before more code accrues on either side.

## What Changes

- Relocate the tooltip content shapes (`TraitTooltipContent`, `StatTooltipContent`, `TreeTooltipContent`, `QuestTooltipContent`, and the `TooltipContent` union) out of the `shared` tooltip directive folder into the `models` layer as `models/tooltip-content.model.ts`, exported from the `@models` barrel. These are pure data shapes, so they belong with the domain types.
- Rewrite every importer of those types: `features` (trait-section, character-info, stat-controls, quests-section, character-selector), `shared/directives/tooltip` (enriched-tooltip directive, overlay, spec), and `models/stat-info.model.ts`. No `layout` file imports them.
- Delete the old `shared/directives/tooltip/tooltip-content.model.ts`.
- Keep the enriched-tooltip directive behavior, overlay rendering, dispatch by content kind, and all runtime behavior unchanged.
- Tighten the `architecture` dependency-direction requirement so the one-way direction is explicit: `shared` MAY depend on `models`, and `models` SHALL NOT depend on any other application layer.
- Update `README.md` only if its layering description becomes inaccurate.
- No changes to `BuildState` shape, URL payload, AI prompt output, bonus formulas, quest data, or any runtime behavior.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `architecture`: the existing "Feature dependency direction" requirement is tightened to name `models` as the lowest layer and to state the one-way `shared` -> `models` dependency, so the no-bidirectional-dependency rule is unambiguous and grep-verifiable.

## Impact

- New: `src/app/models/tooltip-content.model.ts`; `src/app/models/index.ts` (barrel export).
- Deleted: `src/app/shared/directives/tooltip/tooltip-content.model.ts`.
- Import rewrites: `src/app/models/stat-info.model.ts`; `src/app/shared/directives/tooltip/enriched-tooltip.ts`, `enriched-tooltip-overlay.ts`, `enriched-tooltip.spec.ts`; `src/app/features/character/components/trait-section/trait-section.ts`, `character-info/character-info.ts`, `stat-controls/stat-controls.ts`, `quests-section/quests-section.ts`, `character-selector/character-selector.ts`.
- Docs/specs: `README.md`; `openspec/specs/architecture/spec.md` (via delta).
- Not changed: `BuildState` shape, URL payload, AI prompt output, bonus formulas, quest data, runtime behavior, and the pending `core-refactor-review-fixes` / `finalize-bonus-feature-hygiene` artifacts.
