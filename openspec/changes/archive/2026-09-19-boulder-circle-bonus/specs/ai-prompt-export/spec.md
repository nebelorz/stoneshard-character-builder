## MODIFIED Requirements

### Requirement: AI prompt generation

The system SHALL generate a markdown document containing: character name, title, race, trait, level, stat allocations, all obtained abilities in acquisition order plus all default active abilities, with their full descriptions, metadata for each referenced ability tree, and Boulder Circle bonus information, formatted as compact markdown tables.

#### Scenario: Prompt includes all build data

- **WHEN** the user clicks "Copy AI Prompt"
- **THEN** a markdown string is generated with character info, stats, an ordered ability table that includes both obtained and default active abilities, tree metadata, and Boulder Circle allocation

#### Scenario: Default active ability always included

- **WHEN** no abilities have been obtained but default active abilities exist (for example Butchering)
- **THEN** the prompt lists the default active abilities in the abilities section

#### Scenario: Empty abilities handled

- **WHEN** no abilities have been obtained and no default active abilities exist
- **THEN** the prompt includes "_No abilities obtained._" in the abilities section

### Requirement: Prompt format

The system SHALL format the AI prompt with clear sections: Character, Stats, Abilities, and Trees. The template instructions SHALL require the AI to answer with a single fixed table summary of build gameplay covering playstyle, win condition, ideal range, main combat loop, 1v1 and 1vX gameplans, core abilities, key synergies, stat priority, biggest strength, biggest weakness, and biggest mistake. The prompt SHALL NOT instruct the AI to analyze equipment, armor classes, or items.

#### Scenario: Structured prompt

- **WHEN** the AI prompt is generated
- **THEN** it contains markdown sections for Character, Stats, Abilities, and Trees
- **AND** the template instructs a single table summary output

#### Scenario: No equipment analysis

- **WHEN** the AI prompt is generated
- **THEN** the prompt does not ask the AI to analyze or recommend equipment, armor classes, or items

### Requirement: Boulder Circle display in prompt

The system SHALL include Boulder Circle bonus information in the Character section of the AI prompt.

#### Scenario: Bonus allocated

- **WHEN** the Boulder Circle bonus is allocated to a stat
- **THEN** the prompt shows "| Boulder Circle | +1 [STAT] |"

#### Scenario: Bonus unallocated

- **WHEN** the Boulder Circle bonus is not allocated
- **THEN** the prompt shows "| Boulder Circle | Not allocated |"
