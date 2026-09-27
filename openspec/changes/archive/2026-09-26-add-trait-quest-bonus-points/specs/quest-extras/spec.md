# quest-extras delta

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Bonus stat bypasses cap

**Reason**: Bonus points now use the direct grant model - an allocated quest point adds +1 directly to the stat value instead of raising the spending cap. Cap behavior is specified by the bonus-points capability.

**Migration**: Previously the Boulder allocation only lifted a stat's cap to 31 while its value was paid from SP; after this change the point is granted directly. Shared URLs created before the change are migrated to a directly granted Boulder slot.

### Requirement: Bonus in URL sharing

**Reason**: Serialization of bonus slots is owned by the url-sharing capability, which now covers `bonusSlots` and legacy migration for all bonus sources.

**Migration**: See the url-sharing delta; legacy `boulderCircleStat` values map to a `boulder-circle` slot entry.
