# ability-description Specification

## Purpose

Defines how ability descriptions are authored in a canonical structured form, tokenized into typed nodes, colour-coded by modifier sign, and flattened back into clean plain text for non-visual consumers such as the AI prompt.

## Requirements

### Requirement: Canonical description format

Ability descriptions SHALL be authored in a canonical string format: every numeric modifier SHALL be delimited as `{expression}` with its leading sign inside the delimiters, effect names SHALL remain wrapped in double quotes, lines SHALL be separated by newlines, and a line beginning with `- ` SHALL denote a bullet. Quantities that are not modifiers (durations, tile counts, levels, stack counts) SHALL remain plain literal text.

#### Scenario: Modifier delimited with sign inside

- **WHEN** an ability description contains a numeric modifier such as `+(15 + 2 * AGL)%`
- **THEN** it is authored as `{+15 + 2 * AGL}%`

#### Scenario: Effect names quoted

- **WHEN** a description refers to a named effect such as Fencer Stance
- **THEN** the name is wrapped in double quotes

#### Scenario: Block bonus runs are bullet lines

- **WHEN** a description lists several bonuses after a colon
- **THEN** each bonus is placed on its own line beginning with `- `

#### Scenario: Non-modifier quantities stay literal

- **WHEN** a description states a duration, tile count, level, or stack count
- **THEN** that number is left as plain text and is not wrapped in delimiters

### Requirement: Description tokenization

The system SHALL derive a structured token stream from the canonical description, where each line is a paragraph or a bullet and each line is composed of ordered nodes that are text, a modifier (with its expression and sign), or an effect name.

#### Scenario: Nodes produced for a description line

- **WHEN** a canonical description line is tokenized
- **THEN** its delimited modifiers become modifier nodes, its quoted names become effect nodes, and the remaining runs become text nodes in their original order

#### Scenario: Bullet lines distinguished from paragraphs

- **WHEN** a canonical line begins with `- `
- **THEN** it is represented as a bullet line, otherwise it is represented as a paragraph line

#### Scenario: Modifier keeps its raw expression

- **WHEN** a modifier node is produced
- **THEN** it retains the raw expression text so it can be resolved later without re-parsing

### Requirement: Modifier sign semantics

The system SHALL classify each modifier by the sign of its expression: a leading `+` is positive, a leading `-` is negative, and any other leading character is neutral. Classification SHALL depend only on this leading sign and SHALL NOT evaluate the expression.

#### Scenario: Positive modifier classified as buff

- **WHEN** a modifier expression begins with `+`
- **THEN** it is classified as positive

#### Scenario: Negative modifier classified as debuff

- **WHEN** a modifier expression begins with `-`
- **THEN** it is classified as negative

#### Scenario: Unsigned modifier classified as neutral

- **WHEN** a modifier expression begins with neither `+` nor `-`
- **THEN** it is classified as neutral

### Requirement: Description colour semantics

The system SHALL assign a colour class to each token: positive modifiers use the beneficial colour, negative modifiers use the harmful colour, neutral modifiers use the variable colour, and effect names use the accent colour. Colour SHALL be conveyed through themed classes rather than inline values.

#### Scenario: Beneficial and harmful modifiers differentiated

- **WHEN** a description is rendered and contains both a positive and a negative modifier
- **THEN** the positive modifier and the negative modifier are visually distinguished by their colour classes

### Requirement: Plain-text derivation

The system SHALL derive a plain-text description from the canonical source by removing delimiters and bullet markers while preserving the modifier expressions and signs, joining lines into readable prose. The derived description SHALL contain no delimiter characters and no bullet markers.

#### Scenario: Delimiters removed for plain text

- **WHEN** the canonical `{+15 + 2 * AGL}%` is flattened
- **THEN** the plain text reads `+(15 + 2 * AGL)%` with no braces

#### Scenario: Bullets flattened into prose

- **WHEN** a bullet block is flattened
- **THEN** its lines are joined into prose with the `- ` markers removed

### Requirement: Engine-variable display lexicon

The system SHALL provide a lexicon that maps raw engine variable keys appearing in modifier expressions to human-readable display labels, and SHALL fall back to the raw key when no mapping exists.

#### Scenario: Known key mapped to label

- **WHEN** a modifier expression references `max_hp`
- **THEN** it is displayed as Max Health

#### Scenario: Unknown key preserved

- **WHEN** a modifier expression references a key absent from the lexicon
- **THEN** the raw key is displayed unchanged
