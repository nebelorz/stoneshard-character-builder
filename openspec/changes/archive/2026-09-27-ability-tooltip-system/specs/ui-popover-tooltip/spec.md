## MODIFIED Requirements

### Requirement: Ability tooltip

The system SHALL display a rich ability tooltip on hover showing ability details, positioned near the cursor and flipping direction at viewport edges, and SHALL NOT raise an uncaught error when opened. The ability description SHALL render as structured content, with bullet blocks rendered as separate rows and modifiers colour-coded by sign, rather than as a single flat text node.

#### Scenario: Tooltip for unlocked ability

- **WHEN** the user hovers over an unlocked or obtained ability icon
- **THEN** a tooltip appears with name, type, energy, cooldown, range, and the structured description

#### Scenario: Tooltip for locked ability

- **WHEN** the user hovers over a locked ability icon
- **THEN** a tooltip appears with ability details plus "Requires" section with parent icons and "Unlock" section

#### Scenario: Smart positioning

- **WHEN** the tooltip would extend beyond the viewport edge
- **THEN** the tooltip repositions to remain fully visible

#### Scenario: Tooltip opens without error

- **WHEN** the user hovers over or focuses an ability icon
- **THEN** the tooltip is displayed and no uncaught error is raised and no error toast is shown

#### Scenario: Description block bonuses render as rows

- **WHEN** the tooltip description contains a bullet block
- **THEN** each bullet is rendered as its own row instead of running together with adjacent text

#### Scenario: Description modifiers colour-coded

- **WHEN** the tooltip description contains modifiers
- **THEN** beneficial modifiers render in the positive colour, harmful modifiers in the negative colour, and unsigned modifiers in the neutral colour
