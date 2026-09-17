## Context

The left sidenav is a fixed-position flex column (`height: 100vh`) with `character-panel` at the top and `build-options` pushed to the bottom via `margin-top: auto`. The footer slots below `build-options`, naturally hugging the bottom edge without any layout restructuring.

The project uses Angular 22 with standalone components, Phosphor icons via `@ng-icons/phosphor-icons`, and an existing `appTooltip` directive backed by CDK Overlay.

## Goals / Non-Goals

**Goals:**

- Add a minimal footer component to the left sidenav displaying version, links, and info tooltip
- Reuse existing tooltip directive and icon library
- Zero layout impact on main content area

**Non-Goals:**

- Mobile-responsive footer (desktop focus)
- Dynamic or configurable content (static per release)
- Full-width viewport footer

## Decisions

### Component location: `src/app/layout/footer/`

The footer is a layout concern (always present in the sidenav), not feature-specific. Placing it under `layout/` alongside `left-sidenav/` and `right-sidenav/` follows the project's existing organization.

**Alternative considered:** Placing it inside `features/build/` since it sits near build-options. Rejected because the footer is not related to build functionality.

### Data source: Hardcoded in component

Version and URLs are static constants in the component class. The `version` could alternatively import from `package.json` (like dura-vault-spa), but hardcoding keeps it explicit and decoupled from npm versioning.

**Alternative considered:** Import version from `package.json` via `import { version } from '../../../../package.json'`. Deferred - can be adopted later if desired.

### Tooltip: Reuse existing `appTooltip` directive

The info icon uses the existing `appTooltip` directive with `tooltipPlacement="right"`. This leverages the established CDK Overlay tooltip pattern, ARIA association, and Escape dismiss behavior.

**Alternative considered:** Native `title` attribute. Rejected because it lacks styling control and has no accessible description association.

### Icons: Phosphor icon set

Use `phosphorDiscordLogo`, `phosphorGithubLogo`, and `phosphorInfo` from `@ng-icons/phosphor-icons/regular`. The project already depends on this package.

## Risks / Trade-offs

- [Footer squeezes build-options upward] The footer adds ~30-40px to the bottom of the sidenav. Since `build-options` uses `margin-top: auto`, this only matters if the sidenav content exceeds viewport height. Mitigation: the sidenav is designed for desktop with fixed height, and character panel content is bounded.

- [Static data drifts from actual releases] Version strings must be manually updated each release. Mitigation: the component is small and obvious; a quick search for the version constant finds it immediately.

## Open Questions

None. All decisions are resolved.
