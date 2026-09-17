## Purpose

Integrates the existing AI prompt template with live build data so that a single copy action produces a complete, AI-ready prompt containing both analysis instructions and enriched character build information.

## Requirements

### Requirement: Template loading and caching

The system SHALL load the prompt template from `assets/ia/prompt_template.md` via HTTP on first use and cache it for subsequent requests.

#### Scenario: First copy triggers template fetch

- **WHEN** the user triggers AI prompt copy for the first time in a session
- **THEN** the system fetches the template file and caches the result

#### Scenario: Subsequent copies use cached template

- **WHEN** the user triggers AI prompt copy after a previous successful fetch
- **THEN** the system uses the cached template without re-fetching

#### Scenario: Template fetch failure

- **WHEN** the template fetch fails (network error, 404, etc.)
- **THEN** the system falls back to generating build data sections only (Character, Stats, Abilities) without the template instructions

### Requirement: Template section trimming

The system SHALL include all template content up to but excluding the `# BUILD DATA` marker, and SHALL exclude the `# BUILD DATA` and `# ADDITIONAL GAME DATA` placeholder sections that follow it.

#### Scenario: Template content is trimmed correctly

- **WHEN** the template is loaded and processed
- **THEN** the output contains the template's instruction content
- **AND** the output does not contain `# BUILD DATA` or `# ADDITIONAL GAME DATA`

### Requirement: Relevant tree metadata

The system SHALL include metadata (name, category, focus, critEffect) for every ability tree referenced by an obtained ability or a default active ability.

#### Scenario: Trees are included for obtained abilities

- **WHEN** the obtained and default abilities reference abilities from 2 different trees
- **THEN** metadata for both trees appears in the prompt

#### Scenario: Default ability tree included on its own

- **WHEN** the only ability present is a default active ability from a tree with no other obtained abilities
- **THEN** metadata for that tree appears in the prompt

### Requirement: Complete prompt assembly

The system SHALL assemble the final prompt by concatenating: trimmed template + Character section + Stats section + Abilities table + Trees section. The prompt SHALL NOT include a separate Prerequisites section.

#### Scenario: One-click copy produces full prompt

- **WHEN** the user clicks the AI prompt copy button
- **THEN** the clipboard contains the trimmed template instructions followed by character, stats, abilities, and tree data

#### Scenario: Empty build produces valid prompt

- **WHEN** the build has no obtained abilities but default active abilities exist
- **THEN** the prompt still contains the template instructions, character data, and stats
- **AND** the abilities section lists the default active abilities

### Requirement: One-shot instruction template

The system SHALL load a template whose instructions ask the AI to produce a single fixed markdown table summarizing build gameplay, and SHALL NOT include instructions for interactive coaching, combat scenarios, comparisons, equipment, armor classes, or items.

#### Scenario: Template contains a fixed table output contract

- **WHEN** the template is loaded
- **THEN** it instructs the AI to output a single table with playstyle, win condition, ideal range, main combat loop, 1v1 gameplan, 1vX gameplan, core abilities, key synergies, stat priority, biggest strength, biggest weakness, and biggest mistake

#### Scenario: Template excludes equipment and coaching instructions

- **WHEN** the template is loaded
- **THEN** it does not contain instructions about equipment synergy, armor classes, combat scenarios, or interactive coaching

### Requirement: Table-based ability formatting

The system SHALL format each obtained ability as a single markdown table row containing: acquisition order, name, type, energy, cooldown, range, scaling stat, and full description. The system SHALL render no-op fields (energy, cooldown, range, scaling stat) of passive abilities as `-`. The system SHALL NOT include raw ability IDs, `requires` lists, `children` lists, or per-ability level in the ability rows.

#### Scenario: Obtained ability is formatted as a table row

- **WHEN** an obtained ability is included in the prompt
- **THEN** it appears as one table row with order, name, type, energy, cooldown, range, scaling stat, and description

#### Scenario: Passive ability renders no-op fields

- **WHEN** the ability type is `passive`
- **THEN** its energy, cooldown, range, and scaling stat cells contain `-`

#### Scenario: Raw IDs are omitted

- **WHEN** an ability is formatted
- **THEN** the output does not contain `requires` or `children` ID lists

### Requirement: Obtained-only ability subset

The system SHALL include in the prompt the obtained abilities plus any configured default active abilities, deduplicated when a default active ability is also obtained. The system SHALL NOT expand the set with prerequisites or children of obtained abilities beyond the configured defaults.

#### Scenario: Only obtained abilities are included

- **WHEN** an obtained ability has prerequisites or children that are neither obtained nor configured as default active
- **THEN** those prerequisites and children do not appear in the prompt

#### Scenario: Default ability not duplicated when obtained

- **WHEN** a default active ability is also obtained by the user
- **THEN** it appears exactly once in the abilities table
