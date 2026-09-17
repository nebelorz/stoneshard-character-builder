# ui-popover-tooltip Specification

## Purpose

Provide popover containers for action menus and themed tooltips for interactive elements.

## Requirements

### Requirement: Popover display

The popover SHALL use CDK Overlay for positioning and support focus trapping.

#### Scenario: Popover opens on trigger

- **WHEN** the user clicks an action button (Share, AI Prompt, Reset)
- **THEN** a CDK Overlay-based popover appears positioned relative to the trigger

#### Scenario: Popover closes on outside click

- **WHEN** the user clicks outside the popover
- **THEN** the popover closes

#### Scenario: Popover closes on Escape

- **WHEN** the user presses Escape while a popover is open
- **THEN** focus returns to the trigger element and the popover closes

#### Scenario: Popover closes on scroll

- **WHEN** the user scrolls while a popover is open
- **THEN** the popover closes

#### Scenario: Popover closes on resize

- **WHEN** the viewport is resized while a popover is open
- **THEN** the popover closes

#### Scenario: Focus trapped in popover

- **WHEN** a popover is open
- **THEN** Tab key cycles through focusable elements within the popover

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

The system SHALL display a rich ability tooltip on hover showing ability details, positioned near the cursor and flipping direction at viewport edges, and SHALL NOT raise an uncaught error when opened.

#### Scenario: Tooltip for unlocked ability

- **WHEN** the user hovers over an unlocked or obtained ability icon
- **THEN** a tooltip appears with name, type, energy, cooldown, range, description

#### Scenario: Tooltip for locked ability

- **WHEN** the user hovers over a locked ability icon
- **THEN** a tooltip appears with ability details plus "Requires" section with parent icons and "Unlock" section

#### Scenario: Smart positioning

- **WHEN** the tooltip would extend beyond the viewport edge
- **THEN** the tooltip repositions to remain fully visible

#### Scenario: Tooltip opens without error

- **WHEN** the user hovers over or focuses an ability icon
- **THEN** the tooltip is displayed and no uncaught error is raised and no error toast is shown

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
