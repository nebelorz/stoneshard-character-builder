## 1. Layout Shift Fix

- [x] 1.1 Add `@fadeInOut` animation trigger to the `<main>` element in `app.html` so the main content fades in when data is ready, preventing the tree selector from rendering at the spinner's centered position. Verify: load the app and confirm no layout shift of tree selector occurs.

## 2. Pinned Tree Card Animations

- [x] 2.1 Import `fadeInOut` animation in `pin-area.ts` and register it in the component's `animations` array. Verify: TypeScript compiles without errors.
- [x] 2.2 Add `@fadeInOut` trigger to the `.pin-area__card` div in `pin-area.html`. Verify: pin a tree and confirm it fades in; unpin a tree and confirm it fades out.

## 3. Popover Toggle Behavior

- [x] 3.1 Add a `toggle(type, triggerElement)` method to `PopupService` that closes the popup if the same type is already open, otherwise opens it. Verify: unit test or manual test that calling `toggle` twice closes the popup.
- [x] 3.2 Update `BuildOptionsComponent.openPopup()` to call `popupService.toggle()` instead of `popupService.open()`. Verify: click a build-options button to open its popover, click the same button again, and confirm the popover closes.
