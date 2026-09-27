## Why

Ability tooltips render one flat `description` string with no structure or colour. Formulas, buffs, and debuffs blur together, stance/activation bonus runs read as a wall of text, and raw engine identifiers (`math_round`, `max_hp`, `Magic_Power`) leak into user-facing copy. The same string is the AI-prompt source, so it cannot simply be reformatted for display. The `data-layer` spec already promises a structured tooltip template behind the flattened description, but that template does not exist yet.

## What Changes

- Normalize `abilities.json` descriptions into a canonical, human-readable form: every numeric modifier wrapped as `{expression}` with its sign inside, effect names kept quoted, and block bonus runs split into newline-separated `- ` bullet lines.
- Introduce a pure description tokenizer in the models layer that turns the canonical string into typed nodes: text, modifier (with sign), and effect name.
- Add colour semantics driven by the modifier's leading sign, not by evaluation: positive buff, negative debuff, unsigned variable, and golden effect names.
- Render ability descriptions through a new presentational component: paragraphs plus bullet rows, with formulas styled and colour-coded.
- Add an engine-variable lexicon mapping raw keys (`max_hp`, `Magic_Power`, `open_weapon_skills`, and similar) to display labels, reused later by the formula resolver.
- Derive the existing plain-text `description` from the canonical source at load, so the AI-prompt path consumes the same clean plain text it does today.
- Non-goal: evaluating or resolving formulas with the character's current stats. The modifier node keeps the raw expression so a resolver can be added later without redesign.

## Capabilities

### New Capabilities

- `ability-description`: the canonical ability-description format, its tokenizer, the typed node model, the colour semantics, and the engine-variable lexicon.

### Modified Capabilities

- `data-layer`: the ability description model now distinguishes the canonical source string, the derived plain-text description, and the derived token stream.
- `ui-popover-tooltip`: the ability tooltip renders structured, colour-coded descriptions (paragraphs and bullet blocks) instead of a single flat text node.

## Impact

- Data: `src/assets/data/abilities.json` (all 228 descriptions normalized to the canonical format).
- Models: `src/app/models/ability.model.ts`, `src/app/models/data-guards.ts`, plus new description node model, tokenizer, and lexicon in the models layer.
- Core data: `src/app/core/data/ability-data.service.ts` derives the plain description and token stream on parse.
- Feature UI: `src/app/features/ability-trees/components/ability-icon/` renders descriptions through a new `app-ability-description` component; new component styles for colour semantics.
- Untouched: `ai-prompt.service.ts` behavior (still consumes the plain `description`), and the ability tree layout/interaction.
- Later (deferred): formula resolver plus a "resolve with current stats" toggle, hooked through the raw expression kept on modifier nodes.
