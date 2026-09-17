# build-reset Specification

## Purpose

Allow users to reset their build to the initial state for the current character.

## Requirements

### Requirement: Reset build

The system SHALL provide a reset button that clears all obtained abilities, stat allocations, stat history, and returns to the level-30 initial state with 31 AP and 29 SP.

#### Scenario: Full reset

- **WHEN** the user confirms the reset action
- **THEN** the build returns to the level-30 initial state for the selected character with 31 AP and 29 SP

#### Scenario: Reset preserves character

- **WHEN** the user resets the build
- **THEN** the selected character remains unchanged

#### Scenario: Reset preserves pinned trees

- **WHEN** the user resets the build
- **THEN** the pinned trees remain the same

### Requirement: Reset confirmation

The system SHALL require confirmation before performing a reset, using a popup dialog.

#### Scenario: Confirm popup shown

- **WHEN** the user clicks the reset button
- **THEN** a confirmation popup appears with the message "Reset your build to default? This cannot be undone."

#### Scenario: Confirm reset

- **WHEN** the user clicks "Confirm" in the reset popup
- **THEN** the build is reset and the popup closes

#### Scenario: Cancel reset

- **WHEN** the user clicks "Cancel" in the reset popup
- **THEN** no reset occurs and the popup closes
