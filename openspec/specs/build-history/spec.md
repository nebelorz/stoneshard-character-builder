# build-history Specification

## Purpose

Chronological record of stat assignments and ability acquisitions, grouped by level, enabling players to see and share the exact order of build decisions.

## Requirements

### Requirement: Merged build history display

The system SHALL derive a chronological build history by merging obtainedAbilities and statHistory, sorted by level then order.

#### Scenario: Merged history rendering

- **WHEN** the build history is displayed
- **THEN** entries from obtainedAbilities and statHistory are merged, sorted by level ascending then order ascending

#### Scenario: Grouped by level

- **WHEN** the merged history is rendered in the Route section
- **THEN** entries are grouped under level headers (e.g., "Level 1", "Level 2")

#### Scenario: Entry display format

- **WHEN** a history entry is rendered
- **THEN** ability entries show the ability name with an ability indicator, and stat entries show the stat name with "+1" and a stat indicator

### Requirement: Build history on ability icons

The system SHALL display the obtainedLevel badge on each ability icon in the tree view.

#### Scenario: Level badge visible

- **WHEN** an ability is obtained
- **THEN** its icon displays the level at which it was obtained in the bottom-right corner

### Requirement: Build history in shared URL

The system SHALL include statHistory in the compressed URL state so recipients can see the full build order.

#### Scenario: Shared URL contains history

- **WHEN** a user shares a build via URL
- **THEN** the recipient can see the complete build history including stat assignments
