## MODIFIED Requirements

### Requirement: Presentation vs domain logic

Components SHALL delegate domain logic to services/stores. Templates SHALL handle presentation logic only. Components SHALL expose domain-derived values as computed signals rather than template-invoked methods, and templates SHALL NOT recompute or allocate derived collections during change detection.

#### Scenario: Domain logic in stores

- **WHEN** business rules need to be applied
- **THEN** they live in store/service methods, not in component templates or classes

#### Scenario: Derived values are computed signals

- **WHEN** a template needs a value derived from build state (for example a per-row view model or a stat display name)
- **THEN** the component exposes it through a computed signal and the template reads the signal directly

#### Scenario: No per-change-detection recomputation

- **WHEN** a component renders repeated rows
- **THEN** the template does not invoke methods that build new arrays or objects on every change detection cycle

#### Scenario: No index arithmetic in templates

- **WHEN** a template renders indexed items such as trait or quest point slots
- **THEN** the index and row values are provided by the component, not calculated inline in the template

### Requirement: Avoid low-value tests

Tests that only verify template rendering or Angular boilerplate SHALL NOT be written. Tests SHALL verify behavior, not implementation. Tests SHALL NOT assert element structure, CSS classes, or presentational attributes as their primary assertion, and SHALL prefer observable state, emitted outputs, or the ARIA contract.

#### Scenario: No template tests

- **WHEN** tests are written
- **THEN** they verify behavioral outcomes, not DOM structure

#### Scenario: No structural or styling assertions

- **WHEN** a UI component is tested
- **THEN** the assertion verifies state, emitted output, or the ARIA contract rather than element order, CSS class names, or styling-only attributes

#### Scenario: Accessibility contract is behavior

- **WHEN** an accessibility behavior is tested
- **THEN** the test asserts the ARIA wiring (roles, labels, describedby/expanded state) or the resulting user-visible behavior, not the presence of a wrapper element

#### Scenario: No layout or computed-style assertions

- **WHEN** a UI interaction is tested
- **THEN** the assertion verifies resulting state, emitted output, or another observable behavior rather than computed styles or element geometry

#### Scenario: Dead-code tests removed

- **WHEN** a public member is removed
- **THEN** tests that only covered that member are deleted instead of being rewritten to assert its absence

## ADDED Requirements

### Requirement: Layered module structure

Application code SHALL depend on lower layers in one direction only: `features` and `layout` MAY depend on `core`, `models`, and `shared`; `core` MAY depend on `models` and `shared`; `shared` and `models` SHALL NOT depend on `core`, `features`, or `layout`. No feature module SHALL import from another feature module, and no pair of modules SHALL depend on each other in both directions.

#### Scenario: One-way feature dependencies

- **WHEN** the import graph is inspected
- **THEN** no file under `features/<a>` imports from `features/<b>` where `<b>` is a different feature

#### Scenario: Shared state has a single home

- **WHEN** two or more features need the same application state, store, or data service
- **THEN** it is provided by the `core` layer and each feature imports it from `core`

#### Scenario: No bidirectional dependency

- **WHEN** the import graph of modules is inspected
- **THEN** no two modules depend on each other in both directions

### Requirement: Single source of truth for presentation metadata

Human-readable metadata shared across components (such as stat display names) SHALL be defined once and reused. Components SHALL NOT maintain parallel copies of metadata that already exists in the domain model.

#### Scenario: Stat names come from the domain

- **WHEN** a component needs a stat's display name
- **THEN** it reads the name from the existing stat metadata definition rather than a local duplicate map

#### Scenario: No parallel metadata copies

- **WHEN** the same display string is needed in more than one place
- **THEN** a single exported definition is referenced everywhere
