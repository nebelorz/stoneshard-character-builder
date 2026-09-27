## MODIFIED Requirements

### Requirement: Stat description tooltip

The system SHALL show an interactive info control on each stat row that reveals the stat's full description in an enriched tooltip when hovered or focused. The control SHALL expose an interactive role and an accessible name rather than `role="img"`.

#### Scenario: Info icon shown per stat

- **WHEN** a stat row is rendered
- **THEN** it shows an info control next to the stat label

#### Scenario: Tooltip reveals the full description on hover

- **WHEN** the user hovers the info control of a stat
- **THEN** the enriched tooltip shows the stat's name, intro, per-point effects, milestone-tier effects, and cap

#### Scenario: Tooltip hides on mouse leave

- **WHEN** the cursor leaves the info control while the tooltip is visible
- **THEN** the tooltip disappears

#### Scenario: Tooltip reachable via keyboard

- **WHEN** the info control receives keyboard focus
- **THEN** the stat description tooltip appears, and hides when focus leaves

#### Scenario: Interactive role and accessible name

- **WHEN** the info control is rendered
- **THEN** it exposes an interactive role and an accessible name describing the stat, rather than `role="img"`

#### Scenario: Tooltip stays in viewport

- **WHEN** a stat tooltip is shown near a viewport edge
- **THEN** it repositions to remain fully visible
