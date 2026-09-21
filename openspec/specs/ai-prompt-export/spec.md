# ai-prompt-export Specification

## Purpose

Generate a formatted markdown prompt summarizing the build for AI analysis.

## Requirements

### Requirement: AI prompt generation

The system SHALL generate a markdown document containing: character name, title, race, trait, level, stat allocations, all obtained abilities in acquisition order plus all default active abilities, with their full descriptions, metadata for each referenced ability tree, Boulder Circle bonus information, and build notes (if present), formatted as compact markdown tables.

#### Scenario: Prompt includes all build data

- **WHEN** the user clicks "Copy AI Prompt"
- **THEN** a markdown string is generated with character info, stats, an ordered ability table that includes both obtained and default active abilities, tree metadata, Boulder Circle allocation, and notes section

#### Scenario: Notes section included when present

- **WHEN** the build has non-empty notes (any of buildName, author, or content)
- **THEN** the prompt includes a "## Notes" section after the existing sections containing the user's notes text, preceded by the line "The user provides these notes and insights about this character build:"

#### Scenario: Notes section omitted when empty

- **WHEN** the build has no notes (all fields empty)
- **THEN** the prompt does not include a Notes section

#### Scenario: Default active ability always included

- **WHEN** no abilities have been obtained but default active abilities exist (for example Butchering)
- **THEN** the prompt lists the default active abilities in the abilities section

#### Scenario: Empty abilities handled

- **WHEN** no abilities have been obtained and no default active abilities exist
- **THEN** the prompt includes "_No abilities obtained._" in the abilities section

### Requirement: Copy to clipboard

The system SHALL copy the generated markdown to the user's clipboard when the "Copy AI Prompt" button is clicked.

#### Scenario: Clipboard updated

- **WHEN** the user clicks "Copy AI Prompt"
- **THEN** the markdown is copied to clipboard and a confirmation is shown

#### Scenario: Clipboard failure

- **WHEN** the clipboard API is unavailable or denied
- **THEN** a toast notification appears with "Failed to copy to clipboard"

### Requirement: Prompt format

The system SHALL format the AI prompt with clear sections: Character, Stats, Abilities, Trees, and Notes (when present). The template instructions SHALL require the AI to answer with a single fixed table summary of build gameplay covering playstyle, win condition, ideal range, main combat loop, 1v1 and 1vX gameplans, core abilities, key synergies, stat priority, biggest strength, biggest weakness, and biggest mistake. The prompt SHALL NOT instruct the AI to analyze equipment, armor classes, or items.

#### Scenario: Structured prompt

- **WHEN** the AI prompt is generated
- **THEN** it contains markdown sections for Character, Stats, Abilities, Trees, and Notes (if present)
- **AND** the template instructs a single table summary output

#### Scenario: No equipment analysis

- **WHEN** the AI prompt is generated
- **THEN** the prompt does not ask the AI to analyze or recommend equipment, armor classes, or items

### Requirement: Stat allocation display

The system SHALL show stat values with base and allocated amounts when points have been invested.

#### Scenario: Stat with allocation

- **WHEN** a stat has been incremented above base
- **THEN** the prompt shows "current (base+allocated)" format

#### Scenario: Stat at base

- **WHEN** a stat equals the base value
- **THEN** the prompt shows just the value

### Requirement: Boulder Circle display in prompt

The system SHALL include Boulder Circle bonus information in the Character section of the AI prompt.

#### Scenario: Bonus allocated

- **WHEN** the Boulder Circle bonus is allocated to a stat
- **THEN** the prompt shows "| Boulder Circle | +1 [STAT] |"

#### Scenario: Bonus unallocated

- **WHEN** the Boulder Circle bonus is not allocated
- **THEN** the prompt shows "| Boulder Circle | Not allocated |"
