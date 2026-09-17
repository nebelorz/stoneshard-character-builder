# ui-accessibility Specification

## Purpose

Define keyboard interaction patterns and ARIA support for all interactive components.

## Requirements

### Requirement: Ability icon keyboard interaction

Ability icons SHALL be focusable via Tab key and respond to Enter key for toggling obtain/refund state.

#### Scenario: Tab to ability icon

- **WHEN** user presses Tab to navigate to an ability icon
- **THEN** the icon receives visible focus indicator and the ability tooltip is displayed

#### Scenario: Enter on unlocked ability

- **WHEN** user presses Enter on a focused unlocked ability icon
- **THEN** the ability is obtained

#### Scenario: Enter on obtained ability

- **WHEN** user presses Enter on a focused obtained ability icon
- **THEN** the ability is refunded

#### Scenario: Enter on locked ability

- **WHEN** user presses Enter on a focused locked ability icon
- **THEN** no action is taken

### Requirement: Dropdown arrow key navigation

Dropdown menus in tree-selector and character-selector SHALL use CDK ActiveDescendantKeyManager for standardized arrow key navigation.

#### Scenario: Arrow down in dropdown

- **WHEN** dropdown is open and user presses ArrowDown
- **THEN** focus moves to the next item via ListKeyManager active descendant

#### Scenario: Arrow up in dropdown

- **WHEN** dropdown is open and user presses ArrowUp
- **THEN** focus moves to the previous item in the list

#### Scenario: Type-ahead support

- **WHEN** user types characters while dropdown is open
- **THEN** focus moves to the first item matching the typed characters

#### Scenario: Enter selects item

- **WHEN** user presses Enter on a focused dropdown item
- **THEN** the item is selected

#### Scenario: Escape closes dropdown

- **WHEN** dropdown is open and user presses Escape
- **THEN** dropdown closes and focus returns to the toggle button

### Requirement: Route display keyboard navigation

Route display entries SHALL be keyboard accessible.

#### Scenario: Tab to route entry

- **WHEN** user tabs to a route display entry
- **THEN** the entry receives visible focus indicator

#### Scenario: Enter on route entry

- **WHEN** user presses Enter on a focused route entry
- **THEN** the entry action triggers (equivalent to click; e.g., unassigns an ability or decrements a stat)

#### Scenario: Space on route entry

- **WHEN** user presses Space on a focused route entry
- **THEN** the entry action triggers (equivalent to click)

### Requirement: Trait icon keyboard accessibility

The trait icon in character-selector SHALL be focusable and show its tooltip on focus.

#### Scenario: Focus trait icon

- **WHEN** user tabs to the trait icon
- **THEN** the trait bubble/tooltip is displayed

#### Scenario: Blur trait icon

- **WHEN** user tabs away from the trait icon
- **THEN** the trait bubble/tooltip is hidden

### Requirement: Ability icon ARIA attributes

Ability icons SHALL have appropriate ARIA roles and states.

#### Scenario: Button role on ability icon

- **WHEN** ability icon is rendered
- **THEN** the icon wrapper has role="button" and tabindex="0"

#### Scenario: ARIA label on ability icon

- **WHEN** ability icon is rendered
- **THEN** the icon has aria-label containing the ability name and state

#### Scenario: ARIA pressed state

- **WHEN** ability is obtained
- **THEN** the icon has aria-pressed="true"; when unlocked, aria-pressed="false"; when locked, aria-disabled="true"

### Requirement: Tooltip ARIA attributes

Tooltips SHALL be properly associated with their trigger elements.

#### Scenario: Tooltip role

- **WHEN** ability tooltip is rendered
- **THEN** the tooltip element has role="tooltip"

#### Scenario: Tooltip association

- **WHEN** ability icon has focus or is hovered
- **THEN** the icon has aria-describedby pointing to the tooltip id

### Requirement: Dropdown ARIA expanded state

Toggle buttons for dropdowns SHALL indicate their expanded/collapsed state.

#### Scenario: Tree selector expanded

- **WHEN** tree-selector category dropdown is expanded
- **THEN** the toggle button has aria-expanded="true"

#### Scenario: Character selector expanded

- **WHEN** character-selector dropdown is expanded
- **THEN** the toggle button has aria-expanded="true"

### Requirement: Unpin button accessible name

Unpin buttons SHALL have descriptive accessible names.

#### Scenario: Unpin button label

- **WHEN** unpin button is rendered for a pinned tree
- **THEN** the button has aria-label="Unpin {tree.name}"

### Requirement: Level controls accessible names

Level control buttons SHALL have descriptive aria-label attributes.

#### Scenario: Level up button label

- **WHEN** the level up button is rendered
- **THEN** it has aria-label="Increase level by 1"

#### Scenario: Level down button label

- **WHEN** the level down button is rendered
- **THEN** it has aria-label="Decrease level by 1"

#### Scenario: Level up 5 button label

- **WHEN** the level up 5 button is rendered
- **THEN** it has aria-label="Increase level by 5"

#### Scenario: Level down 5 button label

- **WHEN** the level down 5 button is rendered
- **THEN** it has aria-label="Decrease level by 5"

### Requirement: Stat controls accessible names

Stat control buttons SHALL have descriptive aria-label attributes.

#### Scenario: Stat increment button label

- **WHEN** a stat increment button is rendered
- **THEN** it has aria-label="Increase {statName}"

#### Scenario: Stat decrement button label

- **WHEN** a stat decrement button is rendered
- **THEN** it has aria-label="Decrease {statName}"

### Requirement: Build options accessible names

Build option buttons SHALL have aria-label attributes independent of tooltip.

#### Scenario: Share button label

- **WHEN** the share button is rendered
- **THEN** it has aria-label="Share build"

#### Scenario: AI prompt button label

- **WHEN** the AI prompt button is rendered
- **THEN** it has aria-label="Generate AI prompt"

#### Scenario: Reset button label

- **WHEN** the reset button is rendered
- **THEN** it has aria-label="Reset build"

### Requirement: Right nav focus management

The right navigation panel SHALL manage focus when opening and closing.

#### Scenario: Focus moves to panel on open

- **WHEN** the right nav panel opens
- **THEN** focus moves to the first focusable element in the panel

#### Scenario: Focus returns to trigger on close

- **WHEN** the right nav panel closes
- **THEN** focus returns to the element that triggered the panel open

### Requirement: Dynamic content announcements

The system SHALL announce dynamic content changes via native ARIA live regions and SHALL NOT inject a CDK live announcer element into the document.

#### Scenario: Toast uses aria-live

- **WHEN** a toast notification appears
- **THEN** the toast container has aria-live="polite"

#### Scenario: Error uses role=alert

- **WHEN** an error is displayed
- **THEN** the error container has role="alert"

#### Scenario: Loading uses role=status

- **WHEN** loading state is active
- **THEN** the loading indicator has role="status"

#### Scenario: No CDK live announcer element

- **WHEN** the application runs and dynamic content changes occur
- **THEN** the document contains no `cdk-live-announcer-element`

### Requirement: Closed right-nav removed from tab order

While the right navigation panel is closed, its contents SHALL be removed from the tab order and the accessibility tree.

#### Scenario: Closed panel not focusable

- **WHEN** the right nav panel is closed
- **THEN** its buttons and controls cannot be reached via Tab and are hidden from screen readers

#### Scenario: Open panel focusable

- **WHEN** the right nav panel is open
- **THEN** its buttons and controls are reachable via Tab

### Requirement: Trait icon accessible name

The trait icon in character-selector SHALL expose an accessible name describing the trait.

#### Scenario: Trait icon announced

- **WHEN** a keyboard user focuses the trait icon
- **THEN** the trait name is announced

### Requirement: Active-descendant visual styling

The active descendant option in the character-selector dropdown SHALL be visually distinguishable during keyboard navigation.

#### Scenario: Highlighted option visible

- **WHEN** the user navigates the dropdown with arrow keys
- **THEN** the current active option has a visible highlight style

### Requirement: Route entry tooltip keyboard access

Route display entries SHALL expose their ability-detail tooltip to keyboard users.

#### Scenario: Focus shows tooltip

- **WHEN** a route entry receives focus
- **THEN** its ability-detail tooltip is displayed

#### Scenario: Blur hides tooltip

- **WHEN** a focused route entry loses focus
- **THEN** the tooltip is hidden

#### Scenario: Tooltip associated via aria-describedby

- **WHEN** a route entry tooltip is visible
- **THEN** the entry references the tooltip via aria-describedby

### Requirement: Character selector dropdown semantics

The character-selector dropdown SHALL use a coherent listbox pattern with correct ARIA wiring.

#### Scenario: Toggle announces listbox

- **WHEN** the character-selector toggle is rendered
- **THEN** it has aria-haspopup="listbox" and aria-expanded reflecting the open state

#### Scenario: Listbox labelled

- **WHEN** the dropdown list is rendered
- **THEN** the listbox has aria-labelledby pointing to the toggle

#### Scenario: Single role per option

- **WHEN** a dropdown option is rendered
- **THEN** it is announced with a single role (option), not a conflicting button role

### Requirement: Tree selector roving tabindex

The tree-selector tablist SHALL use a roving tabindex so only the active tab is tabbable.

#### Scenario: Single tab stop

- **WHEN** the tablist is rendered
- **THEN** only the active tab is in the tab order and the remaining tabs have tabindex="-1"

#### Scenario: Arrow keys move the tab stop

- **WHEN** the user presses an arrow key on the tablist
- **THEN** the active tab changes and the tab stop moves with it

#### Scenario: Panel labelled

- **WHEN** the tab panel is rendered
- **THEN** it has role="tabpanel" and aria-labelledby pointing to the active tab

### Requirement: Main landmark for skip link

The skip link SHALL target the main content landmark.

#### Scenario: Skip link to main

- **WHEN** the user activates the skip link
- **THEN** focus moves to the `<main>` element containing the application content

### Requirement: Right-nav semantic landmark

The right navigation panel SHALL be exposed as a named landmark.

#### Scenario: Panel is an aside

- **WHEN** the right nav panel is rendered
- **THEN** it uses aside semantics with an accessible label

#### Scenario: Expand button controls the panel

- **WHEN** the expand button is rendered
- **THEN** it references the collapsible panel via aria-controls

### Requirement: Image accessibility

All `<img>` elements SHALL have an accessible name and explicit dimensions to prevent layout shift.

#### Scenario: Images have alt text

- **WHEN** an `<img>` element is rendered
- **THEN** it has a descriptive alt attribute (or is marked decorative with alt="")

#### Scenario: Images have dimensions

- **WHEN** an `<img>` element is rendered
- **THEN** its intrinsic dimensions are declared via width/height attributes or an equivalent aspect-ratio style to prevent layout shift
