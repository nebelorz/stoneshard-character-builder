## MODIFIED Requirements

### Requirement: Unpin a tree

The system SHALL unpin a tree when the user clicks the close/unpin icon on the tree card, removing it from the pinned area with a fade-out transition. Each pinned tree card SHALL also display a reset button to the left of the unpin button, with matching size and hover behavior. When a tree is unpinned, the remaining pinned tree cards SHALL animate with a staggered shift into their new grid positions.

#### Scenario: Unpin removes tree with fade-out

- **WHEN** the user clicks the unpin icon on a pinned tree
- **THEN** the tree card fades out and is removed from the pinned area

#### Scenario: Remaining cards reflow with stagger

- **WHEN** the user unpins a tree and other trees remain pinned
- **THEN** the remaining tree cards shift smoothly into their new positions with a staggered delay

#### Scenario: Reset button positioned left of unpin

- **WHEN** a pinned tree card is hovered
- **THEN** the reset button appears to the left of the unpin button at the same size
