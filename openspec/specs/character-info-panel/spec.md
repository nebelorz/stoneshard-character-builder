# character-info-panel Specification

## Purpose

Displays the selected character's starting ability trees in a compact side-nav panel below the character stats.

## Requirements

### Requirement: Starting trees display

The system SHALL display the selected character's starting trees in a side-nav character info panel located below the character stats, listing each tree with its name and icon.

#### Scenario: Panel shows starting trees

- **WHEN** the app loads with a character selected
- **THEN** the side-nav character info panel lists every tree in the character's traitsUnlockedOnStart with its name and icon

#### Scenario: Panel follows character selection

- **WHEN** the user selects a different character
- **THEN** the panel updates to show that character's starting trees

#### Scenario: No starting trees

- **WHEN** the selected character has an empty traitsUnlockedOnStart
- **THEN** the panel shows no starting trees and takes no extra vertical space

#### Scenario: Panel is keyboard accessible

- **WHEN** the user tabs through the side nav
- **THEN** each starting tree in the panel is reachable with a visible focus indicator
