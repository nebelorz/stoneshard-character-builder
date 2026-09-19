## Purpose

Manage optional quest reward allocations that are independent of the normal SP/AP system, allowing players to plan builds that include special bonuses like the Boulder Circle quest reward.

## ADDED Requirements

### Requirement: Quest extras state tracking

The system SHALL maintain a `boulderCircleStat` field in the build state that tracks which stat received the Boulder Circle bonus, or null if unallocated.

#### Scenario: Initial state

- **WHEN** a new build is created
- **THEN** `boulderCircleStat` is set to null

#### Scenario: Allocation persisted

- **WHEN** the user allocates the bonus to a stat
- **THEN** `boulderCircleStat` is set to that stat key

#### Scenario: Deallocation persisted

- **WHEN** the user deallocates the bonus
- **THEN** `boulderCircleStat` is set to null

### Requirement: Quest extras dropdown display

The system SHALL display a dropdown in the right sidebar "Extras" section showing the current Boulder Circle allocation status.

#### Scenario: Unallocated display

- **WHEN** `boulderCircleStat` is null
- **THEN** the dropdown displays "-"

#### Scenario: Allocated display

- **WHEN** `boulderCircleStat` is "STR"
- **THEN** the dropdown displays "+1 STR"

### Requirement: Bonus allocation via dropdown

The system SHALL allow the user to allocate the Boulder Circle bonus to any stat by selecting from the dropdown.

#### Scenario: Allocate bonus

- **WHEN** the user selects "+1 STR" from the dropdown
- **THEN** `boulderCircleStat` is set to "STR"

#### Scenario: Move allocation

- **WHEN** the user selects "+1 AGI" while `boulderCircleStat` is "STR"
- **THEN** `boulderCircleStat` is set to "AGI"

#### Scenario: Deallocate bonus

- **WHEN** the user selects "-" from the dropdown
- **THEN** `boulderCircleStat` is set to null

### Requirement: Bonus stat bypasses cap

The system SHALL allow the bonus stat point to bypass the MAX_STAT cap of 30, enabling a stat to reach 31.

#### Scenario: Bonus at cap

- **WHEN** a stat is at 30 from normal SP allocation
- **THEN** the bonus can still be allocated to that stat, making it 31

### Requirement: Bonus persists across character changes

The system SHALL preserve the Boulder Circle allocation when the user switches characters.

#### Scenario: Character switch

- **WHEN** the user switches from Character A to Character B
- **THEN** `boulderCircleStat` remains unchanged

### Requirement: Bonus resets on full reset

The system SHALL clear the Boulder Circle allocation when the user performs a full build reset.

#### Scenario: Full reset

- **WHEN** the user clicks the reset button
- **THEN** `boulderCircleStat` is set to null

### Requirement: Bonus in URL sharing

The system SHALL include `boulderCircleStat` in the serialized build state for URL sharing.

#### Scenario: Shared URL contains bonus state

- **WHEN** a user shares a build via URL
- **THEN** the recipient can see the Boulder Circle allocation

#### Scenario: Backward compatible loading

- **WHEN** a URL is loaded that does not contain `boulderCircleStat`
- **THEN** the system treats it as null (unallocated)
