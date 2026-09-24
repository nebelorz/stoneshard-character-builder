# character-info-panel Specification

## Purpose

Displays the selected character's starting ability trees in a compact side-nav panel below the character stats.

## Requirements

### Requirement: Starting trees display

The system SHALL display the selected character's starting trees in a side-nav character info panel located below the character stats, listing each tree with its name and icon.

#### Scenario: Panel shows starting trees

- **WHEN** the app loads with a character selected
- **THEN** the side-nav character info panel lists every tree in the character's traitsUnlockedOnStart with its name and icon

#### Scenario: Panel follows character selection

- **WHEN** the user selects a different character
- **THEN** the panel updates to show that character's starting trees

#### Scenario: No starting trees

- **WHEN** the selected character has an empty traitsUnlockedOnStart
- **THEN** the panel shows no starting trees and takes no extra vertical space

#### Scenario: Panel is keyboard accessible

- **WHEN** the user tabs through the side nav
- **THEN** each starting tree in the panel is reachable with a visible focus indicator

### Requirement: Pin a starting tree

The system SHALL title the side-nav starting-trees panel "Unlocked Trees" and SHALL let the user toggle a tree's pinned state by clicking its row. A pinned row SHALL display a gold highlight and `aria-pressed="true"`. The panel SHALL NOT pin starting trees automatically. Pinning through the panel SHALL use the same pinned-trees state as the tree selector and pinned-tree cards so all views stay in sync, and pinned trees SHALL remain pinned when the user switches characters.

#### Scenario: Panel title

- **WHEN** the selected character has starting trees
- **THEN** the panel heading reads "Unlocked Trees"

#### Scenario: Click pins a tree

- **WHEN** the user clicks an unlocked-tree row
- **THEN** the tree appears in the pinned trees area and the row displays the gold pinned highlight

#### Scenario: Click unpins a tree

- **WHEN** the user clicks a pinned tree's row
- **THEN** the tree is removed from the pinned trees area and the row's pinned highlight clears

#### Scenario: No automatic pinning

- **WHEN** a character is selected
- **THEN** none of its starting trees are pinned automatically

#### Scenario: Keyboard toggles pin

- **WHEN** a starting-tree row is focused and the user presses Enter or Space
- **THEN** the tree's pinned state toggles

#### Scenario: Pin state stays in sync

- **WHEN** a starting tree is pinned or unpinned through the tree selector or its pinned card
- **THEN** the tree's row in the "Unlocked Trees" panel reflects the same pinned state

#### Scenario: Pins persist across character switch

- **WHEN** the user switches characters
- **THEN** starting trees pinned via the panel remain pinned, and the panel's row list updates to the newly selected character's unlocked trees
