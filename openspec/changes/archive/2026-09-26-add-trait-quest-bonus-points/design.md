# Design: add-trait-quest-bonus-points

## Context

Today the only non-level-up point source is the Boulder Circle quest, hardcoded as `boulderCircleStat: StatKey | null` in `BuildState`. Its mechanics are "cap headroom": the allocation lifts one stat's spending cap to 31 and the point itself is paid from the SP pool. Trait descriptions in `characters.json` are unstructured prose, so trait-granted points (Velmir, Jorgrim, Dirwin, Mahir) are unrepresentable. The left sidenav composes `character-selector`, `level-controls`, `stat-controls`, and `character-info`; the right sidenav hosts `extras-display` (Boulder dropdown + Notes) and the AI prompt/URL sharing consume the state. `state.stats` is read directly by the stats panel (`stat-controls`) and the AI prompt stat summary, so every consumer of displayed stat values must be audited.

Key precedent: route stat spending appends entries to `statHistory` with an implicit "earned at level X" meaning (`getRouteLevelForStat`), and level-down is blocked for any level holding actions. Anything that would pollute `statHistory` corrupts the route display and level-down eligibility.

## Goals / Non-Goals

**Goals:**

- One unified mechanism for all non-level-up point sources (traits + quests), data-driven so future gains need no bespoke state or UI.
- Direct stat grants (model B2): a bonus point adds +1 to the chosen stat immediately, independent of pools, `statHistory`, and the level route.
- Truthful merged display: stat values shown to the user sum base + route + bonus. `state.stats` itself stays route-only (base + `statHistory`).
- Trait-derived AP extends the ability budget automatically, with a total budget that never goes negative, including across character switches and URL restores.
- Legacy shared URLs keep working via migration.

**Non-Goals:**

- Route-display annotation of bonus slots (deferred follow-up; state shape already supports it).
- Generic character-rule engine for arbitrary trait effects (damage %, experience, morale, etc.) - only point grants are modeled.
- Modeling non-point trait effects (Leosthenes' health/energy, Hilda's thresholds) as state.
- Backfilling game-accuracy validation of how many milestones a player actually achieved - slots are freely settable (no gating, user decision).

## Decisions

### D1: Free direct grant (B2) over cap-headroom (B1)

An allocated bonus slot adds +1 directly to the displayed stat value; SP/AP pools, `statHistory`, and route caps are untouched. Rationale: trait/quest points are _grants_ in the game, not spending headroom, and pool injection would pollute `statHistory` (a pooled point spent via route buttons would be recorded as if earned at a route level). Boulder Circle's existing cap-raise behavior is removed as part of unification. Alternative considered (B1, generalize Boulder's headroom mechanic): smaller diff, but it keeps a mechanic the game does not actually have and blocks the later route annotation goal.

### D2: Slots, not progress counters

Each gain source is a fixed list of point slots (Jorgrim: 5, Dirwin: 3, Boulder: 1). Velmir (2 SP per boss, unbounded) gets a stepper that appends slot rows in pairs, with a practical ceiling of 10 bosses (20 points). No `traitProgress` map in state: the slot entries themselves are the progress record, and skipping slots is allowed (planner freedom). Alternative considered (declared counters gating availability): more state, more validation, no accuracy payoff since the builder cannot verify in-game progress anyway.

### D3: Derived AP stays derived

Dirwin's "+1 AP per 3 learned Survival abilities" and Mahir's "+1 AP per tree with 6+ abilities (max 5)" are computed from `obtainedAbilities` at read time - no state, no allocation UI. Default abilities (`DEFAULT_ABILITY_IDS`) never count toward these formulas, matching the store's treatment of starting abilities. Derived AP extends the ability budget.

### D4: Ability budget - derived AP extends the level pool

The ability budget is fungible: level AP + derived trait AP. `ap` in `BuildState` keeps its current meaning (unspent level AP) but MAY go negative, down to `0 - derivedTraitAp`, when the user spends derived points. Obtainability checks use the computed `totalAp = ap + derivedTraitAp` (spending allowed iff `totalAp > 0`). Refunds simply increment `ap` (per-tree reset's `ap + removedCount` works unchanged), and derived AP recomputes from `obtainedAbilities`, so refunds shrink the budget automatically.

**Character switch preserves the total budget exactly.** `selectCharacter` keeps `obtainedAbilities` today, and derived income is character-specific, so the switch rule is: `ap_new = (ap_old + oldDerived) - newDerived`. Consequences:

- Switching Dirwin (ap -1, derived 1, total 0) to Arna (derived 0) yields ap 0, total 0 - no broken negative budget.
- Switching back to Dirwin yields ap -1 again - a Dirwin -> Arna -> Dirwin round trip grants no free AP (a "forgive the debt on switch" rule would leak +1 AP per round trip).
- The total never goes below zero, because `ap_new = total - newDerived` and `newDerived >= 0` implies `ap_new >= -newDerived`.

**URL restore normalization:** if a payload's `ap` is below `0 - derived(characterId, obtainedAbilities)`, clamp `ap` up to that floor instead of rejecting the payload.

The UI shows `ap + derivedTraitAp` with a breakdown badge in the AP bar (see the resource-display delta); the bar's ratio stays anchored to the 31-point level budget.

### D5: Route-only stats in state, merge only at display

`state.stats` keeps its current meaning: base + `statHistory` increments (route). Bonus slot increments are computed from `bonusSlots` and added only where values are displayed (stat-controls rows, AI prompt stat summary). Consequences:

- The stat-store diff shrinks to deleting the Boulder cap special case. Route increment cap stays literally `state.stats[stat] < MAX_STAT` (30).
- Route decrement keeps its current floor (base value) and removes a `statHistory` entry; it can never consume a bonus point because bonus points are not in `state.stats` at all.
- `deriveStats` is unchanged.
- Displayed value = `state.stats[stat] + bonusCount(stat)`, where `bonusCount(stat)` counts allocated slots on that stat.

Trap avoided: had bonuses been folded into `state.stats`, every cap/floor check would need route-only math (merged minus bonusCount). Example: route 28 + bonus 2 would merge to 30 and wrongly block route +1; a -5 decrement would compute from the merged value and could eat bonus points. Keeping `state.stats` route-only makes those checks immune. Audit every `state.stats` reader during implementation; the known display consumers are `stat-controls` and `ai-prompt.service`.

### D6: Data model for gains

```jsonc
// characters.json, per character (prose trait description stays for tooltips)
"traitGains": [
  { "id": "trophies", "resource": "sp", "label": "Trophies delivered",
    "pointsPer": 1, "max": 5 },
  { "id": "dens", "resource": "sp", "label": "Dens/caves cleared",
    "pointsPer": 1, "max": 3 },
  { "id": "survival", "resource": "ap", "formula": "abilities-per-3",
    "treeId": "survival", "label": "Survival abilities learned" }
]
```

- `resource: "sp"` entries render `max` slots (or stepper rows when `max` is absent; Velmir's bosses entry uses `pointsPer: 2` per slot-row group).
- `resource: "ap"` entries reference a named formula implemented in one small service (`abilities-per-3`, `distinct-trees-6`) - not a rule engine, a closed enum of formulas.
- Quests live in a new `src/assets/data/quests.json` (`boulder-circle` first entry: 1 SP slot, label, tooltip text), so the Quests section is config-driven.

`BuildState` change: remove `boulderCircleStat`, add `bonusSlots: readonly BonusSlot[]` with `BonusSlot = { sourceId: string; index: number; stat: StatKey | null }`.

- Bounded sources (Jorgrim, Dirwin, Boulder, future quests with fixed rewards) render their rows from config and keep entries only while allocated; unallocated = absent.
- Unbounded sources (Velmir) persist claimed rows as entries with `stat: null`: allocating sets the stat, clearing via the dropdown sets `stat: null` again (row kept), removing a row via the stepper deletes its entries (allocated or not). This is what makes stepper progress survive reload and URL share/restore.
- `bonusCount(stat) = bonusSlots.filter((s) => s.stat === stat).length` (null-stat entries never count).

### D7: Component architecture

- `feature/character/components/trait-section/` - reads character + traitGains, renders trait name, enriched tooltip (existing `EnrichedTooltipDirective`), SP slot rows (with Velmir stepper), derived AP badge; characters without gains reduce to name + description row.
- `feature/character/components/quests-section/` - reads quest config, renders one slot row per quest.
- Shared `point-slot-row` subcomponent (custom dropdown with colored stat chips, outside-click close, keyboard/ARIA per D10) reused by both; behavior migrated from `extras-display`.
- `character-panel.html` order: selector, level-controls, trait-section, stat-controls, quests-section, character-info.
- `stat-controls` displays `state.stats[stat] + bonusCount(stat)` with a small bonus marker per stat row sourced from `bonusSlots`.
- `extras-display` loses the Boulder row and question icon; header renamed "Notes".

### D8: URL sharing migration and validation

Bump the payload shape and add a deserialization migration: a legacy `boulderCircleStat: <StatKey>` becomes `{ sourceId: 'boulder-circle', index: 0, stat: <StatKey> }`; `null`/missing yields no slot.

`bonusSlots` validation rules on restore (drop rather than fail the whole payload, unless noted):

- `bonusSlots` present but not an array -> the payload is invalid (consistent with how malformed `notes` invalidates the payload). Missing -> treated as empty.
- Each entry must be an object with a string `sourceId`, an integer `index >= 0`, and a `stat` that is a valid `StatKey` or `null`; malformed entries are dropped.
- `sourceId` must exist in the restored character's traitGains or in the quest config; unknown sources are dropped. Trait sources that do not belong to the payload's `characterId` are dropped.
- Bounded sources: entries with `index >= max` are dropped. Unbounded sources: entries with `index >= 20` (10-boss ceiling) are dropped.
- Duplicate `(sourceId, index)` pairs: the first entry is kept, the rest are dropped.
- `ap` below `0 - derived(characterId, obtainedAbilities)` is clamped up to that floor (see D4).

### D9: AI prompt rendering

The prompt lists bonus allocations grouped by source (e.g., "Bonus: Boulder Circle +1 STR; Trait - Trophies: +1 VIT"), separate from the level route listing, so downstream readers can distinguish route points from grants. The stat summary line uses merged values (`state.stats + bonusCount`).

### D10: Point-slot-row accessibility

The extracted `point-slot-row` dropdown follows the existing selector dropdown pattern from the ui-accessibility capability: toggle with `aria-haspopup="listbox"` and `aria-expanded` reflecting open state, arrow-key navigation via ActiveDescendantKeyManager, Enter selects, Escape closes and returns focus to the toggle, and options announced with a single option role. Stepper add/remove controls get descriptive aria-labels.

## Risks / Trade-offs

- [Shared URLs in the wild break] -> Migration path in D8 plus regression tests replicating legacy payloads; unknown sources and malformed entries dropped gracefully.
- [Sidenav vertical space grows (selector, level, trait, stats, quests, trees)] -> Trait section for no-gain characters is a single slim row; slots render compactly; acceptable for the MVP, revisit collapse behavior if it overflows.
- [Behavior change for Boulder users: the +1 now lands immediately instead of costing SP with cap lift] -> Called out in proposal as BREAKING; the merged display makes the new semantics visible; migration maps old links to the new model.
- [A `state.stats` consumer shows unmerged values] -> Audit all readers (stat-controls, ai-prompt are the known ones); component and service tests assert merged display values.
- [Derived AP negative `ap` leaks into route/level math] -> Route and level math never branch on `ap`'s sign for their own logic; unit tests cover level-down and per-tree reset with negative `ap`, the character-switch round trip (Dirwin -> Arna -> Dirwin preserves total), and the restore clamp.
- [Velmir stepper lets users claim unbounded SP] -> Practical ceiling of 10 bosses (20 points); no gating by design (user decision).

## Migration Plan

1. Ship model + data changes with deserialization migration (D8) behind the existing URL import flow - no server, no feature flag needed.
2. Old payloads restore with the Boulder allocation preserved as a slot; new payloads serialize `bonusSlots`.
3. Rollback is a plain revert; payloads remain valid because loading tolerates a missing `bonusSlots` and ignores unknown fields.

## Open Questions

None blocking. (Deferred to follow-up: route-display annotation of bonus slots.)
