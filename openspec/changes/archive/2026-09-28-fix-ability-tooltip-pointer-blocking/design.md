## Context

See proposal.md - Why for motivation. Relevant current state:

- The ability card is hand-rolled inside `ability-icon`. At runtime it is appended to `document.body` with `position: fixed` and positioned against the trigger's bounding rect: `iconRect.right + 12`, 320px wide, vertically centred on the icon, flipping to the left near the right viewport edge (`updateTooltipPosition` in `ability-icon.ts`).
- The card currently has `pointer-events: auto` and mouse-enter/leave handlers that cancel the hide timer, so it stays alive and on top (z-index max) while the pointer is over it. A 320px card to the right of a tightly packed icon grid covers several neighbouring icons.
- The card appears with no show delay and hides with a 150ms delay (`hideDelay` in `ability-icon.ts`). The scroll body is focusable when it overflows, and Escape hides the card.
- `.ability-icon` clips its contents (`overflow: hidden`) and scales on hover; the card lives in `body`, so it is not clipped.
- The `appEnrichedTooltip` system is non-interactive by contract and is not reused here.

## Goals / Non-Goals

**Goals:**

- Ensure the ability card never captures pointer input, so covered neighbours stay hoverable and clickable.
- Preserve reachability of long descriptions without pointer capture: wheel over the trigger icon plus existing keyboard access.
- Reduce lingering and flashing through tuned appearance and hide delays.

**Non-Goals:**

- Migrating the ability card onto `appEnrichedTooltip` or CDK Overlay.
- Changing card content, layout, width, or positioning rules.
- Touch and mobile interaction.
- Reworking the tree layout or the hover-highlight service.

## Decisions

**1. Make the card pointer-inert.**

Set `pointer-events: none` on the card surface. Because the card visually overlaps neighbours in a dense grid, any approach that lets the card receive pointer events will intercept the neighbour beneath it. Inertness is the only option that guarantees a covered neighbour can be hovered and clicked.

- Alternatives rejected: keeping pointer events with a geometric "safe corridor" (the neighbour and the card lie in the same direction, so direction cannot disambiguate); a document-level `elementFromPoint` guard (equivalent to native hover once the card is inert, but more code); moving the card to a fixed dock (a larger interaction redesign, tracked as a separate idea).

**2. Wheel-to-scroll anchored to the trigger icon.**

Attach a `wheel` listener on the trigger wrapper while its card is visible. When the card overflows, scroll the card body by the wheel delta; regardless of overflow, call `preventDefault` so the page never scrolls while the card is visible over the trigger. This keeps scroll-over-card out of the picture, so the pointer is never required over the card, and wheel over a covered neighbour behaves normally.

- Alternatives rejected: releasing the wheel to the page at the scroll edge or when the content does not overflow (the tooltip-then-page handoff feels like a jolt and is what this change removes); a document-level wheel listener (blocks page scroll even when the pointer is away from the trigger, which over-scopes the block); document-level wheel with a card-rectangle hit test (the pointer over the card also sits over a neighbour icon, so scrolling would fight card switching); no wheel support (leaves mouse users without a way to read long cards).

**3. Timers: delayed hover show, immediate focus show, short hide.**

Show the card after ~120ms on hover to avoid a card flashing on every icon while sweeping the grid, but show immediately on keyboard focus so the interaction feels responsive for keyboard users. Hide after ~60ms on leaving the trigger, which is enough to absorb the transient leave caused by the icon's hover scale while feeling immediate.

- Alternatives rejected: keeping an instant show (flashes per icon); reusing the enriched tooltip's 200ms for both hover and focus (too slow on focus, and its show path is shared).

**4. Drop card hover retention, keep keyboard focus handling.**

Remove the card's `mouseenter`/`mouseleave` retention; entering or leaving the card no longer affects the timer. Keep the card's `focusin`/`focusout` handling for the focusable overflow region and Escape dismissal, since focus events are unaffected by `pointer-events`.

**5. Card remains visible after obtaining or refunding.**

No immediate hide on action; the card updates in place and hides when the pointer leaves the trigger. This avoids the card snapping away at the moment the user is reading the change they just made.

## Risks / Trade-offs

- [A user who wants to scroll the page cannot do so while the pointer is parked on an icon whose card is visible] -> The block is scoped to the trigger icon only, so moving the pointer off the icon (where the card then hides) restores normal page scrolling.
- [Switching cards while moving across the card surface can feel jumpy] -> The ~120ms show delay dampens rapid sweeps, and the neighbour-hide effect keeps only one card visible.
- [The chosen delays are perception-sensitive] -> 120ms show, 60ms hide are tuning values, changeable without altering specs or approach.
- [Pointer-inert card removes mouse text selection inside the card] -> The card has no selectable controls today; no behavior is lost.
- [Focusable scroll region inside `role="tooltip"` remains unusual for ARIA] -> Unchanged from the current design; keep the trigger association via `aria-describedby` and treat the region as scrollable content only.
- [Touch devices cannot hover] -> Explicitly out of scope.

## Migration Plan

1. Update the component to add the hover show delay, the focus-immediate path, the ~60ms hide, and the trigger-anchored wheel-scroll handling.
2. Remove the card's hover retention handlers and set the card to `pointer-events: none`.
3. Verify manually: covered neighbours hover and click, long cards scroll with the wheel and the page stays put, keyboard focus and Escape still work.
4. Run lint, build, and the test suite.

Rollback is a revert of the component and style changes; no persisted state or data is affected.

## Open Questions

- None that would change the specs, the approach, or the task breakdown.
