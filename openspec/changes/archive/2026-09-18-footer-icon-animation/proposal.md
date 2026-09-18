## Why

The footer icons (Discord, GitHub, Heart, Info) are static and lack visual feedback on interaction. Adding a subtle hover animation improves perceived responsiveness and polish. The animation should be reusable for any interactive icon across the app.

## What Changes

- Add a shared hover animation (zoom + jiggle) as a reusable Angular animation trigger
- Apply the animation to all footer icons on hover
- Create a directive alternative for cases where animation triggers are impractical

## Capabilities

### New Capabilities

- `shared/icon-hover-animation`: Reusable animation trigger and/or directive for subtle zoom and jiggle effects on icons

### Modified Capabilities

- `layout/footer`: Footer icons gain hover animation behavior

## Impact

- `src/app/shared/animations/`: New animation file added
- `src/app/shared/directives/`: Potential new directive for animation
- `src/app/layout/footer/`: Template and possibly SCSS updated to use animation
- No breaking changes; animation is purely visual enhancement
