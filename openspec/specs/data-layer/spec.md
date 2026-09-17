# data-layer Specification

## Purpose

Define the data models and asset pipeline for ability trees, abilities, characters, and icons.

## Requirements

### Requirement: Ability tree data model

The system SHALL define ability trees with: id, name, category (weaponry/utility/sorcery), focus, critEffect, icon, and optional width/height.

#### Scenario: Trees loaded from JSON

- **WHEN** the data layer loads
- **THEN** all ability trees are available from the JSON data source

### Requirement: Ability data model

The system SHALL define abilities with: id, name, treeId, row, column, x, y, type, target, range, energy, cooldown, modifiedBy, requires, unlock, description, and children. `description` is the flattened plain-text form of the structured tooltip template, regenerated from the pinned source data.

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

### Requirement: Character data model

The system SHALL define characters with: id, name, title, race, gender, trait (name + description), baseStats (STR/AGI/PER/VIT/WIL), and traitsUnlockedOnStart.

#### Scenario: Characters available

- **WHEN** the data layer loads
- **THEN** all playable characters are available

#### Scenario: traitsUnlockedOnStart is visual only

- **WHEN** a character has trees in traitsUnlockedOnStart
- **THEN** those trees display a visual indicator (all trees are functionally unlocked regardless)

### Requirement: Stat key constants

The system SHALL define the five stat keys: STR, AGI, PER, VIT, WIL as a typed constant array.

#### Scenario: Stat keys available

- **WHEN** the application needs to iterate over stats
- **THEN** the STAT_KEYS constant provides all five stat identifiers

### Requirement: Requirement parsing

The system SHALL parse ability requirement strings into structured groups where each group contains alternative ability IDs (OR), and all groups must be satisfied (AND).

#### Scenario: Parse pipe-separated requirements

- **WHEN** an ability has requires: ["ability_a", "ability_b|ability_c"]
- **THEN** the parser produces two groups: [{alternatives: ["ability_a"]}, {alternatives: ["ability_b", "ability_c"]}]

### Requirement: Single fetch per data file

The system SHALL issue exactly one network request per data file (characters.json, trees.json, abilities.json) per load lifecycle.

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
