# app-layout Specification

## Purpose

Describes the composition of the left side nav and the main content boundary relative to the right nav's always-visible toggle strip.

## Requirements

### Requirement: Build action buttons in side nav

The system SHALL display the Reset, Share, and AI Prompt build action buttons in a build options area at the bottom of the left side nav, below the character info panel.

#### Scenario: Build options at bottom of side nav

- **WHEN** the left side nav renders with a character selected
- **THEN** the build action buttons appear at the bottom of the side nav below the character info panel

#### Scenario: Build actions unchanged

- **WHEN** the user clicks a build action button in the side nav
- **THEN** the same Reset, Share, and AI Prompt behavior is triggered as before

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
