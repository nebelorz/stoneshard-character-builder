## 1. Extract shared stat chip styles

- [x] 1.1 Create `_stat-chips.scss` partial in `src/app/shared/styles/` with the stat chip color classes (`--str`, `--agi`, `--per`, `--vit`, `--wil`) extracted from `route-display.scss`. Verify the file exists and contains the expected class definitions.
- [x] 1.2 Import the new `_stat-chips.scss` partial in `route-display.scss` and remove the duplicated stat chip color definitions. Verify route display renders stat chips with correct colors.
- [x] 1.3 Import the new `_stat-chips.scss` partial in `extras-display.scss` so the extras dropdown can reuse the same classes.

## 2. Remove collapsible from Route display

- [x] 2.1 In `route-display.ts`: remove the `routeExpanded` signal, `toggleRoute()` method, and `fadeInOut` animation import/provider. Verify the component compiles without errors.
- [x] 2.2 In `route-display.html`: convert the `<button class="right-sidenav__route-header">` to a static `<div>`, remove the chevron `<span>`, and remove the `@if (routeExpanded())` wrapper around the content. Verify the route content is always visible.
- [x] 2.3 In `route-display.scss`: remove `.right-sidenav__route-header` hover/focus styles and `.right-sidenav__route-chevron` / `.right-sidenav__route-chevron--open` styles. Verify no unused CSS remains.

## 3. Build custom dropdown in Extras display

- [x] 3.1 In `extras-display.ts`: add `dropdownOpen` signal, `toggleDropdown()` method, `selectStat(stat: StatKey | null)` method, and click-outside handler. Import `NgIcon`, `provideIcons`, `phosphorQuestion`, and `TooltipDirective`. Verify the component compiles without errors.
- [x] 3.2 In `extras-display.html`: replace the `<select>` with a dropdown button showing the selected stat chip (or "-" placeholder) and a dropdown overlay with all five stat options as colored chips plus the "-" clear option. Verify all five stats render with correct colors.
- [x] 3.3 In `extras-display.scss`: add dropdown button styles, dropdown overlay styles, and option chip styles using the shared stat chip classes. Verify the dropdown opens below the button and closes on outside click.
- [x] 3.4 Add the `phosphorQuestion` icon to the left of "Boulder Circle" label with `appTooltip` directive, `tooltipText="'Boulder Circle is a quest that gives +1 SP'"`, and `tooltipPlacement="left"`. Verify tooltip appears to the left on hover.

## 4. Verify integration

- [x] 4.1 Run `ng build` and verify the application builds successfully with no errors.
- [x] 4.2 Run existing tests for route-display and extras-display to verify no regressions.
