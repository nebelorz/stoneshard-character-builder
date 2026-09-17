# ai-prompt-export Specification

## Purpose

Generate a formatted markdown prompt summarizing the build for AI analysis.

## Requirements

### Requirement: AI prompt generation

The system SHALL generate a markdown document containing: character name, title, race, trait, level, stat allocations, all obtained abilities in acquisition order plus all default active abilities, with their full descriptions, and metadata for each referenced ability tree, formatted as compact markdown tables.

#### Scenario: Prompt includes all build data

- **WHEN** the user clicks "Copy AI Prompt"
- **THEN** a markdown string is generated with character info, stats, an ordered ability table that includes both obtained and default active abilities, and tree metadata

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

The system SHALL format the AI prompt with clear sections: Character, Stats, Abilities, and Trees. The template instructions SHALL require the AI to answer with a single fixed table summary of build gameplay covering playstyle, win condition, ideal range, main combat loop, 1v1 and 1vX gameplans, core abilities, key synergies, stat priority, biggest strength, biggest weakness, and biggest mistake. The prompt SHALL NOT instruct the AI to analyze equipment, armor classes, or items.

#### Scenario: Structured prompt

- **WHEN** the AI prompt is generated
- **THEN** it contains markdown sections for Character, Stats, Abilities, and Trees
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
