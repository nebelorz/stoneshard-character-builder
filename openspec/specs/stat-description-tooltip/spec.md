# stat-description-tooltip Specification

## Purpose

Lets users learn what each character stat (STR, AGI, PER, VIT, WIL) means directly from the stat list in the left sidenav, rendered as an enriched tooltip behind each stat's info icon.

## Requirements

### Requirement: Stat description availability

The system SHALL provide a structured description for each of the five stat keys, covering the stat's intro, per-point effects, milestone-tier effects (at 15/20/25/30 points), and cap.

#### Scenario: Every stat has full description content

- **WHEN** the stat list is rendered
- **THEN** each of the five stats has intro, per-point, milestone, and cap content available to display

### Requirement: Stat description tooltip

The system SHALL show an info icon on each stat row that reveals the stat's full description in an enriched tooltip when hovered.

#### Scenario: Info icon shown per stat

- **WHEN** a stat row is rendered
- **THEN** it shows an info icon next to the stat label

#### Scenario: Tooltip reveals the full description on hover

- **WHEN** the user hovers the info icon of a stat
- **THEN** the enriched tooltip shows the stat's name, intro, per-point effects, milestone-tier effects, and cap

#### Scenario: Tooltip hides on mouse leave

- **WHEN** the cursor leaves the info icon while the tooltip is visible
- **THEN** the tooltip disappears

#### Scenario: Tooltip reachable via keyboard

- **WHEN** the info icon receives keyboard focus
- **THEN** the stat description tooltip appears, and hides when focus leaves

#### Scenario: Tooltip stays in viewport

- **WHEN** a stat tooltip is shown near a viewport edge
- **THEN** it repositions to remain fully visible
