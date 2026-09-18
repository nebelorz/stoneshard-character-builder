## Context

The tree selector component (`app-tree-selector`) uses a tabbed category layout (Weaponry/Utility/Sorcery) that expands inline to show a grid of ability trees. Currently, section headers lack expandability indicators, and the tree action buttons (reset/unpin) have no press feedback. Other components in the app already establish these patterns: `app-route-display` uses a `▸` chevron for expandability, and `app-build-options` uses `scale(0.95)` on `:active` for button press effects.

## Goals / Non-Goals

**Goals:**

- Add `▸` chevron to section headers matching the style in `app-route-display`
- Add `:active` press effect to tree action buttons matching `app-build-options`
- Maintain existing ARIA tab/tabpanel semantics and keyboard navigation

**Non-Goals:**

- Changing the expand/collapse behavior or animation
- Modifying button functionality or adding new buttons
- Changing the component's ARIA roles or keyboard navigation

## Decisions

### Chevron implementation

**Decision:** Add a `<span>` element with `&#9656;` (▸) to each section header, styled with the same properties as `app-route-display` chevron: `$font-size-xl` (20px), `$text-secondary` color, `transform: rotate(0deg)` collapsed / `rotate(90deg)` expanded.

**Alternative considered:** Use CSS `::after` pseudo-element. Rejected because the chevron needs to rotate based on the expanded state, which is cleaner with a real element bound to the state.

### Press effect implementation

**Decision:** Add `&:active { transform: scale(0.95); }` to the tree action button styles, directly matching the `app-build-options` pattern.

**Alternative considered:** Use `transition: transform 0.1s` for smoother feedback. Rejected for consistency with `app-build-options` which has no transition on the press effect.

## Risks / Trade-offs

- **Risk:** Visual-only change; no functional impact expected
- **Mitigation:** Verify keyboard navigation still works with chevron markup added

## Migration Plan

No migration needed. Changes are purely visual and backward-compatible.
