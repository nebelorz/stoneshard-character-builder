# ability-management Specification

## Purpose

Manage obtaining and refunding abilities with prerequisite validation, AP consumption, and cascade refund behavior.

## Requirements

### Requirement: Obtain ability

The system SHALL allow the user to obtain an ability by left-clicking it, consuming 1 AP, provided all prerequisites are met.

#### Scenario: Successful obtain

- **WHEN** the user left-clicks an ability that meets all requirements and AP > 0
- **THEN** the ability is obtained, 1 AP is deducted, and the ability is recorded with its level and order

#### Scenario: Obtain fails - not enough AP

- **WHEN** the user left-clicks an ability with 0 AP remaining
- **THEN** no state change occurs

#### Scenario: Obtain fails - prerequisites not met

- **WHEN** the user left-clicks an ability whose prerequisite abilities are not all obtained
- **THEN** no state change occurs

#### Scenario: Obtain fails - already obtained

- **WHEN** the user left-clicks an ability that is already obtained
- **THEN** no state change occurs

### Requirement: Ability prerequisites

The system SHALL validate that all prerequisite ability groups are satisfied before allowing an ability to be obtained. Each requirement group is an OR of alternative ability IDs; all groups must be satisfied (AND across groups). Configured default active abilities count as satisfied prerequisites.

#### Scenario: Single prerequisite met

- **WHEN** an ability requires one parent ability and that parent is obtained
- **THEN** the ability is unlocked

#### Scenario: Alternative prerequisites (OR)

- **WHEN** an ability requires ability A OR ability B (shown as "A|B")
- **THEN** obtaining either A or B satisfies that requirement group

#### Scenario: Multiple prerequisite groups (AND)

- **WHEN** an ability has two requirement groups
- **THEN** both groups must be satisfied for the ability to be unlocked

#### Scenario: Default active ability satisfies prerequisite

- **WHEN** an ability requires a configured default active ability and that default is not in the obtained abilities list
- **THEN** the ability is unlocked and can be obtained normally

#### Scenario: Default ability cannot be obtained

- **WHEN** the user attempts to obtain a configured default active ability that is not in the obtained abilities list
- **THEN** no state change occurs

### Requirement: Ability icon states

The system SHALL display ability icons in four visual states: locked (requirements not met), unlocked (requirements met, not obtained), obtained (previously obtained), and default active (a configured default ability, rendered as obtained but non-interactive with no level badge).

#### Scenario: Locked state

- **WHEN** an ability's prerequisites are not met
- **THEN** the icon displays in the locked visual state

#### Scenario: Unlocked state

- **WHEN** an ability's prerequisites are met and it is not obtained
- **THEN** the icon displays in the unlocked visual state

#### Scenario: Obtained state

- **WHEN** an ability has been obtained
- **THEN** the icon displays in the obtained visual state with the level number overlay

#### Scenario: Default active state

- **WHEN** an ability is configured as a default active ability and is not in the obtained abilities list
- **THEN** the icon displays in the obtained visual state without the level number overlay, and clicking does not obtain it nor right-clicking refund it

### Requirement: Refund ability

The system SHALL allow the user to refund an obtained ability by right-clicking it, returning 1 AP. Refunding SHALL cascade to obtained child abilities that depend on the refunded ability.

#### Scenario: Refund single ability

- **WHEN** the user right-clicks an obtained ability with no obtained children
- **THEN** the ability is removed and 1 AP is returned

#### Scenario: Refund cascades to children

- **WHEN** the user right-clicks an obtained ability that has obtained children whose only prerequisite is this ability
- **THEN** the ability and all dependent children are refunded, with AP returned for each

#### Scenario: Refund fails - not obtained

- **WHEN** the user right-clicks an ability that is not obtained
- **THEN** no state change occurs

### Requirement: Cascade refund depth

The system SHALL recursively refund all descendants whose prerequisite requirements are no longer met after removing the parent.

#### Scenario: Multi-level cascade

- **WHEN** ability A is obtained, ability B depends on A, and ability C depends on B
- **THEN** refunding A cascades to refund B and C as well

#### Scenario: Partial cascade when alternative prerequisites exist

- **WHEN** ability C depends on A OR B, and both A and B are obtained
- **THEN** refunding A does NOT cascade to C (B still satisfies the requirement)

### Requirement: Ability auto-placement in route

The system SHALL record the level at which each ability is obtained using first-fit slot filling: Level 1 holds up to 2 abilities, Level 2+ holds 1 ability each. The first available slot determines placement.

#### Scenario: First ability fills Level 1 slot 1

- **WHEN** the user obtains their first ability
- **THEN** it is placed at Level 1, first ability slot

#### Scenario: Third ability fills Level 2

- **WHEN** the user obtains their third ability
- **THEN** it is placed at Level 2, ability slot

### Requirement: Ability tooltip

The system SHALL display a tooltip when the user hovers over an ability icon, showing ability details. For locked abilities, the tooltip SHALL additionally show the "Requires" section with parent ability icons and an "Unlock" section with human-readable conditions.

#### Scenario: Tooltip for unlocked ability

- **WHEN** the user hovers over an unlocked or obtained ability icon
- **THEN** a tooltip appears with ability details (name, type, energy, cooldown, range, description)

#### Scenario: Tooltip for locked ability

- **WHEN** the user hovers over a locked ability icon
- **THEN** a tooltip appears with ability details plus a "Requires" section and "Unlock" section

#### Scenario: Smart tooltip positioning

- **WHEN** the tooltip would extend beyond the viewport edge
- **THEN** the tooltip repositions to remain fully visible

### Requirement: Ability hover highlighting

The system SHALL highlight all instances of a hovered ability across the ability tree and route display.

#### Scenario: Hover highlights ability

- **WHEN** the user hovers over an ability icon
- **THEN** that ability is highlighted in both the tree and route display

### Requirement: Refund releases level lock

Refunding an ability SHALL also remove the records that blocked level-down for the levels the refunded abilities were placed at, including abilities refunded by cascade.

#### Scenario: Single refund unlocks level

- **WHEN** the user refunds an ability and the refunded ability was the only action at its level
- **THEN** 1 AP is returned and the affected level becomes eligible for level-down

#### Scenario: Cascade refund unlocks levels

- **WHEN** a refund cascades to dependent children and the removed abilities were the only actions at their levels
- **THEN** AP is returned for each removed ability and every affected level becomes eligible for level-down
