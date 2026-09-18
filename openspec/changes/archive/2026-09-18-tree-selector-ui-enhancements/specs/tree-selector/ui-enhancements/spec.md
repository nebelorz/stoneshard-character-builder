## Purpose

Provides visual consistency and interactive feedback for the tree selector component by adding expandability indicators to section headers and press effects to action buttons, matching patterns already established in other app components.

## ADDED Requirements

### Requirement: Section headers SHALL display an expandability chevron

Each category section header in the tree selector ("Weaponry", "Utility", "Sorcery") SHALL display a right-pointing triangle icon (`▸`) to indicate expandability, matching the visual pattern used in `app-route-display`.

#### Scenario: Chevron visible on collapsed section

- **WHEN** a category section is collapsed
- **THEN** a `▸` icon is visible to the right of the section header text

#### Scenario: Chevron rotates when section expands

- **WHEN** the user expands a category section
- **THEN** the chevron rotates 90 degrees to point downward

#### Scenario: Chevron rotates back when section collapses

- **WHEN** a category section is collapsed
- **THEN** the chevron returns to its right-pointing orientation

### Requirement: Tree action buttons SHALL provide press feedback

The reset and unpin (delete from pinned) buttons on tree cards SHALL display a visual press effect when clicked, matching the behavior of `app-build-options` buttons.

#### Scenario: Button scales down on press

- **WHEN** the user clicks and holds a reset or unpin button
- **THEN** the button scales down to 95% of its original size

#### Scenario: Button returns to normal on release

- **WHEN** the user releases the mouse button after pressing a reset or unpin button
- **THEN** the button returns to its original 100% scale
