# enriched-tooltip Specification

## Purpose

Provide a shared, model-driven enriched tooltip that renders structured content (trait content shipped now; ability and stat content models added later) anchored to a trigger, with keyboard access and one styling surface.

## Requirements

### Requirement: Content-model-driven rendering

The enriched tooltip SHALL render its content from a typed content object passed to the trigger, dispatched by content kind.

#### Scenario: Renders trait content

- **WHEN** a trigger is given trait content
- **THEN** the tooltip shows the trait name and description

#### Scenario: New content kinds plug in

- **WHEN** a new content kind is added to the content model
- **THEN** it renders through the same trigger and overlay, without changing existing call sites

### Requirement: Anchored positioning

The enriched tooltip SHALL position adjacent to its trigger element using the CDK Overlay, with a configurable preferred placement and automatic repositioning to stay within the viewport. The tooltip SHALL NOT overlap its trigger: every placement SHALL leave a gap between the tooltip and the trigger.

#### Scenario: Tooltip appears near the trigger

- **WHEN** the enriched tooltip is shown
- **THEN** it appears adjacent to the trigger element in the preferred placement

#### Scenario: Tooltip does not overlap its trigger

- **WHEN** the enriched tooltip is shown in a horizontal placement
- **THEN** it is offset away from the trigger by a gap, without overlapping it

#### Scenario: Tooltip stays in viewport at edges

- **WHEN** the preferred placement would extend beyond the viewport edge
- **THEN** the tooltip repositions to a placement that keeps it fully visible

### Requirement: Non-interactive overlay

The enriched tooltip overlay SHALL NOT intercept pointer events, so a visible tooltip can never cause its trigger to lose hover or focus.

#### Scenario: Tooltip does not steal the trigger's hover

- **WHEN** the tooltip is visible and the cursor moves on the trigger
- **THEN** the trigger remains hovered and the tooltip stays visible

### Requirement: Hover trigger

The enriched tooltip SHALL appear when the trigger is hovered and hide when the cursor leaves it. An empty or null content SHALL show no tooltip.

#### Scenario: Tooltip appears on hover

- **WHEN** the user hovers a trigger with content
- **THEN** a tooltip appears after a short delay

#### Scenario: Tooltip hides on mouse leave

- **WHEN** the cursor leaves the trigger while the tooltip is visible
- **THEN** the tooltip disappears

#### Scenario: No tooltip for empty content

- **WHEN** the trigger's content is null or empty
- **THEN** no tooltip is shown

### Requirement: Keyboard access

The enriched tooltip SHALL be reachable by keyboard: it SHALL appear when the trigger receives focus, hide when focus leaves, hide on Escape, and associate the trigger with the tooltip via `aria-describedby`.

#### Scenario: Tooltip appears on focus

- **WHEN** a trigger with content receives keyboard focus
- **THEN** the tooltip is displayed

#### Scenario: Tooltip hides on blur

- **WHEN** a focused trigger with a visible tooltip loses focus
- **THEN** the tooltip is hidden

#### Scenario: Tooltip hides on Escape

- **WHEN** a tooltip is visible and the user presses Escape
- **THEN** the tooltip is hidden

#### Scenario: Trigger associated with tooltip

- **WHEN** a tooltip is visible
- **THEN** the trigger element has `aria-describedby` pointing to the tooltip's id
