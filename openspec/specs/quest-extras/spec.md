# quest-extras Specification

## Purpose

Manage optional quest reward allocations that are independent of the normal SP/AP system, allowing players to plan builds that include special bonuses like the Boulder Circle quest reward.

## Requirements

### Requirement: Quest extras state tracking

The system SHALL represent quest point rewards as entries in the unified `bonusSlots` build state list (see the bonus-points capability), identified by quest source ids such as `boulder-circle`, rather than a bespoke state field.

#### Scenario: Initial state

- **WHEN** a new build is created
- **THEN** no bonus slots exist for any quest

#### Scenario: Allocation persisted

- **WHEN** the user allocates the Boulder Circle bonus to a stat
- **THEN** a `boulder-circle` slot entry exists with that stat key

#### Scenario: Deallocation persisted

- **WHEN** the user deallocates the bonus
- **THEN** the `boulder-circle` slot entry is removed

### Requirement: Quest extras dropdown display

The system SHALL display quest point slots in the left sidenav Quests section (placed after the stats panel), replacing the previous right sidenav Extras dropdown.

#### Scenario: Unallocated display

- **WHEN** the Boulder Circle slot is unallocated
- **THEN** the dropdown displays a "-" placeholder

#### Scenario: Allocated display

- **WHEN** the Boulder Circle slot is allocated to STR
- **THEN** the dropdown displays a "+1 STR" chip with the STR color

### Requirement: Bonus allocation via dropdown

The system SHALL allow the user to allocate the Boulder Circle bonus to any stat by selecting from the dropdown in the Quests section.

#### Scenario: Allocate bonus

- **WHEN** the user selects "+1 STR" from the dropdown
- **THEN** the Boulder Circle slot is allocated to STR

#### Scenario: Move allocation

- **WHEN** the user selects "+1 AGI" while the Boulder Circle slot is allocated to STR
- **THEN** the slot is reallocated to AGI

#### Scenario: Deallocate bonus

- **WHEN** the user selects "-" from the dropdown
- **THEN** the Boulder Circle slot is cleared

### Requirement: Bonus persists across character changes

The system SHALL preserve quest bonus slot allocations when the user switches characters.

#### Scenario: Character switch

- **WHEN** the user switches from Character A to Character B
- **THEN** the Boulder Circle allocation remains unchanged

### Requirement: Bonus resets on full reset

The system SHALL clear quest bonus slot allocations when the user performs a full build reset.

#### Scenario: Full reset

- **WHEN** the user clicks the reset button
- **THEN** all quest bonus slots are cleared
