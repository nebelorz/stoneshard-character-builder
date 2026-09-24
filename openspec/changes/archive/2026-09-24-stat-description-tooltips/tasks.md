## 1. Stat content model and data

- [x] 1.1 Add `StatTooltipContent` to the `TooltipContent` union in `tooltip-content.model.ts` and a `stat` case to the enriched overlay component's renderer; verify the app type-checks and the enriched tooltip specs still pass
- [x] 1.2 Create `src/app/models/stat-info.model.ts` exporting `STAT_INFO: Record<StatKey, StatTooltipContent>` with the five supplied descriptions, and export it from `models/index.ts`; verify a unit test confirms all five stats have complete content (intro, per-point, milestone, cap)

## 2. Stat list integration

- [x] 2.1 In `stat-controls`, register `NgIcon` and the enriched tooltip directive, provide `phosphorInfo`, add a content accessor, and render a focusable info icon with the enriched tooltip on each stat row; verify the dev server builds and hovering/focusing each icon shows its description
- [x] 2.2 Add a `stat-controls.spec.ts` covering per-stat info icons, content binding to `STAT_INFO`, and keyboard focus showing the tooltip; verify the test passes
- [x] 2.3 Add an icon style to `stat-controls.scss` for size/color; verify the icon aligns with the stat row and matches the stat name style

## 3. Verification

- [x] 3.1 Run the full test suite, lint, and a production build; verify all pass with no regressions in the enriched tooltip or the simple `appTooltip` call sites
