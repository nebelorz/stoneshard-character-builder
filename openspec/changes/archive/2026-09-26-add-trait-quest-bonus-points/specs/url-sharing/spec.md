# url-sharing delta

## MODIFIED Requirements

### Requirement: Build serialization

The system SHALL serialize the complete build state (character ID, level, AP, SP, stats, obtained abilities, pinned trees, stat history, bonus slots, notes) into a JSON object, with bonus point allocations represented by the `bonusSlots` list. Claimed-but-unallocated rows of unbounded sources SHALL be serialized as null-stat entries so stepper progress survives the round trip.

#### Scenario: Complete state captured

- **WHEN** a build is exported
- **THEN** the JSON includes all fields of the BuildState model, including `bonusSlots` and `notes` with `buildName`, `author`, and `content`

#### Scenario: Bonus slots captured

- **WHEN** a build has allocated bonus slots
- **THEN** each slot entry with source id, index, and stat is present in the serialized JSON

#### Scenario: Claimed rows captured

- **WHEN** a Velmir build has claimed boss rows whose slots are unallocated
- **THEN** the serialized JSON contains null-stat entries for those rows

### Requirement: Invalid build handling

The system SHALL gracefully handle invalid or corrupted build data in the URL without crashing, and SHALL display a toast notification to inform the user. Build data is invalid when it does not match the required shape, when its `characterId` does not exist in the currently loaded character data, or when its `level` is not an integer between 1 and 30 inclusive. Missing `bonusSlots` and `notes` fields SHALL be treated as empty/unallocated. A present-but-non-array `bonusSlots` SHALL invalidate the payload. Individual malformed bonus slot entries SHALL be dropped rather than invalidating the payload: entries with a non-string source id, a non-integer or negative index, a stat that is not a valid stat key or null, an index beyond the source's slot ceiling, a duplicate (source id, index) pair, an unknown source id, or a trait source id that does not belong to the payload's character. An `ap` below `0 - derived` (the derived floor for the payload's character and abilities) SHALL be clamped up to that floor.

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

#### Scenario: Non-array bonus slots invalidates the payload

- **WHEN** the URL contains a build whose `bonusSlots` is present but not an array
- **THEN** a toast notification appears with the message "Could not restore build from URL, starting fresh" and the app loads with the default state

#### Scenario: Malformed bonus entries dropped

- **WHEN** the URL contains a build with a mix of valid bonus slot entries and entries that are malformed, out of range, duplicated, from unknown sources, or trait sources of another character
- **THEN** the build restores with only the valid entries retained

#### Scenario: AP below derived floor clamped

- **WHEN** the URL contains a build whose `ap` is below `0 - derived` for its character and abilities
- **THEN** the build restores with `ap` raised to that floor

#### Scenario: Valid build restored

- **WHEN** the URL contains a build whose `characterId` exists in the currently loaded character data and whose `level` is an integer between 1 and 30 inclusive
- **THEN** the app loads with the exact build state

#### Scenario: Backward compatible loading

- **WHEN** a URL is loaded that does not contain `bonusSlots` or `notes`
- **THEN** the system treats `bonusSlots` as empty and `notes` as empty (`{buildName:"", author:"", content:""}`)

### Requirement: Backward compatibility

The system SHALL maintain backward compatibility with previously shared URLs. Existing shared URLs MUST continue to work after application updates. New fields SHALL be optional during deserialization, and a legacy `boulderCircleStat` value SHALL be migrated into a single allocated `boulder-circle` bonus slot on load.

#### Scenario: Old URL still works

- **WHEN** a URL was shared before an application update
- **THEN** it can still be restored after the update

#### Scenario: Legacy boulder value migrated

- **WHEN** a URL contains a legacy `boulderCircleStat` of "STR"
- **THEN** the restored build has one `boulder-circle` bonus slot allocated to STR

#### Scenario: Legacy null boulder value migrated

- **WHEN** a URL contains a legacy `boulderCircleStat` of null
- **THEN** the restored build has no `boulder-circle` bonus slots

#### Scenario: New URL has bonus state

- **WHEN** a URL is shared after this change
- **THEN** the recipient can see the trait and quest bonus slot allocations
