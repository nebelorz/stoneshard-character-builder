## 1. Component Structure

- [x] 1.1 Create `FooterComponent` at `src/app/layout/footer/footer.ts` with standalone component, version constant, URLs, and Stoneshard data version string
- [x] 1.2 Create `src/app/layout/footer/footer.html` with footer markup: version span, Discord link, GitHub link, info icon with `appTooltip`
- [x] 1.3 Create `src/app/layout/footer/footer.scss` with footer styling using project variables (`$border-dim`, `$text-secondary`, `$font-size-xs`)

## 2. Integration

- [x] 2.1 Import and add `<app-footer>` to `src/app/layout/left-sidenav/left-sidenav.html` after `<app-build-options>`
- [x] 2.2 Register `FooterComponent` in `left-sidenav.ts` imports array

## 3. Verification

- [x] 3.1 Run `npm run lint` and verify no errors
- [x] 3.2 Run `ng build` and verify the build succeeds
- [x] 3.3 Manual check: footer appears at the bottom of the left sidenav below build-options, info icon tooltip shows on hover
