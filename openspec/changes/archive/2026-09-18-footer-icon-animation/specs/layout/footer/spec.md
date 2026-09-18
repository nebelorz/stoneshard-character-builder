## MODIFIED Requirements

### Requirement: Footer displays Discord link

The system SHALL display a Discord profile link in the footer that opens in a new tab. The link icon SHALL have a hover animation providing visual feedback.

#### Scenario: Discord link opens profile

- **WHEN** the user clicks the Discord link in the footer
- **THEN** the Discord profile URL opens in a new browser tab

#### Scenario: Discord link has accessible label

- **WHEN** the Discord link renders
- **THEN** it has an aria-label describing its purpose

#### Scenario: Discord icon animates on hover

- **WHEN** the user hovers over the Discord link
- **THEN** the icon performs a subtle zoom and jiggle animation

### Requirement: Footer displays GitHub link

The system SHALL display a GitHub repository link in the footer that opens in a new tab. The link icon SHALL have a hover animation providing visual feedback.

#### Scenario: GitHub link opens repository

- **WHEN** the user clicks the GitHub link in the footer
- **THEN** the GitHub repository URL opens in a new browser tab

#### Scenario: GitHub link has accessible label

- **WHEN** the GitHub link renders
- **THEN** it has an aria-label describing its purpose

#### Scenario: GitHub icon animates on hover

- **WHEN** the user hovers over the GitHub link
- **THEN** the icon performs a subtle zoom and jiggle animation

### Requirement: Footer displays info icon with tooltip

The system SHALL display an info icon in the footer that shows a tooltip on hover with the Stoneshard game data version. The icon SHALL have a hover animation providing visual feedback.

#### Scenario: Tooltip appears on hover

- **WHEN** the user hovers over the info icon
- **THEN** a tooltip appears showing the Stoneshard data version (e.g., `"Stoneshard v0.1.0.1 data"`)

#### Scenario: Tooltip positioned to the right

- **WHEN** the tooltip appears
- **THEN** it is positioned to the right of the info icon

#### Scenario: Tooltip dismissible via Escape

- **WHEN** the tooltip is visible and the user presses Escape
- **THEN** the tooltip is hidden

#### Scenario: Info icon animates on hover

- **WHEN** the user hovers over the info icon
- **THEN** the icon performs a subtle zoom and jiggle animation
