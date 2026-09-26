## MODIFIED Requirements

### Requirement: Point-slot dropdown keyboard navigation

Point-slot-row dropdowns SHALL follow the selector dropdown pattern: the toggle SHALL have `aria-haspopup="listbox"` and `aria-expanded` reflecting the open state, arrow keys SHALL move the active option, Enter SHALL select the active option, Escape SHALL close the dropdown and return focus to the toggle, and options SHALL be announced with a single option role. Clicking outside a closed point-slot dropdown SHALL NOT move focus to its toggle.

#### Scenario: Toggle announces listbox

- **WHEN** a point-slot-row dropdown toggle is rendered
- **THEN** it has `aria-haspopup="listbox"` and `aria-expanded` reflecting the open state

#### Scenario: Arrow down moves active option

- **WHEN** the dropdown is open and the user presses ArrowDown
- **THEN** the active option moves to the next stat option

#### Scenario: Arrow up moves active option

- **WHEN** the dropdown is open and the user presses ArrowUp
- **THEN** the active option moves to the previous stat option

#### Scenario: Enter selects option

- **WHEN** the user presses Enter on the active option
- **THEN** the stat is allocated to that slot and the dropdown closes

#### Scenario: Escape closes dropdown

- **WHEN** the dropdown is open and the user presses Escape
- **THEN** the dropdown closes and focus returns to the toggle

#### Scenario: Outside click does not steal focus when closed

- **WHEN** the dropdown is closed and the user clicks elsewhere in the document
- **THEN** the dropdown stays closed and focus is not moved to the point-slot toggle

#### Scenario: Outside click while open closes the dropdown

- **WHEN** the dropdown is open and the user clicks elsewhere in the document
- **THEN** the dropdown closes and focus remains with the element the user clicked
