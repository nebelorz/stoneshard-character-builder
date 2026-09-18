## MODIFIED Requirements

### Requirement: Main content reserves left sidenav width

The system SHALL reserve the width of the left sidenav in the main content area so content is not obscured by the fixed-position left sidenav. The main content area SHALL NOT display until it is fully loaded and positioned correctly, preventing any layout shift of the tree selector on initial page load.

#### Scenario: Content does not overlap left sidenav

- **WHEN** the left sidenav is visible
- **THEN** the main content area starts to the right of the left sidenav without overlap

#### Scenario: No layout shift on page load

- **WHEN** the page finishes loading and data is ready
- **THEN** the main content (including tree selector) appears at its final position without shifting from a different location
