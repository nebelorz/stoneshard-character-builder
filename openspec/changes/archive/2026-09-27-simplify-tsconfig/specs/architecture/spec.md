## MODIFIED Requirements

### Requirement: Single source of truth for module resolution configuration

Import aliases and module resolution settings (`@core/*`, `@shared/*`, `@features/*`, `@models`, `@layout/*`, plus the barrel aliases `@core/state`, `@core/data`, and `@features/build/services`) SHALL be defined once and consumed by every tool that resolves imports (build, test, and editor). Parallel copies that can drift, alias entries that are unreachable because a broader prefix matches first, and alias entries that no code consumes SHALL NOT be maintained. The resolution configuration SHALL use only compiler options that are supported and not deprecated by the project's TypeScript version.

#### Scenario: One definition per alias

- **WHEN** an import alias is used
- **THEN** exactly one configuration defines it and every resolver derives from that definition

#### Scenario: No shadowed aliases

- **WHEN** the resolution configuration is inspected
- **THEN** no exact alias is unreachable because a broader prefix entry matches it first

#### Scenario: No dead aliases

- **WHEN** the resolution configuration is inspected
- **THEN** every declared alias has at least one consumer and no alias points at a non-existent target

#### Scenario: No deprecated compiler options

- **WHEN** the TypeScript configuration is type-checked with the project's TypeScript version
- **THEN** the compiler reports no deprecated-option error and requires no `ignoreDeprecations` override

#### Scenario: Tooling configuration type-checks

- **WHEN** the build and test tooling configuration is type-checked
- **THEN** it compiles without missing type definitions for the globals and modules it uses
