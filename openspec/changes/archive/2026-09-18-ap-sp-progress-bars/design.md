## Context

AP and SP are currently displayed as plain text in the `stat-controls` component (`stat-controls.html:45-54`). The component already has computed signals for `ap()` and `sp()` from `BuildStore`. Max values are constants: AP=31, SP=29. The project uses `ng-icon` with Phosphor icons in other components (footer, build-options).

## Goals / Non-Goals

**Goals:**

- Add visual progress indicators for AP and SP
- Integrate Phosphor icons for quick resource identification
- Maintain existing component structure and data flow

**Non-Goals:**

- Changing how AP/SP values are calculated
- Adding interactivity to the progress bars (no click/drag)
- Supporting dynamic max values

## Decisions

### 1. CSS-only progress bars (no library)

Use pure CSS for progress bars instead of adding a UI library dependency.

**Alternative considered:** Angular Material progress-bar
**Why rejected:** Adds unnecessary bundle size for a simple visual element. CSS `width` percentage is sufficient.

### 2. Inline width binding

Bind progress bar width directly in the template: `[style.width.%]="(ap() / 31) * 100"`

**Alternative considered:** CSS custom properties set from TypeScript
**Why rejected:** Direct binding is simpler and the calculation is trivial.

### 3. Reusable mixin in _components.scss

Add `progress-bar` and `progress-bar__fill` mixins to `_components.scss` for consistency with existing patterns.

**Alternative considered:** Inline styles in stat-controls.scss only
**Why rejected:** Follows the project's established mixin pattern for shared UI components.

### 4. Icon imports

Import `phosphorBook` and `phosphorPlusSquare` from `@ng-icons/phosphor-icons/regular`.

**Why:** These icons semantically represent AP (book = abilities/knowledge) and SP (plus-square = stat increases).

## Risks / Trade-offs

**[Risk] Icon names may not exist in Phosphor set** → Mitigation: Verify imports compile; fallback to `phosphorBookmarks` or `phosphorSquare` if needed.

**[Risk] Division by zero if max values change** → Mitigation: Max values are constants (31, 29) in build-store.ts, not user-configurable. Low risk.

**[Trade-off] Fixed max values hardcoded in template** → Accepted: Max values are game constants, not dynamic. If they ever change, only the template needs updating.
