## Context

The app loads data asynchronously, showing a centered loading spinner. When data arrives, the content area switches from spinner to `<app-pin-area>` which renders the tree selector at the top. This transition causes a visible layout shift: the tree selector briefly appears in the center (where the spinner was) then jumps to its correct position.

Additionally, pinned tree cards appear/disappear instantly in the pin area grid, and the builder options popover opens/closes without animation. The popover also lacks toggle behavior: clicking the same trigger button while open does nothing.

Existing animations live in `src/app/shared/animations/fade.ts` with `fadeInOut`, `fadeInOutFast`, and `expandCollapse` triggers. The popover component already uses `fadeInOutFast` on its content div.

## Goals / Non-Goals

**Goals:**

- Eliminate layout shift of tree selector on page load
- Add fade-in/fade-out transitions for pinned tree cards appearing/disappearing
- Add fade-in/fade-out transitions for popover open/close
- Add toggle behavior to builder options popover (click same button = close)

**Non-Goals:**

- Changing the popover positioning or overlay strategy
- Changing the tree selector's expand/collapse animation (already has `expandCollapse`)
- Changing the tooltip hover behavior (already works correctly)
- Adding animation to the right sidenav or other layout elements

## Decisions

### 1. Prevent layout shift by hiding main content until loaded

**Decision**: Keep the existing `@if/@else` structure in `app.html` but add `@fadeInOut` to the main content block so it fades in when data is ready, preventing the tree selector from rendering at the spinner's centered position.

**Alternative considered**: Use `visibility: hidden` or `opacity: 0` on the main content until loaded. Rejected because the existing `@fadeInOut` animation trigger already handles this pattern and keeps the code consistent.

**Rationale**: The current `@fadeInOut` on the loading spinner fades it out. Adding `@fadeInOut` to the `@else` block (the main content) will fade it in, and since Angular only renders the `@else` block when `isLoading()` is false, the tree selector will never be rendered at the spinner's centered position.

### 2. Add fade animation to pinned tree cards using Angular animation trigger

**Decision**: Create a new `fadeInOut` animation trigger on the `.pin-area__card` div in `pin-area.html` using the existing `fadeInOut` animation from `fade.ts`.

**Alternative considered**: Use CSS transitions with a class toggle. Rejected because Angular's `:enter`/`:leave` animations integrate cleanly with `@for` block updates and handle DOM insertion/removal automatically.

**Rationale**: The existing `fadeInOut` trigger (opacity 0->1 with translateY -4px->0) provides a subtle, polished effect. The `@for` block in `pin-area.html` already uses `track trackByTreeId`, so Angular will correctly identify added/removed items and apply enter/leave animations.

### 3. Add toggle behavior to PopupService

**Decision**: Add a `toggle(type, triggerElement)` method to `PopupService` that closes the popup if the same type is already open, otherwise opens it. Update `BuildOptionsComponent.openPopup()` to call `toggle()` instead of `open()`.

**Alternative considered**: Add toggle logic in `BuildOptionsComponent` by checking `popupService.isOpen()` and `popupService.type()`. Rejected because the toggle logic belongs in the service since it coordinates state across components.

**Rationale**: Centralizing toggle logic in the service keeps the component thin and ensures consistent behavior if other triggers use the same popup types.

### 4. Popover fade-in/fade-out is already implemented

**Finding**: The `PopoverComponent` already uses `@fadeInOutFast` on its content div. The fade-in works on open. The fade-out on close is handled by the `@if (isOpen())` guard - when `isOpen` becomes false, the `:leave` transition fires. This already works correctly.

**No change needed** for popover animation - the existing `fadeInOutFast` trigger handles both enter and leave.

## Risks / Trade-offs

- **[Risk] Layout shift fix may delay content visibility** - The fade-in on main content means users see nothing (or a fading-in blank area) briefly after loading completes. **Mitigation**: The `fadeInOut` animation is only 200ms, which is imperceptible as a delay but effective at preventing the jump.

- **[Risk] Tree card fade-out may feel slow during rapid unpinning** - If a user rapidly clicks unpin on multiple cards, each fade-out takes 150ms. **Mitigation**: The existing `fadeInOut` leave animation is 150ms (fast enough for rapid interactions). If needed, a faster variant could be used.

- **[Trade-off] Toggle in PopupService vs. component** - Putting toggle in the service means any caller gets toggle behavior automatically. This is desirable for build-options but could be surprising if another component calls `open()` expecting it to always open. **Mitigation**: Only build-options uses the popup system currently, and the method rename from `open` to `toggle` makes the intent clear.

## Migration Plan

No migration needed - all changes are internal UI behavior improvements with no API, state, or URL changes.
