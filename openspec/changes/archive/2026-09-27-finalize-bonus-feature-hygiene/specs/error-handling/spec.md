## ADDED Requirements

### Requirement: Consistent data load error surfacing

Data services SHALL expose load failures through their resource error state, and SHALL NOT perform ad-hoc `console` logging as their error-reporting mechanism. Any reporting beyond the error state SHALL go through the application's configured error handling.

#### Scenario: Failed data fetch is observable

- **WHEN** a data file fails to load or fails validation
- **THEN** the failure is available through the data service's resource error state

#### Scenario: No ad-hoc console error logging

- **WHEN** a data service encounters a load error
- **THEN** it does not call `console.error` or `console.warn` directly to report it
