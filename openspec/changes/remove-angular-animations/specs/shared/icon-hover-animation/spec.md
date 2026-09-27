## REMOVED Requirements

### Requirement: Animation SHALL be reusable

**Reason**: The reusable mechanism moves from an Angular animation trigger/directive to a shared CSS class now that `@angular/animations` is removed and the `appIconHover` directive is deleted.
**Migration**: Apply the shared hover CSS class to any element directly or through a host binding; no Angular animation import is required.

## ADDED Requirements

### Requirement: Icon hover effect SHALL be reusable as CSS

The system SHALL provide the icon hover effect as a reusable, framework-agnostic CSS class that can be applied to any element directly or through a host binding, so consumers get the same zoom-and-jiggle feedback without importing a JavaScript animation API.

#### Scenario: Class usage

- **WHEN** a component applies the shared hover class to an element
- **THEN** the zoom and jiggle effect activates on hover without additional configuration

#### Scenario: No framework animation API required

- **WHEN** the shared effect is consumed
- **THEN** it relies only on CSS transforms and keyframes with no dependency on a JavaScript animation package
