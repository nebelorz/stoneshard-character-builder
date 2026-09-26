# resource-display Specification

## Purpose

Display AP and SP resources with icons and progress bars in the stat controls panel, providing visual feedback on resource consumption.

## Requirements

### Requirement: AP display with icon and progress bar

The system SHALL display AP with a book icon, a text label, the current total value (unspent level AP plus trait-derived AP), and a progress bar showing the ratio against the 31-point level budget. When the total exceeds 31 the fill SHALL cap at 100% width. When trait-derived AP is greater than zero the display SHALL show a badge with the derived portion.

#### Scenario: AP displayed at full

- **WHEN** the AP total equals or exceeds the maximum (31)
- **THEN** the progress bar fill is at 100% width

#### Scenario: AP displayed when partially consumed

- **WHEN** the AP total is less than the maximum
- **THEN** the progress bar fill width equals (total / 31) * 100 percent

#### Scenario: Trait breakdown badge shown

- **WHEN** the selected character has trait-derived AP greater than zero
- **THEN** the AP display shows a badge with the derived portion alongside the total value

#### Scenario: Total above level budget

- **WHEN** the AP total is 33 (31 level AP plus 2 derived)
- **THEN** the progress bar fill is capped at 100% width and the value shows 33 with a derived badge

### Requirement: SP display with icon and progress bar

The system SHALL display SP with a plus-square icon, a text label, the current value, and a progress bar showing current/max ratio.

#### Scenario: SP displayed at full

- **WHEN** SP equals the maximum (29)
- **THEN** the progress bar fill is at 100% width

#### Scenario: SP displayed when partially consumed

- **WHEN** SP is less than maximum
- **THEN** the progress bar fill width equals (current / 29) * 100 percent

### Requirement: Progress bar styling

Progress bars SHALL use the `bg-deepest` color for fills and display icons with `text-secondary` color.

#### Scenario: Visual consistency

- **WHEN** AP or SP progress bars are rendered
- **THEN** both bars use the same fill color and icon color scheme

### Requirement: Resource layout

AP and SP resources SHALL be displayed vertically below the stat controls, separated by a divider.

#### Scenario: Vertical arrangement

- **WHEN** the stat controls panel is rendered
- **THEN** AP appears above SP, each on its own row with icon, label, value, and progress bar
