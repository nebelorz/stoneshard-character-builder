# stat-allocation Specification

## Purpose

Allow users to allocate and deallocate stat points across five attributes (STR, AGI, PER, VIT, WIL) with defined limits.

## Requirements

### Requirement: Stat increment

The system SHALL allow the user to increment a stat by spending 1 SP, up to a maximum of 30 per stat.

#### Scenario: Increment stat

- **WHEN** the user clicks the increment button for a stat
- **THEN** 1 SP is deducted and the stat increases by 1

#### Scenario: Increment blocked when no SP

- **WHEN** the user clicks the increment button and SP is 0
- **THEN** no stat change occurs

#### Scenario: Increment blocked at max

- **WHEN** the user clicks the increment button and the stat is at 30
- **THEN** no stat change occurs

### Requirement: Stat decrement

The system SHALL allow the user to deallocate a stat point, returning 1 SP, provided the stat is above the character's base value.

#### Scenario: Decrement stat

- **WHEN** the user clicks the decrement button for a stat
- **THEN** 1 SP is returned and the stat decreases by 1

#### Scenario: Decrement blocked at base

- **WHEN** the user clicks the decrement button and the stat equals the character's base value
- **THEN** no stat change occurs

### Requirement: Increment by 5

The system SHALL allow the user to increment a stat by up to 5 points in a single action, limited by available SP and the 30-point cap.

#### Scenario: Increment 5 within limits

- **WHEN** the user clicks +5 for a stat with at least 5 SP remaining and stat below 25
- **THEN** 5 SP are deducted and the stat increases by 5

#### Scenario: Increment 5 partial

- **WHEN** the user clicks +5 for a stat with fewer than 5 SP remaining
- **THEN** all remaining SP are deducted and the stat increases by that amount

### Requirement: Decrement by 5

The system SHALL allow the user to deallocate up to 5 stat points in a single action, limited by how far above base the stat is.

#### Scenario: Decrement 5 within limits

- **WHEN** the user clicks -5 for a stat that is at least 5 points above base
- **THEN** 5 SP are returned and the stat decreases by 5

#### Scenario: Decrement 5 partial

- **WHEN** the user clicks -5 for a stat that is fewer than 5 points above base
- **THEN** the stat decreases to the base value and the difference in SP is returned

### Requirement: Stat history tracking

The system SHALL record each stat assignment with its level and order within that level for build history display.

#### Scenario: Stat assignment recorded

- **WHEN** the user increments a stat
- **THEN** a stat history entry is added with the current level, order, and stat name

### Requirement: Stat history in shared URL

The system SHALL include statHistory in the serialized build state so recipients can see the full build order.

#### Scenario: Shared URL contains stat history

- **WHEN** a user shares a build via URL
- **THEN** the recipient can see the complete stat assignment history

### Requirement: Stat decrement releases level lock

Decrementing a stat SHALL also remove the record that blocked level-down for the level the removed stat assignment was placed at.

#### Scenario: Single decrement unlocks level

- **WHEN** the user decrements a stat by 1 and the removed assignment was the only action at its level
- **THEN** 1 SP is returned, the stat decreases by 1, and the affected level becomes eligible for level-down

#### Scenario: Decrement by 5 unlocks levels

- **WHEN** the user decrements a stat by 5 and the removed assignments were the only actions at their levels
- **THEN** 5 SP are returned and every affected level becomes eligible for level-down
