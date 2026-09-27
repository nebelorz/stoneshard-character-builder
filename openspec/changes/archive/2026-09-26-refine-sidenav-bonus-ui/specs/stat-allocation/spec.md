# stat-allocation delta

## MODIFIED Requirements

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
