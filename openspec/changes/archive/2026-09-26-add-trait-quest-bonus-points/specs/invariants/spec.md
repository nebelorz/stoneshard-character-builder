# invariants delta

## MODIFIED Requirements

### Requirement: Invariant: Stat constraints remain unchanged

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

### Requirement: Invariant: Build state remains internally consistent

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
