## MODIFIED Requirements

### Requirement: Feature dependency direction

Application code SHALL depend on lower layers in one direction only: `features` and `layout` MAY depend on `core`, `models`, and `shared`; `layout` MAY additionally compose `features` but no feature SHALL import from another feature; `core` MAY depend only on `models`; `shared` MAY depend on `models`; and `models` SHALL NOT depend on `core`, `features`, `layout`, or `shared`. Neither `shared` nor `models` SHALL depend on `core`, `features`, or `layout`. No pair of modules SHALL depend on each other in both directions. Domain logic, state, or data shapes needed by more than one layer SHALL live in the lowest layer that all consumers may depend on rather than being imported back upward.

#### Scenario: One-way feature dependencies

- **WHEN** the import graph is inspected
- **THEN** no file under `features/<a>` imports from `features/<b>` where `<b>` is a different feature

#### Scenario: Models is the lowest layer

- **WHEN** the import graph of the `models` layer is inspected
- **THEN** no file under `models/` imports from `shared`, `core`, `features`, or `layout`

#### Scenario: Shared depends on models in one direction

- **WHEN** a `shared` file needs a domain type such as `BuildNotes` or tooltip content
- **THEN** it imports that type from the `models` layer, and no `models` file imports any `shared` file back

#### Scenario: Shared domain logic has a shared home

- **WHEN** two features need the same domain logic or state (for example bonus point formulas or build state)
- **THEN** the logic or state is provided by the `core`/`shared` layer and each feature imports it from there, not from the other feature

#### Scenario: Layout composes features

- **WHEN** a layout component renders feature content
- **THEN** it imports the feature component, and no feature imports the layout module

#### Scenario: No bidirectional feature dependency

- **WHEN** the import graph of modules is inspected
- **THEN** no two modules depend on each other in both directions
