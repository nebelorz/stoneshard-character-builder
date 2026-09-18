## 1. Animation Trigger

- [x] 1.1 Add a `cardReflow` animation trigger in `src/app/shared/animations/fade.ts` that combines a `:leave` fade-out with a `query` on remaining siblings that applies a staggered `translateX(-10px)` to `translateX(0)` shift. Verify: TypeScript compiles without errors.

## 2. Component Integration

- [x] 2.1 In `pin-area.ts`, replace the `fadeInOut` import with `cardReflow` and update the `animations` array. Verify: TypeScript compiles without errors.
- [x] 2.2 In `pin-area.html`, replace the `@fadeInOut` trigger on `.pin-area__card` with `@cardReflow`. Verify: pin 2+ trees, unpin one, and confirm remaining cards slide smoothly into position.
