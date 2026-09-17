## 1. SCSS Variables Cleanup

- [x] 1.1 Rename `$purple-mid` to `$button-purple` and `$purple-light` to `$button-purple-hover` in `_variables.scss` under the Buttons section.
- [x] 1.2 Remove `$rust` and `$rust-hover` from `_variables.scss`.
- [x] 1.3 Add `$button-red-hover: #c01212` to `_variables.scss` under the Buttons section.

## 2. App Global Styles

- [x] 2.1 In `app.scss`, replace `$rust` with `$button-purple` in `.app-loading__spinner` (line 48).
- [x] 2.2 In `app.scss`, replace `$rust` with `$button-purple` and `$rust-hover` with `$button-purple-hover` in `.popup-copy-btn` (lines 78, 81).

## 3. Button Reorder and Structure

- [x] 3.1 Reorder buttons in `build-options.html`: share, AI, trash (left to right). Wrap share and AI in a `build-options__group` div. Keep trash as a separate button with `build-options__btn--danger` class.

## 4. Button Styling

- [x] 4.1 Update `build-options.scss`: add styles for `build-options__group` (flex with `gap: 8px`), add `gap: 16px` between group and trash button. Apply `$button-purple` / `$button-purple-hover` to share and AI buttons. Apply `$button-red` / `$button-red-hover` to trash button with `--danger` modifier.
- [x] 4.2 Add hover states: gold border (`$gold-accent`) for constructive buttons, darker red (`$button-red-hover`) for destructive. Add active state: `transform: scale(0.95)` for all buttons.

## 5. Verify

- [x] 5.1 Run `ng build` to confirm no SCSS compilation errors.
- [x] 5.2 Visually verify in browser: button order is share, AI, trash. Trash is red. Hover states work. Gap between AI and trash is larger. Spinner and copy btn are purple.
