## 1. Accessibility mechanism for point indicators (D3)

- [x] 1.1 Add a `visually-hidden` mixin to `src/app/shared/styles/_components.scss`; verify `ng build` compiles the affected component styles
- [x] 1.2 Remove the `aria-label` from the role-less bonus marker span in `stat-controls.html` and emit visually hidden descriptive text only when the bonus count is positive (styling via `stat-controls.scss`); verify the `merged stat display` cases in `stat-controls.spec.ts` assert the hidden text and no exposed contribution at zero
- [x] 1.3 Apply the same visually hidden mechanism to the derived-AP indicator in `trait-section.html`/`trait-section.scss`; verify `trait-section.spec.ts` asserts the derived contribution is conveyed and absent when zero

## 2. Expose derived view values as signals (D4)

- [x] 2.1 Replace the `trait-section` template methods (`indexes`, `slotIndices`, `rowCount`, `lastRowIndex`, `bossRowsFor`, `hasPointGains`) with computed gain view models, remove the `gain.max!` assertion, and keep rendering order; verify `trait-section.spec.ts` passes
- [x] 2.2 Replace `stat-controls` `getStatValue`/`getBonusCount` template calls with a computed per-stat view; verify `stat-controls.spec.ts` passes
- [x] 2.3 Replace `character-info` `treeTooltipFor` with a computed tooltip-content map; verify `character-info.spec.ts` passes

## 3. Mechanical hygiene (D5)

- [x] 3.1 Delete the unbound `PointSlotRowComponent.onOptionKeydown`; verify `npm run lint` and `ng build` report no unused-symbol issues
- [x] 3.2 Merge `AiPromptService`'s two `@shared/services` imports into one; verify `ng build` succeeds
- [x] 3.3 Import `BuildStore` from `@features/build/services` in `trait-section`/`quests-section` components and specs; verify no remaining deep `features/build/services/build-store` imports in those files (grep) and `ng build` succeeds
- [x] 3.4 Delete `BonusService.isValidStatKey` and call `isStatKey` directly in `url-share.service.ts`; verify `bonus.service.spec.ts` and `url-share.service.spec.ts` pass
- [x] 3.5 Add a `QuestTooltipContent` kind and use it for quest tooltips in `tooltip-content.model.ts`, `enriched-tooltip-overlay.ts`, and `quests-section.ts`; verify `ng build` and the enriched-tooltip specs pass

## 4. Bring tests in line with the behavioral-test requirement (D2)

- [x] 4.1 Delete the removed-DOM-only assertion `renders no trait affordance in the selector` from `character-selector.spec.ts`; verify the file passes
- [x] 4.2 Replace the structural assertions `places the info icon before the stat label in each row` and `renders a reserved bonus marker span in every stat row` in `stat-controls.spec.ts` with behavioral and ARIA-contract assertions; verify the file passes
- [x] 4.3 Delete the `places the info icon before ...` order assertions from `quests-section.spec.ts` and `trait-section.spec.ts`; verify both files pass
- [x] 4.4 Rewrite the `point-slot-row.spec.ts` option-count assertion as a "every stat key is selectable and emits its key" behavior and the `character-info.spec.ts` row-structure assertion as a per-tree tooltip-content behavior; verify both files pass
- [x] 4.5 Confirm no test asserts element order, reserved-span presence, or absence of removed markup (grep the affected spec files); verify the full `npm test` suite is green

## 5. Verification

- [x] 5.1 Run `npm run lint` and `ng build`; resolve all errors and warnings introduced by this change (pre-existing bundle-budget warning excluded)
- [x] 5.2 Run the full `npm test` suite; confirm all specs pass, including the updated indicator accessibility assertions
- [ ] 5.3 Smoke test on `ng serve`; confirm the bonus and derived-AP indicators read correctly with a screen reader and no layout regression appears
