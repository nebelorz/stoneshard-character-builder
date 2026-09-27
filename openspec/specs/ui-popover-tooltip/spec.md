# ui-popover-tooltip Specification

## Purpose

Provide popover containers for action menus and themed tooltips for interactive elements.

## Requirements

### Requirement: Popover display

The popover SHALL use CDK Overlay for positioning and support focus trapping. The popover SHALL fade in when opened and fade out when closed.

#### Scenario: Popover opens on trigger with fade-in

- **WHEN** the user clicks an action button (Share, AI Prompt, Reset)
- **THEN** a CDK Overlay-based popover fades in and appears positioned relative to the trigger

#### Scenario: Popover closes on outside click with fade-out

- **WHEN** the user clicks outside the popover
- **THEN** the popover fades out and closes

#### Scenario: Popover closes on Escape with fade-out

- **WHEN** the user presses Escape while a popover is open
- **THEN** focus returns to the trigger element and the popover fades out and closes

#### Scenario: Popover closes on scroll

- **WHEN** the user scrolls while a popover is open
- **THEN** the popover closes

#### Scenario: Popover closes on resize

- **WHEN** the viewport is resized while a popover is open
- **THEN** the popover closes

#### Scenario: Focus trapped in popover

- **WHEN** a popover is open
- **THEN** Tab key cycles through focusable elements within the popover

#### Scenario: Popover toggles on trigger re-click

- **WHEN** the user clicks the same action button while its popover is already open
- **THEN** the popover fades out and closes

### Requirement: Confirm popup

The system SHALL display a confirmation popup with Confirm and Cancel buttons for destructive actions. The confirmation popup SHALL be presented as a modal dialog rendered within the same overlay mechanism used for popovers, positioned relative to the element that triggered it.

#### Scenario: Confirm popup shown

- **WHEN** a destructive action is triggered
- **THEN** a popup with a message, Confirm button, and Cancel button appears positioned relative to the trigger element

#### Scenario: Confirm popup accessibility semantics

- **WHEN** a confirmation popup is shown
- **THEN** it is exposed to assistive technology as an alert dialog (role="alertdialog"), is modal (aria-modal="true"), and is labelled by its message text

#### Scenario: Confirm action

- **WHEN** the user clicks Confirm
- **THEN** the action is performed and the popup closes

#### Scenario: Cancel action

- **WHEN** the user clicks Cancel
- **THEN** no action is performed and the popup closes

### Requirement: Simple tooltip directive

The tooltip directive SHALL use CDK Overlay for positioning and support aria-describedby association.

#### Scenario: Tooltip appears on hover

- **WHEN** the user hovers over an element with the tooltip directive
- **THEN** a styled tooltip chip appears after a configurable delay via CDK Overlay

#### Scenario: Tooltip does not appear for empty text

- **WHEN** the tooltip text input is empty, null, or undefined
- **THEN** no tooltip is displayed

#### Scenario: Tooltip hides on mouse leave

- **WHEN** the tooltip is visible and the cursor leaves the host element
- **THEN** the tooltip is removed

#### Scenario: Tooltip hides on scroll/resize

- **WHEN** the tooltip is visible and the page scrolls or viewport resizes
- **THEN** the tooltip is hidden

#### Scenario: Tooltip placement parametrized

- **WHEN** the tooltip placement is set to top, bottom, left, or right
- **THEN** the tooltip appears in that direction relative to the host element

#### Scenario: Tooltip appended to document.body

- **WHEN** the host element is inside a container with overflow hidden
- **THEN** the tooltip is still fully visible because it is appended to document.body

#### Scenario: Tooltip ARIA association

- **WHEN** a tooltip is visible
- **THEN** the trigger element has aria-describedby pointing to the tooltip id

#### Scenario: Tooltip dismissible via Escape

- **WHEN** a tooltip is visible and user presses Escape
- **THEN** the tooltip is hidden

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

### Requirement: Dialog focus management

Popovers and confirm popups SHALL move focus into the dialog when opened and restore focus to the trigger element when closed.

#### Scenario: Focus moves into dialog on open

- **WHEN** a popover or confirm popup opens
- **THEN** focus moves to the first focusable element inside the dialog

#### Scenario: Confirm button receives focus

- **WHEN** a confirm popup opens
- **THEN** focus moves to the Confirm button

#### Scenario: Focus restored on Escape

- **WHEN** a popover or confirm popup is closed with Escape
- **THEN** focus returns to the element that triggered the dialog

#### Scenario: Focus restored on outside click

- **WHEN** a popover is closed by clicking outside it
- **THEN** focus returns to the element that triggered the popover

#### Scenario: Focus restored on Cancel/Confirm

- **WHEN** a confirm popup is closed via Cancel or Confirm
- **THEN** focus returns to the element that triggered the popup

#### Scenario: Popover is modal

- **WHEN** a popover dialog is rendered
- **THEN** it has aria-modal="true" so screen readers treat the background as inert

### Requirement: Tooltip keyboard access

Tooltips SHALL appear for keyboard users when their trigger receives focus and hide when focus leaves.

#### Scenario: Focus shows tooltip

- **WHEN** an element with a tooltip receives focus
- **THEN** the tooltip is displayed

#### Scenario: Blur hides tooltip

- **WHEN** a focused element with a tooltip loses focus
- **THEN** the tooltip is hidden
