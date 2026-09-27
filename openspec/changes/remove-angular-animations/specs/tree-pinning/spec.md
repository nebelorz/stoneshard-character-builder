## REMOVED Requirements

### Requirement: Unpin a tree

**Reason**: The staggered reflow of remaining cards depended on the removed `cardReflow` trigger, whose `:leave` query never matched and therefore never animated anything. The requirement is replaced by a version that keeps the fade-out and reset-button behavior without the stagger.
**Migration**: Unpinning still fades the card out and removes it; remaining cards reposition immediately with no staggered delay.

## ADDED Requirements

### Requirement: Unpin a tree and reposition cards

The system SHALL unpin a tree when the user clicks the close/unpin icon on the tree card, removing it from the pinned area with a fade-out transition. Each pinned tree card SHALL also display a reset button to the left of the unpin button, with matching size and hover behavior. Remaining pinned tree cards SHALL move into their new grid positions without a staggered animation.

#### Scenario: Unpin removes tree with fade-out

- **WHEN** the user clicks the unpin icon on a pinned tree
- **THEN** the tree card fades out and is removed from the pinned area

#### Scenario: Reset button positioned left of unpin

- **WHEN** a pinned tree card is hovered
- **THEN** the reset button appears to the left of the unpin button at the same size
