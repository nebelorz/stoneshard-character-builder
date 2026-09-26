# extras-display delta

## ADDED Requirements

### Requirement: Notes-only section header

The system SHALL rename the right sidenav section header from "Extras" to "Notes", reflecting that the section now contains only the build notes entry.

#### Scenario: Header displays Notes

- **WHEN** the right sidenav section renders
- **THEN** the header text reads "Notes" in the fantasy font

## MODIFIED Requirements

### Requirement: Notes section with icon tooltip

The Notes section SHALL display a Phosphor `note-pencil` icon with a tooltip reading "Author notes about this build". The tooltip SHALL appear on hover. The entire Notes section (icon, label, and preview) SHALL be a single clickable target that opens the notes modal.

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

## REMOVED Requirements

### Requirement: Custom dropdown for Boulder Circle stat selection

**Reason**: The Boulder Circle allocation moved to the left sidenav Quests section (bonus-points and quest-extras capabilities). The right sidenav no longer contains a Boulder row.

**Migration**: Use the Boulder Circle dropdown in the left sidenav Quests section; the same custom dropdown pattern, stat chips, and outside-click behavior are specified there.

### Requirement: Colored stat chips in dropdown options

**Reason**: Stat chip coloring now belongs to the bonus-points capability, which specifies the stat selection dropdown pattern shared by the Trait and Quests sections.

**Migration**: Chip colors (STR orange, AGI green, PER cyan, VIT red, WIL purple) are defined in the bonus-points specification.

### Requirement: Question icon with tooltip

**Reason**: The Boulder Circle info affordance moved with the row itself to the left sidenav Quests section and is specified by the bonus-points capability.

**Migration**: The Quests section Boulder row renders an info icon with a tooltip describing the quest reward.
