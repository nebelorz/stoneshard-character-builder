# bonus-points delta

## MODIFIED Requirements

### Requirement: Stat display aggregation

The system SHALL display each stat value in the stats panel as the sum of the character base value, route (level-up) increments, and allocated bonus slot increments, with a visible indicator for the bonus contributions on stats that have them. The bonus indicator SHALL occupy a reserved fixed-width space so stat rows do not shift layout when indicators appear, change value, or disappear. The route stat values held in the build state SHALL NOT include bonus points.

#### Scenario: Combined display

- **WHEN** Velmir has base VIT 10, no route increments in VIT, Boulder Circle allocated to VIT, and 3 trait slots allocated to VIT
- **THEN** the stats panel displays VIT as 14 with bonus indicators

#### Scenario: Route value unchanged by bonus

- **WHEN** a bonus slot is allocated to a stat
- **THEN** the route stat value for that stat is unchanged and only the displayed value increases

#### Scenario: Indicator space reserved

- **WHEN** bonus indicators appear on some stat rows and not others
- **THEN** all stat rows keep identical control alignment because the indicator space is reserved in every row
