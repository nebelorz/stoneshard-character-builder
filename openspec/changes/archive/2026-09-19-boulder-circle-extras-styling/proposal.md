## Why

The Extras section in the right sidenav uses a plain `<select>` dropdown for Boulder Circle, which lacks the visual polish of the stat chips in Route. The Extras header also lacks context about what Boulder Circle does. Meanwhile, Route's collapsible header adds complexity with low utility since Route is the primary content of the right sidenav.

## What Changes

- Remove collapsible/expandable behavior from Route display. The header becomes a static label and content is always visible.
- Replace the native `<select>` dropdown in Extras with a custom dropdown showing colored stat chips, matching the visual language of Route stat chips.
- Add a Phosphor `phosphorQuestion` icon with a tooltip ("Boulder Circle is a quest that gives +1 SP") to the left of "Boulder Circle" label.
- Extract stat chip color styles from route-display into a shared location so both Route and Extras can use them.

## Capabilities

### New Capabilities

- `extras-display`: Boulder Circle selection UI with custom dropdown, colored stat chips, and contextual tooltip icon.

### Modified Capabilities

- `route-display`: Remove the "Route toggle" requirement. The section becomes permanently expanded with no collapse/expand interaction.

## Impact

- `route-display` component: TS, HTML, SCSS (remove toggle logic, chevron, animation)
- `extras-display` component: TS, HTML, SCSS (new custom dropdown, tooltip, icon imports)
- Shared styles: New shared location for stat chip color classes
- No breaking changes to data model, store, or APIs
