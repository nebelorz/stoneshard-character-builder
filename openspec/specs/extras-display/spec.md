# extras-display Specification

## Purpose

Boulder Circle selection UI in the Extras section of the right sidenav, providing a custom dropdown with colored stat chips and a contextual tooltip explaining what Boulder Circle does.

## Requirements

### Requirement: Custom dropdown for Boulder Circle stat selection

The system SHALL display a custom dropdown button for Boulder Circle that replaces the native `<select>` element. The button SHALL show the currently selected stat as a colored chip, or a "-" placeholder when no stat is selected.

The system SHALL ALSO display a Notes section below the Boulder Circle row in the Extras section. The entire Notes section (icon, label, and preview) SHALL be a single clickable target.

#### Scenario: No stat selected shows placeholder

- **WHEN** the user has not allocated a Boulder Circle stat
- **THEN** the dropdown button displays a "-" placeholder

#### Scenario: Selected stat shows colored chip

- **WHEN** the user has selected STR as the Boulder Circle stat
- **THEN** the dropdown button displays a "+1 STR" chip with the STR color (orange)

#### Scenario: Dropdown opens on click

- **WHEN** the user clicks the dropdown button
- **THEN** a dropdown overlay opens below the button showing all five stat options

#### Scenario: Dropdown closes on outside click

- **WHEN** the dropdown is open and the user clicks outside the dropdown
- **THEN** the dropdown closes

#### Scenario: Select a stat from dropdown

- **WHEN** the user clicks a stat option in the open dropdown
- **THEN** the stat is allocated as the Boulder Circle stat and the dropdown closes

#### Scenario: Clear selection via placeholder option

- **WHEN** the user clicks the "-" option in the open dropdown
- **THEN** the Boulder Circle stat is deallocated and the dropdown closes

#### Scenario: Clicking same stat has no effect

- **WHEN** the user clicks the stat that is already selected in the dropdown
- **THEN** the selection remains unchanged and the dropdown closes

### Requirement: Notes section with icon tooltip

The Notes section SHALL display a Phosphor `note-pencil` icon with a tooltip reading "Author notes about this build". The tooltip SHALL appear on hover, matching the tooltip pattern used by Boulder Circle.

#### Scenario: Notes section shows no notes placeholder

- **WHEN** the user has no notes for the build
- **THEN** the Notes section displays "No notes for this build" in italic text

#### Scenario: Notes section shows preview

- **WHEN** the user has notes with content
- **THEN** the Notes section displays a truncated preview of the notes content

#### Scenario: Notes icon has tooltip

- **WHEN** the user hovers over the Notes icon
- **THEN** a tooltip appears with the text "Author notes about this build"

#### Scenario: Entire Notes section opens modal

- **WHEN** the user clicks anywhere on the Notes section (icon, label, or preview)
- **THEN** the notes modal editor opens centered on screen

### Requirement: Colored stat chips in dropdown options

The system SHALL display each stat option in the dropdown as a colored chip matching the stat color scheme used in Route: STR (orange), AGI (green), PER (cyan), VIT (red), WIL (purple).

#### Scenario: All stat chips have correct colors

- **WHEN** the dropdown is open
- **THEN** each stat option chip displays with its corresponding stat color for text and background

### Requirement: Question icon with tooltip

The system SHALL display a Phosphor `phosphorQuestion` icon to the left of the "Boulder Circle" label. The icon SHALL have a tooltip positioned to the left with the text "Boulder Circle is a quest that gives +1 SP".

#### Scenario: Tooltip appears on hover

- **WHEN** the user hovers the question icon
- **THEN** a tooltip appears to the left of the icon with the text "Boulder Circle is a quest that gives +1 SP"

#### Scenario: Tooltip disappears on leave

- **WHEN** the user stops hovering the question icon
- **THEN** the tooltip disappears
