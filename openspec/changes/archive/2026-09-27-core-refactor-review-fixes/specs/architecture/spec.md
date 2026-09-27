## MODIFIED Requirements

### Requirement: Feature dependency direction

Application code SHALL depend on lower layers in one direction only: `features` and `layout` MAY depend on `core`, `models`, and `shared`; `layout` MAY additionally compose `features` but no feature SHALL import from another feature; `core` MAY depend only on `models`; `shared` and `models` SHALL NOT depend on `core`, `features`, or `layout`. No pair of modules SHALL depend on each other in both directions. Domain logic or state needed by more than one feature SHALL live in the `core` or `shared` layer rather than one feature importing another feature's internal services.

#### Scenario: One-way feature dependencies

- **WHEN** the import graph is inspected
- **THEN** no file under `features/<a>` imports from `features/<b>` where `<b>` is a different feature

#### Scenario: Shared domain logic has a shared home

- **WHEN** two features need the same domain logic or state (for example bonus point formulas or build state)
- **THEN** the logic or state is provided by the `core`/`shared` layer and each feature imports it from there, not from the other feature

#### Scenario: Layout composes features

- **WHEN** a layout component renders feature content
- **THEN** it imports the feature component, and no feature imports the layout module

#### Scenario: No bidirectional feature dependency

- **WHEN** the import graph of modules is inspected
- **THEN** no two modules depend on each other in both directions

## ADDED Requirements

### Requirement: Single source of truth for module resolution configuration

Import aliases and module resolution settings (`@core/*`, `@shared/*`, `@features/*`, `@models/*`, `@layout/*`) SHALL be defined once and consumed by every tool that resolves imports (build, test, and editor). Parallel copies that can drift, and alias entries that are unreachable because a broader prefix matches first, SHALL NOT be maintained.

#### Scenario: One definition per alias

- **WHEN** an import alias is used
- **THEN** exactly one configuration defines it and every resolver derives from that definition

#### Scenario: No shadowed aliases

- **WHEN** the resolution configuration is inspected
- **THEN** no exact alias is unreachable because a broader prefix entry matches it first

#### Scenario: Tooling configuration type-checks

- **WHEN** the build and test tooling configuration is type-checked
- **THEN** it compiles without missing type definitions for the globals and modules it uses
