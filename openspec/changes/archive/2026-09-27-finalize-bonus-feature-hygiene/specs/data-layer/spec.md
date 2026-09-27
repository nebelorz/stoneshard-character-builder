## MODIFIED Requirements

### Requirement: Single fetch per data file

The system SHALL issue exactly one network request per data file (characters.json, trees.json, abilities.json, quests.json) per load lifecycle.

#### Scenario: No duplicate fetches

- **WHEN** the application initializes and multiple consumers need the same data file
- **THEN** the file is fetched once and shared by all consumers

### Requirement: Loaded data validated

The system SHALL validate loaded data against the corresponding data model before exposing it to consumers.

#### Scenario: Character data validated

- **WHEN** characters.json is parsed
- **THEN** the result is validated to be an array of character-shaped records before use

#### Scenario: Ability and tree data validated

- **WHEN** trees.json or abilities.json is parsed
- **THEN** the result is validated to be an array of tree-shaped / ability-shaped records before use

#### Scenario: Quest data validated

- **WHEN** quests.json is parsed
- **THEN** the result is validated to be an array of quest-shaped records before use
