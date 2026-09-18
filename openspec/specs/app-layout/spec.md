# app-layout Specification

## Purpose

Describes the composition of the left side nav and the main content boundary relative to the right nav's always-visible toggle strip.

## Requirements

### Requirement: Build action buttons in side nav

The system SHALL display the Reset, Share, and AI Prompt build action buttons in a build options area at the bottom of the left side nav, below the character info panel. Below the build options area, the system SHALL display an informational footer with app version, author links, and game data version.

#### Scenario: Build options at bottom of side nav

- **WHEN** the left side nav renders with a character selected
- **THEN** the build action buttons appear at the bottom of the side nav below the character info panel

#### Scenario: Build actions unchanged

- **WHEN** the user clicks a build action button in the side nav
- **THEN** the same Reset, Share, and AI Prompt behavior is triggered as before

#### Scenario: Footer below build options

- **WHEN** the left side nav renders
- **THEN** the informational footer appears below the build action buttons at the very bottom of the sidenav

### Requirement: Build action tooltips to the right

The system SHALL position the tooltips for the build action buttons to the right of the buttons so they stay inside the viewport.

#### Scenario: Tooltip appears to the right

- **WHEN** the user hovers a build action button
- **THEN** a tooltip appears to the right of the button

#### Scenario: Tooltip visible at left viewport edge

- **WHEN** the hovered build action button is at the left edge of the viewport
- **THEN** the tooltip remains fully visible inside the viewport

### Requirement: Main content reserves toggle strip width when right nav collapsed

The system SHALL reserve the width of the right nav toggle strip in the main content area when the right nav panel is collapsed, so content is not obscured by the always-visible toggle strip.

#### Scenario: Collapsed right nav reserves strip width

- **WHEN** the right nav panel is collapsed
- **THEN** the main content leaves at least the toggle strip width free on its right edge

#### Scenario: Expanded right nav reserves full panel width

- **WHEN** the right nav panel is expanded
- **THEN** the main content leaves the full right nav panel width free on its right edge

### Requirement: Toggle strip always visible

The system SHALL keep the right nav toggle strip visible on the right edge of the viewport regardless of whether the right nav panel is expanded or collapsed.

#### Scenario: Strip visible when collapsed

- **WHEN** the right nav panel is collapsed
- **THEN** the toggle strip remains visible on the right edge of the viewport

#### Scenario: Strip visible when expanded

- **WHEN** the right nav panel is expanded
- **THEN** the toggle strip remains visible on the right edge of the viewport

### Requirement: Left sidenav stays fixed when scrolling

The system SHALL keep the left sidenav visible at the left edge of the viewport regardless of how far the user scrolls the main content area.

#### Scenario: Left sidenav visible after scrolling

- **WHEN** the user scrolls down in the main content area
- **THEN** the left sidenav remains visible at the left edge of the viewport

#### Scenario: Left sidenav matches right sidenav behavior

- **WHEN** the user scrolls down in the main content area
- **THEN** the left sidenav stays fixed in place, identical to the right sidenav behavior

### Requirement: Main content reserves left sidenav width

The system SHALL reserve the width of the left sidenav in the main content area so content is not obscured by the fixed-position left sidenav. The main content area SHALL NOT display until it is fully loaded and positioned correctly, preventing any layout shift of the tree selector on initial page load.

#### Scenario: Content does not overlap left sidenav

- **WHEN** the left sidenav is visible
- **THEN** the main content area starts to the right of the left sidenav without overlap

#### Scenario: No layout shift on page load

- **WHEN** the page finishes loading and data is ready
- **THEN** the main content (including tree selector) appears at its final position without shifting from a different location
