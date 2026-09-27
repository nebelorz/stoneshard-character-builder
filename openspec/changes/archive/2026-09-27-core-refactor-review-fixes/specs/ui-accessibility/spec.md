## ADDED Requirements

### Requirement: Interactive tooltip trigger semantics

A focusable tooltip trigger SHALL expose an interactive role appropriate to its behavior and SHALL NOT be announced as a non-interactive image. The trigger SHALL carry an accessible name and SHALL reference its tooltip via `aria-describedby` while the tooltip is shown.

#### Scenario: Interactive role

- **WHEN** a tooltip trigger is focusable via keyboard
- **THEN** it exposes an interactive role (for example `role="button"`) rather than `role="img"`

#### Scenario: Accessible name

- **WHEN** a tooltip trigger is rendered
- **THEN** it has an accessible name describing the content it explains

#### Scenario: Tooltip association

- **WHEN** the tooltip is shown
- **THEN** the trigger references the tooltip via `aria-describedby`
