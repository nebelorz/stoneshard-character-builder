## Why

The left sidenav's bottom area has room for a lightweight informational footer. Users need quick access to the app version, author links (Discord/GitHub), and Stoneshard game data version context, without navigating away or hunting through README files.

## What Changes

- Add a new `FooterComponent` in `src/app/layout/footer/` that sits below the existing build-options area in the left sidenav.
- Display app version (`v0.0.1b`), Discord profile link, GitHub repository link, and an info icon with a hover tooltip showing the Stoneshard game data version.
- Reuse the existing `appTooltip` directive (placement: `right`) for the info icon tooltip.
- Use Phosphor icons (`phosphorDiscordLogo`, `phosphorGithubLogo`, `phosphorInfo`) consistent with the project's icon library.

## Capabilities

### New Capabilities

- `layout/footer`: Informational footer in the left sidenav showing app version, author links, and game data version tooltip.

### Modified Capabilities

- `app-layout`: The left sidenav bottom area now includes a footer component below the build action buttons. The footer is always visible and does not change existing build action behavior.

## Impact

- **Code**: New component at `src/app/layout/footer/`. Modification to `src/app/layout/left-sidenav/left-sidenav.html` and `.ts` to include the new component.
- **Dependencies**: No new dependencies. Uses existing `@ng-icons/phosphor-icons` and `appTooltip` directive.
- **Layout**: Zero layout impact. The footer slots below `build-options` which already uses `margin-top: auto` to sit at the bottom. The flex column arrangement naturally places the footer at the very bottom edge.
- **Accessibility**: The info icon tooltip reuses the existing accessible tooltip pattern (CDK Overlay, `aria-describedby`, Escape dismiss).
