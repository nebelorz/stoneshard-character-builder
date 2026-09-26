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

The system SHALL enforce a maximum route stat value (level-up spending) of 30; displayed stat values MAY exceed 30 through direct bonus point grants, which are outside the route system by design. The system SHALL enforce a minimum route stat value of the character's base stat value, and route decrements SHALL never consume a bonus point because bonus points are not part of the route stat values. The system SHALL consume and refund 1 SP per route stat point allocated or deallocated; bonus points SHALL be granted directly and never touch the SP pool.

#### Scenario: Route cap enforced with bonus above it

- **WHEN** a stat's route value is 30 and bonus slots are allocated to it (displayed above 30)
- **THEN** route increments are blocked and the displayed value reflects the bonus grants

#### Scenario: Route floor protects bonus points

- **WHEN** a stat's route value equals the character's base value and bonus slots are allocated to it
- **THEN** route decrements are blocked and the bonus allocations are unaffected

#### Scenario: Bonus grants bypass the SP pool

- **WHEN** a bonus slot is allocated or cleared
- **THEN** the SP pool and the stat history are unchanged

### Invariant: Level restrictions remain unchanged

- Minimum level: 1
- Maximum level: 30
- Level-down blocked when abilities or stats are assigned at the level being removed
- Level 1 has 2 ability slots, 0 stat slots
- Level 2+ has 1 ability slot, 1 stat slot

### Invariant: Build state remains internally consistent

BuildState MUST always be internally consistent: AP + obtainedAbilities.length equals initial AP + levels gained. Trait-derived AP SHALL be represented by allowing AP to go negative down to `0 - derivedTraitAp`, so AP alone MAY be negative while AP + derivedTraitAp never is. Character switches SHALL preserve the total budget exactly (`ap_new = total - newDerived`), and URL restores SHALL clamp AP up to the derived floor. SP + consumed SP equals levels gained; statHistory length matches total SP consumed. Route stat values SHALL equal base + statHistory; bonus slot increments SHALL be held separately in `bonusSlots` and added only at display time.

#### Scenario: Derived AP keeps the budget consistent

- **WHEN** a character with derived trait AP spends beyond the level AP pool
- **THEN** AP goes negative no further than `0 - derivedTraitAp` and AP + obtainedAbilities.length still equals initial AP + levels gained

#### Scenario: Character switch preserves the total budget

- **WHEN** the user switches from a character with derived trait AP to one without
- **THEN** AP is adjusted so the total budget (AP + derived) is unchanged and never negative

#### Scenario: Bonus slots stay out of route accounting

- **WHEN** bonus slots are allocated, cleared, or restored
- **THEN** statHistory length matches total SP consumed and route stat values equal base + statHistory

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
