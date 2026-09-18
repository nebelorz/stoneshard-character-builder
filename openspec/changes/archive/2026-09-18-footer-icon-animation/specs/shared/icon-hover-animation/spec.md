## Purpose

Provides a reusable animation effect that adds a subtle zoom and jiggle to icons on hover, enhancing visual feedback across the application.

## ADDED Requirements

### Requirement: Icon hover animation SHALL apply zoom effect

The system SHALL apply a subtle zoom-in effect to an icon when the user hovers over it.

#### Scenario: Zoom on hover

- **WHEN** the user hovers over an element with the animation applied
- **THEN** the icon scales up slightly (e.g., 1.1x) with a smooth transition

#### Scenario: Zoom resets on leave

- **WHEN** the user moves the mouse away from the element
- **THEN** the icon returns to its original scale

### Requirement: Icon hover animation SHALL apply jiggle effect

The system SHALL apply a subtle jiggle (small rotation oscillation) to an icon on hover.

#### Scenario: Jiggle on hover

- **WHEN** the user hovers over an element with the animation applied
- **THEN** the icon performs a brief jiggle rotation (e.g., -3deg to 3deg)

#### Scenario: Jiggle completes smoothly

- **WHEN** the jiggle animation plays
- **THEN** it completes within 300ms and settles at the final rotated state or returns to neutral

### Requirement: Animation SHALL be reusable

The system SHALL provide the animation as a reusable Angular animation trigger or directive that can be applied to any element.

#### Scenario: Animation trigger usage

- **WHEN** a component imports the animation trigger
- **THEN** it can bind the trigger to any element using Angular animation syntax

#### Scenario: Directive usage

- **WHEN** a component applies the directive to an element
- **THEN** the animation activates on hover without additional configuration

### Requirement: Animation SHALL be performant

The system SHALL use CSS transforms for the animation to ensure GPU-accelerated rendering.

#### Scenario: No layout thrashing

- **WHEN** the animation plays
- **THEN** it does not trigger layout reflows or paint operations beyond the transform
