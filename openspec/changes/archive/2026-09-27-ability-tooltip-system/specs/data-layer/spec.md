## MODIFIED Requirements

### Requirement: Ability data model

The system SHALL define abilities with: id, name, treeId, row, column, x, y, type, target, range, energy, cooldown, modifiedBy, requires, unlock, description, and children. Each ability's description SHALL be authored as a canonical structured string and SHALL be exposed in two derived forms: a flattened plain-text `description` and a structured token stream. `description` remains the flattened plain-text form of the structured tooltip template, regenerated from the canonical source data.

#### Scenario: Abilities have game coordinates

- **WHEN** abilities are loaded for a tree
- **THEN** each ability has x and y coordinates for positioning

#### Scenario: Requires references ability IDs

- **WHEN** an ability requires other abilities
- **THEN** requires is an array of ability IDs (parent prerequisites)

#### Scenario: Unlock is display-only text

- **WHEN** an ability has unlock conditions
- **THEN** unlock is an array of human-readable strings

#### Scenario: Children tracks refund cascade

- **WHEN** an ability is a parent to other abilities
- **THEN** children contains the IDs of all abilities that depend on it

#### Scenario: Descriptions are regenerated clean plain text

- **WHEN** abilities are loaded
- **THEN** each description is plain text without markup tokens, mid-sentence truncation, or mojibake characters

#### Scenario: Description stays the AI prompt source

- **WHEN** the AI prompt service builds a prompt
- **THEN** it consumes the regenerated plain-text description unchanged

#### Scenario: Token stream derived from canonical source

- **WHEN** an ability is loaded
- **THEN** a token stream is derived from its canonical description representing text, signed modifiers, and effect names

#### Scenario: Canonical source validated at load

- **WHEN** an ability description fails to conform to the canonical format, such as an unclosed modifier delimiter
- **THEN** the load is rejected with an error rather than exposing a partially parsed description
