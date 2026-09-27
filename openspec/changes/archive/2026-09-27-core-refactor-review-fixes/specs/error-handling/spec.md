## ADDED Requirements

### Requirement: Non-blocking quest data load notification

When quest data fails to load or fails validation, the system SHALL surface the failure to the user through a non-blocking notification without preventing application startup, character selection, or build editing.

#### Scenario: Quest load failure is reported

- **WHEN** quests.json fails to load or fails validation
- **THEN** a non-blocking notification is shown and the application remains usable

#### Scenario: Startup is not blocked

- **WHEN** quest data fails while character, tree, and ability data load successfully
- **THEN** the application initializes normally and no blocking error component is shown for the quest failure

#### Scenario: Failure is not silent

- **WHEN** quest data fails to load
- **THEN** the failure is observable to the user rather than only recorded in the resource error state
