## MODIFIED Requirements

### Requirement: Ability tooltip

The system SHALL display a rich ability tooltip card on hover, positioned adjacent to the ability icon and flipping direction at viewport edges, and SHALL NOT raise an uncaught error when opened. The card SHALL show the ability name and type, and SHALL present target, range, energy, and cooldown together for every ability as a compact strip so cards remain comparable. Card labels and section headings SHALL be rendered in uppercase. The scaling statistics SHALL be shown as tokens: core statistics use their stat colour, other scaling terms use a neutral token style, and any unrecognized term renders as plain text. The ability description SHALL render as structured content, with bullet blocks rendered as separate rows and modifiers colour-coded by sign, rather than as a single flat text node. For a locked ability the card SHALL show a Requires section that expresses the requirement logic with explicit AND groups and OR alternatives, and an Unlock conditions section. The card SHALL be hoverable and internally scrollable so long descriptions remain reachable: leaving the trigger SHALL hide the card after a short delay, that delay SHALL be cancelled while the pointer is over the card, and entering another ability icon SHALL hide the card immediately. The card SHALL cap its height relative to the viewport, and when its content overflows the scroll region SHALL be keyboard focusable and the card SHALL be dismissible with Escape.

#### Scenario: Tooltip for unlocked ability

- **WHEN** the user hovers over an unlocked or obtained ability icon
- **THEN** a card appears with the name, type, all four metrics, the scaling statistics as tokens, and the structured description

#### Scenario: Tooltip for locked ability

- **WHEN** the user hovers over a locked ability icon
- **THEN** a card appears with ability details plus a Requires section with parent icons and an Unlock conditions section

#### Scenario: All metrics shown for a passive ability

- **WHEN** the user hovers over a passive ability with no target, no energy cost, and no cooldown
- **THEN** the card still shows target, range, energy, and cooldown rather than omitting them

#### Scenario: Scaling statistics classified as tokens

- **WHEN** an ability is modified by named statistics
- **THEN** core statistics render as coloured tokens and every other scaling term renders as a neutral token

#### Scenario: Unrecognized scaling term falls back to text

- **WHEN** a scaling term does not match a known statistic
- **THEN** it renders as plain text instead of a token

#### Scenario: Card labels use uppercase

- **WHEN** the card renders its labels and section headings
- **THEN** they are rendered in uppercase

#### Scenario: Requirement logic is unambiguous

- **WHEN** a locked ability has requirement groups where alternatives are OR and groups are AND
- **THEN** each AND group is visually distinct and its alternatives are marked as alternatives, so the logic cannot be misread as a single run

#### Scenario: Smart positioning

- **WHEN** the card would extend beyond the viewport edge
- **THEN** the card repositions to remain fully visible

#### Scenario: Tooltip opens without error

- **WHEN** the user hovers over or focuses an ability icon
- **THEN** the card is displayed and no uncaught error is raised and no error toast is shown

#### Scenario: Description block bonuses render as rows

- **WHEN** the card description contains a bullet block
- **THEN** each bullet is rendered as its own row instead of running together with adjacent text

#### Scenario: Description modifiers colour-coded

- **WHEN** the card description contains modifiers
- **THEN** beneficial modifiers render in the positive colour, harmful modifiers in the negative colour, and unsigned modifiers in the neutral colour

#### Scenario: Long card remains reachable with the pointer

- **WHEN** the card is visible and the pointer moves from the ability icon onto the card
- **THEN** the card stays visible and its overflow is scrollable, so a user can read content taller than the card height

#### Scenario: Entering another ability icon hides the card

- **WHEN** the pointer enters a different ability icon while a card is visible
- **THEN** the current card is hidden immediately so it never blocks the other icon

#### Scenario: Card hides after leaving

- **WHEN** the pointer leaves both the ability icon and the card and the hide delay elapses
- **THEN** the card is hidden

#### Scenario: Card height is capped to the viewport

- **WHEN** the content would make the card taller than its viewport-relative maximum height
- **THEN** the card caps its height and scrolls its content internally

#### Scenario: Long card is reachable by keyboard

- **WHEN** the card content overflows its capped height and the user navigates by keyboard
- **THEN** the overflow region can receive focus so its content can be scrolled, and Escape hides the card
