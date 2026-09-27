## 1. Prerequisites and baseline

- [ ] 1.1 Confirm the prerequisite changes `core-refactor-review-fixes` and `finalize-bonus-feature-hygiene` are archived, so the `architecture` dependency-direction requirement they shape is the baseline; verify `openspec list --json` shows no in-progress prior change that modifies architecture
- [ ] 1.2 Capture the baseline with `npm run lint`, `ng build`, and `npm test`; verify all pass with the currently green 333 tests and record the initial bundle size for later comparison

## 2. Relocate the tooltip content types to models

- [ ] 2.1 Create `src/app/models/tooltip-content.model.ts` containing `TraitTooltipContent`, `StatTooltipContent`, `TreeTooltipContent`, `QuestTooltipContent`, and the `TooltipContent` union, moved verbatim from the shared file; verify the interfaces are byte-for-byte equivalent to the originals
- [ ] 2.2 Add `export * from './tooltip-content.model';` to `src/app/models/index.ts`; verify `TooltipContent` and each concrete content type resolve through `@models`
- [ ] 2.3 Delete `src/app/shared/directives/tooltip/tooltip-content.model.ts`; verify no file in `src/` references that path afterward

## 3. Rewrite every importer

- [ ] 3.1 Update `src/app/models/stat-info.model.ts` to import `StatTooltipContent` from `./tooltip-content.model`; verify no `models` file imports from `@shared`
- [ ] 3.2 Update the shared tooltip files `src/app/shared/directives/tooltip/enriched-tooltip.ts`, `enriched-tooltip-overlay.ts`, and `enriched-tooltip.spec.ts` to import `TooltipContent` from `@models`; verify the tooltip spec passes
- [ ] 3.3 Update the feature importers `features/character/components/trait-section/trait-section.ts` (`TraitTooltipContent`), `character-info/character-info.ts` (`TreeTooltipContent`), `stat-controls/stat-controls.ts` (`StatTooltipContent`), `quests-section/quests-section.ts` (`QuestTooltipContent`), and `character-selector/character-selector.ts` (`TraitTooltipContent`) to import from `@models`; verify the affected specs compile and pass
- [ ] 3.4 Grep for any remaining reference to `tooltip-content.model`; verify the only match is the new `models/tooltip-content.model.ts` file and no importer still points at the deleted shared path

## 4. Documentation and spec alignment

- [ ] 4.1 Review the `README.md` "Architecture" section against the new import graph; update the `models`/`shared` wording only if it now misdescribes the code, otherwise leave it unchanged
- [ ] 4.2 Run `openspec validate break-models-shared-cycle --strict`; verify the `architecture` delta applies cleanly against the current `openspec/specs/architecture/spec.md`

## 5. Verification

- [ ] 5.1 Run `npm run lint`, `ng build`, and `npm test`; verify all pass with 333 tests green and no new warning or bundle-size regression beyond noise
- [ ] 5.2 Grep-verify the dependency direction: no `models` file imports `@shared`, no pair of modules imports each other in both directions, `core` imports only `models`, and no feature imports another feature
- [ ] 5.3 Confirm behavior is unchanged by exercising the enriched tooltips (trait, tree, quest, and stat content) and the notes modal save/close flow; verify rendering, dismiss behavior, and saved notes match the pre-change behavior
