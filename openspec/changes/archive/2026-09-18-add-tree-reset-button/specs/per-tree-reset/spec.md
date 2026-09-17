## Purpose

Allow users to reset all obtained abilities in a single pinned tree back to defaults, restoring spent AP, without affecting other trees, stats, or the pin state.

## ADDED Requirements

### Requirement: Reset pinned tree abilities

The system SHALL provide a reset control on each pinned tree card that refunds all obtained abilities in that tree, returning spent AP to the user.

#### Scenario: Reset clears obtained abilities

- **WHEN** the user clicks the reset button on a pinned tree card
- **THEN** all obtained abilities belonging to that tree are refunded and the corresponding AP is restored

#### Scenario: Reset preserves default abilities

- **WHEN** the user resets a tree that has configured default abilities (e.g., Butchering in the survival tree)
- **THEN** those default abilities remain active and are not affected by the reset

#### Scenario: Reset preserves pin state

- **WHEN** the user resets a pinned tree
- **THEN** the tree remains pinned in the pinned trees area

#### Scenario: Reset preserves other trees

- **WHEN** the user resets a pinned tree while other trees are pinned
- **THEN** obtained abilities in other pinned trees are unaffected

#### Scenario: Reset preserves stats and level

- **WHEN** the user resets a pinned tree
- **THEN** stat allocations, level, SP, and all non-ability state remain unchanged

#### Scenario: No abilities to reset

- **WHEN** the user clicks the reset button on a pinned tree that has no obtained abilities (only defaults)
- **THEN** no state change occurs

### Requirement: Reset button visibility

The system SHALL display the reset button on each pinned tree card, visible on hover, positioned to the left of the unpin (close) button.

#### Scenario: Reset button appears on hover

- **WHEN** the user hovers over a pinned tree card
- **THEN** the reset button becomes visible alongside the unpin button

#### Scenario: Reset button hidden by default

- **WHEN** the pinned tree card is not hovered
- **THEN** the reset button is hidden
