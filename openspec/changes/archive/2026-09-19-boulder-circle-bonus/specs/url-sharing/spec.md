## MODIFIED Requirements

### Requirement: Build serialization

The system SHALL serialize the complete build state (character ID, level, AP, SP, stats, obtained abilities, pinned trees, stat history, boulder circle stat) into a JSON object.

#### Scenario: Complete state captured

- **WHEN** a build is exported
- **THEN** the JSON includes all fields of the BuildState model, including `boulderCircleStat`

### Requirement: Invalid build handling

The system SHALL gracefully handle invalid or corrupted build data in the URL without crashing, and SHALL display a toast notification to inform the user. Build data is invalid when it does not match the required shape, when its `characterId` does not exist in the currently loaded character data, or when its `level` is not an integer between 1 and 30 inclusive. Missing `boulderCircleStat` fields SHALL be treated as null (unallocated).

#### Scenario: Corrupted build parameter

- **WHEN** the URL contains an invalid build parameter
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Unknown character ID

- **WHEN** the URL contains a build whose shape is valid but whose `characterId` does not exist in the currently loaded character data
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Level above maximum

- **WHEN** the URL contains a build whose `level` is greater than 30
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Level below minimum

- **WHEN** the URL contains a build whose `level` is less than 1
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Non-integer level

- **WHEN** the URL contains a build whose `level` is not an integer
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Valid build restored

- **WHEN** the URL contains a build whose `characterId` exists in the currently loaded character data and whose `level` is an integer between 1 and 30 inclusive
- **THEN** the app loads with the exact build state

#### Scenario: Backward compatible loading

- **WHEN** a URL is loaded that does not contain `boulderCircleStat`
- **THEN** the system treats it as null (unallocated)

### Requirement: Backward compatibility

The system SHALL maintain backward compatibility with previously shared URLs. Existing shared URLs MUST continue to work after application updates. New fields like `boulderCircleStat` SHALL be optional during deserialization.

#### Scenario: Old URL still works

- **WHEN** a URL was shared before an application update
- **THEN** it can still be restored after the update

#### Scenario: New URL has bonus state

- **WHEN** a URL is shared after the Boulder Circle feature is added
- **THEN** the recipient can see the Boulder Circle allocation
