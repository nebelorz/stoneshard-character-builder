## Context

The left sidenav uses `position: sticky; top: 0` which fails because the `<app-left-sidenav>` host element (display: inline by default) sits between the scroll container `.app-layout` and the sticky element `.left-sidenav`. The right sidenav uses `position: fixed` and works correctly.

## Goals / Non-Goals

**Goals:**

- Make the left sidenav stay fixed at the left edge of the viewport when scrolling, matching the right sidenav behavior

**Non-Goals:**

- Adding collapse/expand toggle to the left sidenav
- Changing the right sidenav behavior

## Decisions

### Use `position: fixed` instead of `position: sticky`

**Decision:** Change `.left-sidenav` from `position: sticky` to `position: fixed; left: 0`.

**Rationale:** `position: fixed` positions relative to the viewport, independent of parent scroll containers. This is the same approach used by the right sidenav and guarantees the element stays visible regardless of scroll position.

**Alternatives considered:**

- Fix `position: sticky` by adding `:host { display: block }` to the left sidenav component. Rejected because it adds unnecessary coupling between host element styling and scroll behavior.
- Use `position: sticky` with `overflow: visible` on parent. Rejected because it's fragile and browser-dependent.

### Add `margin-left` to `.app-content`

**Decision:** Add `margin-left: 260px` (matching the left sidenav width) to `.app-content` so the main content does not overlap the fixed-position left sidenav.

**Rationale:** Fixed-position elements are removed from document flow, so the flex layout no longer reserves space for the left sidenav. An explicit margin is the standard approach (already used for the right sidenav with `margin-right`).

### Remove `overflow-y: auto` from `.left-sidenav`

**Decision:** Remove `overflow-y: auto` from `.left-sidenav` since no content scrolls inside it.

**Rationale:** Unnecessary CSS property that could cause confusion. If internal scrolling is needed in the future, it can be added then.

## Risks / Trade-offs

- [Risk] Content below the left sidenav could be obscured if `margin-left` is not set correctly. → Mitigation: Use the existing `$left-sidenav-width` variable (260px) to keep values in sync.
- [Risk] CharacterSelectorComponent listens for `scroll` events on `.left-sidenav`. With `position: fixed` and no `overflow-y`, there will be no scroll events on that element. → Mitigation: The listener closes dropdowns on scroll; since the left sidenav no longer scrolls, this is harmless (dropdowns won't need closing from scroll).
