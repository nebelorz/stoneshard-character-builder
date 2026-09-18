## Context

The pin area uses a CSS Grid (`repeat(auto-fill, 280px)` with `gap: 16px`) to lay out pinned tree cards. When a card is unpinned, Angular's `@fadeInOut` `:leave` transition fades its opacity, but the DOM element is removed immediately. The grid reflows the remaining cards instantly, causing a harsh snap.

The existing `fadeInOut` animation from `src/app/shared/animations/fade.ts` only handles individual element enter/leave. It does not animate sibling repositioning.

## Goals / Non-Goals

**Goals:**

- When a tree card is unpinned, remaining cards shift smoothly into their new grid positions with a staggered delay
- Keep the fade-out animation on the unpinned card

**Non-Goals:**

- Changing the grid layout or column sizing
- Animating card entrance on pin (already handled by `fadeInOut` `:enter`)
- Changing the tree selector or other UI elements

## Decisions

### 1. Replace `fadeInOut` with a custom animation trigger using `query` and `stagger`

**Decision**: Create a new animation trigger (e.g., `cardReflow`) in `fade.ts` that combines:

- `:leave` - fade out the removed card
- After the leave completes, `query` the remaining cards and apply a staggered `transform: translateX()` shift that brings them from their old position to their new one

**Alternative considered**: Keep `fadeInOut` and add a separate CSS transition on `.pin-area__card` for `transform`. Rejected because CSS transitions on grid-positioned elements don't reliably detect when the element's grid slot changes - Angular animations give explicit control over timing.

**Rationale**: Angular's `query` with `stagger` lets us target sibling elements after a leave transition completes. The `stagger` function distributes a delay across matched elements, creating the cascading shift effect. We use `animateChild()` to ensure the existing `:enter` animations on remaining cards still fire correctly.

### 2. Use `transform: translateX(-Npx)` with a small offset for the stagger

**Decision**: Each remaining card gets a brief `translateX(-10px)` that transitions to `translateX(0)`, creating a subtle slide-in from the left as it takes the departed card's slot.

**Alternative considered**: Use `translateY` for a vertical shift. Rejected because the grid flows horizontally first - cards move left to fill gaps, not up.

**Rationale**: The 10px shift is small enough to feel natural (not distracting) but visible enough to smooth the reflow. Combined with a 100ms stagger per card, the effect is quick (under 300ms total for 3 cards).

## Risks / Trade-offs

- **[Risk] Stagger timing feels slow with many cards** - If 5+ cards are pinned, the total animation time could exceed 500ms. **Mitigation**: Cap the stagger delay so total animation stays under 300ms regardless of card count.

- **[Trade-off] Custom animation trigger vs. reusable utility** - The `cardReflow` trigger is specific to the pin area grid. **Mitigation**: Keep it in `fade.ts` alongside existing triggers; if another grid needs similar behavior, it can be generalized later.

## Migration Plan

No migration needed - this is a visual improvement with no API, state, or URL changes.
