# level-management Specification

## Purpose

Manage character level progression between 1 and 30, tracking ability points and stat points earned per level.

## Requirements

### Requirement: Level boundaries

The system SHALL restrict the character level to a minimum of 1 and a maximum of 30.

#### Scenario: Cannot level below 1

- **WHEN** the character is at level 1
- **THEN** the level decrement button is disabled

#### Scenario: Cannot level above 30

- **WHEN** the character is at level 30
- **THEN** the level increment button is disabled

### Requirement: Level up

The system SHALL increase the level by 1 and award 1 AP and 1 SP when the user levels up.

#### Scenario: Single level up

- **WHEN** the user clicks the level increment button
- **THEN** level increases by 1, AP increases by 1, and SP increases by 1

### Requirement: Level down

The system SHALL decrease the level by 1 and reclaim 1 AP and 1 SP when the user levels down, provided no abilities or stats were allocated at that level.

#### Scenario: Level down when no actions at level

- **WHEN** the user clicks the level decrement button and the current level has no abilities or stats assigned
- **THEN** level decreases by 1, AP decreases by 1, and SP decreases by 1

#### Scenario: Level down blocked when actions exist

- **WHEN** the user clicks the level decrement button and the current level has abilities or stats assigned
- **THEN** no level change occurs

### Requirement: Level up by 5

The system SHALL increase the level by 5 (or to level 30, whichever is less) and award AP and SP equal to the number of levels gained.

#### Scenario: Level up 5

- **WHEN** the user clicks the +5 level button
- **THEN** level increases by up to 5, and AP and SP each increase by the number of levels gained

### Requirement: Level down by 5

The system SHALL decrease the level by 5 (or to level 1, whichever is less), provided no abilities or stats were assigned at any of the levels being removed.

#### Scenario: Level down 5 when all target levels are empty

- **WHEN** the user clicks the -5 level button and none of the levels being removed have abilities or stats assigned
- **THEN** level decreases by up to 5, and AP and SP each decrease by the number of levels removed

#### Scenario: Level down 5 blocked when actions exist

- **WHEN** the user clicks the -5 level button and any of the levels being removed have abilities or stats assigned
- **THEN** no level change occurs

### Requirement: Level-down trims excess assignments

The system SHALL remove abilities and stats that exceed the capacity of the new level when leveling down.

#### Scenario: Excess abilities removed on level down

- **WHEN** the user levels down and the number of ability slots at the new level is fewer than the number of obtained abilities
- **THEN** the last abilities in the array are removed

#### Scenario: Excess stats removed on level down

- **WHEN** the user levels down and the number of stat slots at the new level is fewer than the number of stat assignments
- **THEN** the last stat assignments are removed

### Requirement: Ability slot capacity

The system SHALL allow 2 abilities at Level 1 and 1 ability per level at Level 2 and above.

#### Scenario: Level 1 has 2 ability slots

- **WHEN** abilities are assigned to Level 1
- **THEN** up to 2 abilities can be assigned

#### Scenario: Level 2+ has 1 ability slot

- **WHEN** abilities are assigned to Level 3
- **THEN** only 1 ability can be assigned

### Requirement: Stat slot capacity

The system SHALL allow 0 stat slots at Level 1 and 1 stat slot per level at Level 2 and above.

#### Scenario: Level 1 has no stat slots

- **WHEN** the user allocates stat points
- **THEN** no stat is placed at Level 1

#### Scenario: Level 2+ has 1 stat slot

- **WHEN** stat points are allocated
- **THEN** each level from 2 onward holds up to 1 stat assignment

### Requirement: Level-down lock reflects current assignments

The level-down lock SHALL be derived from the current assignment state, so removing abilities or stats from a level makes that level eligible for level-down again.

#### Scenario: Level down after stat decrement

- **WHEN** the user decrements a stat that was assigned to the current level and no other abilities or stats remain assigned at that level
- **THEN** the level becomes eligible for level-down

#### Scenario: Level down after ability refund

- **WHEN** the user refunds an ability that was assigned to the current level and no other abilities or stats remain assigned at that level
- **THEN** the level becomes eligible for level-down

#### Scenario: Level down after cascade refund

- **WHEN** a refund cascades to multiple abilities assigned across several levels and all removed assignments leave those levels empty
- **THEN** every affected level becomes eligible for level-down

#### Scenario: Level down still blocked while actions remain

- **WHEN** a refund or decrement removes some but not all assignments from a level
- **THEN** level-down remains blocked until all assignments at that level are removed

### Requirement: Initial level state

The system SHALL initialize a new build at level 30 with 31 ability points and 29 stat points available, matching the full unspent budget of progressing from level 1 to level 30.

#### Scenario: New build starts at level 30

- **WHEN** a new build is created for a character
- **THEN** the level is 30 with 31 unspent ability points and 29 unspent stat points

#### Scenario: Initial budget matches full progression

- **WHEN** the build is at the initial level-30 state
- **THEN** the unspent AP is 31 and the unspent SP is 29, equal to 2 AP plus 29 level-ups and 0 SP plus 29 level-ups
