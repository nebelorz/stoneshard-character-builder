## MODIFIED Requirements

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
