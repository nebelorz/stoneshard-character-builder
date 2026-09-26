# extras-display Specification

## Purpose

Boulder Circle selection UI in the Extras section of the right sidenav, providing a custom dropdown with colored stat chips and a contextual tooltip explaining what Boulder Circle does.

## Requirements

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

### Requirement: Notes-only section header

The system SHALL rename the right sidenav section header from "Extras" to "Notes", reflecting that the section now contains only the build notes entry.

#### Scenario: Header displays Notes

- **WHEN** the right sidenav section renders
- **THEN** the header text reads "Notes" in the fantasy font
