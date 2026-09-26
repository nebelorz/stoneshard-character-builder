# left-sidenav-layout Specification

## Purpose

Define the visual composition of the left sidenav: the order of its sections, the placement of info affordances relative to their labels, multi-column list layouts that use the sidenav width efficiently, and the shared styling of its controls.

## ADDED Requirements

### Requirement: Left sidenav section order

The left sidenav SHALL render its sections top to bottom in this order: character selector, character trait, level controls, stats, quests, Character Unlocked Trees.

#### Scenario: Rendered order

- **WHEN** the left sidenav renders with a character selected
- **THEN** the character selector appears first, followed in order by the trait section, the level controls, the stats panel, the quests section, and the Character Unlocked Trees panel

#### Scenario: Order independent of character

- **WHEN** the user switches characters
- **THEN** the section order is unchanged

### Requirement: Icon-first info affordance placement

Left sidenav rows and headers with an info affordance (stat rows, the trait header, quest rows) SHALL render the info icon with its tooltip to the left of the label, followed by the row content, and the icon SHALL sit visually close to its label with a tighter gap than the spacing between the label and the row content.

#### Scenario: Stat row placement

- **WHEN** a stat row renders
- **THEN** the info icon appears to the left of the stat label and the increment/decrement controls render to the right of the label

#### Scenario: Trait header placement

- **WHEN** the trait section header renders
- **THEN** the info icon appears to the left of the trait name

#### Scenario: Quest row placement

- **WHEN** a quest row renders
- **THEN** the info icon appears to the left of the quest label and the quest's point slot renders to the right of the label

#### Scenario: Icons align across sections

- **WHEN** the stats, trait, and quests sections render together
- **THEN** their info icons share a consistent left-aligned position relative to their labels

### Requirement: Space-filling multi-column list layouts

Bounded trait slot lists and the Character Unlocked Trees panel SHALL lay out their entries in auto-fitting equal-width grid columns that use the full panel width, with a minimum track width matching the entry's minimum content width (68px for point-slot toggles). At the standard sidenav width this SHALL yield three columns. Unbounded boss-row pairs SHALL keep each pair on a single full-width row. Column entries SHALL preserve the reading order of the underlying list.

#### Scenario: Bounded trait slots in three columns

- **WHEN** a character with a bounded trait gain of 5 slots (Jorgrim) is selected
- **THEN** the trait section renders the 5 slots in three columns across 2 rows (3 then 2)

#### Scenario: Unlocked trees fill the panel width

- **WHEN** the Character Unlocked Trees panel renders a character's starting trees
- **THEN** the trees lay out in as many columns as the panel width allows (three at the standard width) with long names truncated rather than overflowing

#### Scenario: Boss rows stay full-width

- **WHEN** an unbounded trait gain (Velmir) renders its claimed boss rows
- **THEN** each boss row renders its pair of slots on a single full-width row

#### Scenario: Column count adapts

- **WHEN** entries are added or removed from a space-filling list
- **THEN** the column count stays the maximum that fits the available width and is never fixed below it

### Requirement: Unlocked Trees name tooltips

Each Character Unlocked Trees row SHALL expose a tooltip containing the tree's name, reachable through hover and keyboard focus, so the name stays accessible even if the visible text label is later removed.

#### Scenario: Hovering a tree row shows its name

- **WHEN** the user hovers over an Unlocked Trees row
- **THEN** a tooltip appears showing that tree's name

#### Scenario: Focusing a tree row shows its name

- **WHEN** the user focuses an Unlocked Trees row with the keyboard
- **THEN** a tooltip appears showing that tree's name

### Requirement: Stepper uses shared side-nav button styling

The trait stepper controls SHALL render with the same button styling language as the stats and level controls: shared border, background, hover, focus-visible, and disabled states. The stepper sits right-aligned on the trait group header line next to the group label, and its buttons MAY be sized smaller than the stat buttons to fit the header row.

#### Scenario: Stepper buttons share the stat button styling language

- **WHEN** the trait stepper renders next to the stats panel
- **THEN** its add and remove buttons share the border, background, hover, and focus-visible styling of the stat increment and decrement buttons, at a smaller size

#### Scenario: Stepper placement in the group header

- **WHEN** an unbounded trait gain group renders
- **THEN** the stepper renders on the same line as the group label, aligned to the right edge of the sidenav panel

#### Scenario: Stepper disabled state

- **WHEN** a stepper button is disabled (row ceiling reached or no rows to remove)
- **THEN** it renders the shared disabled styling with a not-allowed cursor
