# route-display Specification

## Purpose

Level-by-level computed route view that auto-places abilities and stats as the user spends points, showing a complete build roadmap from level 1 to current level.

## Requirements

### Requirement: Route displays all levels

The system SHALL display every level from 1 to currentLevel in the Route section, regardless of whether actions were taken at that level.

#### Scenario: All levels visible

- **WHEN** the character is at level 10
- **THEN** the Route shows levels 1 through 10, each as a separate row

#### Scenario: Empty levels shown

- **WHEN** a level has no abilities or stats assigned
- **THEN** the level row is displayed with empty assignment slots

### Requirement: Level 1 special layout

The system SHALL display Level 1 with two ability slots and no stat slot.

#### Scenario: Level 1 has two ability slots

- **WHEN** the Route renders Level 1
- **THEN** it shows two ability assignment positions and no stat assignment position

### Requirement: Level 2+ layout

The system SHALL display Level 2 and above with one ability slot and one stat slot.

#### Scenario: Standard level layout

- **WHEN** the Route renders Level 3
- **THEN** it shows one ability assignment position and one stat assignment position

### Requirement: Ability auto-placement via first-fit

The system SHALL auto-place abilities at levels using first-fit slot filling when the user obtains an ability.

#### Scenario: First ability fills Level 1 slot 1

- **WHEN** the user obtains their first ability
- **THEN** it is placed at Level 1, first ability slot

#### Scenario: Subsequent abilities fill next available slot

- **WHEN** the user obtains an ability and earlier levels have available ability slots
- **THEN** the ability is placed at the earliest level with an open ability slot

### Requirement: Stat auto-placement via first-fit

The system SHALL auto-place stats at levels using first-fit slot filling starting at Level 2.

#### Scenario: First stat fills Level 2

- **WHEN** the user allocates their first stat point
- **THEN** it is placed at Level 2, stat slot

### Requirement: Unassign ability via route display

The system SHALL allow the user to unassign an ability by clicking it in the Route display.

#### Scenario: Click assigned ability to unassign

- **WHEN** the user clicks an assigned ability in the Route
- **THEN** the ability is unassigned and 1 AP is returned

#### Scenario: Unassign stat via route display

- **WHEN** the user clicks an assigned stat in the Route
- **THEN** the stat is deallocated and 1 SP is returned

### Requirement: Route is computed, not stored

The system SHALL compute the route display from existing obtainedAbilities and statHistory arrays without a separate route data model.

#### Scenario: Route recomputes on state change

- **WHEN** the user obtains or unassigns an ability, or allocates or deallocates a stat
- **THEN** the Route display updates automatically

### Requirement: Route click-to-remove cursor affordance

The system SHALL display the same pointer cursor on assigned ability entries and assigned stat chips in the Route display, signaling that both can be clicked to remove them from the route.

#### Scenario: Assigned ability entry shows pointer cursor

- **WHEN** the user hovers an assigned ability entry in the Route
- **THEN** the entry displays the pointer cursor

#### Scenario: Assigned stat chip shows pointer cursor

- **WHEN** the user hovers an assigned stat chip in the Route
- **THEN** the chip displays the same pointer cursor as assigned ability entries
