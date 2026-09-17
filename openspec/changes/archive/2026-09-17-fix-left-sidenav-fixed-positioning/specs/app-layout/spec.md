## ADDED Requirements

### Requirement: Left sidenav stays fixed when scrolling

The system SHALL keep the left sidenav visible at the left edge of the viewport regardless of how far the user scrolls the main content area.

#### Scenario: Left sidenav visible after scrolling

- **WHEN** the user scrolls down in the main content area
- **THEN** the left sidenav remains visible at the left edge of the viewport

#### Scenario: Left sidenav matches right sidenav behavior

- **WHEN** the user scrolls down in the main content area
- **THEN** the left sidenav stays fixed in place, identical to the right sidenav behavior

### Requirement: Main content reserves left sidenav width

The system SHALL reserve the width of the left sidenav in the main content area so content is not obscured by the fixed-position left sidenav.

#### Scenario: Content does not overlap left sidenav

- **WHEN** the left sidenav is visible
- **THEN** the main content area starts to the right of the left sidenav without overlap
