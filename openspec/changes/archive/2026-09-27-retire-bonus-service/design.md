## Context

See `proposal.md` - Why. All bonus formulas already live as pure functions in `src/app/models/bonus.model.ts` (16 exports). `BonusService` forwards to them and adds one thing: it injects `QuestDataService` and exposes `quests = computed(() => questData.quests.value() ?? [])`. Five consumers depend on it:

- `core/state/build-store.ts` (many methods),
- `features/build/services/ai-prompt.service.ts`,
- `features/build/services/url-share.service.ts`,
- `features/character/components/quests-section/*`,
- `features/character/components/trait-section/*`.

Only `quests-section` uses the `quests` computed directly; the rest use methods that take quest data internally. All formula tests currently live in `bonus.service.spec.ts`; there is no `bonus.model.spec.ts`.

## Goals / Non-Goals

**Goals:**

- Determine, with a small spike, whether `BonusService` earns its layer.
- If it does not, delete it and migrate consumers to pure functions plus `QuestDataService`, preserving every formula test.
- If it does, remove the `as ...Pure` aliases.
- Keep all observable behavior identical.

**Non-Goals:**

- No change to `bonus.model.ts` formulas, `BuildState`, the URL payload, or quest data.
- No new state-management abstraction; signals and the existing store pattern stay.
- Not refactoring the consumers beyond what removing the service requires.

## Decisions

### D1 - Spike first, then decide

Spend a timeboxed spike migrating one consumer end to end (start with `quests-section`, the only `quests` consumer) against the real `QuestDataService`, without deleting `BonusService`. The spike produces a go/no-go based on diff size, test churn, and whether a shared quests accessor is needed. Alternative: commit to removal now and abort later - rejected; the user asked to evaluate first.

### D2 - If removing: consumers inject `QuestDataService` directly

`QuestDataService` lives in `core/data` and has no dependency on `core/state`, so `BuildStore` (in `core/state`) and feature consumers can inject it without forming a cycle. Quest-taking pure functions receive `quests` explicitly, exactly as `BonusService` does today. Alternative: a new `QuestStore` - rejected as a new abstraction for one derived value.

### D3 - If removing: centralize the empty-list fallback

Add `readonly questList = computed(() => this.quests.value() ?? [])` to `QuestDataService` so consumers stop repeating the `?? []` fallback that `BonusService` hid. Alternative: repeat `?? []` at each call site - rejected; it is the one real thing the service provided.

### D4 - If keeping: drop the `as ...Pure` aliases

The aliases do not prevent a real collision (bare identifiers resolve to module imports, not class methods), so import the functions directly. Alternative: a namespace import (`import * as bonus`) preserves visual separation - acceptable fallback if direct names read poorly.

### D5 - Preserve formula tests as pure domain tests

`bonus.service.spec.ts` holds the allocation, stepper, derived-AP, and sanitize cases. On removal, move them to `bonus.model.spec.ts` as pure tests (no TestBed), matching the architecture's pure-domain testing requirement, rather than deleting them. Delete only the tests that exist solely to exercise the service wrapper.

## Risks / Trade-offs

- [Moving tests loses coverage] → move the cases verbatim to `bonus.model.spec.ts` and confirm the count matches before deleting the old spec.
- [`BuildStore` growing a new injected dependency changes its TestBed setup] → `build-store.spec.ts` already provides a `QuestDataService` mock (line ~207), so the wiring exists.
- [Quest fallback duplicated or dropped] → centralize it in `QuestDataService.questList` per D3.
- [The spike grows into an unplanned refactor] → timebox it to the mapping plus one consumer, then decide.

## Migration Plan

1. Document the consumer-to-domain-function mapping and run the spike on `quests-section`.
2. Decide go/no-go and record it in this change.
3. Go: add `QuestDataService.questList`; migrate `build-store`, `ai-prompt.service`, `url-share.service`, `quests-section`, `trait-section`; move tests to `bonus.model.spec.ts`; delete `BonusService` and its spec.
   No-go: keep `BonusService`; remove the `as ...Pure` aliases only.
4. Run `npm run lint`, `ng build`, and `npm test`.

Rollback: revert the commits; `BonusService` is restored intact and no persisted state changes.

## Spike Findings

### Consumer to pure-function mapping (task 1.1)

Every `BonusService` method forwards 1:1 to an existing `@models` pure function; the only added
value is the injected quest list. Verified mapping:

| Consumer            | `BonusService` usage            | Pure replacement                                          | Needs quests |
| ------------------- | ------------------------------- | --------------------------------------------------------- | ------------ |
| `quests-section`    | `quests()`                      | `QuestDataService.questList`                              | yes          |
| `quests-section`    | `slotsForSource(state, id)`     | `bonusSlotsForSource(state, id)`                          | no           |
| `trait-section`     | `traitSpGains(character)`       | `traitSpGains(character)`                                 | no           |
| `trait-section`     | `slotsForSource(state, id)`     | `bonusSlotsForSource(state, id)`                          | no           |
| `build-store`       | `derivedAp(...)`                | `derivedTraitAp(...)`                                     | no           |
| `build-store`       | `derivedFloor(...)`             | `derivedTraitApFloor(...)`                                | no           |
| `build-store`       | `clearTraitSlots(state)`        | `clearTraitSlots(state, id => isQuestSource(quests, id))` | yes          |
| `build-store`       | `allocateSlot(...)`             | `allocateBonusSlot(..., quests)`                          | yes          |
| `build-store`       | `deallocateSlot(...)`           | `deallocateBonusSlot(...)`                                | no           |
| `build-store`       | `addBossRow(...)`               | `addBossRow(..., quests)`                                 | yes          |
| `build-store`       | `removeBossRow(...)`            | `removeBossRow(..., quests)`                              | yes          |
| `build-store`       | `canAddBossRow(...)`            | `canAddBossRow(..., quests)`                              | yes          |
| `build-store`       | `bossRowCount(...)`             | `bossRowCount(..., quests)`                               | yes          |
| `build-store`       | `bonusCount(...)`               | `bonusCount(...)`                                         | no           |
| `ai-prompt.service` | `bonusCount(state, stat)`       | `bonusCount(state, stat)`                                 | no           |
| `ai-prompt.service` | `findQuest(sourceId)`           | `findQuest(quests, sourceId)`                             | yes          |
| `ai-prompt.service` | `findTraitGain(character, id)`  | `findTraitGain(character, id)`                            | no           |
| `url-share.service` | `sanitizeBonusSlots(raw, char)` | `sanitizeBonusSlots(raw, char, quests)`                   | yes          |
| `url-share.service` | `derivedFloor(...)`             | `derivedTraitApFloor(...)`                                | no           |

### Spike result (task 1.2)

Migrating `quests-section` replaced the `BonusService` injection with `QuestDataService` plus
`bonusSlotsForSource`: four lines changed, zero test changes, `quests-section.spec.ts` stayed at
5/5 passing. The component read quests via `questData.quests.value() ?? []`, confirming that the
only shared thing the service hid is the `?? []` fallback.

### Decision (task 1.3): GO - remove `BonusService`

- Diff size: small and purely mechanical (each service method maps 1:1 to a pure function).
- Test churn: only the shared `questList` accessor (task 2.1) changes the `QuestDataService`
  mocks; the spike itself needed none.
- Shared quests accessor: needed by `build-store`, `ai-prompt.service`, `url-share.service`, and
  `quests-section`; centralizing it in `QuestDataService.questList` (D3) is the one real thing the
  service provided, so it moves there rather than being repeated.
- No runtime behavior change. Path 2 (removal) is taken; path 3 (fallback) is not.
