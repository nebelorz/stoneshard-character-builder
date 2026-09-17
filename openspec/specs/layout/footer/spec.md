# layout/footer Specification

## Purpose

Provides a lightweight informational footer at the bottom of the left sidenav displaying the app version, author links, and Stoneshard game data version context.

## Requirements

### Requirement: Footer displays app version

The system SHALL display the current app version string in the footer, prefixed with `v`.

#### Scenario: Version shown on render

- **WHEN** the left sidenav renders
- **THEN** the footer displays the app version (e.g., `v0.0.1b`)

### Requirement: Footer displays Discord link

The system SHALL display a Discord profile link in the footer that opens in a new tab.

#### Scenario: Discord link opens profile

- **WHEN** the user clicks the Discord link in the footer
- **THEN** the Discord profile URL opens in a new browser tab

#### Scenario: Discord link has accessible label

- **WHEN** the Discord link renders
- **THEN** it has an aria-label describing its purpose

### Requirement: Footer displays GitHub link

The system SHALL display a GitHub repository link in the footer that opens in a new tab.

#### Scenario: GitHub link opens repository

- **WHEN** the user clicks the GitHub link in the footer
- **THEN** the GitHub repository URL opens in a new browser tab

#### Scenario: GitHub link has accessible label

- **WHEN** the GitHub link renders
- **THEN** it has an aria-label describing its purpose

### Requirement: Footer displays info icon with tooltip

The system SHALL display an info icon in the footer that shows a tooltip on hover with the Stoneshard game data version.

#### Scenario: Tooltip appears on hover

- **WHEN** the user hovers over the info icon
- **THEN** a tooltip appears showing the Stoneshard data version (e.g., `"Stoneshard v0.1.0.1 data"`)

#### Scenario: Tooltip positioned to the right

- **WHEN** the tooltip appears
- **THEN** it is positioned to the right of the info icon

#### Scenario: Tooltip dismissible via Escape

- **WHEN** the tooltip is visible and the user presses Escape
- **THEN** the tooltip is hidden

### Requirement: Footer sits at the bottom of the left sidenav

The system SHALL position the footer at the very bottom of the left sidenav, below the build action buttons.

#### Scenario: Footer at bottom edge

- **WHEN** the left side nav renders
- **THEN** the footer is positioned at the bottom edge of the sidenav below the build options area

#### Scenario: Footer always visible

- **WHEN** the user interacts with the application
- **THEN** the footer remains visible at the bottom of the left sidenav
