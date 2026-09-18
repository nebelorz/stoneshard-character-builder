## 1. Section Header Chevron

- [x] 1.1 Add chevron markup (`<span>` with `&#9656;`) to each category section header in `tree-selector.html`, positioned to the right of the header text
- [x] 1.2 Add chevron styles to `tree-selector.scss`: `$font-size-xl`, `$text-secondary` color, `transition: transform 0.2s`, `transform: rotate(0deg)` at rest, `rotate(90deg)` when expanded
- [x] 1.3 Verify chevron rotates when expanding/collapsing each category section and does not break existing keyboard navigation

## 2. Button Press Effect

- [x] 2.1 Add `&:active { transform: scale(0.95); }` to tree action button styles (reset and unpin buttons) in `tree-selector.scss`
- [x] 2.2 Verify press effect visually scales buttons down on click and returns to normal on release for both reset and unpin buttons
