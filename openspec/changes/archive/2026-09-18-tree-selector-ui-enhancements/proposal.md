## Why

The tree selector component (`app-tree-selector`) lacks visual indicators for section expandability and interactive feedback on tree action buttons. The character and route dropdowns already use a `▸` chevron to indicate expandability, and the build options buttons have a satisfying press effect. Adding these same patterns to the tree selector improves consistency and perceived interactivity across the app.

## What Changes

- Add a `▸` icon (right-pointing triangle, `&#9656;`) to the right of each section header ("Weaponry", "Utility", "Sorcery") in the tree selector, consistent with the icon used in `app-route-display`
- Add a `:active` press effect (scale down on click) to the tree action buttons (reset and unpin/delete from pinned trees), matching the behavior of `app-build-options` buttons

## Capabilities

### New Capabilities

- `tree-selector/ui-enhancements`: Visual refinements to the tree selector component, including section header chevrons and button press feedback

### Modified Capabilities

## Impact

- `src/app/features/ability-trees/components/tree-selector/tree-selector.html` - add chevron markup to section headers
- `src/app/features/ability-trees/components/tree-selector/tree-selector.scss` - add chevron styles and button press effect
- No API, data, or behavioral changes
