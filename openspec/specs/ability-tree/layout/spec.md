## Purpose

Rendering each ability tree from the game's own background art, with ability icons overlaid at real in-game coordinates, so the SPA tree matches the Stoneshard tree without generating any connection-line drawing.

## Requirements

### Requirement: Tree SHALL render the game's background art as the canvas backdrop

The tree canvas SHALL display the tree's `{tree}_background.png` as a full-bleed backdrop behind the ability icons, so the tree frame and prerequisite connection lines come from the game art itself.

#### Scenario: Canvas shows the background image

- **WHEN** a tree is rendered
- **THEN** its `{tree}_background.png` fills the tree canvas behind all icons

#### Scenario: Background does not capture pointer events

- **WHEN** a user clicks or hovers over the tree canvas
- **THEN** pointer events pass through the background to the icons layered above it

### Requirement: Prerequisite connections SHALL come from the background art, not generated lines

The system SHALL NOT draw its own connection lines over the tree. All prerequisite connection visuals SHALL be those already present in the background image at their exact game positions.

#### Scenario: No generated connection lines rendered

- **WHEN** a tree is rendered
- **THEN** no connection-line elements are inserted on top of the background

#### Scenario: Connections still visible

- **WHEN** a tree contains abilities with prerequisites
- **THEN** the prerequisite connections are visible in the background art

### Requirement: Each ability SHALL be positioned at its real game coordinate

The system SHALL position every ability using a real `x`/`y` coordinate (in the background image's coordinate space) provided in the ability data. Abilities SHALL sit exactly where they appear in the game's tree.

#### Scenario: Ability positioned at its game slot

- **WHEN** a tree's background image defines a slot at coordinate `(168, 408)` for an ability
- **THEN** the ability is rendered centered at `(168, 408)`

#### Scenario: Centered ability not left-aligned

- **WHEN** an ability's game coordinate places it at the horizontal center of the tree
- **THEN** the ability is rendered centered, not left-aligned

### Requirement: Tree SHALL render inside a fixed-aspect-ratio responsive container

The tree SHALL be rendered in a container whose aspect ratio matches the background image, with abilities positioned by percentage of that container. The container SHALL scale its content proportionally at different widths so the whole tree stays aligned.

#### Scenario: Container scales proportionally

- **WHEN** the tree container width changes
- **THEN** all ability positions and the background scale proportionally and remain aligned

#### Scenario: Narrow viewport keeps tree intact

- **WHEN** the container is narrower than its natural size
- **THEN** the tree is scaled down as a whole (no overlapping or clipped abilities)

### Requirement: Ability icons SHALL remain interactive live elements

Ability icons SHALL remain real DOM elements so existing interactions (tooltip on hover, obtain on click, refund on right-click, locked/unlocked/obtained styling) continue to work.

#### Scenario: Clicking an unlocked ability obtains it

- **WHEN** a user clicks an unlocked ability icon
- **THEN** the ability is obtained

#### Scenario: Hovering shows tooltip

- **WHEN** a user hovers over an ability icon
- **THEN** the ability tooltip is shown
