# bonus-points Specification

## Purpose

Represent every SP or AP granted outside a level-up - character trait gains and quest rewards - as allocatable bonus point slots with direct stat grants, derived AP contributions, and dedicated left-sidenav sections for traits and quests.

## Requirements

### Requirement: Bonus slot state

The system SHALL maintain a `bonusSlots` list in the build state where each entry records a source identifier, a slot index within that source, and the stat the point is allocated to. Entries with a null stat represent claimed-but-unallocated rows of unbounded sources. Bounded sources keep entries only while allocated; unbounded sources persist claimed rows as null-stat entries so stepper progress survives reload and URL share/restore.

#### Scenario: Initial state

- **WHEN** a new build is created
- **THEN** `bonusSlots` is an empty list

#### Scenario: Allocation persisted

- **WHEN** the user allocates a bonus slot to a stat
- **THEN** the slot entry exists with that source id, index, and stat key

#### Scenario: Reallocation persisted

- **WHEN** the user changes the stat of an already allocated slot
- **THEN** the slot entry is updated to the new stat key

#### Scenario: Bounded deallocation removes the entry

- **WHEN** the user clears an allocated slot of a bounded source (a Jorgrim trophy slot or the Boulder Circle slot)
- **THEN** that slot entry is removed from `bonusSlots` while the row itself is still rendered from configuration

#### Scenario: Unbounded row claim persisted

- **WHEN** the user adds a Velmir boss row and leaves its slots unallocated
- **THEN** the two claimed slots exist as null-stat entries that survive reload and URL share/restore

#### Scenario: Unbounded deallocation keeps the row

- **WHEN** the user clears an allocated Velmir slot via the dropdown placeholder option
- **THEN** the entry's stat is set to null and the row remains claimed

#### Scenario: Stepper row removal deletes entries

- **WHEN** the user removes a boss row via the stepper
- **THEN** that row's slot entries, allocated or not, are removed from `bonusSlots`

### Requirement: Trait SP gain slots

The system SHALL expose one bonus point slot for each stat point a character's trait can grant, driven by per-character trait gain configuration in the character data. Bounded sources (Jorgrim: up to 5 points from trophies; Dirwin: up to 3 points from dens and caves) SHALL render their full slot list. Unbounded sources (Velmir: 2 points per killed boss) SHALL provide a stepper that appends slot rows in pairs starting from zero rows, with a practical ceiling of 10 bosses (20 points).

#### Scenario: Bounded slots rendered

- **WHEN** Jorgrim is the selected character
- **THEN** the trait section shows 5 point slots labeled as trophy milestones

#### Scenario: Unbounded slots via stepper

- **WHEN** Velmir is the selected character and the user clicks the add control
- **THEN** 2 additional point slots (one boss) are appended to the trait section

#### Scenario: Stepper ceiling

- **WHEN** Velmir has 10 boss rows claimed and the user clicks the add control
- **THEN** no additional rows are appended

#### Scenario: Character without SP gains

- **WHEN** Arna is the selected character
- **THEN** the trait section shows no point slots

### Requirement: Direct stat grant

The system SHALL apply an allocated bonus SP slot as a direct +1 to the chosen stat's displayed value without deducting from the SP pool, without changing the route stat values held in the build state, and without adding an entry to the stat history. Clearing the slot SHALL remove the +1 from the displayed value.

#### Scenario: Grant applied

- **WHEN** the user allocates a Boulder Circle slot to VIT for Velmir (base VIT 10)
- **THEN** the stats panel displays VIT 11 while the SP pool, the route stat value, and the stat history are unchanged

#### Scenario: Grant removed on deallocation

- **WHEN** the user clears an allocated slot from a stat
- **THEN** that stat's displayed value decreases by 1

#### Scenario: No route pollution

- **WHEN** a bonus slot is allocated or cleared
- **THEN** the stat history remains unchanged

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

### Requirement: Route spending interaction

The system SHALL keep route (level-up) stat spending capped flat at 30 per stat based on the route value, regardless of bonus allocations, and route decrement buttons SHALL never consume a bonus point. Route decrements remove stat history entries only.

#### Scenario: Route cap stays flat

- **WHEN** a stat's route value is 30 and a bonus slot is allocated to it (displayed 31)
- **THEN** route increment is blocked

#### Scenario: Bonus does not block route spending

- **WHEN** a stat's route value is 28 and 2 bonus slots are allocated to it (displayed 30)
- **THEN** a route increment is allowed and the stat then displays 31

#### Scenario: Decrement protects bonus points

- **WHEN** a stat has base 10, one bonus slot allocated, and 1 route increment (displayed 12)
- **THEN** a single route decrement brings it to 11 with the bonus count unchanged, and further decrements are blocked

### Requirement: Derived trait AP

The system SHALL compute trait AP gains that depend on the build itself automatically and include them in the ability budget: Dirwin gains 1 AP per 3 learned Survival abilities, and Mahir gains 1 AP for each ability tree with at least 6 learned abilities (up to 5 times). Default abilities SHALL NOT count toward these formulas. These gains SHALL require no user allocation.

#### Scenario: Dirwin derived AP

- **WHEN** Dirwin has 4 learned Survival abilities
- **THEN** the trait section shows +1 derived AP and the ability budget is increased by 1

#### Scenario: Mahir derived AP

- **WHEN** Mahir has 6 or more learned abilities in each of 2 different trees
- **THEN** the trait section shows +2 derived AP

#### Scenario: Default abilities excluded

- **WHEN** Dirwin has 2 learned Survival abilities plus the default starting ability Make a Halt
- **THEN** the derived AP is 0 because default abilities do not count

#### Scenario: Refund shrinks derived AP

- **WHEN** a learned Survival ability of Dirwin is refunded so the count drops below a multiple of 3
- **THEN** the derived AP and the ability budget decrease accordingly

#### Scenario: Character switch preserves the total budget

- **WHEN** the user switches from Dirwin with `ap` at -1 and 1 derived AP (total budget 0) to Arna
- **THEN** `ap` becomes 0 and the total budget remains 0; switching back to Dirwin restores `ap` to -1, so round trips grant no free AP

#### Scenario: Restore clamps ap to the derived floor

- **WHEN** a restored payload contains an `ap` below `0 - derived` for its character and abilities
- **THEN** `ap` is raised to that floor so the total budget is never negative

### Requirement: Trait section UI

The system SHALL render a Trait section in the left sidenav between the character selector and the stats panel. The section SHALL display the trait name and reveal the full trait description on hover via an enriched tooltip. For characters with SP gains it SHALL render the point slots with stat selection dropdowns; for characters with derived AP it SHALL display a computed badge; characters without any point gains SHALL display only the trait name and description.

#### Scenario: Trait description on hover

- **WHEN** the user hovers the trait info affordance
- **THEN** the full trait description appears in a tooltip

#### Scenario: Slot allocation dropdown

- **WHEN** the user opens a trait point slot dropdown and selects STR
- **THEN** the slot is allocated to STR with the stat color chip pattern

#### Scenario: Derived AP badge

- **WHEN** Dirwin qualifies for derived AP
- **THEN** the trait section shows the computed AP badge without any allocation control

### Requirement: Quests section UI

The system SHALL render a Quests section in the left sidenav after the stats panel, driven by quest configuration data, with Boulder Circle as the initial quest granting one point slot.

#### Scenario: Boulder Circle row

- **WHEN** any character is selected
- **THEN** the Quests section shows a Boulder Circle slot with a stat selection dropdown and an info tooltip

#### Scenario: Extensible quest list

- **WHEN** a new quest with a point reward is added to the quest configuration
- **THEN** the Quests section renders its slot without bespoke state or UI changes

### Requirement: Bonus persistence and reset

The system SHALL keep quest bonus slots when the user switches characters, reset trait bonus slots on character switch (they are character-specific), and clear all bonus slots on a full build reset.

#### Scenario: Character switch keeps quests

- **WHEN** the user switches characters with a Boulder Circle slot allocated
- **THEN** the Boulder Circle allocation remains

#### Scenario: Character switch resets traits

- **WHEN** the user switches away from Jorgrim with trait slots allocated
- **THEN** all trait slot entries are cleared

#### Scenario: Character switch resets unbounded rows

- **WHEN** the user switches away from Velmir with claimed boss rows, allocated or not
- **THEN** all Velmir trait slot entries are cleared and the stepper starts from zero again

#### Scenario: Claimed rows survive URL round trip

- **WHEN** Velmir has 4 claimed boss rows with 1 slot allocated and the build is shared and restored
- **THEN** the trait section shows the same 4 rows with the same allocation

#### Scenario: Full reset

- **WHEN** the user performs a full build reset
- **THEN** `bonusSlots` is empty
