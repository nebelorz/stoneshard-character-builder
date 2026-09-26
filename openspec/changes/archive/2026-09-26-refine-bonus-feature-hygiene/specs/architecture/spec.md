## ADDED Requirements

### Requirement: Feature dependency direction

Application code SHALL NOT introduce circular dependencies between feature modules. Domain logic needed by more than one feature SHALL be obtained from a shared or domain module that features depend on, rather than one feature importing another feature's internal services.

#### Scenario: Shared domain logic has a shared home

- **WHEN** two features need the same domain logic (for example bonus point formulas)
- **THEN** the logic is provided by a shared/domain module and each feature imports it from there, not from the other feature

#### Scenario: No bidirectional feature dependency

- **WHEN** the import graph of feature modules is inspected
- **THEN** no two features depend on each other in both directions

### Requirement: Single source of truth for configuration constants

Shared numeric limits and key lists (point budgets, bonus ceilings, and stat keys) SHALL be defined once and consumed from that definition. Duplicate literal values or parallel copies of the same list SHALL NOT be maintained.

#### Scenario: Shared budget referenced once

- **WHEN** a point budget or bonus ceiling is used by more than one component or service
- **THEN** every use resolves to a single exported definition

#### Scenario: Stat keys from one list

- **WHEN** stat keys are validated, iterated, or rendered
- **THEN** the same exported stat key list is the source of truth

## MODIFIED Requirements

### Requirement: Presentation vs domain logic

Components SHALL delegate domain logic to services/stores. Templates SHALL handle presentation logic only. Templates SHALL NOT compute derived domain values such as row counts or slot indices; those values SHALL be exposed by the component or store.

#### Scenario: Domain logic in stores

- **WHEN** business rules need to be applied
- **THEN** they live in store/service methods, not in component templates or classes

#### Scenario: No index arithmetic in templates

- **WHEN** a template renders indexed items such as trait or quest point slots
- **THEN** the index and row values are provided by the component, not calculated inline in the template

### Requirement: Avoid low-value tests

Tests that only verify template rendering or Angular boilerplate SHALL NOT be written. Tests SHALL verify behavior, not implementation. Tests SHALL NOT rely on computed CSS values, layout geometry (such as bounding boxes), or the absence of removed DOM as their primary assertion, and tests whose only purpose is to exercise code that no longer exists SHALL be deleted.

#### Scenario: No template tests

- **WHEN** tests are written
- **THEN** they verify behavioral outcomes, not DOM structure

#### Scenario: No layout or computed-style assertions

- **WHEN** a UI interaction is tested
- **THEN** the assertion verifies resulting state, emitted output, or another observable behavior rather than computed styles or element geometry

#### Scenario: Dead-code tests removed

- **WHEN** a public member is removed
- **THEN** tests that only covered that member are deleted instead of being rewritten to assert its absence
