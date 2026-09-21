# build-notes Specification

## Purpose

Free-text notes system for character builds, allowing users to annotate builds with build name, author, and commentary that travels with shared URLs and AI prompt exports.

## Requirements

### Requirement: Build notes data model

The system SHALL store build notes as an object within `BuildState` containing three optional string fields: `buildName` (max 50 characters), `author` (max 50 characters), and `content` (max 1000 characters). All fields SHALL default to empty string when not set.

#### Scenario: New build has empty notes

- **WHEN** a new build is created
- **THEN** the notes object contains `buildName: ""`, `author: ""`, `content: ""`

#### Scenario: Notes fields respect character limits

- **WHEN** the user enters text exceeding the character limit for any field
- **THEN** the system prevents input beyond the limit (50 chars for buildName/author, 1000 chars for content)

### Requirement: Notes section in right sidenav

The system SHALL display a Notes section in the right sidenav below the Boulder Circle row. The entire section (icon, label, and preview text) SHALL be a single clickable target that opens the modal.

#### Scenario: No notes exist shows placeholder

- **WHEN** the build has no notes (all fields empty)
- **THEN** the section displays "No notes for this build" in italic text

#### Scenario: Notes exist shows preview

- **WHEN** the build has notes with content text
- **THEN** the section displays a truncated preview of the content (first ~80 characters)

#### Scenario: Notes exist with content but no build name

- **WHEN** the build has notes with content but empty buildName
- **THEN** the preview shows the truncated content text

#### Scenario: Notes exist with build name only

- **WHEN** the build has notes with a buildName but empty content
- **THEN** the preview shows the buildName

#### Scenario: Entire section opens modal

- **WHEN** the user clicks anywhere on the Notes section (icon, label, or preview text)
- **THEN** the notes modal opens

### Requirement: Notes modal editor

The system SHALL display a centered modal when the Notes section is clicked. The modal SHALL contain: a Build Name input and Author input on the top row (left and right respectively), an auto-expanding textarea below, a character counter at the bottom left, and Save and Close buttons at the bottom right.

#### Scenario: Modal opens empty

- **WHEN** the user clicks the Notes section with no existing notes
- **THEN** the modal opens with all fields empty and character counter showing "0 / 1000"

#### Scenario: Modal opens with existing notes

- **WHEN** the user clicks the Notes section with existing notes
- **THEN** the modal opens populated with the saved buildName, author, and content values

#### Scenario: Textarea auto-expands

- **WHEN** the user types enough text to exceed the textarea visible area
- **THEN** the textarea expands vertically to fit the content

#### Scenario: Character counter updates live

- **WHEN** the user types in the content textarea
- **THEN** the character counter updates to show "N / 1000"

### Requirement: Save notes

Notes SHALL only be persisted to `BuildState` when the user clicks the Save button. The Save button SHALL use the `$button-purple` color scheme.

#### Scenario: Save persists notes

- **WHEN** the user clicks Save
- **THEN** the notes fields are written to `BuildState` and the modal closes

#### Scenario: Save with empty fields

- **WHEN** the user clears all fields and clicks Save
- **THEN** the notes are saved as empty strings and the sidebar shows "No notes for this build"

### Requirement: Close discards changes

Close SHALL discard all unsaved changes and close the modal without persisting to `BuildState`. The Close button SHALL use the `$button-red` color scheme with `$button-red-hover` on hover.

#### Scenario: Close with no changes

- **WHEN** the user clicks Close and no fields have been modified since last save
- **THEN** the modal closes immediately

#### Scenario: Close with unsaved changes triggers confirmation

- **WHEN** the user modifies any field and clicks Close
- **THEN** a confirmation popover appears above the Close button with two options: "Confirm" (saves and closes) and "Cancel" (closes popover only, keeps modal open)

#### Scenario: Confirm in popover saves and closes

- **WHEN** the confirmation popover is shown and the user clicks Confirm
- **THEN** the notes are saved to `BuildState` and the modal closes

#### Scenario: Cancel in popover closes only the popover

- **WHEN** the confirmation popover is shown and the user clicks Cancel
- **THEN** the popover closes and the modal remains open with unsaved changes intact

### Requirement: Modal close on backdrop click only

The modal SHALL close when the user clicks the semi-transparent backdrop outside the modal content area. The modal SHALL NOT close when the user releases a mouse drag outside the modal (i.e., mousedown inside, mouseup outside).

#### Scenario: Click outside closes modal

- **WHEN** the user clicks the backdrop outside the modal content
- **THEN** the modal closes (with confirmation if unsaved changes exist)

#### Scenario: Mouse release outside does not close modal

- **WHEN** the user starts selecting text inside the modal and releases the mouse button outside the modal
- **THEN** the modal remains open

### Requirement: Modal has no title bar

The modal SHALL NOT display a title bar or header. The first visible elements SHALL be the Build Name and Author input fields.

### Requirement: Build Name and Author input styling

The Build Name and Author inputs SHALL be displayed side by side on the top row of the modal, each taking approximately half the width. Both fields SHALL have a max length of 50 characters.
