## Why

Users report the ability tooltips are hard to read. The root cause is typographic: both theme faces are small-caps variants (`IM Fell English SC` and `Alegreya Sans SC`), so every lowercase glyph is drawn as a reduced capital and word shapes collapse, especially in the 11 to 13px body text where the app's densest prose lives. The tooltip also flattens AND/OR requirements into an ambiguous run, renders formulas and bonus runs as an undifferentiated block, and cannot show its own longer content because it vanishes the moment the pointer leaves the icon. This is the highest-value reading surface in the app, so its legibility and information design are worth fixing now.

## What Changes

- Replace the small-caps body face app-wide: a non-small-caps reading face (`Bitter`) for body text and `IM Fell English` (dropping the `SC`) for headings, with the existing uppercase transform kept for display headings. Remove small caps from the theme entirely.
- Load the real font weights the UI uses (400/600/700) from the existing Google Fonts link so bold is no longer synthesized.
- Rebuild the ability tooltip as a card: a type chip and a compact metric strip that always shows target, range, energy, and cooldown for every ability, so cards stay comparable.
- Show the scaling statistics as tokens: the five core stats use their stat colour, all other scaling terms use a neutral token style, and unmapped terms fall back to plain text.
- Render the `Requires` section with explicit AND groups and nested OR alternatives so requirement logic is unambiguous.
- Make the card hoverable and readable: a short close delay on leaving the trigger, cancellation while the pointer is over the card, and immediate hiding when the pointer enters another ability icon so neighbours are never blocked.
- Cap the card height relative to the viewport with internal scrolling, and make the overflow region keyboard focusable with Escape to dismiss.
- Apply a copy pass: the tooltip labels and section headings are rendered in uppercase, and the authored `unlockConditions` strings are normalized to a canonical order and separator.
- Non-goal: resolving formulas against the current build. Modifier expressions stay presentational.
- Non-goal: touch and mobile interaction. Scope is desktop hover.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui-theme`: the typography requirement changes from small-caps display and body faces to non-small-caps `IM Fell English` for headings and `Bitter` for body text, with the weights the UI uses actually loaded.
- `ui-popover-tooltip`: the ability tooltip requirement changes to a card layout that always shows its metrics, renders scaling statistics as classified tokens, groups requirements explicitly, and is hoverable, height-capped, internally scrollable, and keyboard reachable.

## Impact

- Theme: `src/app/shared/styles/_variables.scss` (font tokens), `src/styles.scss` (`.font-*` utility classes and heading transform).
- Font loading: `src/index.html` (add weights to the Google Fonts link).
- Feature UI: `src/app/features/ability-trees/components/ability-icon/` (tooltip template, styles, and hover, focus, and positioning behavior).
- Description rendering: `src/app/features/ability-trees/components/ability-description/` (rendering inside the new card).
- Data copy: `src/assets/data/abilities.json` `unlockConditions` strings (normalization only; no schema change).
- Untouched: description canonical format and tokenizer, formula resolution, AI prompt output, and the enriched tooltip system for traits, stats, trees, and quests.
