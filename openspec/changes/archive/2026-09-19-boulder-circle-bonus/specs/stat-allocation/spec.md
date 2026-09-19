## MODIFIED Requirements

### Requirement: Stat increment

The system SHALL allow the user to increment a stat by spending 1 SP, up to a maximum of 30 per stat. When the Boulder Circle bonus is allocated to a stat, that stat MAY exceed 30 up to 31.

#### Scenario: Increment stat

- **WHEN** the user clicks the increment button for a stat
- **THEN** 1 SP is deducted and the stat increases by 1

#### Scenario: Increment blocked when no SP

- **WHEN** the user clicks the increment button and SP is 0
- **THEN** no stat change occurs

#### Scenario: Increment blocked at max

- **WHEN** the user clicks the increment button and the stat is at 30 (and does not have the Boulder Circle bonus)
- **THEN** no stat change occurs

#### Scenario: Increment with bonus above cap

- **WHEN** the user clicks the increment button for a stat that has the Boulder Circle bonus allocated and is at 30
- **THEN** the stat can still be incremented (up to 31)
