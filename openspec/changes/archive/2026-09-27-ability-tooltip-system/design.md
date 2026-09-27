## Context

See proposal.md - Why for motivation. The relevant current state:

- `Ability.description` is a single flat string (`src/app/models/ability.model.ts`) rendered verbatim at `ability-icon.html:88` and consumed by `ai-prompt.service.ts:153`. It is dual-purpose: display and AI-prompt source. The `data-layer` spec already promises it is "the flattened plain-text form of the structured tooltip template", but no structured template exists.
- Ability tooltips are hand-rolled inside `ability-icon` (cursor-following, body-appended). A separate `appEnrichedTooltip` system exists with a `TooltipContent` union for trait/stat/tree/quest, and its archived design reserved `ability` as a future kind.
- The description corpus (228 abilities) is a small arithmetic language, not prose: ~854 numeric tokens, ~340 multi-term expressions, 44 `math_round(...)` wrappers, nested parentheses, division, and 23 raw engine identifiers such as `max_hp`, `Magic_Power`, `open_weapon_skills`. About 41 descriptions contain an unseparated bonus run after a colon.
- The theme already provides the colour vocabulary the feature needs (`$stat-*`, `$gold-accent`, `$gold-bright`, `$nebelorz-accent`, `$button-red`) in `shared/styles/_variables.scss`; it is not exported to TypeScript.

## Goals / Non-Goals

**Goals:**

- A canonical, human-authorable description format whose parsing logic is trivial.
- A pure tokenizer producing typed nodes, with no arithmetic evaluation.
- Colour semantics derived from the modifier sign, plus golden effect names.
- Structured tooltip rendering (paragraphs and bullet rows).
- The plain-text `description` for the AI prompt preserved.

**Non-Goals:**

- Evaluating or resolving modifiers against the character's stats (deferred; see Decisions).
- Migrating the ability tooltip onto `appEnrichedTooltip` in this change.
- Per-stat colouring inside expressions, or a status/damage-type lexicon (possible follow-ups).

## Decisions

**1. Canonical string format over a pre-structured node array.**
Descriptions stay a single JSON string. Every numeric modifier is delimited `{expression}` with the sign inside, effect names stay quoted, lines are newline-separated, and `- ` marks a bullet.

- Alternatives rejected: a fully structured node array in JSON (verboses ~228 entries and fragments prose, making diffs heavy and prose edits painful, while buying only a trivial render loop); inline markup tags without delimiters (sign/label boundary becomes ambiguous for the ~311 non-percent formula tokens); parsing today's raw prose at runtime (fragile around nested parens, `math_round`, and unseparated bonus runs).

**2. No arithmetic parser for the display path.**
Display only needs to know where a modifier starts, where it ends (the delimiters give this), and its sign (the first character). The tokenizer is brace-splitting plus two regexes.

- Alternatives rejected: a recursive-descent expression parser now (only needed to evaluate, which is deferred); regex-only over raw prose (the field data shows ~340 multi-term expressions must be bounded, and inference is unreliable without delimiters).

**3. Model keeps `description` plain and adds a derived token stream.**
The JSON holds one authored field. `AbilityDataService.parse` derives both the flat `description` (for the existing model contract and the AI prompt) and a token stream (for the tooltip). `flatten()` re-parenthesises `{+a + b}%` back to `+(a + b)%` so the AI prompt reads as it does today.

- Alternatives rejected: store both a markup and a plain field in JSON (duplication and drift); change `ai-prompt.service.ts` to flatten on demand (needlessly moves the concern into the AI path and violates the "description is the prompt source" spec).

**4. Colour semantics live on the node, colour values live in SCSS.**
The tokenizer emits `sign: 'pos' | 'neg' | 'neutral'` and an `effect` node; the component maps these to themed classes. No inline colours, no colour logic in TypeScript.

- Alternatives rejected: emitting CSS custom properties from TS (splits the theme); colouring by category name in TS (duplicates the theme's vocabulary).

**5. Engine-variable lexicon as data with canonical keys.**
Modifier expressions keep canonical keys (`max_hp`, `Magic_Power`). A `Record<string, { label, category }>` maps them to display labels at render time. The same table is the key set a future resolver would need.

- Alternatives rejected: rewriting keys to display labels in the JSON (loses canonical keys for a resolver and forces an inverse map; some keys like `Body_DEF` have no settled display name).

**6. Defer formula resolution through a raw-expression hook.**
Modifier nodes retain the raw expression string. Resolution needs an AST plus an environment the planner does not model (weapon efficiency, Magic Power, Max Health, learned abilities), so it would resolve only part of the text. Deferring keeps the change small; the hook makes it additive later.

- Alternatives rejected: build the AST and evaluator now (large, and produces mixed resolved/raw output given the missing environment); discard the hook entirely (forecloses the feature).

**7. Rendered by a new presentational component, tooltip mechanism unchanged.**
A new `app-ability-description` component renders lines and tokens; `ability-icon.html` swaps its single interpolation for it. The hand-rolled tooltip stays.

- Alternatives rejected: migrate to `appEnrichedTooltip` now (expands scope into overlay rework and an `ability` content kind; orthogonal to the description system).

## Risks / Trade-offs

- [Normalizing 854 tokens across 228 descriptions can introduce malformed delimiters] -> A one-time normalization pass plus a load-time validation requirement (see the `data-layer` delta) and a test that tokenizes the entire shipped `abilities.json`, failing loudly on stray or unbalanced delimiters.
- [Flattened plain text may drift from today's wording, changing the AI prompt] -> `flatten()` reproduces the original parenthesised form; the existing AI prompt spec scenario is kept in the `data-layer` delta and covered by a test.
- [Bullet detection could misclassify prose lines] -> Detection is explicit via the `- ` marker set during normalization, not inferred from a trailing colon.
- [Engine-variable display names are judgment calls] -> Only a small set near the top of the frequency list matters; unresolved names fall back to the raw key, which the lexicon requirement allows.
- [Newly introduced delimiters could confuse future automated tooling reading the raw JSON] -> The canonical format is documented in `ability-description` and validated on load.

## Migration Plan

1. Normalize `abilities.json` in place (delimit modifiers, insert block bullets, unify stat aliases, keep canonical engine keys). Validate the whole file parses.
2. Add the pure model (nodes, tokenizer, flatten, lexicon) with unit tests over the shipped data.
3. Wire `AbilityDataService` to derive plain text plus tokens, add the loader validation, then render through `app-ability-description`.

Rollback is a revert of the JSON and the additive model/service/renderer files; no persisted state is affected.

## Open Questions

- Whether to colour individual stats inside expressions and whether to add a status/damage-type lexicon. Both are additive and do not change the format or tokenizer.
- Whether to migrate the ability tooltip onto `appEnrichedTooltip` later for a single tooltip mechanism. Independent of this change.
