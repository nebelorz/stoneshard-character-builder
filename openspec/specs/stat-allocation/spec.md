# stat-allocation Specification

## Purpose

Allow users to allocate and deallocate stat points across five attributes (STR, AGI, PER, VIT, WIL) with defined limits.

## Requirements

### Requirement: Stat increment

The system SHALL allow the user to increment a stat by spending 1 SP, up to a maximum route value of 30 per stat. The cap applies to the route value regardless of bonus allocations; bonus points are granted directly and never extend the route spending cap.

#### Scenario: Increment stat

- **WHEN** the user clicks the increment button for a stat
- **THEN** 1 SP is deducted and the stat increases by 1

#### Scenario: Increment blocked when no SP

- **WHEN** the user clicks the increment button and SP is 0
- **THEN** no stat change occurs

#### Scenario: Increment blocked at max

- **WHEN** the user clicks the increment button and the stat's route value has reached 30
- **THEN** no stat change occurs, even if bonus slots are allocated to that stat (displayed 31)

#### Scenario: Increment with bonus above cap

- **WHEN** the user clicks the increment button for a stat whose route value is 28 with 2 bonus slots allocated (displayed 30)
- **THEN** the route value increases to 29 and the stat displays 31

### Requirement: Stat decrement

The system SHALL allow the user to deallocate a route stat point, returning 1 SP, provided the stat's route value is above the character's base value. Route decrement buttons SHALL never remove a bonus point, because bonus points are not part of the route value.

#### Scenario: Decrement stat

- **WHEN** the user clicks the decrement button for a stat whose route value is above its base value
- **THEN** 1 SP is returned and the stat decreases by 1

#### Scenario: Decrement blocked at base

- **WHEN** the user clicks the decrement button and the stat's route value equals the character's base value
- **THEN** no stat change occurs, even if bonus slots are allocated to that stat

#### Scenario: Decrement leaves bonus intact

- **WHEN** a stat has base 10, one route increment, and one allocated bonus slot (displayed 12)
- **THEN** a single decrement brings the displayed value to 11 with the bonus count unchanged, and further decrements are blocked because the route value is at base

### Requirement: Increment by 5

The system SHALL allow the user to increment a stat by up to 5 points in a single action, limited by available SP and the flat 30-point route cap on the route value.

#### Scenario: Increment 5 within limits

- **WHEN** the user clicks +5 for a stat with at least 5 SP remaining and a route value below 25
- **THEN** 5 SP are deducted and the stat increases by 5

#### Scenario: Increment 5 partial

- **WHEN** the user clicks +5 for a stat with fewer than 5 SP remaining
- **THEN** all remaining SP are deducted and the stat increases by that amount

#### Scenario: Increment 5 partial at route cap

- **WHEN** the user clicks +5 for a stat whose route value is 28 with sufficient SP
- **THEN** the route value increases to 30 and 2 SP are deducted

#### Scenario: Increment 5 blocked at route cap

- **WHEN** the user clicks +5 for a stat whose route value is 30
- **THEN** no stat change occurs, even with bonus slots allocated to it

### Requirement: Decrement by 5

The system SHALL allow the user to deallocate up to 5 route stat points in a single action, limited by how far above the character's base value the stat's route value is.

#### Scenario: Decrement 5 within limits

- **WHEN** the user clicks -5 for a stat whose route value is at least 5 points above the base value
- **THEN** 5 SP are returned and the stat decreases by 5

#### Scenario: Decrement 5 partial

- **WHEN** the user clicks -5 for a stat whose route value is fewer than 5 points above the base value
- **THEN** the route value decreases to the base value and the difference in SP is returned, with bonus allocations unaffected

### Requirement: Stat history tracking

The system SHALL record each route stat assignment with its level and order within that level for build history display. Bonus slot allocations SHALL NOT be recorded in the stat history.

#### Scenario: Stat assignment recorded

- **WHEN** the user increments a stat via route spending
- **THEN** a stat history entry is added with the current level, order, and stat name

#### Scenario: Bonus allocation not recorded

- **WHEN** the user allocates a bonus slot to a stat
- **THEN** no stat history entry is added

### Requirement: Stat history in shared URL

The system SHALL include statHistory in the serialized build state so recipients can see the full build order. Bonus slot allocations SHALL be serialized separately (see the url-sharing capability).

#### Scenario: Shared URL contains stat history

- **WHEN** a user shares a build via URL
- **THEN** the recipient can see the complete stat assignment history

### Requirement: Stat decrement releases level lock

Decrementing a route stat SHALL also remove the record that blocked level-down for the level the removed stat assignment was placed at.

#### Scenario: Single decrement unlocks level

- **WHEN** the user decrements a stat by 1 and the removed assignment was the only action at its level
- **THEN** 1 SP is returned, the stat decreases by 1, and the affected level becomes eligible for level-down

#### Scenario: Decrement by 5 unlocks levels

- **WHEN** the user decrements a stat by 5 and the removed assignments were the only actions at their levels
- **THEN** 5 SP are returned and every affected level becomes eligible for level-down

### Requirement: Stat value includes bonus points

The stats panel SHALL display each stat as the route value (character base plus level-up increments, held in the build state) plus the count of bonus slots allocated to that stat, with visible markers distinguishing the bonus portion. The bonus marker SHALL occupy a reserved fixed-width space so stat rows do not shift layout when markers appear, change value, or disappear. The route stat values held in the build state SHALL NOT include bonus points.

#### Scenario: Bonus visible in stats panel

- **WHEN** a stat has route increments and allocated bonus slots
- **THEN** the displayed value is the sum of both, with markers for the bonus portion

#### Scenario: Route value excludes bonus

- **WHEN** a bonus slot is allocated to a stat
- **THEN** the route value stored in the build state is unchanged and only the displayed value increases

#### Scenario: Marker space reserved

- **WHEN** a bonus marker appears on one stat row while other stat rows have no bonus
- **THEN** all stat rows keep identical control alignment because the marker space is reserved in every row

#### Scenario: Marker changes do not shift layout

- **WHEN** a stat's bonus marker changes between values of different digit counts (e.g., "+9" to "+10")
- **THEN** the stat row's controls do not shift
