# architecture Specification

## Purpose

Define the target application architecture for the Stoneshard Character Builder, establishing principles for Angular, state management, data layer, UI foundation, styling, component architecture, shared layer, and testing.

## Requirements

**Angular Framework**

### Requirement: Angular 22 with modern APIs

The application SHALL use Angular 22 with standalone components, signal-based reactivity, signal inputs/outputs, `model()` for two-way binding, OnPush change detection, and modern lifecycle APIs. Legacy Angular patterns (NgModule, decorators-based inputs/outputs) SHALL NOT be introduced.

#### Scenario: Standalone components

- **WHEN** new components are created
- **THEN** they use standalone: true without NgModule declarations

#### Scenario: Signal-based reactivity

- **WHEN** components need reactive state
- **THEN** they use Angular signals (signal, computed, effect) rather than RxJS BehaviorSubject for local state

#### Scenario: Signal inputs/outputs

- **WHEN** components receive data from parents
- **THEN** they use input() signal-based inputs; for two-way binding, model() is preferred

**State Management**

### Requirement: Canonical state ownership

BuildState SHALL be the single source of truth, owned by BuildStore. Sub-stores (LevelStore, StatStore, AbilityStore, TreePinStore) SHALL hold derived or synchronized state for UI consumption but SHALL NOT own authoritative build state.

#### Scenario: BuildStore owns state

- **WHEN** any build mutation occurs
- **THEN** BuildStore produces a new immutable BuildState and pushes it to sub-stores

#### Scenario: Sub-stores for UI

- **WHEN** UI components need derived data
- **THEN** they read from sub-store signals that are synchronized from BuildState

### Requirement: Pure domain operations

Domain operations (level up/down, stat increment/decrement, ability obtain/refund) SHALL be pure functions that take BuildState and return a new BuildState or null if the operation is invalid.

#### Scenario: Pure function pattern

- **WHEN** a domain operation is applied
- **THEN** it receives the current BuildState and returns a new immutable state or null

#### Scenario: No side effects in domain logic

- **WHEN** a domain operation runs
- **THEN** it does not mutate external state; side effects (recording level actions) happen in the store layer

### Requirement: Minimal duplicated state

Sub-stores SHALL minimize duplicated mutable state. Derived values SHALL use computed() where possible.

#### Scenario: Computed derived state

- **WHEN** a value can be derived from BuildState
- **THEN** it is computed() rather than stored separately

### Requirement: Effects for genuine side effects only

Angular effects SHALL be used only for genuine side effects (e.g., syncing sub-stores, DOM updates). They SHALL NOT be used for derived state computation.

#### Scenario: Effect for sync

- **WHEN** BuildState changes
- **THEN** an effect syncs sub-store signals

#### Scenario: No effect for derived values

- **WHEN** a value can be computed from signals
- **THEN** computed() is used instead of effect()

**Data Layer**

### Requirement: Angular-native reactive data loading

The application SHALL use Angular's httpResource as the single mechanism for loading character, ability tree, and ability data.

#### Scenario: httpResource for data

- **WHEN** character or ability data is loaded
- **THEN** httpResource is used for reactive data fetching

#### Scenario: Single loading mechanism per data file

- **WHEN** the application loads a data file
- **THEN** exactly one loading mechanism issues the network request for that file

#### Scenario: No parallel data APIs

- **WHEN** application code needs character, tree, or ability data
- **THEN** it consumes the resource-based data API only; no parallel observable API exists

### Requirement: Clear loading/error/data states

Data services SHALL provide clear loading, error, and data states for UI consumption.

#### Scenario: Error state available

- **WHEN** data fetch fails
- **THEN** the error is accessible via the data service's error signal

### Requirement: Data validation on load

Each data file SHALL be validated against its data model shape at load time.

#### Scenario: Malformed data fails clearly

- **WHEN** a data file fails shape validation
- **THEN** the load reports an error through the data layer's error state instead of silently returning invalid data

#### Scenario: Valid data passes

- **WHEN** a data file matches its data model shape
- **THEN** the load succeeds and the parsed data is available to consumers

**UI Foundation**

### Requirement: Angular CDK where appropriate

Angular CDK SHALL be used for overlay positioning, focus management, and accessibility utilities where they provide value.

#### Scenario: CDK overlay for tooltips

- **WHEN** tooltips need to escape overflow containers
- **THEN** CDK overlay or document.body appending is used

**Styling**

### Requirement: Minimal global CSS/SCSS

Global CSS/SCSS SHALL be minimal. Component-level SCSS SHALL handle most styling.

#### Scenario: Component-scoped styles

- **WHEN** components need styling
- **THEN** styles are defined in component SCSS files

**Component Architecture**

### Requirement: Cohesive components

Each component SHALL have a single, well-defined responsibility. Components SHALL NOT be arbitrarily split when responsibility is genuinely mixed.

#### Scenario: Focused components

- **WHEN** a component is created
- **THEN** it has a clear, single responsibility

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

### Requirement: Shared layer strategy

The shared layer SHALL contain truly cross-cutting concerns: toast service, popup service, tooltip directive, animations, SCSS variables, and reusable UI primitives. Feature-specific code SHALL NOT be placed in shared.

#### Scenario: Cross-cutting in shared

- **WHEN** a service or component is used by 3+ features
- **THEN** it belongs in the shared layer

#### Scenario: Feature-specific stays in feature

- **WHEN** a component is only used by one feature
- **THEN** it stays in that feature's directory

**Testing**

### Requirement: Pure domain logic unit testing

Domain operations (level up/down, stat increment/decrement, ability obtain/refund) SHALL have pure unit tests that verify state transitions.

#### Scenario: Domain test coverage

- **WHEN** domain operations are tested
- **THEN** tests verify state transitions without Angular TestBed

### Requirement: Store/domain testing

Store logic SHALL be testable with minimal mocking.

#### Scenario: Store tests

- **WHEN** store methods are tested
- **THEN** they use real domain logic with mocked services only when necessary

### Requirement: Meaningful integration tests

Integration tests SHALL cover critical user journeys (character selection, ability obtain/refund, URL share/restore).

#### Scenario: Critical path coverage

- **WHEN** integration tests run
- **THEN** they verify end-to-end behavior for critical user journeys

### Requirement: Playwright for critical user journeys

Playwright SHALL be used for end-to-end testing of critical user journeys that cannot be fully verified with unit/integration tests.

#### Scenario: E2E tests

- **WHEN** critical user journeys need verification
- **THEN** Playwright tests cover the full browser experience

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

### Requirement: Single source of truth for configuration constants

Shared numeric limits and key lists (point budgets, bonus ceilings, and stat keys) SHALL be defined once and consumed from that definition. Duplicate literal values or parallel copies of the same list SHALL NOT be maintained.

#### Scenario: Shared budget referenced once

- **WHEN** a point budget or bonus ceiling is used by more than one component or service
- **THEN** every use resolves to a single exported definition

#### Scenario: Stat keys from one list

- **WHEN** stat keys are validated, iterated, or rendered
- **THEN** the same exported stat key list is the source of truth

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
