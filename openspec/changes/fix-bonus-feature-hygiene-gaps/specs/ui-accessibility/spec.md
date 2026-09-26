## ADDED Requirements

### Requirement: Point contribution indicators

Bonus stat contributions and derived Ability Points shown in the left sidenav SHALL expose their meaning to assistive technology through a supported mechanism, such as visually hidden text or a supporting role. The indicators SHALL NOT rely solely on an `aria-label` on a role-less generic element, and SHALL be absent from the accessibility tree when the contribution is zero.

#### Scenario: Bonus marker announced

- **WHEN** a stat has one or more allocated bonus points
- **THEN** assistive technology can determine that the stat's displayed value includes that many bonus points

#### Scenario: Derived AP announced

- **WHEN** a character has one or more trait-derived Ability Points
- **THEN** assistive technology can determine that the displayed Ability Points include a trait-derived contribution

#### Scenario: No announcement when zero

- **WHEN** a stat has no bonus points
- **THEN** no bonus contribution is exposed to assistive technology for that stat
