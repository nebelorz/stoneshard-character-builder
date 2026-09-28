## 1. Make the card pointer-inert

- [x] 1.1 Set `pointer-events: none` on `.ability-tooltip` in `ability-icon.scss` and verify pointer input passes through the card to the tree underneath
- [x] 1.2 Remove the card's `mouseenter`/`mouseleave` retention handlers and their methods in `ability-icon.html` and `ability-icon.ts`, keeping `focusin`/`focusout` and Escape, and verify the component still builds and the existing `ability-icon` specs pass

## 2. Tune appearance and hide timing

- [x] 2.1 Add a ~120ms show delay on hover and an immediate show on keyboard focus, and verify the difference by hovering versus tab-focusing an icon
- [x] 2.2 Reduce the hide delay to ~60ms and verify the card hides promptly when leaving an icon while tolerating the icon hover-scale transition without flicker
- [x] 2.3 Update `ability-icon.spec.ts` with fake timers to cover delayed hover show, immediate focus show, and hide after the delay, and verify `npm test` passes

## 3. Wheel-to-scroll over the trigger

- [x] 3.1 Add a `wheel` listener on the trigger that scrolls the card body while the card is visible and overflows, and absorbs the wheel so the page does not scroll
- [x] 3.2 Block page scroll while the card is visible over the trigger, including at the card's scroll edge and when the content does not overflow
- [x] 3.3 Add unit coverage for wheel scrolling and page-scroll blocking, and verify `npm test` passes

## 4. Post-action and keyboard behavior

- [x] 4.1 Confirm obtaining or refunding an ability does not hide the card and that it stays until the pointer leaves the trigger, verifying on both an unlocked and an obtained icon
- [x] 4.2 Verify the overflow region is still keyboard focusable and that Escape hides the card

## 5. Verify integration

- [x] 5.1 Run `npm run lint` and fix any reported issues
- [x] 5.2 Run `npm run build` and confirm a clean production build
- [x] 5.3 Run the full `npm test` suite and confirm it passes
- [x] 5.4 Manually verify the core regression is fixed: moving the pointer from an icon toward the next ability to the right no longer leaves a card blocking the click
