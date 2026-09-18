## MODIFIED Requirements

### Requirement: Unpin a tree

The system SHALL unpin a tree when the user clicks the close/unpin icon on the tree card, removing it from the pinned area with a fade-out transition. Each pinned tree card SHALL also display a reset button to the left of the unpin button, with matching size and hover behavior.

#### Scenario: Unpin removes tree with fade-out

- **WHEN** the user clicks the unpin icon on a pinned tree
- **THEN** the tree card fades out and is removed from the pinned area

#### Scenario: Reset button positioned left of unpin

- **WHEN** a pinned tree card is hovered
- **THEN** the reset button appears to the left of the unpin button at the same size

### Requirement: Pin a tree

The system SHALL pin a tree when the user clicks its pin icon in the tree selector, adding it to the pinned trees area with a fade-in transition.

#### Scenario: Pin adds tree to view with fade-in

- **WHEN** the user clicks the pin icon for a tree
- **THEN** the tree card fades in and appears in the pinned trees area

#### Scenario: Duplicate prevention

- **WHEN** the user clicks the pin icon for an already-pinned tree
- **THEN** no duplicate is created
