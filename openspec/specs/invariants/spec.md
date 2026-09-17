# invariants Specification

## Purpose

Define behavioral and architectural invariants that must be preserved across all refactoring phases.

## Behavioral Invariants

### Invariant: Existing shared URLs remain restorable

All previously shared URLs MUST continue to work after any application update. The gzip-compressed base64url format in the `?build=` query parameter is the canonical sharing format.

### Invariant: Ability prerequisite rules remain unchanged

The prerequisite validation logic (AND across groups, OR within groups) MUST NOT be altered. Existing ability trees and their prerequisite relationships are game data and remain unchanged.

### Invariant: Ability refund behavior remains unchanged

Refunding an ability MUST cascade to dependent children whose only prerequisite is the refunded ability. Alternative prerequisites MUST prevent cascade when another path still satisfies the requirement.

### Invariant: Stat constraints remain unchanged

- Maximum stat value: 30
- Minimum stat value: character's base stat value
- SP consumption: 1 SP per stat point allocated
- SP refund: 1 SP per stat point deallocated

### Invariant: Level restrictions remain unchanged

- Minimum level: 1
- Maximum level: 30
- Level-down blocked when abilities or stats are assigned at the level being removed
- Level 1 has 2 ability slots, 0 stat slots
- Level 2+ has 1 ability slot, 1 stat slot

### Invariant: Build state remains internally consistent

BuildState MUST always be internally consistent: AP + obtainedAbilities.length equals initial AP + levels gained; SP + consumed SP equals levels gained; statHistory length matches total SP consumed.

### Invariant: First-fit auto-placement

Abilities and stats are auto-placed at levels using first-fit slot filling. This algorithm MUST NOT be changed during refactoring.

## Architectural Invariants

### Invariant: Derived state must not become duplicated mutable state

Values that can be computed from BuildState MUST use computed() signals, not separate mutable state.

### Invariant: Generic UI must not require a second custom UI framework

No second generic UI framework SHALL be introduced alongside the existing UI approach.

### Invariant: Domain-specific Stoneshard UI remains independently styled

Game-specific UI (ability trees, stat controls, character selector) SHALL remain custom-styled and NOT depend on external UI framework components for their visual identity.

### Invariant: No routing without requirement

The application has no routing. Introducing Angular Router MUST NOT be done without a concrete requirement that necessitates it.

### Invariant: No state management library

Application state is managed with Angular signals and service-based stores. No external state management library (NgRx, Akita, etc.) SHALL be introduced.

### Invariant: URL format is stable

The `?build=<compressed-data>` URL format is the canonical sharing format. Changes to the serialization format MUST maintain backward compatibility with existing shared URLs.
