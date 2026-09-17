# tree-pinning Specification

## Purpose

Allow users to pin multiple ability trees for viewing and interacting with them in the main content area.

## Requirements

### Requirement: Pin a tree

The system SHALL pin a tree when the user clicks its pin icon in the tree selector, adding it to the pinned trees area.

#### Scenario: Pin adds tree to view

- **WHEN** the user clicks the pin icon for a tree
- **THEN** the tree appears in the pinned trees area

#### Scenario: Duplicate prevention

- **WHEN** the user clicks the pin icon for an already-pinned tree
- **THEN** no duplicate is created

### Requirement: Unpin a tree

The system SHALL unpin a tree when the user clicks the close/unpin icon on the tree card, removing it from the pinned area.

#### Scenario: Unpin removes tree

- **WHEN** the user clicks the unpin icon on a pinned tree
- **THEN** the tree is removed from the pinned area

### Requirement: Tree selector always visible

The system SHALL display the tree selector at the top of the pin area, visible even when no trees are pinned.

#### Scenario: Empty state shows tree selector

- **WHEN** no trees are pinned
- **THEN** the tree selector is visible at the top of the pin area

### Requirement: Tree category selection

The system SHALL present the Weaponry, Utility, and Sorcery categories as a tab bar, and selecting a category SHALL expand that category's tree list inline beneath the tab bar. Each listed tree SHALL show its name and icon with a pin control.

#### Scenario: Category expands inline

- **WHEN** the user selects a category tab
- **THEN** that category's trees appear inline beneath the tab bar

#### Scenario: Rows wrap into columns

- **WHEN** a category lists more trees than fit in one row of the content width
- **THEN** the tree rows wrap into additional columns

#### Scenario: Only one category expanded

- **WHEN** a category is expanded and the user selects a different category
- **THEN** the previously expanded category collapses and the newly selected category expands

#### Scenario: Collapse by reselecting

- **WHEN** the user selects the currently expanded category
- **THEN** the category collapses and no tree list is shown

#### Scenario: Collapse by clicking outside

- **WHEN** a category section is expanded and the user clicks outside the tree selector
- **THEN** the section collapses

#### Scenario: All categories collapsed initially

- **WHEN** the page loads
- **THEN** all category sections are collapsed and only the tab bar is visible

#### Scenario: Pinned trees remain visible

- **WHEN** a category section is expanded
- **THEN** the pinned trees area below the selector remains fully visible and is not overlapped

### Requirement: Responsive grid layout

The system SHALL arrange pinned trees in a horizontal flow layout that wraps to new rows when the viewport is insufficient.

#### Scenario: Multiple trees side by side

- **WHEN** 2 trees are pinned on a wide viewport
- **THEN** both appear in a single row

#### Scenario: Wrap on narrow viewport

- **WHEN** trees don't fit in the content area width
- **THEN** excess trees wrap to the next row

### Requirement: Pinned trees persist in state

The system SHALL include pinned tree IDs in the build state so they are preserved across sessions and included in shared URLs.

#### Scenario: Pin state in URL

- **WHEN** a user shares a build with pinned trees
- **THEN** the recipient sees the same pinned trees

### Requirement: Pinned trees persist across character switches

The system SHALL keep the same pinned trees when the user switches characters.

#### Scenario: Switch character preserves pins

- **WHEN** the user switches characters
- **THEN** the same trees remain pinned

### Requirement: Tree rendering

The system SHALL render each pinned ability tree with its name, background art, and ability icons positioned at their real game coordinates.

#### Scenario: Background art displayed

- **WHEN** a tree is rendered
- **THEN** its background image fills the tree canvas behind all icons

#### Scenario: Ability icons interactive

- **WHEN** a tree is rendered
- **THEN** each ability icon is a real DOM element supporting click, right-click, hover, and keyboard interactions

### Requirement: Keyboard navigation in tree categories

The system SHALL support keyboard navigation across category tabs and within the expanded category section.

#### Scenario: Move between category tabs

- **WHEN** focus is on a category tab and the user presses ArrowLeft or ArrowRight
- **THEN** focus moves to the previous or next category tab

#### Scenario: Expand a category from its tab

- **WHEN** focus is on a category tab and the user presses ArrowDown or Enter
- **THEN** that category's section expands and focus moves to its first tree

#### Scenario: Move between trees

- **WHEN** a category section is expanded and the user presses an arrow key while a tree has focus
- **THEN** focus moves to the next or previous tree in reading order

#### Scenario: Toggle pin with keyboard

- **WHEN** a tree has focus and the user presses Enter
- **THEN** the tree's pin state toggles

#### Scenario: Collapse with Escape

- **WHEN** a category section is expanded and the user presses Escape
- **THEN** the section collapses and focus returns to its category tab
