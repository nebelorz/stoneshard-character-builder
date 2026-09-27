## Context

See proposal.md - Why for motivation. Relevant current state:

- The theme declares two font tokens in `src/app/shared/styles/_variables.scss`: `$font-fantasy: 'IM Fell English SC'` and `$font-ui: 'Alegreya Sans SC'`. Both are small-caps faces. `src/index.html` loads only `IM Fell English SC` at regular weight and `Alegreya Sans SC` at 400 and 600, so the tooltip's bold name and 500-weight values are synthesized.
- `src/styles.scss` defines `.font-fantasy` (uppercase + letter-spacing), `.font-ui`, and `.font-ui-semibold`, and sets a global 18px base on `html, body`.
- The ability tooltip is hand-rolled in `ability-icon` (`ability-icon.html`, `ability-icon.scss`, `ability-icon.ts`): 280px fixed width, cursor-independent placement against the icon rect, `pointer-events: none`, hidden on `mouseleave`, no max-height. Descriptions render through `app-ability-description`.
- A separate `appEnrichedTooltip` system exists for trait/stat/tree/quest content, but its spec requires a non-interactive overlay (`pointer-events: none`) so it cannot host a hoverable, scrollable card without changing that contract.
- The requirement data is already structured: `resolvedRequirementGroups()` is an outer AND of inner OR groups, but `ability-icon.html` renders all groups into one flex-wrap row with `or` only between alternatives, which is ambiguous.
- `abilities.json` holds 228 abilities; 153 are passive and 151 have `No Target`. Because every card will show all four metrics, most cards will display `No Target` and a range of `1`; 32 `No Target` abilities do carry a nonzero energy cost, so energy cannot be treated as purely passive noise. Descriptions average 354 characters and reach 980.

## Goals / Non-Goals

**Goals:**

- Fix reading legibility at the theme level so every reading surface benefits, not only tooltips.
- Rebuild the ability tooltip as a legible, well-structured card with a consistent, comparable shape.
- Make long descriptions reachable through pointer and keyboard without the card vanishing.

**Non-Goals:**

- Migrating the ability tooltip onto `appEnrichedTooltip`; that system's non-interactive contract conflicts with this change.
- Resolving formulas against the current build, or adding arithmetic evaluation.
- Touch and mobile interaction.
- Restructuring the canonical description format or its tokenizer; only card layout and label copy change.

## Decisions

**1. Drop small caps by moving to the non-SC variants of the same families.**
Body becomes `Bitter`, headings become `IM Fell English`. The slab-serif body keeps the app's sturdy, print-like texture while real lowercase, true italics, and real weights arrive.

- Alternatives rejected: adopting a new reading serif such as EB Garamond (a genuinely different look for the app); enlarging the small-caps sizes (letterform collapse stays, only size changes).

**2. Two font roles, uppercase reserved for headings.**
`$font-fantasy` becomes `IM Fell English` and keeps its uppercase transform for display headings; `$font-ui` becomes `Bitter` with true lowercase. Existing intentional uppercase on fantasy headings and labels elsewhere (sidenav toggles, tree tabs, panels) is left as is; the ability card's own labels and section headings are rendered in uppercase, which the tooltip spec governs.

- Alternatives rejected: sentence case for all non-fantasy labels app-wide (a much larger audit than this change needs); a single font for everything (loses the display accent).

**3. Load real weights through the existing Google Fonts link.**
Request `Bitter:wght@400;600;700` and `IM Fell English` (regular). This is a one-line change with no new dependency. Self-hosting is deferred as a separate concern.

- Alternatives rejected: self-hosting now (offline and privacy benefits, but bundling and licensing setup are out of scope for this change).

**4. Build the card inside the existing hand-rolled tooltip, not `appEnrichedTooltip`.**
The card needs pointer interaction (hover retention and internal scroll). `enriched-tooltip` explicitly requires a non-interactive overlay so it can never steal the trigger's hover; reusing it would mean weakening that requirement. Building in place keeps this change focused and leaves the enriched system untouched.

- Alternatives rejected: migrating onto `appEnrichedTooltip` (forces a change to its non-interactive contract and widens scope); extracting a shared card component now (premature, only one caller).

**5. Hover retention via a hide timer, with immediate hide on entering another icon.**
Replace the immediate `mouseleave` hide with a short delayed hide, cancelled when the pointer enters the card. Because the card is offset beside a tall, tightly packed icon grid, moving to a neighbouring icon can cross the card surface; entering any other ability icon therefore hides the current card immediately, so neighbours are never blocked. Keep a small gap between icon and card, and keep the card offset from the trigger.

- Alternatives rejected: cancel-on-enter alone (a neighbour icon underneath the card would become unclickable); requiring a dwell before retaining (adds timing complexity for the same outcome).

**6. Show all four metrics on every card.**
The card always renders target, range, energy, and cooldown, including `No Target` and the common range of `1`. This keeps every card the same shape so abilities can be compared at a glance, and avoids hiding data the 32 activatable passives legitimately carry.

- Alternatives rejected: hiding non-applicable metrics on passives (a prior option, dropped in favour of comparability); replacing the metrics with a single `Passive` tag (loses parity between cards).

**7. Scaling statistics become classified tokens.**
`modifiedByLabel` is a comma-separated string. The card splits it and classifies each term: the five core stats (Strength, Agility, Perception, Vitality, Willpower) use their stat colour; every other term (Magic Power, sub-school powers, Block Chance, Efficiency, Bonus Range, and similar) uses a neutral token style; any term not recognized renders as plain text. This avoids a data model change while delivering the visual improvement.

- Alternatives rejected: a category palette for magic and combat terms (expands the theme vocabulary beyond the five existing stat colours); adding a structured stat-key array to `abilities.json` (a schema change with prompt-source implications).

**8. Requirement groups render as explicit boolean structure.**
Render each outer group as a bounded unit and its alternatives with a clear `or` between them, so `( A or B ) AND ( C )` cannot collapse into `A or B C`.

- Alternatives rejected: keeping the flat row with different separators (still ambiguous); a textual sentence (less scannable than the icons already used).

**9. Copy pass is textual only, with a canonical unlock format.**
The authored `unlockConditions` strings are normalized to `Invest N AP in STR, AGI, PER` with a fixed stat order (STR, AGI, PER, VIT, WIL) and `Reach level N` capitalization. The tooltip labels and section headings are rendered in uppercase. `unlockConditions` is display-only; the AI prompt consumes `modifiedByLabel` but not these strings, so the prompt output is unaffected.

- Alternatives rejected: leaving ordering inconsistent (the data already mixes orders such as `WIL STR`); restructuring unlock conditions into typed data (out of scope for a copy pass).

**10. Keyboard reachability for overflow content.**
When the card content exceeds the height cap, the scroll region becomes focusable and Escape dismisses the card. Keyboard users otherwise have no way to reach content taller than the cap, since the card is not focusable today.

- Alternatives rejected: scrolling from the trigger with arrow or PageDown keys (larger input-handling surface than needed); accepting the limitation (leaves keyboard users with truncated content).

**11. Height cap is viewport-relative.**
The card caps its height against the viewport rather than a fixed pixel value, so it stays usable on short screens.

- Alternatives rejected: a fixed max-height (fails on short viewports).

## Risks / Trade-offs

- [Swapping body and heading fonts changes text metrics app-wide and can shift layouts] -> The change is two variables plus one link; review the densest surfaces (tooltip, sidenavs, tree selector, panels) and note that rollback is a two-line revert.
- [Always showing metrics adds two low-information rows to most cards] -> Style non-applicable values in a muted way so they read as context rather than noise, and keep the strip compact.
- [A hoverable card can flicker or fight with icon click, focus, and hover-highlight behavior] -> Tune the hide delay, hide immediately when another icon is entered, keep the card offset from the trigger, and restrict pointer capture to the card surface.
- [Only the five core stats have theme colours, so many scaling terms are neutral] -> Intentional; neutral tokens still group visually, and unmapped terms fall back to plain text.
- [Matching stat names from `modifiedByLabel` can miss terms] -> Fall back to plain text for any unmatched term, per the lexicon fallback pattern already used for engine variables.
- [A focusable scroll region inside `role="tooltip"` is unusual for ARIA] -> Keep the trigger association via `aria-describedby` and treat the card as a scrollable region for its overflow only.
- [Touch devices cannot hover] -> Explicitly out of scope; desktop hover is the supported interaction for this change.
- [Normalizing 65 distinct unlock strings could introduce inconsistent phrasing] -> Constrain the pass to ordering, separators, and capitalization, and validate the JSON still parses.

## Migration Plan

1. Update the theme font tokens and utilities, and add the weights to the Google Fonts link. Verify the app builds, headings render uppercase, and body text renders with true lowercase.
2. Rebuild the tooltip template and styles into the card: type chip, metric strip showing all four metrics, classified scaling tokens, grouped Requires, uppercase labels.
3. Add hover retention, neighbour-icon hide, viewport-relative height cap with internal scroll, and the focusable overflow region. Verify long descriptions scroll, the card stays visible over its own surface, and leaves cleanly when another icon is entered.
4. Apply the label and `unlockConditions` copy pass and confirm the JSON parses and tokenization tests still pass.
5. Run lint, build, and the full test suite, then inspect tooltips for attack, passive, stance, and locked abilities.

Rollback is a revert of the theme variables, the index.html link, the tooltip component changes, and the copy pass; no persisted state is affected.

## Open Questions

- The exact stat-name classification set can be refined during implementation if some `modifiedByLabel` terms prove ambiguous.
- The precise width, viewport height fraction, and hide delay are tuning values that can change without altering specs or approach.
- Whether the enriched tooltip (traits, stats, trees, quests) should later adopt the same hoverable treatment is a separate, independent follow-up.
