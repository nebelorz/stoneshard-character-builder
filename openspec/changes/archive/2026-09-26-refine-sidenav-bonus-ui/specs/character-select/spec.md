# character-select delta

## ADDED Requirements

### Requirement: Trait display in trait section

The system SHALL display the selected character's trait name in the trait section of the left sidenav, with the full trait description available through that section's info affordance tooltip. The character selector SHALL NOT render a separate trait affordance.

#### Scenario: Trait is visible

- **WHEN** a character is selected
- **THEN** their trait name is visible in the trait section directly below the character selector and the full description is reachable via the section's info affordance

#### Scenario: Selector shows no trait affordance

- **WHEN** the character selector renders
- **THEN** it displays the character's portrait, name, and title only, without a trait icon badge

## REMOVED Requirements

### Requirement: Trait display

**Reason**: The requirement centered trait visibility on the character selector's trait icon badge, which is removed as redundant now that the trait section sits directly below the selector and already displays the trait name with a description tooltip.

**Migration**: Trait name visibility and description access are specified by the new "Trait display in trait section" requirement in this capability, plus the trait section UI requirement in the bonus-points capability.
