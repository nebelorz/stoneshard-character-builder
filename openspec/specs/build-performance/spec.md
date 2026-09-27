# build-performance Specification

## Purpose

Keep the production build within its configured size budgets so builds complete without warnings and bundle-size regressions are caught.

## Requirements

### Requirement: Warning-free production build

The production build SHALL complete without exceeding any configured `angular.json` bundle budget, and the configured budgets SHALL reflect the application's actual size.

#### Scenario: Build within budget

- **WHEN** the production build runs
- **THEN** no budget warning or error is emitted

#### Scenario: Budget regression is caught

- **WHEN** a change increases the initial bundle beyond the configured maximum
- **THEN** the production build reports a budget error
