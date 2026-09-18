## 1. Shared Animation

- [x] 1.1 Create `src/app/shared/animations/icon-hover.ts` with `iconHover` animation trigger (zoom + jiggle) and verify it exports correctly
- [x] 1.2 Create `src/app/shared/directives/icon-hover.directive.ts` that applies the animation on hover and verify it compiles

## 2. Footer Integration

- [x] 2.1 Import `iconHover` trigger in footer component and add to `@Component` animations array
- [x] 2.2 Bind `@iconHover` to each footer icon link/span in the template and verify hover animation plays
- [x] 2.3 Verify all 4 icons (Discord, GitHub, Heart, Info) animate independently on hover

## 3. Verification

- [x] 3.1 Run `ng build` and verify no compilation errors
- [x] 3.2 Run existing tests and verify no regressions
