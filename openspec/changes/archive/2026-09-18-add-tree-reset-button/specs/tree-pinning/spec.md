## MODIFIED Requirements

### Requirement: Unpin a tree

The system SHALL unpin a tree when the user clicks the close/unpin icon on the tree card, removing it from the pinned area. Each pinned tree card SHALL also display a reset button to the left of the unpin button, with matching size and hover behavior.

#### Scenario: Unpin removes tree

- **WHEN** the user clicks the unpin icon on a pinned tree
- **THEN** the tree is removed from the pinned area

#### Scenario: Reset button positioned left of unpin

- **WHEN** a pinned tree card is hovered
- **THEN** the reset button appears to the left of the unpin button at the same size
