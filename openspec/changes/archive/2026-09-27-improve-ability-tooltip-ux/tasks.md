## 1. Theme typography and font loading

- [x] 1.1 Change `$font-fantasy` to `IM Fell English` and `$font-ui` to `Bitter` in `src/app/shared/styles/_variables.scss`, and verify no `SC` small-caps face remains referenced anywhere in the app
- [x] 1.2 Update the font utilities in `src/styles.scss` so `.font-fantasy` keeps the uppercase transform for headings while `.font-ui` renders body text with true lowercase, and verify a heading renders uppercase and body text is not uppercased
- [x] 1.3 Add `Bitter` weights 400, 600, and 700 to the Google Fonts link in `src/index.html`, and verify bold and semibold text render as real weights rather than synthesized
- [x] 1.4 Audit the remaining font consumers (sidenavs, tree selector, character info, quests, enriched tooltip) for small-caps assumptions, and verify each surface still renders correctly after the face swap

## 2. Ability tooltip card layout

- [x] 2.1 Rebuild the tooltip header in `ability-icon.html` as a name plus a type chip, and verify the ability icon spec still passes and the header renders for an attack ability
- [x] 2.2 Replace the labelled stat list with a compact metric strip that always shows target, range, energy, and cooldown, and verify a test asserts a passive `No Target` ability still shows all four metrics
- [x] 2.3 Render `modifiedByLabel` statistics as tokens with the five core stats coloured, every other term neutral, and unmatched terms as plain text, and verify tests cover a core-stat label, a non-core label such as Magic Power, and an unrecognized term
- [x] 2.4 Render the Requires section as explicit AND groups with OR alternatives, and verify a test asserts a multi-group locked ability renders distinctly grouped alternatives
- [x] 2.5 Style the card for readable hierarchy (spacing scale, uppercase labels and section headings, width and rhythm), and verify a tooltip for a long description reads as clearly sectioned content
- [x] 2.6 Keep the description rendering through `app-ability-description` and verify bullet rows and modifier colours still render inside the new card

## 3. Hover retention, keyboard reachability, and scroll behavior

- [x] 3.1 Replace the immediate hide on `mouseleave` with a delayed hide that is cancelled when the pointer enters the card, and verify the card stays visible while the pointer moves onto it
- [x] 3.2 Hide the visible card immediately when the pointer enters a different ability icon, and verify a neighbouring icon receives hover and click rather than being blocked by the card
- [x] 3.3 Add a viewport-relative maximum height with internal scrolling to the card, and verify a description taller than the cap scrolls instead of running off screen
- [x] 3.4 Make the overflow scroll region keyboard focusable and dismiss the card on Escape, and verify a keyboard user can scroll a long card and close it
- [x] 3.5 Confirm card placement keeps a gap from the icon, flips to the opposite side at the viewport edge, and does not overlap the trigger, and verify behavior at both horizontal edges

## 4. Copy wording pass

- [x] 4.1 Render the tooltip and section labels in uppercase for consistent phrasing, and verify every label renders in uppercase in the template
- [x] 4.2 Normalize the authored `unlockConditions` strings in `src/assets/data/abilities.json` to `Invest N AP in STR, AGI, PER` with the canonical STR, AGI, PER, VIT, WIL order and `Reach level N` capitalization, and verify the JSON parses and the description tokenization tests still pass

## 5. Verification

- [x] 5.1 Run lint, build, and the full test suite, and verify all pass
- [x] 5.2 Manually inspect tooltips for an attack, a passive, a stance, and a locked ability, plus keyboard focus, and verify layout, colours, grouping, and scrolling behave as specified
- [x] 5.3 Run `openspec validate improve-ability-tooltip-ux --strict` and verify the change validates
