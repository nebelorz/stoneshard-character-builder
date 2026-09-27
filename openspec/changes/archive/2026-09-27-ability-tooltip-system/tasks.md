## 1. Normalize the ability description corpus

- [x] 1.1 Wrap every numeric modifier in `abilities.json` in `{expression}` with its sign inside (for example `{+15 + 2 * AGL}%`), and verify a parser soak test over all 228 descriptions reports zero unclosed or unbalanced delimiters
- [x] 1.2 Convert bonus runs after a colon (the `Activates "..." for N turns:` and `grants:` patterns) into newline-separated `- ` bullet lines, and verify those descriptions tokenize into bullet lines
- [x] 1.3 Unify stat aliases (`Vitality` to `VIT`, `HP` to `Health`) while keeping engine keys canonical, and verify the corpus contains no remaining alias occurrences
- [x] 1.4 Leave non-modifier numbers (durations, tile counts, levels, stack counts) as literal text, and verify the tokenizer reports no formula node for them

## 2. Description model and tokenizer

- [x] 2.1 Add the `DescriptionNode` (text, modifier with sign, effect) and `DescriptionLine` (paragraph, bullet) types plus the engine-variable display lexicon in the models layer and export them from the barrel, and verify the project typecheck passes
- [x] 2.2 Implement the pure `tokenizeDescription` and `flattenDescription` functions, and verify unit tests cover text/modifier/effect nodes, bullet versus paragraph lines, sign classification, flatten re-parenthesisation (`{+a + b}%` to `+(a + b)%`), and unknown-key fallback
- [x] 2.3 Add a fixture test that tokenizes the shipped `abilities.json`, and verify every description yields at least one line with no formatting errors

## 3. Load pipeline and model contract

- [x] 3.1 Add the derived token field to the `Ability` model and update the data guards, and verify the guard spec accepts valid abilities and rejects malformed shapes
- [x] 3.2 Derive both the plain `description` and the token stream in `AbilityDataService.parse` and reject non-conforming canonical descriptions, and verify the data service spec covers a valid parse and a rejected malformed description
- [x] 3.3 Confirm `ai-prompt.service.ts` still consumes the derived plain `description` unchanged, and verify its existing spec passes

## 4. Structured tooltip rendering

- [x] 4.1 Create the `app-ability-description` presentational component that renders lines as paragraphs or bullet rows and nodes as spans, and verify its spec asserts the rendered structure and token classes
- [x] 4.2 Add themed colour classes for positive, negative, neutral modifiers and effect names, and verify the component spec asserts the correct class per classification
- [x] 4.3 Replace the flat `{{ ability().description }}` interpolation in `ability-icon.html` with the component, and verify the ability icon spec still passes

## 5. Verification

- [x] 5.1 Run lint, build, and the full test suite, and verify all pass with the normalized data
- [x] 5.2 Manually inspect a sample of tooltips covering formulas, a bullet block, effect names, and both modifier signs, and verify the descriptions read as organized, colour-coded text
