## Why

The build-options buttons lack visual hierarchy. All three buttons share the same gray style, making destructive actions (reset) indistinguishable from constructive ones (share, AI). Additionally, the SCSS variables file contains unused colors ($purple-mid, $purple-light, $button-red) and redundant semantic colors ($rust, $rust-hover) that can be consolidated under the new button palette.

## What Changes

- Reorder buttons: share, AI, trash (left to right)
- Apply `$button-purple` / `$button-purple-hover` to share and AI buttons
- Apply `$button-red` / `$button-red-hover` to the trash button
- Add visual separation (larger gap) between constructive and destructive button groups
- Rename unused variables: `$purple-mid` -> `$button-purple`, `$purple-light` -> `$button-purple-hover`
- Add new `$button-red-hover` variable (lighter than `$button-red`)
- Add hover and active states to all buttons (gold border on constructive, darker red on destructive)
- Remove `$rust` and `$rust-hover` (only used in app.scss)
- Replace `$rust` usages in app.scss with `$button-purple` / `$button-purple-hover` (spinner and popup copy button)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

This is a pure styling refactor with no behavior changes. `skip_specs: true`.

## Impact

- `src/app/shared/styles/_variables.scss` - rename variables, add `$button-red-hover`, remove `$rust` and `$rust-hover`
- `src/app/app.scss` - replace `$rust`/`$rust-hover` with `$button-purple`/`$button-purple-hover`
- `src/app/features/build/components/build-options/build-options.html` - reorder buttons
- `src/app/features/build/components/build-options/build-options.scss` - new styles, gap, hover/active states
