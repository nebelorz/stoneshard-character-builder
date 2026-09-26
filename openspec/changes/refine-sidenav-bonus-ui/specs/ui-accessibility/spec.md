# ui-accessibility delta

## REMOVED Requirements

### Requirement: Trait icon keyboard accessibility

**Reason**: The character selector's trait icon was removed as redundant with the trait section, so there is no selector trait icon left to be keyboard accessible.

**Migration**: The trait section's info affordance provides keyboard access to the trait description, per the enriched-tooltip and left-sidenav-layout capabilities.

### Requirement: Trait icon accessible name

**Reason**: The character selector's trait icon was removed; the accessible trait name is exposed by the trait section's label and its info affordance's accessible name.

**Migration**: The trait section header announces the trait name, and its info affordance carries a descriptive accessible name for the tooltip.
