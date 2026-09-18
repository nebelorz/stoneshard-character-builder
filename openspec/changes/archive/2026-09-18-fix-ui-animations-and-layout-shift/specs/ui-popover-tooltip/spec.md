## MODIFIED Requirements

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
