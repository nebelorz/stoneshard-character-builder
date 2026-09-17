## Context

The `build-options` component has three buttons (share, AI, trash) that all use the same `game-button` mixin with no visual differentiation. The SCSS variables file already defines `$button-red` and two purple tones (`$purple-mid`, `$purple-light`) that were never used. Additionally, `$rust` and `$rust-hover` are only used in `app.scss` for the loading spinner and popup copy button.

## Goals / Non-Goals

**Goals:**

- Establish visual hierarchy: constructive buttons (share, AI) vs destructive (trash)
- Use the existing purple palette for constructive buttons and other UI elements (spinner, copy btn)
- Use red for the destructive trash button
- Add hover/active states for tactile feedback
- Clean up unused and redundant variables

**Non-Goals:**

- Changing button icons or tooltips
- Modifying the popup behavior
- Changing the component's TypeScript logic

## Decisions

### 1. Variable renaming

Rename `$purple-mid` and `$purple-light` to `$button-purple` and `$button-purple-hover` under the "Buttons" section. This groups all button colors together and makes intent clear.

**Alternative considered:** Keep original names and just reference them. Rejected because the names don't convey purpose.

### 2. Remove `$rust` and `$rust-hover`

Replace both with `$button-purple` / `$button-purple-hover` in `app.scss`:

- Loading spinner `border-top-color: $rust` -> `border-top-color: $button-purple`
- Popup copy button `background: $rust` -> `background: $button-purple`, hover `background: $rust-hover` -> `background: $button-purple-hover`

This consolidates all UI colors under a smaller, more intentional palette.

### 3. New `$button-red-hover` value

Add `$button-red-hover: #c01212` (lighter, more saturated than `$button-red: #ac0202cb`). The user requested hover states be "más claros" (lighter).

### 4. Button grouping via gap

Use CSS `gap` with different values:

- `gap: 8px` between share and AI buttons (constructive group)
- `gap: 16px` between AI and trash buttons (separation from destructive)

```html
<div class="build-options__buttons">
  <div class="build-options__group">
    <!-- share, ai -->
  </div>
  <button class="build-options__btn build-options__btn--danger">
    <!-- trash -->
  </button>
</div>
```

**Alternative considered:** CSS `margin-left: auto` on trash. Rejected because flex gap is simpler and more predictable.

### 5. Hover states

- Constructive buttons: gold border on hover (`$gold-accent`), matching `ability-icon` pattern
- Destructive button: darker red hover (`$button-red-hover`)

### 6. Active state

Add `transform: scale(0.95)` on `:active` for all buttons, matching the tactile feedback pattern in `ability-icon`.

## Risks / Trade-offs

- **Risk:** Renaming variables could break other references. **Mitigation:** Audit confirmed `$purple-mid`, `$purple-light`, and `$button-red` are unused outside `_variables.scss`.
- **Risk:** Removing `$rust` changes spinner color. **Mitigation:** Purple spinner still provides visual accent; consistent with new palette.
- **Risk:** New gap values might look inconsistent with other components. **Mitigation:** The component is isolated (bottom of build panel), so no layout ripple effects.

## Migration Plan

1. Rename variables in `_variables.scss`, remove `$rust` and `$rust-hover`, add `$button-red-hover`
2. Update `app.scss` to use `$button-purple` / `$button-purple-hover` instead of `$rust` / `$rust-hover`
3. Update `build-options.html` button order and structure
4. Update `build-options.scss` with new styles
5. Verify visually in browser
