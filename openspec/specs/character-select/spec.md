# character-select Specification

## Purpose

Allow users to select a character, display their trait, and initialize base stats.

## Requirements

### Requirement: Character selector

The system SHALL display a character selector in the side nav showing the character's portrait and name.

#### Scenario: Character selector visible

- **WHEN** the app loads
- **THEN** the side nav shows the current character's portrait and name

### Requirement: Character selector dropdown

The system SHALL open a dropdown when the character selector is clicked, listing all playable characters with their portrait, name, and title.

#### Scenario: Dropdown shows all characters

- **WHEN** the user clicks the character selector
- **THEN** a dropdown appears with all characters, each showing portrait + name + title

#### Scenario: Navigate with arrows

- **WHEN** dropdown is open and user presses ArrowDown or ArrowUp
- **THEN** focus moves through dropdown items with visible focus indicator

#### Scenario: Select with Enter

- **WHEN** user presses Enter on a focused character option
- **THEN** that character is selected and dropdown closes

#### Scenario: Close with Escape

- **WHEN** dropdown is open and user presses Escape
- **THEN** dropdown closes and focus returns to toggle button

### Requirement: Dropdown overflow handling

The system SHALL ensure the character dropdown renders outside any ancestor's overflow context to display its full content without clipping.

#### Scenario: Dropdown displays fully

- **WHEN** the user opens the character dropdown inside a container with overflow constraints
- **THEN** all character options are visible and scrollable within the dropdown itself

### Requirement: Character selection transfers build

The system SHALL preserve and transfer the current build when the user selects a different character. The build's character ID SHALL update to the newly selected character, level, AP, SP, obtained abilities, stat history, and pinned trees SHALL remain unchanged, and stats SHALL be re-derived from the new character's base stats plus the preserved stat allocations.

#### Scenario: Switch character preserves build

- **WHEN** the user selects a different character
- **THEN** the build's character ID updates to the newly selected character, and level, AP, SP, obtained abilities, stat history, and pinned trees remain unchanged

#### Scenario: Stats re-derived from new base

- **WHEN** the user selects a different character with a preserved build
- **THEN** each stat equals the new character's baseStats value plus the allocations recorded in the preserved statHistory, and unspent SP is unchanged

#### Scenario: Pre-unlocked trees update

- **WHEN** the user selects a different character
- **THEN** the pre-unlocked trees shown for the character update to the newly selected character's unlocked trees

#### Scenario: Pinned trees preserved across character switch

- **WHEN** the user switches characters
- **THEN** the same trees remain pinned

### Requirement: Trait display

The system SHALL display the selected character's trait name and description in the UI. The trait icon SHALL be keyboard accessible.

#### Scenario: Trait is visible

- **WHEN** a character is selected
- **THEN** their trait name and description are accessible in the UI

#### Scenario: Focus trait icon

- **WHEN** user tabs to the trait icon
- **THEN** trait bubble displays with trait name and description

#### Scenario: Blur trait icon

- **WHEN** user tabs away from trait icon
- **THEN** trait bubble is hidden

### Requirement: Character base stats

The system SHALL derive the displayed stats for the selected character from that character's baseStats plus any allocations recorded in the build's statHistory.

#### Scenario: Base stats applied

- **WHEN** a character is selected with no stat allocations in the build
- **THEN** STR, AGI, PER, VIT, WIL are set to the character's baseStats values

#### Scenario: Allocations add to base

- **WHEN** a character's build contains stat allocations in statHistory
- **THEN** each stat equals the character's baseStats value plus the number of allocations recorded for that stat

### Requirement: Invalid character handling

The system SHALL handle unknown character IDs by loading the first available character as default.

#### Scenario: Unknown character ID in URL

- **WHEN** a shared URL contains a characterId that does not match any available character
- **THEN** the app loads with the default (first) character
