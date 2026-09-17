# ui-theme Specification

## Purpose

Defines the Stoneshard color palette system with organized SCSS variables, semantic color groups, and component theming conventions for consistent visual identity across the application.

## Requirements

### Requirement: Color palette SHALL use Stoneshard's actual game colors

The system SHALL define color variables based on the official Stoneshard palette (purples, bronzes, muted tones) rather than generic dark grays.

#### Scenario: Background colors match game aesthetic

- **WHEN** the application renders any background element
- **THEN** the background uses colors from the Stoneshard purple-tinted palette

#### Scenario: Accent colors match game aesthetic

- **WHEN** the application displays gold or accent elements
- **THEN** the colors use Stoneshard's bronze/gold tones

### Requirement: Color variables SHALL be organized in semantic groups

The system SHALL organize SCSS variables into logical groups: backgrounds, purples, accents, text, and semantic colors.

#### Scenario: Variables are grouped by purpose

- **WHEN** a developer reads _variables.scss
- **THEN** variables are organized into clear sections indicating their purpose

### Requirement: No hardcoded color values in component styles

Component SCSS files SHALL NOT contain hardcoded hex color values. All colors MUST reference theme variables from _variables.scss.

#### Scenario: Component uses theme variables

- **WHEN** a component needs a color value
- **THEN** it references a variable from _variables.scss

### Requirement: Theme SHALL maintain visual hierarchy

The color system SHALL preserve clear visual hierarchy with distinct colors for backgrounds, borders, text, and accents.

#### Scenario: Background hierarchy is maintained

- **WHEN** the application renders nested UI elements
- **THEN** each level uses a progressively lighter background

#### Scenario: Text readability is preserved

- **WHEN** text is displayed on any background color
- **THEN** the text color provides sufficient contrast for readability

### Requirement: Typography

The system SHALL use IM Fell English SC for headings and Alegreya Sans SC for body text, applied via font-family variables.

#### Scenario: Headings use game font

- **WHEN** headings or titles are rendered
- **THEN** they use IM Fell English SC

#### Scenario: Body text uses readable font

- **WHEN** body text or UI labels are rendered
- **THEN** they use Alegreya Sans SC

### Requirement: Shared button styles

The component library SHALL provide reusable button mixins for side navigation buttons.

#### Scenario: Button mixin exists

- **WHEN** a developer needs side-nav button styles
- **THEN** they can include the side-nav-btn mixin from _components.scss

#### Scenario: Button modifiers included

- **WHEN** the side-nav-btn mixin is included
- **THEN** it provides base, hover, disabled, sm, and 5 modifiers

### Requirement: Shared stat display styles

The component library SHALL provide reusable stat display mixins.

#### Scenario: Stat label mixin

- **WHEN** a developer needs stat label styles
- **THEN** they can include the side-nav-stat-label mixin

#### Scenario: Resource display mixins

- **WHEN** a developer needs resource display styles
- **THEN** they can include side-nav-resource, side-nav-resource-label, and side-nav-resource-value mixins

### Requirement: Shared level display styles

The component library SHALL provide reusable level display mixins.

#### Scenario: Level section mixin

- **WHEN** a developer needs level section styles
- **THEN** they can include the side-nav-level-section mixin

#### Scenario: Level controls mixin

- **WHEN** a developer needs level controls styles
- **THEN** they can include side-nav-level-row, side-nav-level-controls, and side-nav-level-value mixins

### Requirement: Tooltip styling consistency

Tooltip styling SHALL use shared SCSS mixins instead of inline styles.

#### Scenario: Tooltip uses shared mixins

- **WHEN** the TooltipDirective creates a tooltip
- **THEN** it applies styles from _tooltip.scss mixins instead of inline Object.assign
