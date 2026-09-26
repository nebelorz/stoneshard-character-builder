## 1. Character selector cleanup

- [x] 1.1 Remove the `char-selector__trait-icon` block from `character-selector.html`, delete the `&__trait-icon` and `&__trait-icon-letter` SCSS blocks from `character-selector.scss`, and delete the now-unreferenced `currentTraitContent` computed from `character-selector.ts` (confirm via grep that no references remain)
- [x] 1.2 Update `character-selector.spec.ts`: remove the trait-icon focus/blur scenarios and add a scenario asserting the selector renders no trait affordance; verify with `npm test -- --include="**/character-selector.spec.ts"`

## 2. Sidenav composition

- [x] 2.1 Keep the rendered section order per user decision after visual verification; the order was later revised in task 6.9 to selector, trait, level, stats, quests, character-info, and is recorded in the left-sidenav-layout spec delta
- [x] 2.2 Normalize the quests-section icon-label gap (tight gap between icon and label) in `quests-section.scss`; verify `npm test -- --include="**/quests-section.spec.ts"` stays green

## 3. Stats panel: icon-first rows and reserved bonus marker

- [x] 3.1 In `stat-controls.html`, move the info icon before the stat label, and in `stat-controls.scss` set the tight icon-to-label gap with the control cluster pushed right; update `stat-controls.spec.ts` for the new element order; verify with `npm test -- --include="**/stat-controls.spec.ts"`
- [x] 3.2 Make the bonus marker a reserved fixed-width span (always rendered, `min-width` sized for `+10`, right-aligned text, empty/hidden when no bonus, aria-label only when positive) per design D1; update `stat-controls.spec.ts` with scenarios for identical row alignment across bonus/no-bonus rows and `+9` to `+10` marker changes; verify with `npm test -- --include="**/stat-controls.spec.ts"`

## 4. Trait section: icon-first header, two-column bounded lists, stepper styling

- [x] 4.1 In `trait-section.html`, move the trait header info icon before the trait name label; verify `npm test -- --include="**/trait-section.spec.ts"` and adjust the header-order assertions
- [x] 4.2 Apply `grid-template-columns: repeat(2, minmax(0, 1fr))` to bounded trait slot lists only (boss-row pairs keep their full-width flex row) per design D3; verify with a trait-section spec assertion that Jorgrim's 5 slots render in 3 grid rows and Velmir boss rows stay full-width
- [x] 4.3 Add the `.left-sidenav__btn` / `--sm` block (side-nav-btn mixins from `_components.scss`) to `trait-section.scss` so the stepper matches the stats buttons per design D4; verify with a trait-section spec assertion that stepper buttons carry the shared classes and a visual smoke check on `ng serve`
- [x] 4.4 Add two-column layout to the Character Unlocked Trees list in `character-info.scss` with name truncation preserved; update `character-info.spec.ts` with a two-column assertion; verify with `npm test -- --include="**/character-info.spec.ts"`

## 5. Verification

- [x] 5.1 Run `npm run lint` and `ng build`; resolve all errors and warnings introduced by this change (pre-existing bundle budget warning excluded)
- [x] 5.2 Run the full `npm test` suite and confirm all specs pass including the updated character-selector, stat-controls, trait-section, and character-info specs
- [x] 5.3 Smoke test on `ng serve`: selector without trait icon, section order, stats rows aligned with mixed bonus markers, Jorgrim slots filling the panel width (three columns), Dirwin badge, Velmir boss rows full-width with styled stepper, unlocked trees filling the panel width with name tooltips

## 6. Follow-up refinements from visual verification

- [x] 6.1 Left-align the bonus marker text inside its reserved fixed-width span in `stat-controls.scss` (marker hugs the stat value; reservation unchanged) per design D1; re-run `npm test -- --include="**/stat-controls.spec.ts"`
- [x] 6.2 Switch both grids to `repeat(auto-fill, minmax(68px, 1fr))` (`.left-sidenav__trait-rows--grid` in `trait-section.scss` and `.character-info__list` in `character-info.scss`) per design D3; update `trait-section.spec.ts` (Jorgrim: 5 slots in three columns across 2 rows) and `character-info.spec.ts` (auto-fill tracks); verify both spec files
- [x] 6.3 Attach `EnrichedTooltipDirective` to each `.character-info__row` with the tree name content per design D6; add hover and focus tooltip scenarios to `character-info.spec.ts`; verify with `npm test -- --include="**/character-info.spec.ts"`
- [x] 6.4 Re-run `npm run lint`, `ng build`, and the full `npm test` suite; resolve any issues introduced by section 6
- [x] 6.5 Vertically center the bonus marker text within its row (`line-height: 1` on `.left-sidenav__stat-bonus`); re-run `npm test -- --include="**/stat-controls.spec.ts"`
- [x] 6.6 Move `.left-sidenav__trait-stepper` into the trait group header, right-aligned next to the group label, and shrink its buttons below the shared `--sm` size (local override in `trait-section.scss`); amend the left-sidenav-layout stepper requirement to allow a smaller size while keeping the shared border/background/hover/focus/disabled states; re-run `npm test -- --include="**/trait-section.spec.ts"`
- [x] 6.7 Swap the stepper button order in `trait-section.html` so `-` (remove) sits on the left and `+` (add) on the right; update `trait-section.spec.ts` button-order scenarios; verify with `npm test -- --include="**/trait-section.spec.ts"`
- [x] 6.8 Normalize the quests row to the stats/trait icon-first pattern: wrap the quest info icon in a fixed-size affordance span matching `stat-info`, row gap 6px, slot pushed right; update `quests-section.spec.ts`; verify with `npm test -- --include="**/quests-section.spec.ts"`
- [x] 6.9 In `character-panel.html`, move the trait section directly after the character selector (order: selector, trait, level, stats, quests, character-info); confirm with `ng build` and the dev server smoke check
